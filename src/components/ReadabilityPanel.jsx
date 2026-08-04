export default function ReadabilityPanel({ readability, compact = false }) {
  if (!readability) return null;
  const statusClass = readability.targetMet
    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
    : 'border-amber-500/30 bg-amber-500/5 text-amber-400';

  return (
    <div className={`rounded-lg border p-3 ${statusClass}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-bold">Flesch–Kincaid readability</div>
          {!compact && <p className="mt-1 text-[10px] text-muted-foreground">Target: seventh grade. This is a review flag only and does not change Ω.</p>}
        </div>
        <span className="font-mono text-xs font-bold">{readability.targetMet ? 'TARGET BAND' : 'REVIEW FLAG'}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-foreground">
        <span>Grade level: <strong>{readability.gradeLevel}</strong></span>
        <span>Reading Ease: <strong>{readability.readingEase}</strong></span>
        {!compact && <span className="text-muted-foreground">{readability.wordCount.toLocaleString()} words</span>}
      </div>
    </div>
  );
}