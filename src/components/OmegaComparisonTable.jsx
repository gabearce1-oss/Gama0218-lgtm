import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, ArrowRight, TrendingUp, TrendingDown, GitCompareArrows } from 'lucide-react';

const ELITE_THRESHOLD = 109.5;

function deltaColor(delta) {
  if (delta >= 5) return 'text-emerald-400';
  if (delta >= 1) return 'text-lime-400';
  if (delta >= 0) return 'text-amber-400';
  return 'text-red-400';
}

function deltaBarColor(delta) {
  if (delta >= 5) return 'bg-emerald-500';
  if (delta >= 1) return 'bg-lime-500';
  if (delta >= 0) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function OmegaComparisonTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState('chapter'); // 'chapter' | 'delta'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [drafts, chapters] = await Promise.all([
        base44.entities.RestorationDraft.list('-chapter_number', 100),
        base44.entities.Chapter.list(),
      ]);
      const merged = drafts.map((draft) => {
        const chapter = chapters.find((c) => c.chapter_number === draft.chapter_number);
        const original = chapter?.omega || draft.original_omega || null;
        const cooked = draft.cooked_omega || null;
        const delta = original != null && cooked != null ? Number((cooked - original).toFixed(1)) : null;
        return {
          chapterNum: draft.chapter_number,
          title: draft.chapter_title || chapter?.title || 'Untitled',
          original,
          cooked,
          delta,
          passages: draft.approved_passages || 0,
          status: draft.status,
        };
      });
      setRows(merged);
    } catch (err) {
      console.error('Failed to load comparison data:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> Loading comparison…
        </div>
      </div>
    );
  }

  if (rows.length === 0) return null;

  const sortable = rows.filter((r) => r.delta != null);
  const newRows = rows.filter((r) => r.delta == null);

  const sortedRows = sortMode === 'delta'
    ? [...sortable].sort((a, b) => b.delta - a.delta).concat(newRows)
    : [...rows].sort((a, b) => a.chapterNum - b.chapterNum);

  const totalDelta = sortable.reduce((s, r) => s + r.delta, 0);
  const meanDelta = sortable.length > 0 ? totalDelta / sortable.length : 0;
  const maxAbsDelta = Math.max(...sortable.map((r) => Math.abs(r.delta)), 1);

  const improvedCount = sortable.filter((r) => r.delta > 0).length;
  const declinedCount = sortable.filter((r) => r.delta < 0).length;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden mb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-2">
            <GitCompareArrows className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Ω Before vs. After Restoration</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Side-by-side comparison of every chapter's Omega score before and after the bulk restoration.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setSortMode('chapter')}
            className={`px-2.5 py-1 text-[10px] font-medium rounded border transition-colors ${
              sortMode === 'chapter' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            By Chapter
          </button>
          <button
            onClick={() => setSortMode('delta')}
            className={`px-2.5 py-1 text-[10px] font-medium rounded border transition-colors ${
              sortMode === 'delta' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            By Improvement
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border-b border-border">
        <div className="bg-card px-5 py-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Chapters Compared</div>
          <div className="font-mono font-bold text-lg text-amber-400">{sortable.length}</div>
        </div>
        <div className="bg-card px-5 py-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mean Improvement</div>
          <div className={`font-mono font-bold text-lg ${meanDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {meanDelta >= 0 ? '+' : ''}{meanDelta.toFixed(2)} Ω
          </div>
        </div>
        <div className="bg-card px-5 py-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Gain</div>
          <div className={`font-mono font-bold text-lg ${totalDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalDelta >= 0 ? '+' : ''}{totalDelta.toFixed(1)} Ω
          </div>
        </div>
        <div className="bg-card px-5 py-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Improved / Declined</div>
          <div className="font-mono font-bold text-lg">
            <span className="text-emerald-400">{improvedCount}</span>
            <span className="text-muted-foreground text-xs"> / </span>
            <span className="text-red-400">{declinedCount}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="text-left font-medium px-5 py-2.5">Chapter</th>
              <th className="text-right font-medium px-3 py-2.5 w-24">Before Ω</th>
              <th className="text-center font-medium px-2 py-2.5 w-8"></th>
              <th className="text-right font-medium px-3 py-2.5 w-24">After Ω</th>
              <th className="text-right font-medium px-3 py-2.5 w-28">Improvement</th>
              <th className="text-left font-medium px-3 py-2.5 w-40">Visual</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((r) => (
              <tr
                key={r.chapterNum}
                className={`border-b border-border/50 hover:bg-muted/20 ${r.status === 'published' ? 'bg-emerald-500/[0.03]' : ''}`}
              >
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-muted-foreground text-xs">Ch.{r.chapterNum}</span>
                    <span className="text-foreground/80 truncate max-w-[180px]">{r.title}</span>
                    {r.status === 'published' && (
                      <span className="text-[8px] font-bold uppercase px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Published</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right">
                  {r.original != null ? (
                    <span className="font-mono font-medium text-muted-foreground">{r.original.toFixed(1)}</span>
                  ) : (
                    <span className="font-mono text-xs text-cyan-400">unscored</span>
                  )}
                </td>
                <td className="px-2 py-2.5 text-center">
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 inline" />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <span className={`font-mono font-bold ${r.cooked >= ELITE_THRESHOLD ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {r.cooked != null ? r.cooked.toFixed(1) : '—'}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right">
                  {r.delta != null ? (
                    <span className={`font-mono font-bold inline-flex items-center gap-0.5 justify-end ${deltaColor(r.delta)}`}>
                      {r.delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {r.delta >= 0 ? '+' : ''}{r.delta.toFixed(1)}
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-cyan-400">NEW</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  {r.delta != null ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${deltaBarColor(r.delta)}`}
                          style={{ width: `${Math.min((Math.abs(r.delta) / maxAbsDelta) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground w-8 shrink-0">{r.passages}p</span>
                    </div>
                  ) : (
                    <span className="text-[9px] text-muted-foreground">{r.passages} passages</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}