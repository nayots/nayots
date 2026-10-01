// Shared vocabulary for every image on the profile: one navy sky, three star
// classes, Space Grotesk embedded as data URIs. GitHub shows these SVGs through
// <img>, so nothing here may run script or load anything external.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
export const root = join(here, "..", "..");

// Locked nayots palette (nayots_branding/brand/tokens/tokens.json). Nothing else.
export const C = {
  navy: "#04060D",
  ice: "#F1F5FF",
  iceAccent: "#99D1FF",
  gold: "#FFBD57",
  starTone: "#AAD7FF",
  goldHi: "#FFCD78",
  nebula: "#141C3A",
  stop1: "#0A0F21",
  stop2: "#05070F",
  stop3: "#030509",
};

// Every plate shares one width so the README column reads as one sky.
export const W = 840;
export const RADIUS = 20;

const metrics = JSON.parse(readFileSync(join(root, "scripts/fonts/metrics.json"), "utf8"));
const TRACKING = -0.035;

// Advance width of a run of text, including the brand tracking.
export function measure(text, size, weight = 700, tracking = TRACKING) {
  const table = metrics[String(weight)];
  let units = 0;
  for (const ch of text) units += table[ch] ?? 0.55;
  return units * size + tracking * size * [...text].length;
}

// Greedy line wrap against a pixel measure.
export function wrap(text, size, weight, maxWidth, tracking = 0) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next, size, weight, tracking) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function fontFaces(weights = [500, 700]) {
  return weights
    .map((w) => {
      const b64 = readFileSync(join(root, `scripts/fonts/SpaceGrotesk-${w}.woff2`)).toString("base64");
      return `@font-face{font-family:'Space Grotesk';font-weight:${w};src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
    })
    .join("");
}

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const r1 = (n) => Math.round(n * 10) / 10;
export const r2 = (n) => Math.round(n * 100) / 100;

// Deterministic randomness: the same seed always draws the same sky, so a
// regenerated file only changes when its data does.
export function rng(seed) {
  let a = typeof seed === "number" ? seed : hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash(str) {
  let h = 2166136261;
  for (const ch of String(str)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Four-point star with the keystone's own proportions: the monogram's carved
// star has its control points at 0.306 of the radius.
export function glintPath(x, y, r) {
  const k = r * 0.306;
  return (
    `M${r2(x)} ${r2(y - r)}Q${r2(x + k)} ${r2(y - k)} ${r2(x + r)} ${r2(y)}` +
    `Q${r2(x + k)} ${r2(y + k)} ${r2(x)} ${r2(y + r)}` +
    `Q${r2(x - k)} ${r2(y + k)} ${r2(x - r)} ${r2(y)}` +
    `Q${r2(x - k)} ${r2(y - k)} ${r2(x)} ${r2(y - r)}Z`
  );
}

// A glint: soft halo, four-point body, hot core. `cls` drives its pulse.
export function glint(x, y, r, { color = C.goldHi, halo = "ny-halo-gold", cls = "", delay = 0 } = {}) {
  const style = delay ? ` style="animation-delay:${r2(delay)}s;transform-origin:${r1(x)}px ${r1(y)}px"` : ` style="transform-origin:${r1(x)}px ${r1(y)}px"`;
  return (
    `<g class="${cls}"${style}>` +
    `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r * 2.6)}" fill="url(#${halo})"/>` +
    `<path d="${glintPath(x, y, r)}" fill="${color}"/>` +
    `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r2(Math.max(0.8, r * 0.18))}" fill="${C.ice}"/>` +
    `</g>`
  );
}

