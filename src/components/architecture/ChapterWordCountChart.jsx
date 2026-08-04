import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="max-w-[240px] rounded-md border border-border bg-popover px-3 py-2 shadow-lg">
      <div className="font-mono text-[10px] text-primary">Chapter {d.chapter}</div>
      <div className="mt-0.5 text-xs font-bold leading-snug text-foreground">{d.title}</div>
      <div className="mt-1 font-mono text-[10px] text-muted-foreground">
        {d.words.toLocaleString()} words
      </div>
    </div>
  );
}

export default function ChapterWordCountChart({ chapters }) {
  const rows = chapters
    .filter((c) => typeof c.word_count === 'number' && c.word_count > 0)
    .sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0))
    .map((c) => ({ chapter: c.chapter_number, title: c.title || 'Untitled', words: c.word_count }));

  if (rows.length === 0) return null;

  const total = rows.reduce((s, r) => s + r.words, 0);
  const mean = Math.round(total / rows.length);

  return (
    <ChartFrame
      figure="Figure 3"
      title="Chapter Length Across the Manuscript"
      subtitle={`Word counts taken from the source document itself, chapter by chapter. Total ${total.toLocaleString()} words across ${rows.length} chapters, mean ${mean.toLocaleString()}. The dashed line is that mean. This is a descriptive profile of a physical artifact — nothing here is scored, weighted, or inferred.`}
      source="Ramos (n.d.), SGT George Ramos Vault II — counts read from the source document"
      operation="Direct count per chapter; arithmetic mean for the reference line."
      variableClass="OBSERVED"
      n={`${rows.length} chapters with a verified count`}
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 8, right: 20, bottom: 28, left: 8 }}>
            <defs>
              <linearGradient id="wordCountFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.42} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="chapter"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              stroke="hsl(var(--border))"
              interval={2}
              label={{
                value: 'chapter',
                position: 'insideBottom',
                offset: -16,
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11,
              }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              stroke="hsl(var(--border))"
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={mean}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
            />
            <Area
              type="monotone"
              dataKey="words"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#wordCountFill)"
              dot={{ r: 2, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
              activeDot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}