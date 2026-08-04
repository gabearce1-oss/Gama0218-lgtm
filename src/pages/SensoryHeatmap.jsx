import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

function heatColor(ratio) {
  if (ratio == null) return 'bg-muted/30 border-border text-muted-foreground';
  if (ratio >= 0.8) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
  if (ratio >= 0.6) return 'bg-teal-500/20 border-teal-500/40 text-teal-400';
  if (ratio >= 0.4) return 'bg-amber-500/20 border-amber-500/40 text-amber-400';
  if (ratio >= 0.2) return 'bg-orange-500/20 border-orange-500/40 text-orange-400';
  return 'bg-red-500/20 border-red-500/40 text-red-400';
}

function siiColor(sii) {
  if (sii == null) return 'text-muted-foreground';
  if (sii >= 5.0) return 'text-emerald-400';
  if (sii >= 3.5) return 'text-teal-400';
  if (sii >= 2.5) return 'text-amber-400';
  if (sii >= 1.5) return 'text-orange-400';
  return 'text-red-400';
}

function siiBarWidth(sii) {
  if (sii == null) return '0%';
  return `${Math.min(100, (sii / 6) * 100)}%`;
}

function HeatCell({ chapter }) {
  const ratio = (chapter.sensory_total && chapter.sensory_total > 0)
    ? chapter.sensory_present / chapter.sensory_total
    : null;
  const pct = ratio != null ? Math.round(ratio * 100) : null;

  return (
    <Link
      to={`/chapter/${chapter.id}`}
      className={`relative rounded-md border p-2.5 transition-all hover:scale-105 hover:z-10 ${heatColor(ratio)} group`}
    >
      <div className="text-[10px] font-mono opacity-70">Ch.{String(chapter.chapter_number).padStart(2, '0')}</div>
      <div className="text-lg font-bold font-mono">{pct != null ? `${pct}%` : '—'}</div>
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-44 rounded-md border border-border bg-popover p-2 shadow-xl">
        <div className="text-xs font-bold truncate">{chapter.title}</div>
        <div className="text-[10px] text-muted-foreground mt-1">
          Act {chapter.act} · {chapter.word_count ? chapter.word_count.toLocaleString() : '—'} words
        </div>
        <div className="flex justify-between mt-1 text-[10px]">
          <span className="text-muted-foreground">Sensory present</span>
          <span className="font-mono">{chapter.sensory_present ?? '—'}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Sensory total</span>
          <span className="font-mono">{chapter.sensory_total ?? '—'}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">SII</span>
          <span className={`font-mono font-bold ${siiColor(chapter.sii)}`}>{chapter.sii ? chapter.sii.toFixed(2) : '—'}</span>
        </div>
      </div>
    </Link>
  );
}

