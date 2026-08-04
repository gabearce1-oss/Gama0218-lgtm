import { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Grid3x3, Loader2, Info } from 'lucide-react';
import { CHARACTERS } from '@/lib/voiceProfiles';

// Weighted moral-landscape signals (per clarified request)
const IMPACT_WEIGHTS = {
  moral_weight: 0.5,
  agency_under_fire: 0.3,
  grief_index: 0.2,
};

const CHARACTER_COLORS = {
  Tijuana: '#22d3ee',
  Herrera: '#f59e0b',
  "O'Neil": '#34d399',
  Hoshnsin: '#a78bfa',
};

const CHAR_ALIASES = {
  Tijuana: ['Tijuana', 'TIJUANA'],
  Herrera: ['Herrera', 'HERRERA'],
  "O'Neil": ["O'Neil", 'ONEIL', 'O Neil'],
  Hoshnsin: ['Hoshnsin', 'HOSHNSIN', 'Hosh'],
};

function sceneMoralScore(ch) {
  return (
    (ch.moral_weight || 0) * IMPACT_WEIGHTS.moral_weight +
    (ch.agency_under_fire || 0) * IMPACT_WEIGHTS.agency_under_fire +
    (ch.grief_index || 0) * IMPACT_WEIGHTS.grief_index
  );
}

// Map a 0..max score to a heat color (amber ramp)
function heatStyle(score, max) {
  if (!score || max <= 0) return { background: 'transparent' };
  const t = Math.min(1, score / max);
  const alpha = 0.08 + t * 0.72;
  return { backgroundColor: `rgba(245, 158, 11, ${alpha.toFixed(3)})` };
}

