import { FileQuestion } from 'lucide-react';
import { ATTRIBUTION_CLAIMS, STATUS_STYLES, LEDGER_RULE, STANDARD_OF_PROOF } from '@/lib/attributionClaims';

function ClaimRow({ claim }) {
  const style = STATUS_STYLES[claim.status];
  return (
    <div className="rounded-md border border-border bg-card/60 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] text-muted-foreground">{claim.id}</span>
        <span
          className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${style.className}`}
        >
          {style.label}
        </span>
      </div>
      <p className="text-sm font-semibold leading-relaxed text-foreground">{claim.attribution}</p>
      <dl className="mt-3 space-y-1.5 text-xs leading-relaxed">
        <div>
          <dt className="inline font-semibold text-muted-foreground">Surfaced via: </dt>
          <dd className="inline text-muted-foreground">{claim.surfaced_via}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-muted-foreground">Document required: </dt>
          <dd className="inline text-muted-foreground">{claim.document_required}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-muted-foreground">Author inquiry: </dt>
          <dd className="inline text-muted-foreground">{claim.author_inquiry}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-foreground">Disposition: </dt>
          <dd className="inline text-muted-foreground">{claim.disposition}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function AttributionVerificationLedger() {
  return (
    <section className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-red-300">
        <FileQuestion className="h-4 w-4" /> Lane 3 · Attribution verification
      </div>
      <h2 className="text-xl font-bold tracking-tight">Attribution Verification Ledger</h2>
      <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">{LEDGER_RULE}</p>
      <div className="mt-5 space-y-3">
        {ATTRIBUTION_CLAIMS.map((c) => (
          <ClaimRow key={c.id} claim={c} />
        ))}
      </div>
      <p className="mt-5 border-t border-red-500/20 pt-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Standard of proof.</span> {STANDARD_OF_PROOF}
      </p>
    </section>
  );
}