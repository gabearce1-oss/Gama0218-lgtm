import { Route } from 'lucide-react';
import { POC_PHASES } from '@/lib/proseEngineAudit';

const STATUS_CLS = {
  done: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  ready: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  blocked: 'border-red-500/40 bg-red-500/10 text-red-300',
};

export default function PocPhaseMenu() {
  return (
    <section className="rounded-lg border border-border bg-card/40 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-sky-400">
        <Route className="h-4 w-4" /> Proof-of-concept sequence
      </div>
      <h2 className="mt-1 text-xl font-bold">How We Evaluate Without Contaminating Anything</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        Optimism with a gate on every step. Nothing promotes out of quarantine until the review board signs off in P5.
      </p>
      <div className="mt-4 space-y-3">
        {POC_PHASES.map((p) => (
          <div key={p.phase} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-sky-400">{p.phase}</span>
              <h3 className="min-w-0 flex-1 text-sm font-bold">{p.name}</h3>
              <span className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_CLS[p.status]}`}>
                {p.status}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.outcome}</p>
            <p className="mt-2 text-xs leading-5">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground">Gate · </span>
              <span className="text-emerald-300">{p.gate}</span>
            </p>
            {p.blocker && (
              <p className="mt-1 text-xs leading-5">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground">Blocked by · </span>
                <span className="text-red-300">{p.blocker}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}