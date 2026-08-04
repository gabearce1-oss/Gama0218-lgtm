import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ReportSection({ icon: Icon, label, title, hint, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-secondary/60"
      >
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary">{label}</span>
          <span className="block text-base font-bold leading-snug text-foreground">{title}</span>
        </span>
        {hint && <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:block">{hint}</span>}
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="border-t border-border p-5">{children}</div>}
    </section>
  );
}