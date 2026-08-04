import { ArrowDown, ArrowRight, Database, ExternalLink, PlugZap, ShieldAlert } from 'lucide-react';
import { connectorLandscape } from '@/lib/currentDesignMap';

const TONES = { cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400', amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400', violet: 'border-violet-500/30 bg-violet-500/5 text-violet-400', slate: 'border-border bg-background/40 text-muted-foreground' };

export default function ConnectorLandscape() {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2"><PlugZap className="h-4 w-4 text-primary" /><h2 className="text-sm font-bold">Connected Systems & Data Paths</h2></div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">This map separates connected services, configured platform paths, and the controls through which their material is handled.</p>
      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {connectorLandscape.map(([title, detail, items, tone], index) => (
          <div key={title} className="contents">
            <article className={`rounded-md border p-4 ${TONES[tone]}`}><div className="flex items-center gap-2"><Database className="h-4 w-4" /><h3 className="text-sm font-semibold text-foreground">{title}</h3></div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p><ul className="mt-3 space-y-1 text-xs text-foreground/90">{items.map((item) => <li key={item}>• {item}</li>)}</ul></article>
            {index < connectorLandscape.length - 1 && <><ArrowDown className="mx-auto h-4 w-4 text-muted-foreground lg:hidden" /><ArrowRight className="hidden h-4 w-4 self-center text-muted-foreground lg:block" /></>}
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="flex gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground"><ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" /><span>Automated schedules are currently unavailable because the workspace has no Integration credits. This is a present operating limitation, not an application defect.</span></div><div className="flex gap-2 rounded-md border border-border bg-background/40 p-3 text-xs text-muted-foreground"><ExternalLink className="h-4 w-4 shrink-0 text-cyan-400" /><span>SPSS remains outside the platform as an autonomous analysis environment; no internal connector or automated exchange is represented today.</span></div></div>
    </section>
  );
}