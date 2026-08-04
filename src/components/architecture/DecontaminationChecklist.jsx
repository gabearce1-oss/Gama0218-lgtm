import { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { decontaminationSteps } from '@/lib/decontaminationSteps';

export default function DecontaminationChecklist({ chapters, onFinalized }) {
  const [chapterId, setChapterId] = useState('');
  const [checked, setChecked] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const allConfirmed = decontaminationSteps.every(([key]) => checked[key]);
  const canFinalize = Boolean(chapterId) && allConfirmed && !saving;

  const selectChapter = (id) => { setChapterId(id); setChecked({}); setDone(false); };

  const finalize = async () => {
    setSaving(true);
    await base44.entities.Chapter.update(chapterId, { status: 'scored' });
    setSaving(false);
    setDone(true);
    setChecked({});
    onFinalized?.();
  };

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /><h2 className="text-sm font-bold">Decontamination Confirmation</h2></div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Every step must be confirmed by you before a chapter score can be finalized. Nothing is finalized automatically.</p>

      <select value={chapterId} onChange={(e) => selectChapter(e.target.value)} className="mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:max-w-md">
        <option value="">Select a chapter to finalize…</option>
        {chapters.map((c) => <option key={c.id} value={c.id}>Ch {c.chapter_number} — {c.title}</option>)}
      </select>

      <ul className="mt-4 space-y-2">
        {decontaminationSteps.map(([key, label, detail]) => (
          <li key={key} className="rounded-md border border-border bg-background/40 p-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" disabled={!chapterId} checked={Boolean(checked[key])} onChange={(e) => setChecked((p) => ({ ...p, [key]: e.target.checked }))} className="mt-0.5 h-4 w-4 accent-emerald-500" />
              <span><span className="text-sm font-semibold">{label}</span><span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{detail}</span></span>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={finalize} disabled={!canFinalize} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">
          {canFinalize ? <CheckCircle2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          {saving ? 'Finalizing…' : 'Finalize chapter score'}
        </button>
        {!allConfirmed && <span className="text-xs text-amber-400">Confirm all {decontaminationSteps.length} steps to unlock.</span>}
        {done && <span className="text-xs text-emerald-400">Chapter score finalized and marked scored.</span>}
      </div>
    </section>
  );
}