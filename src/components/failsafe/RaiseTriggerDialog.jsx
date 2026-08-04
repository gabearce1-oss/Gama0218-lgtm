import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { TRIPWIRES } from '@/lib/failsafe';

const EMPTY = {
  tripwire_id: TRIPWIRES[0].id,
  title: '',
  severity: 'High',
  detected_by: '',
  detection_source: '',
  affected_systems: '',
  evidence: '',
  halts_pipeline: true,
};

export default function RaiseTriggerDialog({ onRaised }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setSaving(true);
    const wire = TRIPWIRES.find((t) => t.id === form.tripwire_id);
    await base44.entities.FailsafeEvent.create({
      ...form,
      event_id: `FS-${Date.now()}`,
      category: wire.category,
      trigger_state: 'Tripped',
      detected_at: new Date().toISOString(),
      containment_action: wire.onTrip,
    });
    setSaving(false);
    setForm(EMPTY);
    setOpen(false);
    onRaised?.();
  };

  const field = 'mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm';

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20"
      >
        <AlertTriangle className="h-4 w-4" /> Raise failsafe trigger
      </button>
    );
  }

  return (
    <section className="rounded-lg border border-red-500/40 bg-red-500/5 p-5">
      <h2 className="font-bold text-red-300">Raise failsafe trigger</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          Tripwire
          <select className={field} value={form.tripwire_id} onChange={(e) => set('tripwire_id', e.target.value)}>
            {TRIPWIRES.map((t) => (
              <option key={t.id} value={t.id}>{t.id} — {t.name}</option>
            ))}
          </select>
        </label>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          Severity
          <select className={field} value={form.severity} onChange={(e) => set('severity', e.target.value)}>
            {['Critical', 'High', 'Medium', 'Low'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-xs uppercase tracking-wider text-muted-foreground sm:col-span-2">
          What happened
          <input className={field} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Short factual statement" />
        </label>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          Detected by
          <input className={field} value={form.detected_by} onChange={(e) => set('detected_by', e.target.value)} placeholder="Person" />
        </label>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          Detection source
          <input className={field} value={form.detection_source} onChange={(e) => set('detection_source', e.target.value)} placeholder="Google alert, sync log, manual review…" />
        </label>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          Affected systems
          <input className={field} value={form.affected_systems} onChange={(e) => set('affected_systems', e.target.value)} />
        </label>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">
          Evidence
          <input className={field} value={form.evidence} onChange={(e) => set('evidence', e.target.value)} placeholder="Reference, hash, log line" />
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
          <input type="checkbox" checked={form.halts_pipeline} onChange={(e) => set('halts_pipeline', e.target.checked)} />
          Halt the pipeline while this trigger is open
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!form.title.trim() || saving}
          onClick={submit}
          className="inline-flex min-h-11 items-center rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 disabled:opacity-40"
        >
          {saving ? 'Recording…' : 'Trip it'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </section>
  );
}