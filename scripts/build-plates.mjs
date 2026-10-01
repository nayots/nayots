// Builds the hand-composed plates: hero, constellations, and the two work plates.
// Run: node scripts/build-plates.mjs   (writes assets/*.svg, deterministic)

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  C, W, root, plate, starfield, nebula, glint, measure, wrap, esc, r1, r2,
  nestBrandSvg, featherMask, arrow, rng,
} from "./lib/sky.mjs";

const brand = (f) => readFileSync(join(root, "assets/brand", f), "utf8");
const out = (f, svg) => {
  writeFileSync(join(root, "assets", f), svg);
  console.log(`${f.padEnd(28)} ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
};

// ─── hero ────────────────────────────────────────────────────────────────────
function hero() {
  const h = 360;
  // Official animated wordmark, 1080x320 master, scaled not altered.
  const mw = 700, mh = r1((700 * 320) / 1080), mx = (W - mw) / 2, my = 14;
  const n1 = nebula("ny-neb-a", 120, 330, 300, 150, 0.95);
  const n2 = nebula("ny-neb-b", 760, 30, 260, 130, 0.75);
  const n3 = nebula("ny-neb-c", 420, 300, 420, 70, 0.35);

  const name = "stoyan grigorov";
  const line = "software engineer · sofia, bulgaria";

  const glints = [
    glint(44, 58, 6.5, { cls: "pulse", delay: -1.2 }),
    glint(786, 248, 5, { cls: "pulse", delay: -3.4 }),
    glint(690, 318, 3.6, { color: C.iceAccent, halo: "ny-halo-ice", cls: "pulse", delay: -4.6 }),
    glint(112, 262, 3.2, { color: C.iceAccent, halo: "ny-halo-ice", cls: "pulse", delay: -2.1 }),
  ].join("");

  const body =
    n1.el + n2.el + n3.el +
    starfield({ w: W, h, count: 230, seed: "hero" }) +
    glints +
    nestBrandSvg(brand("nayots-wordmark-particle-animated.svg"), { x: mx, y: my, width: mw, height: mh, mask: "ny-mark-mask" }) +
    `<g class="rise" style="animation-delay:.9s">` +
    `<text class="h" x="${W / 2}" y="280" font-size="36" text-anchor="middle">${esc(name)}</text>` +
    `<text class="b" x="${W / 2}" y="314" font-size="19" text-anchor="middle">${esc(line)}</text>` +
    `</g>`;

  return plate({
    id: "hero",
    h,
    title: "nayots — Stoyan Grigorov, software engineer, Sofia, Bulgaria",
    desc: "The nayots wordmark rendered as luminous stardust on a deep navy night sky, with the name Stoyan Grigorov and the line software engineer, Sofia, Bulgaria beneath it.",
    defs: n1.def + n2.def + n3.def + featherMask("ny-mark-mask", mx, my, mw, mh, 0.7),
    body,
  });
}

// ─── constellations ──────────────────────────────────────────────────────────
// Five figures for the five territories of the work. Coordinates are local to
// a 120x110 cell; `alpha` is the index of the figure's brightest (gold) star.
const FIGURES = [
  { name: ".net", stars: [[2, 46], [30, 12], [56, 52], [84, 16], [116, 56]], edges: [[0, 1], [1, 2], [2, 3], [3, 4]], alpha: 2,
    loose: [[14, 88], [98, 92], [64, 4]] },
  { name: "aws", stars: [[0, 30], [24, 62], [60, 78], [96, 64], [120, 34], [110, 18]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]], alpha: 2,
    loose: [[58, 14], [10, 96], [104, 100]] },
  { name: "frontend", stars: [[14, 18], [96, 8], [106, 82], [22, 92], [60, 50]], edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4]], alpha: 4,
    loose: [[118, 46], [0, 56], [76, 104]] },
  { name: "infrastructure", stars: [[58, 0], [24, 42], [92, 42], [4, 100], [112, 100]], edges: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]], alpha: 0,
    loose: [[58, 72], [0, 18], [120, 24]] },
  { name: "ai", stars: [[60, 52], [12, 20], [104, 12], [112, 90], [16, 96], [62, 0]], edges: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 5], [5, 2]], alpha: 0,
    loose: [[40, 108], [92, 50], [0, 60]] },
];

function constellations() {
  const h = 320;
  const cellW = 120, cellH = 110, top = 132;
  const gap = (W - 80 - cellW * FIGURES.length) / (FIGURES.length - 1);
  const rand = rng("constellations");
  const n1 = nebula("ny-neb-c1", 640, 70, 300, 120, 0.7);
  const n2 = nebula("ny-neb-c2", 120, 300, 260, 110, 0.6);

  let lines = "", stars = "", labels = "";
  FIGURES.forEach((f, fi) => {
    const ox = 40 + fi * (cellW + gap), oy = top;
    const P = f.stars.map(([x, y]) => [ox + x, oy + y]);
    const start = 0.5 + fi * 0.32;
    f.edges.forEach(([a, b], ei) => {
      const [x1, y1] = P[a], [x2, y2] = P[b];
      const len = Math.hypot(x2 - x1, y2 - y1);
      lines +=
        `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="draw" ` +
        `style="stroke-dasharray:${r1(len)};--len:${r1(len)};animation-delay:${r2(start + 0.35 + ei * 0.16)}s"/>`;
    });
    P.forEach(([x, y], si) => {
      if (si === f.alpha) {
        stars += glint(x, y, 6.2, { cls: "pulse", delay: -(fi * 1.3) });
      } else {
        const r = 1.7 + rand() * 0.9;
        stars += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r2(r * 2.8)}" fill="url(#ny-halo-ice)"/>` +
          `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r2(r)}" fill="${C.ice}"/>`;
      }
    });
    f.loose.forEach(([x, y]) => {
      stars += `<circle cx="${r1(ox + x)}" cy="${r1(oy + y)}" r="${r2(0.9 + rand() * 0.5)}" fill="${C.starTone}" opacity=".55"/>`;
    });
    labels += `<text class="h" x="${r1(ox + cellW / 2)}" y="${oy + cellH + 40}" font-size="19" text-anchor="middle" fill-opacity=".92">${esc(f.name)}</text>`;
  });

  const title = "the working sky";
  const sub = "Five territories I keep returning to — and the stars between them.";
  const body =
    n1.el + n2.el +
    starfield({ w: W, h, count: 170, seed: "constellations-field" }) +
    `<g class="rise" style="animation-delay:.2s">` +
    `<text class="h" x="40" y="62" font-size="30">${esc(title)}</text>` +
    `<text class="b" x="40" y="94" font-size="17">${esc(sub)}</text>` +
    `</g>` +
    `<g stroke="${C.iceAccent}" stroke-opacity=".5" stroke-width="1.15" stroke-linecap="round">${lines}</g>` +
    `<g class="ig" style="animation-delay:.3s">${stars}</g>` +
    `<g class="rise" style="animation-delay:1.4s">${labels}</g>`;

  return plate({
    id: "constellations",
    h,
    title: "The working sky: .NET, AWS, frontend, infrastructure and AI",
    desc: "Five constellations drawn on a navy night sky, labelled .net, aws, frontend, infrastructure and ai — the territories of Stoyan's work — with unlabelled stars scattered between them.",
    defs: n1.def + n2.def,
    css: "@keyframes ny-draw{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}.draw{animation:ny-draw 1.1s cubic-bezier(.65,0,.35,1) both}",
    body,
  });
}

