import { Award } from 'lucide-react';
import { CONTRIBUTIONS } from '@/lib/thesisFramework';

export default function ExpectedContributions() {
  return (
    <section className="rounded-lg border border-border bg-card/40 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <Award className="h-4 w-4" /> Expected contributions
      </div>
      <h2 className="mt-1 text-xl font-bold">What This Study Can Defend</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {CONTRIBUTIONS.map((c) => (
          <div key={c.kind} className="rounded-lg border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">{c.kind}</div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{c.text}</p>
            <p className="mt-3 border-t border-border/60 pt-2 text-xs leading-5">{c.strength}</p>
          </div>
        ))}
      </div>
    </section>
  );
}