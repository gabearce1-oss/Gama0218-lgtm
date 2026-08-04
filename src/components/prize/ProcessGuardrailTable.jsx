import { PROCESS_FACTS } from '@/lib/prizeStandard';

export default function ProcessGuardrailTable() {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="font-bold">Documented process → guardrail it imposes here</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Left column is what the sources say, recorded as found. Right column is the rule this project accepts because of it.
      </p>
      <div className="mt-4 space-y-3">
        {PROCESS_FACTS.map((row) => (
          <div key={row.fact} className="rounded-md border border-border bg-background/40 p-4">
            <p className="text-sm font-bold">{row.fact}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{row.detail}</p>
            <p className="mt-3 border-l-2 border-primary/60 pl-3 text-xs leading-relaxed text-foreground">
              <span className="font-semibold uppercase tracking-wider text-primary">Guardrail · </span>
              {row.guardrail}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{row.source}</p>
          </div>
        ))}
      </div>
    </section>
  );
}