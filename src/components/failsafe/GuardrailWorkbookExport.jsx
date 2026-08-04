import { Download, FileSpreadsheet } from 'lucide-react';
import { downloadGuardrailWorkbook, GUARDRAIL_SHEETS } from '@/lib/guardrailWorkbook';

export default function GuardrailWorkbookExport({ events = [] }) {
  return (
    <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5">
      <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <FileSpreadsheet className="h-4 w-4" /> Guardrail workbook · populated export
      </div>
      <h2 className="text-lg font-bold">Take the guardrails into the workbook</h2>
      <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        The tripwires and the rule authority are on this page; this writes them out as workbook rows so the automation
        reads from the same table you can audit by hand. Event rows carry their sign-off state, so nothing looks cleared
        that has not been cleared by a named person.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {GUARDRAIL_SHEETS.map((s) => (
            <div key={s.name} className="rounded-md border border-border/60 bg-background/40 px-3 py-2">
              <div className="font-mono text-[11px] text-amber-300">{s.name}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {(s.count === null ? events.length : s.count)} rows
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => downloadGuardrailWorkbook(events)}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
        >
          <Download className="h-4 w-4" /> Download guardrail workbook
        </button>
      </div>
    </section>
  );
}