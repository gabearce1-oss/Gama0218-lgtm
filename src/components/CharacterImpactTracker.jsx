import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, Trophy, TrendingUp, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from 'recharts';
import { CHARACTERS } from '@/lib/voiceProfiles';

const MORAL_DIMENSIONS = [
  { key: 'moral_weight', label: 'Moral Weight', color: '#f59e0b' },
  { key: 'agency_under_fire', label: 'Agency Under Fire', color: '#ef4444' },
  { key: 'grief_index', label: 'Grief Index', color: '#a78bfa' },
  { key: 'cultural_reflex', label: 'Cultural Reflex', color: '#22d3ee' },
  { key: 'body_memory', label: 'Body Memory', color: '#34d399' },
  { key: 'character_agency', label: 'Character Agency', color: '#fbbf24' },
];

const CHARACTER_COLORS = {
  Tijuana: '#22d3ee',
  Herrera: '#f59e0b',
  "O'Neil": '#34d399',
  Hoshnsin: '#a78bfa',
};

function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((s, v) => s + (v || 0), 0) / arr.length;
}

export default function CharacterImpactTracker({ chapters: propChapters }) {
  const [chapters, setChapters] = useState(propChapters || []);
  const [switches, setSwitches] = useState([]);
  const [loading, setLoading] = useState(!propChapters);

  useEffect(() => {
    if (propChapters && propChapters.length > 0) {
      setChapters(propChapters);
      setLoading(false);
      return;
    }
    base44.entities.Chapter.list().then((data) => {
      setChapters(data);
      setLoading(false);
    });
  }, [propChapters]);

  useEffect(() => {
    base44.entities.CodeSwitch.list('-chapter_number', 500).then(setSwitches).catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Character Impact Tracker</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 border-2 border-muted border-t-amber-400 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Build chapter lookup
  const chapterMap = {};
  chapters.forEach((c) => { chapterMap[c.chapter_number] = c; });

  // Count speaker appearances per chapter
  const speakerByChapter = {};
  switches.forEach((s) => {
    if (!s.speaker) return;
    const ch = s.chapter_number;
    if (!speakerByChapter[ch]) speakerByChapter[ch] = {};
    const name = s.speaker.trim();
    speakerByChapter[ch][name] = (speakerByChapter[ch][name] || 0) + 1;
  });

  // Map known character call signs to their variations
  const charAliases = {
    Tijuana: ['Tijuana', 'TIJUANA'],
    Herrera: ['Herrera', 'HERRERA'],
    "O'Neil": ["O'Neil", "O'Neil", "ONEIL", "O Neil"],
    Hoshnsin: ['Hoshnsin', 'HOSHNSIN', 'Hosh'],
  };

  // For each character, find chapters they appear in and aggregate moral metrics
  const characterImpact = CHARACTERS.map((char) => {
    const aliases = charAliases[char.call_sign] || [char.call_sign];
    const chaptersWithPresence = chapters.filter((c) => {
      const speakerCounts = speakerByChapter[c.chapter_number] || {};
      return aliases.some((a) => speakerCounts[a] > 0);
    });

    const moralWeights = chaptersWithPresence.map((c) => c.moral_weight).filter((v) => v != null);
    const agencyScores = chaptersWithPresence.map((c) => c.character_agency).filter((v) => v != null);
    const agencyFire = chaptersWithPresence.map((c) => c.agency_under_fire).filter((v) => v != null);
    const grief = chaptersWithPresence.map((c) => c.grief_index).filter((v) => v != null);
    const cultural = chaptersWithPresence.map((c) => c.cultural_reflex).filter((v) => v != null);
    const body = chaptersWithPresence.map((c) => c.body_memory).filter((v) => v != null);

    const totalLines = chaptersWithPresence.reduce((sum, c) => {
      const sc = speakerByChapter[c.chapter_number] || {};
      return sum + aliases.reduce((s, a) => s + (sc[a] || 0), 0);
    }, 0);

    const moralImpactScore = avg(moralWeights) * Math.log(1 + chaptersWithPresence.length);

    return {
      ...char,
      chaptersPresent: chaptersWithPresence.length,
      totalLines,
      avgMoralWeight: avg(moralWeights),
      avgAgency: avg(agencyScores),
      avgAgencyFire: avg(agencyFire),
      avgGrief: avg(grief),
      avgCultural: avg(cultural),
      avgBody: avg(body),
      moralImpactScore,
    };
  }).sort((a, b) => b.moralImpactScore - a.moralImpactScore);

  // Scene-level data: chapters sorted by combined moral impact
  const sceneImpact = chapters
    .filter((c) => c.moral_weight != null || c.character_agency != null)
    .map((c) => {
      const speakerCounts = speakerByChapter[c.chapter_number] || {};
      const topSpeaker = Object.entries(speakerCounts).sort((a, b) => b[1] - a[1])[0];
      const combined = (c.moral_weight || 0) + (c.character_agency || 0) + (c.agency_under_fire || 0);
      return {
        chapter: c.chapter_number,
        title: c.title,
        act: c.act,
        moral_weight: c.moral_weight || 0,
        character_agency: c.character_agency || 0,
        agency_under_fire: c.agency_under_fire || 0,
        grief_index: c.grief_index || 0,
        cultural_reflex: c.cultural_reflex || 0,
        body_memory: c.body_memory || 0,
        combined,
        topSpeaker: topSpeaker ? topSpeaker[0] : null,
        speakerCount: topSpeaker ? topSpeaker[1] : 0,
      };
    })
    .sort((a, b) => b.combined - a.combined);

  const topScenes = sceneImpact.slice(0, 10);

  // Radar data for character comparison
  const radarData = MORAL_DIMENSIONS.map((dim) => {
    const entry = { dimension: dim.label };
    characterImpact.forEach((char) => {
      const val = dim.key === 'moral_weight' ? char.avgMoralWeight
        : dim.key === 'character_agency' ? char.avgAgency
        : dim.key === 'agency_under_fire' ? char.avgAgencyFire
        : dim.key === 'grief_index' ? char.avgGrief
        : dim.key === 'cultural_reflex' ? char.avgCultural
        : dim.key === 'body_memory' ? char.avgBody
        : 0;
      entry[char.call_sign] = Math.round(val * 10) / 10;
    });
    return entry;
  });

  // Bar chart data: top scenes by moral impact
  const barData = topScenes.map((s) => ({
    name: `Ch${s.chapter}`,
    moral: s.moral_weight,
    agency: s.character_agency,
    fire: s.agency_under_fire,
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-6 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-bold">Character Impact Tracker</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        Cross-references speaker presence (Code-Switch data) with moral landscape metrics (Moral Weight, Agency Under Fire, Grief, Cultural Reflex, Body Memory) to show which characters are driving the manuscript's moral evolution.
      </p>

      {/* Character Ranking */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {characterImpact.map((char, idx) => (
          <div
            key={char.id}
            className={`rounded-md border p-4 ${idx === 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-border bg-background/50'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  {idx === 0 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                  <span className="font-bold text-sm" style={{ color: CHARACTER_COLORS[char.call_sign] || '#f59e0b' }}>
                    {char.call_sign}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">{char.role}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Impact</div>
                <div className="font-mono font-bold text-lg" style={{ color: CHARACTER_COLORS[char.call_sign] || '#f59e0b' }}>
                  {char.moralImpactScore.toFixed(1)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div className="text-muted-foreground">Scenes: <span className="font-mono text-foreground">{char.chaptersPresent}</span></div>
              <div className="text-muted-foreground">Lines: <span className="font-mono text-foreground">{char.totalLines}</span></div>
              <div className="text-muted-foreground">Moral: <span className="font-mono text-amber-400">{char.avgMoralWeight.toFixed(1)}</span></div>
              <div className="text-muted-foreground">Agency: <span className="font-mono text-emerald-400">{char.avgAgency.toFixed(1)}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Radar Chart */}
      {radarData.some((d) => Object.keys(d).length > 2) && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Moral Dimension Profile by Character</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(215 16% 25%)" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: 'hsl(215 14% 60%)', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: 'hsl(215 14% 60%)', fontSize: 9 }} />
              {CHARACTERS.map((char) => (
                <Radar
                  key={char.id}
                  name={char.call_sign}
                  dataKey={char.call_sign}
                  stroke={CHARACTER_COLORS[char.call_sign] || '#f59e0b'}
                  fill={CHARACTER_COLORS[char.call_sign] || '#f59e0b'}
                  fillOpacity={0.08}
                  strokeWidth={2}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(215 16% 11%)', border: '1px solid hsl(215 16% 25%)', borderRadius: 6, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Scenes Bar Chart */}
      {barData.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Top 10 Scenes by Moral Impact</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 16% 20%)" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(215 14% 60%)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'hsl(215 14% 60%)', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(215 16% 11%)', border: '1px solid hsl(215 16% 25%)', borderRadius: 6, fontSize: 12 }} cursor={{ fill: 'hsl(215 16% 15%)' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="moral" name="Moral Weight" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              <Bar dataKey="agency" name="Character Agency" fill="#34d399" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fire" name="Agency Under Fire" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Scenes Table */}
      {topScenes.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Highest-Impact Scenes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3">Ch</th>
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3 text-center">Act</th>
                  <th className="py-2 pr-3 text-right">Moral</th>
                  <th className="py-2 pr-3 text-right">Agency</th>
                  <th className="py-2 pr-3 text-right">Fire</th>
                  <th className="py-2 pr-3 text-right">Grief</th>
                  <th className="py-2 pr-3 text-right">Culture</th>
                  <th className="py-2 pr-3 text-right">Combined</th>
                  <th className="py-2">Top Speaker</th>
                </tr>
              </thead>
              <tbody>
                {topScenes.map((s) => (
                  <tr key={s.chapter} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-2 pr-3 font-mono font-bold">{s.chapter}</td>
                    <td className="py-2 pr-3 text-xs">{s.title}</td>
                    <td className="py-2 pr-3 text-center font-mono text-xs text-muted-foreground">{s.act}</td>
                    <td className="py-2 pr-3 text-right font-mono text-amber-400">{s.moral_weight.toFixed(1)}</td>
                    <td className="py-2 pr-3 text-right font-mono text-emerald-400">{s.character_agency.toFixed(1)}</td>
                    <td className="py-2 pr-3 text-right font-mono text-red-400">{s.agency_under_fire.toFixed(1)}</td>
                    <td className="py-2 pr-3 text-right font-mono text-violet-400">{s.grief_index.toFixed(1)}</td>
                    <td className="py-2 pr-3 text-right font-mono text-cyan-400">{s.cultural_reflex.toFixed(1)}</td>
                    <td className="py-2 pr-3 text-right font-mono font-bold text-amber-400">{s.combined.toFixed(1)}</td>
                    <td className="py-2 text-xs">
                      {s.topSpeaker ? (
                        <span style={{ color: CHARACTER_COLORS[s.topSpeaker] || '#f59e0b' }} className="font-bold">
                          {s.topSpeaker} ({s.speakerCount})
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sceneImpact.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No character impact data available yet. Score chapters with moral_weight and character_agency to populate this view.
        </div>
      )}
    </div>
  );
}