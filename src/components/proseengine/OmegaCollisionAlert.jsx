import { AlertOctagon } from 'lucide-react';
import { OMEGA_COLLISION } from '@/lib/ramosCanonAudit';

export default function OmegaCollisionAlert() {
  return (
    <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
        <AlertOctagon className="h-4 w-4" /> P0 · symbol collision
      </div>
      <h3 className="mt-1 text-lg font-bold">{OMEGA_COLLISION.headline}</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-emerald-500/30 bg-card p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Ours · manuscript Ω</div>
          <p className="mt-1 font-mono text-xs leading-6 text-muted-foreground">{OMEGA_COLLISION.ours}</p>
        </div>
        <div className="rounded-md border border-red-500/30 bg-card p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-red-400">Theirs · v13 audit Ω</div>
          <p className="mt-1 font-mono text-xs leading-6 text-muted-foreground">{OMEGA_COLLISION.theirs}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6">{OMEGA_COLLISION.why_it_matters}</p>
      <p className="mt-3 border-l-2 border-red-400 pl-3 text-sm font-semibold leading-6 text-red-300">
        {OMEGA_COLLISION.ruling}
      </p>
    </div>
  );
}