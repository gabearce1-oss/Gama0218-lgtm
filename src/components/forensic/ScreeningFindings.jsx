import { AlertTriangle } from 'lucide-react';
import { screeningFindings } from '@/lib/forensicScreening';

const colors = { Critical: 'border-red-500/40 text-red-300', High: 'border-amber-500/40 text-amber-300', Medium: 'border-sky-500/40 text-sky-300' };

export default function ScreeningFindings() {
  return (
    <section className="space-y-3">
      {screeningFindings.map(([severity, title, detail]) => <article key={title} className="rounded-lg border border-border bg-card p-5"><div className="flex items-center gap-3"><AlertTriangle className="h-4 w-4 text-amber-400" /><span className={`rounded border px-2 py-0.5 text-xs font-semibold ${colors[severity]}`}>{severity}</span><h2 className="font-bold">{title}</h2></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p></article>)}
    </section>
  );
}