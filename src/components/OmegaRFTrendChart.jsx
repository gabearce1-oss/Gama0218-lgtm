import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const SERIES = [
  { key: 'omega', label: 'Ω', color: 'hsl(43 74% 55%)', axis: 'omega', width: 2.5 },
  { key: 'cls', label: 'CLS', color: 'hsl(142 71% 45%)', axis: 'rf', width: 1.5 },
  { key: 'bis', label: 'BIS', color: 'hsl(199 89% 55%)', axis: 'rf', width: 1.5 },
  { key: 'sii', label: 'SII', color: 'hsl(280 65% 65%)', axis: 'rf', width: 1.5 },
  { key: 'mrf', label: 'MRF', color: 'hsl(15 80% 60%)', axis: 'rf', width: 1.5 },
];

export default function OmegaRFTrendChart({ chapters }) {
  const [active, setActive] = useState(SERIES.map((s) => s.key));

  const scored = chapters
    .filter((c) => c.omega > 0)
    .sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0));

  const chartData = scored.map((c) => ({
    name: `Ch.${c.chapter_number}`,
    title: c.title || `Chapter ${c.chapter_number}`,
    omega: c.omega != null ? Number(c.omega.toFixed(1)) : null,
    cls: c.cls != null ? Number(c.cls.toFixed(1)) : null,
    bis: c.bis != null ? Number(c.bis.toFixed(1)) : null,
    sii: c.sii != null ? Number(c.sii.toFixed(1)) : null,
    mrf: c.mrf != null ? Number(c.mrf.toFixed(1)) : null,
  }));

  const toggle = (key) =>
    setActive((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  if (scored.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">No scored chapters yet. Score a chapter to see the trend.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4">
        Ω and RF 1.5 sub-scores across {scored.length} scored chapters. Toggle any series to focus your view — as you edit and re-score chapters, this chart updates to show your progress.
      </p>

      {/* Series toggles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SERIES.map((s) => {
          const on = active.includes(s.key);
          return (
            <button
              key={s.key}
              onClick={() => toggle(s.key)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono transition-colors ${
                on ? 'border-border bg-card text-foreground' : 'border-border/50 text-muted-foreground/50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: on ? s.color : 'transparent', border: `1px solid ${s.color}` }} />
              {s.label}
            </button>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 16% 20%)" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#8B949E', fontSize: 10, fontFamily: 'monospace' }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis
            yAxisId="omega"
            tick={{ fill: '#8B949E', fontSize: 11, fontFamily: 'monospace' }}
            domain={[90, 115]}
          />
          <YAxis
            yAxisId="rf"
            orientation="right"
            tick={{ fill: '#8B949E', fontSize: 11, fontFamily: 'monospace' }}
            domain={[0, 100]}
          />
          <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
            contentStyle={{
              background: '#161B22',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) return `${label} — ${payload[0].payload.title}`;
              return label;
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
          {SERIES.filter((s) => active.includes(s.key)).map((s) => (
            <Line
              key={s.key}
              yAxisId={s.axis}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={s.width}
              dot={{ r: 2, fill: s.color }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}