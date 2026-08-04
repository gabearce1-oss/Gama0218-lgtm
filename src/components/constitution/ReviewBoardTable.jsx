import { Users, Check, X } from 'lucide-react';
import { REVIEW_BOARD, LANGUAGE_RULES, RELEASE_PROFILES } from '@/lib/measurementConstitution';

export default function ReviewBoardTable() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 mb-1">
        <Users className="w-4 h-4" /> Review board · authority by discipline
      </div>
      <h2 className="text-lg font-bold">Who Approves What</h2>
      <div className="mt-4 space-y-1.5">
        {REVIEW_BOARD.map((r) => {
          const noVote = r.authority === 'No approval vote';
          return (
            <div key={r.reviewer} className={`flex flex-col gap-0.5 rounded-md border p-2.5 text-xs sm:flex-row sm:gap-4 ${noVote ? 'border-red-500/30 bg-red-500/5' : 'border-border/60 bg-background/40'}`}>
              <span className={`shrink-0 font-semibold sm:w-80 ${noVote ? 'text-red-400' : ''}`}>{r.reviewer}</span>
              <span className={noVote ? 'text-red-300/90' : 'text-muted-foreground'}>{r.authority}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Release output — five separately validated profiles, not one figure</div>
        <div className="flex flex-wrap gap-1.5">
          {RELEASE_PROFILES.map((p) => (
            <span key={p} className="rounded bg-muted px-2 py-1 text-[11px] text-muted-foreground">{p}</span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Certification language</div>
        <div className="space-y-2">
          {LANGUAGE_RULES.map((l) => (
            <div key={l.permitted} className="rounded-md border border-border/60 bg-background/40 p-3 text-xs space-y-1.5">
              <div className="flex gap-2"><Check className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" /><span className="text-emerald-300/90">{l.permitted}</span></div>
              <div className="flex gap-2"><X className="w-3.5 h-3.5 shrink-0 text-red-400 mt-0.5" /><span className="text-red-300/90">{l.prohibited}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}