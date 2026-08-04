import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, Plus, Check, X, ChevronDown, Loader2, AlertTriangle, Filter } from 'lucide-react';
import { EVIDENCE_CLASSES, CLAIM_CATEGORIES, CONFIDENCE_LEVELS } from '@/lib/governance';

const STATUS_CONFIG = {
  pass:               { label: 'PASS',               color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
  needs_review:       { label: 'NEEDS REVIEW',       color: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-500/5' },
  blocked:            { label: 'BLOCKED',             color: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-500/5' },
  authorial_invention:{ label: 'AUTHORIAL INV.',     color: 'text-sky-400',     border: 'border-sky-500/30',     bg: 'bg-sky-500/5' },
};

const EVIDENCE_CLASS_COLORS = {
  E0: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  E1: 'text-teal-400   border-teal-500/30   bg-teal-500/10',
  E2: 'text-blue-400   border-blue-500/30   bg-blue-500/10',
  E3: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
  E4: 'text-amber-400  border-amber-500/30  bg-amber-500/10',
  E5: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  E6: 'text-red-400    border-red-500/30    bg-red-500/10',
};

const EMPTY_FORM = {
  chapter_number: '',
  scene_id: '',
  claim_text: '',
  claim_category: 'military',
  evidence_class: 'E1',
  source_title: '',
  source_url_or_file: '',
  source_note: '',
  confidence: 'medium',
  status: 'needs_review',
  reviewer: '',
};

function ClaimCard({ claim, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const statusCfg = STATUS_CONFIG[claim.status] || STATUS_CONFIG.needs_review;
  const ecColor = EVIDENCE_CLASS_COLORS[claim.evidence_class] || '';

  return (
    <div className={`rounded-lg border ${statusCfg.border} ${statusCfg.bg} overflow-hidden`}>
      <div className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setOpen(o => !o)}>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform ${open ? '' : '-rotate-90'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${ecColor}`}>{claim.evidence_class}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">{claim.claim_category}</span>
            {claim.chapter_number && <span className="font-mono text-[10px] text-muted-foreground">Ch.{claim.chapter_number}</span>}
            <span className={`font-mono text-[10px] font-bold ml-auto ${statusCfg.color}`}>{statusCfg.label}</span>
          </div>
          <p className="text-sm font-medium truncate">{claim.claim_text}</p>
        </div>
      </div>
      {open && (
        <div className="border-t border-border px-4 py-3 space-y-3">
          {claim.source_title && (
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Source</div>
              <div className="text-sm">{claim.source_title}</div>
              {claim.source_url_or_file && <div className="font-mono text-[10px] text-muted-foreground">{claim.source_url_or_file}</div>}
            </div>
          )}
          {claim.source_note && (
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Note</div>
              <div className="text-sm text-muted-foreground">{claim.source_note}</div>
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <div>
              <div className="text-[10px] text-muted-foreground mb-0.5">Confidence</div>
              <span className="font-mono text-xs text-foreground capitalize">{claim.confidence}</span>
            </div>
            {claim.reviewer && (
              <div className="ml-4">
                <div className="text-[10px] text-muted-foreground mb-0.5">Reviewer</div>
                <span className="text-xs">{claim.reviewer}</span>
              </div>
            )}
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Update Status</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                <button key={val} onClick={() => onStatusChange(claim.id, val)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                    claim.status === val ? `${cfg.border} ${cfg.bg} ${cfg.color} font-bold` : 'border-border text-muted-foreground hover:text-foreground'
                  }`}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddClaimForm({ onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.claim_text.trim()) return;
    setSaving(true);
    await base44.entities.EvidenceClaim.create({
      ...form,
      chapter_number: form.chapter_number ? Number(form.chapter_number) : undefined,
    });
    setSaving(false);
    onSave();
  };

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
      <div className="text-sm font-bold text-amber-400 mb-2">New Evidence Claim</div>

      <textarea
        value={form.claim_text}
        onChange={e => set('claim_text', e.target.value)}
        placeholder="Describe the factual claim…"
        className="w-full h-20 bg-background/60 border border-border rounded p-2.5 text-sm font-mono text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Chapter #</label>
          <input value={form.chapter_number} onChange={e => set('chapter_number', e.target.value)}
            type="number" min="1" max="45" placeholder="e.g. 9"
            className="w-full bg-background/60 border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Scene ID</label>
          <input value={form.scene_id} onChange={e => set('scene_id', e.target.value)}
            placeholder="e.g. S9-A"
            className="w-full bg-background/60 border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Category</label>
          <select value={form.claim_category} onChange={e => set('claim_category', e.target.value)}
            className="w-full bg-background/60 border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50">
            {CLAIM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Evidence Class</label>
          <select value={form.evidence_class} onChange={e => set('evidence_class', e.target.value)}
            className="w-full bg-background/60 border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50">
            {EVIDENCE_CLASSES.map(ec => <option key={ec.class} value={ec.class}>{ec.class} — {ec.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Confidence</label>
          <select value={form.confidence} onChange={e => set('confidence', e.target.value)}
            className="w-full bg-background/60 border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50">
            {CONFIDENCE_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Initial Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full bg-background/60 border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50">
            {Object.entries(STATUS_CONFIG).map(([v, cfg]) => <option key={v} value={v}>{cfg.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Source Title</label>
          <input value={form.source_title} onChange={e => set('source_title', e.target.value)}
            placeholder="e.g. Naval History Heritage Command CH-46 page"
            className="w-full bg-background/60 border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">URL / File</label>
          <input value={form.source_url_or_file} onChange={e => set('source_url_or_file', e.target.value)}
            placeholder="https://… or filename"
            className="w-full bg-background/60 border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
        </div>
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Source Note</label>
        <textarea value={form.source_note} onChange={e => set('source_note', e.target.value)}
          placeholder="Fragment basis, confidence note, modeling rationale…"
          className="w-full h-16 bg-background/60 border border-border rounded p-2.5 text-sm font-mono text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Reviewer</label>
        <input value={form.reviewer} onChange={e => set('reviewer', e.target.value)}
          placeholder="Your name or initials"
          className="w-full bg-background/60 border border-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
      </div>

      <div className="flex items-center gap-2 justify-end pt-1">
        <button onClick={onCancel} className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
        <button onClick={handleSave} disabled={!form.claim_text.trim() || saving}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 disabled:opacity-40 transition-colors">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Save Claim
        </button>
      </div>
    </div>
  );
}

export default function EvidenceClaimManager() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [filterCh, setFilterCh] = useState('');

  const load = async () => {
    const data = await base44.entities.EvidenceClaim.list('-created_date', 200);
    setClaims(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const unsub = base44.entities.EvidenceClaim.subscribe(ev => {
      setClaims(prev => {
        if (ev.type === 'create') return [ev.data, ...prev];
        if (ev.type === 'update') return prev.map(c => c.id === ev.data.id ? ev.data : c);
        if (ev.type === 'delete') return prev.filter(c => c.id !== ev.data.id);
        return prev;
      });
    });
    return unsub;
  }, []);

  const handleStatusChange = async (id, status) => {
    await base44.entities.EvidenceClaim.update(id, { status, reviewed_at: new Date().toISOString() });
  };

  const filtered = claims.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterClass !== 'all' && c.evidence_class !== filterClass) return false;
    if (filterCh && String(c.chapter_number) !== filterCh) return false;
    return true;
  });

  const counts = { pass: 0, needs_review: 0, blocked: 0, authorial_invention: 0 };
  claims.forEach(c => { if (counts[c.status] !== undefined) counts[c.status]++; });

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Shield className="w-4 h-4 text-amber-400" />
          Data Hygiene · Gate 1 · Evidence Registry
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Evidence Claim Manager</h1>
            <p className="text-muted-foreground mt-1 text-sm">E0–E6 evidence registry. Every factual claim needs a class, source, and status.</p>
          </div>
          <button onClick={() => setShowForm(s => !s)}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold hover:bg-amber-500/20 transition-colors">
            <Plus className="w-4 h-4" /> New Claim
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
          <div key={k} className={`rounded-lg border ${cfg.border} ${cfg.bg} p-3 text-center`}>
            <div className={`font-mono font-bold text-xl ${cfg.color}`}>{counts[k]}</div>
            <div className={`text-[10px] font-bold ${cfg.color} mt-0.5`}>{cfg.label}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-6">
          <AddClaimForm onSave={() => { setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Evidence class legend */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Evidence Class Reference (E0–E6)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {EVIDENCE_CLASSES.map(ec => (
            <div key={ec.class} className="flex items-start gap-2">
              <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${EVIDENCE_CLASS_COLORS[ec.class]}`}>{ec.class}</span>
              <div>
                <span className="text-xs font-medium">{ec.name}</span>
                <span className="text-[10px] text-muted-foreground ml-1">— {ec.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', ...Object.keys(STATUS_CONFIG)].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                filterStatus === s ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground hover:text-foreground'
              }`}>
              {s === 'all' ? `All (${claims.length})` : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', ...EVIDENCE_CLASSES.map(e => e.class)].map(ec => (
            <button key={ec} onClick={() => setFilterClass(ec)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                filterClass === ec
                  ? ec === 'all' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : `${EVIDENCE_CLASS_COLORS[ec]} font-bold`
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}>
              {ec}
            </button>
          ))}
        </div>
        <input value={filterCh} onChange={e => setFilterCh(e.target.value)}
          placeholder="Ch.#" type="number" min="1" max="45"
          className="w-16 bg-background/60 border border-border rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
      </div>

      {/* Claims list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-10 text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <div className="text-muted-foreground text-sm">No evidence claims match these filters.</div>
          <button onClick={() => setShowForm(true)} className="mt-4 text-amber-400 text-sm hover:underline">Add the first claim →</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => <ClaimCard key={c.id} claim={c} onStatusChange={handleStatusChange} />)}
        </div>
      )}
    </div>
  );
}