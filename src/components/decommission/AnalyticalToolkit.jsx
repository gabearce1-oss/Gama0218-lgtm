import { Calculator } from 'lucide-react';
import { TOOLKIT } from '@/lib/aiDecommission';

export default function AnalyticalToolkit() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
        <Calculator className="h-4 w-4" /> Approved analytical toolkit
      </div>
      <h2 className="mt-1 text-xl font-bold tracking-tight">What the research uses instead</h2>
      <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
        Ordinary statistics, applied to hand-coded data. Every one of these can be recomputed in SPSS — or on paper —
        from values stored in the workbooks.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="p-2">Tool</th>
              <th className="p-2">What it answers</th>
              <th className="p-2">Outputs</th>
              <th className="p-2">Why admissible</th>
            </tr>
          </thead>
          <tbody>
            {TOOLKIT.map((t) => (
              <tr key={t.tool} className="border-b border-border/50 align-top">
                <td className="p-2 font-semibold text-primary">{t.tool}</td>
                <td className="p-2 leading-6">{t.answers}</td>
                <td className="p-2 font-mono text-xs leading-6 text-muted-foreground">{t.outputs}</td>
                <td className="p-2 leading-6 text-emerald-200">{t.why_admissible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}