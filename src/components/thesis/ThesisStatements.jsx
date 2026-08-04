import { Quote } from 'lucide-react';
import { THESIS } from '@/lib/thesisFramework';

export default function ThesisStatements() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-6 lg:col-span-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
          <Quote className="h-4 w-4" /> Primary thesis
        </div>
        <p className="mt-3 text-sm leading-7">{THESIS.primary}</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Technical thesis</div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{THESIS.technical}</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Governing premise</div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{THESIS.premise}</p>
      </div>
    </section>
  );
}