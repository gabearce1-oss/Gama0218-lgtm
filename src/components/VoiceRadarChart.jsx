import { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const DIMENSIONS = [
  { key: 'voice', label: 'Voice' },
  { key: 'lens', label: 'Lens' },
  { key: 'cs_score', label: 'CS' },
  { key: 'familia', label: 'Familia' },
  { key: 'barrio', label: 'Barrio' },
  { key: 'hist', label: 'Hist' },
  { key: 'carnalismo', label: 'Carnal' },
  { key: 'composite', label: 'Ω Comp' },
  { key: 'bugs', label: 'Bugs' },
  { key: 'smells', label: 'Smells' },
  { key: 'vulnerabilities', label: 'Vuln' },
];

const COLORS = ['#f59e0b', '#22d3ee', '#a78bfa', '#34d399', '#f87171', '#fb923c', '#60a5fa', '#f472b6'];

function chapterToData(chapter) {
  return DIMENSIONS.map(d => ({
    dimension: d.label,
    value: chapter?.[d.key] != null ? chapter[d.key] : 0,
  }));
}

function manuscriptAvgData(chapters) {
  return DIMENSIONS.map(d => {
    const vals = chapters
      .filter(c => c[d.key] != null)
      .map(c => c[d.key]);
    return {
      dimension: d.label,
      value: vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0,
    };
  });
}

export default function VoiceRadarChart({ chapters }) {
  const scored = useMemo(() => chapters.filter(c => c.composite != null), [chapters]);

  const sorted = useMemo(
    () => [...scored].sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)),
    [scored]
  );

  const avgData = useMemo(() => manuscriptAvgData(sorted), [sorted]);

  const selectedChapters = sorted.slice(0, Math.min(sorted.length, 4));

  if (sorted.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No scored chapters available for radar visualization.
      </div>
    );
  }

  // Merge all series into one dataset for overlay
  const chartData = DIMENSIONS.map((d, i) => {
    const point = { dimension: d.label };
    point['Manuscript Avg'] = avgData[i].value;
    selectedChapters.forEach(ch => {
      const label = `Ch.${String(ch.chapter_number).padStart(2, '0')}`;
      point[label] = ch[d.key] != null ? ch[d.key] : 0;
    });
    return point;
  });

  const seriesKeys = ['Manuscript Avg', ...selectedChapters.map(ch => `Ch.${String(ch.chapter_number).padStart(2, '0')}`)];

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">Authenticity Radar</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Comparing {selectedChapters.length} chapter{selectedChapters.length !== 1 ? 's' : ''} against manuscript average
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="hsl(215 16% 25%)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: 'hsl(215 14% 60%)', fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            domain={[0, 5]}
            tickCount={6}
            tick={{ fill: 'hsl(215 14% 45%)', fontSize: 10 }}
            stroke="hsl(215 16% 25%)"
            axisLine={false}
          />
          {seriesKeys.map((key, idx) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={COLORS[idx % COLORS.length]}
              fill={COLORS[idx % COLORS.length]}
              fillOpacity={key === 'Manuscript Avg' ? 0.08 : 0.12}
              strokeWidth={key === 'Manuscript Avg' ? 1.5 : 2}
              strokeDasharray={key === 'Manuscript Avg' ? '4 4' : undefined}
              isAnimationActive={true}
            />
          ))}
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            iconType="line"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(215 16% 11%)',
              border: '1px solid hsl(215 16% 25%)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: 'hsl(213 27% 92%)', fontWeight: 600 }}
            itemStyle={{ color: 'hsl(213 27% 92%)' }}
            formatter={(value, name) => [value != null ? Number(value).toFixed(2) : '—', name]}
          />
        </RadarChart>
      </ResponsiveContainer>
      {sorted.length > 4 && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Showing first 4 scored chapters. {sorted.length - 4} more scored chapter{sorted.length - 4 !== 1 ? 's' : ''} available.
        </p>
      )}
    </div>
  );
}