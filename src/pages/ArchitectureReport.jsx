import { useEffect, useState } from 'react';
import { FileBarChart, GitCompareArrows, Gauge, BarChart3, ListChecks, AlertTriangle, Table2 } from 'lucide-react';
import ReportSection from '@/components/architecture/ReportSection';
import { base44 } from '@/api/base44Client';
import ArchitectureSummary from '@/components/architecture/ArchitectureSummary';
import WeakPointList from '@/components/architecture/WeakPointList';
import RegressorRetirementCard from '@/components/architecture/RegressorRetirementCard';
import ArchitectureTable from '@/components/architecture/ArchitectureTable';
import DecontaminationChecklist from '@/components/architecture/DecontaminationChecklist';
import SourceReconciliationCard from '@/components/architecture/SourceReconciliationCard';
import ChapterWordCountChart from '@/components/architecture/ChapterWordCountChart';
import { reportMetrics, sortedChapters } from '@/lib/architectureReport';

export default function ArchitectureReport() {
  const [chapters, setChapters] = useState(null);
  const loadChapters = () => base44.entities.Chapter.list().then(setChapters);
  useEffect(() => { loadChapters(); }, []);
  if (!chapters) return <div className="p-8 text-muted-foreground">Loading manuscript architecture…</div>;
  const orderedChapters = sortedChapters(chapters);
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6 lg:p-8">
      <header className="mb-2"><div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400"><FileBarChart className="h-4 w-4" /> Manuscript reporting</div><h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">Architecture Summary Report</h1><p className="mt-2 text-sm text-muted-foreground">A complete chapter-level view of structural performance, engagement, and review priorities. Open a section to read it; everything stays closed until you ask for it.</p></header>

      <ReportSection icon={Gauge} label="Overview" title="Summary metrics" hint={`${orderedChapters.length} chapters`} defaultOpen>
        <ArchitectureSummary metrics={reportMetrics(orderedChapters)} />
      </ReportSection>

      <ReportSection icon={GitCompareArrows} label="Provenance" title="Source reconciliation" hint="verbatim source audit">
        <SourceReconciliationCard />
      </ReportSection>

      <ReportSection icon={BarChart3} label="Structure" title="Chapter word count distribution" hint="length architecture">
        <ChapterWordCountChart chapters={orderedChapters} />
      </ReportSection>

      <ReportSection icon={ListChecks} label="Hygiene" title="Decontamination checklist" hint="retired instruments">
        <DecontaminationChecklist chapters={orderedChapters} onFinalized={loadChapters} />
      </ReportSection>

      <ReportSection icon={AlertTriangle} label="Review priorities" title="Weak points" hint="lowest standing first" defaultOpen>
        <div className="space-y-5">
          <RegressorRetirementCard />
          <WeakPointList chapters={orderedChapters} />
        </div>
      </ReportSection>

      <ReportSection icon={Table2} label="Full ledger" title="Chapter-level architecture table" hint={`${orderedChapters.length} rows`}>
        <ArchitectureTable chapters={orderedChapters} />
      </ReportSection>
    </div>
  );
}