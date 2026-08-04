import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Loader2, Sigma } from 'lucide-react';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';

export default function ManuscriptOmegaProgress() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await base44.entities.Chapter.list('-chapter_number', 200);
        setChapters(data.sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)));
      } catch (err) {
        console.error('Failed to load manuscript progress:', err);
      }
      setLoading(false);
    };
    fetchData();
    const unsubscribe = base44.entities.Chapter.subscribe((event) => {
      if (event.type === 'create') setChapters((prev) => [...prev, event.data].sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)));
      if (event.type === 'update') setChapters((prev) => prev.map((c) => (c.id === event.data.id ? event.data : c)).sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)));
      if (event.type === 'delete') setChapters((prev) => prev.filter((c) => c.id !== event.data.id));
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
      </div>
    );
  }

  const scored = chapters.filter((c) => c.omega > 0);

  if (scored.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <TrendingUp className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No chapter data yet. Sync your workbook to see the manuscript Ω progression.</p>
      </div>
    );
  }

  let cumulativeCurrent = 0;
  let cumulativeBaseline = 0;

  const chartData = scored.map((c) => {
    const current = c.omega || 0;
    const baseline = c.omega_est || c.omega_est === 0 ? c.omega_est : null;
    cumulativeCurrent += current;
    if (baseline != null) cumulativeBaseline += baseline;
    return {
      name: `Ch.${c.chapter_number}`,
      chapter: c.chapter_number,
      title: c.title || `Chapter ${c.chapter_number}`,
      current: Number(current.toFixed(1)),
      baseline: baseline != null ? Number(baseline.toFixed(1)) : null,
      cumCurrent: Number(cumulativeCurrent.toFixed(1)),
      cumBaseline: baseline != null ? Number(cumulativeBaseline.toFixed(1)) : null,
    };
  });

  const totalOmega = cumulativeCurrent;
  const meanOmega = totalOmega / scored.length;
  const hasBaselines = chartData.some((d) => d.baseline != null);
  const totalBaseline = chartData.reduce((s, d) => s + (d.baseline || 0), 0);
  const totalGain = hasBaselines ? totalOmega - totalBaseline : null;

  return (
    <div className="rounded-lg border border-border bg-card p-5 mb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-1">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-1.5">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Manuscript Ω Progression</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cumulative total Ω climbing across all {scored.length} chapters — the full restoration arc from Ch.1 to Ch.{scored[scored.length - 1].chapter_number}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs shrink-0">
          <div className="text-right">
            <div className="text-muted-foreground">Total Ω</div>
            <div className="font-mono font-bold text-lg text-amber-400">{totalOmega.toFixed(1)}</div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground">Mean Ω</div>
            <div className="font-mono font-bold text-lg text-amber-400">{meanOmega.toFixed(2)}</div>
          </div>
          {totalGain != null && (
            <div className="text-right">
              <div className="text-emerald-400">Total Gain</div>
              <div className="font-mono font-bold text-lg text-emerald-400">
                +{totalGain.toFixed(1)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ left: -10, right: 10, top: 20, bottom: 0 }}>
          <defs>
            <linearGradient id="cumCurrentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(43 74% 55%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(43 74% 55%)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="cumBaselineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(215 14% 50%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(215 14% 50%)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
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
            tick={{ fill: '#8B949E', fontSize: 11, fontFamily: 'monospace' }}
            label={{ value: 'Cumulative Ω', angle: -90, position: 'insideLeft', fill: '#8B949E', fontSize: 11, dy: 30 }}
          />
          <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
            contentStyle={{
              background: '#161B22',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value, name) => {
              if (name === 'Cumulative Restored') return [`${value} Ω`, name];
              if (name === 'Cumulative Baseline') return [`${value} Ω`, name];
              return [`${value} Ω`, name];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) return `${label} — ${payload[0].payload.title}`;
              return label;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            iconType="circle"
          />
          {hasBaselines && (
            <Area
              type="monotone"
              dataKey="cumBaseline"
              name="Cumulative Baseline"
              stroke="hsl(215 14% 50%)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              fill="url(#cumBaselineGrad)"
              dot={false}
            />
          )}
          <Area
            type="monotone"
            dataKey="cumCurrent"
            name="Cumulative Restored"
            stroke="hsl(43 74% 55%)"
            strokeWidth={2.5}
            fill="url(#cumCurrentGrad)"
            dot={{ r: 2.5, fill: 'hsl(43 74% 55%)' }}
            activeDot={{ r: 5, fill: 'hsl(43 74% 66%)' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Per-chapter sparkline strip */}
      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex items-center gap-2 mb-2">
          <Sigma className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Per-Chapter Ω</span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={chartData} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
            <defs>
              <linearGradient id="perChGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis domain={[80, 115]} hide />
            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
              contentStyle={{
                background: '#161B22',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '8px',
                fontSize: '11px',
              }}
              formatter={(value) => [`${value} Ω`, 'Chapter Ω']}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) return `${label} — ${payload[0].payload.title}`;
                return label;
              }}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="hsl(142 71% 45%)"
              strokeWidth={1.5}
              fill="url(#perChGrad)"
              dot={false}
            />
            <ReferenceLine y={109.5} stroke="hsl(43 74% 55%)" strokeDasharray="3 3" strokeWidth={1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}