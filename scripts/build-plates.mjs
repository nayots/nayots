// Builds the hand-composed plates: hero, constellations, and the two work plates.
// Run: node scripts/build-plates.mjs   (writes assets/*.svg, deterministic)
//
// Every plate carries two text layouts: `.w` for the desktop column and `.n`
// (fewer, larger words) that takes over when the image renders narrower than
// NARROW css px — on a phone the whole plate scales to ~0.43.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  C, W, root, plate, starfield, nebula, glint, measure, wrap, esc, r1, r2, rng,
  nestBrandSvg, featherMask, featherRect, fadeBottom, arrow, seams, textBox,
} from "./lib/sky.mjs";

const brand = (f) => readFileSync(join(root, "assets/brand", f), "utf8");
const out = (f, svg) => {
  writeFileSync(join(root, "assets", f), svg);
  console.log(`${f.padEnd(28)} ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
};

// A text run plus its keep-clear box, so the starfield never lands on words.
function text(cls, str, x, y, size, { anchor = "start", weight, extra = "" } = {}) {
  const wgt = weight ?? (cls === "h" || cls === "a" ? 700 : 500);
  const el = `<text class="${cls}" x="${r1(x)}" y="${r1(y)}" font-size="${size}"${anchor !== "start" ? ` text-anchor="${anchor}"` : ""}${extra}>${esc(str)}</text>`;
  return { el, box: textBox(str, x, y, size, wgt, anchor) };
}
const join2 = (runs) => ({ el: runs.map((r) => r.el).join(""), boxes: runs.map((r) => r.box) });

// ─── hero ────────────────────────────────────────────────────────────────────
function hero() {
  const h = 340;
  // The official animated wordmark (1080x320 master) seen through a window on
  // its own clear space: ink spans 252..826 x 80..240, the window keeps >=1/2 n
  // (about 50 units) on every side, so the mark is framed, never cropped.
  const frame = { x: 200, y: 30, w: 680, h: 260 };
  const s = 597 / frame.w;
  const mw = r1(frame.w * s), mh = r1(frame.h * s), mx = r1((W - mw) / 2), my = 8;

  const n1 = nebula("ny-neb-a", 120, 330, 300, 150, 0.95);
  const n2 = nebula("ny-neb-b", 760, 30, 260, 130, 0.75);
  const n3 = nebula("ny-neb-c", 420, 300, 420, 70, 0.35);

  const wide = join2([
    text("h", "stoyan grigorov", W / 2, 258, 36, { anchor: "middle" }),
    text("b", "software engineer · sofia, bulgaria", W / 2, 292, 19, { anchor: "middle" }),
  ]);
  const narrow = join2([
    text("h", "stoyan grigorov", W / 2, 266, 48, { anchor: "middle" }),
    text("b", "software engineer · sofia", W / 2, 312, 30, { anchor: "middle" }),
  ]);

  const glints = [
    glint(44, 58, 6.5, { cls: "pulse", delay: -1.2 }),
    glint(792, 252, 5, { cls: "pulse", delay: -3.4 }),
    glint(724, 318, 3.6, { color: C.iceAccent, halo: "ny-halo-ice", cls: "pulse", delay: -4.6 }),
    glint(96, 286, 3.2, { color: C.iceAccent, halo: "ny-halo-ice", cls: "pulse", delay: -2.1 }),
  ].join("");

  const body =
    n1.el + n2.el + n3.el +
    starfield({ w: W, h, count: 230, seed: "hero", avoid: [...wide.boxes, ...narrow.boxes] }) +
    glints +
    nestBrandSvg(brand("nayots-wordmark-particle-animated.svg"), {
      x: mx, y: my, width: mw, height: mh, mask: "ny-mark-mask",
      frame: `${frame.x} ${frame.y} ${frame.w} ${frame.h}`,
    }) +
    `<g class="rise w" style="animation-delay:.9s">${wide.el}</g>` +
    `<g class="rise n" style="animation-delay:.9s">${narrow.el}</g>`;

  return plate({
    id: "hero",
    h,
    title: "nayots — Stoyan Grigorov, software engineer, Sofia, Bulgaria",
    desc: "The nayots wordmark rendered as luminous stardust on a deep navy night sky, with the name Stoyan Grigorov and the line software engineer, Sofia, Bulgaria beneath it.",
    defs: n1.def + n2.def + n3.def + featherRect("ny-mark-mask", mx, my, mw, mh, 34),
    body,
  });
}

// ─── constellations ──────────────────────────────────────────────────────────
// One sky, not a row: five figures at different scales whose borders share
// stars (K: aws/frontend, R: infrastructure/ai, E: ai/.net), with two faint
// dashed bridges for "the stars between them".
const S = {
  A: [600, 70], B: [642, 40], C: [686, 88], D: [732, 46], E: [792, 98],
  F: [46, 206], G: [88, 246], H: [150, 266], I: [222, 254], K: [298, 200],
  L: [392, 172], M: [408, 258], N: [316, 276], O: [354, 226],
  P: [536, 116], Q: [494, 188], R: [584, 188], Sb: [464, 270], T: [612, 270],
  U: [690, 222], V: [654, 156], X: [778, 248], Y: [712, 282],
};
const FIGURES = [
  { name: ".net", edges: ["AB", "BC", "CD", "DE"], alpha: "C", label: [672, 126] },
  { name: "aws", edges: ["FG", "GH", "HI", "IK"], alpha: "H", label: [150, 302] },
  { name: "frontend", edges: ["KL", "LM", "MN", "NK", "KO", "OM"], alpha: "O", label: [346, 152] },
  { name: "infrastructure", edges: ["PQ", "PR", "QR", "QSb", "RT", "SbT"], alpha: "P", label: [538, 306] },
  { name: "ai", edges: ["UR", "UV", "UX", "UY", "UE", "VE"], alpha: "U", label: [776, 296] },
];
const BRIDGES = ["LQ", "TY"];
const pair = (e) => (e.length === 2 ? [e[0], e[1]] : e.startsWith("Sb") ? ["Sb", e.slice(2)] : [e[0], e.slice(1)]);

function constellations() {
  const h = 320;
  const rand = rng("constellations");
  const n1 = nebula("ny-neb-c1", 640, 70, 300, 120, 0.7);
  const n2 = nebula("ny-neb-c2", 160, 290, 260, 100, 0.6);
  const seam = seams({ bottom: 640 }, h, "ny-c");

  const head = {
    wide: join2([
      text("h", "the working sky", 40, 62, 30),
      text("b", "Five territories — and the stars between them.", 40, 94, 17),
    ]),
    narrow: join2([text("h", "the working sky", 40, 70, 44)]),
  };

  let lines = "", stars = "";
  const alphas = new Set(FIGURES.map((f) => f.alpha));
  FIGURES.forEach((f, fi) => {
    const start = 0.5 + fi * 0.3;
    f.edges.forEach((e, ei) => {
      const [a, b] = pair(e);
      const [x1, y1] = S[a], [x2, y2] = S[b];
      const len = Math.hypot(x2 - x1, y2 - y1);
      lines +=
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="draw" ` +
        `style="stroke-dasharray:${r1(len)};--len:${r1(len)};animation-delay:${r2(start + 0.3 + ei * 0.14)}s"/>`;
    });
  });
  const bridges = BRIDGES.map((e) => {
    const [a, b] = pair(e);
    return `<line x1="${S[a][0]}" y1="${S[a][1]}" x2="${S[b][0]}" y2="${S[b][1]}"/>`;
  }).join("");

  Object.entries(S).forEach(([k, [x, y]], i) => {
    if (alphas.has(k)) {
      stars += glint(x, y, 6.2, { cls: "pulse", delay: -(i * 0.7) });
    } else {
      const shared = ["K", "R", "E"].includes(k);
      const r = shared ? 2.5 : 1.7 + rand() * 0.8;
      stars += `<circle cx="${x}" cy="${y}" r="${r2(r * 2.8)}" fill="url(#ny-halo-ice)"/>` +
        `<circle cx="${x}" cy="${y}" r="${r2(r)}" fill="${C.ice}"/>`;
    }
  });

  const wideLabels = join2(FIGURES.map((f) => text("h", f.name, f.label[0], f.label[1], 16, { anchor: "middle", extra: ' fill-opacity=".86"' })));
  const narrowLabels = join2(FIGURES.map((f) => text("h", f.name, f.label[0], f.label[1] + 4, 30, { anchor: "middle", extra: ' fill-opacity=".92"' })));

  const body =
    n1.el + n2.el + seam.el +
    starfield({ w: W, h, count: 170, seed: "constellations-field", avoid: [...head.wide.boxes, ...head.narrow.boxes, ...wideLabels.boxes, ...narrowLabels.boxes] }) +
    `<g class="rise w" style="animation-delay:.2s">${head.wide.el}</g>` +
    `<g class="rise n" style="animation-delay:.2s">${head.narrow.el}</g>` +
    `<g stroke="${C.iceAccent}" stroke-opacity=".32" stroke-width="1" stroke-dasharray="2 5" stroke-linecap="round" class="ig" style="animation-delay:2.2s">${bridges}</g>` +
    `<g stroke="${C.iceAccent}" stroke-opacity=".55" stroke-width="1.15" stroke-linecap="round">${lines}</g>` +
    `<g class="ig" style="animation-delay:.3s">${stars}</g>` +
    `<g class="rise w" style="animation-delay:1.4s">${wideLabels.el}</g>` +
    `<g class="rise n" style="animation-delay:1.4s">${narrowLabels.el}</g>`;

  return plate({
    id: "constellations",
    h,
    corners: "top",
    title: "The working sky: .NET, AWS, frontend, infrastructure and AI",
    desc: "One night sky holding five constellations of different sizes — .net, aws, frontend, infrastructure and ai — that share stars at their borders and are joined by faint dashed lines: the territories of Stoyan's work and the stars between them.",
    defs: n1.def + n2.def + seam.defs,
    css: "@keyframes ny-draw{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}.draw{animation:ny-draw 1.1s cubic-bezier(.65,0,.35,1) both}",
    body,
  });
}

