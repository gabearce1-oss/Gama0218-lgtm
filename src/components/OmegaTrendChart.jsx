import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Loader2 } from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function OmegaTrendChart() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await base44.entities.RestorationDraft.list('-chapter_number', 200);
        setDrafts(data.sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)));
      } catch (err) {
        console.error('Failed to load trend data:', err);
      }
      setLoading(false);
    };
    fetchDrafts();
    const unsubscribe = base44.entities.RestorationDraft.subscribe((event) => {
      if (event.type === 'create') setDrafts((prev) => [...prev, event.data].sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)));
      if (event.type === 'update') setDrafts((prev) => prev.map((d) => (d.id === event.data.id ? event.data : d)).sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)));
      if (event.type === 'delete') setDrafts((prev) => prev.filter((d) => d.id !== event.data.id));
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

  const scored = drafts.filter((d) => d.cooked_omega != null);

  if (scored.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <TrendingUp className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No restoration data yet. Cook a restoration to see the Ω trend.</p>
      </div>
    );
  }

  let cumulativeOriginal = 0;
  let cumulativeCooked = 0;

  const chartData = scored.map((d) => {
    cumulativeOriginal += d.original_omega || 0;
    cumulativeCooked += d.cooked_omega || 0;
    return {
      name: `Ch.${d.chapter_number}`,
      title: d.chapter_title || `Chapter ${d.chapter_number}`,
      original: d.original_omega != null ? Number(d.original_omega.toFixed(1)) : null,
      cooked: Number(d.cooked_omega.toFixed(1)),
      delta: d.original_omega != null ? Number((d.cooked_omega - d.original_omega).toFixed(1)) : null,
      cumOriginal: Number(cumulativeOriginal.toFixed(1)),
      cumCooked: Number(cumulativeCooked.toFixed(1)),
    };
  });

  const totalGain = cumulativeCooked - cumulativeOriginal;
  const meanBefore = cumulativeOriginal / scored.length;
  const meanAfter = cumulativeCooked / scored.length;

  return (
    <div className="rounded-lg border border-border bg-card p-5 mb-8">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Restoration Ω Trend</h2>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <div className="text-muted-foreground">Mean Before</div>
            <div className="font-mono font-bold text-muted-foreground">{meanBefore.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-emerald-400">Mean After</div>
            <div className="font-mono font-bold text-emerald-400">{meanAfter.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-amber-400">Total Gain</div>
            <div className="font-mono font-bold text-amber-400">+{totalGain.toFixed(1)} Ω</div>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Per-chapter Ω before and after restoration, with a cumulative total showing how the manuscript score climbed across {scored.length} chapters.
      </p>
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
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
            yAxisId="cumulative"
            orientation="right"
            tick={{ fill: '#8B949E', fontSize: 11, fontFamily: 'monospace' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{
              background: '#161B22',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value, name) => {
              if (name === 'Cumulative After') return [`${value} Ω`, name];
              if (name === 'Cumulative Before') return [`${value} Ω`, name];
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
          <Bar yAxisId="omega" dataKey="original" name="Ω Before" fill="hsl(215 14% 45%)" radius={[3, 3, 0, 0]} barSize={14} />
          <Bar yAxisId="omega" dataKey="cooked" name="Ω After" fill="hsl(43 74% 55%)" radius={[3, 3, 0, 0]} barSize={14} />
          <Line
            yAxisId="cumulative"
            type="monotone"
            dataKey="cumCooked"
            name="Cumulative After"
            stroke="hsl(142 71% 45%)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: 'hsl(142 71% 45%)' }}
          />
          <Line
            yAxisId="cumulative"
            type="monotone"
            dataKey="cumOriginal"
            name="Cumulative Before"
            stroke="hsl(215 14% 50%)"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}