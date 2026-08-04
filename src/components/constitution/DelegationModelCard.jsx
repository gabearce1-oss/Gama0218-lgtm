import { Users } from 'lucide-react';
import { DELEGATION_MODEL, TOOLING_RECORD } from '@/lib/workbookCustody';

export default function DelegationModelCard() {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
          <Users className="h-3.5 w-3.5" /> Delegation model · human-led, AI-supervised
        </div>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight">Who Decides, Who Builds, Who Reviews</h2>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">{DELEGATION_MODEL.structure}</p>
      </header>

      <div className="p-5 sm:p-6">
        <div className="space-y-2">
          {DELEGATION_MODEL.layers.map(([role, duty], i) => (
            <div key={role} className="flex gap-3 rounded-md border border-border bg-muted/20 p-3">
              <span className="mt-0.5 font-mono text-[10px] font-bold text-primary">L{i + 1}</span>
              <div>
                <div className="text-xs font-bold text-foreground">{role}</div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{duty}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-muted/10 p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">Why it is structured this way</div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{DELEGATION_MODEL.rationale}</p>
          </div>
          <div className="rounded-md border border-border bg-muted/10 p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">Standing position on AI</div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{DELEGATION_MODEL.aiStance}</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-border bg-muted/20 p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">Tooling provenance, recorded</div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{TOOLING_RECORD.statement}</p>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{TOOLING_RECORD.detail}</p>
        <p className="mt-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-[11px] leading-relaxed text-emerald-200/90">
          <span className="font-bold">Unanticipated fail-safe · </span>
          {TOOLING_RECORD.failsafe}
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground/70">Limit · </span>
          {TOOLING_RECORD.limit}
        </p>
      </footer>
    </section>
  );
}