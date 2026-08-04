import { Download, FileSpreadsheet } from 'lucide-react';
import { WORKBOOKS, downloadWorkbookTemplate } from '@/lib/fourWorkbookTemplates';

export default function WorkbookTemplateVault() {
  return (
    <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 mb-1">
        <FileSpreadsheet className="w-4 h-4" /> Deliverable · {WORKBOOKS.length} empty schema-controlled workbooks
      </div>
      <h2 className="text-lg font-bold">Workbook Templates</h2>
      <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-3xl">
        Headers only — no data, no coefficients, no scores. Each file opens in Excel with a <span className="font-mono">_CONTROL</span> sheet
        carrying the release-package fields, then one sheet per master table. No workbook may overwrite another workbook&rsquo;s
        master data; exchange happens only through a hashed release package.
      </p>
      <div className="space-y-3">
        {WORKBOOKS.map((w) => (
          <div key={w.id} className="rounded-md border border-border/60 bg-background/40 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-mono text-xs text-amber-400">{w.id}</span>
                  <span className="font-bold text-sm">{w.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{w.sheets.length + 1} sheets</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{w.purpose}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {w.sheets.map((s) => (
                    <span key={s.name} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{s.name}</span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => downloadWorkbookTemplate(w.id)}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Download className="h-4 w-4" />
                Download {w.id}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}