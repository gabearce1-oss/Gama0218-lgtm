import { GitBranch } from 'lucide-react';
import { PROVENANCE_ENVELOPE, DATA_CLASSES } from '@/lib/evidenceFreeze';

export default function ProvenanceEnvelopeSpec() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-400 mb-1">
        <GitBranch className="w-4 h-4" /> Minimum provenance envelope
      </div>
      <h2 className="text-lg font-bold">Every Consequential Value Carries These Fields</h2>
      <p className="text-xs text-muted-foreground mt-1 mb-4">
        Where did you come from · who authorized you · what exactly do you measure · can another qualified person reproduce you.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {PROVENANCE_ENVELOPE.map((g) => (
          <div key={g.group} className="rounded-md border border-border/60 bg-background/40 p-3">
            <div className="text-[10px] uppercase tracking-wider text-cyan-400 mb-2">{g.group}</div>
            <div className="flex flex-wrap gap-1.5">
              {g.fields.map((f) => (
                <span key={f} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{f}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Data classes — a blank and a zero never mean the same thing</div>
        <div className="space-y-1.5">
          {DATA_CLASSES.map((d) => (
            <div key={d.code} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3 text-xs">
              <span className="font-mono text-emerald-400 sm:w-56 shrink-0">{d.code}</span>
              <span className="text-muted-foreground">{d.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}