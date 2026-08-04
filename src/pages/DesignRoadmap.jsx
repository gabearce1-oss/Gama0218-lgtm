import { Compass } from 'lucide-react';
import CurrentSystemMap from '@/components/design/CurrentSystemMap';
import ConnectorLandscape from '@/components/design/ConnectorLandscape';
import CurrentStateBoundaries from '@/components/design/CurrentStateBoundaries';
import AnalysisGovernanceMap from '@/components/design/AnalysisGovernanceMap';

export default function DesignRoadmap() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <header className="rounded-lg border border-primary/30 bg-primary/5 p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary mb-3"><Compass className="w-4 h-4" />Current-state reference</div>
        <h1 className="text-3xl font-bold tracking-tight">LitCentral Design Snapshot</h1>
        <p className="text-sm text-muted-foreground max-w-3xl mt-2 leading-relaxed">A factual high-level diagram of the platform as it operates today: manuscript capture, restoration, scoring, safeguards, decisions, and reporting. This page records the present design and visible control boundaries; it does not prescribe future work.</p>
      </header>
      <CurrentSystemMap />
      <ConnectorLandscape />
      <AnalysisGovernanceMap />
      <CurrentStateBoundaries />
    </div>
  );
}