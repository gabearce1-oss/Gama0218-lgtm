import { Trash2, ArrowRight } from 'lucide-react';
import { DECOMMISSIONED } from '@/lib/aiDecommission';

export default function DecommissionedTable() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-400">
        <Trash2 className="h-4 w-4" /> Removed components
      </div>
      <h2 className="mt-1 text-xl font-bold tracking-tight">What comes out, and why</h2>
      <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
        The disqualifying property is not that a machine was involved — it is that the output cannot be recomputed by a
        human from the page. Vector proximity and social physics are the worst of it: both convert cultural difference
        into measured error while presenting as geometry.
      </p>

      <div className="mt-4 space-y-3">
        {DECOMMISSIONED.map((d) => (
          <article key={d.id} className="rounded-md border border-border bg-background/40 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-red-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-red-300">
                {d.id}
              </span>
              <h3 className="font-semibold line-through decoration-red-500/60">{d.component}</h3>
            </div>
            <dl className="mt-2 space-y-2 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Claimed to measure</dt>
                <dd className="leading-6">{d.claimed}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">How it was compromised</dt>
                <dd className="leading-6">{d.compromised}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Auditability</dt>
                <dd className="leading-6 text-orange-200">{d.unauditable}</dd>
              </div>
            </dl>
            <p className="mt-2 flex gap-2 border-t border-border pt-2 text-sm leading-6 text-emerald-300">
              <ArrowRight className="mt-1 h-4 w-4 shrink-0" />
              {d.replaced_by}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}