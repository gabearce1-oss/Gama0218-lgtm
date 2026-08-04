import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import LedgerIntegrityPanel from '@/components/forensic/LedgerIntegrityPanel';
import ScreeningFindings from '@/components/forensic/ScreeningFindings';
import AttributionVerificationLedger from '@/components/forensic/AttributionVerificationLedger';
import FindingProvenanceLog from '@/components/forensic/FindingProvenanceLog';

export default function ForensicScreening() {
  const [chapters, setChapters] = useState(null);
  useEffect(() => { base44.entities.Chapter.list().then(setChapters); }, []);
  if (!chapters) return <div className="p-8 text-muted-foreground">Loading forensic screening…</div>;
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-8">
      <header><div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-300"><ShieldAlert className="h-4 w-4" /> Evidence-limited review</div><h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">Forensic Screening Report</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">An engineering handoff of data conflicts and evidence gaps found in the readable materials and live chapter ledger. It does not certify formulas, institutional status, or external benchmarks.</p></header>
      <LedgerIntegrityPanel chapters={chapters} />
      <ScreeningFindings />
      <FindingProvenanceLog />
      <AttributionVerificationLedger />
      <p className="rounded-lg border border-border p-4 text-xs leading-5 text-muted-foreground">Sources reviewed: Ramos 2 audit report, Pulitzer baseline analysis, current chapter ledger, and the BIBFRAME spreadsheet. The two forensic PDFs could not be processed.</p>
    </div>
  );
}