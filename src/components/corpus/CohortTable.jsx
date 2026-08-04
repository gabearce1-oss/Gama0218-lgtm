export default function CohortTable({ title, subtitle, rows }) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-xs leading-6 text-muted-foreground">{subtitle}</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="p-2 text-left">Text</th>
              <th className="p-2 text-left">Author</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Format</th>
              <th className="p-2 text-right">UR</th>
              <th className="p-2 text-right">GR</th>
              <th className="p-2 text-right">CR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.text}
                className={`border-b border-border/50 ${r.control ? 'bg-primary/10' : ''}`}
              >
                <td className="p-2 font-medium">
                  {r.text}
                  {r.control && (
                    <span className="ml-2 rounded border border-primary/40 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                      control text
                    </span>
                  )}
                </td>
                <td className="p-2 text-muted-foreground">{r.author}</td>
                <td className="p-2 font-mono text-xs text-muted-foreground">{r.date}</td>
                <td className="p-2 text-xs text-muted-foreground">{r.format}</td>
                <td className="p-2 text-right font-mono">{r.ur}</td>
                <td className="p-2 text-right font-mono">{r.gr}</td>
                <td className="p-2 text-right font-mono font-bold text-primary">{r.cr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}