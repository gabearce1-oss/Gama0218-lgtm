import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Trophy, TrendingUp } from 'lucide-react';
import TierBadge from '@/components/TierBadge';
import LeaderboardChart from '@/components/LeaderboardChart';
import OmegaRFTrendChart from '@/components/OmegaRFTrendChart';
import WarCanonProgress from '@/components/leaderboard/WarCanonProgress';

export default function Leaderboard() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Chapter.list().then((data) => {
      setChapters(data);
      setLoading(false);
    });
  }, []);

  const scored = chapters.filter((c) => c.omega > 0).sort((a, b) => b.omega - a.omega);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Omega Rankings
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Ω Leaderboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Ranked chapter scores across the manuscript</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <WarCanonProgress chapters={chapters} />

          <div className="rounded-lg border border-border bg-card p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Ω &amp; RF 1.5 Progression</h2>
            </div>
            <OmegaRFTrendChart chapters={chapters} />
          </div>

          <div className="rounded-lg border border-border bg-card p-6 mb-6">
            <h2 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">Ω Score Distribution</h2>
            <LeaderboardChart chapters={chapters} />
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            {scored.map((chapter, idx) => (
              <div
                key={chapter.id}
                className={`flex items-center gap-4 p-4 border-b border-border/50 last:border-0 ${
                  idx < 3 ? 'bg-amber-500/5' : ''
                }`}
              >
                <div className="w-8 text-center text-lg">
                  {idx < 3 ? medals[idx] : <span className="font-mono text-sm text-muted-foreground">{idx + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{chapter.title}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Ch.{String(chapter.chapter_number).padStart(2, '0')} · Act {chapter.act}
                  </div>
                </div>
                <TierBadge omega={chapter.omega} />
                <div className="font-mono font-bold text-xl text-amber-400 w-16 text-right">
                  {chapter.omega.toFixed(1)}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Highest Ω</div>
              <div className="font-mono font-bold text-2xl text-amber-400 mt-1">
                {scored[0]?.omega.toFixed(1) || '—'}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Mean Ω</div>
              <div className="font-mono font-bold text-2xl text-amber-400 mt-1">
                {scored.length > 0
                  ? (scored.reduce((s, c) => s + c.omega, 0) / scored.length).toFixed(2)
                  : '—'}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Scored</div>
              <div className="font-mono font-bold text-2xl mt-1">{scored.length}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}