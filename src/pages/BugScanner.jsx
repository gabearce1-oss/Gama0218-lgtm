import { useState } from 'react';
import { Bug, Copy, Check, AlertTriangle, AlertOctagon, Info, Trash2, Plus, X, Download, ChevronDown, ChevronRight, Wand2, BookOpen, Zap } from 'lucide-react';
import ReadabilityPanel from '@/components/ReadabilityPanel';
import { analyzeReadability } from '@/lib/readability';

// ─── Bug Detection Rules ──────────────────────────────────────────────────────

const MILITARY_CAPS = new Set([
  'USMC','POW','MIA','KIA','USA','NVA','VC','DMZ','LZ','CO','NCO','RPG','AK',
  'LOC','DOD','MOS','SOG','CIA','FBI','HQ','OP','LP','FOB','ROE','TOC',
  'MEDEVAC','SITREP','FUBAR','SNAFU','AWOL','PTSD','DOA','EOD','CID',
]);

const BUG_RULES = [
  // P0 — Process Debris
  { id: 'hashtag',           label: 'Hashtag in prose',           severity: 'P0', pattern: /#\S+/g,                          desc: 'Markdown heading or social tag leaked into chapter text',      autofix: (v) => v.replace(/^#+ ?/, '') },
  { id: 'sprint_sealed',     label: 'SPRINT SEALED tag',          severity: 'P0', pattern: /SPRINT[\s_]SEALED/gi,            desc: 'Process artifact — must not appear in prose',                  autofix: () => '' },
  { id: 'revision_manifest', label: 'REVISION MANIFEST',          severity: 'P0', pattern: /REVISION[\s_]MANIFEST/gi,        desc: 'Editorial label leaked into prose',                            autofix: () => '' },
  { id: 'rf_score',          label: 'RF score label',             severity: 'P0', pattern: /RF[\s\-]?1\.5[\s\-]?SCORE:/gi,  desc: 'Scoring artifact in chapter text',                             autofix: () => '' },
  { id: 'omega_score',       label: 'Omega score artifact',       severity: 'P0', pattern: /Ω\s*=\s*[\d.]+/g,               desc: 'Formula output pasted into prose',                             autofix: () => '' },
  { id: 'litcentral_tag',    label: 'LitCentral tag',             severity: 'P0', pattern: /LITCENTRAL/gi,                   desc: 'Platform label in prose',                                      autofix: () => '' },
  { id: 'injection_card',    label: 'INJECTION CARD',             severity: 'P0', pattern: /INJECTION[\s_]CARD/gi,           desc: 'Editorial process artifact',                                   autofix: () => '' },
  { id: 'spss_tag',          label: 'SPSS tag',                   severity: 'P0', pattern: /\bSPSS\b/g,                     desc: 'Statistical software tag in prose',                            autofix: () => '' },
  { id: 'copy_paste',        label: 'COPY-PASTE artifact',        severity: 'P0', pattern: /COPY[\s\-]PASTE/gi,             desc: 'Process debris',                                               autofix: () => '' },
  { id: 'tier_tag',          label: 'TIER / OMEGA ELITE tag',     severity: 'P0', pattern: /\b(OMEGA ELITE|TIER-[A-Z]|GOLD\+)\b/g, desc: 'Scoring tier label in prose',                           autofix: () => '' },
  { id: 'prompt_label',      label: 'Prompt label',               severity: 'P0', pattern: /\bREVISION PROMPT\b/gi,         desc: 'Prompt scaffold leaked into prose',                            autofix: () => '' },
  { id: 'bracket_note',      label: 'Bracketed editorial note',   severity: 'P0', pattern: /\[[A-Z][^\]]{3,60}\]/g,         desc: 'Editorial bracket note not removed',                           autofix: () => '' },
  { id: 'sprint_label',      label: 'SPRINT label',               severity: 'P0', pattern: /\bSPRINT[\s_]\d+\b/gi,         desc: 'Sprint number artifact in prose',                              autofix: () => '' },
  { id: 'gate_label',        label: 'Gate label',                 severity: 'P0', pattern: /\bGATE[\s_][1-4]\b/gi,         desc: 'Governance gate label in prose',                               autofix: () => '' },
  { id: 'omega_symbol',      label: 'Standalone Ω symbol',        severity: 'P0', pattern: /\bΩ\b/g,                       desc: 'Omega scoring symbol in prose',                                autofix: () => '' },
  { id: 'cls_metric',        label: 'CLS/BIS/SII/MRF metric tag', severity: 'P0', pattern: /\b(CLS|BIS|SII|MRF)\s*[:=]/g, desc: 'Score metric label in prose',                                   autofix: () => '' },
  { id: 'autocrit_tag',      label: 'AutoCrit / LitCentral ref',  severity: 'P0', pattern: /\b(AutoCrit|LitCentral|SPSS Tracking)\b/gi, desc: 'Editorial tool name in prose',                    autofix: () => '' },
  { id: 'word_count_tag',    label: 'Word count artifact',        severity: 'P0', pattern: /\bWORD[\s_]COUNT[\s:]/gi,       desc: 'Metadata label in prose',                                      autofix: () => '' },
  { id: 'cloud_disclosure',  label: 'Cloud-model disclosure',     severity: 'P0', pattern: /\b(as an ai|as a language model|ai-generated|generated (?:by|with) (?:an )?ai)\b/gi, desc: 'Potential cloud-generation disclosure — review in context; never auto-remove.', },
  { id: 'true_voice_claim',  label: 'True-voice claim',           severity: 'P0', pattern: /\b(true voice|authentic voice|voice that feels true)\b/gi, desc: 'Potential cloud or editorial assurance phrase — review in context; never auto-remove.', },
  { id: 'assistant_boilerplate', label: 'Assistant boilerplate',   severity: 'P0', pattern: /\b(certainly[!,.]?|i hope this helps|here(?:’|')?s (?:a|the) (?:revised|polished|enhanced))\b/gi, desc: 'Potential assistant-style boilerplate — review in context; never auto-remove.', },

  // P1 — Formatting Artifacts
  { id: 'double_dash',       label: 'Double dash (--)',           severity: 'P1', pattern: /--(?!-)/g,                      desc: 'Should be em-dash (—)',                                        autofix: () => '—' },
  { id: 'triple_dash',       label: 'Triple dash (---)',          severity: 'P1', pattern: /---/g,                          desc: 'Should be em-dash (—) or scene break',                         autofix: () => '—' },
  { id: 'broken_ellipsis',   label: 'Three periods (not ellipsis)', severity: 'P1', pattern: /\.{3}/g,                     desc: 'Should use proper ellipsis character (…)',                      autofix: () => '…' },
  { id: 'double_space',      label: 'Double space',               severity: 'P1', pattern: / {2,}/g,                       desc: 'Extra whitespace between words',                               autofix: () => ' ' },
  { id: 'trailing_space',    label: 'Trailing whitespace',        severity: 'P1', pattern: /[ \t]+$/gm,                    desc: 'Whitespace at end of line',                                    autofix: () => '' },
  { id: 'stray_asterisk',    label: 'Stray asterisk',             severity: 'P1', pattern: /\*{1,3}[^*\n]{1,60}\*{1,3}|\*(?!\*)/g, desc: 'Markdown bold/italic not converted',                  autofix: (v) => v.replace(/\*/g, '') },
  { id: 'backtick',          label: 'Backtick in prose',          severity: 'P1', pattern: /`[^`\n]{0,80}`|`/g,           desc: 'Code formatting artifact',                                     autofix: (v) => v.replace(/`/g, '') },
  { id: 'smart_quote_fail',  label: 'Straight double quote',      severity: 'P1', pattern: /"[^"]{0,80}"/g,               desc: 'Straight quotes should be curly/smart quotes',                 autofix: (v) => '\u201c' + v.slice(1,-1) + '\u201d' },
  { id: 'straight_apos',     label: "Straight apostrophe",        severity: 'P1', pattern: /(?<=[a-zA-Z])'(?=[a-zA-Z])/g, desc: 'Straight apostrophe should be curly (\u2019)',                 autofix: () => '\u2019' },
  { id: 'double_punct',      label: 'Double punctuation',         severity: 'P1', pattern: /[.!?,]{2,}/g,                 desc: 'Repeated punctuation mark',                                    autofix: (v) => v[0] },
  { id: 'windows_return',    label: 'Windows line ending',        severity: 'P1', pattern: /\r\n/g,                       desc: 'CRLF line endings — convert to LF',                            autofix: () => '\n' },

  // P2 — Anomalies
  { id: 'all_caps_word',     label: 'ALL-CAPS word',              severity: 'P2', pattern: /\b[A-Z]{3,}\b/g,              desc: 'Possible process label or shouting — check if intentional',   skipWords: MILITARY_CAPS },
  { id: 'url_in_prose',      label: 'URL in prose',               severity: 'P2', pattern: /https?:\/\/\S+/g,             desc: 'Web URL in chapter text',                                      autofix: () => '' },
  { id: 'repeated_word',     label: 'Repeated adjacent word',     severity: 'P2', pattern: /\b(\w{3,})\s+\1\b/gi,        desc: 'Same word repeated consecutively',                             autofix: (v) => v.split(/\s+/)[0] },
  { id: 'number_artifact',   label: 'Suspicious large number',    severity: 'P2', pattern: /\b(10[0-9]\.\d{2,}|\d{5,})\b/g, desc: 'Possible score or word-count artifact (verify: dates, coords are OK)' },
  { id: 'em_dash_space',     label: 'Em-dash with spaces',        severity: 'P2', pattern: / — /g,                        desc: 'Em-dash should have no surrounding spaces in prose',           autofix: () => '—' },
  { id: 'lone_hyphen',       label: 'Lone hyphen on line',        severity: 'P2', pattern: /^\s*-\s*$/gm,                 desc: 'Scene break? Use # # # or *** instead of a lone hyphen' },
];

const SEVERITY_CONFIG = {
  P0: { label: 'Critical',    color: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/30',   icon: AlertOctagon },
  P1: { label: 'Major',       color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle },
  P2: { label: 'Minor',       color: 'text-sky-400',   bg: 'bg-sky-500/10',   border: 'border-sky-500/30',   icon: Info },
};

// ─── Scanner Engine ───────────────────────────────────────────────────────────

function scanText(text) {
  const findings = [];
  for (const rule of BUG_RULES) {
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags.includes('g') ? rule.pattern.flags : rule.pattern.flags + 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const value = match[0];
      if (rule.skipWords && rule.skipWords.has(value.trim())) continue;
      const start = Math.max(0, match.index - 60);
      const end = Math.min(text.length, match.index + value.length + 60);
      findings.push({
        id: `${rule.id}-${match.index}`,
        ruleId: rule.id,
        label: rule.label,
        severity: rule.severity,
        desc: rule.desc,
        value,
        autofix: rule.autofix,
        context: {
          before: text.slice(start, match.index),
          match: value,
          after: text.slice(match.index + value.length, end),
        },
        index: match.index,
      });
    }
  }
  const order = { P0: 0, P1: 1, P2: 2 };
  return findings.sort((a, b) => order[a.severity] - order[b.severity] || a.index - b.index);
}

function autoFixText(text) {
  let result = text;
  for (const rule of BUG_RULES) {
    if (!rule.autofix) continue;
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags.includes('g') ? rule.pattern.flags : rule.pattern.flags + 'g');
    result = result.replace(regex, (match) => {
      if (rule.skipWords && rule.skipWords.has(match.trim())) return match;
      return rule.autofix(match);
    });
  }
  return result;
}

function buildReport(chapters, allFindings) {
  const lines = ['BUG SCANNER REPORT', '==================', ''];
  chapters.forEach((ch, i) => {
    const findings = allFindings[i] || [];
    lines.push(`CHAPTER: ${ch.name}`);
    lines.push(`Bugs: P0=${findings.filter(f=>f.severity==='P0').length} P1=${findings.filter(f=>f.severity==='P1').length} P2=${findings.filter(f=>f.severity==='P2').length}`);
    if (findings.length === 0) {
      lines.push('  ✓ CLEAN');
    } else {
      findings.forEach(f => {
        lines.push(`  [${f.severity}] ${f.label} — "${f.value}"`);
        lines.push(`    ${f.desc}`);
        lines.push(`    Context: …${f.context.before}【${f.context.match}】${f.context.after}…`);
      });
    }
    lines.push('');
  });
  return lines.join('\n');
}

// ─── Components ───────────────────────────────────────────────────────────────

function FindingCard({ finding }) {
  const cfg = SEVERITY_CONFIG[finding.severity];
  const Icon = cfg.icon;
  return (
    <div className={`rounded-lg border ${cfg.border} ${cfg.bg} p-3`}>
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${cfg.color} shrink-0`} />
          <span className={`font-mono text-[10px] font-bold ${cfg.color}`}>{finding.severity}</span>
          <span className="text-xs font-bold">{finding.label}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {finding.autofix && (
            <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded">autofix ✓</span>
          )}
          <code className={`font-mono text-[10px] px-1.5 py-0.5 rounded bg-background/60 border border-border ${cfg.color} max-w-[100px] truncate`}>
            {JSON.stringify(finding.value)}
          </code>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mb-1.5">{finding.desc}</p>
      <div className="font-mono text-[10px] bg-background/60 rounded px-3 py-2 text-muted-foreground leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
        <span className="opacity-60">…{finding.context.before}</span>
        <span className={`${cfg.color} font-bold`}>[{finding.context.match}]</span>
        <span className="opacity-60">{finding.context.after}…</span>
      </div>
    </div>
  );
}

function SummaryBar({ findings, compact = false }) {
  const counts = { P0: 0, P1: 0, P2: 0 };
  findings.forEach(f => counts[f.severity]++);
  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(SEVERITY_CONFIG).map(([sev, cfg]) => (
          <span key={sev} className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${cfg.border} ${cfg.bg} ${cfg.color}`}>
            {sev}: {counts[sev]}
          </span>
        ))}
        <span className="text-[10px] text-muted-foreground font-mono">Total: {findings.length}</span>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {Object.entries(SEVERITY_CONFIG).map(([sev, cfg]) => (
        <div key={sev} className={`rounded-lg border ${cfg.border} ${cfg.bg} p-3 text-center`}>
          <div className={`font-mono font-bold text-xl ${cfg.color}`}>{counts[sev]}</div>
          <div className={`text-[10px] font-bold ${cfg.color} mt-0.5`}>{sev} — {cfg.label}</div>
        </div>
      ))}
    </div>
  );
}

function ChapterBlock({ chapter, findings, readability, index, onRemove, onAutoFix }) {
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState('all');
  const cfg_p0 = SEVERITY_CONFIG.P0;
  const hasP0 = findings.some(f => f.severity === 'P0');
  const filtered = filter === 'all' ? findings : findings.filter(f => f.severity === filter);

  return (
    <div className={`rounded-lg border ${hasP0 ? 'border-red-500/40' : 'border-border'} bg-card overflow-hidden`}>
      {/* Chapter header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
        <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate">{chapter.name || `Chapter ${index + 1}`}</div>
          <SummaryBar findings={findings} compact />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {findings.length === 0 && (
            <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">✓ CLEAN</span>
          )}
          {findings.length > 0 && onAutoFix && (
            <button
              onClick={(e) => { e.stopPropagation(); onAutoFix(index); }}
              className="flex items-center gap-1 px-2 py-1 text-[9px] font-mono rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Wand2 className="w-3 h-3" /> Auto-Fix
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            className="text-muted-foreground hover:text-red-400 transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {open && readability && (
        <div className="border-t border-border px-4 pt-3">
          <ReadabilityPanel readability={readability} compact />
        </div>
      )}

      {/* Body */}
      {open && findings.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          {/* Filter pills */}
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {['all', 'P0', 'P1', 'P2'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                  filter === f
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {f === 'all' ? `All (${findings.length})` : `${f} (${findings.filter(x => x.severity === f).length})`}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filtered.map(finding => <FindingCard key={finding.id} finding={finding} />)}
            {filtered.length === 0 && (
              <div className="text-center text-muted-foreground text-xs py-4">No {filter} findings.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BugScanner() {
  const [mode, setMode] = useState('single'); // 'single' | 'batch'

  // Single mode
  const [text, setText] = useState('');
  const [findings, setFindings] = useState(null);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [copied, setCopied] = useState(false);
  const [fixedText, setFixedText] = useState(null);

  // Batch mode
  const [chapters, setChapters] = useState([{ name: 'Chapter 1', text: '' }]);
  const [batchFindings, setBatchFindings] = useState(null);
  const [batchCopied, setBatchCopied] = useState(false);

  // Single scan
  const handleScan = () => {
    if (!text.trim()) return;
    setFindings(scanText(text));
    setSeverityFilter('all');
    setFixedText(null);
  };

  const handleClear = () => { setText(''); setFindings(null); setFixedText(null); };

  const handleCopy = () => {
    if (!findings) return;
    const report = findings.map(f =>
      `[${f.severity}] ${f.label} — "${f.value}"\n  ${f.desc}\n  Context: …${f.context.before}【${f.context.match}】${f.context.after}…`
    ).join('\n\n');
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAutoFix = () => {
    const fixed = autoFixText(text);
    setFixedText(fixed);
    setFindings(scanText(fixed));
  };

  const handleCopyFixed = () => {
    navigator.clipboard.writeText(fixedText).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  // Batch scan
  const addChapter = () => setChapters(c => [...c, { name: `Chapter ${c.length + 1}`, text: '' }]);

  const removeChapter = (i) => setChapters(c => c.filter((_, idx) => idx !== i));

  const updateChapter = (i, field, val) =>
    setChapters(c => c.map((ch, idx) => idx === i ? { ...ch, [field]: val } : ch));

  const handleBatchScan = () => {
    setBatchFindings(chapters.map(ch => scanText(ch.text)));
  };

  const handleBatchAutoFix = (i) => {
    const fixed = autoFixText(chapters[i].text);
    updateChapter(i, 'text', fixed);
    setBatchFindings(prev => {
      if (!prev) return prev;
      const next = [...prev];
      next[i] = scanText(fixed);
      return next;
    });
  };

  const handleDownloadReport = () => {
    if (!batchFindings) return;
    const report = buildReport(chapters, batchFindings);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'bug-scanner-report.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleBatchCopy = () => {
    if (!batchFindings) return;
    navigator.clipboard.writeText(buildReport(chapters, batchFindings)).then(() => {
      setBatchCopied(true); setTimeout(() => setBatchCopied(false), 2000);
    });
  };

  const filtered = findings
    ? (severityFilter === 'all' ? findings : findings.filter(f => f.severity === severityFilter))
    : [];

  const batchTotal = batchFindings ? batchFindings.flat().length : 0;
  const batchP0 = batchFindings ? batchFindings.flat().filter(f => f.severity === 'P0').length : 0;
  const cleanChapters = batchFindings ? batchFindings.filter(f => f.length === 0).length : 0;
  const batchReadability = batchFindings ? chapters.map((chapter) => analyzeReadability(chapter.text)) : [];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Bug className="w-4 h-4 text-amber-400" />
          Data Hygiene · Gate 1
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Bug Scanner</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Flags process debris, cloud-contamination evidence, formatting artifacts, and readability drift. Only safe formatting corrections can be auto-fixed.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setMode('single')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold border transition-colors ${
            mode === 'single' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Zap className="w-4 h-4" /> Single Chapter
        </button>
        <button
          onClick={() => setMode('batch')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold border transition-colors ${
            mode === 'batch' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Batch — All Chapters
        </button>
      </div>

      {/* ── SINGLE MODE ── */}
      {mode === 'single' && (
        <>
          <div className="rounded-lg border border-border bg-card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold">Paste Chapter Text</label>
              {text && (
                <button onClick={handleClear} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste the full chapter text here — the scanner will flag hashtags, revision tags, broken dashes, double spaces, all-caps artifacts, and other debris that slips past spellcheck…"
              className="w-full h-56 bg-background/60 border border-border rounded-md p-3 text-sm font-mono text-foreground placeholder-muted-foreground resize-y focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
            <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
              <span className="text-xs text-muted-foreground font-mono">
                {text.length > 0 ? `${text.split(/\s+/).filter(Boolean).length.toLocaleString()} words · ${text.length.toLocaleString()} chars` : 'No text yet'}
              </span>
              <div className="flex items-center gap-2">
                {findings && findings.some(f => f.autofix) && (
                  <button
                    onClick={handleAutoFix}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition-colors"
                  >
                    <Wand2 className="w-4 h-4" /> Auto-Fix Safe Issues
                  </button>
                )}
                <button
                  onClick={handleScan}
                  disabled={!text.trim()}
                  className="px-5 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Run Scanner
                </button>
              </div>
            </div>
          </div>

          {findings !== null && <ReadabilityPanel readability={analyzeReadability(text)} />}

          {/* Fixed text preview */}
          {fixedText !== null && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-emerald-400">Auto-Fixed Text</div>
                <button
                  onClick={handleCopyFixed}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Fixed Text'}
                </button>
              </div>
              <pre className="text-xs font-mono text-foreground/80 bg-background/60 rounded p-3 max-h-48 overflow-auto whitespace-pre-wrap">{fixedText}</pre>
            </div>
          )}

          {findings !== null && (
            <>
              <SummaryBar findings={findings} />
              {findings.length === 0 ? (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
                  <div className="text-emerald-400 font-bold text-lg mb-1">✓ No bugs detected</div>
                  <div className="text-muted-foreground text-sm">Clean pass — no formatting artifacts or process debris found.</div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Filter:</span>
                      {['all', 'P0', 'P1', 'P2'].map(f => (
                        <button key={f} onClick={() => setSeverityFilter(f)}
                          className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
                            severityFilter === f ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-border text-muted-foreground hover:text-foreground'
                          }`}>
                          {f === 'all' ? `All (${findings.length})` : `${f} (${findings.filter(x => x.severity === f).length})`}
                        </button>
                      ))}
                    </div>
                    <button onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy Report'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {filtered.map(finding => <FindingCard key={finding.id} finding={finding} />)}
                    {filtered.length === 0 && <div className="text-center text-muted-foreground text-sm py-8">No findings for this severity filter.</div>}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {/* ── BATCH MODE ── */}
      {mode === 'batch' && (
        <>
          <div className="space-y-4 mb-6">
            {chapters.map((ch, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    value={ch.name}
                    onChange={e => updateChapter(i, 'name', e.target.value)}
                    className="flex-1 bg-background/60 border border-border rounded px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                    placeholder="Chapter name…"
                  />
                  <button onClick={() => removeChapter(i)} className="text-muted-foreground hover:text-red-400 transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={ch.text}
                  onChange={e => updateChapter(i, 'text', e.target.value)}
                  placeholder={`Paste text for ${ch.name}…`}
                  className="w-full h-36 bg-background/60 border border-border rounded p-3 text-sm font-mono text-foreground placeholder-muted-foreground resize-y focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
                <div className="text-[10px] text-muted-foreground font-mono mt-1">
                  {ch.text.split(/\s+/).filter(Boolean).length.toLocaleString()} words
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <button onClick={addChapter}
              className="flex items-center gap-1.5 px-4 py-2 rounded border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
              <Plus className="w-4 h-4" /> Add Chapter
            </button>
            <button onClick={handleBatchScan} disabled={chapters.every(c => !c.text.trim())}
              className="flex items-center gap-1.5 px-5 py-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <Bug className="w-4 h-4" /> Scan All Chapters
            </button>
          </div>

          {batchFindings && (
            <>
              {/* Batch summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Total Bugs', val: batchTotal, color: batchTotal === 0 ? 'text-emerald-400' : 'text-red-400' },
                  { label: 'P0 Critical', val: batchP0, color: batchP0 === 0 ? 'text-emerald-400' : 'text-red-400' },
                  { label: 'Clean Chapters', val: `${cleanChapters}/${chapters.length}`, color: 'text-emerald-400' },
                  { label: 'Rules Active', val: BUG_RULES.length, color: 'text-amber-400' },
                ].map(m => (
                  <div key={m.label} className="rounded-lg border border-border bg-card p-3 text-center">
                    <div className={`font-mono font-bold text-2xl ${m.color}`}>{m.val}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="text-sm font-bold">Results — Chapter by Chapter</div>
                <div className="flex items-center gap-2">
                  <button onClick={handleBatchCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {batchCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {batchCopied ? 'Copied' : 'Copy Report'}
                  </button>
                  <button onClick={handleDownloadReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Download .txt
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {chapters.map((ch, i) => (
                  <ChapterBlock
                    key={i}
                    chapter={ch}
                    findings={batchFindings[i] || []}
                    readability={batchReadability[i]}
                    index={i}
                    onRemove={removeChapter}
                    onAutoFix={handleBatchAutoFix}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Rule reference */}
      <div className="mt-10 rounded-lg border border-border bg-card p-5">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
          {BUG_RULES.length} Rules Active — What This Scanner Catches
        </div>
        {Object.entries(SEVERITY_CONFIG).map(([sev, cfg]) => (
          <div key={sev} className="mb-4">
            <div className={`text-xs font-bold font-mono ${cfg.color} mb-2`}>{sev} — {cfg.label}</div>
            <div className="flex flex-wrap gap-1.5">
              {BUG_RULES.filter(r => r.severity === sev).map(r => (
                <span key={r.id} title={r.desc}
                  className={`font-mono text-[10px] rounded border px-2 py-0.5 ${r.autofix ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-border text-muted-foreground bg-background/50'}`}>
                  {r.label}{r.autofix ? ' ⚡' : ''}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="text-[10px] text-muted-foreground mt-2">⚡ = auto-fixable</div>
      </div>
    </div>
  );
}