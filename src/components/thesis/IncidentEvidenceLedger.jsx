import { AlertTriangle } from 'lucide-react';
import { INCIDENT_LEDGER, INCIDENT_LEDGER_FIELDS, CONTROL_LANGUAGE } from '@/lib/thesisFramework';

export default function IncidentEvidenceLedger() {
  return (
    <section className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400">
        <AlertTriangle className="h-4 w-4" /> Lane A · Article IX
      </div>
      <h2 className="mt-1 text-xl font-bold">Incident Evidence Ledger</h2>
      <p className="mt-2 max-w-3xl border-l-2 border-emerald-500/40 pl-3 text-xs leading-6 text-muted-foreground">
        {CONTROL_LANGUAGE.incident}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {INCIDENT_LEDGER_FIELDS.map((f) => (
          <span key={f} className="rounded border border-border bg-card px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {f}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {INCIDENT_LEDGER.map((i) => (
          <div key={i.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-1 items-baseline gap-2">
                <span className="shrink-0 font-mono text-xs text-emerald-400">{i.id}</span>
                <h3 className="min-w-0 text-sm font-bold">{i.claim}</h3>
              </div>
              <span className="shrink-0 self-start rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                {i.status}
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Platform · <span className="font-mono text-foreground">{i.platform}</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Proves</div>
                <p className="mt-1 text-xs leading-5 text-emerald-300">{i.proves}</p>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Does not prove</div>
                <p className="mt-1 text-xs leading-5 text-red-300">{i.does_not_prove}</p>
              </div>
            </div>
            <p className="mt-3 border-t border-border/60 pt-2 text-xs leading-5 text-muted-foreground">
              <span className="uppercase tracking-wider">Required · </span>
              {i.required}
            </p>
            <p className="mt-1 text-xs leading-5 text-orange-300">
              <span className="uppercase tracking-wider text-muted-foreground">On file · </span>
              {i.held}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}