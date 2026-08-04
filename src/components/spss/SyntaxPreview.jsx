import { AlertTriangle, ImageIcon } from 'lucide-react';

export default function SyntaxPreview({ test, syntax, ready }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Generated syntax
        </div>
        <pre className="mt-2 max-h-72 overflow-auto rounded-md border border-border bg-background p-3 font-mono text-[11px] leading-relaxed text-foreground">
{ready ? syntax : '* Select the required variables to generate syntax.'}
        </pre>
      </div>

      <div className="rounded-md border border-border bg-background p-3">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <ImageIcon className="h-3.5 w-3.5 text-amber-400" /> Planned imaging
        </div>
        <p className="mt-1 text-sm">{test.graph}</p>
      </div>

      <div className="rounded-md border border-border bg-background p-3">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Assumptions to check
        </div>
        <ul className="mt-2 space-y-1">
          {test.assumptions.map((a) => (
            <li key={a} className="flex gap-2 text-xs text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}