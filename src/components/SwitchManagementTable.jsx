import { Filter, Trash2, ArrowRight } from 'lucide-react';
import { CODE_LABELS, FUNCTION_TAGS, SWITCH_TYPES } from '@/lib/codeSwitchData';
import { codeColor, functionColor } from '@/lib/codeSwitchColors';
import { CODESWITCHING_EMPTY_STATE } from '@/lib/governance';

const selectClass = 'bg-background border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-amber-500/50';

export default function SwitchManagementTable({ switches, chapters, filters, setFilters, onDelete }) {
  const filtered = switches.filter(s => {
    if (filters.matrix_code && s.matrix_code !== filters.matrix_code) return false;
    if (filters.switch_to && s.switch_to !== filters.switch_to) return false;
    if (filters.function_tag && s.function_tag !== filters.function_tag) return false;
    if (filters.switch_type && s.switch_type !== filters.switch_type) return false;
    if (filters.speaker && !(s.speaker || '').toLowerCase().includes(filters.speaker.toLowerCase())) return false;
    if (filters.chapter && s.chapter_number !== parseInt(filters.chapter)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if ((a.chapter_number || 0) !== (b.chapter_number || 0)) return (a.chapter_number || 0) - (b.chapter_number || 0);
    return (a.position || 0) - (b.position || 0);
  });

  const chapterMap = {};
  chapters.forEach(c => { chapterMap[c.chapter_number] = c; });

  const hasFilters = filters.matrix_code || filters.switch_to || filters.function_tag || filters.switch_type || filters.speaker || filters.chapter;

  return (
    <div className="rounded-lg border border-border bg-card p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-amber-400" />
        <h2 className="text-lg font-bold">Switch Registry</h2>
        <span className="text-xs text-muted-foreground ml-2">({sorted.length} of {switches.length})</span>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4 p-3 rounded-md border border-border bg-background/50">
        <select value={filters.chapter} onChange={e => setFilters({ ...filters, chapter: e.target.value })} className={selectClass}>
          <option value="">All Chapters</option>
          {[...chapters].sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)).map(c => (
            <option key={c.id} value={c.chapter_number}>Ch.{String(c.chapter_number).padStart(2, '0')}</option>
          ))}
        </select>
        <select value={filters.matrix_code} onChange={e => setFilters({ ...filters, matrix_code: e.target.value })} className={selectClass}>
          <option value="">All Matrix Codes</option>
          {CODE_LABELS.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
        </select>
        <select value={filters.switch_to} onChange={e => setFilters({ ...filters, switch_to: e.target.value })} className={selectClass}>
          <option value="">All Switch-To</option>
          {CODE_LABELS.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
        </select>
        <select value={filters.function_tag} onChange={e => setFilters({ ...filters, function_tag: e.target.value })} className={selectClass}>
          <option value="">All Functions</option>
          {FUNCTION_TAGS.map(f => <option key={f.tag} value={f.tag}>{f.tag}</option>)}
        </select>
        <select value={filters.switch_type} onChange={e => setFilters({ ...filters, switch_type: e.target.value })} className={selectClass}>
          <option value="">All Types</option>
          {SWITCH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          type="text"
          placeholder="Speaker..."
          value={filters.speaker}
          onChange={e => setFilters({ ...filters, speaker: e.target.value })}
          className={selectClass}
        />
      </div>

      {hasFilters && (
        <button
          onClick={() => setFilters({ chapter: '', matrix_code: '', switch_to: '', function_tag: '', switch_type: '', speaker: '' })}
          className="text-xs text-amber-400 hover:underline mb-3"
        >
          Clear all filters
        </button>
      )}

      {/* Empty state */}
      {sorted.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-muted-foreground">{CODESWITCHING_EMPTY_STATE}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3">Ch.</th>
                <th className="py-2 pr-3">Pos</th>
                <th className="py-2 pr-3">Speaker</th>
                <th className="py-2 pr-3">Line</th>
                <th className="py-2 pr-3 font-mono">Matrix</th>
                <th className="py-2 pr-3"></th>
                <th className="py-2 pr-3 font-mono">Switch To</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Function</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(s => {
                const ch = chapterMap[s.chapter_number];
                return (
                  <tr key={s.id} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                      {String(s.chapter_number).padStart(2, '0')}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">{s.position}</td>
                    <td className="py-2 pr-3 text-xs">{s.speaker || '—'}</td>
                    <td className="py-2 pr-3 text-xs italic max-w-xs truncate">"{s.line_text}"</td>
                    <td className="py-2 pr-3">
                      <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono ${codeColor(s.matrix_code)}`}>
                        {s.matrix_code}
                      </span>
                    </td>
                    <td className="py-2 pr-3"><ArrowRight className="w-3 h-3 text-muted-foreground" /></td>
                    <td className="py-2 pr-3">
                      <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono ${codeColor(s.switch_to)}`}>
                        {s.switch_to}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{s.switch_type || '—'}</td>
                    <td className="py-2 pr-3">
                      {s.function_tag ? (
                        <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono ${functionColor(s.function_tag)}`}>
                          {s.function_tag}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-2">
                      <button onClick={() => onDelete(s.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}