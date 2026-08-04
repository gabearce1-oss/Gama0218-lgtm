import { ShieldOff, Ban, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SPSS_ISOLATION, PROHIBITED, REQUIRED, BOUNDARY, VIOLATION } from '@/lib/spssIsolation';

export default function SpssIsolationCard() {
  return (
    <section className="rounded-lg border border-red-500/40 bg-red-500/5 p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-red-400">
        <ShieldOff className="h-4 w-4" /> {SPSS_ISOLATION.order_id} · Effective {SPSS_ISOLATION.effective}
      </div>
      <h2 className="mt-1 text-2xl font-bold tracking-tight">SPSS is air-gapped from AI</h2>
      <p className="mt-3 border-l-2 border-red-500 pl-3 font-mono text-sm leading-6 text-foreground">
        {SPSS_ISOLATION.rule}
      </p>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-md border border-red-500/40 bg-card p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-400">
            <Ban className="h-4 w-4" /> Prohibited without exception
          </div>
          <ul className="mt-3 space-y-2">
            {PROHIBITED.map((p) => (
              <li key={p} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-emerald-500/40 bg-card p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Required conditions of a valid run
          </div>
          <dl className="mt-3 space-y-3">
            {REQUIRED.map(([label, detail]) => (
              <div key={label}>
                <dt className="text-sm font-semibold text-emerald-300">{label}</dt>
                <dd className="mt-0.5 text-sm leading-6 text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Zone</th>
              <th className="px-4 py-2">AI status</th>
              <th className="px-4 py-2">Scope</th>
            </tr>
          </thead>
          <tbody>
            {BOUNDARY.map((b) => (
              <tr key={b.zone} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-semibold">{b.zone}</td>
                <td className="px-4 py-3 font-mono text-xs text-red-300">{b.status}</td>
                <td className="px-4 py-3 leading-6 text-muted-foreground">{b.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-3 rounded-md border border-amber-500/40 bg-amber-500/5 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p className="text-sm leading-6 text-amber-200">{VIOLATION.consequence}</p>
      </div>
    </section>
  );
}