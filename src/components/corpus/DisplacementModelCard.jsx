import { Compass, Layers } from 'lucide-react';
import { OBJECTIVE, MODEL_LAYERS } from '@/lib/scaleReclassification';

export default function DisplacementModelCard() {
  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-primary/40 bg-primary/5 p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Compass className="h-4 w-4" /> Corrected objective function
        </div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">The goal is not canon</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <p className="rounded-md border border-red-500/30 bg-red-500/5 p-3 text-sm leading-6">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-red-400">Not this</span>
            {OBJECTIVE.is_not}
          </p>
          <p className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm leading-6">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-400">This</span>
            {OBJECTIVE.is}
          </p>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{OBJECTIVE.implication}</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
          <Layers className="h-4 w-4" /> Re-specification
        </div>
        <h2 className="mt-1 text-xl font-bold tracking-tight">How governance, baseline and internal scoring should be modeled</h2>
        <div className="mt-4 space-y-4">
          {MODEL_LAYERS.map((l) => (
            <article key={l.layer} className="rounded-md border border-border bg-background/40 p-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-lg font-bold text-primary">{l.layer}</h3>
                <span className="text-xs italic text-muted-foreground">{l.question}</span>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <p className="rounded border border-border/60 bg-red-500/5 p-2.5 text-xs leading-6">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-red-400">Was</span>
                  {l.old}
                </p>
                <p className="rounded border border-border/60 bg-emerald-500/5 p-2.5 text-xs leading-6">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Now</span>
                  {l.now}
                </p>
              </div>
              <ol className="mt-3 space-y-1.5 text-sm">
                {l.rules.map((r, i) => (
                  <li key={r} className="flex gap-2.5 leading-6">
                    <span className="mt-0.5 font-mono text-[11px] text-primary">{String(i + 1).padStart(2, '0')}</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}