import { Library, Bot, UserCheck } from 'lucide-react';
import { BOOKS, CUSTODY_PRINCIPLE, PUBLIC_DISCLOSURE } from '@/lib/workbookCustody';

export default function WorkbookCustodyMap() {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="border-b border-border p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
          <Library className="h-3.5 w-3.5" /> Workbook custody · Book 2 / Book 3
        </div>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight">What Each Book Holds, and Who Controls It</h2>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">{CUSTODY_PRINCIPLE}</p>
      </header>

      <div className="grid gap-3 p-5 sm:p-6 lg:grid-cols-2">
        {BOOKS.map((b) => (
          <article key={b.id} className={`rounded-lg border p-4 ${b.className}`}>
            <div className="flex items-center gap-2">
              <span className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px] font-bold">{b.id}</span>
              {b.aiPermitted ? (
                <span className="flex items-center gap-1 rounded border border-amber-500/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                  <Bot className="h-3 w-3" /> AI may draft
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded border border-emerald-500/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  <UserCheck className="h-3 w-3" /> Human admission only
                </span>
              )}
            </div>
            <h3 className="mt-2 text-sm font-bold">{b.name}</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{b.role}</p>

            <dl className="mt-3 space-y-2 text-[11px] leading-relaxed">
              {[
                ['Role of AI', b.aiRole],
                ['Vetting required', b.vetting],
                ['Controlled by', b.controller],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-bold uppercase tracking-wider text-foreground/60">{label}</dt>
                  <dd className="mt-0.5 text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-3 border-t border-white/10 pt-2 font-mono text-[10px] font-bold">{b.standing}</div>
          </article>
        ))}
      </div>

      <div className="border-t border-border p-5 sm:p-6">
        <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">
          Published before use · the statistical system
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          Four things are made public about the statistical system before it is run against data. An answer that does not
          exist yet is a bar to execution, not a detail to fill in later.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {PUBLIC_DISCLOSURE.map((d, i) => (
            <div key={d.question} className="rounded-md border border-border bg-muted/20 p-3">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] font-bold text-primary">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs font-bold text-foreground">{d.question}</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{d.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}