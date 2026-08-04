import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Mic, TrendingDown } from 'lucide-react';
import VoiceAuditTable from '@/components/VoiceAuditTable';
import RestorationRoadmap from '@/components/RestorationRoadmap';
import VoiceRadarChart from '@/components/VoiceRadarChart';

const DIMENSIONS = [
  { key: 'voice', label: 'Voice', desc: 'Vocal authenticity' },
  { key: 'lens', label: 'Lens', desc: 'Narrative lens' },
  { key: 'cs_score', label: 'CS', desc: 'Code-switching' },
  { key: 'familia', label: 'Familia', desc: 'Family presence' },
  { key: 'barrio', label: 'Barrio', desc: 'Community origin' },
  { key: 'hist', label: 'Hist', desc: 'Historical truth' },
  { key: 'carnalismo', label: 'Carnal', desc: 'Brotherhood' },
  { key: 'composite', label: 'Ω Comp', desc: 'Composite score' },
  { key: 'bugs', label: 'Bugs', desc: 'Narrative inconsistencies, continuity breaks', risk: true },
  { key: 'smells', label: 'Smells', desc: 'Cliché, forced, or stereotyped moments', risk: true },
  { key: 'vulnerabilities', label: 'Vuln', desc: 'Weak points where voice breaks down', risk: true },
];

function avg(arr, key) {
  const vals = arr.filter(c => c[key] !== undefined && c[key] !== null).map(c => c[key]);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function DimCard({ dim, chapters }) {
  const value = avg(chapters, dim.key);
  const isComposite = dim.key === 'composite';
  const isRisk = dim.risk;
  const color = value === null
    ? 'text-muted-foreground'
    : isRisk
      ? value >= 3 ? 'text-red-400' : value >= 2.3 ? 'text-amber-400' : 'text-emerald-400'
      : value >= 3 ? 'text-emerald-400' : value >= 2.3 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{dim.label}</div>
      <div className="text-[10px] text-muted-foreground mb-2">{dim.desc}</div>
      <div className={`font-mono ${isComposite ? 'text-xl font-bold' : 'text-lg font-semibold'} ${color}`}>
        {value !== null ? value.toFixed(isComposite ? 2 : 2) : '—'}
      </div>
    </div>
  );
}

export default function VoiceAudit() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('scores');

  useEffect(() => {
    base44.entities.Chapter.list('-chapter_number', 100).then(data => {
      setChapters(data);
      setLoading(false);
    });

    const unsubscribe = base44.entities.Chapter.subscribe(event => {
      if (event.type === 'update') {
        setChapters(prev => prev.map(c => c.id === event.data?.id ? { ...c, ...event.data } : c));
      }
    });
    return unsubscribe;
  }, []);

  const scored = chapters.filter(c => c.composite !== undefined && c.composite !== null);
  const critical = scored.filter(c => c.tier_label === 'CR');
  const high = scored.filter(c => c.tier_label === 'HI');
  const medium = scored.filter(c => c.tier_label === 'ME');
  const manuscriptAvg = avg(scored, 'composite');
  const lowest = scored.length > 0 ? [...scored].sort((a, b) => (a.composite || 0) - (b.composite || 0))[0] : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Mic className="w-4 h-4 text-amber-400" />
          Phase 3 Authenticity Audit
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Chicano Voice Restoration</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          8-dimension authenticity scoring across {scored.length} chapters — voice, narrative lens, code-switching, familia, barrio, historical truth, carnalismo, and composite Ω.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground mb-1">Manuscript Composite</div>
          <div className="font-mono text-2xl font-bold text-amber-400">{manuscriptAvg ? manuscriptAvg.toFixed(2) : '—'}</div>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <div className="text-xs text-red-400 mb-1">Critical (CR)</div>
          <div className="font-mono text-2xl font-bold text-red-400">{critical.length}</div>
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="text-xs text-amber-400 mb-1">High Loss (HI)</div>
          <div className="font-mono text-2xl font-bold text-amber-400">{high.length}</div>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="text-xs text-emerald-400 mb-1">Medium (ME)</div>
          <div className="font-mono text-2xl font-bold text-emerald-400">{medium.length}</div>
        </div>
      </div>

      {lowest && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-sm font-bold text-red-400">Lowest Composite</span>
          </div>
          <div className="text-sm">
            Ch.{String(lowest.chapter_number).padStart(2, '0')} — {lowest.title}: <span className="font-mono font-bold text-red-400">{lowest.composite?.toFixed(2)}</span>
          </div>
          {lowest.restoration_notes && (
            <p className="text-xs text-muted-foreground mt-1">{lowest.restoration_notes}</p>
          )}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">8-Dimension Averages</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {DIMENSIONS.map(d => (
            <DimCard key={d.key} dim={d} chapters={scored} />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <VoiceRadarChart chapters={scored} />
      </div>

      <div className="flex gap-1 border-b border-border mb-6">
        <button
          onClick={() => setTab('scores')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'scores' ? 'border-amber-400 text-amber-400' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Score Table
        </button>
        <button
          onClick={() => setTab('roadmap')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'roadmap' ? 'border-amber-400 text-amber-400' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Restoration Roadmap
        </button>
      </div>

      {tab === 'scores' && <VoiceAuditTable chapters={scored} />}
      {tab === 'roadmap' && <RestorationRoadmap chapters={scored} />}
    </div>
  );
}