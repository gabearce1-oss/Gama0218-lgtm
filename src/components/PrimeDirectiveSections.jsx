import { ShieldCheck, FileSearch, ListChecks, Tag, AlertOctagon } from 'lucide-react';
import {
  PRIME_DIRECTIVE, EVIDENCE_CLASSES, EVIDENCE_LABELS, DATA_HYGIENE_RESULTS,
  BLOCKER_GATES, BLOCKER_EVIDENCE_STATUS, REFINEMENT_WORKFLOW, MODELED_NARRATIVE_FIELDS,
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

export default function PrimeDirectiveSections() {
  return (
    <>
      <Section icon={ShieldCheck} title={`Prime Directive ${PRIME_DIRECTIVE.version} — Core Doctrine`}>
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-4 mb-4">
          <p className="text-sm font-bold text-amber-400 mb-1">Core Rule</p>
          <p className="text-sm text-amber-200/90 italic">{PRIME_DIRECTIVE.coreRule}</p>
          <p className="text-xs text-muted-foreground mt-2">That is the whole doctrine.</p>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{PRIME_DIRECTIVE.shortVersion}</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3">Gate</th>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Purpose</th>
              <th className="py-2">Prose Override?</th>
            </tr>
          </thead>
          <tbody>
            {PRIME_DIRECTIVE.gates.map(g => (
              <tr key={g.gate} className="border-b border-border/50">
                <td className="py-2 pr-3 font-mono font-bold text-amber-400">G{g.gate}</td>
                <td className="py-2 pr-3 text-sm font-bold">{g.name}</td>
                <td className="py-2 pr-3 text-xs text-muted-foreground">{g.purpose}</td>
                <td className="py-2 text-xs">
                  {g.proseOverride ? (
                    <span className="text-amber-400">{g.note}</span>
                  ) : (
                    <span className="text-red-400 font-bold">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section icon={FileSearch} title="Evidence Classes — Data Hygiene Hierarchy">
        <p className="text-sm text-muted-foreground mb-3">
          Every factual claim must connect to evidence, canon, or a labeled narrative model. Fragmented evidence can support plausibility, not certainty.
        </p>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3">Class</th>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Meaning</th>
              <th className="py-2">Hard Fact?</th>
            </tr>
          </thead>
          <tbody>
            {EVIDENCE_CLASSES.map(e => (
              <tr key={e.class} className="border-b border-border/50">
                <td className="py-2 pr-3 font-mono font-bold text-amber-400">{e.class}</td>
                <td className="py-2 pr-3 text-sm font-bold">{e.name}</td>
                <td className="py-2 pr-3 text-xs text-muted-foreground">{e.desc}</td>
                <td className="py-2 text-xs">
                  {e.supportsHardFact === true ? (
                    <span className="text-emerald-400">Yes</span>
                  ) : e.supportsHardFact === false ? (
                    <span className="text-red-400">No</span>
                  ) : (
                    <span className="text-amber-400">{e.supportsHardFact}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Data Hygiene Results</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {DATA_HYGIENE_RESULTS.map(r => (
            <span key={r.result} className={`font-mono text-[10px] rounded border px-2 py-0.5 ${r.result === 'PASS' ? 'border-emerald-500/30 text-emerald-400' : r.result === 'BLOCKED' ? 'border-red-500/30 text-red-400' : r.result === 'AUTHORIAL INVENTION' ? 'border-muted-foreground/30 text-muted-foreground' : 'border-amber-500/30 text-amber-400'}`} title={r.desc}>
              {r.result}
            </span>
          ))}
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Dashboard Labels</div>
        <div className="flex flex-wrap gap-2">
          {EVIDENCE_LABELS.map(l => (
            <span key={l.label} className="font-mono text-[10px] rounded border border-border bg-background/50 px-2 py-0.5">
              {l.label} <span className="text-muted-foreground">({l.evidenceClass})</span>
            </span>
          ))}
        </div>
      </Section>

      <Section icon={AlertOctagon} title="Blocker Gate Mapping">
        <p className="text-sm text-muted-foreground mb-3">Every blocker must identify which gate failed. Severity maps to the gate that owns the issue.</p>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3">Gate</th>
              <th className="py-2 pr-3">Severities</th>
              <th className="py-2">Example Issues</th>
            </tr>
          </thead>
          <tbody>
            {BLOCKER_GATES.map(g => (
              <tr key={g.gate} className="border-b border-border/50">
                <td className="py-2 pr-3 font-mono text-xs font-bold text-violet-400">{g.gate}</td>
                <td className="py-2 pr-3 text-xs">{g.severities.join(', ')}</td>
                <td className="py-2 text-xs text-muted-foreground">{g.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Evidence Status Values</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {BLOCKER_EVIDENCE_STATUS.map(s => (
            <div key={s.value} className="flex items-start gap-2 border-b border-border/50 pb-1">
              <span className="font-mono text-[10px] text-sky-400 shrink-0">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={ListChecks} title="Refinement Workflow — 12-Step Sequence">
        <p className="text-sm text-muted-foreground mb-3">
          Every refinement must preserve or improve evidence integrity, canon continuity, Chicano lens integrity, voice specificity, and prose quality. A refinement that improves prose while damaging evidence, canon, or cultural logic fails.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {REFINEMENT_WORKFLOW.map(step => (
            <div key={step.step} className="flex items-center gap-3 border-b border-border/50 pb-2">
              <span className="font-mono text-xs font-bold text-amber-400 shrink-0 w-6">{step.step}</span>
              <span className="text-sm">{step.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Tag} title="Modeled Narrative — Required Fields">
        <p className="text-sm text-muted-foreground mb-3">
          Modeled narrative is allowed when evidence is incomplete, but the model must be labeled, constrained, and reversible. If the model contradicts verified evidence, the scene is blocked.
        </p>
        <div className="space-y-2">
          {MODELED_NARRATIVE_FIELDS.map(f => (
            <div key={f.field} className="flex items-start gap-3 border-b border-border/50 pb-2 last:border-0">
              <span className="font-mono text-xs font-bold text-amber-400 shrink-0 w-44">{f.field}</span>
              <span className="text-sm text-muted-foreground">{f.desc}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}