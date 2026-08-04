import { Unplug, Check, Ban } from 'lucide-react';
import { ORDER } from '@/lib/aiDecommission';

export default function DecommissionOrderCard() {
  return (
    <section className="rounded-lg border border-red-500/50 bg-red-500/10 p-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
        <Unplug className="h-4 w-4" /> Decommission order · effective {ORDER.effective}
      </div>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">AI is out of the measurement chain</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6">
        <span className="font-semibold">Scope: </span>
        {ORDER.scope}
      </p>
      <p className="mt-3 border-l-2 border-red-400 pl-3 font-mono text-xs leading-6 text-red-200">{ORDER.rule}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            <Check className="h-3.5 w-3.5" /> AI may still do this
          </div>
          <p className="mt-1.5 text-sm leading-6">{ORDER.ai_permitted_role}</p>
        </div>
        <div className="rounded-md border border-red-500/40 bg-background/40 p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
            <Ban className="h-3.5 w-3.5" /> AI may never do this
          </div>
          <p className="mt-1.5 text-sm leading-6">{ORDER.ai_forbidden_role}</p>
        </div>
      </div>
    </section>
  );
}