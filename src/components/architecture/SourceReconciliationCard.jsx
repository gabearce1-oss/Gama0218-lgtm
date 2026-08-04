import { FileWarning, Gavel } from 'lucide-react';
import { SOURCE_META, RECONCILIATION_FINDINGS, SCORE_DISPOSITION } from '@/lib/sourceReconciliation';

const FACTS = [
  ['Heading blocks', SOURCE_META.heading_blocks],
  ['Distinct numbers', SOURCE_META.distinct_numbers],
  ['Body words', SOURCE_META.total_words.toLocaleString()],
  ['Loose epilogues', SOURCE_META.standalone_epilogues],
];

export default function SourceReconciliationCard() {
  return (
    <section className="rounded-lg border border-red-500/40 bg-red-500/5 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-400">
        <FileWarning className="h-4 w-4" /> Source reconciliation · {SOURCE_META.extracted_at}
      </div>
      <h2 className="mt-1 text-xl font-bold tracking-tight">This ledger was placeholder data until now</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        Read directly from <span className="font-mono text-sky-300">{SOURCE_META.artifact}</span>. {SOURCE_META.method}.
        Titles and word counts below are now literal. The scores are not.
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FACTS.map(([label, value]) => (
          <div key={label} className="rounded-md border border-border bg-card p-3">
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-mono text-lg text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 space-y-3">
        {RECONCILIATION_FINDINGS.map((f) => (
          <div key={f.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-red-500/15 px-1.5 py-0.5 font-mono text-[10px] text-red-300">{f.id}</span>
              <h3 className="text-sm font-semibold">{f.title}</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.detail}</p>
            <p className="mt-2 text-sm leading-6 text-amber-300">→ {f.consequence}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-md border border-amber-500/40 bg-amber-500/5 p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
          <Gavel className="h-4 w-4" /> Score disposition
        </div>
        <p className="mt-2 text-sm font-semibold leading-6">{SCORE_DISPOSITION.ruling}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{SCORE_DISPOSITION.reason}</p>
        <p className="mt-2 text-sm leading-6 text-amber-300">Next: {SCORE_DISPOSITION.next}</p>
      </div>
    </section>
  );
}