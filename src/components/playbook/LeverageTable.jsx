import { COMPONENTS, CEILING, FORMULA } from '@/lib/omegaPlaybook';

export default function LeverageTable() {
  const sorted = [...COMPONENTS].sort((a, b) => b.weight - a.weight);
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border p-5">
        <h2 className="font-bold">Component leverage</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each component contributes its weight × its value. At 100 across all four, the four rows below sum with the
          intercept ({FORMULA.intercept}) to {CEILING.toFixed(3)}.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Component</th>
              <th className="p-3">Weight</th>
              <th className="p-3">Ω per 10 pts</th>
              <th className="p-3">Ω at 100</th>
              <th className="hidden p-3 md:table-cell">What it counts</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr key={c.key} className="border-t border-border">
                <td className="p-3">
                  <div className="font-mono font-bold text-primary">{c.key}</div>
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                </td>
                <td className="p-3 font-mono">{c.weight}</td>
                <td className="p-3 font-mono">+{(c.weight * 10).toFixed(3)}</td>
                <td className="p-3 font-mono">{(c.weight * 100).toFixed(2)}</td>
                <td className="hidden p-3 text-muted-foreground md:table-cell">{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}