import { Link } from 'react-router-dom';

const DIMENSIONS = [
  { key: 'voice', label: 'Voice', desc: 'Vocal authenticity' },
  { key: 'lens', label: 'Lens', desc: 'Narrative lens' },
  { key: 'cs_score', label: 'CS', desc: 'Code-switching' },
  { key: 'familia', label: 'Familia', desc: 'Family presence' },
  { key: 'barrio', label: 'Barrio', desc: 'Community origin' },
  { key: 'hist', label: 'Hist', desc: 'Historical truth' },
  { key: 'carnalismo', label: 'Carnal', desc: 'Brotherhood' },
  { key: 'composite', label: 'Ω Comp', desc: 'Composite score' },
  { key: 'bugs', label: 'Bugs', desc: 'Narrative inconsistencies', risk: true },
  { key: 'smells', label: 'Smells', desc: 'Cliché or forced moments', risk: true },
  { key: 'vulnerabilities', label: 'Vuln', desc: 'Weak voice points', risk: true },
];

const TIER_STYLES = {
  CR: 'bg-red-500/15 text-red-400 border-red-500/30',
  HI: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  ME: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

function scoreColor(val, isRisk) {
  if (val === undefined || val === null) return 'text-muted-foreground';
  if (isRisk) {
    if (val >= 3) return 'text-red-400';
    if (val >= 2.3) return 'text-amber-400';
    return 'text-emerald-400';
  }
  if (val >= 3) return 'text-emerald-400';
  if (val >= 2.3) return 'text-amber-400';
  return 'text-red-400';
}

function scoreBg(val, isRisk) {
  if (val === undefined || val === null) return '';
  if (isRisk) {
    if (val >= 3) return 'bg-red-500/10';
    if (val >= 2.3) return 'bg-amber-500/10';
    return 'bg-emerald-500/10';
  }
  if (val >= 3) return 'bg-emerald-500/10';
  if (val >= 2.3) return 'bg-amber-500/10';
  return 'bg-red-500/10';
}

export default function VoiceAuditTable({ chapters }) {
  const sorted = [...chapters].sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0));

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground whitespace-nowrap">Ch#</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground min-w-[180px]">Title</th>
              {DIMENSIONS.map(d => (
                <th key={d.key} className="text-center px-2 py-2.5 font-medium text-muted-foreground whitespace-nowrap" title={d.desc}>
                  <div className="text-xs">{d.label}</div>
                </th>
              ))}
              <th className="text-center px-2 py-2.5 font-medium text-muted-foreground whitespace-nowrap">Tier</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground whitespace-nowrap">Triage</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(ch => {
              const hasAudit = ch.composite !== undefined && ch.composite !== null;
              return (
                <tr key={ch.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    <Link to={`/chapter/${ch.id}`} className="hover:text-amber-400">
                      {String(ch.chapter_number).padStart(2, '0')}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    <Link to={`/chapter/${ch.id}`} className="hover:text-amber-400 line-clamp-1">
                      {ch.title}
                    </Link>
                  </td>
                  {DIMENSIONS.map(d => {
                    const val = ch[d.key];
                    const isComposite = d.key === 'composite';
                    const isRisk = d.risk;
                    return (
                      <td key={d.key} className={`px-2 py-2 text-center font-mono ${isComposite ? 'font-bold' : ''} ${scoreColor(val, isRisk)} ${scoreBg(val, isRisk)}`}>
                        {val !== undefined && val !== null ? val.toFixed(isComposite ? 2 : 1) : '—'}
                      </td>
                    );
                  })}
                  <td className="px-2 py-2 text-center">
                    {ch.tier_label && (
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${TIER_STYLES[ch.tier_label] || 'border-border text-muted-foreground'}`}>
                        {ch.tier_label}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">{ch.triage || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}