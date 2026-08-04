import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Languages } from 'lucide-react';
import CodeSwitchStepChart from '@/components/CodeSwitchStepChart';
import CodeSwitchAnnotationTable from '@/components/CodeSwitchAnnotationTable';
import CodeSwitchRules from '@/components/CodeSwitchRules';
import { FUNCTION_TAGS } from '@/lib/codeSwitchData';

export default function CodeSwitching() {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [switches, setSwitches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Chapter.list('-chapter_number', 100).then(data => {
      setChapters(data);
      if (data.length > 0) setSelectedChapter(data[data.length - 1].chapter_number);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedChapter) return;
    base44.entities.CodeSwitch.filter({ chapter_number: selectedChapter }).then(data => {
      setSwitches(data.sort((a, b) => (a.position || 0) - (b.position || 0)));
    });
  }, [selectedChapter]);

  useEffect(() => {
    if (!selectedChapter) return;
    const unsubscribe = base44.entities.CodeSwitch.subscribe(event => {
      if (event.data?.chapter_number !== selectedChapter) return;
      setSwitches(prev => {
        if (event.type === 'create') return [...prev, event.data].sort((a, b) => (a.position || 0) - (b.position || 0));
        if (event.type === 'update') return prev.map(s => s.id === event.data.id ? event.data : s).sort((a, b) => (a.position || 0) - (b.position || 0));
        if (event.type === 'delete') return prev.filter(s => s.id !== event.data.id);
        return prev;
      });
    });
    return unsubscribe;
  }, [selectedChapter]);

  const handleAdd = async (data) => {
    await base44.entities.CodeSwitch.create({ ...data, chapter_number: selectedChapter });
  };

  const handleDelete = async (id) => {
    await base44.entities.CodeSwitch.delete(id);
    setSwitches(prev => prev.filter(s => s.id !== id));
  };

  const counted = switches.filter(s => s.count_switch);
  const speakers = [...new Set(counted.map(s => s.speaker).filter(Boolean))];

  const functionBreakdown = FUNCTION_TAGS.map(f => ({
    ...f,
    count: counted.filter(s => s.function_tag === f.tag).length,
  })).filter(f => f.count > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Languages className="w-4 h-4 text-amber-400" />
          Linguistic Analysis
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Chicano Code-Switching</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Annotate, count, and visualize code-switches across the manuscript — ENG, CHENG, SPAN, CHSPAN, CALÓ, MIX.
        </p>
      </div>

      <div className="mb-6">
        <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">Select Chapter</label>
        <select
          value={selectedChapter || ''}
          onChange={e => setSelectedChapter(parseInt(e.target.value))}
          className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50 min-w-[200px]"
        >
          {chapters.map(ch => (
            <option key={ch.id} value={ch.chapter_number}>
              Ch.{String(ch.chapter_number).padStart(2, '0')} — {ch.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-amber-400">Counted Switches</div>
          <div className="font-mono text-2xl font-bold text-amber-400 mt-1">{counted.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total Annotated</div>
          <div className="font-mono text-2xl font-bold mt-1">{switches.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Speakers</div>
          <div className="font-mono text-2xl font-bold mt-1">{speakers.length}</div>
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-cyan-400">Top Function</div>
          <div className="font-mono text-sm font-bold text-cyan-400 mt-1">
            {functionBreakdown.length > 0
              ? [...functionBreakdown].sort((a, b) => b.count - a.count)[0].tag
              : '—'}
          </div>
        </div>
      </div>

      {functionBreakdown.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4 mb-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Function Breakdown</div>
          <div className="space-y-2">
            {functionBreakdown.map(f => {
              const max = Math.max(...functionBreakdown.map(x => x.count));
              const pct = (f.count / max) * 100;
              return (
                <div key={f.tag} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-violet-400 w-32 shrink-0">{f.tag}</span>
                  <div className="flex-1 h-5 rounded bg-background overflow-hidden">
                    <div
                      className="h-full bg-violet-500/40 rounded transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground w-8 text-right">{f.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-6">
        <CodeSwitchStepChart switches={switches} />
      </div>

      <div className="mb-6">
        <CodeSwitchAnnotationTable
          switches={switches}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      </div>

      <CodeSwitchRules />
    </div>
  );
}