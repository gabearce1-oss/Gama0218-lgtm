import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Vault, ShieldAlert, Plus, Loader2, Filter, ChevronDown, ChevronUp, Lock, CheckCircle2, Upload } from 'lucide-react';

const RISK_COLORS = {
  Low: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
  Medium: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
  High: 'border-orange-500/30 text-orange-400 bg-orange-500/5',
  Critical: 'border-red-500/30 text-red-400 bg-red-500/5',
};

const REVIEW_COLORS = {
  'Not Started': 'border-muted text-muted-foreground bg-muted/5',
  'In Review': 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5',
  'Needs Evidence': 'border-amber-500/30 text-amber-400 bg-amber-500/5',
  'Needs Revision': 'border-orange-500/30 text-orange-400 bg-orange-500/5',
  'Approved for Staging': 'border-violet-500/30 text-violet-400 bg-violet-500/5',
  'Rejected': 'border-red-500/30 text-red-400 bg-red-500/5',
  'Archived': 'border-muted text-muted-foreground bg-muted/5',
};

const RELEASE_COLORS = {
  'Remain Quarantined': 'border-red-500/30 text-red-400 bg-red-500/5',
  'Move to Staging': 'border-amber-500/30 text-amber-400 bg-amber-500/5',
  'Move to Canonical': 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
  'Reject': 'border-red-500/30 text-red-400 bg-red-500/5',
  'Archive Only': 'border-muted text-muted-foreground bg-muted/5',
};

const CANONICAL_LANES = [
  { lane: 'Canonical', color: 'emerald', items: 'Ramos voice, verified source material, approved manuscript logic' },
  { lane: 'Staging', color: 'amber', items: 'Tested formulas, draft prompts, schema changes' },
  { lane: 'Quarantine', color: 'red', items: 'Experimental material, unverified formulas, risky claims' },
];

const REVIEW_STATUS_OPTIONS = ['Not Started', 'In Review', 'Needs Evidence', 'Needs Revision', 'Approved for Staging', 'Rejected', 'Archived'];
const RELEASE_DECISION_OPTIONS = ['Remain Quarantined', 'Move to Staging', 'Move to Canonical', 'Reject', 'Archive Only'];

