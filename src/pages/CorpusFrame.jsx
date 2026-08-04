import { Library } from 'lucide-react';
import { WAR_COHORT, LATINO_COHORT } from '@/lib/canonChartFrame';
import CorpusProvenanceCard from '@/components/corpus/CorpusProvenanceCard';
import CohortTable from '@/components/corpus/CohortTable';
import CorpusFrameFindings from '@/components/corpus/CorpusFrameFindings';
import ManuscriptExclusionBanner from '@/components/corpus/ManuscriptExclusionBanner';
import NonCompetitionDisclaimer from '@/components/prize/NonCompetitionDisclaimer';
import DescriptivesPanel from '@/components/corpus/DescriptivesPanel';
import ReceptionDivergenceChart from '@/components/corpus/ReceptionDivergenceChart';
import StratumDistributionChart from '@/components/corpus/StratumDistributionChart';
import StratumRankTable from '@/components/corpus/StratumRankTable';
import ScaleReclassificationCard from '@/components/corpus/ScaleReclassificationCard';
import CanonLanguageProvenanceCard from '@/components/corpus/CanonLanguageProvenanceCard';
import AiErrorLedger from '@/components/corpus/AiErrorLedger';
import ProseMetricStandingCard from '@/components/corpus/ProseMetricStandingCard';
import RetainedMetricsTable from '@/components/corpus/RetainedMetricsTable';
import DisplacementModelCard from '@/components/corpus/DisplacementModelCard';

export default function CorpusFrame() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      <header className="rounded-lg border border-primary/30 bg-primary/5 p-6">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
          <Library className="h-4 w-4" /> W2 · Comparative corpus sampling frame
        </div>
        <h1 className="text-3xl font-bold tracking-tight">The Canon Chart</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The first external corpus this project actually holds: roughly 700 texts, ranked, with counts attached. It is
          the missing input behind every percentile claim — and reading it carefully removes the percentile claims rather
          than supporting them. Recorded verbatim, with its unknowns stated before its findings.
        </p>
      </header>

      <ManuscriptExclusionBanner />

      <NonCompetitionDisclaimer />

      <CanonLanguageProvenanceCard />

      <ScaleReclassificationCard />

      <AiErrorLedger />

      <ProseMetricStandingCard />

      <RetainedMetricsTable />

      <DisplacementModelCard />

      <CorpusProvenanceCard />

      <DescriptivesPanel />

      <ReceptionDivergenceChart />

      <StratumDistributionChart />

      <StratumRankTable />

      <CohortTable
        title="War &amp; veteran literature in the frame"
        subtitle="Verbatim rows. The two texts the thesis names as controls are highlighted; both are located here for the first time."
        rows={WAR_COHORT}
      />

      <CohortTable
        title="Chicano &amp; Latin American presence"
        subtitle="Every Chicano/Chicana and Latin American entry found in the chart, verbatim. There are three, and only one is Chicana."
        rows={LATINO_COHORT}
      />

      <CorpusFrameFindings />
    </div>
  );
}