// Background starfield. Stars are bucketed into vertical slices so the
// ignition sweep can run left to right with one animation per slice.
export function starfield({ w, h, count, seed, slices = 8, inset = 6, avoid = [], twinkleShare = 0.28, sweep = 1.6 }) {
  const rand = rng(seed);
  const buckets = Array.from({ length: slices }, () => []);
  let placed = 0;
  let guard = 0;
  while (placed < count && guard++ < count * 20) {
    const x = inset + rand() * (w - inset * 2);
    const y = inset + rand() * (h - inset * 2);
    if (avoid.some((a) => x > a.x && x < a.x + a.w && y > a.y && y < a.y + a.h)) continue;
    const roll = rand();
    let el;
    if (roll < 0.72) {
      const r = 0.45 + rand() * 0.6;
      el = `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r2(r)}" fill="${C.ice}" opacity="${r2(0.22 + rand() * 0.4)}"`;
    } else {
      const r = 0.9 + rand() * 0.8;
      el = `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r2(r)}" fill="${C.starTone}" opacity="${r2(0.55 + rand() * 0.4)}"`;
    }
    if (rand() < twinkleShare) {
      const cls = `tw${1 + Math.floor(rand() * 3)}`;
      el += ` class="${cls}" style="animation-delay:-${r1(rand() * 9)}s"`;
    }
    buckets[Math.min(slices - 1, Math.floor((x / w) * slices))].push(el + "/>");
    placed++;
  }
  return buckets
    .map((b, i) => `<g class="ig" style="animation-delay:${r2((i / slices) * sweep)}s">${b.join("")}</g>`)
    .join("");
}

// Soft nebula core: an elliptical radial gradient in nebula-core.
export function nebula(id, cx, cy, rx, ry, opacity = 1) {
  return {
    def: `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.nebula}" stop-opacity="${opacity}"/><stop offset="0.55" stop-color="${C.stop1}" stop-opacity="${r2(opacity * 0.55)}"/><stop offset="1" stop-color="${C.navy}" stop-opacity="0"/></radialGradient>`,
    el: `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`,
  };
}

const MOTION_CSS = [
  // Ignition: each slice of stars brightens, left to right, once. It starts
  // from a visible state so a paused animation never hides the sky.
  "@keyframes ny-ig{from{opacity:.3}to{opacity:1}}",
  ".ig{animation:ny-ig 1.6s cubic-bezier(.16,1,.3,1) both}",
  // Three twinkle cadences so the field never pulses in unison.
  "@keyframes ny-tw{0%,100%{opacity:var(--o,.85)}50%{opacity:.18}}",
  ".tw1{animation:ny-tw 4.6s ease-in-out infinite}",
  ".tw2{animation:ny-tw 6.9s ease-in-out infinite}",
  ".tw3{animation:ny-tw 9.3s ease-in-out infinite}",
  // Glints breathe rather than blink.
  "@keyframes ny-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(.82);opacity:.78}}",
  ".pulse{animation:ny-pulse 5.8s ease-in-out infinite}",
  // Text settles by a few pixels but is never hidden by its entrance.
  "@keyframes ny-rise{from{transform:translateY(5px)}to{transform:none}}",
  ".rise{animation:ny-rise 1.1s cubic-bezier(.16,1,.3,1) both}",
].join("");

const REDUCED = "@media (prefers-reduced-motion:reduce){*{animation:none!important}}";

const TYPE_CSS = [
  "text{font-family:'Space Grotesk',ui-sans-serif,system-ui,sans-serif;font-kerning:normal}",
  `.h{font-weight:700;letter-spacing:-.035em;fill:${C.ice}}`,
  `.b{font-weight:500;fill:${C.ice};fill-opacity:.74}`,
  `.m{font-weight:500;fill:${C.starTone};fill-opacity:.86}`,
  `.a{font-weight:700;letter-spacing:-.01em;fill:${C.goldHi}}`,
].join("");

// Below this rendered width (CSS px of the <img>) a plate swaps its `.w` text
// for a `.n` layout with fewer, larger words; ~0.43 scale on a phone column.
export const NARROW = 540;
const NARROW_CSS = `.n{display:none}@media (max-width:${NARROW}px){.w{display:none}.n{display:inline}}`;

// Frame outline. Plates stacked into one run round only the run's outer corners.
function framePath(w, h, corners) {
  const t = corners === "all" || corners === "top" ? RADIUS : 0;
  const b = corners === "all" || corners === "bottom" ? RADIUS : 0;
  return (
    `M${t} 0H${w - t}${t ? `A${t} ${t} 0 0 1 ${w} ${t}` : ""}V${h - b}${b ? `A${b} ${b} 0 0 1 ${w - b} ${h}` : ""}` +
    `H${b}${b ? `A${b} ${b} 0 0 1 0 ${h - b}` : ""}V${t}${t ? `A${t} ${t} 0 0 1 ${t} 0` : ""}Z`
  );
}

