import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';
import { S1_ROWS } from '@/lib/frameStratum';
import { WAR_COHORT } from '@/lib/canonChartFrame';

const WAR_TITLES = new Set(WAR_COHORT.map((w) => w.text));

// Bins of 5 across the verified stratum range (CR 19-60).
function buildBins() {
  const bins = [];
  for (let lo = 19; lo <= 59; lo += 5) {
    const hi = lo + 4;
    const rows = S1_ROWS.filter((r) => r.cr >= lo && r.cr <= hi);
    const war = rows.filter((r) => WAR_TITLES.has(r.t)).length;
    bins.push({ band: `${lo}\u2013${hi}`, war, other: rows.length - war, total: rows.length });
  }
  return bins;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-lg">
      <div className="text-xs font-bold text-foreground">CR {label}</div>
      <div className="mt-1 font-mono text-[10px] text-muted-foreground">
        {d.total} text{d.total === 1 ? '' : 's'} · {d.war} war &amp; veteran
      </div>
    </div>
  );
}

export default function StratumDistributionChart() {
  const bins = buildBins();
  return (
    <ChartFrame
      figure="Figure 2"
      title="Where the War Canon Actually Sits"
      subtitle="The verified top stratum, binned by combined count, with war and veteran texts separated out. The chart's maximum is 60. Every war text present falls in the lowest bands — which is why a percentile claim about a war canon was withdrawn rather than defended: this frame declares no war-canon partition, and the cohort it does contain clusters at the bottom of its own top stratum."
      source="Canon chart (n.d.), stratum S1 — CR 19 through 60, transcribed verbatim from page 1"
      operation="Frequency count into fixed 5-unit bands. Cohort membership read from the verbatim war and veteran rows."
      variableClass="OBSERVED"
      n="85 (roughly 615 lower rows remain unextracted)"
    >
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 8, right: 20, bottom: 30, left: 4 }} barGap={0}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="band"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              stroke="hsl(var(--border))"
              label={{
                value: 'CR band — combined appearance count',
                position: 'insideBottom',
                offset: -18,
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11,
              }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              stroke="hsl(var(--border))"
              label={{
                value: 'texts in band',
                angle: -90,
                position: 'insideLeft',
                offset: 16,
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11,
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.25 }} />
            <Legend
              verticalAlign="top"
              align="right"
              height={28}
              wrapperStyle={{ fontSize: 10 }}
              formatter={(v) => <span className="text-muted-foreground">{v}</span>}
            />
            <Bar
              dataKey="other"
              stackId="a"
              name="All other texts"
              fill="hsl(var(--muted-foreground))"
              fillOpacity={0.35}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="war"
              stackId="a"
              name="War &amp; veteran texts"
              fill="hsl(var(--primary))"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}