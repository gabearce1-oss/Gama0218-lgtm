import { useState, useEffect } from 'react';
import { DownloadCloud, Loader2, CheckCircle, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DropboxSyncSection() {
  const [status, setStatus] = useState('idle');
  const [label, setLabel] = useState('Ready');
  const [result, setResult] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const fetchLastSync = async () => {
    try {
      const logs = await base44.entities.SyncLog.filter({ source: 'dropbox' }, '-created_date', 1);
      if (logs.length > 0) setLastSync(logs[0]);
    } catch {}
  };

  useEffect(() => { fetchLastSync(); }, []);

  const handleSync = async () => {
    setStatus('loading');
    setLabel('Syncing from Dropbox...');
    try {
      const res = await base44.functions.invoke('dropboxSyncWorkbooks', {});
      setResult(res.data);
      setStatus('success');
      setLabel(`${res.data.chapters_updated} chapters updated`);
      fetchLastSync();
    } catch (err) {
      setStatus('error');
      setLabel('Sync failed');
    }
  };

  const pillClass = status === 'loading' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5'
    : status === 'success' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
    : status === 'error' ? 'border-red-500/30 text-red-400 bg-red-500/5'
    : 'border-border text-muted-foreground';

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <RefreshCw className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-bold">Dropbox — Auto Sync</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Pull the latest workbook data and RF 1.5 scores from Dropbox. Runs automatically daily at 9:00 AM PT.
      </p>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleSync}
          disabled={status === 'loading'}
          className="px-4 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 disabled:opacity-50 inline-flex items-center gap-2"
        >
          <DownloadCloud className="w-4 h-4" />
          {status === 'loading' ? 'Syncing...' : 'Sync Now'}
        </button>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${pillClass}`}>
          {status === 'loading' && <Loader2 className="w-3 h-3 animate-spin" />}
          {status === 'success' && <CheckCircle className="w-3 h-3" />}
          {status === 'error' && <AlertCircle className="w-3 h-3" />}
          {label}
        </span>
      </div>

      {lastSync && (
        <div className="rounded-md border border-border p-3 mb-3">
          <div className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground mb-1">
            <Clock className="w-3 h-3" /> Last Sync
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono">{new Date(lastSync.created_date).toLocaleString()}</span>
            <span className={`text-xs px-2 py-0.5 rounded border ${
              lastSync.status === 'success' ? 'border-emerald-500/30 text-emerald-400'
              : lastSync.status === 'no_files' ? 'border-amber-500/30 text-amber-400'
              : 'border-red-500/30 text-red-400'
            }`}>
              {lastSync.status}
            </span>
          </div>
          {lastSync.file_name && (
            <div className="text-xs text-muted-foreground mt-1">{lastSync.file_name}</div>
          )}
          {lastSync.chapters_updated !== undefined && lastSync.status === 'success' && (
            <div className="text-xs text-muted-foreground">{lastSync.chapters_updated} chapters updated · {lastSync.chapters_skipped} skipped</div>
          )}
          {lastSync.error_message && (
            <div className="text-xs text-red-400 mt-1">{lastSync.error_message}</div>
          )}
        </div>
      )}

      {result && (
        <div className="rounded-md border border-border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">File</span>
            <span className="font-mono text-xs">{result.file}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Modified</span>
            <span className="font-mono text-xs">{new Date(result.modified).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Chapters Updated</span>
            <span className="font-mono text-xs text-emerald-400">{result.chapters_updated}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Chapters Skipped</span>
            <span className="font-mono text-xs text-muted-foreground">{result.chapters_skipped}</span>
          </div>
        </div>
      )}
    </div>
  );
}