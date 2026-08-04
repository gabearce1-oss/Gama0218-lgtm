import { useEffect } from 'react';
import { Download } from 'lucide-react';
import { downloadManuscriptWorkbook } from '@/lib/manuscriptWorkbookTemplate';

export default function ManuscriptTemplate() {
  useEffect(() => {
    downloadManuscriptWorkbook();
  }, []);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center p-6 lg:p-8">
      <section className="w-full rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 text-center">
        <Download className="mx-auto h-8 w-8 text-amber-400" />
        <h1 className="mt-4 text-2xl font-bold">Manuscript Workbook Template</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your blank workbook download has started. If it did not appear, use the button below.
        </p>
        <button
          type="button"
          onClick={downloadManuscriptWorkbook}
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <Download className="h-4 w-4" />
          Download Workbook
        </button>
      </section>
    </main>
  );
}