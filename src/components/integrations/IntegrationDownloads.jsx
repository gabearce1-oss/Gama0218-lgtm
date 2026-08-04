import { Download, FileSpreadsheet } from 'lucide-react';
import { DOWNLOADS } from '@/lib/integrationWorkbooks';

export default function IntegrationDownloads() {
  return (
    <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5">
      <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <FileSpreadsheet className="h-4 w-4" /> Excel deliverables
      </div>
      <h2 className="text-lg font-bold">Integration register &amp; workflow template</h2>
      <div className="mt-4 space-y-3">
        {DOWNLOADS.map((d) => (
          <div key={d.id} className="rounded-md border border-border/60 bg-background/40 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold">{d.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.detail}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {d.sheets.map((s) => (
                    <span key={s} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={d.run}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
              >
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}