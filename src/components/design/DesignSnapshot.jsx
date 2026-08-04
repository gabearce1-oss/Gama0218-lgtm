import { Layers3 } from 'lucide-react';
import { designSnapshot } from '@/lib/designRoadmap';

export default function DesignSnapshot() {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Layers3 className="w-4 h-4 text-cyan-400" />
        <h2 className="text-sm font-bold">Current-State Design Snapshot</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {designSnapshot.map(([label, detail]) => (
          <div key={label} className="rounded-md border border-border bg-background/40 p-4">
            <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">{label}</div>
            <p className="text-sm text-foreground/90 mt-2 leading-relaxed">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}