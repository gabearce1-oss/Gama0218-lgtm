import { Sigma, TriangleAlert } from 'lucide-react';
import { MODEL } from '@/lib/thesisFramework';

export default function RegressionModelCard() {
  return (
    <section className="rounded-lg border border-border bg-card/40 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <Sigma className="h-4 w-4" /> Score-fluctuation model
      </div>
      <h2 className="mt-1 text-xl font-bold">Specification, Not a Fitted Model</h2>
      <div className="mt-4 overflow-x-auto rounded-md border border-border bg-background p-4">
        <code className="whitespace-nowrap font-mono text-sm text-amber-300">{MODEL.equation}</code>
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {MODEL.terms.map((t) => (
          <div key={t.symbol} className="rounded-md border border-border bg-card p-3">
            <dt className="font-mono text-xs text-amber-400">{t.symbol}</dt>
            <dd className="mt-1 text-xs leading-5 text-muted-foreground">{t.meaning}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-start gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
        <p className="text-xs leading-5 text-red-300">{MODEL.caution}</p>
      </div>
    </section>
  );
}