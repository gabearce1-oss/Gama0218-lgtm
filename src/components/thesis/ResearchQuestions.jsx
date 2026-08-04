import { HelpCircle } from 'lucide-react';
import { RESEARCH_QUESTIONS } from '@/lib/thesisFramework';

export default function ResearchQuestions() {
  return (
    <section className="rounded-lg border border-border bg-card/40 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <HelpCircle className="h-4 w-4" /> Questions & hypotheses
      </div>
      <h2 className="mt-1 text-xl font-bold">What This Study Actually Asks</h2>
      <div className="mt-4 space-y-4">
        {RESEARCH_QUESTIONS.map((q) => (
          <div key={q.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-baseline gap-2">
              <span className="shrink-0 font-mono text-xs text-amber-400">{q.id}</span>
              <p className="text-sm font-semibold leading-6">{q.question}</p>
            </div>
            <div className="mt-3 border-l-2 border-amber-500/40 pl-3">
              <span className="font-mono text-xs text-amber-400">{q.hypothesis}</span>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">{q.hypothesis_text}</p>
            </div>
            <div className="mt-3 grid gap-3 border-t border-border/60 pt-3 sm:grid-cols-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Testable with</div>
                <div className="mt-1 font-mono text-xs text-emerald-300">{q.testable_with}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Current state</div>
                <div className="mt-1 text-xs leading-5 text-orange-300">{q.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}