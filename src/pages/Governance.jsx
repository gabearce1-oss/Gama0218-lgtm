import { ScrollText, Lock, Layers, AlertOctagon, Eye, RefreshCw, Languages, Crosshair, ClipboardCheck, Vault, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrimeDirectiveSections from '@/components/PrimeDirectiveSections';
import GovernanceV11Sections from '@/components/GovernanceV11Sections';
import {
  GOVERNANCE_VERSION, PRIME_DIRECTIVE_VERSION, FORMULA_LOCK, OMEGA_SPEC, GOVERNANCE_LAYERS,
  BLOCKER_SEVERITY, BLOCKER_REQUIRED_FIELDS, PUBLIC_SUMMARY,
  SYNC_STATUS, CODESWITCHING_EMPTY_STATE, CODESWITCHING_FUNCTIONS,
  MILITARY_REGISTRY, REGRESSION_TESTS,
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

export default function Governance() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <ScrollText className="w-4 h-4 text-amber-400" />
          Prime Directive {PRIME_DIRECTIVE_VERSION} · {GOVERNANCE_VERSION}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Governance Spec</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          The source of truth for all manuscript rules. Tests verify the spec; tests do not invent the spec.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Version</span><span className="font-mono font-bold text-amber-400">{GOVERNANCE_VERSION}</span></div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-emerald-400" /><span className="text-xs text-muted-foreground">Formula Lock</span><span className="font-mono font-bold text-emerald-400">{FORMULA_LOCK}</span></div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Ceiling Ω</span><span className="font-mono font-bold text-amber-400">{OMEGA_SPEC.ceiling.toFixed(3)}</span></div>
      </div>

      <Section icon={Layers} title="Governance Layers — Priority Order">
        <p className="text-sm text-muted-foreground mb-4">Governance owns the rules. Data hygiene goes first. Chicano lens goes second. Prose comes third. No scene gets polished until the evidence, canon, cultural logic, and voice logic are clean enough to support it.</p>
        <div className="space-y-3">
          {GOVERNANCE_LAYERS.map(layer => (
            <div key={layer.order} className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0">
              <span className="font-mono text-xs font-bold text-amber-400 shrink-0 w-6">G{layer.order}</span>
              <div>
                <div className="text-sm font-bold">{layer.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{layer.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-amber-400/80 mt-4 italic">A gorgeous paragraph with the wrong weapon or helicopter behavior is still wrong. Pretty wrong is just wrong wearing cologne.</p>
      </Section>

      <GovernanceV11Sections />

      <PrimeDirectiveSections />

      <Section icon={Lock} title="Ω Formula Spec">
        <div className="font-mono text-lg text-amber-400 font-bold bg-background/50 rounded-md p-4 mb-4">
          {OMEGA_SPEC.formulaString}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {Object.entries(OMEGA_SPEC.metricLabels).map(([code, name]) => (
            <div key={code} className="rounded-md border border-border bg-background/50 p-3">
              <div className="font-mono font-bold text-amber-400">{code}</div>
              <div className="text-xs text-muted-foreground mt-1">{name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Range: {OMEGA_SPEC.metricRange.min}–{OMEGA_SPEC.metricRange.max}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-border bg-background/50 p-3">
            <div className="text-xs text-muted-foreground">Ceiling</div>
            <div className="font-mono text-lg font-bold text-amber-400">{OMEGA_SPEC.ceiling.toFixed(3)}</div>
            <div className="text-[10px] text-muted-foreground">Assumes all metrics max at 100</div>
          </div>
          <div className="rounded-md border border-border bg-background/50 p-3">
            <div className="text-xs text-muted-foreground">Gap Formula</div>
            <div className="font-mono text-sm font-bold text-amber-400">gap = {OMEGA_SPEC.ceiling.toFixed(3)} − mean Ω</div>
          </div>
        </div>
        <div className="text-[10px] text-muted-foreground mt-3">
          Owner: {OMEGA_SPEC.owner} · Any change requires governance version bump and regression test update.
        </div>
      </Section>

      <Section icon={AlertOctagon} title="Blocker Policy">
        <p className="text-sm text-muted-foreground mb-4">A blocker is not a note. A blocker is a governance object.</p>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Required Fields</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {BLOCKER_REQUIRED_FIELDS.map(f => (
            <span key={f} className="font-mono text-[10px] rounded border border-border bg-background/50 px-2 py-0.5">{f}</span>
          ))}
        </div>
        <div className="space-y-2">
          {Object.entries(BLOCKER_SEVERITY).map(([sev, info]) => (
            <div key={sev} className="flex items-start gap-3 border-b border-border/50 pb-2 last:border-0">
              <span className="font-mono text-xs font-bold text-amber-400 shrink-0 w-20">{sev}</span>
              <div>
                <span className="text-sm text-muted-foreground">{info.desc}</span>
                <span className="text-[10px] text-muted-foreground/70 ml-2">e.g. {info.example}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-border bg-background/50 p-3 mt-4">
          <div className="text-xs font-bold text-amber-400 mb-1">Overlap Rule</div>
          <div className="font-mono text-[10px] text-muted-foreground space-y-1">
            <div>words_at_risk_unique = Σ word_count for chapters affected by ≥1 active blocker (counted once)</div>
            <div>multi_blocked_words = Σ word_count for chapters affected by ≥2 active blockers</div>
            <div>overlap_pct = multi_blocked_words / words_at_risk_unique</div>
          </div>
        </div>
      </Section>

      <Section icon={Eye} title="Public Access Policy">
        <p className="text-sm text-muted-foreground mb-3">Visitor mode shows only high-level read-only metrics. Public visibility is governance, not decoration.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 mb-2">Visible</div>
            <div className="space-y-1">
              {PUBLIC_SUMMARY.visible.map(f => (
                <div key={f} className="font-mono text-[10px] text-emerald-400">✓ {f}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-red-400 mb-2">Hidden</div>
            <div className="space-y-1">
              {PUBLIC_SUMMARY.hidden.map(f => (
                <div key={f} className="font-mono text-[10px] text-red-400">✗ {f}</div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section icon={RefreshCw} title="Sync Status Contract">
        <p className="text-sm text-muted-foreground mb-3">Manual sync with no matching files must not fail silently. "Nothing happened" is not a log — it is a shrug in JSON form.</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {SYNC_STATUS.values.map(s => (
            <span key={s} className={`font-mono text-xs rounded border px-2 py-0.5 ${s === 'no_files' ? 'border-amber-500/30 text-amber-400' : 'border-border text-muted-foreground'}`}>{s}</span>
          ))}
        </div>
        <div className="rounded-md border border-border bg-background/50 p-3">
          <div className="text-xs font-bold text-amber-400 mb-2">no_files Contract</div>
          <pre className="font-mono text-[10px] text-muted-foreground whitespace-pre-wrap">{JSON.stringify(SYNC_STATUS.noFilesContract, null, 2)}</pre>
        </div>
      </Section>

      <Section icon={Languages} title="CodeSwitching Filter Spec">
        <p className="text-sm text-muted-foreground mb-3">When filters return no results, the UI must show a clear empty state — not stale charts or misleading "0 means none" language.</p>
        <div className="rounded-md border border-border bg-background/50 p-3 mb-3">
          <div className="text-xs text-muted-foreground mb-1">Empty State Message</div>
          <div className="text-sm text-amber-400">{CODESWITCHING_EMPTY_STATE}</div>
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Socio-Pragmatic Functions</div>
        <div className="flex flex-wrap gap-2">
          {CODESWITCHING_FUNCTIONS.map(f => (
            <span key={f} className="font-mono text-[10px] rounded border border-border bg-background/50 px-2 py-0.5">{f}</span>
          ))}
        </div>
      </Section>

      <Section icon={Crosshair} title="Military Source Registry">
        <p className="text-sm text-muted-foreground mb-3">Military facts belong under Data Hygiene, not prose. Every item gets a fact card verified against service/museum histories or manuals — not memory.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-2">Fact Card Fields</div>
            <div className="flex flex-wrap gap-1.5">
              {MILITARY_REGISTRY.fields.map(f => (
                <span key={f} className="font-mono text-[10px] rounded border border-border bg-background/50 px-1.5 py-0.5">{f}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-2">Item Types</div>
            <div className="flex flex-wrap gap-1.5">
              {MILITARY_REGISTRY.types.map(t => (
                <span key={t} className="font-mono text-[10px] rounded border border-border bg-background/50 px-1.5 py-0.5">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xs font-bold text-muted-foreground mb-2">Check Categories</div>
          <div className="space-y-1">
            {MILITARY_REGISTRY.checkCategories.map(c => (
              <div key={c} className="font-mono text-[10px] text-muted-foreground">· {c}</div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          {MILITARY_REGISTRY.statuses.map(s => (
            <span key={s} className={`font-mono text-xs rounded border px-2 py-0.5 ${s === 'verified' ? 'border-emerald-500/30 text-emerald-400' : s === 'needs_review' ? 'border-amber-500/30 text-amber-400' : 'border-red-500/30 text-red-400'}`}>{s}</span>
          ))}
        </div>
      </Section>

      <Section icon={Vault} title="Quarantine Protocol">
        <p className="text-sm text-muted-foreground mb-4">
          Any formula, prompt, scoring rule, manuscript rewrite instruction, or system behavior rule marked as QUARANTINED must not be used in live outputs, manuscript edits, scoring, dashboards, evidence claims, or automation workflows. Quarantined material may only be summarized, compared, tested, or reviewed.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
            <div className="text-xs font-bold text-amber-400 mb-1">1. Provenance Review</div>
            <ul className="text-[10px] text-muted-foreground space-y-0.5">
              <li>· Who created it?</li>
              <li>· When was it created?</li>
              <li>· What source material supports it?</li>
              <li>· User-authored, AI-assisted, inferred, or external?</li>
            </ul>
          </div>
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
            <div className="text-xs font-bold text-amber-400 mb-1">2. Logic Review</div>
            <ul className="text-[10px] text-muted-foreground space-y-0.5">
              <li>· Does it produce stable outputs?</li>
              <li>· Conflicts with LITCENTRAL / TE360?</li>
              <li>· Does it inflate claims?</li>
              <li>· Does it create false precision?</li>
            </ul>
          </div>
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
            <div className="text-xs font-bold text-amber-400 mb-1">3. Impact Review</div>
            <ul className="text-[10px] text-muted-foreground space-y-0.5">
              <li>· What systems would change?</li>
              <li>· Would it affect manuscript voice?</li>
              <li>· Would it alter certification claims?</li>
              <li>· Would it change outreach/publication?</li>
            </ul>
          </div>
        </div>
        <div className="rounded-md border border-border bg-background/50 p-3 mb-3">
          <div className="text-xs font-bold text-amber-400 mb-2">Release Path</div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-red-400">QUARANTINE</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">3-Part Validation</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-amber-400">STAGING</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Staging Test</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-emerald-400">CANONICAL</span>
          </div>
        </div>
        <div className="rounded-md border border-border bg-background/50 p-3 mb-3">
          <div className="text-xs font-bold text-muted-foreground mb-2">Canonical Hierarchy (Priority Order)</div>
          <div className="space-y-1 text-[10px]">
            <div className="flex items-center gap-2"><span className="font-mono text-emerald-400 w-4">1</span> Original Ramos True Voice Restore chapter</div>
            <div className="flex items-center gap-2"><span className="font-mono text-emerald-400 w-4">2</span> Current manuscript baseline</div>
            <div className="flex items-center gap-2"><span className="font-mono text-emerald-400 w-4">3</span> Verified evidence corpus</div>
            <div className="flex items-center gap-2"><span className="font-mono text-emerald-400 w-4">4</span> LITCENTRAL/TE360 validated metrics</div>
            <div className="flex items-center gap-2"><span className="font-mono text-emerald-400 w-4">5</span> Workbook operational schema</div>
            <div className="flex items-center gap-2"><span className="font-mono text-red-400 w-4">6</span> Quarantined formulas and experimental prompts</div>
          </div>
        </div>
        <Link to="/quarantine-log" className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:underline">
          <Vault className="w-3.5 h-3.5" />
          Open Quarantine Log →
        </Link>
      </Section>

      <Section icon={ClipboardCheck} title="Regression Test Suite">
        <div className="space-y-2">
          {REGRESSION_TESTS.map(t => (
            <div key={t.name} className="flex items-start gap-3 border-b border-border/50 pb-2 last:border-0">
              <span className={`font-mono text-xs font-bold shrink-0 ${t.priority === 'P0' ? 'text-red-400' : 'text-amber-400'}`}>{t.priority}</span>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}