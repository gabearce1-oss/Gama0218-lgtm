import { Workflow } from 'lucide-react';
import { PHASES } from '@/lib/thesisFramework';

const STATE = {
  in_progress: { label: 'In progress', cls: 'border-sky-500/40 bg-sky-500/10 text-sky-300' },
  ready: { label: 'Ready to run', cls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  blocked: { label: 'Blocked', cls: 'border-red-500/40 bg-red-500/10 text-red-300' },
};

export default function MethodologyPhases() {
  return (
    <section className="rounded-lg border border-border bg-card/40 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <Workflow className="h-4 w-4" /> Methodology & audit protocol
      </div>
      <h2 className="mt-1 text-xl font-bold">Four Phases, Honestly Staged</h2>
      <div className="mt-4 space-y-3">
        {PHASES.map((p) => {
          const s = STATE[p.state];
          return (
            <div key={p.phase} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <span className="font-mono text-xs text-amber-400">{p.phase}</span>
                  <h3 className="text-sm font-bold">{p.name}</h3>
                </div>
                <span className={`shrink-0 self-start rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${s.cls}`}>
                  {s.label}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {p.steps.map((step) => (
                  <li key={step} className="flex gap-2 text-xs leading-5 text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                    {step}
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-border/60 pt-2 text-xs leading-5 text-orange-300">{p.note}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}