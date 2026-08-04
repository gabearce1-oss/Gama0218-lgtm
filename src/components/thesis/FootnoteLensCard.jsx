import { Radio } from 'lucide-react';

export default function FootnoteLensCard() {
  return (
    <section className="rounded-lg border border-primary/30 bg-primary/5 p-6">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
        <Radio className="h-4 w-4" /> Statement of value
      </div>
      <h2 className="text-xl font-bold tracking-tight">A Fifty-Five-Year-Old Footnote, Making Noise</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        The value of this work was never a score. It is that an account kept as a footnote for fifty-five years is
        being read through the lens it was written in — and that it is carrying. The noise is the finding.
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        This is why the measurement apparatus is held to so strict a standard. A ranking would add nothing the story
        does not already do, and an unsupported number would put the artifact at risk in a way silence never did. The
        instrument exists to protect the lens, not to rate it.
      </p>
      <p className="mt-4 border-t border-primary/20 pt-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Recorded intent.</span> Restore the account, document the
        method, publish the procedure, and let the lens do the work it was always doing.
      </p>
    </section>
  );
}