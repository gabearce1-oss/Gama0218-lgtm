import { ListOrdered } from 'lucide-react';
import { LOCKED_PHASE_ORDER } from '@/lib/thesisFramework';

export default function LockedPhaseOrder() {
  return (
    <section className="rounded-lg border border-border bg-card/40 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <ListOrdered className="h-4 w-4" /> Locked phase order
      </div>
      <h2 className="mt-1 text-xl font-bold">Nothing Starts Before The Step Above It Closes</h2>
      <ol className="mt-4 space-y-3">
        {LOCKED_PHASE_ORDER.map((p) => (
          <li key={p.n} className="flex gap-3 rounded-lg border border-border bg-card p-4">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 font-mono text-xs text-amber-400">
              {p.n}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold">{p.name}</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{p.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}