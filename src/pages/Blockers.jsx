import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertOctagon, Download, Loader2 } from 'lucide-react';
import BlockerCard from '@/components/BlockerCard';

export default function Blockers() {
  const [blockers, setBlockers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    base44.entities.Blocker.list().then((data) => {
      setBlockers(data);
      setLoading(false);
    });
  }, []);

  // Real-time subscription — P0/P1 changes reflect immediately
  useEffect(() => {
    const unsubscribe = base44.entities.Blocker.subscribe((event) => {
      setBlockers((prev) => {
        if (event.type === 'create') return [...prev, event.data];
        if (event.type === 'update') return prev.map((b) => (b.id === event.data.id ? event.data : b));
        if (event.type === 'delete') return prev.filter((b) => b.id !== event.data.id);
        return prev;
      });
    });
    return unsubscribe;
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await base44.functions.invoke('dropboxSyncBlockers', {});
    } catch (err) {
      console.error('Sync failed:', err);
    }
    setSyncing(false);
  };

  const handleToggle = async (blocker) => {
    const newStatus = blocker.status === 'resolved' ? 'active' : 'resolved';
    await base44.entities.Blocker.update(blocker.id, { status: newStatus });
    setBlockers(blockers.map((b) => (b.id === blocker.id ? { ...b, status: newStatus } : b)));
  };

  const [gateFilter, setGateFilter] = useState('all');
  const filtered = gateFilter === 'all' ? blockers : blockers.filter((b) => b.gate === gateFilter);
  const active = filtered.filter((b) => b.status !== 'resolved');
  const resolved = filtered.filter((b) => b.status === 'resolved');
  const totalPenalty = active.reduce((sum, b) => sum + (b.omega_penalty || 0), 0);

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <AlertOctagon className="w-4 h-4 text-red-400" />
          Editorial Blockers
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blockers Panel</h1>
            <p className="text-muted-foreground mt-1 text-sm">Active issues affecting manuscript Ω scores</p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="shrink-0 px-3 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {syncing ? 'Syncing...' : 'Sync from Dropbox'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-red-400">Active</div>
          <div className="font-mono font-bold text-2xl text-red-400 mt-1">{active.length}</div>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-emerald-400">Resolved</div>
          <div className="font-mono font-bold text-2xl text-emerald-400 mt-1">{resolved.length}</div>
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-amber-400">Ω Penalty</div>
          <div className="font-mono font-bold text-2xl text-amber-400 mt-1">−{totalPenalty.toFixed(1)}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-xs text-muted-foreground">Filter by Gate:</span>
        {['all', 'governance', 'data_hygiene', 'chicano_lens', 'prose'].map(g => (
          <button
            key={g}
            onClick={() => setGateFilter(g)}
            className={`px-3 py-1 rounded-md text-xs font-mono border transition-colors ${
              gateFilter === g
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {g === 'all' ? 'All' : g.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((blocker) => (
            <BlockerCard key={blocker.id} blocker={blocker} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}