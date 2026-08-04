import { FileWarning, ShieldCheck } from 'lucide-react';

export default function ManuscriptSourceStatus() {
  return (
    <section className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-5 mb-6">
      <div className="flex items-start gap-3">
        <FileWarning className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold text-amber-400">Vault II Reporting Scope</h2><span className="rounded border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">44 chapters verified</span></div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Vault II contains 44 chapters. The two additional legacy records remain preserved for reconciliation, but are excluded from the current-source dashboard view and should not be used in shared conclusions.</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-foreground/90"><ShieldCheck className="w-4 h-4 text-emerald-400" /><span>Current dashboard totals reflect the verified 44-chapter Vault II scope.</span></div>
        </div>
      </div>
    </section>
  );
}