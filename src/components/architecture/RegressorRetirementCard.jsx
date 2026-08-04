import { Ban, Lock, ShieldCheck } from 'lucide-react';
import { RETIRED_REGRESSORS, ADHERED_STANDARDS, RETIREMENT_RULE } from '@/lib/regressorRetirement';

export default function RegressorRetirementCard() {
  return (
    <div className="overflow-hidden rounded-lg border-2 border-red-500/60 bg-red-950/30">
      <div className="flex flex-wrap items-center gap-3 border-b border-red-500/40 bg-red-600/20 px-5 py-4">
        <Ban className="h-5 w-5 shrink-0 text-red-300" />
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-red-300">Red card · Retired</div>
          <h3 className="text-lg font-bold leading-snug text-red-50">All regressors are retired</h3>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-300">Retired — may not score</div>
          <ul className="space-y-2">
            {RETIRED_REGRESSORS.map((r) => (
              <li key={r.name} className="rounded border border-red-500/30 bg-red-950/40 p-3">
                <div className="font-mono text-sm font-bold text-red-100 line-through decoration-red-400/70">{r.name}</div>
                <div className="mt-1 text-xs leading-5 text-red-200/70">{r.reason}</div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" /> What we adhere to instead
          </div>
          <ul className="space-y-2">
            {ADHERED_STANDARDS.map((s) => (
              <li key={s.name} className="rounded border border-emerald-500/30 bg-emerald-950/30 p-3">
                <div className="text-sm font-bold text-emerald-100">{s.name}</div>
                <div className="mt-1 text-xs leading-5 text-emerald-200/70">{s.note}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-start gap-3 border-t border-red-500/40 bg-red-600/10 px-5 py-4">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
        <p className="text-xs leading-5 text-red-100">{RETIREMENT_RULE}</p>
      </div>
    </div>
  );
}