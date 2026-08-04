import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import CodeSwitchMatrixGrid from '@/components/CodeSwitchMatrixGrid';
import FunctionTagHeatmap from '@/components/FunctionTagHeatmap';
import SwitchManagementTable from '@/components/SwitchManagementTable';
import { CODE_LABELS, FUNCTION_TAGS } from '@/lib/codeSwitchData';
import { codeColor, functionColor } from '@/lib/codeSwitchColors';

export default function CodeSwitchManager() {
  const [chapters, setChapters] = useState([]);
  const [switches, setSwitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    chapter: '', matrix_code: '', switch_to: '', function_tag: '', switch_type: '', speaker: '',
  });

  useEffect(() => {
    Promise.all([
      base44.entities.Chapter.list('-chapter_number', 100),
      base44.entities.CodeSwitch.list('-created_date', 500),
    ]).then(([chData, swData]) => {
      setChapters(chData);
      setSwitches(swData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = base44.entities.CodeSwitch.subscribe(event => {
      setSwitches(prev => {
        if (event.type === 'create') return [...prev, event.data];
        if (event.type === 'update') return prev.map(s => s.id === event.data.id ? event.data : s);
        if (event.type === 'delete') return prev.filter(s => s.id !== event.data.id);
        return prev;
      });
    });
    return unsubscribe;
  }, []);

  const handleDelete = async (id) => {
    await base44.entities.CodeSwitch.delete(id);
  };

  const counted = switches.filter(s => s.count_switch);
  const speakers = [...new Set(switches.map(s => s.speaker).filter(Boolean))];

  // Matrix code distribution
  const codeDist = CODE_LABELS.map(c => ({
    ...c,
    count: switches.filter(s => s.matrix_code === c.code).length,
  }));
  const maxCodeCount = Math.max(1, ...codeDist.map(c => c.count));

  // Function tag distribution
  const funcDist = FUNCTION_TAGS.map(f => ({
    ...f,
    count: switches.filter(s => s.function_tag === f.tag).length,
  }));
  const maxFuncCount = Math.max(1, ...funcDist.map(f => f.count));

  // Top switch patterns (matrix → switch_to)
  const patterns = {};
  switches.forEach(s => {
    if (!s.matrix_code || !s.switch_to) return;
    const key = `${s.matrix_code}→${s.switch_to}`;
    patterns[key] = (patterns[key] || 0) + 1;
  });
  const topPatterns = Object.entries(patterns).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxPattern = Math.max(1, ...topPatterns.map(p => p[1]));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Languages className="w-4 h-4 text-amber-400" />
          Cross-Chapter Management
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Code-Switch Manager</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manuscript-wide view of matrix codes, function tags, and language shift patterns across all chapters.
            </p>
          </div>
          <Link to="/code-switching" className="shrink-0 text-xs text-amber-400 hover:underline">
            Per-chapter annotation →
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-amber-400">Total Switches</div>
          <div className="font-mono text-2xl font-bold text-amber-400 mt-1">{switches.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Counted</div>
          <div className="font-mono text-2xl font-bold mt-1">{counted.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Matrix Codes</div>
          <div className="font-mono text-2xl font-bold mt-1">{codeDist.filter(c => c.count > 0).length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Functions Used</div>
          <div className="font-mono text-2xl font-bold mt-1">{funcDist.filter(f => f.count > 0).length}</div>
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-cyan-400">Speakers</div>
          <div className="font-mono text-2xl font-bold text-cyan-400 mt-1">{speakers.length}</div>
        </div>
      </div>

      {/* Distribution side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Matrix Code Distribution */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-bold mb-3">Matrix Code Distribution</h2>
          <div className="space-y-2">
            {codeDist.map(c => (
              <div key={c.code} className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono w-16 justify-center shrink-0 ${codeColor(c.code)}`}>
                  {c.code}
                </span>
                <div className="flex-1 h-5 rounded bg-background overflow-hidden">
                  <div className="h-full bg-amber-500/30 rounded transition-all" style={{ width: `${(c.count / maxCodeCount) * 100}%` }} />
                </div>
                <span className="font-mono text-xs text-muted-foreground w-8 text-right">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Function Tag Distribution */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-bold mb-3">Function Tag Distribution</h2>
          <div className="space-y-2">
            {funcDist.map(f => (
              <div key={f.tag} className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono w-28 justify-center shrink-0 ${functionColor(f.tag)}`}>
                  {f.tag}
                </span>
                <div className="flex-1 h-5 rounded bg-background overflow-hidden">
                  <div className="h-full bg-violet-500/30 rounded transition-all" style={{ width: `${(f.count / maxFuncCount) * 100}%` }} />
                </div>
                <span className="font-mono text-xs text-muted-foreground w-8 text-right">{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Switch Patterns */}
      {topPatterns.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5 mb-6">
          <h2 className="text-sm font-bold mb-3">Top Switch Patterns</h2>
          <div className="space-y-2">
            {topPatterns.map(([pattern, count]) => {
              const [from, to] = pattern.split('→');
              return (
                <div key={pattern} className="flex items-center gap-3">
                  <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono ${codeColor(from)}`}>{from}</span>
                  <span className="text-muted-foreground text-xs">→</span>
                  <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono ${codeColor(to)}`}>{to}</span>
                  <div className="flex-1 h-5 rounded bg-background overflow-hidden">
                    <div className="h-full bg-teal-500/30 rounded transition-all" style={{ width: `${(count / maxPattern) * 100}%` }} />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cross-chapter grids */}
      <CodeSwitchMatrixGrid switches={switches} chapters={chapters} />
      <FunctionTagHeatmap switches={switches} chapters={chapters} />

      {/* Filterable management table */}
      <SwitchManagementTable
        switches={switches}
        chapters={chapters}
        filters={filters}
        setFilters={setFilters}
        onDelete={handleDelete}
      />
    </div>
  );
}