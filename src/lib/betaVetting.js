// Editorial vetting heuristics for the Beta Restoration quarry.
// This is a display-only layer: it flags passages that match known AI-generic
// stylistic habits so they can be vetted, not merged wholesale.
// No passage data is mutated — these functions only read text and return flags.

// Recurring generative-AI tells called out in the editorial review.
// Each pattern is a label + regex tested case-insensitively against passage text.
export const AI_GENERIC_PATTERNS = [
  { label: 'the jungle whispered', re: /jungle\s+(whisper|whispered|whispers)/i },
  { label: 'the silence screamed', re: /silence\s+(scream|screamed|screams)/i },
  { label: 'ghosts walked beside', re: /ghosts?\s+(walk|walked|walking)\s+(beside|with|next to)/i },
  { label: 'coffee metaphor', re: /\bcoffee\b/i },
  { label: 'güey filler', re: /\bg[üu]ey\b/i },
  { label: 'mira filler', re: /\bmira\b/i },
  { label: 'no manches filler', re: /no\s+manches/i },
];

// Return the list of AI-generic patterns a passage matches.
export function detectGenericPatterns(text) {
  if (!text) return [];
  return AI_GENERIC_PATTERNS.filter((p) => p.re.test(text)).map((p) => p.label);
}

// The four-question editorial test every passage must pass to be inserted.
export const VETTING_QUESTIONS = [
  'Sounds like this specific character?',
  'Introduces a new image, not a repeat?',
  'Moves the scene forward?',
  'Better than what\'s already in the chapter?',
];

// Salvage tiers from the editorial estimate (15-20% / 50-60% / 20-30%).
export const SALVAGE_TIERS = [
  { key: 'publish', label: 'Near publication', pct: '15–20%', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { key: 'inspire', label: 'Useful spark', pct: '50–60%', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { key: 'discard', label: 'Discard / interchangeable', pct: '20–30%', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
];

// The disciplined workflow the editor prescribed instead of auto-integration.
export const RESTORATION_WORKFLOW = [
  'Score the current chapter.',
  'Identify the weakest metric (CLS, BIS, SII, or MRF).',
  'Search Beta only for passages targeting that weakness.',
  'Adapt the idea into the existing voice and scene.',
  'Re-score the chapter.',
];