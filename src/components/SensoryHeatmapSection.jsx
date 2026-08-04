import { Link } from 'react-router-dom';
import { Eye, TrendingUp, TrendingDown } from 'lucide-react';

function heatColor(ratio) {
  if (ratio == null) return 'bg-muted/30 border-border text-muted-foreground';
  if (ratio >= 0.8) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
  if (ratio >= 0.6) return 'bg-teal-500/20 border-teal-500/40 text-teal-400';
  if (ratio >= 0.4) return 'bg-amber-500/20 border-amber-500/40 text-amber-400';
  if (ratio >= 0.2) return 'bg-orange-500/20 border-orange-500/40 text-orange-400';
  return 'bg-red-500/20 border-red-500/40 text-red-400';
}

function wordDensityColor(density) {
  if (density == null) return 'text-muted-foreground';
  if (density >= 3000) return 'text-emerald-400';
  if (density >= 2000) return 'text-teal-400';
  if (density >= 1200) return 'text-amber-400';
  return 'text-orange-400';
}

function emotionalBeat(sii, ratio) {
  if (sii == null && ratio == null) return { label: '—', color: 'text-muted-foreground' };
  const score = (sii || 0) + (ratio != null ? ratio * 3 : 0);
  if (score >= 5) return { label: 'Peak', color: 'text-emerald-400' };
  if (score >= 3.5) return { label: 'Strong', color: 'text-teal-400' };
  if (score >= 2) return { label: 'Hit', color: 'text-amber-400' };
  return { label: 'Gap', color: 'text-red-400' };
}

