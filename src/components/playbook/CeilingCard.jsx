import { Target } from 'lucide-react';
import { FORMULA, CEILING, FLOOR, ELITE_GATE, CEILING_DOCTRINE } from '@/lib/omegaPlaybook';

const MARKS = [
  { label: 'Formula floor', value: FLOOR.toFixed(3), hint: 'all components 0' },
  { label: 'Elite gate', value: ELITE_GATE.toFixed(1), hint: 'internal review threshold' },
  { label: 'Reconstruction ceiling', value: CEILING.toFixed(3), hint: 'all components 100' },
];

export default function CeilingCard() {
  return (
    <section className="rounded-lg border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Target className="h-4 w-4" /> Reconstruction target
      </div>
      <p className="mt-2 font-mono text-sm leading-relaxed text-foreground">{FORMULA.text}</p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{FORMULA.name} · {FORMULA.id}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {MARKS.map((m) => (
          <div key={m.label} className="rounded-md border border-border bg-card p-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
            <div className="mt-1 font-mono text-2xl font-bold text-primary">{m.value}</div>
            <div className="text-xs text-muted-foreground">{m.hint}</div>
          </div>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {CEILING_DOCTRINE.map((line) => (
          <li key={line} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}