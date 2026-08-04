import { Lock, ListOrdered, RefreshCw, ShieldAlert } from 'lucide-react';
import {
  GOVERNANCE_ANCHOR_SPEC, LOCKED_CANON_FACTS, SOURCE_OF_TRUTH,
  SYNC_DIRECTION_MATRIX, SYNC_FAILURE_PROTOCOL,
} from '@/lib/governance';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function GovernanceV11Sections() {
  return (
    <>
      <Section icon={Lock} title="Active Governance Anchor (v25)">
        <p className="text-sm text-muted-foreground mb-4">
          {GOVERNANCE_ANCHOR_SPEC.note}
        </p>
        <div className="font-mono text-sm text-amber-400 font-bold bg-background/50 rounded-md p-4 mb-3">
          {GOVERNANCE_ANCHOR_SPEC.formula}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-md border border-border bg-background/50 p-3">
            <div className="text-xs text-muted-foreground">Ceiling Ω</div>
            <div className="font-mono text-lg font-bold text-amber-400">{GOVERNANCE_ANCHOR_SPEC.ceiling}</div>
            <div className="text-[10px] text-muted-foreground">Scores above are mathematically impossible</div>
          </div>
          <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3">
            <div className="text-xs text-muted-foreground">VCL-EXEMPT Chapters</div>
            <div className="font-mono text-lg font-bold text-red-400">Ch.{GOVERNANCE_ANCHOR_SPEC.vclExemptChapters.join(', Ch.')}</div>
            <div className="text-[10px] text-muted-foreground">Producing CLS numbers = governance violation</div>
          </div>
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="text-[11px] font-mono text-emerald-400 leading-relaxed mt-1">{GOVERNANCE_ANCHOR_SPEC.status}</div>
          </div>
        </div>
      </Section>

      <Section icon={Lock} title="Locked Canon Facts">
        <p className="text-sm text-muted-foreground mb-4">Never contradict, never re-litigate. These are settled.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {LOCKED_CANON_FACTS.map((fact, i) => (
            <div key={i} className="flex items-start gap-2 rounded-md border border-border bg-background/50 px-3 py-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-foreground">{fact}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={ListOrdered} title="Source-of-Truth Hierarchy">
        <p className="text-sm text-muted-foreground mb-4">Highest wins. Conflicts between sources: STOP and ask Gabe. Never silently pick one.</p>
        <div className="space-y-2">
          {SOURCE_OF_TRUTH.map((s) => (
            <div key={s.rank} className="flex items-start gap-3 border-b border-border/50 pb-2 last:border-0">
              <span className="font-mono text-sm font-bold text-amber-400 shrink-0 w-6">{s.rank}</span>
              <span className="text-sm text-muted-foreground">{s.source}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={RefreshCw} title="Sync Direction Matrix">
        <p className="text-sm text-muted-foreground mb-4">Real-time sync moves packets, not canon.</p>
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/30 text-left">
                <th className="px-3 py-2 font-bold text-muted-foreground">From → To</th>
                <th className="px-3 py-2 font-bold text-muted-foreground w-24 text-center">Allowed?</th>
                <th className="px-3 py-2 font-bold text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody>
              {SYNC_DIRECTION_MATRIX.map((row, i) => (
                <tr key={i} className="border-t border-border/50">
                  <td className="px-3 py-2 font-mono text-[11px]">{row.from} → {row.to}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`font-mono text-[10px] font-bold rounded px-1.5 py-0.5 ${row.allowed ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                      {row.allowed ? 'YES' : 'NO'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[11px] text-muted-foreground">{row.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section icon={ShieldAlert} title="Forbidden Sync Failure Protocol">
        <p className="text-sm text-muted-foreground mb-4">If any system attempts a forbidden sync:</p>
        <div className="space-y-2">
          {SYNC_FAILURE_PROTOCOL.map((step, i) => (
            <div key={i} className="flex items-start gap-3 rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2">
              <span className="font-mono text-xs font-bold text-red-400 shrink-0 w-4">{i + 1}</span>
              <span className="text-xs text-foreground">{step}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}