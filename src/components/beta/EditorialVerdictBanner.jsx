import { AlertTriangle, ScrollText } from 'lucide-react';
import { SALVAGE_TIERS, RESTORATION_WORKFLOW } from '@/lib/betaVetting';

// Top-of-page editorial verdict: this file is a restoration quarry, not finished prose.
export default function EditorialVerdictBanner() {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 mb-8">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-2 shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold">Editorial verdict: restoration quarry, not a source manuscript</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              7.5 / 10 resource
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            <strong className="text-foreground">Do not merge these passages directly into the manuscript.</strong> Treat this Beta file as an
            editorial suggestion database. It supplies occasional sparks of imagery or dialogue — it does not replace prose you've already developed.
            Inserted wholesale, its AI-generic habits would flatten your characters' distinct voices.
          </p>

          {/* Salvage estimate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
            {SALVAGE_TIERS.map((t) => (
              <div key={t.key} className={`rounded-md border p-3 ${t.bg}`}>
                <div className={`font-mono font-bold text-lg ${t.color}`}>{t.pct}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{t.label}</div>
              </div>
            ))}
          </div>

          {/* Prescribed workflow */}
          <div className="mt-4 rounded-md border border-border bg-card/50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <ScrollText className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Suggested workflow — extract value without auto-integrating</span>
            </div>
            <ol className="space-y-1">
              {RESTORATION_WORKFLOW.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                  <span className="font-mono text-amber-400 shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}