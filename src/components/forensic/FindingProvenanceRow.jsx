import { SOURCES, TIERS, SEVERITY_STYLES } from '@/lib/findingProvenance';

export default function FindingProvenanceRow({ row }) {
  const inherited = TIERS[row.inherited];

  return (
    <article className="rounded-lg border border-border bg-muted/10 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] text-muted-foreground">{row.id}</span>
        <span
          className={`rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            SEVERITY_STYLES[row.severity]
          }`}
        >
          {row.severity}
        </span>
        <h4 className="text-sm font-bold text-foreground">{row.finding}</h4>
        <span className={`ml-auto rounded border px-2 py-0.5 font-mono text-[10px] font-bold ${inherited.className}`}>
          inherits {inherited.code}
        </span>
      </div>

      <dl className="mt-3 space-y-2.5 text-[11px] leading-relaxed">
        <div>
          <dt className="font-bold uppercase tracking-wider text-foreground/60">Evidence on the record</dt>
          <dd className="mt-0.5 text-muted-foreground">{row.evidence}</dd>
        </div>
        <div>
          <dt className="font-bold uppercase tracking-wider text-foreground/60">Why it is classified this way</dt>
          <dd className="mt-0.5 text-muted-foreground">{row.reasoning}</dd>
        </div>
        <div>
          <dt className="font-bold uppercase tracking-wider text-foreground/60">What would close it</dt>
          <dd className="mt-0.5 text-muted-foreground">{row.closure}</dd>
        </div>
      </dl>

      <div className="mt-3 border-t border-border pt-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">Source material</div>
        <ul className="mt-2 space-y-2">
          {row.sources.map((sid) => {
            const s = SOURCES[sid];
            const tier = TIERS[s.tier];
            return (
              <li key={sid} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold ${tier.className}`}>
                  {s.tier}
                </span>
                <span className="font-mono text-[10px] text-primary">{s.inText}</span>
                <span className="w-full pl-1 text-[11px] leading-relaxed text-muted-foreground sm:w-auto sm:flex-1">
                  {s.reference}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}