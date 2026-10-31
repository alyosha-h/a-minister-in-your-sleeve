// Builds dark.css from style.css: every colour on the app's own surfaces is flipped in lightness
// (paper becomes ink, ink becomes paper) while keeping its hue, and mid-tone accents stay close to
// themselves. Rules painted over the courtyard art, and all shadows, are left alone.
// Rerun after changing colours in style.css:  node tools/dark-theme.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const css = readFileSync(new URL('style.css', root), 'utf8');

// anything drawn on top of the illustrated scene keeps its colours
const OVER_ART = /scene-(art|shade|caption|topline)|caption-rule|rain-effect|data-period|story-art|chapter-cover|cover-mark|held-scene|held-minister|character|sprite|room-object|paper-clutter|\.keepsake(?![-\w])|pet-hint|ribbon-tie|outfit-character|outfit-flower|outfit-dot|dot-|request-shortcut|game-result-icon/;
const COLOUR_PROPS = /^(--[\w-]+|background(-color|-image)?|color|border(-[\w-]+)?|outline(-color)?|fill|stroke|caret-color|accent-color|text-decoration-color)$/;

function toHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > .5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}
function fromHsl(h, s, l) {
  const f = n => { const k = (n + h * 12) % 12, a = s * Math.min(l, 1 - l); return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
  return [f(0), f(8), f(4)];
}
// light surfaces become a deep plum night (the warm creams would otherwise turn muddy brown);
// dark ink goes pale; accents lift a touch
const PLUM = 270 / 360;
function flip([r, g, b]) {
  let [h, s, l] = toHsl(r, g, b);
  if (l > .72) { l = .11 + (1 - l) * .7; h = PLUM; s = Math.min(.22, .1 + s * .15); }
  else if (l < .38) { l = 1 - l * .75; s *= .8; }
  else l = Math.min(.82, l + .1);
  return fromHsl(h, s, l);
}
const hex = n => n.toString(16).padStart(2, '0');
function swapColours(value) {
  return value
    .replace(/#([0-9a-f]{3,8})\b/gi, (m, h) => {
      if (![3, 4, 6, 8].includes(h.length)) return m;
      const full = h.length <= 4 ? [...h].map(c => c + c).join('') : h;
      const [r, g, b] = flip([0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16)));
      return '#' + hex(r) + hex(g) + hex(b) + (full.length === 8 ? full.slice(6) : '');
    })
    .replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(\s*,\s*[\d.]+)?\)/g, (m, r, g, b, a) => {
      const [nr, ng, nb] = flip([+r, +g, +b]);
      return a ? `rgba(${nr},${ng},${nb}${a})` : `rgb(${nr},${ng},${nb})`;
    });
}
const scope = sel => sel.split(',').map(s => s.trim()).map(s =>
  s.startsWith(':root') ? ':root[data-theme=dark]' + s.slice(5)
  : s.startsWith('html') ? 'html[data-theme=dark]' + s.slice(4)
  : ':root[data-theme=dark] ' + s).join(',');

// walk the stylesheet one block at a time, descending into @media and skipping keyframes/fonts
function transform(text) {
  let out = '', i = 0;
  while (i < text.length) {
    const open = text.indexOf('{', i);
    if (open < 0) break;
    const head = text.slice(i, open).replace(/\/\*[\s\S]*?\*\//g, '').trim();
    let depth = 1, j = open + 1;
    while (depth && j < text.length) { if (text[j] === '{') depth++; else if (text[j] === '}') depth--; j++; }
    const body = text.slice(open + 1, j - 1);
    i = j;
    if (head.startsWith('@media') || head.startsWith('@supports')) { const inner = transform(body); if (inner) out += head + '{' + inner + '}\n'; continue; }
    if (head.startsWith('@') || OVER_ART.test(head)) continue;
    const decls = body.split(';').map(d => d.trim()).filter(Boolean).flatMap(d => {
      const k = d.indexOf(':'), prop = d.slice(0, k).trim(), val = d.slice(k + 1);
      if (prop === 'color-scheme') return ['color-scheme:dark'];
      if (!COLOUR_PROPS.test(prop) || prop === '--serif' || prop === '--sans') return [];
      const swapped = swapColours(val);
      return swapped === val ? [] : [prop + ':' + swapped];
    });
    if (decls.length) out += scope(head) + '{' + decls.join(';') + '}\n';
  }
  return out;
}

// hand adjustments where a straight flip reads wrong; these load last
const MANUAL = `
/* selected tabs should look lifted, not pressed in */
:root[data-theme=dark] .segmented button[aria-pressed=true]{background:#40364b;color:#efe5f3}
:root[data-theme=dark] .app-tabs button[aria-selected=true]{background:#3a3144b0;color:#e8dcef}
/* empty meter tracks need to stay visible against the dark */
:root[data-theme=dark] .need-track{background:#463d50}
/* a soft lavender glow so his black hat doesn't vanish into the dark */
:root[data-theme=dark] .outfit-stage{background:radial-gradient(ellipse at 50% 60%,#5e5070 5%,#2d2634 72%)}
`;
const header = '/* dark theme, generated from style.css by tools/dark-theme.mjs. do not edit by hand:\n   rerun the script after changing colours, and put hand adjustments in its MANUAL block. */\n';
writeFileSync(new URL('dark.css', root), header + transform(css) + MANUAL);
console.log('dark.css written');
