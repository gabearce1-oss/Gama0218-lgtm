import { Download } from 'lucide-react';
import { downloadChapterExport } from '@/lib/chapterExport';

export default function ChapterExportButton({ chapters }) {
  return (
    <button
      type="button"
      onClick={() => downloadChapterExport(chapters)}
      disabled={!chapters.length}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <Download className="h-4 w-4" />
      Export Chapter Data
    </button>
  );
}