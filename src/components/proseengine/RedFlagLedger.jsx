import { AlertTriangle } from 'lucide-react';
import { RED_FLAGS } from '@/lib/proseEngineAudit';

const RISK_CLS = {
  Critical: 'border-red-500/50 bg-red-500/10 text-red-300',
  High: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  Medium: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
};

export default function RedFlagLedger() {
  return (
    <section className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-400">
        <AlertTriangle className="h-4 w-4" /> Red-flag register · {RED_FLAGS.length} findings
      </div>
      <h2 className="mt-1 text-xl font-bold">Where It Breaks Our Rules</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        Each finding names the evidence, the Article engaged, the consequence if ignored, and the control that must hold
        while the source stays quarantined.
      </p>
      <div className="mt-4 space-y-3">
        {RED_FLAGS.map((f) => (
          <div key={f.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-red-400">{f.id}</span>
              <h3 className="min-w-0 flex-1 text-sm font-bold">{f.flag}</h3>
              <span className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${RISK_CLS[f.risk]}`}>
                {f.risk}
              </span>
            </div>
            <p className="mt-2 border-l-2 border-red-500/40 pl-3 text-xs leading-5 text-muted-foreground">{f.evidence}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Article engaged</div>
                <div className="mt-1 font-mono text-xs text-amber-400">{f.article}</div>
                <div className="mt-2 text-xs leading-5 text-red-300">{f.consequence}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Required control</div>
                <div className="mt-1 text-xs leading-5 text-emerald-300">{f.control}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}