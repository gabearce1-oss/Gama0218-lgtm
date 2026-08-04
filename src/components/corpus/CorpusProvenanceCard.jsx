import { FileSpreadsheet, HelpCircle } from 'lucide-react';
import { FRAME_META, FRAME_UNKNOWNS } from '@/lib/canonChartFrame';

export default function CorpusProvenanceCard() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-sky-400">
        <FileSpreadsheet className="h-4 w-4" /> Artifact provenance
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-primary">{FRAME_META.frame_id}</span>
        <span className="rounded border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange-300">
          {FRAME_META.status}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
        <div>
          <dt className="uppercase tracking-wider text-muted-foreground">Artifact</dt>
          <dd className="mt-0.5 font-mono">{FRAME_META.artifact}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted-foreground">Received</dt>
          <dd className="mt-0.5 font-mono">{FRAME_META.received}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted-foreground">Scale</dt>
          <dd className="mt-0.5 leading-6">{FRAME_META.scale}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted-foreground">Structure</dt>
          <dd className="mt-0.5 leading-6">{FRAME_META.structure}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-6 text-muted-foreground">{FRAME_META.duplicate_note}</p>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-orange-400">
          <HelpCircle className="h-4 w-4" /> What this chart does not say
        </div>
        {FRAME_UNKNOWNS.map((u) => (
          <div key={u.item} className="rounded-md border border-orange-500/25 bg-orange-500/5 p-3">
            <div className="text-sm font-semibold">{u.item}</div>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{u.detail}</p>
            <p className="mt-1.5 border-l-2 border-orange-400/60 pl-3 text-xs leading-6">{u.consequence}</p>
          </div>
        ))}
      </div>
    </section>
  );
}