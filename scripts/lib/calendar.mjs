// Pure helpers over GitHub's contributionCalendar shape. No I/O.

export function flattenDays(calendar) {
  const days = [];
  calendar.weeks.forEach((w, week) => {
    w.contributionDays.forEach((d) => {
      const weekday = new Date(`${d.date}T00:00:00Z`).getUTCDay();
      days.push({ date: d.date, count: d.contributionCount, week, weekday });
    });
  });
  return days;
}

export function summarize(days) {
  let total = 0, activeDays = 0, busiest = null;
  let run = 0, runStart = 0;
  let longestStreak = { length: 0, start: -1 };
  days.forEach((d, i) => {
    total += d.count;
    if (d.count > 0) {
      activeDays++;
      if (!busiest || d.count > busiest.count) busiest = { date: d.date, count: d.count, index: i };
      if (run === 0) runStart = i;
      run++;
      if (run > longestStreak.length) longestStreak = { length: run, start: runStart };
    } else {
      run = 0;
    }
  });
  return { total, activeDays, busiest, longestStreak };
}

// 0 for no activity, 1-4 by quartile of the active days' counts.
export function levels(counts) {
  const active = counts.filter((c) => c > 0).sort((a, b) => a - b);
  if (!active.length) return counts.map(() => 0);
  const q = (p) => active[Math.min(active.length - 1, Math.floor(p * active.length))];
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  return counts.map((c) => (c <= 0 ? 0 : c < q1 ? 1 : c < q2 ? 2 : c < q3 ? 3 : 4));
}
