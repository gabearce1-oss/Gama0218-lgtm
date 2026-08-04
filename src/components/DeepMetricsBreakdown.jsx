import { Sigma, TrendingDown, AlertTriangle, Layers, BarChart3, Activity } from 'lucide-react';

const REGRESSION = {
  formula: 'Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.067·MRF',
  rSquared: 0.947,
  cronbachAlpha: 0.938,
  n: 45,
  seed: 42,
};

const COMPONENTS = [
  { code: 'CLS', name: 'Code-switch / Cohesion Load', mean: 89.92, sigma: 6.81, min: 75.0, max: 99.0, weight: 0.124 },
  { code: 'BIS', name: 'Behavioral Intensity Score', mean: 89.12, sigma: 3.81, min: 75.5, max: 97.0, weight: 0.118 },
  { code: 'SII', name: 'Structural Integrity Index', mean: 92.32, sigma: 3.19, min: 80.2, max: 98.0, weight: 0.089 },
  { code: 'MRF', name: 'Manuscript Reference Field', mean: 89.38, sigma: 7.51, min: 68.0, max: 99.0, weight: 0.067 },
];

const RRP = { mean: 89.56, sigma: 3.51, min: 83, max: 96, correlation: 0.955 };

const PER_ACT = [
  { act: 'I', name: 'Setup', span: '1–17', n: 17, mean: 107.26, sigma: 1.28, min: 105, max: 109 },
  { act: 'II', name: 'Ordeal', span: '18–32', n: 15, mean: 107.13, sigma: 1.20, min: 105, max: 109 },
  { act: 'III', name: 'Return', span: '33–45', n: 13, mean: 107.69, sigma: 1.20, min: 106, max: 110 },
];

const FLOOR_CHAPTERS = [
  { ch: 2, title: 'Descent Into Baptism', act: 'I', omega: 105.0, cls: -10.92, bis: 0.88, sii: 0.68, mrf: -11.38, fix: 'MED' },
  { ch: 17, title: 'Boundary Shift Equation', act: 'I', omega: 105.0, cls: -12.92, bis: -1.12, sii: 0.68, mrf: -4.38, fix: 'MED' },
  { ch: 20, title: 'The Genesis Equation', act: 'II', omega: 105.0, cls: -6.92, bis: -5.12, sii: -4.32, mrf: -12.38, fix: 'LOW' },
  { ch: 29, title: 'Mathematics of Revolution', act: 'II', omega: 105.0, cls: -14.92, bis: 2.88, sii: -2.32, mrf: -4.38, fix: 'HIGH' },
];

const CRITICAL_FLAGS = [
  {
    flag: 'Near-Duplicate Openings',
    severity: 'CRITICAL',
    chapters: 'Ch.9 / Ch.10',
    detail: '700+ shared lines between First Blood and The Pendejo Squad. Both score Ω=108 but would not survive editorial pass.',
  },
];

const MARKET_METRICS = [
  { category: 'Pulitzer Vector', name: 'Style Originality', mean: 89.70, sigma: 5.85, min: 78.6, max: 99.0 },
  { category: 'Pulitzer Vector', name: 'Historical Resonance', mean: 90.85, sigma: 4.84, min: 74.1, max: 98.5 },
  { category: 'Pulitzer Vector', name: 'Moral Ambiguity', mean: 89.41, sigma: 3.71, min: 77.5, max: 99.0 },
];

