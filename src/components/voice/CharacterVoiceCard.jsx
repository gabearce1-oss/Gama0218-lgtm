import { MapPin, Zap, AlertCircle, Mic } from 'lucide-react';

export default function CharacterVoiceCard({ character }) {
  const c = character;
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{c.call_sign}</h3>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">{c.vector}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3" /> {c.origin} · {c.role}
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold">{c.archetype}</span>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{c.core_voice}</p>

      <div className="space-y-2 text-xs mb-3">
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0 w-14">Rhythm</span>
          <span>{c.rhythm}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground shrink-0 w-14">Pressure</span>
          <span>{c.pressure_shift}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {c.markers.map(m => (
          <span key={m} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-foreground border border-border">{m}</span>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {c.triggers.map(t => (
          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" />{t}
          </span>
        ))}
      </div>

      <div className="rounded-md border border-red-500/20 bg-red-500/5 p-2 mb-3 flex items-start gap-2">
        <AlertCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
        <span className="text-[11px] text-red-300">{c.no_go}</span>
      </div>

      <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-2 mb-3">
        <div className="text-[10px] uppercase tracking-wider text-amber-400 mb-1">Voice Rule</div>
        <span className="text-xs font-semibold text-amber-300">{c.rule}</span>
      </div>

      <div>
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          <Mic className="w-3 h-3" /> Sample Lines
        </div>
        <div className="space-y-1">
          {c.samples.map((s, i) => (
            <p key={i} className="text-xs italic text-foreground/80 border-l-2 border-border pl-2">{s}</p>
          ))}
        </div>
      </div>
    </div>
  );
}