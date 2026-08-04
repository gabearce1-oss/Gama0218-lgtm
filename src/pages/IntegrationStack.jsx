import { Plug } from 'lucide-react';
import { LANES } from '@/lib/integrationStack';
import IntegrationLane from '@/components/integrations/IntegrationLane';
import RefusalList from '@/components/integrations/RefusalList';
import IntegrationDownloads from '@/components/integrations/IntegrationDownloads';

export default function IntegrationStack() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      <header>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
          <Plug className="h-4 w-4" /> Operations · integration stack
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">Integration Stack</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Everything wired to this project, everything worth wiring next, and everything refused on principle. AI sits in
          a clerical lane and nowhere else; the statistics stay in SPSS, air-gapped, with no cloud engine anywhere in the
          chain.
        </p>
      </header>

      <IntegrationDownloads />
      {LANES.map((lane) => <IntegrationLane key={lane.lane} lane={lane} />)}
      <RefusalList />
    </div>
  );
}