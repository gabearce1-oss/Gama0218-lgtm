import { useState, useRef, useEffect } from 'react';
import { Terminal, LayoutGrid, Copy, Check, ChevronRight, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { BASELINE, PROJ_MEAN, TARGET_OMEGA, ELITE_THRESHOLD, AUDIT_V3_DATE, AUDIT_V3_CRITICAL_FINDING } from '@/lib/promptData';
import { OMEGA_SPEC, GOVERNANCE_VERSION } from '@/lib/governance';
import { getTier, TIER_CONFIG } from '@/lib/omega';

// Map a live Chapter entity record into the shape the terminal/grid/detail UI expects.
// Uses the audited RF15 scores imported into the database (omega, cls/bis/sii/mrf, tier).
function mapChapter(c) {
  return {
    n: c.chapter_number,
    title: c.title || `Chapter ${c.chapter_number}`,
    act: c.act || 'I',
    omega: c.omega || 0,
    cls: c.cls ?? '—',
    bis: c.bis ?? '—',
    sii: c.sii ?? '—',
    mrf: c.mrf ?? '—',
    words: c.word_count || 0,
    cs_pct: c.cs_pct != null ? Number(c.cs_pct).toFixed(1) : '—',
    status: c.status || 'pending',
    priority: c.priority || 'routine',
    triage: c.triage || '',
    risk: c.risk || '',
    tier_label: c.tier_label || '',
    notes: c.restoration_notes || c.notes || 'No revision notes recorded.',
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  immediate: { label: 'IMMEDIATE', color: 'text-red-400',   border: 'border-red-500/30',   bg: 'bg-red-500/5' },
  next:      { label: 'NEXT',      color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/5' },
  routine:   { label: 'ROUTINE',   color: 'text-sky-400',   border: 'border-sky-500/30',   bg: 'bg-sky-500/5' },
};

const STATUS_COLOR = {
  scored:  'text-emerald-400',
  blocker: 'text-red-400',
  pending: 'text-muted-foreground',
};

function omegaBar(omega) {
  const pct = Math.min(100, Math.max(0, ((omega - 100) / (OMEGA_SPEC.ceiling - 100)) * 100));
  const color = omega >= ELITE_THRESHOLD ? 'bg-amber-400' : omega >= 108 ? 'bg-teal-400' : omega >= 106 ? 'bg-blue-400' : omega >= 103 ? 'bg-orange-400' : 'bg-red-400';
  return { pct, color };
}

// ─── Chapter Card (detail view) ───────────────────────────────────────────────

function ChapterCard({ ch, onClose }) {
  const [copied, setCopied] = useState(false);
  const tier = getTier(ch.omega);
  const tierCfg = TIER_CONFIG[tier];
  const priCfg = PRIORITY_CONFIG[ch.priority];
  const bar = omegaBar(ch.omega);

  const prompt = `CHAPTER ${ch.n} — ${ch.title} (Act ${ch.act})
Ω: ${ch.omega} | Tier: ${ch.tier_label || tierCfg.label} | Priority: ${ch.priority.toUpperCase()}
Words: ${ch.words?.toLocaleString()} | CS%: ${ch.cs_pct}% | Risk: ${ch.risk || '—'}
CLS: ${ch.cls} | BIS: ${ch.bis} | SII: ${ch.sii} | MRF: ${ch.mrf}
Triage: ${ch.triage || '—'}

REVISION NOTES:
${ch.notes}

REVISION PROMPT — ${ch.title}:
Apply the four-gate sequence:
1. DATA HYGIENE — verify all military facts, dates, weapons, aircraft, and timeline claims in this chapter.
2. CHICANO LENS — check voice authenticity, code-switching function, dialect integrity, and cultural specificity.
3. BATTLE MYSTICISM — ensure spiritual-physical-identity pressure is layered, not decorating.
4. PROSE — tighten rhythm, sensory density, and dialogue only after Gates 1–3 pass.

Focus: ${ch.notes}

Governance: ${GOVERNANCE_VERSION} | Prime Directive v1.0 | Ω Formula: ${OMEGA_SPEC.formulaString}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-lg border border-amber-500/30 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-muted-foreground">Ch.{ch.n}</span>
            <span className="font-mono text-xs text-muted-foreground">Act {ch.act}</span>
            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${priCfg.border} ${priCfg.bg} ${priCfg.color}`}>{priCfg.label}</span>
            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${tierCfg.badge}`}>{tierCfg.label}</span>
          </div>
          <h2 className="text-xl font-bold">{ch.title}</h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Prompt'}
          </button>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">✕</button>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <span className={`font-mono text-2xl font-bold ${tierCfg.text}`}>Ω {ch.omega}</span>
          <div className="flex-1">
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${bar.color} transition-all`} style={{ width: `${bar.pct}%` }} />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[9px] text-muted-foreground">100</span>
              <span className="text-[9px] text-amber-400">Target: {TARGET_OMEGA}</span>
              <span className="text-[9px] text-muted-foreground">{OMEGA_SPEC.ceiling.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[['CLS', ch.cls], ['BIS', ch.bis], ['SII', ch.sii], ['MRF', ch.mrf]].map(([k, v]) => (
            <div key={k} className="rounded border border-border bg-background/50 p-2 text-center">
              <div className="font-mono text-xs text-muted-foreground">{k}</div>
              <div className="font-mono font-bold text-lg">{v}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
          <span>Words: <strong className="text-foreground">{ch.words?.toLocaleString()}</strong></span>
          <span>CS%: <strong className="text-foreground">{ch.cs_pct}%</strong></span>
          {ch.triage && <span>Triage: <strong className="text-foreground">{ch.triage}</strong></span>}
          {ch.risk && <span>Risk: <strong className="text-foreground">{ch.risk}</strong></span>}
        </div>
      </div>

      {/* Notes */}
      <div className="px-5 py-4 border-b border-border">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Revision Notes</div>
        <p className="text-sm text-foreground/90 leading-relaxed">{ch.notes}</p>
      </div>

      {/* Prompt preview */}
      <div className="px-5 py-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Revision Prompt Preview</div>
        <pre className="font-mono text-[10px] text-muted-foreground bg-background/60 rounded p-3 whitespace-pre-wrap leading-relaxed max-h-48 overflow-auto">{prompt}</pre>
      </div>
    </div>
  );
}

// ─── Grid Cell ────────────────────────────────────────────────────────────────

function GridCell({ ch, onSelect, isSelected }) {
  const tier = getTier(ch.omega);
  const tierCfg = TIER_CONFIG[tier];
  const priCfg = PRIORITY_CONFIG[ch.priority];
  const isBlocker = ch.status === 'blocker';

  return (
    <button
      onClick={() => onSelect(ch)}
      className={`rounded border text-left p-2.5 transition-all hover:border-amber-500/50 hover:bg-amber-500/5 ${
        isSelected ? 'border-amber-500/50 bg-amber-500/10' : isBlocker ? 'border-red-500/40 bg-red-500/5' : 'border-border bg-card'
      }`}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <span className="font-mono text-[10px] text-muted-foreground">Ch.{ch.n}</span>
        <span className={`font-mono text-[9px] font-bold ${priCfg.color}`}>{priCfg.label[0]}</span>
      </div>
      <div className="font-mono font-bold text-sm mb-1">
        <span className={tierCfg.text}>Ω{ch.omega}</span>
      </div>
      <div className="text-[9px] text-muted-foreground truncate">{ch.title}</div>
      <div className="mt-1.5 h-1 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${omegaBar(ch.omega).color}`} style={{ width: `${omegaBar(ch.omega).pct}%` }} />
      </div>
    </button>
  );
}

// ─── Terminal ─────────────────────────────────────────────────────────────────

const HELP_TEXT = `LITCENTRAL PROMPT MASTER — SGT Ramos Revision Terminal
Version ${GOVERNANCE_VERSION} | 45 Chapters | Ω Baseline: ${BASELINE} → Target: ${TARGET_OMEGA}

COMMANDS:
  prompt N        — load chapter N (e.g. "prompt 9")
  N               — shorthand (e.g. "9" or "ch9")
  overview        — show all 45 chapters grid
  blockers        — list all blocker chapters
  elite           — list Elite/Near-Elite chapters
  immediate       — list immediate priority chapters
  stats           — manuscript statistics
  help            — show this message
  clear           — clear terminal`;

function runCommand(input, setOutput, setSelected, setView, CHAPTER_DATA) {
  const cmd = input.trim().toLowerCase();

  if (cmd === 'help') return setOutput(HELP_TEXT);
  if (cmd === 'clear') return setOutput('');
  if (cmd === 'overview') { setView('grid'); return setOutput('Loading overview grid…'); }

  if (cmd === 'stats') {
    const scored = CHAPTER_DATA.filter(c => c.status === 'scored');
    const mean = scored.length ? scored.reduce((s, c) => s + c.omega, 0) / scored.length : 0;
    const elite = CHAPTER_DATA.filter(c => c.omega >= ELITE_THRESHOLD);
    const blockers = CHAPTER_DATA.filter(c => c.status === 'blocker');
    const totalWords = CHAPTER_DATA.reduce((s, c) => s + (c.words || 0), 0);
    return setOutput(
      `MANUSCRIPT STATS — ${new Date().toLocaleDateString()}\n` +
      `Chapters:      ${CHAPTER_DATA.length} total | ${scored.length} scored | ${blockers.length} blocked\n` +
      `Mean Ω:        ${mean.toFixed(2)} (target: ${TARGET_OMEGA})\n` +
      `Gap to target: ${(TARGET_OMEGA - mean).toFixed(2)} Ω points\n` +
      `Elite/Near:    ${elite.length} chapters at ≥${ELITE_THRESHOLD}\n` +
      `Total words:   ${totalWords.toLocaleString()}\n` +
      `Baseline:      ${BASELINE} → Projected: ${PROJ_MEAN}\n` +
      `Formula:       ${OMEGA_SPEC.formulaString}\n` +
      `Ceiling:       ${OMEGA_SPEC.ceiling.toFixed(3)}\n` +
      `Audit v3:      ${AUDIT_V3_DATE}\n` +
      `Finding:       ${AUDIT_V3_CRITICAL_FINDING}`
    );
  }

  if (cmd === 'blockers') {
    const bl = CHAPTER_DATA.filter(c => c.status === 'blocker');
    return setOutput(bl.length === 0 ? 'No active blockers.' :
      `BLOCKER CHAPTERS (${bl.length}):\n` + bl.map(c => `  Ch.${String(c.n).padStart(2)} | Ω ${c.omega} | ${c.title}\n         ${c.notes}`).join('\n'));
  }

  if (cmd === 'elite') {
    const el = CHAPTER_DATA.filter(c => c.omega >= ELITE_THRESHOLD).sort((a, b) => b.omega - a.omega);
    return setOutput(el.length === 0 ? 'No Elite/Near-Elite chapters yet.' :
      `ELITE / NEAR-ELITE (${el.length}):\n` + el.map(c => `  Ch.${String(c.n).padStart(2)} | Ω ${c.omega} | ${getTier(c.omega).toUpperCase().padEnd(10)} | ${c.title}`).join('\n'));
  }

  if (cmd === 'immediate') {
    const im = CHAPTER_DATA.filter(c => c.priority === 'immediate');
    return setOutput(`IMMEDIATE PRIORITY (${im.length}):\n` +
      im.map(c => `  Ch.${String(c.n).padStart(2)} | Ω ${c.omega} | ${c.title}\n         ${c.notes}`).join('\n'));
  }

  // chapter lookup
  const numMatch = cmd.match(/^(?:prompt\s+|ch\.?)?(\d+)$/);
  if (numMatch) {
    const n = parseInt(numMatch[1]);
    const ch = CHAPTER_DATA.find(c => c.n === n);
    if (!ch) return setOutput(`Chapter ${n} not found.`);
    setSelected(ch);
    setView('detail');
    return setOutput(
      `Loading Chapter ${n} — ${ch.title}…\n` +
      `Ω: ${ch.omega} | Tier: ${ch.tier_label || getTier(ch.omega).toUpperCase()} | Status: ${ch.status}\n` +
      `Priority: ${ch.priority.toUpperCase()} | Triage: ${ch.triage || '—'} | Risk: ${ch.risk || '—'}\n\n` +
      ch.notes
    );
  }

  setOutput(`Unknown command: "${input}"\nType "help" for command list.`);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PromptMaster() {
  const [view, setView] = useState('terminal'); // 'terminal' | 'grid' | 'detail'
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(HELP_TEXT);
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [selected, setSelected] = useState(null);
  const [filterAct, setFilterAct] = useState('all');
  const [filterPri, setFilterPri] = useState('all');
  const [CHAPTER_DATA, setChapterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    base44.entities.Chapter.list('chapter_number', 500).then((data) => {
      setChapterData(data.map(mapChapter).sort((a, b) => a.n - b.n));
      setLoading(false);
    });
  }, []);

  useEffect(() => { if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; }, [output]);
  useEffect(() => { if (view === 'terminal' && !loading) inputRef.current?.focus(); }, [view, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setHistory(h => [input, ...h]);
    setHistIdx(-1);
    runCommand(input, setOutput, setSelected, setView, CHAPTER_DATA);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] || '');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : history[idx]);
    }
  };

  const gridChapters = CHAPTER_DATA.filter(ch => {
    if (filterAct !== 'all' && ch.act !== filterAct) return false;
    if (filterPri !== 'all' && ch.priority !== filterPri) return false;
    return true;
  });

  const scoredData = CHAPTER_DATA.filter(c => c.omega > 0);
  const meanOmega = scoredData.length ? (scoredData.reduce((s, c) => s + c.omega, 0) / scoredData.length).toFixed(2) : '—';
  const eliteCount = CHAPTER_DATA.filter(c => c.omega >= ELITE_THRESHOLD).length;
  const blockerCount = CHAPTER_DATA.filter(c => c.status === 'blocker').length;
  const chapterCount = CHAPTER_DATA.length;

  if (loading) {
    return (
      <div className="p-4 lg:p-6 max-w-6xl mx-auto flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> Loading audited chapter scores…
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          LitCentral PromptMaster · {GOVERNANCE_VERSION}
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-mono">SGT RAMOS — REVISION TERMINAL</h1>
            <p className="text-muted-foreground text-sm mt-0.5 font-mono">{chapterCount} chapters · Ω {meanOmega} (audited) → target {TARGET_OMEGA} · {eliteCount} Elite · {blockerCount} Blocked</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono font-bold transition-colors ${
                view === 'terminal' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground hover:text-foreground'
              }`}>
              <Terminal className="w-3.5 h-3.5" /> Terminal
            </button>
            <button onClick={() => setView('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono font-bold transition-colors ${
                view === 'grid' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground hover:text-foreground'
              }`}>
              <LayoutGrid className="w-3.5 h-3.5" /> Overview Grid
            </button>
          </div>
        </div>
      </div>

      {/* Stat banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {[
          { label: 'Mean Ω', val: meanOmega, color: 'text-amber-400' },
          { label: 'Target Ω', val: TARGET_OMEGA, color: 'text-emerald-400' },
          { label: 'Ceiling Ω', val: OMEGA_SPEC.ceiling.toFixed(1), color: 'text-muted-foreground' },
          { label: 'Elite / Near', val: `${eliteCount}/${chapterCount}`, color: 'text-amber-400' },
          { label: 'Blockers', val: blockerCount, color: blockerCount > 0 ? 'text-red-400' : 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="rounded border border-border bg-card px-3 py-2 text-center">
            <div className={`font-mono font-bold text-lg ${s.color}`}>{s.val}</div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── TERMINAL VIEW ── */}
      {view === 'terminal' && (
        <div className="rounded-lg border border-border bg-[hsl(222,14%,6%)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50 bg-card/30">
            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-amber-500/60" /><div className="w-3 h-3 rounded-full bg-emerald-500/60" /></div>
            <span className="font-mono text-[10px] text-muted-foreground ml-2">litcentral-promptmaster — bash</span>
          </div>
          <div ref={outputRef} className="font-mono text-[11px] text-emerald-300/80 p-4 h-72 overflow-auto whitespace-pre-wrap leading-relaxed">
            {output}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-border/50">
            <span className="font-mono text-amber-400 text-sm shrink-0">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='type "prompt 9" or "overview" or just a chapter number…'
              className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder-muted-foreground/40 focus:outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="shrink-0 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono hover:bg-amber-500/20 transition-colors">
              EXEC
            </button>
          </form>

          {/* Quick command shortcuts */}
          <div className="px-4 py-2 border-t border-border/30 flex flex-wrap gap-1.5">
            {[
              { cmd: 'overview', label: 'Overview' },
              { cmd: 'stats', label: 'Stats' },
              { cmd: 'blockers', label: 'Blockers' },
              { cmd: 'elite', label: 'Elite' },
              { cmd: 'immediate', label: 'Immediate' },
              ...[...CHAPTER_DATA].sort((a, b) => a.omega - b.omega).slice(0, 8).sort((a, b) => a.n - b.n).map(c => ({ cmd: `prompt ${c.n}`, label: `Ch.${c.n}` })),
            ].map(({ cmd, label }) => (
              <button key={cmd} onClick={() => { runCommand(cmd, setOutput, setSelected, setView, CHAPTER_DATA); }}
                className="font-mono text-[9px] px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-amber-400 hover:border-amber-500/30 transition-colors">
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {view === 'grid' && (
        <>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs text-muted-foreground">Act:</span>
            {['all', 'I', 'II', 'III'].map(a => (
              <button key={a} onClick={() => setFilterAct(a)}
                className={`px-2.5 py-0.5 text-xs font-mono rounded border transition-colors ${
                  filterAct === a ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground hover:text-foreground'
                }`}>{a === 'all' ? 'All Acts' : `Act ${a}`}</button>
            ))}
            <span className="text-xs text-muted-foreground ml-2">Priority:</span>
            {['all', 'immediate', 'next', 'routine'].map(p => (
              <button key={p} onClick={() => setFilterPri(p)}
                className={`px-2.5 py-0.5 text-xs font-mono rounded border transition-colors ${
                  filterPri === p ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground hover:text-foreground'
                }`}>{p === 'all' ? 'All' : p}</button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {Object.entries(TIER_CONFIG).filter(([k]) => k !== 'unscored').map(([k, cfg]) => (
              <div key={k} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[10px] text-red-400">Blocker</span></div>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-9 gap-1.5 mb-4">
            {gridChapters.map(ch => (
              <GridCell key={ch.n} ch={ch} onSelect={ch => { setSelected(ch); setView('detail'); }} isSelected={selected?.n === ch.n} />
            ))}
          </div>

          {/* Act breakdown */}
          {['I', 'II', 'III'].map(act => {
            const actChs = CHAPTER_DATA.filter(c => c.act === act);
            const actMean = (actChs.reduce((s, c) => s + c.omega, 0) / actChs.length).toFixed(2);
            const actElite = actChs.filter(c => c.omega >= ELITE_THRESHOLD).length;
            return (
              <div key={act} className="mb-2 rounded border border-border bg-card px-4 py-2 flex items-center gap-4 flex-wrap">
                <span className="font-mono font-bold text-sm text-amber-400">Act {act}</span>
                <span className="text-xs text-muted-foreground">{actChs.length} chapters</span>
                <span className="text-xs">Mean Ω: <strong className="font-mono">{actMean}</strong></span>
                <span className="text-xs">Elite: <strong className="text-amber-400">{actElite}</strong></span>
              </div>
            );
          })}
        </>
      )}

      {/* ── DETAIL VIEW ── */}
      {view === 'detail' && selected && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => setView('terminal')} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Terminal className="w-3.5 h-3.5" /> Terminal
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <button onClick={() => setView('grid')} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <LayoutGrid className="w-3.5 h-3.5" /> Grid
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-amber-400">Ch.{selected.n} — {selected.title}</span>
          </div>
          <ChapterCard ch={selected} onClose={() => setView('grid')} />

          {/* Adjacent chapter navigation */}
          <div className="flex items-center justify-between gap-4">
            {selected.n > 1 && (
              <button onClick={() => setSelected(CHAPTER_DATA.find(c => c.n === selected.n - 1))}
                className="flex items-center gap-2 px-3 py-2 rounded border border-border text-xs text-muted-foreground hover:text-foreground hover:border-amber-500/30 transition-colors">
                ← Ch.{selected.n - 1}: {CHAPTER_DATA.find(c => c.n === selected.n - 1)?.title}
              </button>
            )}
            <div className="flex-1" />
            {selected.n < Math.max(...CHAPTER_DATA.map(c => c.n)) && (
              <button onClick={() => setSelected(CHAPTER_DATA.find(c => c.n === selected.n + 1))}
                className="flex items-center gap-2 px-3 py-2 rounded border border-border text-xs text-muted-foreground hover:text-foreground hover:border-amber-500/30 transition-colors">
                Ch.{selected.n + 1}: {CHAPTER_DATA.find(c => c.n === selected.n + 1)?.title} →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}