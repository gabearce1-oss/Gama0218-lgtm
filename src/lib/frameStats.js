// Descriptive statistics for the Canon Chart stratum. Plain arithmetic on the
// transcribed values — no model, no estimation, no imputation. Every figure here
// is reproducible by hand from src/lib/frameStratum.js.

const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;

const sd = (xs) => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
};

// Linear interpolation percentile (SPSS default, weighted average at n+1 ranks)
const quantile = (xs, p) => {
  const s = [...xs].sort((a, b) => a - b);
  const pos = p * (s.length + 1) - 1;
  if (pos <= 0) return s[0];
  if (pos >= s.length - 1) return s[s.length - 1];
  const lo = Math.floor(pos);
  return s[lo] + (pos - lo) * (s[lo + 1] - s[lo]);
};

const skewness = (xs) => {
  const m = mean(xs);
  const s = sd(xs);
  const n = xs.length;
  return (n / ((n - 1) * (n - 2))) * xs.reduce((acc, x) => acc + ((x - m) / s) ** 3, 0);
};

export const pearson = (xs, ys) => {
  const mx = mean(xs);
  const my = mean(ys);
  const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const den = Math.sqrt(
    xs.reduce((s, x) => s + (x - mx) ** 2, 0) * ys.reduce((s, y) => s + (y - my) ** 2, 0),
  );
  return num / den;
};

export const describe = (label, xs) => ({
  label,
  n: xs.length,
  mean: mean(xs),
  sd: sd(xs),
  min: Math.min(...xs),
  max: Math.max(...xs),
  q1: quantile(xs, 0.25),
  median: quantile(xs, 0.5),
  q3: quantile(xs, 0.75),
  skew: skewness(xs),
});

// Percentile rank WITHIN the supplied stratum only.
export const percentileRank = (xs, value) => {
  const below = xs.filter((x) => x < value).length;
  const equal = xs.filter((x) => x === value).length;
  return ((below + 0.5 * equal) / xs.length) * 100;
};

export const groupBy = (rows, key, field) => {
  const map = new Map();
  rows.forEach((r) => {
    if (!map.has(r[key])) map.set(r[key], []);
    map.get(r[key]).push(r[field]);
  });
  return [...map.entries()]
    .map(([name, xs]) => ({ name, n: xs.length, mean: mean(xs), sd: xs.length > 1 ? sd(xs) : null }))
    .sort((a, b) => b.mean - a.mean);
};