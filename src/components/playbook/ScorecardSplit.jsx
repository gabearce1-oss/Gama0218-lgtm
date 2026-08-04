import { Check, X } from 'lucide-react';
import { SCORECARD_TRACKS } from '@/lib/omegaPlaybook';

export default function ScorecardSplit() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {SCORECARD_TRACKS.map((track) => (
        <div key={track.id} className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-bold">{track.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{track.scope}</p>

          <div className="mt-4 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Holds</div>
            {track.holds.map((item) => (
              <div key={item} className="flex gap-2 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-red-400">Does not hold</div>
            {track.forbids.map((item) => (
              <div key={item} className="flex gap-2 text-sm text-muted-foreground">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}