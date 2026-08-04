import { ROLLOUT_TIMELINE } from '@/lib/outreachData';
import { Calendar, Layers } from 'lucide-react';

const TRACK_COLORS = {
  'Evidence Assembly': 'border-red-500/30 text-red-400 bg-red-500/5',
  'Institutional Outreach': 'border-amber-500/30 text-amber-400 bg-amber-500/5',
  'Technical Hardening': 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5',
  'Public Communications': 'border-violet-500/30 text-violet-400 bg-violet-500/5',
};

export default function RolloutTimeline() {
  const months = [...new Set(ROLLOUT_TIMELINE.map((t) => t.month))];

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-amber-400" />
        <h2 className="text-sm font-bold uppercase tracking-wider">Rollout Timeline</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {months.map((month) => {
          const entries = ROLLOUT_TIMELINE.filter((t) => t.month === month);
          return (
            <div key={month} className="space-y-2">
              <div className="font-mono text-xs font-bold text-amber-400 sticky top-0">{month}</div>
              {entries.map((entry, idx) => {
                const trackColor = TRACK_COLORS[entry.track] || 'border-border text-muted-foreground';
                return (
                  <div key={idx} className={`rounded-md border p-2.5 ${trackColor}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Layers className="w-3 h-3 shrink-0" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">{entry.track}</span>
                    </div>
                    {entry.items.map((item, i) => (
                      <div key={i} className="text-xs text-foreground mt-1">{item}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}