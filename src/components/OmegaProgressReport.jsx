import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Flame, TrendingUp, TrendingDown, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell
} from 'recharts';

const ELITE_THRESHOLD = 109.5;

export default function OmegaProgressReport() {
  const [drafts, setDrafts] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [d, c] = await Promise.all([
        base44.entities.RestorationDraft.list('-chapter_number', 100),
        base44.entities.Chapter.list(),
      ]);
      setDrafts(d.sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)));
      setChapters(c);
    } catch (err) {
      console.error('Failed to load progress data:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-5 mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-orange-400" /> Loading restoration progress…
        </div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return null;
  }

  // Build chart data — merge chapter originals with cooked drafts
  const chartData = drafts.map((draft) => {
    const chapter = chapters.find((c) => c.chapter_number === draft.chapter_number);
    const original = chapter?.omega || draft.original_omega || null;
    return {
      chapter: `Ch.${draft.chapter_number}`,
      chapterNum: draft.chapter_number,
      title: draft.chapter_title || chapter?.title || 'Untitled',
      original: original != null ? Number(original.toFixed(1)) : null,
      cooked: draft.cooked_omega ? Number(draft.cooked_omega.toFixed(1)) : null,
      delta: original != null && draft.cooked_omega != null ? Number((draft.cooked_omega - original).toFixed(1)) : null,
      passages: draft.approved_passages || 0,
      status: draft.status,
    };
  });

  // Compute summary stats
  const totalDrafts = drafts.length;
  const publishedCount = drafts.filter((d) => d.status === 'published').length;
  const chaptersWithBefore = chartData.filter((d) => d.original != null);
  const newChapters = chartData.filter((d) => d.original == null);
  const improved = chaptersWithBefore.filter((d) => d.delta > 0);
  const declined = chaptersWithBefore.filter((d) => d.delta < 0);
  const totalDelta = chaptersWithBefore.reduce((s, d) => s + d.delta, 0);
  const meanCooked = chartData.length > 0
    ? chartData.reduce((s, d) => s + (d.cooked || 0), 0) / chartData.length
    : 0;
  const eliteCooked = chartData.filter((d) => d.cooked >= ELITE_THRESHOLD).length;
  const totalPassages = drafts.reduce((s, d) => s + (d.approved_passages || 0), 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    return (
      <div className="rounded-md border border-border bg-popover p-3 text-xs shadow-lg">
        <div className="font-bold text-sm mb-1">{data.chapter}: {data.title}</div>
        <div className="space-y-0.5">
          {data.original != null ? (
            <div className="text-muted-foreground">Before: <span className="font-mono font-bold text-foreground">{data.original}</span></div>
          ) : (
            <div className="text-cyan-400">Previously unscored</div>
          )}
          <div className="text-muted-foreground">After: <span className="font-mono font-bold text-emerald-400">{data.cooked}</span></div>
          {data.delta != null && (
            <div className={data.delta >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              Δ {data.delta >= 0 ? '+' : ''}{data.delta}
            </div>
          )}
          <div className="text-amber-400">{data.passages} passages</div>
          {data.status === 'published' && <div className="text-emerald-400 font-bold">✓ Published</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-5 mb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-orange-500/10 border border-orange-500/30 p-2">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Ω Restoration Progress</h2>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">Beta</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Before vs. after Ω scores for {totalDrafts} chapters cooked from {totalPassages} approved restoration passages.
            </p>
          </div>
        </div>
        <Link
          to="/beta-manuscript"
          className="shrink-0 text-xs text-orange-400 hover:underline inline-flex items-center gap-1"
        >
          View Beta Manuscript <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-5">
        <div className="rounded-md border border-border bg-card/50 p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Chapters Cooked</div>
          <div className="font-mono font-bold text-lg text-orange-400 mt-0.5">{totalDrafts}</div>
        </div>
        <div className="rounded-md border border-border bg-card/50 p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Published</div>
          <div className="font-mono font-bold text-lg text-emerald-400 mt-0.5">{publishedCount}</div>
        </div>
        <div className="rounded-md border border-border bg-card/50 p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Newly Scored</div>
          <div className="font-mono font-bold text-lg text-cyan-400 mt-0.5">{newChapters.length}</div>
        </div>
        <div className="rounded-md border border-border bg-card/50 p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Improved</div>
          <div className="font-mono font-bold text-lg text-emerald-400 mt-0.5">
            {improved.length}{declined.length > 0 && <span className="text-red-400 text-xs"> / {declined.length}↓</span>}
          </div>
        </div>
        <div className="rounded-md border border-border bg-card/50 p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mean Cooked Ω</div>
          <div className="font-mono font-bold text-lg text-amber-400 mt-0.5">{meanCooked.toFixed(1)}</div>
        </div>
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider text-emerald-400">Elite (≥{ELITE_THRESHOLD})</div>
          <div className="font-mono font-bold text-lg text-emerald-400 mt-0.5">{eliteCooked}</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-md border border-border bg-card/30 p-4 mb-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Ω Score: Before vs. After Restoration</div>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 16% 20%)" />
            <XAxis
              dataKey="chapter"
              tick={{ fill: 'hsl(215 14% 60%)', fontSize: 9 }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis
              domain={[100, 116]}
              tick={{ fill: 'hsl(215 14% 60%)', fontSize: 10 }}
              tickFormatter={(v) => v.toFixed(0)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(43 54% 55% / 0.05)' }} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
            />
            <ReferenceLine y={ELITE_THRESHOLD} stroke="hsl(142 71% 45%)" strokeDasharray="4 4" strokeWidth={1.5}>
            </ReferenceLine>
            <Bar dataKey="original" name="Before Ω" fill="hsl(215 14% 40%)" radius={[2, 2, 0, 0]} maxBarSize={28} />
            <Bar dataKey="cooked" name="After Ω (Cooked)" radius={[2, 2, 0, 0]} maxBarSize={28}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.cooked >= ELITE_THRESHOLD ? 'hsl(142 71% 45%)' : 'hsl(43 74% 56%)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[hsl(142_71%_45%)]" /> Elite (≥{ELITE_THRESHOLD})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[hsl(43_74%_56%)]" /> Strong</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[hsl(142_71%_45%)]" style={{ borderTop: '2px dashed' }} /> Elite Threshold</span>
        </div>
      </div>

      {/* Chapter-by-chapter delta list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {chartData.map((d) => (
          <div
            key={d.chapterNum}
            className={`flex items-center gap-3 px-3 py-2 rounded-md border text-xs ${
              d.status === 'published' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border bg-card/30'
            }`}
          >
            <span className="font-mono font-bold text-muted-foreground w-10 shrink-0">{d.chapter}</span>
            <span className="flex-1 truncate text-muted-foreground">{d.title}</span>
            <span className="font-mono text-muted-foreground w-12 text-right">{d.original != null ? d.original : '—'}</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className={`font-mono font-bold w-12 text-right ${d.cooked >= ELITE_THRESHOLD ? 'text-emerald-400' : 'text-amber-400'}`}>{d.cooked}</span>
            {d.delta != null ? (
              <span className={`font-mono font-bold w-12 text-right inline-flex items-center gap-0.5 justify-end ${d.delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {d.delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {d.delta >= 0 ? '+' : ''}{d.delta}
              </span>
            ) : (
              <span className="font-mono text-cyan-400 w-12 text-right">NEW</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}