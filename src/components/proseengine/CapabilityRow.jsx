import VerdictBadge from './VerdictBadge';

export default function CapabilityRow({ item }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="shrink-0 font-mono text-xs text-amber-400">{item.id}</span>
          <h3 className="min-w-0 text-sm font-bold">{item.capability}</h3>
        </div>
        <div className="shrink-0">
          <VerdictBadge verdict={item.verdict} />
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.observed}</p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Author pain addressed</dt>
          <dd className="mt-1 text-xs leading-5">{item.pain}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">What LitCentral already has</dt>
          <dd className="mt-1 text-xs leading-5">{item.ours}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Gap</dt>
          <dd className="mt-1 text-xs leading-5">{item.gap}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Implementation home</dt>
          <dd className="mt-1 font-mono text-xs leading-5 text-sky-300">{item.home}</dd>
        </div>
      </dl>
      <p className="mt-3 border-t border-border/60 pt-2 text-xs leading-5 text-muted-foreground italic">{item.note}</p>
    </div>
  );
}