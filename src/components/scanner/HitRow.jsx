import { base44 } from '@/api/base44Client';
import { CLASS_META } from '@/lib/locatorMeta';

export default function HitRow({ hit }) {
  const meta = CLASS_META[hit.locator_class] || CLASS_META.structure;
  const setStatus = (review_status) => base44.entities.ScanHit.update(hit.id, { review_status });

  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-primary">{hit.locator_id}</span>
        <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${meta.style}`}>{meta.label}</span>
        <span className="text-xs font-semibold">{hit.locator_name}</span>
        {hit.occurrences > 1 && (
          <span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ×{hit.occurrences} in file
          </span>
        )}
        {hit.review_status !== 'new' && (
          <span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
            {hit.review_status}
          </span>
        )}
      </div>
      <p className="mt-2 font-mono text-xs text-foreground">{hit.match_text}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">…{hit.context}…</p>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>{hit.source_file}</span>
        <span>line {hit.line_number}</span>
        <span>offset {hit.char_offset}</span>
        {hit.review_status === 'new' && (
          <>
            <button type="button" onClick={() => setStatus('reviewed')} className="text-emerald-300 hover:underline">
              Mark reviewed
            </button>
            <button type="button" onClick={() => setStatus('dismissed')} className="text-muted-foreground hover:underline">
              Dismiss
            </button>
          </>
        )}
      </div>
    </div>
  );
}