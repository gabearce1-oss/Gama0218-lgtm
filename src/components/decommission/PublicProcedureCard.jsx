import { BookOpenCheck, Ban, Check } from 'lucide-react';
import {
  PROCEDURE_STAGES,
  PACE_STATEMENT,
  RETIRED_LANGUAGE,
  PERMITTED_LANGUAGE,
  LANGUAGE_RULE,
} from '@/lib/scoringCustody';

export default function PublicProcedureCard() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-sky-300">
        <BookOpenCheck className="h-4 w-4" /> Matter of record · Public procedure
      </div>
      <h2 className="text-xl font-bold tracking-tight">The Procedure Is Published Before Any Number Is</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        How the statistical lab handles Ramos literature is made public as a document of record. A reader should be
        able to audit the method without being handed a conclusion.
      </p>

      <ol className="mt-5 space-y-2.5">
        {PROCEDURE_STAGES.map((s) => (
          <li key={s.stage} className="flex gap-3 rounded-md border border-border bg-background/40 p-3.5">
            <span className="mt-0.5 shrink-0 rounded border border-sky-500/30 bg-sky-500/5 px-1.5 py-0.5 font-mono text-[10px] font-bold text-sky-300">
              {s.stage}
            </span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-foreground">{s.name}</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-md border border-border bg-muted/20 p-3.5 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">On pace. </span>
        {PACE_STATEMENT}
      </p>

      <div className="mt-6 border-t border-border pt-5">
        <h3 className="text-sm font-bold tracking-tight">Language Discipline</h3>
        <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-muted-foreground">{LANGUAGE_RULE}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-red-500/30 bg-red-500/5 p-4">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-red-300">
              <Ban className="h-3.5 w-3.5" /> Retired from the record
            </div>
            <ul className="mt-2.5 space-y-2">
              {RETIRED_LANGUAGE.map((r) => (
                <li key={r.term} className="text-xs leading-relaxed">
                  <span className="font-mono text-foreground">{r.term}</span>
                  <span className="block text-muted-foreground">{r.why}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              <Check className="h-3.5 w-3.5" /> Defensible vocabulary
            </div>
            <ul className="mt-2.5 space-y-2">
              {PERMITTED_LANGUAGE.map((p) => (
                <li key={p} className="font-mono text-xs leading-relaxed text-muted-foreground">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}