export default function QuarantineLog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    fetchData();
    const unsubscribe = base44.entities.QuarantineLog.subscribe((event) => {
      if (event.type === 'create') setItems((prev) => [event.data, ...prev]);
      if (event.type === 'update') setItems((prev) => prev.map((i) => (i.id === event.data.id ? event.data : i)));
      if (event.type === 'delete') setItems((prev) => prev.filter((i) => i.id !== event.data.id));
    });
    return unsubscribe;
  }, []);

  const fetchData = async () => {
    try {
      const data = await base44.entities.QuarantineLog.list('-date_added', 200);
      setItems(data);
    } catch (err) {
      console.error('Failed to load quarantine log:', err);
    }
    setLoading(false);
  };

  const handleSyncToSheets = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await base44.functions.invoke('syncQuarantineLogToSheets', {});
      setSyncResult(res.data);
    } catch (err) {
      setSyncResult({ error: err.message });
    }
    setSyncing(false);
  };

  const handleUpdate = async (item, field, value) => {
    setUpdating(item.id);
    const patch = { [field]: value };
    if (field === 'release_decision' && (value === 'Move to Staging' || value === 'Move to Canonical')) {
      patch.release_date = new Date().toISOString();
    }
    await base44.entities.QuarantineLog.update(item.id, patch);
    setItems(items.map((i) => (i.id === item.id ? { ...i, ...patch } : i)));
    setUpdating(null);
  };

  const filtered = filter === 'all' ? items : items.filter((i) => i.risk_level === filter);
  const highRisk = items.filter((i) => i.risk_level === 'High' || i.risk_level === 'Critical').length;
  const inReview = items.filter((i) => i.review_status === 'In Review').length;
  const quarantined = items.filter((i) => i.release_decision === 'Remain Quarantined').length;
  const staged = items.filter((i) => i.release_decision === 'Move to Staging').length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Vault className="w-4 h-4 text-red-400" />
          Quarantine Protocol · Evidence Locker
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quarantine Log</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Quarantined formulas, prompts, and scoring rules — held for validation before they can touch canonical systems.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSyncToSheets}
              disabled={syncing}
              className="px-3 py-2 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {syncing ? 'Syncing...' : 'Sync to Sheet'}
            </button>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="px-4 py-2 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Log Item
            </button>
          </div>
        </div>
      </div>

      {syncResult && (
        <div className={`rounded-lg border p-3 mb-6 ${syncResult.error ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
          {syncResult.error ? (
            <p className="text-sm text-red-400">Sync failed: {syncResult.error}</p>
          ) : (
            <p className="text-sm text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Synced {syncResult.rows_written} records to "{syncResult.sheet}" ({syncResult.updated_cells} cells updated)
            </p>
          )}
        </div>
      )}

      {/* Canonical Hierarchy */}
      <div className="rounded-lg border border-border bg-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider">Canonical Hierarchy</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CANONICAL_LANES.map((lane, idx) => (
            <div key={lane.lane} className={`rounded-md border p-3 ${
              lane.color === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/5' :
              lane.color === 'amber' ? 'border-amber-500/30 bg-amber-500/5' :
              'border-red-500/30 bg-red-500/5'
            }`}>
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                lane.color === 'emerald' ? 'text-emerald-400' :
                lane.color === 'amber' ? 'text-amber-400' : 'text-red-400'
              }`}>Lane {idx + 1}</div>
              <div className="text-sm font-bold">{lane.lane}</div>
              <div className="text-xs text-muted-foreground mt-1">{lane.items}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          Good systems don't just collect data; they keep bad data from becoming policy.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-red-400">Quarantined</div>
          <div className="font-mono font-bold text-2xl text-red-400 mt-1">{quarantined}</div>
        </div>
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-orange-400">High / Critical</div>
          <div className="font-mono font-bold text-2xl text-orange-400 mt-1">{highRisk}</div>
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-cyan-400">In Review</div>
          <div className="font-mono font-bold text-2xl text-cyan-400 mt-1">{inReview}</div>
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-amber-400">Staged</div>
          <div className="font-mono font-bold text-2xl text-amber-400 mt-1">{staged}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        {['all', 'Low', 'Medium', 'High', 'Critical'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
              filter === f
                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Items */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-red-400 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <ShieldAlert className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No quarantined items{filter !== 'all' ? ` at ${filter} risk` : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <QuarantineLogEntry
              key={item.id}
              item={item}
              expanded={expanded === item.id}
              onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
              onUpdate={handleUpdate}
              updating={updating === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuarantineLogEntry({ item, expanded, onToggle, onUpdate, updating }) {
  return (
    <div className={`rounded-lg border bg-card overflow-hidden ${
      item.release_decision === 'Remain Quarantined' ? 'border-red-500/20' :
      item.release_decision === 'Move to Staging' ? 'border-amber-500/20' :
      item.release_decision === 'Move to Canonical' ? 'border-emerald-500/20' :
      'border-border'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-red-400">{item.quarantine_id}</span>
            <span className="text-sm font-bold truncate">{item.item_name}</span>
          </div>
          <div className="text-xs text-muted-foreground truncate">{item.item_type} · {item.source_location}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${RISK_COLORS[item.risk_level] || ''}`}>
            {item.risk_level}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${REVIEW_COLORS[item.review_status] || ''}`}>
            {item.review_status}
          </span>
          {item.release_decision !== 'Remain Quarantined' && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${RELEASE_COLORS[item.release_decision] || ''}`}>
              {item.release_decision}
            </span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Reason for Quarantine</div>
              <p className="text-foreground">{item.reason_for_quarantine}</p>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Affected Systems</div>
              <p className="text-foreground">{item.affected_systems}</p>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Validation Required</div>
              <p className="text-foreground">{item.validation_required}</p>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Submitted By / Date</div>
              <p className="text-foreground">{item.submitted_by} · {item.date_added ? new Date(item.date_added).toLocaleDateString() : '—'}</p>
            </div>
          </div>

          {item.notes && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Notes</div>
              <p className="text-xs text-muted-foreground">{item.notes}</p>
            </div>
          )}

          {/* Validation Checklist */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">3-Part Validation Gate</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {['Provenance Review', 'Logic Review', 'Impact Review'].map((review) => (
                <div key={review} className="rounded-md border border-border bg-background/50 p-2">
                  <div className="text-xs font-bold text-amber-400">{review}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {review === 'Provenance Review' && 'Who created it? When? What source supports it?'}
                    {review === 'Logic Review' && 'Stable outputs? Conflicts with LITCENTRAL/TE360?'}
                    {review === 'Impact Review' && 'What systems change? Voice? Certification?'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Review Status</div>
              <select
                value={item.review_status || ''}
                onChange={(e) => onUpdate(item, 'review_status', e.target.value)}
                disabled={updating}
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-amber-500/50"
              >
                {REVIEW_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Release Decision</div>
              <select
                value={item.release_decision || ''}
                onChange={(e) => onUpdate(item, 'release_decision', e.target.value)}
                disabled={updating}
                className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-amber-500/50"
              >
                {RELEASE_DECISION_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {item.release_date && (
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Released: {new Date(item.release_date).toLocaleString()}
            </div>
          )}

          {updating && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Updating...
            </div>
          )}
        </div>
      )}
    </div>
  );
}