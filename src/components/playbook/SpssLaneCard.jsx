import { Lock } from 'lucide-react';
import { SPSS_LANE } from '@/lib/omegaPlaybook';

export default function SpssLaneCard() {
  return (
    <section className="rounded-lg border border-border bg-secondary/40 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Lock className="h-4 w-4" /> Statistical lane · {SPSS_LANE.label}
      </div>
      <ul className="mt-3 space-y-2">
        {SPSS_LANE.statements.map((s) => (
          <li key={s} className="flex gap-2 text-sm leading-relaxed text-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}