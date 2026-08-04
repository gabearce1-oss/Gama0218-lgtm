import { Database, Copy } from 'lucide-react';
import { duplicateMetricGroups } from '@/lib/forensicScreening';

export default function LedgerIntegrityPanel({ chapters }) {
  const duplicateGroups = duplicateMetricGroups(chapters);
  return (
    <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5">
      <div className="flex items-center gap-2"><Database className="h-5 w-5 text-amber-400" /><h2 className="font-bold">Live Ledger Check</h2></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2"><div><p className="text-xs text-muted-foreground">Current chapter records</p><p className="mt-1 font-mono text-2xl font-bold">{chapters.length}</p></div><div><p className="text-xs text-muted-foreground">Exact metric-row groups</p><p className="mt-1 font-mono text-2xl font-bold">{duplicateGroups.length}</p></div></div>
      {duplicateGroups.length > 0 && <div className="mt-4 border-t border-amber-500/20 pt-4 text-sm"><div className="flex gap-2 text-amber-300"><Copy className="h-4 w-4 shrink-0" />Potentially duplicated rows: {duplicateGroups.map((group) => group.map((chapter) => `Ch. ${chapter.chapter_number}`).join(' / ')).join('; ')}</div></div>}
    </section>
  );
}