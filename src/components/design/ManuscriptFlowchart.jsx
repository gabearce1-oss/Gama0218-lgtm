import { ArrowDown, ArrowRight, BarChart3, ClipboardCheck, FileText, ScanSearch, ShieldCheck } from 'lucide-react';

const steps = [
  { title: 'Source manuscript', detail: 'Vault II: 44 verified chapters', icon: FileText, tone: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5' },
  { title: 'Reconcile & review', detail: 'Human validation of chapters and changes', icon: ScanSearch, tone: 'text-amber-400 border-amber-500/30 bg-amber-500/5' },
  { title: 'Canonical registry', detail: 'Approved chapter records, scores, and notes', icon: ClipboardCheck, tone: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' },
  { title: 'Shared reporting', detail: 'Dashboard, reports, and exports for collaborators', icon: BarChart3, tone: 'text-violet-400 border-violet-500/30 bg-violet-500/5' },
];

export default function ManuscriptFlowchart() {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-2"><ShieldCheck className="w-4 h-4 text-primary" /><h2 className="text-sm font-bold">Manuscript-to-Reporting Flow</h2></div>
      <p className="text-xs text-muted-foreground mb-5">A reporting value becomes shareable only after it passes through the validated chapter registry.</p>
      <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-3">
        {steps.map(({ title, detail, icon: Icon, tone }, index) => (
          <div key={title} className="contents">
            <div className={`flex-1 rounded-md border p-4 ${tone}`}>
              <Icon className="w-4 h-4 mb-3" /><h3 className="text-sm font-semibold text-foreground">{title}</h3><p className="text-xs text-muted-foreground mt-1 leading-relaxed">{detail}</p>
            </div>
            {index < steps.length - 1 && <><ArrowDown className="md:hidden w-4 h-4 text-muted-foreground mx-auto" /><ArrowRight className="hidden md:block w-4 h-4 shrink-0 text-muted-foreground self-center" /></>}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-border bg-background/40 px-4 py-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Governance checkpoint:</span> evidence conflicts, quarantine items, and scoring changes remain in review until an authorized decision moves them into the canonical registry.</div>
    </section>
  );
}