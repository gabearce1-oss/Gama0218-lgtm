import { ListChecks } from 'lucide-react';
import { RETAINED_METRICS, ADMISSION_BAR } from '@/lib/proseMetricStanding';

export default function RetainedMetricsTable() {
  return (
    <section className="rounded-lg border border-emerald-500/25 bg-emerald-500/5">
      <header className="border-b border-emerald-500/20 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-300">
          <ListChecks className="h-3.5 w-3.5" /> Retained · craft measurement lane
        </div>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight">Metrics That Survive and Stay on the Milestone List</h2>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          These are the prose measurements of standing interest. They are kept, not retired — separated from the canon
          question and reported as craft data.
        </p>
      </header>

      <div className="p-5 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-[11px]">
            <thead>
              <tr className="border-b border-emerald-500/20 text-[9px] uppercase tracking-wider text-foreground/60">
                <th className="pb-2 pr-3 font-bold">Metric</th>
                <th className="pb-2 pr-3 font-bold">What it measures</th>
                <th className="pb-2 font-bold">Why it stays</th>
              </tr>
            </thead>
            <tbody>
              {RETAINED_METRICS.map((m) => (
                <tr key={m.metric} className="border-b border-emerald-500/10 align-top last:border-0">
                  <td className="py-2.5 pr-3 font-bold text-foreground">{m.metric}</td>
                  <td className="py-2.5 pr-3 leading-relaxed text-muted-foreground">{m.measures}</td>
                  <td className="py-2.5 leading-relaxed text-muted-foreground">{m.why_it_matters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-md border border-border bg-background/40 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">
            Admission bar · what each figure must carry
          </div>
          <ul className="mt-2 space-y-1.5">
            {ADMISSION_BAR.map((rule) => (
              <li key={rule} className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}