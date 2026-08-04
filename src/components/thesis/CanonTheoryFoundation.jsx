import { Library, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { CANON_THEORY } from '@/lib/thesisFramework';

function PointList({ items, tone }) {
  const accent = tone === 'supports' ? 'text-emerald-300' : 'text-orange-300';
  const dot = tone === 'supports' ? 'bg-emerald-400' : 'bg-orange-400';
  return (
    <div className="space-y-3">
      {items.map((p) => (
        <div key={p.point} className="rounded-lg border border-border bg-card p-4">
          <div className="flex gap-2">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <h4 className={`text-sm font-bold ${accent}`}>{p.point}</h4>
          </div>
          <p className="mt-1.5 pl-3.5 text-xs leading-6 text-muted-foreground">{p.detail}</p>
        </div>
      ))}
    </div>
  );
}

export default function CanonTheoryFoundation() {
  return (
    <section className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-sky-400">
        <Library className="h-4 w-4" /> Literature review · canon theory
      </div>
      <h2 className="mt-1 text-xl font-bold">What Canon Scholarship Licenses This Study To Claim</h2>

      <div className="mt-3 rounded-md border border-border bg-card p-4">
        <p className="font-mono text-xs leading-5 text-sky-300">{CANON_THEORY.citation}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-300">
            {CANON_THEORY.status}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{CANON_THEORY.evidence_class}</span>
        </div>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">{CANON_THEORY.role}</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            <ArrowUpRight className="h-3.5 w-3.5" /> Supports the design
          </div>
          <PointList items={CANON_THEORY.supports} tone="supports" />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-orange-400">
            <ShieldAlert className="h-3.5 w-3.5" /> Constrains the claims
          </div>
          <PointList items={CANON_THEORY.constrains} tone="constrains" />
        </div>
      </div>

      <div className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/5 p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Design consequence</div>
        <p className="mt-1.5 text-sm leading-7">{CANON_THEORY.design_consequence}</p>
      </div>
    </section>
  );
}