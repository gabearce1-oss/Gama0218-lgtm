import { FileBarChart } from 'lucide-react';

const RISK_COLORS = {
  Floor: 'text-red-400',
  Watch: 'text-amber-400',
  Stable: 'text-emerald-400',
};

const TRIAGE_COLORS = {
  PROTECT: 'text-emerald-400',
  RESTORE: 'text-amber-400',
  REBUILD: 'text-red-400',
};

function Field({ label, value, accent }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="rounded-md border border-border p-3">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`font-mono font-bold ${accent || ''}`}>{value}</div>
    </div>
  );
}

export default function AuditDataSection({ chapter }) {
  const hasData = chapter.omega_audit || chapter.omega_est || chapter.triage || chapter.risk;
  if (!hasData) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileBarChart className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-bold">Audit & Workbook Data</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Audit Ω (Verified)" value={chapter.omega_audit?.toFixed(1)} accent="text-amber-400" />
        <Field label="Risk Level" value={chapter.risk} accent={RISK_COLORS[chapter.risk] || ''} />
        <Field label="SPSS Ω Est" value={chapter.omega_est?.toFixed(1)} accent="text-teal-400" />
        <Field label="Triage" value={chapter.triage} accent={TRIAGE_COLORS[chapter.triage] || ''} />
        <Field label="CLS Est" value={chapter.cls_est?.toFixed(1)} />
        <Field label="BIS Est" value={chapter.bis_est?.toFixed(1)} />
        <Field label="SII Est" value={chapter.sii_est?.toFixed(1)} />
        <Field label="MRF Est" value={chapter.mrf_est?.toFixed(1)} />
        <Field label="CS% Density" value={chapter.cs_pct?.toFixed(2)} />
        <Field label="Spanish Tokens" value={chapter.spanish_tokens} />
        <Field label="Sensory (of 6)" value={chapter.sensory_present ? `${chapter.sensory_present}/6` : undefined} />
        <Field label="Sensory Total" value={chapter.sensory_total} />
      </div>
      {chapter.priority_action && (
        <div className="mt-4 rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Priority Action</div>
          <p className="text-sm">{chapter.priority_action}</p>
        </div>
      )}
      {chapter.restoration_notes && (
        <div className="mt-2 text-sm text-muted-foreground">
          <span className="text-xs uppercase tracking-wider">Restoration Notes: </span>
          {chapter.restoration_notes}
        </div>
      )}
    </div>
  );
}