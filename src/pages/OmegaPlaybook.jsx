import { BookOpen } from 'lucide-react';
import CeilingCard from '@/components/playbook/CeilingCard';
import LeverageTable from '@/components/playbook/LeverageTable';
import ScorecardSplit from '@/components/playbook/ScorecardSplit';
import SpssLaneCard from '@/components/playbook/SpssLaneCard';

export default function OmegaPlaybook() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      <header>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
          <BookOpen className="h-4 w-4" /> Measurement playbook
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">The Omega Playbook</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          One page for the whole instrument: the formula, the 114.593 reconstruction ceiling, and the line between what
          our own scorecard holds and what belongs to outside criteria. We follow their rules in public — we keep our own
          numbers here, computed by hand.
        </p>
      </header>

      <CeilingCard />
      <LeverageTable />
      <ScorecardSplit />
      <SpssLaneCard />
    </div>
  );
}