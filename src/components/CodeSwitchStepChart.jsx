import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover p-3 text-xs shadow-lg max-w-xs">
      <div className="font-mono text-amber-400 font-bold mb-1">
        Position {d.position} · Switch #{d.cum_switches}
      </div>
      {d.speaker && <div className="text-muted-foreground">Speaker: <span className="text-foreground">{d.speaker}</span></div>}
      {d.switch_to && <div className="text-muted-foreground">Switch to: <span className="font-mono text-cyan-400">{d.switch_to}</span></div>}
      {d.function_tag && <div className="text-muted-foreground">Function: <span className="font-mono text-violet-400">{d.function_tag}</span></div>}
      {d.line_text && <div className="text-foreground mt-1 italic">"{d.line_text}"</div>}
    </div>
  );
}

export default function CodeSwitchStepChart({ switches }) {
  const chartData = useMemo(() => {
    const counted = switches
      .filter(s => s.count_switch)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
    let cum = 0;
    return counted.map(s => {
      cum++;
      return {
        position: s.position || 0,
        cum_switches: cum,
        switch_to: s.switch_to,
        speaker: s.speaker,
        line_text: s.line_text,
        function_tag: s.function_tag,
      };
    });
  }, [switches]);

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No counted switches yet. Annotate switches in the table below to see the step chart.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-bold mb-1">Cumulative Code-Switch Step Chart</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Each step = one counted switch. Hover for details.
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 16% 20%)" />
          <XAxis
            dataKey="position"
            tick={{ fill: 'hsl(215 14% 60%)', fontSize: 11 }}
            label={{ value: 'Position', position: 'insideBottom', offset: -10, fill: 'hsl(215 14% 60%)', fontSize: 11 }}
          />
          <YAxis
            tick={{ fill: 'hsl(215 14% 60%)', fontSize: 11 }}
            allowDecimals={false}
            label={{ value: 'Cumulative Switches', angle: -90, position: 'insideLeft', fill: 'hsl(215 14% 60%)', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="stepAfter"
            dataKey="cum_switches"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 4 }}
            activeDot={{ r: 6, fill: '#f59e0b' }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}