import { validateState } from './game.js';

// Optional cloud save, kept on a small worker under a sync code. Anyone who
// knows the code can read or replace that save, so the code is the key: a
// random one is made on first run and shown in Settings, and typing it on
// another device brings the courtyard along.
// The browser save (localStorage, see app.js) is always the source of truth.
// Any network or worker problem quietly drops back to local-only; nothing here
// is allowed to break the game. The cloud copy is pulled on open /
// return-to-tab and pushed a few seconds after real changes.

const APP = 'a-minister-in-your-sleeve';
const ENDPOINT = 'https://minister-sleeve-saves.alex-c-hartke.workers.dev/save/';
const META_KEY = 'sleeve-and-lantern.cloud';
const CODE_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789'; // no 0/o, 1/l/i
const TIMEOUT = 8000;

export const validCode = c => typeof c === 'string' && /^[A-Za-z0-9-]{6,64}$/.test(c);
function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return 'sleeve-' + Array.from(bytes, b => CODE_CHARS[b % CODE_CHARS.length]).join('');
}

// Need decay and the last-seen clock change constantly without the player
// doing anything; leave them out when deciding whether progress changed.
export function fingerprint(s) { const { lastSeen, needs, ...rest } = s; return JSON.stringify(rest); }
const looksFresh = s => s.bond === 0 && s.day === 1 && !s.memories.name;
const summary = s => ({ day: s.day, bond: s.bond });

function readMeta() { try { return JSON.parse(localStorage.getItem(META_KEY)) || {}; } catch { return {}; } }

