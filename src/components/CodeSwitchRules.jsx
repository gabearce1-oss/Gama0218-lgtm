import { CODE_LABELS, FUNCTION_TAGS, RUBRIC } from '@/lib/codeSwitchData';
import { CheckCircle, XCircle, Languages } from 'lucide-react';

export default function CodeSwitchRules() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Languages className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-bold">Coding Rules & Reference</h2>
      </div>

      <div className="mb-6 rounded-md border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="text-sm text-amber-200/90 italic">
          A Chicano code-switch counts when a speaker crosses from English, Chicano English, Spanish,
          Chicano Spanish, Caló, or a hybrid form into another code to create identity, intimacy,
          emphasis, humor, cultural meaning, clarification, or rhetorical force.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          For writing: don't sprinkle Spanish like cilantro on a weak taco. Every switch needs a job.
        </p>
      </div>

      <h3 className="text-sm font-bold mb-2 text-muted-foreground uppercase tracking-wider">Code Labels</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-mono text-xs text-muted-foreground">Label</th>
              <th className="py-2 pr-4 text-xs text-muted-foreground">Meaning</th>
              <th className="py-2 text-xs text-muted-foreground">Counts as switch?</th>
            </tr>
          </thead>
          <tbody>
            {CODE_LABELS.map(c => {
              const countsYes = c.counts.toLowerCase().startsWith('yes');
              return (
                <tr key={c.code} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-mono font-bold text-amber-400">{c.code}</td>
                  <td className="py-2 pr-4">{c.label}</td>
                  <td className="py-2">
                    <span className={`inline-flex items-center gap-1 text-xs ${countsYes ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                      {countsYes ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {c.counts}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3 className="text-sm font-bold mb-2 text-muted-foreground uppercase tracking-wider">Function Tags</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        {FUNCTION_TAGS.map(f => (
          <div key={f.tag} className="rounded-md border border-border p-2">
            <div className="font-mono text-xs font-bold text-cyan-400">{f.tag}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{f.desc}</div>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-bold mb-2 text-muted-foreground uppercase tracking-wider">
        5-Question Rubric — All must be YES to count
      </h3>
      <div className="space-y-1">
        {RUBRIC.map((q, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{q}</span>
          </div>
        ))}
      </div>
    </div>
  );
}