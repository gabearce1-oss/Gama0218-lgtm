
export default function CodeSwitchTriggerTable({ triggers }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-bold mb-1">Code-Switch Trigger Table</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Applies to Herrera, Tijuana, and any Chicano/Latino bilingual characters. Every switch must be purposeful, not decorative.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-2 pr-4">Trigger</th>
              <th className="py-2 pr-4">Switch Type</th>
              <th className="py-2">Example</th>
            </tr>
          </thead>
          <tbody>
            {triggers.map(t => (
              <tr key={t.trigger} className="border-b border-border/50">
                <td className="py-2 pr-4">
                  <span className="font-semibold text-amber-400">{t.trigger}</span>
                </td>
                <td className="py-2 pr-4 text-xs text-muted-foreground">{t.switch_type}</td>
                <td className="py-2 text-xs italic">
                  <span className="text-cyan-300">{t.example}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-3 border-t border-border/50 pt-3">
        Ali's study found code-switching can show identity but also serve practical functions: lexical need, clarification, quotes, and interjections.
        Switches must be <span className="text-amber-400">purposeful, not decorative</span>.
      </p>
    </div>
  );
}