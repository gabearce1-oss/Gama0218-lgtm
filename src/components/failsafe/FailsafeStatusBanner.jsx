import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { OPEN_STATES } from '@/lib/failsafe';

export default function FailsafeStatusBanner({ events }) {
  const open = events.filter((e) => OPEN_STATES.includes(e.trigger_state));
  const halted = open.filter((e) => e.halts_pipeline).length > 0;
  const critical = open.filter((e) => e.severity === 'Critical').length;

  if (!open.length) {
    return (
      <section className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-5">
        <div className="flex items-center gap-2 font-bold text-emerald-300">
          <ShieldCheck className="h-5 w-5" /> All tripwires armed · no open triggers
        </div>
        <p className="mt-1 text-sm text-emerald-200/80">The pipeline is clear to move. Every past trigger carries a reviewer sign-off.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-red-500/40 bg-red-500/10 p-5">
      <div className="flex items-center gap-2 font-bold text-red-300">
        <ShieldAlert className="h-5 w-5" />
        {open.length} open trigger{open.length === 1 ? '' : 's'}
        {critical > 0 ? ` · ${critical} critical` : ''}
      </div>
      <p className="mt-1 text-sm text-red-200/80">
        {halted
          ? 'Pipeline is halted. No release, export or report may proceed until these are cleared by a named human.'
          : 'Open triggers are logged but none currently halt the pipeline.'}
      </p>
    </section>
  );
}