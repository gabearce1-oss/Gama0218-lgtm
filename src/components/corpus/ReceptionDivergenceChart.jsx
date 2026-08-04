import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';
import { S1_ROWS } from '@/lib/frameStratum';

// Texts worth naming on the figure: the two thesis controls, the single Chicana
// entry, and the two clearest divergence cases at either extreme.
const NAMED = {
  'The House on Mango Street': 'Mango Street',
  'The Things They Carried': 'They Carried',
  'For Whom the Bell Tolls': 'Bell Tolls',
  'To Kill A Mockingbird': 'Mockingbird',
  'Canterbury Tales': 'Canterbury',
  'The Divine Comedy': 'Divine Comedy',
};

// Mango Street and the two controls sit below the CR-19 stratum cut, so they are
// carried in explicitly from the verbatim cohort rows rather than inferred.
const CARRIED_IN = [
  { t: 'The House on Mango Street', short: 'Mango Street', ur: 8, gr: 0 },
  { t: 'The Things They Carried', short: 'They Carried', ur: 11, gr: 7 },
  { t: 'For Whom the Bell Tolls', short: 'Bell Tolls', ur: 0, gr: 10 },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-lg">
      <div className="text-xs font-bold text-foreground">{d.t}</div>
      <div className="mt-1 font-mono text-[10px] text-muted-foreground">
        UR {d.ur} · GR {d.gr} · CR {d.ur + d.gr}
      </div>
    </div>
  );
}

export default function ReceptionDivergenceChart() {
  const stratum = S1_ROWS.map((r) => ({ t: r.t, ur: r.ur, gr: r.gr }));
  const highlighted = CARRIED_IN;
  const labelled = stratum.filter((r) => NAMED[r.t]).map((r) => ({ ...r, label: NAMED[r.t] }));
  const plain = stratum.filter((r) => !NAMED[r.t]);

  return (
    <ChartFrame
      figure="Figure 1"
      title="Two Reception Paths, Not One Ranking"
      subtitle="Each point is a text, plotted by its undergraduate count against its graduate count. The diagonal is parity. Distance from that line is the finding: texts are not simply taught more or less — they are routed to different readers. This is the divergence recorded as CF-05, drawn rather than asserted."
      source="Canon chart (n.d.), stratum S1 — page 1, transcribed verbatim; three cohort rows carried in from the verbatim war and Latino cohorts"
      operation="Direct plot of two transcribed columns. No transformation, no smoothing, no fitted model."
      variableClass="OBSERVED"
      n="85 stratum rows + 3 named carry-ins"
    >
      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 12, right: 24, bottom: 34, left: 8 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" />
            <XAxis
              type="number"
              dataKey="ur"
              name="Undergraduate count"
              domain={[0, 26]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              stroke="hsl(var(--border))"
              label={{
                value: 'UR — undergraduate appearances',
                position: 'insideBottom',
                offset: -20,
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11,
              }}
            />
            <YAxis
              type="number"
              dataKey="gr"
              name="Graduate count"
              domain={[0, 52]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              stroke="hsl(var(--border))"
              label={{
                value: 'GR — graduate appearances',
                angle: -90,
                position: 'insideLeft',
                offset: 14,
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 11,
              }}
            />
            <ZAxis range={[46, 46]} />
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: 26, y: 26 },
              ]}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={plain} fill="hsl(var(--muted-foreground))" fillOpacity={0.45} />
            <Scatter data={labelled} fill="hsl(var(--primary))" fillOpacity={0.9}>
              <LabelList
                dataKey="label"
                position="right"
                offset={9}
                style={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              />
            </Scatter>
            <Scatter data={highlighted} fill="hsl(var(--chart-2))" shape="diamond">
              <LabelList
                dataKey="short"
                position="right"
                offset={9}
                style={{ fill: 'hsl(var(--chart-2))', fontSize: 10 }}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 px-4 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/50" /> Stratum S1 text
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" /> Named divergence case
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rotate-45 bg-[hsl(var(--chart-2))]" /> Control text / sole Chicana entry
        </span>
        <span className="italic">Above the line: graduate-weighted. Below: undergraduate-weighted.</span>
      </div>
    </ChartFrame>
  );
}