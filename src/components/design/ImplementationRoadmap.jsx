import { ArrowRight, Workflow } from 'lucide-react';
import { roadmap } from '@/lib/designRoadmap';

export default function ImplementationRoadmap() {
  return (
    <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5">
      <div className="flex items-center gap-2 mb-5">
        <Workflow className="w-4 h-4 text-amber-400" />
        <h2 className="text-sm font-bold text-amber-400">Recommended Design Roadmap</h2>
      </div>
      <div className="space-y-3">
        {roadmap.map(([number, title, detail], index) => (
          <div key={number} className="flex items-start gap-3">
            <div className="w-8 h-8 shrink-0 rounded-full border border-amber-500/30 text-amber-400 font-mono text-xs flex items-center justify-center">{number}</div>
            <div className="flex-1 pt-1">
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{detail}</p>
            </div>
            {index < roadmap.length - 1 && <ArrowRight className="hidden md:block w-4 h-4 text-muted-foreground mt-2" />}
          </div>
        ))}
      </div>
    </section>
  );
}