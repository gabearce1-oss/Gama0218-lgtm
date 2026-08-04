import { ListChecks, Package } from 'lucide-react';
import { SPSS_GATES, ANALYSIS_PACKAGE } from '@/lib/measurementConstitution';

export default function ValidationGateLadder() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet-400 mb-1">
        <ListChecks className="w-4 h-4" /> SPSS execution · autonomous laboratory
      </div>
      <h2 className="text-lg font-bold">Seven Release Gates</h2>
      <p className="text-xs text-muted-foreground mt-1 mb-4">
        SPSS receives frozen exports and never reaches back into a live workbook. A gate failure stops the release.
      </p>
      <div className="space-y-2">
        {SPSS_GATES.map((g) => (
          <div key={g.gate} className="rounded-md border border-border/60 bg-background/40 p-4">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-mono text-xs text-violet-400">{g.gate}</span>
              <span className="font-bold text-sm">{g.name}</span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">{g.work}</p>
            <p className="mt-1.5 text-xs text-emerald-300/90"><span className="uppercase tracking-wider text-[10px] text-muted-foreground">Release condition · </span>{g.condition}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-md border border-border/60 bg-background/40 p-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          <Package className="w-3.5 h-3.5" /> Contents of every official analysis package
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ANALYSIS_PACKAGE.map((p) => (
            <span key={p} className="rounded bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}