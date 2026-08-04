import { useState } from 'react';
import { ListOrdered } from 'lucide-react';
import { S1_ROWS, STRATUM } from '@/lib/frameStratum';
import { percentileRank } from '@/lib/frameStats';

const CONTROLS = ['The Sun Also Rises', 'The Iliad', 'Slaughterhouse Five', 'War and Peace', 'One Hundred Years of Solitude'];

export default function StratumRankTable() {
  const [onlyControls, setOnlyControls] = useState(false);
  const crs = S1_ROWS.map((r) => r.cr);
  const ranked = [...S1_ROWS]
    .sort((a, b) => b.cr - a.cr)
    .map((r, i) => ({ ...r, rank: i + 1, pct: percentileRank(crs, r.cr) }));
  const rows = onlyControls ? ranked.filter((r) => CONTROLS.includes(r.t)) : ranked;

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
            <ListOrdered className="h-4 w-4" /> Ranked by CR · stratum {STRATUM.id}
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Scoring Criteria Ranking</h2>
        </div>
        <button
          onClick={() => setOnlyControls((v) => !v)}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/50"
        >
          {onlyControls ? 'Show all 85' : 'Show comparison texts only'}
        </button>
      </div>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        Percentile is computed <span className="font-semibold">within stratum {STRATUM.id} only</span> — it is a position
        among these 85 texts, not a position in the chart and not a position in any canon. Ties share a percentile.
      </p>

      <div className="mt-4 max-h-[520px] overflow-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="p-2 text-right">#</th>
              <th className="p-2 text-left">Text</th>
              <th className="p-2 text-left">Format</th>
              <th className="p-2 text-right">UR</th>
              <th className="p-2 text-right">GR</th>
              <th className="p-2 text-right">CR</th>
              <th className="p-2 text-right">Pctl (S1)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.t}
                className={`border-b border-border/50 ${CONTROLS.includes(r.t) ? 'bg-primary/10' : ''}`}
              >
                <td className="p-2 text-right font-mono text-xs text-muted-foreground">{r.rank}</td>
                <td className="p-2 font-medium">{r.t}</td>
                <td className="p-2 text-xs text-muted-foreground">{r.f}</td>
                <td className="p-2 text-right font-mono">{r.ur}</td>
                <td className="p-2 text-right font-mono">{r.gr}</td>
                <td className="p-2 text-right font-mono font-bold text-primary">{r.cr}</td>
                <td className="p-2 text-right font-mono text-xs">{r.pct.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}