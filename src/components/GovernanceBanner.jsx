import { ShieldCheck, Lock } from 'lucide-react';
import { GOVERNANCE_VERSION, PRIME_DIRECTIVE_VERSION, FORMULA_LOCK, OMEGA_SPEC } from '@/lib/governance';

export default function GovernanceBanner() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2.5 mb-6 flex-wrap">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-400" />
        <span className="text-xs text-muted-foreground">Governance Version</span>
        <span className="font-mono text-sm font-bold text-amber-400">{GOVERNANCE_VERSION}</span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-2">
        <Lock className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs text-muted-foreground">Formula Lock</span>
        <span className="font-mono text-sm font-bold text-emerald-400">{FORMULA_LOCK}</span>
      </div>
      <div className="w-px h-4 bg-border" />
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs text-muted-foreground">Prime Directive</span>
        <span className="font-mono text-sm font-bold text-amber-400">{PRIME_DIRECTIVE_VERSION}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Ceiling Ω</span>
        <span className="font-mono text-sm font-bold text-amber-400">{OMEGA_SPEC.ceiling.toFixed(3)}</span>
      </div>
    </div>
  );
}