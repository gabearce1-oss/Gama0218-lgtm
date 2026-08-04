// Imaging math over MEASURED chapter rows. No modeling, no imputation —
// every point plotted is a stored value from the registry.
import { VARIABLE_DICTIONARY } from '@/lib/spssProtocol';

const fieldOf = (name) => VARIABLE_DICTIONARY.find((v) => v.name === name)?.field;
const labelOf = (name) => VARIABLE_DICTIONARY.find((v) => v.name === name)?.label || name;

const nums = (rows, name) => {
  const f = fieldOf(name);
  return rows.map((r) => r[f]).filter((v) => typeof v === 'number' && !Number.isNaN(v));
};

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const sd = (a) => {
  if (a.length < 2) return 0;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1));
};

export function pearson(x, y) {
  const n = Math.min(x.length, y.length);
  if (n < 3) return null;
  const mx = mean(x.slice(0, n));
  const my = mean(y.slice(0, n));
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i] - mx, b = y[i] - my;
    num += a * b; dx += a * a; dy += b * b;
  }
  return dx && dy ? num / Math.sqrt(dx * dy) : null;
}

export function applyFrame(chapters, frame) {
  if (!frame?.filter) return chapters;
  if (frame.filter.startsWith('CHSTAT')) return chapters.filter((c) => c.status === 'scored');
  if (frame.filter.startsWith('ACT')) {
    const act = frame.filter.split('"')[1];
    return chapters.filter((c) => c.act === act);
  }
  if (frame.filter.startsWith('OMEGA')) return chapters.filter((c) => (c.omega || 0) >= 109.5);
  return chapters;
}

function histogram(rows, name, bins = 8) {
  const vals = nums(rows, name);
  if (!vals.length) return [];
  const min = Math.min(...vals), max = Math.max(...vals);
  const width = (max - min) / bins || 1;
  return Array.from({ length: bins }, (_, i) => {
    const lo = min + i * width;
    const hi = lo + width;
    const count = vals.filter((v) => (i === bins - 1 ? v <= hi : v < hi) && v >= lo).length;
    return { bin: lo.toFixed(1), count };
  });
}

function categoryCounts(rows, name) {
  const f = fieldOf(name);
  const map = {};
  rows.forEach((r) => {
    const k = r[f] == null || r[f] === '' ? '(missing)' : String(r[f]);
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map).map(([category, count]) => ({ category, count }));
}

function scatter(rows, xName, yName) {
  const fx = fieldOf(xName), fy = fieldOf(yName);
  return rows
    .filter((r) => typeof r[fx] === 'number' && typeof r[fy] === 'number')
    .map((r) => ({ x: r[fx], y: r[fy], ch: r.chapter_number }));
}

function groupMeans(rows, dv, factor) {
  const fd = fieldOf(dv), ff = fieldOf(factor);
  const groups = {};
  rows.forEach((r) => {
    if (typeof r[fd] !== 'number') return;
    const k = r[ff] == null || r[ff] === '' ? '(missing)' : String(r[ff]);
    (groups[k] = groups[k] || []).push(r[fd]);
  });
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, vals]) => ({
      group,
      n: vals.length,
      mean: Number(mean(vals).toFixed(2)),
      se: Number((sd(vals) / Math.sqrt(vals.length) || 0).toFixed(2)),
    }));
}

/** Returns the imaging spec for a planned test, computed from real rows. */
export function computeImaging({ test, rows, dv, factor, vars }) {
  const n = rows.length;
  switch (test.id) {
    case 'FREQ': {
      const v = vars[0];
      return v ? { kind: 'bar', title: `Frequencies — ${labelOf(v)}`, n, data: categoryCounts(rows, v) } : null;
    }
    case 'DESC': {
      const v = vars[0];
      return v ? { kind: 'histogram', title: `Distribution — ${labelOf(v)}`, n, data: histogram(rows, v) } : null;
    }
    case 'CORR':
    case 'RELY':
    case 'FACT': {
      if (vars.length < 2) return null;
      const base = vars[0];
      const bx = nums(rows, base);
      const data = vars.slice(1).map((v) => ({
        pair: v,
        r: Number((pearson(scatter(rows, base, v).map((p) => p.x), scatter(rows, base, v).map((p) => p.y)) ?? 0).toFixed(3)),
      }));
      return {
        kind: 'rbar',
        title: `Association strength vs ${base}`,
        n: bx.length,
        data,
        scatter: { points: scatter(rows, base, vars[1]), x: base, y: vars[1] },
      };
    }
    case 'REG': {
      if (!dv || !vars.length) return null;
      const data = vars.map((v) => {
        const pts = scatter(rows, v, dv);
        return { pair: v, r: Number((pearson(pts.map((p) => p.x), pts.map((p) => p.y)) ?? 0).toFixed(3)) };
      });
      return {
        kind: 'rbar',
        title: `Predictor association with ${dv}`,
        n: nums(rows, dv).length,
        data,
        scatter: { points: scatter(rows, vars[0], dv), x: vars[0], y: dv },
      };
    }
    case 'ANOVA':
    case 'TTEST': {
      if (!dv || !factor) return null;
      return { kind: 'means', title: `${labelOf(dv)} by ${labelOf(factor)}`, n, data: groupMeans(rows, dv, factor) };
    }
    default:
      return null;
  }
}