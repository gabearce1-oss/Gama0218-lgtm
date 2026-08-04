import { Feather } from 'lucide-react';

const RESTORED = [
  {
    heading: 'The original intent',
    body:
      'George Ramos set out to tell a story. The account of a Chicano soldier, in his own idiom, was the whole of the work — and it was diluted in the course of later drafting and revision (Ramos, n.d.).',
  },
  {
    heading: 'The actual object of study',
    body:
      'The Chicano lens. Not canon standing, not rank, not comparative literary merit. The lens is the cultural function the prose performs; the codebook defines it as such, and never as Spanish word density (Arce, 2026).',
  },
  {
    heading: 'What the scoring frame was ever for',
    body:
      'The grid frame tested one thing: whether the manuscript holds up as a historical artifact. It is an authenticity instrument applied to a document, not a ranking instrument applied to a literature.',
  },
  {
    heading: 'What the scoring frame was never for',
    body:
      'Canon placement and percentile standing were never part of the design. That language entered from outside the instrument and is treated as contamination wherever it appears (Canon chart, n.d.).',
  },
];

export default function AuthorialIntentCard() {
  return (
    <section className="rounded-lg border border-primary/30 bg-primary/5 p-6">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
        <Feather className="h-4 w-4" /> Article I · Statement of original intent
      </div>
      <h2 className="text-xl font-bold tracking-tight">The Study Restores a Story, Not a Ranking</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        This statement governs every other section. Where a later artifact conflicts with it, the artifact is
        quarantined and this statement stands.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {RESTORED.map((r) => (
          <div key={r.heading} className="rounded-md border border-border bg-card/60 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-foreground">{r.heading}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Consequence for the record.</span> The authenticity of the
        artifact is a documentary question, answerable from the source document and the disclosed revision history. It
        does not require, and is not improved by, a percentile.
      </p>
    </section>
  );
}