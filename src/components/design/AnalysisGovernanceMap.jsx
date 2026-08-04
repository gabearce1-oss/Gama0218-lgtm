import { ClipboardCheck, FileSpreadsheet, LockKeyhole } from 'lucide-react';
import { analysisWorkflow, excelHandoff } from '@/lib/analysisGovernance';

const TONES = { emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400', cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400', amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400', violet: 'border-violet-500/30 bg-violet-500/5 text-violet-400', red: 'border-red-500/30 bg-red-500/5 text-red-400' };

export default function AnalysisGovernanceMap() {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary" /><h2 className="text-sm font-bold">Analysis Governance: Observed Gap & Required Review Path</h2></div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Current records retain rich manuscript data, but no documented end-to-end protocol separates exploratory analysis, data preparation, reviewer evidence, and canonical score changes.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        {analysisWorkflow.map(([title, detail, tone]) => <article key={title} className={`rounded-md border p-3 ${TONES[tone]}`}><div className="text-xs font-bold text-foreground">{title}</div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p></article>)}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.35fr]">
        <div className="rounded-md border border-red-500/30 bg-red-500/5 p-4"><div className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="h-4 w-4 text-red-400" />Current architectural gap</div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">The platform has quarantine and governance records, but it does not yet represent a structured SPSS workflow, review questionnaire protocol, variable registry, cleansing ledger, or evidence-to-score promotion chain.</p></div>
        <div className="rounded-md border border-cyan-500/30 bg-cyan-500/5 p-4"><div className="flex items-center gap-2 text-sm font-semibold"><FileSpreadsheet className="h-4 w-4 text-cyan-400" />Excel handoff instructions</div><ol className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">{excelHandoff.map((item, index) => <li key={item}><span className="mr-2 font-bold text-cyan-400">{index + 1}.</span>{item}</li>)}</ol></div>
      </div>
    </section>
  );
}