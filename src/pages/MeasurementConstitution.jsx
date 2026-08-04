import { Landmark } from 'lucide-react';
import ConstitutionArticles from '@/components/constitution/ConstitutionArticles';
import WorkbookTemplateVault from '@/components/constitution/WorkbookTemplateVault';
import CodebookColumnSpec from '@/components/constitution/CodebookColumnSpec';
import ValidationGateLadder from '@/components/constitution/ValidationGateLadder';
import ReviewBoardTable from '@/components/constitution/ReviewBoardTable';
import WorkbookCustodyMap from '@/components/constitution/WorkbookCustodyMap';
import DelegationModelCard from '@/components/constitution/DelegationModelCard';

export default function MeasurementConstitution() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <header className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 mb-3">
          <Landmark className="w-4 h-4" /> Foundation deliverable
        </div>
        <h1 className="text-3xl font-bold tracking-tight">LitCentral Measurement Constitution</h1>
        <p className="text-sm text-muted-foreground max-w-3xl mt-2 leading-relaxed">
          LitCentral is the governed evidence and measurement warehouse. SPSS is the autonomous laboratory. Cognos is the
          read-only reporting layer. This page and the four empty workbook templates below are the foundation laid before
          another score is calculated &mdash; a new dashboard on a crooked house looks terrific while the floor keeps moving.
        </p>
      </header>
      <ConstitutionArticles />
      <WorkbookCustodyMap />
      <DelegationModelCard />
      <WorkbookTemplateVault />
      <CodebookColumnSpec />
      <ValidationGateLadder />
      <ReviewBoardTable />
    </div>
  );
}