import { Wrench, Ban, ShieldAlert } from 'lucide-react';

const PERMITTED = [
  'Building and maintaining the platform that holds restored history.',
  'Transcription and formatting of source text, verbatim, for human checking.',
  'Drafting prose and documentation that a named human then re-authors and signs.',
  'Clerical retrieval: locating a passage, listing what a document contains.',
];

const BARRED = [
  'Assigning, weighting, adjusting, or estimating any score.',
  'Producing a value that enters a dataset (extracted, inferred, or imputed).',
  'Selecting a statistical test or interpreting a coefficient.',
  'Summarising analytic output into a conclusion.',
  'Supplying citations, percentiles, or institutional standing.',
];

export default function AiRoleCharterCard() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
        <Wrench className="h-4 w-4" /> GOV-AI-002 · Charter of permitted role
      </div>
      <h2 className="text-xl font-bold tracking-tight">AI Builds the Platform. It Does Not Measure.</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        This is a boundary drawn on present capability, not a charge of intent. The value of the technology here is
        real and it is architectural: it builds the vessel that carries restored history. The moment it is pointed at
        measurement, the risk profile inverts.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
            <Wrench className="h-3.5 w-3.5" /> Permitted — construction and clerical
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {PERMITTED.map((p) => (
              <li key={p} className="text-xs leading-relaxed text-muted-foreground">
                • {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-red-500/30 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-red-300">
            <Ban className="h-3.5 w-3.5" /> Barred — measurement and inference
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {BARRED.map((b) => (
              <li key={b} className="text-xs leading-relaxed text-muted-foreground">
                • {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-300">
          <ShieldAlert className="h-3.5 w-3.5" /> The stated risk
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          The failure mode is the <span className="font-semibold text-foreground">hallucinated conclusion</span>: an
          output that is fluent, formatted as a result, and unsupported by any reproducible operation. It is dangerous
          precisely because it does not look like an error. Analytical tools carry no social vectors and no hidden
          weighting, so their conclusions can be traced and re-run. That is why the statistical lab is air-gapped
          (ISO-SPSS-001) — including against model-assisted handling of the environment itself, which is exactly the
          surface where measurement gets quietly compromised.
        </p>
      </div>

      <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Governing rule.</span> No number enters the measurement record
        unless a human can reproduce it by hand from the source text using the published codebook. Where AI has
        touched a value, the value is quarantined — not corrected.
      </p>
    </section>
  );
}