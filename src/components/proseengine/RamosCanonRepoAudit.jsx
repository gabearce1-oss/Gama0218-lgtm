import { GitCommit, Lock } from 'lucide-react';
import { RAMOSCANON_META, RAMOSCANON_FINDINGS, RAMOSCANON_RULING } from '@/lib/ramosCanonAudit';
import OmegaCollisionAlert from './OmegaCollisionAlert';

const VERDICT = {
  adopt_shape: { label: 'Adopt the shape', cls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  rebuild_governed: { label: 'Rebuild governed', cls: 'border-sky-500/40 bg-sky-500/10 text-sky-300' },
  reject_mechanism: { label: 'Reject mechanism', cls: 'border-red-500/40 bg-red-500/10 text-red-300' },
  flag_conflict: { label: 'Flag conflict', cls: 'border-orange-500/40 bg-orange-500/10 text-orange-300' },
};

export default function RamosCanonRepoAudit() {
  return (
    <section className="rounded-lg border border-border bg-card/40 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <GitCommit className="h-4 w-4" /> External repository audit
      </div>
      <h2 className="mt-1 text-2xl font-bold tracking-tight">RamosCanon v13 · AI-Authored Platform</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        A second AI-built system aimed at this same manuscript, complete with its own gates, its own scores, and its own
        readiness claims. Some of its instincts are better than its numbers. It is read here, audited, and left outside.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2">
        <Lock className="h-4 w-4 shrink-0 text-red-400" />
        <span className="font-mono text-xs text-red-300">{RAMOSCANON_META.quarantine_id}</span>
        <span className="text-xs text-red-300">{RAMOSCANON_META.status}</span>
      </div>

      <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="uppercase tracking-wider text-muted-foreground">Source</dt>
          <dd className="mt-0.5 break-all font-mono text-sky-300">{RAMOSCANON_META.source}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted-foreground">Artifact</dt>
          <dd className="mt-0.5 leading-5">{RAMOSCANON_META.artifact}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted-foreground">Dated</dt>
          <dd className="mt-0.5 font-mono">{RAMOSCANON_META.dated}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-muted-foreground">Authorship</dt>
          <dd className="mt-0.5 leading-5 text-orange-300">{RAMOSCANON_META.authorship}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{RAMOSCANON_META.evidence_basis}</p>

      <div className="mt-5">
        <OmegaCollisionAlert />
      </div>

      <div className="mt-5 space-y-3">
        {RAMOSCANON_FINDINGS.map((f) => {
          const v = VERDICT[f.verdict];
          return (
            <div key={f.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 items-baseline gap-2">
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">{f.id}</span>
                  <h3 className="min-w-0 text-sm font-bold">{f.title}</h3>
                </div>
                <span className={`shrink-0 self-start rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${v.cls}`}>
                  {v.label}
                </span>
              </div>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                <span className="uppercase tracking-wider">Their build · </span>
                {f.detail}
              </p>
              <p className="mt-1.5 border-l-2 border-amber-400/60 pl-3 text-xs leading-6">{f.ours}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Disposition</div>
        <p className="mt-1.5 text-sm leading-6">{RAMOSCANON_RULING.disposition}</p>
        <p className="mt-3 text-xs leading-6 text-orange-300">{RAMOSCANON_RULING.guardrail}</p>
        <p className="mt-2 font-mono text-xs leading-6 text-red-300">{RAMOSCANON_RULING.next_action}</p>
      </div>
    </section>
  );
}