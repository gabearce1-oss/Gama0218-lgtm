import { GitCompareArrows, FileCheck2 } from 'lucide-react';
import { SOURCE_DOCUMENT, RECONCILIATION } from '@/lib/thesisFramework';

const SEV = {
  Critical: 'border-red-500/40 bg-red-500/10 text-red-300',
  High: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  Medium: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  'Gate 0': 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  'Gate 2': 'border-sky-500/40 bg-sky-500/10 text-sky-300',
};

export default function SourceAuditReconciliation() {
  return (
    <section className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400">
        <FileCheck2 className="h-4 w-4" /> Source document received · {SOURCE_DOCUMENT.date}
      </div>
      <h2 className="mt-1 text-xl font-bold">{SOURCE_DOCUMENT.title}</h2>
      <div className="mt-2 font-mono text-xs text-emerald-300">{SOURCE_DOCUMENT.run}</div>
      <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">{SOURCE_DOCUMENT.confidentiality}</p>
      <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">Companion file · {SOURCE_DOCUMENT.companion}</p>

      <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-wider text-orange-400">
        <GitCompareArrows className="h-4 w-4" /> Discrepancies to reconcile · {RECONCILIATION.length}
      </div>
      <div className="mt-3 space-y-3">
        {RECONCILIATION.map((r) => (
          <div key={r.item} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="min-w-0 text-sm font-bold">{r.item}</h3>
              <span className={`shrink-0 self-start rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${SEV[r.severity]}`}>
                {r.severity}
              </span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">This system says</div>
                <div className="mt-1 text-xs leading-5">{r.app_says}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Source document says</div>
                <div className="mt-1 text-xs leading-5 text-orange-300">{r.source_says}</div>
              </div>
            </div>
            <p className="mt-3 border-t border-border/60 pt-2 text-xs leading-5 text-emerald-300">{r.action}</p>
          </div>
        ))}
      </div>
    </section>
  );
}