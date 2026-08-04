export default function SquadInteractionRules({ dynamics }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-bold mb-1">Squad Interaction Rules</h2>
      <p className="text-xs text-muted-foreground mb-4">Pair dynamics and sample exchanges — pressure reveals character.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dynamics.map(d => (
          <div key={d.pair} className="rounded-md border border-border bg-background/50 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm">{d.pair}</span>
            </div>
            <p className="text-[11px] text-cyan-400 mb-3">{d.dynamic}</p>
            <div className="space-y-1.5">
              {d.lines.map((line, i) => (
                <div key={i} className="text-xs">
                  <span className="font-mono font-semibold text-amber-400">{line.speaker}:</span>{' '}
                  <span className="text-foreground/80 italic">"{line.text}"</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}