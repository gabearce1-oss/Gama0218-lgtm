import { AlertTriangle, HelpCircle } from 'lucide-react';
import { detectGenericPatterns, VETTING_QUESTIONS } from '@/lib/betaVetting';

// A single Beta passage rendered as a suggestion to VET — never as ready prose.
// Flags AI-generic patterns and shows the four-question insertion test.
export default function PassageVettingCard({ passage, index }) {
  const p = passage;
  const flags = detectGenericPatterns(p.passage_text);
  const isFlagged = flags.length > 0;

  return (
    <div className={`border-l-2 pl-4 ${isFlagged ? 'border-red-500/40' : 'border-orange-500/20'}`}>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="text-[9px] font-mono text-muted-foreground">Suggestion {index + 1}</span>
        {p.voice_dimension && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{p.voice_dimension}</span>
        )}
        {p.opportunity_type && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">{p.opportunity_type}</span>
        )}
        {p.match_score != null && (
          <span className="text-[9px] font-mono text-cyan-400">match: {p.match_score}</span>
        )}
        {isFlagged && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-2.5 h-2.5" /> AI-generic tell
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{p.passage_text}</p>

      {isFlagged && (
        <p className="text-[10px] text-red-400/90 mt-1.5">
          Recognizable generative pattern{flags.length > 1 ? 's' : ''}: {flags.map((f) => `"${f}"`).join(', ')}. Rewrite in this character's specific voice or discard.
        </p>
      )}

      {p.suggested_application && (
        <p className="text-[11px] text-muted-foreground italic mt-1.5">↳ {p.suggested_application}</p>
      )}

      {/* Four-question insertion test */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
          <HelpCircle className="w-2.5 h-2.5" /> Insert only if all yes:
        </span>
        {VETTING_QUESTIONS.map((q, i) => (
          <span key={i} className="text-[10px] text-muted-foreground/80">{i + 1}. {q}</span>
        ))}
      </div>
    </div>
  );
}