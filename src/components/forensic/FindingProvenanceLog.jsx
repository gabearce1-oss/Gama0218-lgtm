import { FileStack } from 'lucide-react';
import { FINDING_PROVENANCE, PROVENANCE_RULE, provenanceSummary } from '@/lib/findingProvenance';
import ProvenanceTierKey from './ProvenanceTierKey';
import FindingProvenanceRow from './FindingProvenanceRow';

export default function FindingProvenanceLog() {
  const s = provenanceSummary();

  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
          <FileStack className="h-3.5 w-3.5" /> Findings provenance log · APA 7
        </div>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight">Every Finding, Bound to Its Source</h2>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Each screening finding below is tied to the specific material it rests on, cited in APA 7 reference form and
          classified by how retrievable that material actually is. {PROVENANCE_RULE}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Findings logged', s.findings],
            ['Sources registered', s.sources],
            ['Drawing on a first-party artifact', s.firstParty],
            ['Resting only on non-retrievable material', s.byTier.T4],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-border bg-muted/20 p-3">
              <div className="font-mono text-xl font-bold text-primary">{value}</div>
              <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="border-b border-border p-5 sm:p-6">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-wider text-foreground/60">
          Provenance tiers used in this log
        </div>
        <ProvenanceTierKey />
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        {FINDING_PROVENANCE.map((row) => (
          <FindingProvenanceRow key={row.id} row={row} />
        ))}
      </div>

      <footer className="border-t border-border bg-muted/20 px-5 py-4 text-[11px] leading-relaxed text-muted-foreground sm:px-6">
        <span className="font-bold text-foreground/70">Reading this log · </span>
        Not one finding here rests on a source stronger than the manuscript itself. Where a conflict appears between the
        manuscript and a supplied report, the log records it as a finding about the report. Six of the eight findings
        cannot be closed from the material that raised them, which is stated rather than resolved by inference.
      </footer>
    </section>
  );
}