import { Radar, Loader2 } from 'lucide-react';

const STAT_FIELDS = [
  ['files_seen', 'Files seen'],
  ['files_scanned', 'Scanned'],
  ['files_skipped', 'Skipped'],
  ['hits_created', 'Hits'],
  ['words_scanned', 'Words'],
];

export default function ScanRunPanel({ run, running, error, onRun }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Radar className="h-4 w-4" /> Crawler
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Reads the most recently modified text documents in the connected Drive and records every locator hit.
          </p>
        </div>
        <button
          type="button"
          onClick={onRun}
          disabled={running}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
          {running ? 'Scanning…' : 'Run scan'}
        </button>
      </div>

      {error && <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

      {run && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-primary">{run.run_id}</span>
            <span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
              {run.status}
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {STAT_FIELDS.map(([key, label]) => (
              <div key={key} className="rounded-md border border-border bg-background/40 p-3">
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
                <dd className="mt-1 font-mono text-lg font-bold">{(run[key] || 0).toLocaleString()}</dd>
              </div>
            ))}
          </dl>
          {run.error_message && <p className="mt-3 text-xs text-red-300">{run.error_message}</p>}
        </div>
      )}
    </section>
  );
}