import { Warehouse, Check, X } from 'lucide-react';
import { CUSTODY_ROLE } from '@/lib/spssProtocol';

export default function CustodyRoleCard() {
  return (
    <section className="rounded-lg border border-border bg-card p-5 mb-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Warehouse className="h-4 w-4 text-amber-400" /> {CUSTODY_ROLE.label}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        This environment is the warehouse and the monitor. It holds the inventory, extracts the data,
        and shows the run — it does not control the statistics.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Holds</div>
          <ul className="mt-2 space-y-2">
            {CUSTODY_ROLE.holds.map((h) => (
              <li key={h} className="flex gap-2 text-sm leading-relaxed">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-red-400">Forbids</div>
          <ul className="mt-2 space-y-2">
            {CUSTODY_ROLE.forbids.map((f) => (
              <li key={f} className="flex gap-2 text-sm leading-relaxed">
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}