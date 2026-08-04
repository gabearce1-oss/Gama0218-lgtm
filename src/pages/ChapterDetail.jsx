import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import TierBadge from '@/components/TierBadge';
import StatusBadge from '@/components/StatusBadge';
import OmegaDisplay from '@/components/OmegaDisplay';
import { computeOmega } from '@/lib/omega';
import AuditDataSection from '@/components/AuditDataSection';
import CharacterSoulSection from '@/components/CharacterSoulSection';

const SUB_SCORES = [
  { key: 'cls', label: 'CLS', full: 'Chicano Literary Style' },
  { key: 'bis', label: 'BIS', full: 'Biographical Integrity' },
  { key: 'sii', label: 'SII', full: 'Sensory Integration Index' },
  { key: 'mrf', label: 'MRF', full: 'Narrative Compression' },
];

const EXTENDED_SCORES = [
  { key: 'character_agency', label: 'Character Agency' },
  { key: 'emotional_resonance', label: 'Emotional Resonance' },
  { key: 'dialogue', label: 'Dialogue' },
  { key: 'reader_retention', label: 'Reader Retention' },
  { key: 'cinematic_potential', label: 'Cinematic Potential' },
  { key: 'flesch_reading_score', label: 'Flesch Reading Score' },
];

export default function ChapterDetail() {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    base44.entities.Chapter.get(id).then((data) => {
      setChapter(data);
      setFormData(data);
      setLoading(false);
    });
  }, [id]);

  // Realtime subscription — auto-refresh when a sync updates this chapter
  useEffect(() => {
    const unsubscribe = base44.entities.Chapter.subscribe((event) => {
      if (event.type === 'update' && event.data?.id === id && !editMode) {
        setChapter(event.data);
        setFormData(event.data);
      }
    });
    return unsubscribe;
  }, [id, editMode]);

  const computedOmega = computeOmega(formData.cls, formData.bis, formData.sii, formData.mrf);
  const displayOmega = editMode
    ? formData.cls && formData.bis && formData.sii && formData.mrf
      ? computedOmega
      : formData.omega
    : chapter?.omega;

  const handleSave = async () => {
    setSaving(true);
    const omega =
      formData.cls && formData.bis && formData.sii && formData.mrf ? computedOmega : formData.omega;
    await base44.entities.Chapter.update(id, { ...formData, omega });
    setChapter({ ...formData, omega });
    setEditMode(false);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!chapter) return null;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Registry
      </Link>

      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-mono text-sm text-muted-foreground">Ch.{String(chapter.chapter_number).padStart(2, '0')}</span>
            <StatusBadge status={chapter.status} />
            {displayOmega > 0 && <TierBadge omega={displayOmega} />}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{chapter.title}</h1>
          <div className="text-sm text-muted-foreground mt-1">
            Act {chapter.act} · {chapter.word_count ? chapter.word_count.toLocaleString() : '—'} words
          </div>
        </div>
        <OmegaDisplay omega={displayOmega} size="md" />
      </div>

      {chapter.blocker_ids && chapter.blocker_ids.length > 0 && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-bold text-red-400">Active Blockers</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {chapter.blocker_ids.map((bid) => (
              <span key={bid} className="font-mono text-xs px-2 py-1 rounded border border-red-500/30 bg-red-500/10 text-red-400">
                {bid}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">RF 1.5 Scorecard</h2>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="text-xs px-3 py-1.5 rounded-md border border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              Edit Scores
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 disabled:opacity-50 inline-flex items-center gap-1"
            >
              <Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {SUB_SCORES.map(({ key, label, full }) => (
            <div key={key} className="rounded-md border border-border p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
              <div className="text-[10px] text-muted-foreground mb-2">{full}</div>
              {editMode ? (
                <input
                  type="number"
                  step="0.1"
                  value={formData[key] || ''}
                  onChange={(e) => setFormData({ ...formData, [key]: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-background border border-border rounded-md px-2 py-1 font-mono text-lg font-bold text-amber-400 focus:outline-none focus:border-amber-500/50"
                />
              ) : (
                <div className="font-mono text-2xl font-bold text-amber-400">
                  {chapter[key] ? chapter[key].toFixed(1) : '—'}
                </div>
              )}
            </div>
          ))}
        </div>

        {editMode && (
          <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Auto-calculated Ω from sub-scores:</span>
              <span className="font-mono font-bold text-amber-400">{computedOmega.toFixed(3)}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {EXTENDED_SCORES.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">{label}</span>
              {editMode ? (
                <input
                  type="number"
                  step="1"
                  value={formData[key] || ''}
                  onChange={(e) => setFormData({ ...formData, [key]: parseFloat(e.target.value) || 0 })}
                  className="w-20 bg-background border border-border rounded-md px-2 py-1 font-mono text-sm text-right focus:outline-none focus:border-amber-500/50"
                />
              ) : (
                <span className="font-mono text-sm">{chapter[key] ? chapter[key].toFixed(0) : '—'}</span>
              )}
            </div>
          ))}
        </div>

        {editMode && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Status</label>
              <select
                value={formData.status || 'pending'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm mt-1"
              >
                <option value="pending">Pending</option>
                <option value="scored">Scored</option>
                <option value="blocker">Blocker</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Word Count</label>
              <input
                type="number"
                value={formData.word_count || ''}
                onChange={(e) => setFormData({ ...formData, word_count: parseInt(e.target.value) || 0 })}
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm font-mono mt-1"
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-bold mb-3">Editorial Notes</h2>
        {editMode ? (
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={6}
            placeholder="Add editorial notes, revision priorities, observations..."
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50 resize-y"
          />
        ) : (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {chapter.notes || 'No notes recorded.'}
          </p>
        )}
      </div>

      <CharacterSoulSection
        chapter={chapter}
        editMode={editMode}
        formData={formData}
        setFormData={setFormData}
      />

      <AuditDataSection chapter={chapter} />
    </div>
  );
}