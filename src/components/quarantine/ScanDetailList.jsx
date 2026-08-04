const STATUS_STYLE = {
  scanned: 'text-emerald-400',
  skipped: 'text-muted-foreground',
  too_short: 'text-muted-foreground',
};

const LABEL = {
  scanned: 'read',
  skipped: 'already scanned',
  too_short: 'too short to read',
  export_error: 'could not export from Drive',
  download_error: 'could not download from Drive',
  extract_error: 'could not extract text',
  error: 'failed',
};

const isCreditLimit = (msg) => !!msg && /limit of integrations/i.test(msg);

export default function ScanDetailList({ details = [] }) {
  if (!details.length) return null;
  return (
    <div className="mt-3 space-y-1.5 border-t border-border/60 pt-3">
      {details.map((d, i) => (
        <div key={`${d.file}-${i}`} className="text-xs">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-mono text-foreground">{d.file}</span>
            <span className={STATUS_STYLE[d.status] || 'text-red-400'}>{LABEL[d.status] || d.status}</span>
            {d.opportunities > 0 && (
              <span className="text-amber-400">{d.opportunities} passage{d.opportunities === 1 ? '' : 's'} preserved</span>
            )}
          </div>
          {d.error && (
            <p className="mt-0.5 text-[11px] leading-relaxed text-red-400/80">
              {isCreditLimit(d.error)
                ? 'Workspace Integration credits are exhausted — the reading step cannot run until the plan is upgraded or credits reset. Drive access itself is fine.'
                : d.error}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}