// Resolves to the save blob, null when the code has no save, and throws on
// any network or worker trouble (including a reply that isn't a courtyard).
async function fetchSave(code) {
  const res = await fetch(ENDPOINT + encodeURIComponent(code), { cache: 'no-store', signal: AbortSignal.timeout(TIMEOUT) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('worker ' + res.status);
  const d = await res.json();
  if (d?.app !== APP || !Number.isFinite(d.savedAt)) throw new Error('not a courtyard save');
  return { savedAt: d.savedAt, state: validateState(d.state) };
}

export function createCloudSync({ getState, adopt, canAdopt, onStatus, askConflict }) {
  const meta = readMeta();
  meta.device ||= Math.random().toString(36).slice(2, 10);
  if (!validCode(meta.code)) meta.code = newCode();
  // meta.at: when progress last really changed on this device (the local savedAt).
  // meta.syncedAt: the cloud copy's savedAt when this device last matched it.
  const writeMeta = () => { try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch {} };
  // First run, or the save was wiped while the code stayed: nothing here is
  // newer than the cloud, so a fresh courtyard counts as never changed.
  const start = getState(), startFp = fingerprint(start);
  if (meta.fp === undefined || (startFp !== meta.fp && looksFresh(start))) {
    meta.fp = startFp; meta.at = looksFresh(start) ? 0 : Date.now(); meta.syncedAt = undefined;
  }
  writeMeta();

  let ready = false, timer = null, writing = false, again = false, pulling = false, deferred = false;
  const dirty = () => (meta.at || 0) !== (meta.syncedAt || 0);

  function noteChange() {
    const fp = fingerprint(getState());
    if (fp !== meta.fp) { meta.fp = fp; meta.at = Date.now(); writeMeta(); }
  }
  function matched(savedAt) { meta.fp = fingerprint(getState()); meta.at = meta.syncedAt = savedAt; writeMeta(); }

  async function init() { onStatus('connecting'); await pull(); }

  async function pull() {
    try { await pullOnce(); }
    catch { ready = false; pulling = false; onStatus('offline'); } // never let a sync problem break the game
  }

  async function pullOnce() {
    if (pulling) return;
    if (!canAdopt()) { deferred = true; return; }
    pulling = true; deferred = false; onStatus('syncing');
    try {
      let remote;
      try { remote = await fetchSave(meta.code); }
      catch { onStatus('offline'); return; } // unreachable, or a copy this version can't read: leave it be
      ready = true;
      noteChange();
      if (!remote) { await push(); return; }
      if (remote.savedAt === meta.syncedAt) { if (dirty()) await push(); else onStatus('synced'); return; } // nobody else wrote since
      if (remote.savedAt <= (meta.at || 0)) { await push(); return; } // this device is newer

      // The cloud copy is newer. Take it, unless this device also has
      // progress the cloud never saw; then let the player choose.
      const local = getState();
      if (fingerprint(remote.state) === fingerprint(local)) { matched(remote.savedAt); onStatus('synced'); return; }
      if (meta.at !== undefined && dirty() && !looksFresh(local)) {
        const choice = await askConflict(summary(local), summary(remote.state), remote.savedAt);
        if (!choice) { ready = false; onStatus('waiting'); return; } // dismissed: ask again next time
        if (choice === 'local') { await push(); return; }
      }
      if (!canAdopt()) { deferred = true; return; }
      take(remote);
    } finally { pulling = false; }
  }

  function take(remote) {
    adopt(remote.state); // saves locally, which calls changed(); matched() below settles it
    matched(remote.savedAt); clearTimeout(timer);
    // rollDay/elapsedCare may have moved things on since that save; send that back up.
    if (fingerprint(getState()) !== fingerprint(remote.state)) { meta.at = Date.now(); writeMeta(); schedule(); }
    onStatus('restored');
  }

  async function push() {
    if (!ready) return;
    clearTimeout(timer);
    if (writing) { again = true; return; }
    writing = true; onStatus('syncing');
    if (!meta.at) { meta.at = Date.now(); writeMeta(); }
    const code = meta.code, s = getState(), savedAt = meta.at;
    const body = JSON.stringify({ app: APP, schema: s.schema, savedAt, device: meta.device, day: s.day, bond: s.bond, state: s });
    try {
      const res = await fetch(ENDPOINT + encodeURIComponent(code), {
        method: 'PUT', headers: { 'content-type': 'application/json' }, body,
        signal: AbortSignal.timeout(TIMEOUT), keepalive: body.length < 60000 // lets a push finish as the tab closes
      });
      if (!res.ok) throw new Error('worker ' + res.status);
      if (code === meta.code) { meta.syncedAt = savedAt; writeMeta(); } // a change made meanwhile stays dirty
      onStatus(dirty() ? 'syncing' : 'synced');
    } catch { onStatus('offline'); }
    writing = false;
    if (again || dirty()) { again = false; if (dirty()) schedule(); }
  }

  function schedule() { clearTimeout(timer); timer = setTimeout(() => { if (dirty()) push(); }, 2500); }

  return {
    init,
    pull,
    get code() { return meta.code; },
    /** Call after every local save; writes a few seconds after the last real change. */
    changed() { noteChange(); if (ready && dirty()) schedule(); },
    /** Write now if anything is waiting (leaving the tab). */
    flush() { if (ready && dirty()) push(); },
    /** A pull was postponed during a story scene; try it now. */
    resume() { if (deferred) pull(); },
    /**
     * Switch to another sync code. Resolves to 'adopted' (its save replaced
     * this one), 'claimed' (it was empty; this courtyard now saves there),
     * 'kept' (the player said no), 'same', or throws when the cloud can't be reached.
     */
    async useCode(code, confirmReplace) {
      code = code.trim();
      if (!validCode(code)) throw new Error('invalid');
      if (code === meta.code) return 'same';
      const remote = await fetchSave(code);
      if (remote && !confirmReplace(summary(remote.state))) return 'kept';
      clearTimeout(timer);
      meta.code = code; ready = true; writeMeta();
      if (remote) { take(remote); return 'adopted'; }
      meta.syncedAt = undefined; writeMeta(); await push();
      return 'claimed';
    }
  };
}
