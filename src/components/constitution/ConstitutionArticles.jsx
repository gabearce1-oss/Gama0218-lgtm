import { Landmark, ArrowRight } from 'lucide-react';
import { ARTICLES, OPERATING_CHAIN } from '@/lib/measurementConstitution';

export default function ConstitutionArticles() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 mb-1">
        <Landmark className="w-4 h-4" /> Constitution v1.0 · 2026-08-02
      </div>
      <h2 className="text-lg font-bold">Nine Governing Articles</h2>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 rounded-md border border-border/60 bg-background/40 p-3">
        {OPERATING_CHAIN.map((step, i) => (
          <span key={step} className="flex items-center gap-1.5">
            <span className="rounded bg-muted px-2 py-1 text-[11px] text-muted-foreground">{step}</span>
            {i < OPERATING_CHAIN.length - 1 && <ArrowRight className="w-3 h-3 text-amber-400/60" />}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {ARTICLES.map((a) => (
          <div key={a.id} className="rounded-md border border-border/60 bg-background/40 p-4">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-mono text-xs text-amber-400">{a.id}</span>
              <span className="font-bold text-sm">{a.title}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{a.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}