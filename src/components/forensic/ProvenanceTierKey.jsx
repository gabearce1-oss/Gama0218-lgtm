import { TIERS } from '@/lib/findingProvenance';

export default function ProvenanceTierKey() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {Object.values(TIERS).map((t) => (
        <div key={t.code} className={`rounded-md border p-3 ${t.className}`}>
          <div className="flex items-center gap-2">
            <span className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px] font-bold">{t.code}</span>
            <span className="text-xs font-bold">{t.label}</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{t.definition}</p>
        </div>
      ))}
    </div>
  );
}