import { Scale, Check, X } from 'lucide-react';
import { AUTHORITY_LANES } from '@/lib/evidenceFreeze';

export default function AuthorityScopeCard() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-violet-400 mb-1">
        <Scale className="w-4 h-4" /> Authority separation
      </div>
      <h2 className="text-lg font-bold">Four Authorities, Not One Magical Source</h2>
      <p className="text-xs text-muted-foreground mt-1 mb-4">
        Sources establish facts. Human-governed rules define constructs. Statistical models test relationships. AI assists extraction. No model rewrites the baseline.
      </p>
      <div className="space-y-3">
        {AUTHORITY_LANES.map((l) => (
          <div key={l.authority} className="rounded-md border border-border/60 bg-background/40 p-4">
            <div className="font-bold text-sm">{l.authority}</div>
            <div className="text-xs text-muted-foreground mt-0.5 italic">{l.question}</div>
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex gap-2"><Check className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" /><span className="text-emerald-300/90">{l.permitted}</span></div>
              <div className="flex gap-2"><X className="w-3.5 h-3.5 shrink-0 text-red-400 mt-0.5" /><span className="text-red-300/90">{l.prohibited}</span></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}