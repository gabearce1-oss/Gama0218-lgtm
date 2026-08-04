import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, Scan, Loader2, Filter, CheckCheck, AlertTriangle } from 'lucide-react';
import QuarantineCard from '@/components/QuarantineCard';
import RestorationCooker from '@/components/RestorationCooker';
import ScanDetailList from '@/components/quarantine/ScanDetailList';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'quarantined', label: 'Quarantined' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'merged', label: 'Merged' },
];

export default function Quarantine() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [filter, setFilter] = useState('quarantined');
  const [bulkApproving, setBulkApproving] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [confirmBulk, setConfirmBulk] = useState(false);

  useEffect(() => {
    fetchData();
    const unsubscribe = base44.entities.Quarantine.subscribe((event) => {
      if (event.type === 'create') setItems((prev) => [event.data, ...prev]);
      if (event.type === 'update') setItems((prev) => prev.map((i) => (i.id === event.data.id ? event.data : i)));
      if (event.type === 'delete') setItems((prev) => prev.filter((i) => i.id !== event.data.id));
    });
    return unsubscribe;
  }, []);

  const fetchData = async () => {
    try {
      const data = await base44.entities.Quarantine.list('-created_date', 200);
      setItems(data);
    } catch (err) {
      console.error('Failed to load quarantine:', err);
    }
    setLoading(false);
  };

  const handleScan = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await base44.functions.invoke('scanDriveForProse', { force: false });
      setScanResult(res.data);
      fetchData();
    } catch (err) {
      setScanResult({ error: err.message });
    }
    setScanning(false);
  };

  const handleStatusChange = async (item, newStatus) => {
    await base44.entities.Quarantine.update(item.id, { status: newStatus });
    setItems(items.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i)));
  };

  const handleBulkApprove = async () => {
    setBulkApproving(true);
    setBulkResult(null);
    try {
      const res = await base44.functions.invoke('bulkApproveQuarantine', {});
      setBulkResult({ success: true, approved: res.data?.approved || 0, total: res.data?.total || 0 });
      setConfirmBulk(false);
      fetchData();
    } catch (err) {
      setBulkResult({ error: err.message });
      setConfirmBulk(false);
    }
    setBulkApproving(false);
  };

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter);
  const quarantinedCount = items.filter((i) => i.status === 'quarantined').length;
  const approvedCount = items.filter((i) => i.status === 'approved').length;
  const rejectedCount = items.filter((i) => i.status === 'rejected').length;
  const mergedCount = items.filter((i) => i.status === 'merged').length;
  const avgMatch = items.length > 0
    ? items.filter((i) => i.match_score != null).reduce((s, i) => s + i.match_score, 0) / Math.max(items.filter((i) => i.match_score != null).length, 1)
    : 0;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Shield className="w-4 h-4 text-amber-400" />
          Preservation · Restoration
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Restoration Cookbook</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Preserved manuscript candidates from the restoration archive, organized for human review before any adaptation or score decision.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { if (quarantinedCount > 0) setConfirmBulk(true); }}
              disabled={bulkApproving || quarantinedCount === 0}
              className="px-4 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {bulkApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
              {bulkApproving ? 'Approving...' : `Approve All (${quarantinedCount})`}
            </button>
            <button
              onClick={handleScan}
              disabled={scanning}
              className="px-4 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
              {scanning ? 'Scanning Drive...' : 'Scan Drive'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-amber-400">Quarantined</div>
          <div className="font-mono font-bold text-2xl text-amber-400 mt-1">{quarantinedCount}</div>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-emerald-400">Approved</div>
          <div className="font-mono font-bold text-2xl text-emerald-400 mt-1">{approvedCount}</div>
        </div>
        <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-violet-400">Merged</div>
          <div className="font-mono font-bold text-2xl text-violet-400 mt-1">{mergedCount}</div>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-red-400">Rejected</div>
          <div className="font-mono font-bold text-2xl text-red-400 mt-1">{rejectedCount}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Avg Match</div>
          <div className="font-mono font-bold text-2xl text-cyan-400 mt-1">{avgMatch > 0 ? avgMatch.toFixed(0) : '—'}</div>
        </div>
      </div>

      {/* Restoration Kitchen (Beta) */}
      <RestorationCooker approvedCount={approvedCount} />

      {/* Bulk Approve Confirmation */}
      {confirmBulk && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-400">Approve all {quarantinedCount} quarantined passages?</p>
              <p className="text-xs text-muted-foreground mt-1">
                This moves every pending passage into restoration staging for individual editorial review. It does not alter the manuscript or chapter scores.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleBulkApprove}
                  disabled={bulkApproving}
                  className="px-4 py-1.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {bulkApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                  Yes, Approve All
                </button>
                <button
                  onClick={() => setConfirmBulk(false)}
                  className="px-4 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Result */}
      {bulkResult && (
        <div className={`rounded-lg border p-4 mb-6 ${bulkResult.error ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
          {bulkResult.error ? (
            <p className="text-sm text-red-400">Bulk approve failed: {bulkResult.error}</p>
          ) : (
            <p className="text-sm text-emerald-400 font-medium">
              ✓ Approved {bulkResult.approved} of {bulkResult.total} passages. All repairs applied to the manuscript.
            </p>
          )}
        </div>
      )}

      {/* Scan Result */}
      {scanResult && (
        <div className={`rounded-lg border p-4 mb-6 ${scanResult.error ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
          {scanResult.error ? (
            <p className="text-sm text-red-400">Scan failed: {scanResult.error}</p>
          ) : (
            <div className="text-sm">
              <span className="font-bold text-emerald-400">Scan complete:</span>{' '}
              <span className="text-foreground">{scanResult.scanned} files scanned</span>
              {scanResult.skipped > 0 && <span className="text-muted-foreground"> · {scanResult.skipped} already scanned</span>}
              <span className="text-amber-400 font-semibold"> · {scanResult.opportunities} opportunities quarantined</span>
              {scanResult.errors > 0 && <span className="text-red-400"> · {scanResult.errors} errors</span>}
              <ScanDetailList details={scanResult.details} />
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
              filter === f.key
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {items.length === 0
              ? 'Quarantine is empty. Click "Scan Drive" to search your Google Drive for prose opportunities.'
              : `No ${filter} items.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <QuarantineCard key={item.id} item={item} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}