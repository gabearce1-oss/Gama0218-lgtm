import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Scale, Loader2, Check, Grid3x3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const FIELDS = [
  { key: 'moral_weight', label: 'Moral Weight', weight: '50%', color: 'text-amber-400' },
  { key: 'agency_under_fire', label: 'Agency Under Fire', weight: '30%', color: 'text-red-400' },
  { key: 'grief_index', label: 'Grief Index', weight: '20%', color: 'text-violet-400' },
];

function ScoreInput({ value, onChange, disabled }) {
  return (
    <input
      type="number"
      min="0"
      max="100"
      value={value ?? ''}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      placeholder="—"
      className="w-16 rounded-md border border-border bg-background px-2 py-1 text-center font-mono text-sm focus:border-amber-500/50 focus:outline-none disabled:opacity-50"
    />
  );
}

export default function MoralLandscapeScorer() {
  const [chapters, setChapters] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Chapter.list('chapter_number', 200).then((data) => {
      setChapters(data);
      const d = {};
      data.forEach((c) => {
        d[c.id] = {
          moral_weight: c.moral_weight ?? null,
          agency_under_fire: c.agency_under_fire ?? null,
          grief_index: c.grief_index ?? null,
        };
      });
      setDrafts(d);
      setLoading(false);
    });
  }, []);

  const setField = (id, key, val) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: val } }));
  };

  const save = async (chapter) => {
    setSavingId(chapter.id);
    const patch = drafts[chapter.id];
    await base44.entities.Chapter.update(chapter.id, patch);
    setChapters((prev) => prev.map((c) => (c.id === chapter.id ? { ...c, ...patch } : c)));
    setSavingId(null);
    setSavedId(chapter.id);
    setTimeout(() => setSavedId((cur) => (cur === chapter.id ? null : cur)), 1500);
  };

  const isDirty = (chapter) => {
    const d = drafts[chapter.id];
    if (!d) return false;
    return FIELDS.some((f) => (d[f.key] ?? null) !== (chapter[f.key] ?? null));
  };

  const scoredCount = chapters.filter(
    (c) => c.moral_weight != null || c.agency_under_fire != null || c.grief_index != null
  ).length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Scale className="w-4 h-4 text-amber-400" />
          Moral Landscape Scoring
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Moral Landscape Scorer</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter each chapter's{' '}
          <span className="text-amber-400 font-medium">Moral Weight</span>,{' '}
          <span className="text-red-400 font-medium">Agency Under Fire</span>, and{' '}
          <span className="text-violet-400 font-medium">Grief Index</span> (0–100). These feed the{' '}
          <Link to="/" className="text-amber-400 hover:underline inline-flex items-center gap-1">
            <Grid3x3 className="w-3 h-3" /> Impact Matrix
          </Link>
          .
        </p>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {scoredCount} of {chapters.length} chapters scored
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-3 px-4 font-medium">Chapter</th>
                {FIELDS.map((f) => (
                  <th key={f.key} className="py-3 px-2 text-center font-medium whitespace-nowrap">
                    <span className={f.color}>{f.label}</span>
                    <span className="block text-[9px] text-muted-foreground">{f.weight}</span>
                  </th>
                ))}
                <th className="py-3 px-4 text-right font-medium">Save</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((c) => (
                <tr key={c.id} className="border-b border-border/40">
                  <td className="py-2 px-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-bold text-xs">Ch{c.chapter_number}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[220px]">{c.title}</span>
                    </div>
                    <div className="text-[9px] font-mono text-muted-foreground">Act {c.act}</div>
                  </td>
                  {FIELDS.map((f) => (
                    <td key={f.key} className="py-2 px-2 text-center">
                      <ScoreInput
                        value={drafts[c.id]?.[f.key]}
                        onChange={(v) => setField(c.id, f.key, v)}
                        disabled={savingId === c.id}
                      />
                    </td>
                  ))}
                  <td className="py-2 px-4 text-right">
                    <button
                      onClick={() => save(c)}
                      disabled={!isDirty(c) || savingId === c.id}
                      className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {savingId === c.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : savedId === c.id ? (
                        <><Check className="w-3 h-3" /> Saved</>
                      ) : (
                        'Save'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}