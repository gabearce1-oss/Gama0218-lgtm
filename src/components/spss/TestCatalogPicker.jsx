import { TEST_CATALOG } from '@/lib/spssTestPlans';

export default function TestCatalogPicker({ selectedId, onSelect }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {TEST_CATALOG.map((t) => {
        const active = t.id === selectedId;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              active
                ? 'border-amber-500/60 bg-amber-500/10'
                : 'border-border bg-card hover:border-amber-500/30'
            }`}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t.family}
            </div>
            <div className={`mt-1 text-sm font-semibold ${active ? 'text-amber-400' : ''}`}>{t.name}</div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.purpose}</p>
          </button>
        );
      })}
    </div>
  );
}