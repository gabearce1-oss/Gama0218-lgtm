import { AlertTriangle } from 'lucide-react';
import { auditFindings } from '@/lib/designRoadmap';

export default function DesignAuditFindings() {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <h2 className="text-sm font-bold">Design Audit: Prioritized Findings</h2>
      </div>
      <div className="space-y-3">
        {auditFindings.map(([priority, title, detail]) => (
          <div key={title} className="flex gap-3 rounded-md border border-border bg-background/40 p-4">
            <span className={`h-fit rounded px-2 py-1 text-[10px] font-bold ${priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>{priority}</span>
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}