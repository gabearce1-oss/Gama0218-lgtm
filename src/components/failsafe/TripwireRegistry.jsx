import { Radio } from 'lucide-react';
import { TRIPWIRES } from '@/lib/failsafe';

export default function TripwireRegistry({ counts = {} }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Radio className="h-4 w-4" /> Armed tripwires · {TRIPWIRES.length}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Each tripwire is armed by default. When it trips, the pipeline stops until a named human clears it.
      </p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {TRIPWIRES.map((t) => {
          const open = counts[t.id] || 0;
          return (
            <div key={t.id} className="rounded-md border border-border bg-background/40 p-4">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-mono text-xs text-primary">{t.id}</span>
                <span className="text-sm font-bold">{t.name}</span>
                {open > 0 && (
                  <span className="rounded border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 font-mono text-[10px] text-red-300">
                    {open} open
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Watches: </span>{t.watches}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">On trip: </span>{t.onTrip}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}