const FIX_STYLES = {
  HIGH: 'bg-red-500/15 text-red-400 border-red-500/30',
  MED: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  LOW: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

function gapColor(val) {
  if (val >= 0) return 'text-emerald-400';
  return 'text-red-400';
}

export default function DeepMetricsBreakdown() {
  return (
    <div className="space-y-6 mb-8">
      {/* Regression Formula */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sigma className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Hybrid Omega Regression (Canonical)</h2>
        </div>
        <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-4 mb-4">
          <code className="font-mono text-sm md:text-base text-amber-300 break-all">{REGRESSION.formula}</code>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">R²</div>
            <div className="font-mono text-xl font-bold text-emerald-400">{REGRESSION.rSquared}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Cronbach α</div>
            <div className="font-mono text-xl font-bold text-emerald-400">{REGRESSION.cronbachAlpha}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">N (Chapters)</div>
            <div className="font-mono text-xl font-bold text-amber-400">{REGRESSION.n}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Seed</div>
            <div className="font-mono text-xl font-bold text-muted-foreground">{REGRESSION.seed}</div>
          </div>
        </div>
      </div>

      {/* Component Weights */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold">Regression Components</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 pr-4">Code</th>
                <th className="py-2 pr-4">Component</th>
                <th className="py-2 pr-4 text-right">Mean</th>
                <th className="py-2 pr-4 text-right">σ</th>
                <th className="py-2 pr-4 text-right">Min</th>
                <th className="py-2 pr-4 text-right">Max</th>
                <th className="py-2 text-right">Weight</th>
              </tr>
            </thead>
            <tbody>
              {COMPONENTS.map(c => (
                <tr key={c.code} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-mono font-bold text-amber-400">{c.code}</td>
                  <td className="py-2 pr-4 text-xs">{c.name}</td>
                  <td className="py-2 pr-4 text-right font-mono">{c.mean.toFixed(2)}</td>
                  <td className="py-2 pr-4 text-right font-mono text-muted-foreground">{c.sigma.toFixed(2)}</td>
                  <td className="py-2 pr-4 text-right font-mono text-red-400">{c.min.toFixed(1)}</td>
                  <td className="py-2 pr-4 text-right font-mono text-emerald-400">{c.max.toFixed(1)}</td>
                  <td className="py-2 text-right font-mono font-bold text-cyan-400">{c.weight.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-md border border-border bg-background/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-bold text-violet-400">RRP — Reader Retention Prediction</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>Mean: <span className="font-mono text-violet-400">{RRP.mean}</span></div>
            <div>σ: <span className="font-mono text-muted-foreground">{RRP.sigma}</span></div>
            <div>Range: <span className="font-mono">{RRP.min}–{RRP.max}</span></div>
            <div>r with Ω: <span className="font-mono text-emerald-400">{RRP.correlation}</span></div>
          </div>
        </div>
      </div>

      {/* Per-Act Breakdown */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold">Per-Act Ω Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PER_ACT.map(act => (
            <div key={act.act} className={`rounded-md border p-4 ${act.act === 'III' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-background/50'}`}>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <span className="font-mono text-lg font-bold text-amber-400">Act {act.act}</span>
                  <span className="text-xs text-muted-foreground ml-2">{act.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Ch. {act.span}</span>
              </div>
              <div className="font-mono text-3xl font-bold mb-2 ${act.act === 'III' ? 'text-emerald-400' : 'text-foreground'}">
                {act.mean.toFixed(2)}
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="text-muted-foreground">σ <span className="font-mono text-foreground">{act.sigma.toFixed(2)}</span></div>
                <div className="text-muted-foreground">Min <span className="font-mono text-red-400">{act.min}</span></div>
                <div className="text-muted-foreground">Max <span className="font-mono text-emerald-400">{act.max}</span></div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Act III (Return) is the strongest band — correct pacing signature for a war/exile narrative arc.
        </p>
      </div>

      {/* Floor Chapter Gap Analysis */}
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-bold text-red-400">Floor Chapter Gap Analysis (Ω = 105)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-red-500/20 text-left text-xs text-muted-foreground">
                <th className="py-2 pr-4">Ch</th>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4 text-center">Ω</th>
                <th className="py-2 pr-4 text-right">CLS Gap</th>
                <th className="py-2 pr-4 text-right">BIS Gap</th>
                <th className="py-2 pr-4 text-right">SII Gap</th>
                <th className="py-2 pr-4 text-right">MRF Gap</th>
                <th className="py-2 text-center">Fix</th>
              </tr>
            </thead>
            <tbody>
              {FLOOR_CHAPTERS.map(ch => (
                <tr key={ch.ch} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-mono font-bold">{ch.ch}</td>
                  <td className="py-2 pr-4 text-xs">{ch.title}</td>
                  <td className="py-2 pr-4 text-center font-mono font-bold text-red-400">{ch.omega.toFixed(1)}</td>
                  <td className={`py-2 pr-4 text-right font-mono ${gapColor(ch.cls)}`}>{ch.cls > 0 ? '+' : ''}{ch.cls.toFixed(2)}</td>
                  <td className={`py-2 pr-4 text-right font-mono ${gapColor(ch.bis)}`}>{ch.bis > 0 ? '+' : ''}{ch.bis.toFixed(2)}</td>
                  <td className={`py-2 pr-4 text-right font-mono ${gapColor(ch.sii)}`}>{ch.sii > 0 ? '+' : ''}{ch.sii.toFixed(2)}</td>
                  <td className={`py-2 pr-4 text-right font-mono ${gapColor(ch.mrf)}`}>{ch.mrf > 0 ? '+' : ''}{ch.mrf.toFixed(2)}</td>
                  <td className="py-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${FIX_STYLES[ch.fix]}`}>{ch.fix}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Negative CLS (code-switch density) and negative MRF (cross-reference density) are the dominant drivers.
          Ch.29 <span className="text-red-400">Mathematics of Revolution</span> has the worst single-chapter CLS gap (−14.92) — priority intervention.
        </p>
      </div>

      {/* Critical Flags */}
      <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-bold text-red-400">Critical Audit Flags</h2>
        </div>
        {CRITICAL_FLAGS.map((flag, i) => (
          <div key={i} className="rounded-md border border-red-500/30 bg-red-500/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-red-400">{flag.flag}</span>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold border border-red-500/40 bg-red-500/20 text-red-400">
                {flag.severity}
              </span>
            </div>
            <div className="text-xs text-amber-400 font-mono mb-1">{flag.chapters}</div>
            <p className="text-sm text-muted-foreground">{flag.detail}</p>
          </div>
        ))}
      </div>

      {/* Market Metrics */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Market Metrics — Pulitzer Vector</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MARKET_METRICS.map(m => (
            <div key={m.name} className="rounded-md border border-border bg-background/50 p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{m.category}</div>
              <div className="text-sm font-semibold mb-2">{m.name}</div>
              <div className="font-mono text-2xl font-bold text-amber-400 mb-2">{m.mean.toFixed(2)}</div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="text-muted-foreground">σ <span className="font-mono text-foreground">{m.sigma.toFixed(2)}</span></div>
                <div className="text-muted-foreground">Min <span className="font-mono text-red-400">{m.min.toFixed(1)}</span></div>
                <div className="text-muted-foreground">Max <span className="font-mono text-emerald-400">{m.max.toFixed(1)}</span></div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          All dimensions cluster 89–91 mean — strong by the framework's own benchmarks.
          Historical Resonance leads at 90.85 — engagement with WWII/Vietnam history is the manuscript's market strength.
        </p>
      </div>
    </div>
  );
}