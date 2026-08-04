import { Cloud, FolderUp, Database, FileSpreadsheet, CheckCircle, Loader2, ExternalLink, AlertCircle, ScanSearch } from 'lucide-react';
import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import DropboxSyncSection from '@/components/DropboxSyncSection';
import GoogleDriveSyncSection from '@/components/GoogleDriveSyncSection';
import AutoSyncSettings from '@/components/AutoSyncSettings';

function SectionCard({ title, icon: Icon, description, children }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {children}
    </div>
  );
}

function StatusPill({ status, label }) {
  const config = {
    idle: 'border-border text-muted-foreground',
    loading: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
    success: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
    error: 'border-red-500/30 text-red-400 bg-red-500/5',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${config[status]}`}>
      {status === 'loading' && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === 'success' && <CheckCircle className="w-3 h-3" />}
      {status === 'error' && <AlertCircle className="w-3 h-3" />}
      {label}
    </span>
  );
}

function DropboxSection() {
  const [status, setStatus] = useState('idle');
  const [label, setLabel] = useState('Ready');
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    setStatus('loading');
    setLabel('Uploading template...');
    try {
      const res = await base44.functions.invoke('dropboxUploadTemplate', {});
      setResult(res.data);
      setStatus('success');
      setLabel(`${res.data.chapter_count} chapters uploaded`);
    } catch (err) {
      setStatus('error');
      setLabel('Upload failed');
    }
  };

  return (
    <SectionCard
      title="Dropbox — Workbook Templates"
      icon={FolderUp}
      description="Upload the manuscript scoring workbook template to Dropbox for team access."
    >
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleUpload}
          disabled={status === 'loading'}
          className="px-4 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 disabled:opacity-50 inline-flex items-center gap-2"
        >
          <FolderUp className="w-4 h-4" />
          {status === 'loading' ? 'Uploading...' : 'Upload Template'}
        </button>
        <StatusPill status={status} label={label} />
      </div>
      {result && (
        <div className="rounded-md border border-border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">File Path</span>
            <span className="font-mono text-xs">{result.path}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Size</span>
            <span className="font-mono text-xs">{(result.size / 1024).toFixed(1)} KB</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Chapters</span>
            <span className="font-mono text-xs">{result.chapter_count}</span>
          </div>
          {result.share_url && (
            <a
              href={result.share_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline mt-2"
            >
              <ExternalLink className="w-3 h-3" /> Open shared link
            </a>
          )}
        </div>
      )}
    </SectionCard>
  );
}

function SupabaseSection() {
  const [status, setStatus] = useState('idle');
  const [label, setLabel] = useState('Not fetched');
  const [data, setData] = useState(null);

  const handleFetch = async () => {
    setStatus('loading');
    setLabel('Fetching projects...');
    try {
      const res = await base44.functions.invoke('supabaseProjectStatus', {});
      setData(res.data);
      setStatus('success');
      setLabel(`${res.data.total} project(s) found`);
    } catch (err) {
      setStatus('error');
      setLabel('Fetch failed');
    }
  };

  return (
    <SectionCard
      title="Supabase — Project Status"
      icon={Database}
      description="Retrieve project configuration and status details from your Supabase workspace."
    >
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleFetch}
          disabled={status === 'loading'}
          className="px-4 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 disabled:opacity-50 inline-flex items-center gap-2"
        >
          <Database className="w-4 h-4" />
          {status === 'loading' ? 'Fetching...' : 'Retrieve Projects'}
        </button>
        <StatusPill status={status} label={label} />
      </div>
      {data && data.projects && data.projects.length > 0 && (
        <div className="space-y-2">
          {data.projects.map((p) => (
            <div key={p.id} className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{p.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded border ${
                  p.status === 'ACTIVE'
                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                    : 'border-border text-muted-foreground'
                }`}>
                  {p.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground font-mono mt-1">
                ref: {p.ref} · region: {p.region}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Created: {new Date(p.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function GoogleDriveSection() {
  const [status, setStatus] = useState('idle');
  const [label, setLabel] = useState('Not synced');
  const [data, setData] = useState(null);

  const handleSync = async () => {
    setStatus('loading');
    setLabel('Syncing workbooks...');
    try {
      const res = await base44.functions.invoke('googledriveSyncWorkbooks', {});
      setData(res.data);
      setStatus('success');
      setLabel(`${res.data.total} workbook(s) found`);
    } catch (err) {
      setStatus('error');
      setLabel('Sync failed');
    }
  };

  return (
    <SectionCard
      title="Google Drive — Workbook Sync"
      icon={FileSpreadsheet}
      description="Sync project workbook data from Google Drive for metric analysis."
    >
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleSync}
          disabled={status === 'loading'}
          className="px-4 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 disabled:opacity-50 inline-flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          {status === 'loading' ? 'Syncing...' : 'Sync Workbooks'}
        </button>
        <StatusPill status={status} label={label} />
      </div>
      {data && data.files && data.files.length > 0 && (
        <div className="space-y-2">
          {data.files.map((f) => (
            <a
              key={f.id}
              href={f.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md border border-border p-3 hover:bg-muted/30 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{f.name}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {f.type} · {f.size ? `${(f.size / 1024).toFixed(0)} KB` : '—'} · {new Date(f.modified).toLocaleDateString()}
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
            </a>
          ))}
        </div>
      )}
      {data && data.files && data.files.length === 0 && (
        <div className="rounded-md border border-border p-4 text-center text-sm text-muted-foreground">
          No workbook files found. Upload Ramos, OMEGA, SPSS, audit, or workbook files to Google Drive.
        </div>
      )}
    </SectionCard>
  );
}

function DriveProseScanSection() {
  const [status, setStatus] = useState('idle');
  const [label, setLabel] = useState('Ready');
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    setStatus('loading');
    setLabel('Scanning Drive...');
    try {
      const res = await base44.functions.invoke('scanDriveForProse', { force: false, maxFiles: 20 });
      setResult(res.data);
      setStatus('success');
      setLabel(`${res.data.opportunities} opportunities found`);
    } catch (err) {
      setStatus('error');
      setLabel('Scan failed');
    }
  };

  return (
    <SectionCard
      title="Google Drive — Prose Quarantine Scanner"
      icon={ScanSearch}
      description="Automatically scans Drive for manuscript files, evaluates prose against the voice profile, and flags improvement opportunities in the Quarantine zone. Runs daily at 6 AM and in real-time when files change."
    >
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleScan}
          disabled={status === 'loading'}
          className="px-4 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 disabled:opacity-50 inline-flex items-center gap-2"
        >
          <ScanSearch className="w-4 h-4" />
          {status === 'loading' ? 'Scanning...' : 'Scan Drive Now'}
        </button>
        <StatusPill status={status} label={label} />
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="inline-flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-emerald-400" /> Daily 6 AM scan
        </span>
        <span className="inline-flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-emerald-400" /> Real-time webhook
        </span>
      </div>
      {result && (
        <div className="rounded-md border border-border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Files Scanned</span>
            <span className="font-mono text-xs text-amber-400">{result.scanned}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Files Skipped</span>
            <span className="font-mono text-xs">{result.skipped}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Opportunities Found</span>
            <span className="font-mono text-xs text-emerald-400 font-bold">{result.opportunities}</span>
          </div>
          {result.errors > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Errors</span>
              <span className="font-mono text-xs text-red-400">{result.errors}</span>
            </div>
          )}
          {result.details && result.details.length > 0 && (
            <div className="pt-2 border-t border-border/50 space-y-1">
              {result.details.map((d, i) => (
                <div key={i} className="text-[10px] text-muted-foreground font-mono flex items-center justify-between">
                  <span className="truncate">{d.file}</span>
                  <span className={d.status === 'scanned' ? 'text-emerald-400' : d.status === 'skipped' ? 'text-muted-foreground' : 'text-red-400'}>
                    {d.status}{d.opportunities != null ? ` (${d.opportunities})` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}

export default function CloudIntegrations() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Cloud className="w-4 h-4 text-amber-400" />
          Connected Services
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Cloud Integrations</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage workbook templates and sync data across Dropbox, Supabase, and Google Drive</p>
      </div>

      <div className="space-y-6">
        <AutoSyncSettings />
        <DriveProseScanSection />
        <DropboxSyncSection />
        <GoogleDriveSyncSection />
        <SupabaseSection />
      </div>
    </div>
  );
}