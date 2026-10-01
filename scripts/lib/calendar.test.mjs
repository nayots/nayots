import { test } from "node:test";
import assert from "node:assert/strict";
import { flattenDays, summarize, levels } from "./calendar.mjs";

const day = (date, count) => ({ date, contributionCount: count });
const cal = (counts, start = "2026-01-04") => {
  const d0 = new Date(`${start}T00:00:00Z`);
  const days = counts.map((c, i) => day(new Date(d0.getTime() + i * 864e5).toISOString().slice(0, 10), c));
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push({ contributionDays: days.slice(i, i + 7) });
  return { totalContributions: counts.reduce((a, b) => a + b, 0), weeks };
};

test("flattenDays keeps calendar order and week/weekday positions", () => {
  const days = flattenDays(cal([1, 2, 3, 4, 5, 6, 7, 8]));
  assert.equal(days.length, 8);
  assert.deepEqual(days.map((d) => [d.week, d.weekday]), [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 0]]);
});

test("summarize finds total, busiest day and longest streak", () => {
  const s = summarize(flattenDays(cal([0, 2, 3, 0, 1, 1, 1, 9, 0, 4])));
  assert.equal(s.total, 21);
  assert.equal(s.busiest.count, 9);
  assert.equal(s.busiest.date, "2026-01-11");
  assert.equal(s.longestStreak.length, 4);
  assert.equal(s.longestStreak.start, 4);
  assert.equal(s.activeDays, 7);
});

test("summarize handles a year with no activity", () => {
  const s = summarize(flattenDays(cal([0, 0, 0, 0, 0, 0, 0])));
  assert.equal(s.total, 0);
  assert.equal(s.busiest, null);
  assert.equal(s.longestStreak.length, 0);
});

test("levels splits active days into quartiles and leaves zero days at 0", () => {
  const counts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0];
  const lv = levels(counts);
  assert.equal(lv[0], 0);
  assert.equal(lv[9], 0);
  assert.equal(lv[1], 1);
  assert.equal(lv[8], 4);
  assert.ok(lv.slice(1, 9).every((l, i, a) => i === 0 || l >= a[i - 1]));
});
