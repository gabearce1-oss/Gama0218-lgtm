import { AlertTriangle, CheckCircle } from 'lucide-react';

const SEVERITY_CONFIG = {
  P0: 'text-red-400 border-red-500/30 bg-red-500/5',
  P1: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
  P2: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
};

export default function BlockerCard({ blocker, onToggle }) {
  const sevClass = SEVERITY_CONFIG[blocker.severity] || SEVERITY_CONFIG.P0;
  const resolved = blocker.status === 'resolved';

  return (
    <div className={`rounded-lg border p-5 transition-opacity ${resolved ? 'opacity-50' : ''} ${sevClass}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {resolved ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <span className="font-mono text-xs font-bold">{blocker.blocker_id}</span>
        </div>
        <button
          onClick={() => onToggle(blocker)}
          className={`text-xs px-3 py-1 rounded-md border transition-colors ${
            resolved
              ? 'border-emerald-500/30 text-emerald-400'
              : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          {resolved ? 'Resolved' : 'Mark Resolved'}
        </button>
      </div>
      <h3 className="font-bold text-sm mb-1">{blocker.title}</h3>
      <p className="text-xs text-muted-foreground mb-3">{blocker.description}</p>
      <div className="flex items-center gap-4 text-xs flex-wrap">
        <span className={`px-2 py-0.5 rounded border ${sevClass}`}>{blocker.severity}</span>
        {blocker.gate && (
          <span className="px-2 py-0.5 rounded border border-violet-500/30 bg-violet-500/5 text-violet-400 font-mono text-[10px]">{blocker.gate.replace(/_/g, ' ')}</span>
        )}
        {blocker.evidence_status && (
          <span className="px-2 py-0.5 rounded border border-sky-500/30 bg-sky-500/5 text-sky-400 font-mono text-[10px]">{blocker.evidence_status.replace(/_/g, ' ')}</span>
        )}
        {blocker.omega_penalty > 0 && (
          <span className="font-mono text-red-400">−{blocker.omega_penalty.toFixed(1)} Ω</span>
        )}
        {blocker.overlap_pct > 0 && (
          <span className="font-mono text-amber-400">{blocker.overlap_pct}% overlap</span>
        )}
        {blocker.words_at_risk > 0 && (
          <span className="font-mono text-muted-foreground">{blocker.words_at_risk.toLocaleString()} words at risk</span>
        )}
        {blocker.affected_chapters?.length > 0 && (
          <span className="font-mono text-muted-foreground">Ch. {blocker.affected_chapters.join(', ')}</span>
        )}
        {blocker.beat_pacing != null && (
          <span className="font-mono text-cyan-400">Beat {blocker.beat_pacing.toFixed(2)}</span>
        )}
        {blocker.flesch_reading_score != null && (
          <span className="font-mono text-sky-400">Flesch {blocker.flesch_reading_score.toFixed(1)}</span>
        )}
      </div>
    </div>
  );
}