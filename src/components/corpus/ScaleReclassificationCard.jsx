import { Ruler, X, Check } from 'lucide-react';
import { SCALE_TRUTH } from '@/lib/scaleReclassification';

export default function ScaleReclassificationCard() {
  return (
    <section className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
        <Ruler className="h-4 w-4" /> Scale reclassification · governing correction
      </div>
      <h2 className="mt-1 text-2xl font-bold tracking-tight">This is an advanced-statistics scale, not a canon protocol</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6">{SCALE_TRUTH.what_it_is}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border bg-background/40 p-4">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            <Check className="h-3.5 w-3.5" /> What it measures
          </div>
          <p className="mt-2 text-sm leading-6">{SCALE_TRUTH.measures}</p>
          <p className="mt-2 font-mono text-[11px] leading-5 text-muted-foreground">{SCALE_TRUTH.statistical_class}</p>
        </div>
        <div className="rounded-md border border-border bg-background/40 p-4">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
            <X className="h-3.5 w-3.5" /> What it does not measure
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {SCALE_TRUTH.does_not_measure.map((d) => (
              <li key={d} className="flex gap-2 leading-6">
                <span className="text-red-400">·</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <p className="border-l-2 border-amber-400 pl-3 text-sm leading-6">{SCALE_TRUTH.consequence}</p>
        <p className="border-l-2 border-emerald-500/60 pl-3 text-sm leading-6 text-muted-foreground">
          <span className="font-semibold text-emerald-300">Legitimate use: </span>
          {SCALE_TRUTH.correct_use}
        </p>
      </div>
    </section>
  );
}