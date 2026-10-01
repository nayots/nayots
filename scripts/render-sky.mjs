// Renders the last year of GitHub contributions as a star map: one star per
// day, brightness by activity, gold glints on the busiest days, the longest
// streak drawn as a constellation, today pulsing at the end of the band.
//
//   GITHUB_TOKEN=... node scripts/render-sky.mjs [--login nayots] [--out assets/sky.svg]
//   node scripts/render-sky.mjs --fixture calendar.json
//
// On any API error it exits non-zero without writing, so the last good sky stays.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { C, W, root, plate, nebula, glint, esc, r1, r2, rng, starfield } from "./lib/sky.mjs";
import { flattenDays, summarize, levels } from "./lib/calendar.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]?.startsWith("--") ? true : all[i + 1] ?? true]);
    return acc;
  }, []),
);
const login = args.login ?? "nayots";
const outPath = join(root, args.out ?? "assets/sky.svg");

async function fetchCalendar() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set (or pass --fixture <file>)");
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { authorization: `bearer ${token}`, "content-type": "application/json", "user-agent": "nayots-profile-sky" },
    body: JSON.stringify({ query, variables: { login } }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(`GitHub GraphQL: ${json.errors.map((e) => e.message).join("; ")}`);
  const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal?.weeks?.length) throw new Error("GitHub GraphQL returned no calendar");
  return cal;
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const fmt = (n) => n.toLocaleString("en-US");
const longDate = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

