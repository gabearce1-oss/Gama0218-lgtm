import { STATUS_META } from '@/lib/integrationStack';

export default function IntegrationLane({ lane }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">{lane.lane}</h2>
      <div className="mt-3 grid gap-2 lg:grid-cols-2">
        {lane.items.map((it) => {
          const meta = STATUS_META[it.status];
          return (
            <div key={it.name} className="rounded-md border border-border/60 bg-background/40 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{it.name}</span>
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${meta.style}`}>{meta.label}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{it.does}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/80">{it.usedBy}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}