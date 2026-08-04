import { VARIABLE_DICTIONARY } from '@/lib/spssProtocol';

const LEVEL_STYLE = {
  Scale: 'text-emerald-400',
  Ordinal: 'text-amber-400',
  Nominal: 'text-sky-400',
};

export default function VariableDictionaryTable() {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Variable Dictionary · {VARIABLE_DICTIONARY.length} columns
      </h2>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Variable</th>
                <th className="px-4 py-3 font-medium">Label</th>
                <th className="px-4 py-3 font-medium">Measurement</th>
                <th className="px-4 py-3 font-medium">Range</th>
              </tr>
            </thead>
            <tbody>
              {VARIABLE_DICTIONARY.map((v) => (
                <tr key={v.name} className="border-b border-border/40">
                  <td className="px-4 py-2 font-mono text-xs font-bold text-amber-400">{v.name}</td>
                  <td className="px-4 py-2">{v.label}</td>
                  <td className={`px-4 py-2 text-xs font-medium ${LEVEL_STYLE[v.level] || ''}`}>{v.level}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{v.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}