export function renderSky(calendar) {
  const days = flattenDays(calendar);
  const stats = summarize(days);
  const lv = levels(days.map((d) => d.count));
  const weeks = calendar.weeks.length;
  const h = 360;
  const left = 40, right = W - 40;

  // The band arcs like the Milky Way across the plate.
  // Generous jitter dissolves the 7-row lattice so quiet months read as sky,
  // not as an empty spreadsheet.
  const bandY = (t) => 232 - 44 * Math.sin(Math.PI * t);
  const pos = days.map((d, i) => {
    const jr = rng(`${d.date}`);
    const t = weeks > 1 ? d.week / (weeks - 1) : 0.5;
    const x = left + t * (right - left) + (jr() - 0.5) * 13;
    const y = bandY(t) + (d.weekday - 3) * 15 + (jr() - 0.5) * 16;
    return [x, y];
  });

  // Gold glints: the five busiest days (ties broken by recency).
  const topIdx = days
    .map((d, i) => [d.count, i])
    .filter(([c]) => c > 0)
    .sort((a, b) => b[0] - a[0] || b[1] - a[1])
    .slice(0, 5)
    .map(([, i]) => i);
  const top = new Set(topIdx);
  const todayIdx = days.length - 1;

  const slices = 10;
  const buckets = Array.from({ length: slices }, () => []);
  const twr = rng(`twinkle-${days[0]?.date}`);
  days.forEach((d, i) => {
    if (top.has(i) || i === todayIdx) return;
    const [x, y] = pos[i];
    const l = lv[i];
    let el;
    if (l === 0) {
      // Quiet days are faint dust, and not every one of them shows.
      const jr = rng(`dust-${d.date}`);
      if (jr() < 0.45) return;
      el = `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r2(0.45 + jr() * 0.4)}" fill="${C.starTone}" opacity="${r2(0.12 + jr() * 0.18)}"/>`;
    } else {
      const r = [0, 1.15, 1.6, 2.15, 2.8][l];
      const color = l >= 3 ? C.ice : C.starTone;
      const halo = l >= 3 ? `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r2(r * 3.4)}" fill="url(#ny-halo-ice)" opacity="${l === 4 ? ".9" : ".55"}"/>` : "";
      const tw = l >= 2 && twr() < 0.4 ? ` class="tw${1 + Math.floor(twr() * 3)}" style="animation-delay:-${r1(twr() * 9)}s"` : "";
      el = `${halo}<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="${color}" opacity="${[0, 0.62, 0.78, 0.92, 1][l]}"${tw}/>`;
    }
    buckets[Math.min(slices - 1, Math.floor((d.week / Math.max(1, weeks)) * slices))].push(el);
  });
  const field = buckets
    .map((b, i) => `<g class="ig" style="animation-delay:${r2(0.2 + (i / slices) * 1.8)}s">${b.join("")}</g>`)
    .join("");

  // Longest streak as a constellation line, drawn in after the sky ignites.
  let streak = "";
  if (stats.longestStreak.length >= 3) {
    const pts = pos.slice(stats.longestStreak.start, stats.longestStreak.start + stats.longestStreak.length);
    const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${r1(x)} ${r1(y)}`).join("");
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    streak = `<path d="${d}" fill="none" stroke="${C.goldHi}" stroke-opacity=".55" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round" class="draw" style="stroke-dasharray:${r1(len)};--len:${r1(len)};animation-delay:2.1s"/>`;
  }

  const glints = topIdx
    .map((i, k) => glint(pos[i][0], pos[i][1], k === 0 ? 7.5 : 5.2, { cls: "pulse", delay: -k * 1.1 }))
    .join("");
  const [tx, ty] = pos[todayIdx];
  const today =
    `<circle cx="${r1(tx)}" cy="${r1(ty)}" r="5" fill="none" stroke="${C.iceAccent}" stroke-width="1" class="ping" style="transform-origin:${r1(tx)}px ${r1(ty)}px"/>` +
    glint(tx, ty, 4.2, { color: C.ice, halo: "ny-halo-ice" });

  // Month ticks under the band, at each month's first week.
  let months = "", lastMonth = -1;
  days.forEach((d, i) => {
    const m = Number(d.date.slice(5, 7)) - 1;
    if (m !== lastMonth && d.weekday === 0 && d.week > 0 && d.week < weeks - 2) {
      const t = d.week / (weeks - 1);
      months += `<text class="m" x="${r1(left + t * (right - left))}" y="${h - 26}" font-size="14" text-anchor="middle" fill-opacity=".58">${MONTHS[m]}</text>`;
      lastMonth = m;
    } else if (lastMonth === -1) {
      lastMonth = m;
    }
  });

  const n1 = nebula("ny-neb-s1", 200, 250, 340, 90, 0.85);
  const n2 = nebula("ny-neb-s2", 600, 210, 340, 90, 0.85);
  const n3 = nebula("ny-neb-s3", 420, 200, 420, 60, 0.6);

  const lastDate = days[todayIdx]?.date;
  const parts = [`${fmt(stats.total)} contributions`];
  if (stats.busiest) parts.push(`busiest day ${fmt(stats.busiest.count)}`);
  if (stats.longestStreak.length >= 2) parts.push(`longest streak ${stats.longestStreak.length} days`);
  const statLine = parts.join(" · ");

  const body =
    n1.el + n2.el + n3.el +
    starfield({ w: W, h, count: 90, seed: `sky-dust-${lastDate}`, avoid: [{ x: 0, y: 120, w: W, h: 200 }] }) +
    `<g class="rise" style="animation-delay:.1s">` +
    `<text class="h" x="40" y="62" font-size="30">the last year, one star per day</text>` +
    `<text class="b" x="40" y="94" font-size="17">${esc(statLine)}</text>` +
    `</g>` +
    field + streak +
    `<g class="ig" style="animation-delay:1.6s">${glints}</g>` +
    `<g class="ig" style="animation-delay:2.2s">${today}</g>` +
    `<g class="rise" style="animation-delay:1.2s">${months}` +
    `<text class="m" x="${W - 40}" y="62" font-size="14" text-anchor="end" fill-opacity=".58">to ${esc(longDate(lastDate))}</text></g>`;

  return plate({
    id: "sky",
    h,
    title: `The last year of GitHub activity as a night sky: ${statLine}`,
    desc: `A star map of ${login}'s GitHub contributions for the year to ${longDate(lastDate)}: one star per day arranged in an arcing band, brighter for busier days, gold four-point stars on the five busiest days, the longest streak drawn as a gold line, and the most recent day pulsing at the right end. ${statLine}.`,
    defs: n1.def + n2.def + n3.def,
    css:
      "@keyframes ny-draw{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}.draw{animation:ny-draw 2.4s cubic-bezier(.65,0,.35,1) both}" +
      "@keyframes ny-ping{0%{transform:scale(.6);opacity:.9}80%,100%{transform:scale(2.6);opacity:0}}.ping{animation:ny-ping 3.2s cubic-bezier(.16,1,.3,1) infinite}",
    body,
  });
}

async function main() {
  const calendar = args.fixture
    ? JSON.parse(readFileSync(args.fixture, "utf8"))
    : await fetchCalendar();
  const svg = renderSky(calendar.data?.user?.contributionsCollection?.contributionCalendar ?? calendar);
  writeFileSync(outPath, svg);
  console.log(`sky written: ${outPath} (${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error(`render-sky: ${err.message}`);
  process.exit(1);
});