// ─── work plates ─────────────────────────────────────────────────────────────
function workPlate({ id, title, blurb, short, meta, action, visual, defs = "", seed, alt, seam }) {
  const h = 300;
  const blurbLines = wrap(blurb, 18, 500, 450);
  if (blurbLines.length > 3) throw new Error(`${id}: blurb wraps to ${blurbLines.length} lines; keep it to 3`);
  const shortLines = wrap(short, 32, 500, 480);
  if (shortLines.length > 2) throw new Error(`${id}: short line wraps to ${shortLines.length} lines; keep it to 2`);

  // Meta sits a fixed step under the blurb; the action anchors the plate's foot
  // so both work plates end on the same line whatever their blurb length.
  const metaY = 120 + (blurbLines.length - 1) * 27 + 38;
  const wide = join2([
    text("h", title, 40, 76, 36),
    ...blurbLines.map((l, i) => text("b", l, 40, 120 + i * 27, 18)),
    text("m", meta, 40, metaY, 15),
    text("a", action, 40, h - 40, 17),
  ]);
  const narrow = join2([
    text("h", title, 40, 90, 54),
    ...shortLines.map((l, i) => text("b", l, 40, 146 + i * 40, 32)),
    text("a", action, 40, h - 40, 32),
  ]);
  const aw = measure(action, 17, 700, -0.01);
  const awN = measure(action, 32, 700, -0.01);
  const n1 = nebula(`ny-neb-${id}`, 660, 150, 260, 170, 0.9);
  const seam2 = seams(seam, h, `ny-${id}`);

  const body =
    n1.el + seam2.el +
    starfield({ w: W, h, count: 120, seed, avoid: [...wide.boxes, ...narrow.boxes] }) +
    visual +
    `<g class="rise w" style="animation-delay:.15s">${wide.el}${arrow(40 + aw + 9, h - 40, 17)}</g>` +
    `<g class="rise n" style="animation-delay:.15s">${narrow.el}${arrow(40 + awN + 14, h - 40, 32)}</g>`;

  return plate({ id, h, corners: "none", title: alt.title, desc: alt.desc, defs: n1.def + seam2.defs + defs, body });
}

