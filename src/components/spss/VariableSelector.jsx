import { VARIABLE_DICTIONARY } from '@/lib/spssProtocol';

export default function VariableSelector({ test, dv, factor, vars, onChange }) {
  const scale = VARIABLE_DICTIONARY.filter((v) => v.level === 'Scale');
  const grouping = VARIABLE_DICTIONARY.filter((v) => v.level !== 'Scale');
  const pool = test.id === 'FREQ' ? grouping : scale;

  const toggle = (name) =>
    onChange({ vars: vars.includes(name) ? vars.filter((v) => v !== name) : [...vars, name] });

  return (
    <div className="space-y-4">
      {test.needs.includes('dv') && (
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Dependent variable
          </span>
          <select
            value={dv}
            onChange={(e) => onChange({ dv: e.target.value })}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-amber-500/50 focus:outline-none"
          >
            <option value="">Select…</option>
            {scale.map((v) => (
              <option key={v.name} value={v.name}>{v.name} — {v.label}</option>
            ))}
          </select>
        </label>
      )}

      {test.needs.includes('factor') && (
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Grouping factor
          </span>
          <select
            value={factor}
            onChange={(e) => onChange({ factor: e.target.value })}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-amber-500/50 focus:outline-none"
          >
            <option value="">Select…</option>
            {grouping.map((v) => (
              <option key={v.name} value={v.name}>{v.name} — {v.label}</option>
            ))}
          </select>
        </label>
      )}

      {(test.needs.includes('vars') || test.needs.includes('ivs')) && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {test.needs.includes('ivs') ? 'Predictors' : 'Variables'}
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {pool.map((v) => {
              const on = vars.includes(v.name);
              return (
                <button
                  key={v.name}
                  onClick={() => toggle(v.name)}
                  title={v.label}
                  className={`rounded-md border px-2 py-1 font-mono text-xs transition-colors ${
                    on
                      ? 'border-amber-500/60 bg-amber-500/15 text-amber-400'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}