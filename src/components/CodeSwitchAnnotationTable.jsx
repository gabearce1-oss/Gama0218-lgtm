import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CODE_OPTIONS, FUNCTION_TAGS, SWITCH_TYPES } from '@/lib/codeSwitchData';

const EMPTY_FORM = {
  position: '',
  speaker: '',
  line_text: '',
  matrix_code: 'ENG',
  switch_to: 'SPAN',
  switch_type: 'intrasentential',
  function_tag: 'EMPHASIS',
  count_switch: true,
};

const inputClass = 'bg-background border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-amber-500/50';

export default function CodeSwitchAnnotationTable({ switches, onAdd, onDelete }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.position) return;
    setAdding(true);
    await onAdd({ ...form, position: parseFloat(form.position) });
    setForm(EMPTY_FORM);
    setAdding(false);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-bold mb-4">Annotation Table</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 p-3 rounded-md border border-border bg-background/50">
        <input
          type="number"
          placeholder="Position"
          value={form.position}
          onChange={e => setForm({ ...form, position: e.target.value })}
          className={inputClass}
          required
        />
        <input
          type="text"
          placeholder="Speaker"
          value={form.speaker}
          onChange={e => setForm({ ...form, speaker: e.target.value })}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="Line text"
          value={form.line_text}
          onChange={e => setForm({ ...form, line_text: e.target.value })}
          className={`${inputClass} col-span-2`}
        />
        <select value={form.matrix_code} onChange={e => setForm({ ...form, matrix_code: e.target.value })} className={inputClass}>
          {CODE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={form.switch_to} onChange={e => setForm({ ...form, switch_to: e.target.value })} className={inputClass}>
          {CODE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={form.switch_type} onChange={e => setForm({ ...form, switch_type: e.target.value })} className={inputClass}>
          {SWITCH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={form.function_tag} onChange={e => setForm({ ...form, function_tag: e.target.value })} className={inputClass}>
          {FUNCTION_TAGS.map(f => <option key={f.tag} value={f.tag}>{f.tag}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm col-span-2 md:col-span-1">
          <input
            type="checkbox"
            checked={form.count_switch}
            onChange={e => setForm({ ...form, count_switch: e.target.checked })}
            className="accent-amber-400"
          />
          Count as switch
        </label>
        <button
          type="submit"
          disabled={adding}
          className="col-span-2 md:col-span-3 inline-flex items-center justify-center gap-1 px-4 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> {adding ? 'Adding...' : 'Add Switch'}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3">Pos</th>
              <th className="py-2 pr-3">Speaker</th>
              <th className="py-2 pr-3">Line</th>
              <th className="py-2 pr-3 font-mono">Matrix</th>
              <th className="py-2 pr-3 font-mono">→ Switch</th>
              <th className="py-2 pr-3">Type</th>
              <th className="py-2 pr-3">Function</th>
              <th className="py-2 pr-3 text-center">Count</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {switches.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-muted-foreground text-sm">
                  No switches annotated yet for this chapter.
                </td>
              </tr>
            ) : (
              switches.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-2 pr-3 font-mono text-xs">{s.position}</td>
                  <td className="py-2 pr-3 text-xs">{s.speaker || '—'}</td>
                  <td className="py-2 pr-3 text-xs italic max-w-xs truncate">"{s.line_text}"</td>
                  <td className="py-2 pr-3 font-mono text-xs text-amber-400">{s.matrix_code}</td>
                  <td className="py-2 pr-3 font-mono text-xs text-cyan-400">{s.switch_to}</td>
                  <td className="py-2 pr-3 text-xs">{s.switch_type || '—'}</td>
                  <td className="py-2 pr-3 font-mono text-xs text-violet-400">{s.function_tag || '—'}</td>
                  <td className="py-2 pr-3 text-center">
                    {s.count_switch ? (
                      <span className="text-emerald-400 text-xs">✓</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => onDelete(s.id)}
                      className="text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}