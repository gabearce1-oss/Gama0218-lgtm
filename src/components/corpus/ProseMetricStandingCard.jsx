import { Gauge, Check, X } from 'lucide-react';
import { BUNDLING_ERROR, TWO_QUESTIONS, PERSPECTIVE_NOTE } from '@/lib/proseMetricStanding';

export default function ProseMetricStandingCard() {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
          <Gauge className="h-3.5 w-3.5" /> Metric standing · where the percentile came from
        </div>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight">{BUNDLING_ERROR.headline}</h2>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">{BUNDLING_ERROR.likely_origin}</p>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-emerald-200/80">{BUNDLING_ERROR.what_that_is_worth}</p>
      </header>

      <div className="space-y-2 p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">Three failures, named</div>
        {BUNDLING_ERROR.where_it_failed.map((f, i) => (
          <div key={f.failure} className="flex gap-3 rounded-md border border-border bg-muted/20 p-3">
            <span className="mt-0.5 font-mono text-[10px] font-bold text-red-300">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div className="text-xs font-bold text-foreground">{f.failure}</div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{f.detail}</p>
            </div>
          </div>
        ))}
        <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground/70">Standing · </span>
          {BUNDLING_ERROR.standing}
        </p>
      </div>

      <div className="grid gap-3 border-t border-border p-5 sm:p-6 lg:grid-cols-2">
        {TWO_QUESTIONS.map((q) => (
          <article key={q.id} className={`rounded-lg border p-4 ${q.className}`}>
            <div className="flex items-center gap-2">
              <span className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px] font-bold">{q.id}</span>
              {q.answerable ? (
                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  <Check className="h-3 w-3" /> Measurable
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-red-300">
                  <X className="h-3 w-3" /> Not measurable
                </span>
              )}
            </div>
            <h3 className="mt-2 text-sm font-bold leading-snug">{q.question}</h3>
            <dl className="mt-2.5 space-y-2 text-[11px] leading-relaxed">
              <div>
                <dt className="font-bold uppercase tracking-wider text-foreground/60">Instrument</dt>
                <dd className="mt-0.5 text-muted-foreground">{q.instrument}</dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wider text-foreground/60">Claim class</dt>
                <dd className="mt-0.5 font-mono text-[10px] font-bold">{q.class}</dd>
              </div>
            </dl>
            <p className="mt-2.5 border-t border-white/10 pt-2 text-[11px] leading-relaxed text-muted-foreground">{q.note}</p>
          </article>
        ))}
      </div>

      <footer className="border-t border-border bg-muted/20 p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">Perspective</div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{PERSPECTIVE_NOTE}</p>
      </footer>
    </section>
  );
}