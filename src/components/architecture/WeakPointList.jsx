import { AlertTriangle } from 'lucide-react';
import { chapterSignals } from '@/lib/architectureReport';
import WeakPointCard from '@/components/architecture/WeakPointCard';

export default function WeakPointList({ chapters }) {
  const flagged = chapters
    .map((chapter) => ({ chapter, signals: chapterSignals(chapter) }))
    .filter((row) => row.signals.length)
    .sort((a, b) => b.signals.length - a.signals.length);
  const weak = flagged.slice(0, 6);
  return (
    <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h2 className="font-bold">Priority Review Queue</h2>
        </div>
        <span className="font-mono text-xs text-amber-300">
          {weak.length} of {flagged.length} flagged chapters
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Most-flagged chapters first, with each failing signal listed separately.</p>
      {weak.length ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {weak.map(({ chapter, signals }) => (
            <WeakPointCard key={chapter.id} chapter={chapter} signals={signals} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">No weak-point signals in the current chapter records.</p>
      )}
    </section>
  );
}