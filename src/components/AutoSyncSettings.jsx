import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { RefreshCw, ToggleLeft, ToggleRight, Loader2, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  success: { icon: CheckCircle, color: 'text-emerald-400', label: 'Success' },
  error: { icon: AlertCircle, color: 'text-red-400', label: 'Error' },
  disabled: { icon: XCircle, color: 'text-muted-foreground', label: 'Disabled' },
  never: { icon: Clock, color: 'text-muted-foreground', label: 'Never run' },
};

function formatRelative(isoString) {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDay}d ago`;
}

function SyncRow({ setting, onToggle, onSyncNow, syncing, toggling }) {
  const StatusIcon = STATUS_CONFIG[setting.last_sync_status]?.icon || Clock;
  const statusColor = STATUS_CONFIG[setting.last_sync_status]?.color || 'text-muted-foreground';

  return (
    <div className="flex items-start gap-4 px-5 py-4 border-b border-border last:border-b-0">
      {/* Toggle */}
      <button
        onClick={() => onToggle(setting.setting_key, !setting.enabled)}
        disabled={toggling === setting.setting_key}
        className="shrink-0 mt-0.5"
      >
        {toggling === setting.setting_key ? (
          <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
        ) : setting.enabled ? (
          <ToggleRight className="w-7 h-7 text-emerald-400" />
        ) : (
          <ToggleLeft className="w-7 h-7 text-muted-foreground" />
        )}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">{setting.label}</span>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
            setting.enabled
              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
              : 'border-border text-muted-foreground'
          }`}>
            {setting.enabled ? 'Auto' : 'Off'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{setting.description}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className={`inline-flex items-center gap-1 text-[10px] ${statusColor}`}>
            <StatusIcon className="w-3 h-3" />
            {setting.last_sync_status === 'never' ? 'Never synced' : `Last: ${formatRelative(setting.last_synced)}`}
          </span>
          {setting.last_sync_summary && setting.last_sync_status !== 'never' && (
            <span className="text-[10px] text-muted-foreground font-mono truncate">{setting.last_sync_summary}</span>
          )}
        </div>
      </div>

      {/* Sync Now */}
      <button
        onClick={() => onSyncNow(setting)}
        disabled={syncing === setting.setting_key || !setting.enabled}
        className="shrink-0 px-3 py-1.5 rounded-md border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
      >
        {syncing === setting.setting_key ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <RefreshCw className="w-3.5 h-3.5" />
        )}
        Sync Now
      </button>
    </div>
  );
}

export default function AutoSyncSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [syncing, setSyncing] = useState(null);
  const [error, setError] = useState(null);

  const loadSettings = useCallback(async () => {
    try {
      const res = await base44.functions.invoke('manageSyncSettings', {});
      setSettings(res.data.settings || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleToggle = async (settingKey, enabled) => {
    setToggling(settingKey);
    try {
      await base44.functions.invoke('manageSyncSettings', { setting_key: settingKey, enabled });
      setSettings(prev => prev.map(s => s.setting_key === settingKey ? { ...s, enabled } : s));
    } catch (err) {
      setError(err.message);
    }
    setToggling(null);
  };

  const handleSyncNow = async (setting) => {
    setSyncing(setting.setting_key);
    try {
      const res = await base44.functions.invoke(setting.function_name, { force: true });
      // Refresh settings to get updated last_synced
      setTimeout(() => loadSettings(), 500);
    } catch (err) {
      setError(`${setting.label} sync failed: ${err.message}`);
    }
    setSyncing(null);
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> Loading sync settings…
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-1.5">
            <RefreshCw className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Auto-Sync Settings</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Toggle automatic synchronization with Google Sheets. When enabled, each data type syncs on a daily schedule. Use "Sync Now" to trigger a manual sync at any time.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-5 py-3 bg-red-500/5 border-b border-red-500/20">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <div>
        {settings.map(setting => (
          <SyncRow
            key={setting.setting_key}
            setting={setting}
            onToggle={handleToggle}
            onSyncNow={handleSyncNow}
            syncing={syncing}
            toggling={toggling}
          />
        ))}
      </div>

      <div className="px-5 py-3 bg-muted/20 border-t border-border">
        <p className="text-[10px] text-muted-foreground">
          Toggling a sync off pauses its scheduled automation — your data stays in place, just stops auto-updating. Manual "Sync Now" always works regardless of toggle state.
        </p>
      </div>
    </div>
  );
}