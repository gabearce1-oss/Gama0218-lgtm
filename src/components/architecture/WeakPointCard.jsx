export default function WeakPointCard({ chapter, signals }) {
  return (
    <article className="flex gap-4 rounded-lg border border-amber-500/20 bg-card p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10 font-mono text-sm font-bold text-amber-300">
        {String(chapter.chapter_number).padStart(2, '0')}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold leading-snug text-foreground">{chapter.title}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {signals.map((signal) => (
            <span key={signal} className="rounded border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] text-amber-200">
              {signal}
            </span>
          ))}
        </div>
      </div>
      <span className="shrink-0 self-start rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[11px] text-amber-300">
        {signals.length} flag{signals.length === 1 ? '' : 's'}
      </span>
    </article>
  );
}