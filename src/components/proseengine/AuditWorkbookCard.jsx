import { Download, Table2 } from 'lucide-react';
import { AUDIT_WORKBOOK, downloadAuditWorkbook } from '@/lib/proseEngineAudit';

export default function AuditWorkbookCard() {
  return (
    <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
            <Table2 className="h-4 w-4" /> W5 · External capability audit workbook
          </div>
          <h2 className="mt-1 text-xl font-bold">Your Research Workbook</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            An empty, schema-controlled workbook for the proof-of-concept research: observed capabilities, infrastructure
            mapping, governance verdicts, the red-flag register, the POC plan, candidate constructs, and a verification
            queue for every unproven external claim. Headers only — you supply the findings.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadAuditWorkbook}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
        >
          <Download className="h-4 w-4" />
          Download W5
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {AUDIT_WORKBOOK.sheets.map((s) => (
          <span key={s.name} className="rounded bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
            {s.name}
          </span>
        ))}
      </div>
    </section>
  );
}