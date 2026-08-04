import { Sigma, Scale, ClipboardCheck, BookOpen } from 'lucide-react';

export default function Rules() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          RF 1.5 Governance
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Rules & Governance</h1>
        <p className="text-muted-foreground mt-1 text-sm">Locked scoring formula, claim ladder, and editorial checklist</p>
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sigma className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Locked RF 1.5 Formula</h2>
        </div>
        <div className="font-mono text-lg text-amber-400 font-bold bg-background/50 rounded-md p-4">
          Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.1005·MRF
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { code: 'CLS', name: 'Chicano Literary Style' },
            { code: 'BIS', name: 'Biographical Integrity' },
            { code: 'SII', name: 'Sensory Integration Index' },
            { code: 'MRF', name: 'Narrative Compression' },
          ].map(({ code, name }) => (
            <div key={code} className="rounded-md border border-border bg-card p-3">
              <div className="font-mono font-bold text-amber-400">{code}</div>
              <div className="text-xs text-muted-foreground mt-1">{name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Editorial Claim Ladder</h2>
        </div>
        <div className="space-y-3">
          {[
            { level: 'Documented', desc: 'Supported by primary source evidence, archival records, or verified testimony', color: 'text-emerald-400' },
            { level: 'Probable', desc: 'Strong circumstantial evidence, multiple secondary sources agree', color: 'text-teal-400' },
            { level: 'Emotionally True', desc: 'Resonates with lived experience even if specific details are composite or dramatized', color: 'text-amber-400' },
            { level: 'Legally Hot', desc: 'Requires legal review before publication — defamation, privacy, or classification risk', color: 'text-red-400' },
          ].map(({ level, desc, color }) => (
            <div key={level} className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0">
              <span className={`font-mono text-xs font-bold ${color} mt-0.5 shrink-0 w-28`}>{level}</span>
              <span className="text-sm text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheck className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Governance Checklist</h2>
        </div>
        <div className="space-y-2">
          {[
            'Canon — character details, timelines, and events remain consistent across all chapters',
            'Chicano Lens — cultural identity drives perception, decision, and ethics rather than decoration',
            'Military Accuracy — tactical procedures, equipment, radio protocol, and command structure are credible',
            'Historical Accuracy — casualty figures, institutional details, and dates are grounded in documented evidence',
            'Narrative Continuity — plot threads, character arcs, and symbolic motifs carry through all 45 chapters',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 border-b border-border/50 pb-2 last:border-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}