export default function SensoryHeatmap() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');

  useEffect(() => {
    base44.entities.Chapter.list('chapter_number', 100).then(data => {
      setChapters(data);
      setLoading(false);
    });
    const unsubscribe = base44.entities.Chapter.subscribe(event => {
      if (event.type === 'update') {
        setChapters(prev => prev.map(c => c.id === event.data?.id ? { ...c, ...event.data } : c));
      }
    });
    return unsubscribe;
  }, []);

  const scored = chapters.filter(c => c.sensory_total != null || c.sii != null);
  const sorted = [...scored].sort((a, b) => (a.sii || 0) - (b.sii || 0));
  const lowest = sorted.slice(0, 5);
  const highest = [...scored].sort((a, b) => (b.sii || 0) - (a.sii || 0)).slice(0, 5);

  const totalPresent = scored.reduce((s, c) => s + (c.sensory_present || 0), 0);
  const totalSlots = scored.reduce((s, c) => s + (c.sensory_total || 0), 0);
  const overallRatio = totalSlots > 0 ? totalPresent / totalSlots : 0;
  const avgSii = scored.length > 0 ? scored.reduce((s, c) => s + (c.sii || 0), 0) / scored.length : 0;
  const unscored = chapters.length - scored.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Eye className="w-4 h-4 text-amber-400" />
          Sensory Integration Audit
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Sensory Heatmap</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Color-coded view of sensory detail density across all chapters. Green = rich sensory integration, red = sensory gaps that need attention.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground mb-1">Overall Coverage</div>
          <div className="font-mono text-2xl font-bold text-amber-400">{overallRatio > 0 ? `${(overallRatio * 100).toFixed(0)}%` : '—'}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{totalPresent} / {totalSlots} slots</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground mb-1">Avg SII</div>
          <div className={`font-mono text-2xl font-bold ${siiColor(avgSii)}`}>{avgSii > 0 ? avgSii.toFixed(2) : '—'}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Sensory Integration Index</div>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="text-xs text-emerald-400 mb-1">Scored Chapters</div>
          <div className="font-mono text-2xl font-bold text-emerald-400">{scored.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground mb-1">Unscored</div>
          <div className="font-mono text-2xl font-bold text-muted-foreground">{unscored}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">No sensory data</div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 border-b border-border mb-6">
        <button
          onClick={() => setView('grid')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            view === 'grid' ? 'border-amber-400 text-amber-400' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Heat Grid
        </button>
        <button
          onClick={() => setView('ranked')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            view === 'ranked' ? 'border-amber-400 text-amber-400' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Ranked List
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-4 text-[10px]">
        <span className="text-muted-foreground">Coverage:</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/40" /> &lt;20%</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-orange-500/20 border border-orange-500/40" /> 20-40%</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/40" /> 40-60%</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-teal-500/20 border border-teal-500/40" /> 60-80%</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/40" /> 80%+</span>
      </div>

      {view === 'grid' ? (
        <>
          {/* Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 mb-8">
            {chapters.map(ch => (
              <HeatCell key={ch.id} chapter={ch} />
            ))}
          </div>

          {/* Top 5 / Bottom 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-emerald-400">Strongest Sensory Integration</h2>
              </div>
              <div className="space-y-2">
                {highest.map(ch => (
                  <SiiRow key={ch.id} chapter={ch} />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <h2 className="text-sm font-bold text-red-400">Sensory Gaps — Needs Work</h2>
              </div>
              <div className="space-y-2">
                {lowest.map(ch => (
                  <SiiRow key={ch.id} chapter={ch} />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Ranked List View */
        <div className="space-y-1.5">
          {sorted.map((ch, idx) => (
            <SiiRow key={ch.id} chapter={ch} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function SiiRow({ chapter, rank }) {
  const ratio = (chapter.sensory_total && chapter.sensory_total > 0)
    ? chapter.sensory_present / chapter.sensory_total
    : null;

  return (
    <Link
      to={`/chapter/${chapter.id}`}
      className="flex items-center gap-3 rounded-md border border-border bg-card p-2.5 hover:border-amber-500/30 transition-colors"
    >
      {rank && <span className="font-mono text-xs text-muted-foreground w-6">{rank}</span>}
      <span className="font-mono text-xs text-muted-foreground w-10">Ch.{String(chapter.chapter_number).padStart(2, '0')}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{chapter.title}</div>
        <div className="text-[10px] text-muted-foreground">
          {chapter.sensory_present ?? 0} / {chapter.sensory_total ?? 0} sensory slots
          {ratio != null && <span className="ml-2">· {(ratio * 100).toFixed(0)}% coverage</span>}
        </div>
      </div>
      {/* SII bar */}
      <div className="w-24 h-2 rounded-full bg-muted/50 overflow-hidden shrink-0">
        <div
          className={`h-full rounded-full ${
            chapter.sii >= 5 ? 'bg-emerald-400' : chapter.sii >= 3.5 ? 'bg-teal-400' : chapter.sii >= 2.5 ? 'bg-amber-400' : chapter.sii >= 1.5 ? 'bg-orange-400' : 'bg-red-400'
          }`}
          style={{ width: siiBarWidth(chapter.sii) }}
        />
      </div>
      <span className={`font-mono text-sm font-bold w-12 text-right ${siiColor(chapter.sii)}`}>
        {chapter.sii ? chapter.sii.toFixed(2) : '—'}
      </span>
    </Link>
  );
}