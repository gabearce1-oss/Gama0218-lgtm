import { Ban } from 'lucide-react';

export default function ManuscriptExclusionBanner() {
  return (
    <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
        <Ban className="h-4 w-4" /> Standing disclaimer · applies to every figure on this page
      </div>
      <h3 className="mt-1 text-lg font-bold">The manuscript is not in it</h3>
      <p className="mt-2 text-sm leading-6">
        <span className="font-semibold">SGT George Ramos: The Mathematics of Vietnam</span> does not appear in this frame,
        and would not — an unpublished manuscript has no curriculum footprint.
      </p>
      <p className="mt-2 text-sm leading-6 text-red-200">
        This frame cannot place the manuscript. It can only supply control texts to score under the frozen instrument.
        That is exactly the Phase 5 input that was missing.
      </p>
      <p className="mt-3 border-l-2 border-red-400 pl-3 font-mono text-xs leading-6 text-red-300">
        No rank, percentile, or standing on this page may be attributed to the manuscript. Every statistic below
        describes the control corpus and nothing else.
      </p>
    </div>
  );
}