export default function CharacterImpactMatrix() {
  const [chapters, setChapters] = useState([]);
  const [switches, setSwitches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Chapter.list('chapter_number', 200),
      base44.entities.CodeSwitch.list('-chapter_number', 500).catch(() => []),
    ]).then(([chData, csData]) => {
      setChapters(chData);
      setSwitches(csData || []);
      setLoading(false);
    });
  }, []);

  const { scenes, maxScore, hasData } = useMemo(() => {
    // speaker counts per chapter
    const speakerByChapter = {};
    switches.forEach((s) => {
      if (!s.speaker) return;
      const ch = s.chapter_number;
      if (!speakerByChapter[ch]) speakerByChapter[ch] = {};
      const name = s.speaker.trim();
      speakerByChapter[ch][name] = (speakerByChapter[ch][name] || 0) + 1;
    });

    const scored = chapters.filter(
      (c) => c.moral_weight != null || c.agency_under_fire != null || c.grief_index != null
    );

    const scenes = scored.map((c) => {
      const speakerCounts = speakerByChapter[c.chapter_number] || {};
      const total = sceneMoralScore(c);
      // Distribute the scene's moral score to present characters by line share
      const presence = {};
      let presentLineTotal = 0;
      CHARACTERS.forEach((char) => {
        const aliases = CHAR_ALIASES[char.call_sign] || [char.call_sign];
        const lines = aliases.reduce((s, a) => s + (speakerCounts[a] || 0), 0);
        if (lines > 0) {
          presence[char.call_sign] = lines;
          presentLineTotal += lines;
        }
      });
      const cells = {};
      CHARACTERS.forEach((char) => {
        const lines = presence[char.call_sign] || 0;
        cells[char.call_sign] = presentLineTotal > 0 ? total * (lines / presentLineTotal) : 0;
      });
      return {
        chapter: c.chapter_number,
        title: c.title,
        act: c.act,
        total,
        cells,
        moral_weight: c.moral_weight || 0,
        agency_under_fire: c.agency_under_fire || 0,
        grief_index: c.grief_index || 0,
      };
    });

    scenes.sort((a, b) => a.chapter - b.chapter);
    const maxCell = Math.max(
      0,
      ...scenes.flatMap((s) => Object.values(s.cells))
    );
    return { scenes, maxScore: maxCell, hasData: scenes.length > 0 };
  }, [chapters, switches]);

  // Per-character column totals (who moves the moral landscape most overall)
  const columnTotals = useMemo(() => {
    const totals = {};
    CHARACTERS.forEach((c) => { totals[c.call_sign] = 0; });
    scenes.forEach((s) => {
      CHARACTERS.forEach((c) => { totals[c.call_sign] += s.cells[c.call_sign] || 0; });
    });
    return totals;
  }, [scenes]);

  const rankedChars = [...CHARACTERS].sort(
    (a, b) => (columnTotals[b.call_sign] || 0) - (columnTotals[a.call_sign] || 0)
  );

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Grid3x3 className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Scene-by-Scene Impact Matrix</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Grid3x3 className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-bold">Scene-by-Scene Impact Matrix</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Each cell shows how strongly a character moves the moral landscape in that scene — weighted{' '}
        <span className="text-amber-400 font-medium">Moral Weight 50%</span>,{' '}
        <span className="text-red-400 font-medium">Agency Under Fire 30%</span>,{' '}
        <span className="text-violet-400 font-medium">Grief Index 20%</span>. Darker = stronger moral change.
      </p>

      {!hasData ? (
        <div className="flex items-start gap-3 rounded-md border border-border bg-background/50 p-4 text-sm text-muted-foreground">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            No moral-landscape scores yet. Populate <span className="font-mono text-foreground">moral_weight</span>,{' '}
            <span className="font-mono text-foreground">agency_under_fire</span>, and{' '}
            <span className="font-mono text-foreground">grief_index</span> on chapters to light up this matrix.
          </span>
        </div>
      ) : (
        <>
          {/* Character totals bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {rankedChars.map((char, idx) => (
              <div
                key={char.id}
                className={`rounded-md border p-3 ${idx === 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-border bg-background/50'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm" style={{ color: CHARACTER_COLORS[char.call_sign] || '#f59e0b' }}>
                    {char.call_sign}
                  </span>
                  {idx === 0 && <span className="text-[9px] uppercase tracking-wider text-amber-400">Top mover</span>}
                </div>
                <div className="text-[10px] text-muted-foreground">{char.role}</div>
                <div className="font-mono font-bold text-lg mt-1" style={{ color: CHARACTER_COLORS[char.call_sign] || '#f59e0b' }}>
                  {(columnTotals[char.call_sign] || 0).toFixed(1)}
                </div>
                <div className="text-[9px] text-muted-foreground">cumulative moral impact</div>
              </div>
            ))}
          </div>

          {/* Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="sticky left-0 bg-card py-2 pr-3 font-medium">Scene</th>
                  {CHARACTERS.map((char) => (
                    <th key={char.id} className="py-2 px-2 text-center font-medium whitespace-nowrap">
                      <span style={{ color: CHARACTER_COLORS[char.call_sign] || '#f59e0b' }}>{char.call_sign}</span>
                    </th>
                  ))}
                  <th className="py-2 pl-2 text-right font-medium">Scene Σ</th>
                </tr>
              </thead>
              <tbody>
                {scenes.map((s) => (
                  <tr key={s.chapter} className="border-t border-border/40">
                    <td className="sticky left-0 bg-card py-2 pr-3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-bold text-xs">Ch{s.chapter}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[160px]">{s.title}</span>
                      </div>
                      <div className="text-[9px] font-mono text-muted-foreground">
                        Act {s.act} · MW {s.moral_weight.toFixed(0)} · AUF {s.agency_under_fire.toFixed(0)} · GI {s.grief_index.toFixed(0)}
                      </div>
                    </td>
                    {CHARACTERS.map((char) => {
                      const val = s.cells[char.call_sign] || 0;
                      return (
                        <td key={char.id} className="py-2 px-2 text-center" style={heatStyle(val, maxScore)}>
                          {val > 0 ? (
                            <span className="font-mono text-xs font-medium text-foreground">{val.toFixed(1)}</span>
                          ) : (
                            <span className="text-muted-foreground/30">·</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-2 pl-2 text-right font-mono font-bold text-amber-400">{s.total.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td className="sticky left-0 bg-card py-2 pr-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Character Σ
                  </td>
                  {CHARACTERS.map((char) => (
                    <td key={char.id} className="py-2 px-2 text-center font-mono text-xs font-bold" style={{ color: CHARACTER_COLORS[char.call_sign] || '#f59e0b' }}>
                      {(columnTotals[char.call_sign] || 0).toFixed(1)}
                    </td>
                  ))}
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground">
            <span>Low impact</span>
            <div className="flex h-3 w-40 rounded overflow-hidden border border-border">
              {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((a) => (
                <div key={a} className="flex-1" style={{ backgroundColor: `rgba(245, 158, 11, ${a})` }} />
              ))}
            </div>
            <span>High impact</span>
          </div>
        </>
      )}
    </div>
  );
}