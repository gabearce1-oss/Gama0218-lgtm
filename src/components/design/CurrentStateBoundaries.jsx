import { AlertTriangle, CheckCircle2, CircleDot } from 'lucide-react';
import { currentBoundaries } from '@/lib/currentDesignMap';

const ICONS = { amber: AlertTriangle, red: AlertTriangle, emerald: CheckCircle2, cyan: CircleDot };
const TONES = { amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400', red: 'border-red-500/30 bg-red-500/5 text-red-400', emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400', cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400' };

export default function CurrentStateBoundaries() {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-400" /><h2 className="text-sm font-bold">Observed Control Boundaries</h2></div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Current-state audit notes that distinguish implemented controls from visible mismatches and unrepresented boundaries.</p>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {currentBoundaries.map(([title, detail, tone]) => { const Icon = ICONS[tone]; return <article key={title} className={`rounded-md border p-4 ${TONES[tone]}`}><Icon className="h-4 w-4" /><h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></article>; })}
      </div>
    </section>
  );
}