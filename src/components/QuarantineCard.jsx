import { FileText, CheckCircle2, XCircle, GitMerge, Zap } from 'lucide-react';

const DIMENSION_COLORS = {
  CLS: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  BIS: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  SII: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  MRF: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
  'Code-Switching': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  Voice: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  Sensory: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  'Emotional Resonance': 'text-red-400 border-red-500/30 bg-red-500/10',
  Dialogue: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
};

const STATUS_CONFIG = {
  quarantined: { label: 'Quarantined', icon: Zap, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  approved: { label: 'Approved', icon: CheckCircle2, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  merged: { label: 'Merged', icon: GitMerge, color: 'text-violet-400 border-violet-500/30 bg-violet-500/10' },
};

function scoreColor(score) {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-orange-400';
}

export default function QuarantineCard({ item, onStatusChange }) {
  const dimClass = DIMENSION_COLORS[item.voice_dimension] || 'text-muted-foreground border-border bg-muted/50';
  const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.quarantined;
  const StatusIcon = status.icon;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${dimClass}`}>
            {item.voice_dimension}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.opportunity_type}</span>
          {item.chapter_suggestion > 0 && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted/50 border border-border">
              → Ch.{String(item.chapter_suggestion).padStart(2, '0')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {item.match_score != null && (
            <span className={`font-mono text-sm font-bold ${scoreColor(item.match_score)}`}>
              {item.match_score.toFixed(0)}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${status.color}`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        </div>
      </div>

      <div className="rounded-md border-l-2 border-amber-500/40 bg-amber-500/5 p-3 mb-3">
        <p className="text-sm italic text-foreground/90 leading-relaxed">"{item.passage_text}"</p>
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Why It's an Opportunity</span>
          <p className="text-xs text-foreground/70 mt-0.5">{item.reason}</p>
        </div>
        {item.suggested_application && (
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Suggested Application</span>
            <p className="text-xs text-cyan-300/80 mt-0.5">{item.suggested_application}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <FileText className="w-3 h-3" />
          <span className="truncate max-w-[200px]">{item.source_file}</span>
        </div>
        {item.status === 'quarantined' && (
          <div className="flex gap-1">
            <button
              onClick={() => onStatusChange(item, 'approved')}
              className="text-[10px] px-2 py-1 rounded border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onStatusChange(item, 'rejected')}
              className="text-[10px] px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => onStatusChange(item, 'merged')}
              className="text-[10px] px-2 py-1 rounded border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 transition-colors"
            >
              Merge
            </button>
          </div>
        )}
        {item.status !== 'quarantined' && (
          <button
            onClick={() => onStatusChange(item, 'quarantined')}
            className="text-[10px] px-2 py-1 rounded border border-border text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            Reopen
          </button>
        )}
      </div>
    </div>
  );
}