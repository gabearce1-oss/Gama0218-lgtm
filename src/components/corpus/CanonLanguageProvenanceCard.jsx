import { Bot } from 'lucide-react';

const TRACE = [
  {
    stage: 'Where the canon language came from',
    body:
      'The vocabulary of canon standing — percentile, tier, ranked placement against a literature — was model-generated or carried in from bibliographic frame data (BIBFRAME). It did not originate in the codebook and was never derived from the manuscript.',
  },
  {
    stage: 'Why it read as authoritative',
    body:
      'It arrived already formatted as a result: a number, a rank, a comparison class. Formatting is not provenance. None of it carried a population, a sampling frame, or a reproducible instrument.',
  },
  {
    stage: 'What the corpus actually contains',
    body:
      'Roughly 700 titles with frequency counts reflecting institutional assignment. A count of how often a text is assigned is not a measure of its merit, and cannot yield a percentile for a text absent from the frame.',
  },
  {
    stage: 'Influences not pursued',
    body:
      'The canon-standing framing, and the parties who advanced it, were not pursued by the author. They are recorded here as influences declined — kept in the provenance record so the decision is auditable, not carried forward as findings.',
  },
];

export default function CanonLanguageProvenanceCard() {
  return (
    <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-amber-300">
        <Bot className="h-4 w-4" /> Provenance of the canon vocabulary
      </div>
      <h2 className="text-xl font-bold tracking-tight">The Canon Language Was Authored, Not Measured</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Before any figure in this frame is read, its vocabulary has to be traced. The ranking language attached to this
        manuscript has an author, and that author was not an instrument.
      </p>
      <ol className="mt-5 space-y-3">
        {TRACE.map((t, i) => (
          <li key={t.stage} className="flex gap-3 rounded-md border border-border bg-card/60 p-4">
            <span className="font-mono text-xs font-bold text-amber-300">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-foreground">{t.stage}</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-amber-500/20 pt-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Standing disposition.</span> Canon-standing language is
        quarantined under QL-EXT-001. It may be described and cited as an artifact under study. It may not be restated
        as a result.
      </p>
    </section>
  );
}