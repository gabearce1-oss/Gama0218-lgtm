import { Gauge } from 'lucide-react';

export default function ManuscriptReadabilitySummary({ chapters }) {
  const scores = chapters
    .map((chapter) => chapter.flesch_reading_score)
    .filter((score) => typeof score === 'number' && score > 0);
  const average = scores.length
    ? scores.reduce((total, score) => total + score, 0) / scores.length
    : null;
  const inTarget = scores.filter((score) => score >= 60 && score <= 70).length;

  return (
    <div className="rounded-lg border border-border bg-card p-5 mb-8">
      <div className="flex items-start gap-3">
        <Gauge className="w-5 h-5 text-cyan-400 mt-0.5" />
        <div className="flex-1">
          <h2 className="text-sm font-bold">Flesch Reading Score</h2>
          <p className="text-xs text-muted-foreground mt-1">Target 60–70 for a consistently accessible seventh-grade reading level.</p>
        </div>
        <div className="text-right">
          <div className="font-mono font-bold text-2xl text-cyan-400">{average ? average.toFixed(1) : '—'}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Manuscript average</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{scores.length} chapters scored</span>
        <span className="font-medium text-emerald-400">{inTarget} within target</span>
      </div>
    </div>
  );
}