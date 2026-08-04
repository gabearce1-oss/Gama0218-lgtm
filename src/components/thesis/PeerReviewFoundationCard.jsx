import { ScrollText } from 'lucide-react';
import { FOUNDATION_STATEMENT, REVIEW_IS_REAL } from '@/lib/peerReviewDiligence';

export default function PeerReviewFoundationCard() {
  return (
    <section className="rounded-lg border border-primary/30 bg-primary/5">
      <header className="border-b border-primary/20 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
          <ScrollText className="h-3.5 w-3.5" /> Foundation · academic peer review
        </div>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight">Peer Review Is Where the Foundation Sits</h2>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">{FOUNDATION_STATEMENT}</p>
      </header>

      <div className="space-y-2 p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">
          Why it is real here, specifically
        </div>
        {REVIEW_IS_REAL.map((r) => (
          <div key={r.id} className="rounded-md border border-border bg-card/60 p-3">
            <div className="flex items-baseline gap-2">
              <span className="shrink-0 font-mono text-[10px] font-bold text-primary">{r.id}</span>
              <span className="text-xs font-bold text-foreground">{r.claim}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{r.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}