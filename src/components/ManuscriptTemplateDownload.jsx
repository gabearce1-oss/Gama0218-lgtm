import { Download } from 'lucide-react';
import { downloadManuscriptWorkbook } from '@/lib/manuscriptWorkbookTemplate';

export default function ManuscriptTemplateDownload() {
  return (
    <section className="mb-8 rounded-lg border border-amber-500/30 bg-amber-500/5 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Clean Rebuild</p>
          <h2 className="mt-1 text-lg font-bold">Manuscript Workbook Template</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            A blank Excel-ready workbook with separate sheets for chapter records, narrative review, prose and sensory review, code switching, and editorial evidence.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadManuscriptWorkbook}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <Download className="h-4 w-4" />
          Download Blank Template
        </button>
      </div>
    </section>
  );
}