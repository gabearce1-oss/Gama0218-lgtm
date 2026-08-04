import { Microscope, Lock } from 'lucide-react';
import { AUDIT_META } from '@/lib/proseEngineAudit';
import CapabilityMatrix from '@/components/proseengine/CapabilityMatrix';
import RedFlagLedger from '@/components/proseengine/RedFlagLedger';
import PocPhaseMenu from '@/components/proseengine/PocPhaseMenu';
import AuditWorkbookCard from '@/components/proseengine/AuditWorkbookCard';
import RamosCanonRepoAudit from '@/components/proseengine/RamosCanonRepoAudit';

export default function ProseEngineAudit() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      <header className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
          <Microscope className="h-4 w-4" /> External source audit
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">ProseEngine Capability Audit</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          A functional audit of a neighbouring product, held at arm's length. The opportunity is real: there are
          capabilities here we lack, and pains they solve that our authors feel. The discipline is also real: their
          numbers were produced by a model grading its own rewrites, so we take the shape of the ideas and build our own
          instrument.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2">
          <Lock className="h-4 w-4 shrink-0 text-red-400" />
          <span className="font-mono text-xs text-red-300">{AUDIT_META.quarantine_id}</span>
          <span className="text-xs text-red-300">{AUDIT_META.status}</span>
        </div>
        <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground">Source</dt>
            <dd className="mt-0.5 font-mono break-all text-sky-300">{AUDIT_META.source}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground">Reviewed</dt>
            <dd className="mt-0.5 font-mono">{AUDIT_META.reviewed_at}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground">Evidence basis</dt>
            <dd className="mt-0.5 leading-5 text-muted-foreground">{AUDIT_META.evidence_basis}</dd>
          </div>
        </dl>
      </header>
      <RamosCanonRepoAudit />
      <CapabilityMatrix />
      <RedFlagLedger />
      <PocPhaseMenu />
      <AuditWorkbookCard />
    </div>
  );
}