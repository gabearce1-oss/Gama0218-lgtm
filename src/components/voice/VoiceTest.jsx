import { CheckCircle2 } from 'lucide-react';

export default function VoiceTest({ criteria }) {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
      <h2 className="text-lg font-bold mb-1">The Voice Test</h2>
      <p className="text-xs text-muted-foreground mb-4">A line passes only if it meets all five criteria.</p>
      <div className="space-y-2">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="text-sm">{c}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-border bg-background/50 p-3">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Final SQDM Rule</div>
        <p className="text-sm font-semibold text-amber-300">
          Regional voice is seasoning. Character is the meal.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          O'Neil is not "Kentucky." Hoshnsin is not "Philly." Herrera is not "the Bronx." Tijuana is not "Spanish."
          Those places shaped them, but pressure reveals them. That is where the dialogue should live.
        </p>
      </div>
    </div>
  );
}