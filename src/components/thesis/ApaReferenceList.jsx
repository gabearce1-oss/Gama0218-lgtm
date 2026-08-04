import { Quote, AlertTriangle } from 'lucide-react';
import { REFERENCES, UNRESOLVED_SLOTS, CITATION_RULE, AUTHOR_OF_RECORD } from '@/lib/apaAttribution';

const CLASS_STYLE = {
  PRIMARY: 'border-primary/30 bg-primary/5 text-primary',
  FRAMING: 'border-sky-500/30 bg-sky-500/5 text-sky-300',
};

export default function ApaReferenceList() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
        <Quote className="h-4 w-4" /> Attribution register · APA 7
      </div>
      <h2 className="text-xl font-bold tracking-tight">References</h2>
      <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">{CITATION_RULE}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Author of record: <span className="font-mono text-foreground">{AUTHOR_OF_RECORD}</span>
      </p>

      <ul className="mt-5 space-y-4">
        {REFERENCES.map((r) => (
          <li key={r.id} className="border-l-2 border-border pl-4">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">{r.id}</span>
              <span
                className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${CLASS_STYLE[r.class]}`}
              >
                {r.class}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">In text: {r.inText}</span>
            </div>
            {/* APA hanging-indent style reference line */}
            <p className="pl-6 -indent-6 text-sm leading-relaxed text-foreground">{r.reference}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.role}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-md border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-300">
          <AlertTriangle className="h-3.5 w-3.5" /> Unresolved citation slots
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Claims the argument would need a source for, and cannot support. They are listed rather than filled.
        </p>
        <ul className="mt-3 space-y-3">
          {UNRESOLVED_SLOTS.map((s) => (
            <li key={s.slot} className="text-xs leading-relaxed">
              <div className="font-semibold text-foreground">{s.slot}</div>
              <div className="text-muted-foreground">Would require: {s.needed}</div>
              <div className="font-mono text-[10px] text-amber-300/90">{s.status}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}