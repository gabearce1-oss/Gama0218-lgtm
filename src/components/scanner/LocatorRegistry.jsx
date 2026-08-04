import { CLASS_META } from '@/lib/locatorMeta';

export default function LocatorRegistry({ locators }) {
  if (!locators) return <p className="text-sm text-muted-foreground">Loading locator registry…</p>;
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="font-bold">Locator registry · {locators.length}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Every locator is a fixed text pattern. Same document in, same offsets out — no model decides what counts.
      </p>
      <div className="mt-4 grid gap-2 lg:grid-cols-2">
        {locators.map((l) => {
          const meta = CLASS_META[l.class] || CLASS_META.structure;
          return (
            <div key={l.id} className="rounded-md border border-border bg-background/40 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-primary">{l.id}</span>
                <span className="text-sm font-semibold">{l.name}</span>
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${meta.style}`}>{meta.label}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{l.note}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}