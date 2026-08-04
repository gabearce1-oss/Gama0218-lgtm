import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { SEVERITY_STYLES, STATE_STYLES, OPEN_STATES } from '@/lib/failsafe';

export default function FailsafeEventRow({ event, onChanged }) {
  const [reviewer, setReviewer] = useState(event.human_reviewer || '');
  const [busy, setBusy] = useState(false);
  const isOpen = OPEN_STATES.includes(event.trigger_state);

  const update = async (patch) => {
    setBusy(true);
    await base44.entities.FailsafeEvent.update(event.id, patch);
    setBusy(false);
    onChanged?.();
  };

  return (
    <div className="rounded-md border border-border bg-background/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-primary">{event.tripwire_id || '—'}</span>
        <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${SEVERITY_STYLES[event.severity] || SEVERITY_STYLES.Low}`}>
          {event.severity}
        </span>
        <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${STATE_STYLES[event.trigger_state] || STATE_STYLES.Armed}`}>
          {event.trigger_state}
        </span>
        {event.halts_pipeline && isOpen && (
          <span className="rounded border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 font-mono text-[10px] text-red-300">
            pipeline halted
          </span>
        )}
      </div>

      <p className="mt-2 text-sm font-semibold">{event.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{event.category}</p>

      <dl className="mt-3 grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2">
        {[
          ['Detected by', event.detected_by],
          ['Source', event.detection_source],
          ['Affected', event.affected_systems],
          ['Evidence', event.evidence],
          ['Containment', event.containment_action],
        ]
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt className="uppercase tracking-wider text-muted-foreground">{k}</dt>
              <dd className="text-foreground">{v}</dd>
            </div>
          ))}
      </dl>

      {isOpen ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            value={reviewer}
            onChange={(e) => setReviewer(e.target.value)}
            placeholder="Reviewer name to clear"
            className="min-h-11 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm sm:max-w-xs"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => update({ trigger_state: 'Contained', human_reviewer: reviewer, containment_action: event.containment_action })}
            className="min-h-11 rounded-md border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-300 disabled:opacity-40"
          >
            Mark contained
          </button>
          <button
            type="button"
            disabled={busy || !reviewer.trim()}
            onClick={() => update({ trigger_state: 'Cleared', human_reviewer: reviewer, signed_off: true, cleared_at: new Date().toISOString() })}
            className="min-h-11 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300 disabled:opacity-40"
          >
            Clear with sign-off
          </button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-emerald-300">
          Cleared by {event.human_reviewer || 'unnamed reviewer'}
          {event.cleared_at ? ` · ${new Date(event.cleared_at).toLocaleString()}` : ''}
        </p>
      )}
    </div>
  );
}