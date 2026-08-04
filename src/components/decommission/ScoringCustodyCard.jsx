import { KeyRound } from 'lucide-react';
import { CUSTODY_RULE, CUSTODIANS, CUSTODY_CLASS_STYLES } from '@/lib/scoringCustody';

export default function ScoringCustodyCard() {
  return (
    <section className="rounded-lg border border-primary/30 bg-primary/5 p-6">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
        <KeyRound className="h-4 w-4" /> GOV-AI-003 · Custody of scoring
      </div>
      <h2 className="text-xl font-bold tracking-tight">Who Holds the Scoring</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{CUSTODY_RULE}</p>

      <div className="mt-5 space-y-3">
        {CUSTODIANS.map((c) => (
          <div key={c.party} className="rounded-md border border-border bg-card/60 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-foreground">{c.party}</span>
              <span
                className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${CUSTODY_CLASS_STYLES[c.class]}`}
              >
                {c.class.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Holds: </span>
              {c.holds}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Accountable for: </span>
              {c.accountable}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-5 border-t border-primary/20 pt-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Delegation limit.</span> A third party may execute the
        procedure. It may not author the procedure. Custody of the definition stays with the codebook and the named
        analyst.
      </p>
    </section>
  );
}