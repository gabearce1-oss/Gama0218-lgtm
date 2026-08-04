import { Sigma } from 'lucide-react';
import { STRATUM, S1_ROWS } from '@/lib/frameStratum';
import { describe, pearson, groupBy } from '@/lib/frameStats';

const f2 = (v) => (v === null ? '\u2014' : v.toFixed(2));

const VARS = [
  { key: 'cr', label: 'CR (combined)' },
  { key: 'ur', label: 'UR' },
  { key: 'gr', label: 'GR' },
];

export default function DescriptivesPanel() {
  const stats = VARS.map((v) => describe(v.label, S1_ROWS.map((r) => r[v.key])));
  const rUrGr = pearson(S1_ROWS.map((r) => r.ur), S1_ROWS.map((r) => r.gr));
  const rUrCr = pearson(S1_ROWS.map((r) => r.ur), S1_ROWS.map((r) => r.cr));
  const rGrCr = pearson(S1_ROWS.map((r) => r.gr), S1_ROWS.map((r) => r.cr));
  const byFormat = groupBy(S1_ROWS, 'f', 'cr');
  const byStatus = groupBy(S1_ROWS, 's', 'cr');

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
        <Sigma className="h-4 w-4" /> Descriptive statistics · stratum {STRATUM.id}
      </div>
      <h2 className="mt-1 text-xl font-bold tracking-tight">Frame Descriptives</h2>
      <p className="mt-1 text-xs leading-6 text-muted-foreground">
        {STRATUM.definition} N = {STRATUM.n}. Computed by plain arithmetic on the transcribed values; percentiles use
        linear interpolation. Reproducible by hand.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="p-2 text-left">Variable</th>
              <th className="p-2 text-right">N</th>
              <th className="p-2 text-right">Mean</th>
              <th className="p-2 text-right">SD</th>
              <th className="p-2 text-right">Min</th>
              <th className="p-2 text-right">Q1</th>
              <th className="p-2 text-right">Median</th>
              <th className="p-2 text-right">Q3</th>
              <th className="p-2 text-right">Max</th>
              <th className="p-2 text-right">Skew</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {stats.map((s) => (
              <tr key={s.label} className="border-b border-border/50">
                <td className="p-2 font-sans font-medium">{s.label}</td>
                <td className="p-2 text-right">{s.n}</td>
                <td className="p-2 text-right font-bold text-primary">{f2(s.mean)}</td>
                <td className="p-2 text-right">{f2(s.sd)}</td>
                <td className="p-2 text-right">{s.min}</td>
                <td className="p-2 text-right">{f2(s.q1)}</td>
                <td className="p-2 text-right">{f2(s.median)}</td>
                <td className="p-2 text-right">{f2(s.q3)}</td>
                <td className="p-2 text-right">{s.max}</td>
                <td className="p-2 text-right">{f2(s.skew)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-md border border-border bg-background/40 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Correlations (Pearson r)</div>
          <ul className="mt-2 space-y-1 font-mono text-xs">
            <li>UR × GR &nbsp; <span className="font-bold text-orange-300">{f2(rUrGr)}</span></li>
            <li>UR × CR &nbsp; <span className="font-bold">{f2(rUrCr)}</span></li>
            <li>GR × CR &nbsp; <span className="font-bold">{f2(rGrCr)}</span></li>
          </ul>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
            UR and CR are not independent of GR: CR = UR + GR by construction, so those two r values are structural, not
            findings. The UR × GR figure is the only one that carries information.
          </p>
        </div>

        <div className="rounded-md border border-border bg-background/40 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mean CR by format</div>
          <table className="mt-2 w-full text-xs">
            <tbody className="font-mono">
              {byFormat.map((g) => (
                <tr key={g.name} className="border-b border-border/40">
                  <td className="py-1 font-sans">{g.name}</td>
                  <td className="py-1 text-right text-muted-foreground">n={g.n}</td>
                  <td className="py-1 text-right font-bold text-primary">{f2(g.mean)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-md border border-border bg-background/40 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mean CR by status</div>
          <table className="mt-2 w-full text-xs">
            <tbody className="font-mono">
              {byStatus.map((g) => (
                <tr key={g.name} className="border-b border-border/40">
                  <td className="py-1 font-sans">{g.name}</td>
                  <td className="py-1 text-right text-muted-foreground">n={g.n}</td>
                  <td className="py-1 text-right font-bold text-primary">{f2(g.mean)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
            Group means with small n are descriptive only. No significance test is reported because no hypothesis was
            declared before the data was seen.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-orange-500/30 bg-orange-500/5 p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-orange-400">Truncation warning</div>
        <p className="mt-1 text-xs leading-6">{STRATUM.excluded}</p>
        <p className="mt-1.5 text-xs leading-6 text-orange-200">{STRATUM.consequence}</p>
      </div>
    </section>
  );
}