function usageMonitor() {
  const img = readFileSync(join(root, "scripts/source/ai-usage-monitor-widget-dark.webp")).toString("base64");
  // A window onto the real 720x1024 widget render: header, Claude Code and
  // Codex cards, cut on the row boundary below Codex and melted into navy.
  const crop = { w: 720, h: 668 };
  const iw = 240, ih = r1((iw * crop.h) / crop.w), ix = 548, iy = 56;
  const visual =
    `<ellipse cx="${ix + iw / 2}" cy="${iy + 110}" rx="200" ry="150" fill="url(#ny-halo-ice)" opacity=".5"/>` +
    `<g filter="url(#ny-lift)"><g mask="url(#ny-widget-fade)">` +
    `<svg x="${ix}" y="${iy}" width="${iw}" height="${ih}" viewBox="0 0 ${crop.w} ${crop.h}">` +
    `<image width="720" height="1024" href="data:image/webp;base64,${img}"/></svg></g></g>` +
    glint(ix - 22, iy + 22, 5.4, { cls: "pulse", delay: -2 });
  return workPlate({
    id: "work-usage-monitor",
    seed: "usage-monitor",
    seam: { top: 640, bottom: 200 },
    title: "ai usage monitor",
    blurb: "See how much of your AI coding plan is left without opening a session to ask: live quota for Claude Code, Codex and Cursor.",
    short: "Your AI coding quota, at a glance.",
    meta: "windows 11 · c# · mit licence · no telemetry",
    action: "view the repository",
    visual,
    defs:
      `<filter id="ny-lift" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="${C.stop3}" flood-opacity=".9"/></filter>` +
      fadeBottom("ny-widget-fade", ix - 40, iy - 40, iw + 80, ih + 40, 70),
    alt: {
      title: "AI Usage Monitor — open-source Windows widget",
      desc: "AI Usage Monitor: see how much of your AI coding plan is left without opening a session. Live quota for Claude Code, Codex and Cursor in a small Windows 11 widget, written in C#, MIT licensed, no telemetry. Shows the top of the real widget. Links to the repository.",
    },
  });
}

function nayotsCom() {
  const size = 270, x = 548, y = 14;
  const visual = nestBrandSvg(brand("nayots-n-particle-animated.svg"), { x, y, width: size, height: size, mask: "ny-n-mask" });
  return workPlate({
    id: "work-nayots",
    seed: "nayots-com",
    seam: { top: 200, bottom: 560 },
    title: "nayots.com",
    blurb: "My corner of the web: a name rendered as luminous stardust — about a hundred thousand GPU-simulated particles forming the wordmark.",
    short: "A name rendered as luminous stardust.",
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
