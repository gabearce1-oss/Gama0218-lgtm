import { ShieldAlert } from 'lucide-react';
import { PRIZE_DISCLAIMER } from '@/lib/prizeStandard';

export default function NonCompetitionDisclaimer() {
  return (
    <section className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
        <ShieldAlert className="h-4 w-4" /> {PRIZE_DISCLAIMER.heading}
      </div>
      <ul className="mt-3 space-y-2">
        {PRIZE_DISCLAIMER.lines.map((line) => (
          <li key={line} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}