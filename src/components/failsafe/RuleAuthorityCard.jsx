import { Gavel } from 'lucide-react';
import { RULE_AUTHORITY } from '@/lib/failsafe';

export default function RuleAuthorityCard() {
  return (
    <section className="rounded-lg border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Gavel className="h-4 w-4" /> {RULE_AUTHORITY.heading}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-red-400">Not delegable</div>
          <ul className="mt-2 space-y-2">
            {RULE_AUTHORITY.held.map((line) => (
              <li key={line} className="flex gap-2 text-sm leading-relaxed text-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Granted, under guardrail</div>
          <ul className="mt-2 space-y-2">
            {RULE_AUTHORITY.granted.map((line) => (
              <li key={line} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}