import { validateState } from './game.js';

// Optional cloud save: one private document per signed-in viewer, under the
// Claude artifact platform's per-user subtree (data/users/<id>/...), which
// nobody else — the artifact's owner included — can read or write.
// The browser save (localStorage, see app.js) is always the source of truth.
// Outside that platform (no window.claude.use) this whole module is inert:
// it reports 'local' once and every method becomes a no-op. Any unexpected
// platform error also drops back to local rather than surfacing to the page.
// When running, the cloud copy is pulled on open / return-to-tab and pushed
// shortly after real changes.

const APP = 'a-minister-in-your-sleeve';
const META_KEY = 'sleeve-and-lantern.cloud';

// Need decay and the last-seen clock change constantly without the player
// doing anything; leave them out when deciding whether progress changed.
export function fingerprint(s) { const { lastSeen, needs, ...rest } = s; return JSON.stringify(rest); }
const looksFresh = s => s.bond === 0 && s.day === 1 && !s.memories.name;
const summary = s => ({ day: s.day, bond: s.bond });

function readMeta() { try { return JSON.parse(localStorage.getItem(META_KEY)) || {}; } catch { return {}; } }

export function createCloudSync({ getState, adopt, canAdopt, onStatus, askConflict }) {
  const meta = readMeta();
  meta.device ||= Math.random().toString(36).slice(2, 10);
  const writeMeta = () => { try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch {} };
  writeMeta();

  let doc = null, ready = false, timer = null, writing = false, again = false, pulling = false, deferred = false;
  const dirty = () => fingerprint(getState()) !== meta.fp;

  async function init() {
    if (typeof window.claude?.use !== 'function') { onStatus('local'); return; }
    onStatus('connecting');
    try {
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      const id = await user?.id?.();
      if (!id || typeof db?.doc !== 'function') throw 0;
      doc = db.doc('data/users/' + id + '/courtyard');
    } catch { doc = null; onStatus('local'); return; }
    await pull();
  }

  async function pull() {
    try { await pullOnce(); }
    catch { ready = false; pulling = false; onStatus('offline'); } // never let a sync problem break the game
  }

  async function pullOnce() {
    if (!doc || pulling) return;
    if (!canAdopt()) { deferred = true; return; }
    pulling = true; deferred = false; onStatus('syncing');
    try {
      let snap;
      try { snap = await doc.get(); } catch (e) { onStatus(e?.code === 'not_granted' || e?.code === 'revoked' ? 'local' : 'offline'); return; }
      ready = true;
      if (!snap.exists) { await push(); return; }
      const d = snap.data();
      let remote;
      try { if (d.app !== APP) throw 0; remote = validateState(JSON.parse(d.state)); }
      catch { await push(); return; } // unreadable cloud copy: replace it with this device's

      const local = getState();
      if (fingerprint(remote) === fingerprint(local)) { meta.syncedAt = d.savedAt; meta.fp = fingerprint(local); writeMeta(); onStatus('synced'); return; }
      if (d.savedAt === meta.syncedAt) { if (dirty()) await push(); else onStatus('synced'); return; } // nobody else wrote since

      // Another device saved since this one last synced.
      let choice = 'cloud';
      const neverSynced = meta.fp === undefined;
      if ((neverSynced && !looksFresh(local)) || (!neverSynced && dirty())) {
        choice = await askConflict(summary(local), summary(remote), d.savedAt);
        if (!choice) { ready = false; onStatus('waiting'); return; } // dismissed: ask again next time
      }
      if (choice === 'cloud') {
        if (!canAdopt()) { deferred = true; return; }
        const adopted = adopt(remote);
        meta.syncedAt = d.savedAt; meta.fp = fingerprint(adopted); writeMeta(); onStatus('restored');
      } else await push();
    } finally { pulling = false; }
  }

  async function push() {
    if (!doc || !ready) return;
    clearTimeout(timer);
    if (writing) { again = true; return; }
    writing = true; onStatus('syncing');
    const s = getState(), fp = fingerprint(s), savedAt = Date.now();
    try {
      await doc.set({ app: APP, schema: s.schema, savedAt, device: meta.device, day: s.day, bond: s.bond, state: JSON.stringify(s) });
      meta.syncedAt = savedAt; meta.fp = fp; writeMeta(); onStatus('synced');
    } catch (e) {
      if (e?.code === 'invalid_argument' || e?.code === 'not_granted' || e?.code === 'revoked') { ready = false; onStatus('local'); }
      else onStatus(e?.code === 'quota_exceeded' ? 'full' : 'offline');
    }
    writing = false;
    if (again) { again = false; if (dirty()) push(); }
  }

  return {
    init,
    pull,
    /** Call after every local save; writes a few seconds after the last real change. */
    changed() { if (ready && dirty()) { clearTimeout(timer); timer = setTimeout(() => { if (dirty()) push(); }, 2500); } },
    /** Write now if anything is waiting (leaving the tab). */
    flush() { if (ready && dirty()) push(); },
    /** A pull was postponed during a story scene; try it now. */
    resume() { if (deferred) pull(); },
    get active() { return Boolean(doc); }
  };
}
