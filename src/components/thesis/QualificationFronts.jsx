import { Layers } from 'lucide-react';
import { QUALIFICATION_FRONTS } from '@/lib/peerReviewDiligence';

export default function QualificationFronts() {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
          <Layers className="h-3.5 w-3.5" /> Due diligence · three qualification fronts
        </div>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight">Where the Manuscript Qualifies, and For Whom</h2>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Three distinct grounds for review, each answering to different readers. They are kept separate because a venue
          that is right for the artifact is usually wrong for the prose. This is an eligibility assessment — no submission
          has been made and nothing here has been accepted.
        </p>
      </header>

      <div className="space-y-3 p-5 sm:p-6">
        {QUALIFICATION_FRONTS.map((f) => (
          <article key={f.id} className={`rounded-lg border p-4 ${f.className}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px] font-bold">{f.id}</span>
              <h3 className="text-sm font-bold">{f.front}</h3>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/80">{f.thesis}</p>

            <ul className="mt-3 space-y-1.5">
              {f.grounds.map((g) => (
                <li key={g} className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-50" />
                  {g}
                </li>
              ))}
            </ul>

            <div className="mt-3 border-t border-white/10 pt-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-foreground/60">Reviewer pool · </span>
              <span className="text-[11px] leading-relaxed text-muted-foreground">{f.reviewers}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}