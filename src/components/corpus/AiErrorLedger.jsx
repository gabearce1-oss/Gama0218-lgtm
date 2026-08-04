import { AlertTriangle, ArrowRight } from 'lucide-react';
import { AI_ERRORS } from '@/lib/scaleReclassification';

export default function AiErrorLedger() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-400">
        <AlertTriangle className="h-4 w-4" /> Inferential error ledger
      </div>
      <h2 className="mt-1 text-xl font-bold tracking-tight">Where the AI got it wrong</h2>
      <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
        Five named errors, not a vague complaint. Each one is an inference the scale could not support. The fourth is the
        only one that survives as a finding — and it survives stronger, because the other four were burying it.
      </p>

      <div className="mt-4 space-y-3">
        {AI_ERRORS.map((e) => (
          <article key={e.id} className="rounded-md border border-border bg-background/40 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-red-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-red-300">
                {e.id}
              </span>
              <h3 className="font-semibold">{e.error}</h3>
            </div>
            <dl className="mt-2 space-y-2 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">What happened</dt>
                <dd className="leading-6">{e.what_happened}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Why it is wrong</dt>
                <dd className="leading-6">{e.why_wrong}</dd>
              </div>
            </dl>
            <p className="mt-2 flex gap-2 border-t border-border pt-2 text-sm leading-6 text-emerald-300">
              <ArrowRight className="mt-1 h-4 w-4 shrink-0" />
              {e.correction}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}