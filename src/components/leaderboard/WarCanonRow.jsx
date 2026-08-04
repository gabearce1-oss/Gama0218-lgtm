export default function WarCanonRow({ entry, rank }) {
  const { title, author, year, canon, standard, mean, target, coverage, total, pct } = entry;
  const met = pct !== null && mean >= target;
  return (
    <div className="border-b border-border/50 p-4 last:border-0">
      <div className="flex items-start gap-4">
        <div className="w-6 pt-1 text-center font-mono text-xs text-muted-foreground">{rank}</div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">{title}</div>
          <div className="text-xs text-muted-foreground">{author} · {year} · {canon}</div>
          <div className="mt-1 text-xs text-muted-foreground">Standard: <span className="text-foreground">{standard}</span></div>
        </div>
        <div className="w-28 text-right">
          <div className={`font-mono text-xl font-bold ${met ? 'text-emerald-400' : 'text-amber-400'}`}>
            {mean === null ? '—' : mean.toFixed(2)}
          </div>
          <div className="font-mono text-[11px] text-muted-foreground">target {target.toFixed(1)}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 pl-10">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full ${met ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${pct ?? 0}%` }} />
        </div>
        <div className="w-40 text-right font-mono text-[11px] text-muted-foreground">
          {pct === null ? 'no scored chapters' : `${pct.toFixed(0)}% · ${coverage}/${total} chapters`}
        </div>
      </div>
    </div>
  );
}