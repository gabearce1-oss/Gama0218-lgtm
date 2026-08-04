import { BookMarked } from 'lucide-react';
import AuthorialIntentCard from '@/components/thesis/AuthorialIntentCard';
import FootnoteLensCard from '@/components/thesis/FootnoteLensCard';
import ApaReferenceList from '@/components/thesis/ApaReferenceList';
import ThesisStatements from '@/components/thesis/ThesisStatements';
import ControlLanguageCard from '@/components/thesis/ControlLanguageCard';
import CanonTheoryFoundation from '@/components/thesis/CanonTheoryFoundation';
import ResearchQuestions from '@/components/thesis/ResearchQuestions';
import OperationalizationMatrix from '@/components/thesis/OperationalizationMatrix';
import RegressionModelCard from '@/components/thesis/RegressionModelCard';
import ChicanoLensDoctrine from '@/components/thesis/ChicanoLensDoctrine';
import MethodologyPhases from '@/components/thesis/MethodologyPhases';
import LockedPhaseOrder from '@/components/thesis/LockedPhaseOrder';
import IncidentEvidenceLedger from '@/components/thesis/IncidentEvidenceLedger';
import BenchmarkVerificationQueue from '@/components/thesis/BenchmarkVerificationQueue';
import SourceAuditReconciliation from '@/components/thesis/SourceAuditReconciliation';
import ExpectedContributions from '@/components/thesis/ExpectedContributions';
import PeerReviewFoundationCard from '@/components/thesis/PeerReviewFoundationCard';
import QualificationFronts from '@/components/thesis/QualificationFronts';
import ReviewReadinessLedger from '@/components/thesis/ReviewReadinessLedger';

export default function ResearchThesis() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      <header className="rounded-lg border border-primary/30 bg-primary/5 p-6">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
          <BookMarked className="h-4 w-4" /> Research framework · Forensic prose modeling &amp; algorithmic canon bias
        </div>
        <h1 className="text-3xl font-bold tracking-tight">LitCentral &amp; Truth Engine: The Study</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The governing research document for the hybrid forensic-literary engine: thesis statements, research questions,
          the operationalization matrix, the score-fluctuation model, the locked phase order, and the two Article IX
          lanes that keep incident evidence permanently separated from unverified external benchmarks.
        </p>
      </header>
      <AuthorialIntentCard />
      <FootnoteLensCard />
      <ThesisStatements />
      <ControlLanguageCard />
      <CanonTheoryFoundation />
      <ResearchQuestions />
      <OperationalizationMatrix />
      <RegressionModelCard />
      <ChicanoLensDoctrine />
      <MethodologyPhases />
      <LockedPhaseOrder />
      <IncidentEvidenceLedger />
      <BenchmarkVerificationQueue />
      <SourceAuditReconciliation />
      <PeerReviewFoundationCard />
      <QualificationFronts />
      <ReviewReadinessLedger />
      <ExpectedContributions />
      <ApaReferenceList />
    </div>
  );
}