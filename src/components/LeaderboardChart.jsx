import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getTier, TIER_CONFIG } from '@/lib/omega';

export default function LeaderboardChart({ chapters }) {
  const data = chapters
    .filter((c) => c.omega > 0)
    .sort((a, b) => b.omega - a.omega)
    .map((c) => ({
      name: `Ch.${c.chapter_number}`,
      title: c.title,
      omega: c.omega,
      tier: getTier(c.omega),
    }));

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 45)}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
        <XAxis type="number" domain={[110, 117]} hide />
        <YAxis
          type="category"
          dataKey="name"
          width={60}
          tick={{ fill: '#8B949E', fontSize: 12, fontFamily: 'monospace' }}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          contentStyle={{
            background: '#161B22',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value, name, props) => [`${value.toFixed(1)} Ω`, props.payload.title]}
        />
        <Bar dataKey="omega" radius={[0, 4, 4, 0]} barSize={28}>
          {data.map((entry, index) => (
            <Cell key={index} fill={TIER_CONFIG[entry.tier].color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}