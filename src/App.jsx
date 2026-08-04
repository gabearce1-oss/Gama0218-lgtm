import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Dashboard from './pages/Dashboard';
import ChapterDetail from './pages/ChapterDetail';
import Roadmap from './pages/Roadmap';
import Leaderboard from './pages/Leaderboard';
import Blockers from './pages/Blockers';
import Rules from './pages/Rules';
import CloudIntegrations from './pages/CloudIntegrations';
import VoiceAudit from './pages/VoiceAudit';
import CodeSwitching from './pages/CodeSwitching';
import CodeSwitchManager from './pages/CodeSwitchManager';
import VoiceProfiles from './pages/VoiceProfiles';
import Quarantine from './pages/Quarantine';
import Guardrail from './pages/Guardrail';
import SensoryHeatmap from './pages/SensoryHeatmap';
import Governance from './pages/Governance';
import BattleMysticism from './pages/BattleMysticism';
import BugScanner from './pages/BugScanner';
import PromptMaster from './pages/PromptMaster';
import EvidenceClaimManager from './pages/EvidenceClaimManager';
import BetaManuscript from './pages/BetaManuscript';
import PacingReviewer from './pages/PacingReviewer';
import QuarantineLog from './pages/QuarantineLog';
import InstitutionalOutreach from './pages/InstitutionalOutreach';
import StagingPass from './pages/StagingPass';
import MoralLandscapeScorer from './pages/MoralLandscapeScorer';
import ManuscriptTemplate from './pages/ManuscriptTemplate';
import ArchitectureReport from './pages/ArchitectureReport';
import ForensicScreening from './pages/ForensicScreening';
import DesignRoadmap from './pages/DesignRoadmap';
import EvidenceFreeze from './pages/EvidenceFreeze';
import MeasurementConstitution from './pages/MeasurementConstitution';
import ProseEngineAudit from './pages/ProseEngineAudit';
import ResearchThesis from './pages/ResearchThesis';
import CorpusFrame from './pages/CorpusFrame';
import AIDecommission from './pages/AIDecommission';
import OmegaPlaybook from './pages/OmegaPlaybook';
import FailsafeTrigger from './pages/FailsafeTrigger';
import PrizeStandard from './pages/PrizeStandard';
import DocumentScanner from './pages/DocumentScanner';
import IntegrationStack from './pages/IntegrationStack';
import SkillLibrary from './pages/SkillLibrary';
import SPSSPlaybook from './pages/SPSSPlaybook';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/moral-scorer" element={<MoralLandscapeScorer />} />
        <Route path="/staging-pass" element={<StagingPass />} />
        <Route path="/chapter/:id" element={<ChapterDetail />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/architecture-report" element={<ArchitectureReport />} />
        <Route path="/forensic-screening" element={<ForensicScreening />} />
        <Route path="/design-roadmap" element={<DesignRoadmap />} />
        <Route path="/evidence-freeze" element={<EvidenceFreeze />} />
        <Route path="/constitution" element={<MeasurementConstitution />} />
        <Route path="/thesis" element={<ResearchThesis />} />
        <Route path="/corpus-frame" element={<CorpusFrame />} />
        <Route path="/decommission" element={<AIDecommission />} />
        <Route path="/omega-playbook" element={<OmegaPlaybook />} />
        <Route path="/failsafe" element={<FailsafeTrigger />} />
        <Route path="/prize-standard" element={<PrizeStandard />} />
        <Route path="/document-scanner" element={<DocumentScanner />} />
        <Route path="/integration-stack" element={<IntegrationStack />} />
        <Route path="/skills" element={<SkillLibrary />} />
        <Route path="/spss-playbook" element={<SPSSPlaybook />} />
        <Route path="/external-audit" element={<ProseEngineAudit />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/blockers" element={<Blockers />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/cloud" element={<CloudIntegrations />} />
        <Route path="/voice-audit" element={<VoiceAudit />} />
        <Route path="/code-switching" element={<CodeSwitching />} />
        <Route path="/code-switch-manager" element={<CodeSwitchManager />} />
        <Route path="/voice-profiles" element={<VoiceProfiles />} />
        <Route path="/quarantine" element={<Quarantine />} />
        <Route path="/guardrail" element={<Guardrail />} />
        <Route path="/sensory-heatmap" element={<SensoryHeatmap />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/battle-mysticism" element={<BattleMysticism />} />
        <Route path="/bug-scanner" element={<BugScanner />} />
        <Route path="/prompt-master" element={<PromptMaster />} />
        <Route path="/evidence-claims" element={<EvidenceClaimManager />} />
        <Route path="/beta-manuscript" element={<BetaManuscript />} />
        <Route path="/pacing-reviewer" element={<PacingReviewer />} />
        <Route path="/quarantine-log" element={<QuarantineLog />} />
        <Route path="/outreach" element={<InstitutionalOutreach />} />
      </Route>
      <Route path="/manuscript-template" element={<ManuscriptTemplate />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App