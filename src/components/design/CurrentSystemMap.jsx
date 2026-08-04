import { ArrowDown, ArrowRight, BookOpenCheck, ShieldCheck } from 'lucide-react';
import { systemStages } from '@/lib/currentDesignMap';

const TONES = {
  cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400',
  amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
  emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
  violet: 'border-violet-500/30 bg-violet-500/5 text-violet-400',
};

export default function CurrentSystemMap() {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2"><BookOpenCheck className="w-4 h-4 text-primary" /><h2 className="text-sm font-bold">Current Platform Flow</h2></div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">A high-level view of the working paths currently represented in the platform—not a future-state recommendation.</p>
      <div className="mt-5 flex flex-col gap-2 md:flex-row md:items-stretch md:gap-3">
        {systemStages.map(([title, detail, tone], index) => (
          <div key={title} className="contents">
            <article className={`flex-1 rounded-md border p-4 ${TONES[tone]}`}><h3 className="text-sm font-semibold text-foreground">{title}</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p></article>
            {index < systemStages.length - 1 && <><ArrowDown className="mx-auto h-4 w-4 text-muted-foreground md:hidden" /><ArrowRight className="hidden h-4 w-4 shrink-0 self-center text-muted-foreground md:block" /></>}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 rounded-md border border-border bg-background/40 p-3 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 shrink-0 text-primary" /><span>Governance and human review are the control layer between captured material, score changes, and shareable reporting.</span></div>
    </section>
  );
}