export default function SensoryHeatmapSection({ chapters }) {
  const sensoryChapters = chapters.filter(c => c.sensory_total != null || c.sii != null);
  const sorted = [...sensoryChapters].sort((a, b) => (a.sii || 0) - (b.sii || 0));
  const lowest = sorted.slice(0, 4);
  const highest = [...sensoryChapters].sort((a, b) => (b.sii || 0) - (a.sii || 0)).slice(0, 4);

  const totalPresent = sensoryChapters.reduce((s, c) => s + (c.sensory_present || 0), 0);
  const totalSlots = sensoryChapters.reduce((s, c) => s + (c.sensory_total || 0), 0);
  const overallRatio = totalSlots > 0 ? totalPresent / totalSlots : 0;
  const avgSii = sensoryChapters.length > 0 ? sensoryChapters.reduce((s, c) => s + (c.sii || 0), 0) / sensoryChapters.length : 0;

  const scoredWords = sensoryChapters.reduce((s, c) => s + (c.word_count || 0), 0);
  const avgWordDensity = sensoryChapters.length > 0 ? scoredWords / sensoryChapters.length : 0;

  const peakChapters = sensoryChapters.filter(c => {
    const ratio = (c.sensory_total && c.sensory_total > 0) ? c.sensory_present / c.sensory_total : 0;
    const score = (c.sii || 0) + ratio * 3;
    return score >= 5;
  });

  return (
    <div className="rounded-lg border border-border bg-card p-5 mb-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Sensory & Word Density Heatmap</h2>
        </div>
        <Link to="/sensory-heatmap" className="text-xs text-amber-400 hover:underline">Full view →</Link>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Tracks sensory imagery coverage and word density per chapter to reveal which chapters hit the right emotional beats.
      </p>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="rounded-md border border-border bg-background/50 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sensory Coverage</div>
          <div className="font-mono text-xl font-bold text-amber-400">{overallRatio > 0 ? `${(overallRatio * 100).toFixed(0)}%` : '—'}</div>
          <div className="text-[10px] text-muted-foreground">{totalPresent}/{totalSlots} slots</div>
        </div>
        <div className="rounded-md border border-border bg-background/50 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg SII</div>
          <div className="font-mono text-xl font-bold text-teal-400">{avgSii > 0 ? avgSii.toFixed(2) : '—'}</div>
          <div className="text-[10px] text-muted-foreground">Sensory Integration Index</div>
        </div>
        <div className="rounded-md border border-border bg-background/50 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Word Density</div>
          <div className={`font-mono text-xl font-bold ${wordDensityColor(avgWordDensity)}`}>{avgWordDensity > 0 ? avgWordDensity.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}</div>
          <div className="text-[10px] text-muted-foreground">words / chapter</div>
        </div>
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3">
          <div className="text-[10px] uppercase tracking-wider text-emerald-400">Emotional Peak</div>
          <div className="font-mono text-xl font-bold text-emerald-400">{peakChapters.length}</div>
          <div className="text-[10px] text-muted-foreground">chapters hitting beats</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 text-[10px] flex-wrap">
        <span className="text-muted-foreground">Sensory:</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/40" /> &lt;20%</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-orange-500/20 border border-orange-500/40" /> 20-40%</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/40" /> 40-60%</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-teal-500/20 border border-teal-500/40" /> 60-80%</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/40" /> 80%+</span>
      </div>

      {/* Heat Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5 mb-5">
        {chapters.map(ch => {
          const ratio = (ch.sensory_total && ch.sensory_total > 0)
            ? ch.sensory_present / ch.sensory_total
            : null;
          const pct = ratio != null ? Math.round(ratio * 100) : null;
          return (
            <Link
              key={ch.id}
              to={`/chapter/${ch.id}`}
              className={`relative rounded-md border p-1.5 transition-all hover:scale-105 hover:z-10 ${heatColor(ratio)} group text-center`}
            >
              <div className="text-[9px] font-mono opacity-70">Ch.{String(ch.chapter_number).padStart(2, '0')}</div>
              <div className="text-sm font-bold font-mono">{pct != null ? `${pct}%` : '—'}</div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-48 rounded-md border border-border bg-popover p-2 shadow-xl">
                <div className="text-xs font-bold truncate">{ch.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {ch.act ? `Act ${ch.act} · ` : ''}{ch.word_count ? ch.word_count.toLocaleString() : '—'} words
                </div>
                <div className="flex justify-between mt-1 text-[10px]">
                  <span className="text-muted-foreground">Sensory</span>
                  <span className="font-mono">{ch.sensory_present ?? 0}/{ch.sensory_total ?? 0}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">SII</span>
                  <span className="font-mono font-bold">{ch.sii ? ch.sii.toFixed(2) : '—'}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Beat</span>
                  <span className={`font-mono font-bold ${emotionalBeat(ch.sii, ratio).color}`}>{emotionalBeat(ch.sii, ratio).label}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Top & Bottom Chapters by Emotional Beat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Hitting the Beats</h3>
          </div>
          <div className="space-y-1.5">
            {highest.map(ch => {
              const ratio = (ch.sensory_total && ch.sensory_total > 0) ? ch.sensory_present / ch.sensory_total : null;
              const beat = emotionalBeat(ch.sii, ratio);
              return (
                <Link key={ch.id} to={`/chapter/${ch.id}`} className="flex items-center gap-2 rounded-md border border-border bg-background/50 p-2 hover:border-amber-500/30 transition-colors">
                  <span className="font-mono text-[10px] text-muted-foreground w-8">Ch.{String(ch.chapter_number).padStart(2, '0')}</span>
                  <span className="text-xs font-medium truncate flex-1">{ch.title}</span>
                  <span className={`font-mono text-xs font-bold ${beat.color}`}>{beat.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{ch.sii ? ch.sii.toFixed(1) : '—'}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400">Emotional Gaps</h3>
          </div>
          <div className="space-y-1.5">
            {lowest.map(ch => {
              const ratio = (ch.sensory_total && ch.sensory_total > 0) ? ch.sensory_present / ch.sensory_total : null;
              const beat = emotionalBeat(ch.sii, ratio);
              return (
                <Link key={ch.id} to={`/chapter/${ch.id}`} className="flex items-center gap-2 rounded-md border border-border bg-background/50 p-2 hover:border-amber-500/30 transition-colors">
                  <span className="font-mono text-[10px] text-muted-foreground w-8">Ch.{String(ch.chapter_number).padStart(2, '0')}</span>
                  <span className="text-xs font-medium truncate flex-1">{ch.title}</span>
                  <span className={`font-mono text-xs font-bold ${beat.color}`}>{beat.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{ch.sii ? ch.sii.toFixed(1) : '—'}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}