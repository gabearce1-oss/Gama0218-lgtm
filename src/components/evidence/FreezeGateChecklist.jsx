import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { FREEZE_GATE } from '@/lib/evidenceFreeze';

const STATUS = {
  met: { icon: CheckCircle2, cls: 'text-emerald-400', label: 'Met' },
  pending: { icon: Clock, cls: 'text-amber-400', label: 'Pending' },
  open: { icon: AlertTriangle, cls: 'text-red-400', label: 'Open' },
};

export default function FreezeGateChecklist() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-bold">Phase 1 Promotion Gate</h2>
      <p className="text-xs text-muted-foreground mt-1 mb-4">Schema separation does not begin until every item below is met.</p>
      <div className="space-y-2">
        {FREEZE_GATE.map((g) => {
          const s = STATUS[g.status];
          const Icon = s.icon;
          return (
            <div key={g.item} className="flex items-start gap-3 rounded-md border border-border/60 bg-background/40 p-3">
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${s.cls}`} />
              <span className="flex-1 text-xs leading-relaxed">{g.item}</span>
              <span className={`text-[10px] uppercase tracking-wider ${s.cls}`}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}