// ─── work plates ─────────────────────────────────────────────────────────────
function workPlate({ id, title, blurb, meta, action, visual, defs = "", seed, alt }) {
  const h = 300;
  const textW = 450;
  const lines = wrap(blurb, 18, 500, textW);
  if (lines.length > 3) throw new Error(`${id}: blurb wraps to ${lines.length} lines; keep it to 3`);
  const blurbEls = lines
    .map((l, i) => `<text class="b" x="40" y="${120 + i * 27}" font-size="18">${esc(l)}</text>`)
    .join("");
  // Meta sits a fixed step under the blurb; the action anchors the plate's foot
  // so both work plates end on the same line whatever their blurb length.
  const metaY = 120 + (lines.length - 1) * 27 + 38;
  const actionY = h - 40;
  const aw = measure(action, 17, 700, -0.01);
  const n1 = nebula(`ny-neb-${id}`, 660, 150, 260, 170, 0.9);

  const body =
    n1.el +
    starfield({ w: W, h, count: 120, seed, avoid: [{ x: 24, y: 30, w: 480, h: 230 }] }) +
    visual +
    `<g class="rise" style="animation-delay:.15s">` +
    `<text class="h" x="40" y="76" font-size="36">${esc(title)}</text>` +
    blurbEls +
    `<text class="m" x="40" y="${metaY}" font-size="15">${esc(meta)}</text>` +
    `<text class="a" x="40" y="${actionY}" font-size="17">${esc(action)}</text>` +
    arrow(40 + aw + 9, actionY, 17) +
    `</g>`;

  return plate({ id, h, title: alt.title, desc: alt.desc, defs: n1.def + defs, body });
}

