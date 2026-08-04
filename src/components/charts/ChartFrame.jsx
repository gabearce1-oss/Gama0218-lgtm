import { Sigma } from 'lucide-react';

/**
 * Elegant shell for every reporting figure.
 * The provenance strip is not decoration — a figure without a named source,
 * a variable class, and a stated operation cannot appear in this project.
 */
export default function ChartFrame({ figure, title, subtitle, children, source, operation, variableClass, n }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-6 pb-4 pt-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
          <Sigma className="h-3.5 w-3.5" /> {figure}
        </div>
        <h3 className="mt-1.5 text-lg font-bold leading-snug tracking-tight text-foreground">{title}</h3>
        {subtitle && <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="px-2 py-5 sm:px-4">{children}</div>

      <figcaption className="grid gap-x-6 gap-y-2 border-t border-border bg-muted/20 px-6 py-3.5 text-[10px] leading-relaxed text-muted-foreground sm:grid-cols-2">
        <div>
          <span className="font-bold uppercase tracking-wider text-foreground/70">Source · </span>
          {source}
        </div>
        <div>
          <span className="font-bold uppercase tracking-wider text-foreground/70">Operation · </span>
          {operation}
        </div>
        <div>
          <span className="font-bold uppercase tracking-wider text-foreground/70">Variable class · </span>
          <span className="font-mono">{variableClass}</span>
        </div>
        <div>
          <span className="font-bold uppercase tracking-wider text-foreground/70">n · </span>
          <span className="font-mono">{n}</span>
        </div>
      </figcaption>
    </figure>
  );
}