// Half a nebula on each side of a seam, at the same x, so adjacent plates read
// as one sky rather than a stack of cards.
export function seams({ top, bottom }, h, id) {
  let defs = "", el = "";
  if (top != null) {
    const n = nebula(`${id}-seam-t`, top, 0, 250, 78, 0.95);
    defs += n.def; el += n.el;
  }
  if (bottom != null) {
    const n = nebula(`${id}-seam-b`, bottom, h, 250, 78, 0.95);
    defs += n.def; el += n.el;
  }
  return { defs, el };
}

// Bounding box of a text run (for keeping dust stars off the words).
export function textBox(text, x, baseline, size, weight = 700, anchor = "start", pad = 8) {
  const tracking = weight === 700 ? -0.035 : 0;
  const w = measure(text, size, weight, tracking);
  const x0 = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  return { x: x0 - pad, y: baseline - size * 0.82 - pad, w: w + pad * 2, h: size * 1.08 + pad * 2 };
}

// The plate: navy ground, clipped content, accessible title.
export function plate({ id, w = W, h, title, desc, defs = "", css = "", body, weights = [500, 700], corners = "all" }) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="${id}-t ${id}-d">` +
    `<title id="${id}-t">${esc(title)}</title><desc id="${id}-d">${esc(desc)}</desc>` +
    `<defs>` +
    `<clipPath id="ny-frame"><path d="${framePath(w, h, corners)}"/></clipPath>` +
    `<radialGradient id="ny-halo-gold"><stop offset="0" stop-color="${C.gold}" stop-opacity=".55"/><stop offset=".35" stop-color="${C.gold}" stop-opacity=".16"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="ny-halo-ice"><stop offset="0" stop-color="${C.iceAccent}" stop-opacity=".5"/><stop offset=".35" stop-color="${C.iceAccent}" stop-opacity=".14"/><stop offset="1" stop-color="${C.iceAccent}" stop-opacity="0"/></radialGradient>` +
    defs +
    `</defs>` +
    `<style>${fontFaces(weights)}${TYPE_CSS}${MOTION_CSS}${NARROW_CSS}${css}${REDUCED}</style>` +
    `<g clip-path="url(#ny-frame)"><rect width="${w}" height="${h}" fill="${C.navy}"/>${body}</g>` +
    `</svg>\n`
  );
}

// Nest an official brand SVG verbatim, only re-placing its root box. Never
// masked or contained: plates composite it with mix-blend-mode:lighten. `frame`
// (a viewBox string) may narrow the window onto the mark's own clear space;
// the mark's content is never touched.
export function nestBrandSvg(source, { x, y, width, height, frame }) {
  const svg = source.trim().replace(/^<\?xml[^>]*>\s*/, "");
  const open = svg.match(/^<svg\b[^>]*>/)[0];
  let placed = open
    .replace(/\swidth="[^"]*"/, "")
    .replace(/\sheight="[^"]*"/, "")
    .replace(/^<svg\b/, `<svg x="${x}" y="${y}" width="${width}" height="${height}"`);
  if (frame) placed = placed.replace(/\sviewBox="[^"]*"/, ` viewBox="${frame}"`);
  return placed + svg.slice(open.length);
}

// Bottom fade: content melts into navy over its last `f` units (screenshots only,
// never a brand mark).
export function fadeBottom(id, x, y, w, h, f) {
  const s = r2(1 - f / h);
  return (
    `<linearGradient id="${id}-g" x2="0" y2="1"><stop offset="${s}" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<mask id="${id}" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}-g)"/></mask>`
  );
}

// Arrow drawn as a path (never a glyph), sized to sit on a text baseline.
export function arrow(x, baseline, size, color = C.goldHi) {
  const s = size * 0.5;
  const yc = baseline - size * 0.34;
  return (
    `<path d="M${r1(x)} ${r1(yc)}H${r1(x + s * 1.5)}M${r1(x + s * 0.95)} ${r1(yc - s * 0.55)}L${r1(x + s * 1.5)} ${r1(yc)}L${r1(x + s * 0.95)} ${r1(yc + s * 0.55)}" ` +
    `fill="none" stroke="${color}" stroke-width="${r2(size * 0.1)}" stroke-linecap="round" stroke-linejoin="round"/>`
  );
}