function usageMonitor() {
  const img = readFileSync(join(root, "scripts/source/ai-usage-monitor-widget-dark.webp")).toString("base64");
  // 720x1024 render of the real widget, shown at a third of its pixels for 3x density.
  const iw = 240, ih = r1((240 * 1024) / 720), ix = 548, iy = 38;
  const visual =
    `<ellipse cx="${ix + iw / 2}" cy="${iy + 120}" rx="200" ry="150" fill="url(#ny-halo-ice)" opacity=".55"/>` +
    `<g filter="url(#ny-lift)"><image x="${ix}" y="${iy}" width="${iw}" height="${ih}" href="data:image/webp;base64,${img}"/></g>` +
    glint(ix - 22, iy + 26, 5.4, { cls: "pulse", delay: -2 });
  return workPlate({
    id: "work-usage-monitor",
    seed: "usage-monitor",
    title: "ai usage monitor",
    blurb: "See how much of your AI coding plan is left without opening a session to ask: live quota for Claude Code, Codex and Cursor.",
    meta: "windows 11 · c# · mit licence · no telemetry",
    action: "view the repository",
    visual,
    defs: `<filter id="ny-lift" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="${C.stop3}" flood-opacity=".9"/></filter>`,
    alt: {
      title: "AI Usage Monitor — open-source Windows widget",
      desc: "AI Usage Monitor: see how much of your AI coding plan is left without opening a session. Live quota for Claude Code, Codex and Cursor in a small Windows 11 widget, written in C#, MIT licensed, no telemetry. Shows a screenshot of the widget. Links to the repository.",
    },
  });
}

function nayotsCom() {
  const size = 270, x = 548, y = 6;
  const visual = nestBrandSvg(brand("nayots-n-particle-animated.svg"), { x, y, width: size, height: size, mask: "ny-n-mask" });
  return workPlate({
    id: "work-nayots",
    seed: "nayots-com",
    title: "nayots.com",
    blurb: "My corner of the web: a name rendered as luminous stardust — about a hundred thousand GPU-simulated particles forming the wordmark.",
    meta: "webgl · three.js · static on vercel",
    action: "visit nayots.com",
    visual,
    defs: featherMask("ny-n-mask", x, y, size, size, 0.66),
    alt: {
      title: "nayots.com — personal site",
      desc: "nayots.com: a name rendered as luminous stardust, about a hundred thousand GPU-simulated particles forming the wordmark, built with WebGL and three.js and served statically on Vercel. Shows the nayots keystone-star monogram in particles. Links to nayots.com.",
    },
  });
}

out("hero.svg", hero());
out("constellations.svg", constellations());
out("work-usage-monitor.svg", usageMonitor());
out("work-nayots.svg", nayotsCom());
