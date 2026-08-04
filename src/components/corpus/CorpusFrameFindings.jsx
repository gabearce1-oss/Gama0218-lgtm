import { Search, Gavel } from 'lucide-react';
import { FRAME_FINDINGS, FRAME_RULING } from '@/lib/canonChartFrame';

export default function CorpusFrameFindings() {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
        <Search className="h-4 w-4" /> What the frame supports
      </div>
      {FRAME_FINDINGS.map((f) => (
        <div key={f.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-baseline gap-2">
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{f.id}</span>
            <h3 className="text-sm font-bold">{f.title}</h3>
          </div>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">{f.detail}</p>
          <p className="mt-1.5 border-l-2 border-primary/60 pl-3 text-xs leading-6">{f.consequence}</p>
        </div>
      ))}

      <div className="rounded-lg border border-primary/40 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
          <Gavel className="h-3.5 w-3.5" /> Disposition
        </div>
        <p className="mt-1.5 text-sm leading-6">{FRAME_RULING.disposition}</p>
        <p className="mt-3 text-xs font-semibold leading-6 text-red-300">{FRAME_RULING.prohibition}</p>
        <p className="mt-2 font-mono text-xs leading-6 text-muted-foreground">{FRAME_RULING.next_action}</p>
      </div>
    </section>
  );
}