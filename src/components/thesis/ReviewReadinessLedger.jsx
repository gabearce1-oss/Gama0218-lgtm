import { ClipboardCheck, CircleCheck, CircleAlert } from 'lucide-react';
import { READINESS } from '@/lib/peerReviewDiligence';

export default function ReviewReadinessLedger() {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
          <ClipboardCheck className="h-3.5 w-3.5" /> Readiness · stated honestly
        </div>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight">What Would Survive Review, and What Would Not</h2>
      </header>

      <div className="grid gap-3 p-5 sm:p-6 lg:grid-cols-2">
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <CircleCheck className="h-3.5 w-3.5" /> In hand
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {READINESS.in_hand.map((x) => (
              <li key={x} className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-300">
            <CircleAlert className="h-3.5 w-3.5" /> Not yet
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {READINESS.not_yet.map((x) => (
              <li key={x} className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="border-t border-border bg-muted/20 p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">The reviewer&rsquo;s question</div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{READINESS.bar}</p>
      </footer>
    </section>
  );
}