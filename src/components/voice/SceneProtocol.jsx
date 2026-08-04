import { Crosshair, Flame, Heart } from 'lucide-react';

const ICONS = {
  Mission: Crosshair,
  Argument: Flame,
  'Grief / Memory': Heart,
};

const ACCENTS = {
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400' },
  red: { border: 'border-red-500/30', bg: 'bg-red-500/5', text: 'text-red-400' },
  violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/5', text: 'text-violet-400' },
};

export default function SceneProtocol({ protocols }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-bold mb-1">Scene-Level Protocol</h2>
      <p className="text-xs text-muted-foreground mb-4">How voice shifts by operational mode — everyone changes register.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {protocols.map(p => {
          const Icon = ICONS[p.mode] || Crosshair;
          const a = ACCENTS[p.accent];
          return (
            <div key={p.mode} className={`rounded-md border ${a.border} ${a.bg} p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${a.text}`} />
                <span className={`font-bold text-sm ${a.text}`}>{p.mode}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3 italic">{p.desc}</p>
              <div className="space-y-1.5">
                {p.lines.map((line, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-mono font-semibold text-amber-400">{line.speaker}:</span>{' '}
                    <span className="text-foreground/80 italic">"{line.text}"</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}