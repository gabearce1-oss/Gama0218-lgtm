import {
  Bar, BarChart, CartesianGrid, ErrorBar, ResponsiveContainer, Scatter, ScatterChart,
  Tooltip, XAxis, YAxis, ZAxis,
} from 'recharts';
import { Radar } from 'lucide-react';

const AXIS = { stroke: 'hsl(var(--muted-foreground))', fontSize: 10 };
const GRID = 'hsl(var(--border))';
const GOLD = 'hsl(var(--chart-1))';

const TipStyle = {
  contentStyle: {
    background: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    borderRadius: 6,
    fontSize: 11,
  },
};

function Frame({ children }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
    </div>
  );
}

export default function ImagingBench({ imaging }) {
  if (!imaging) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
        Select the required variables — the imaging renders from measured chapter values, live.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Radar className="h-4 w-4 text-amber-400" />
        <span className="text-sm font-semibold">{imaging.title}</span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          n = {imaging.n} measured cases
        </span>
      </div>

      {imaging.kind === 'histogram' && (
        <Frame>
          <BarChart data={imaging.data}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="bin" tick={AXIS} />
            <YAxis tick={AXIS} allowDecimals={false} />
            <Tooltip {...TipStyle} />
            <Bar dataKey="count" fill={GOLD} radius={[2, 2, 0, 0]} />
          </BarChart>
        </Frame>
      )}

      {imaging.kind === 'bar' && (
        <Frame>
          <BarChart data={imaging.data}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={AXIS} />
            <YAxis tick={AXIS} allowDecimals={false} />
            <Tooltip {...TipStyle} />
            <Bar dataKey="count" fill={GOLD} radius={[2, 2, 0, 0]} />
          </BarChart>
        </Frame>
      )}

      {imaging.kind === 'means' && (
        <Frame>
          <BarChart data={imaging.data}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="group" tick={AXIS} />
            <YAxis tick={AXIS} domain={['auto', 'auto']} />
            <Tooltip {...TipStyle} />
            <Bar dataKey="mean" fill={GOLD} radius={[2, 2, 0, 0]}>
              <ErrorBar dataKey="se" stroke="hsl(var(--foreground))" width={6} />
            </Bar>
          </BarChart>
        </Frame>
      )}

      {imaging.kind === 'rbar' && (
        <>
          <Frame>
            <BarChart data={imaging.data} layout="vertical">
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis type="number" domain={[-1, 1]} tick={AXIS} />
              <YAxis type="category" dataKey="pair" tick={AXIS} width={70} />
              <Tooltip {...TipStyle} />
              <Bar dataKey="r" fill={GOLD} radius={[0, 2, 2, 0]} />
            </BarChart>
          </Frame>
          <div className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Scatter — {imaging.scatter.x} × {imaging.scatter.y}
          </div>
          <Frame>
            <ScatterChart>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name={imaging.scatter.x} tick={AXIS} domain={['auto', 'auto']} />
              <YAxis type="number" dataKey="y" name={imaging.scatter.y} tick={AXIS} domain={['auto', 'auto']} />
              <ZAxis range={[40, 40]} />
              <Tooltip {...TipStyle} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={imaging.scatter.points} fill={GOLD} />
            </ScatterChart>
          </Frame>
        </>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        Plotted from stored registry values only — no interpolation, no synthetic points. This is a preview
        of the imaging the analyst reproduces in SPSS; the signed output remains the citable artifact.
      </p>
    </div>
  );
}