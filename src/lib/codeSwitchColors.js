import { CODE_OPTIONS, FUNCTION_TAGS, CODE_LABELS } from '@/lib/codeSwitchData';

const CODE_COLORS = {
  ENG: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  CHENG: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  SPAN: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  CHSPAN: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  CALO: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  MIX: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  BORROW: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  NAME: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export function codeColor(code) {
  return CODE_COLORS[code] || 'bg-muted/20 text-muted-foreground border-border';
}

export function functionColor(tag) {
  return 'bg-violet-500/15 text-violet-400 border-violet-500/30';
}

export function matrixCellColor(count, max) {
  if (count === 0 || max === 0) return 'bg-muted/10 text-muted-foreground/40';
  const ratio = count / max;
  if (ratio >= 0.75) return 'bg-amber-500/30 text-amber-300 font-bold';
  if (ratio >= 0.5) return 'bg-amber-500/20 text-amber-400';
  if (ratio >= 0.25) return 'bg-amber-500/10 text-amber-400/70';
  return 'bg-amber-500/5 text-muted-foreground';
}

export { CODE_OPTIONS, FUNCTION_TAGS, CODE_LABELS };