import { ShieldCheck } from 'lucide-react';
import ArtifactManifestTable from '@/components/evidence/ArtifactManifestTable';
import AuthorityScopeCard from '@/components/evidence/AuthorityScopeCard';
import ProvenanceEnvelopeSpec from '@/components/evidence/ProvenanceEnvelopeSpec';
import FreezeGateChecklist from '@/components/evidence/FreezeGateChecklist';

export default function EvidenceFreeze() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <header className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 mb-3">
          <ShieldCheck className="w-4 h-4" /> Phase 1 · Evidence freeze
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Chain of Custody</h1>
        <p className="text-sm text-muted-foreground max-w-3xl mt-2 leading-relaxed">
          The contamination originated in architecture, not in a single coefficient: source evidence, human judgment, AI
          estimates, regression output, cultural variables, and final scores shared one surface. This page freezes the
          source artifacts, records the authority boundaries, and defines the provenance envelope every downstream value
          must carry before schema separation begins.
        </p>
      </header>
      <ArtifactManifestTable />
      <AuthorityScopeCard />
      <ProvenanceEnvelopeSpec />
      <FreezeGateChecklist />
    </div>
  );
}