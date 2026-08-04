export const CODE_LABELS = [
  { code: 'ENG', label: 'General English', counts: 'Yes, if shifting from Spanish/Caló' },
  { code: 'CHENG', label: 'Chicano English dialect', counts: 'Not by itself' },
  { code: 'SPAN', label: 'Spanish', counts: 'Yes, if shifting from English/Chicano English' },
  { code: 'CHSPAN', label: 'Chicano/Mexican American Spanish', counts: 'Yes, if it marks a shift' },
  { code: 'CALO', label: 'Caló — in-group slang', counts: 'Yes, if it shifts stance or identity' },
  { code: 'MIX', label: 'Hybrid English-Spanish structure', counts: 'Yes' },
  { code: 'BORROW', label: 'Stable borrowed word', counts: 'Usually no' },
  { code: 'NAME', label: 'Proper noun / title / place', counts: 'No, unless used rhetorically' },
];

export const CODE_OPTIONS = CODE_LABELS.map(c => c.code);

export const FUNCTION_TAGS = [
  { tag: 'IDENTITY', desc: 'Marks Chicano/Mexican American identity' },
  { tag: 'SOLIDARITY', desc: 'Builds closeness with the listener' },
  { tag: 'EMPHASIS', desc: 'Adds force or attitude' },
  { tag: 'HUMOR', desc: 'Makes the line funny, teasing, sarcastic' },
  { tag: 'QUOTE', desc: 'Recreates someone\'s voice' },
  { tag: 'CULTURE', desc: 'Cultural object, place, food, ritual, family role' },
  { tag: 'TOPIC_SHIFT', desc: 'Moves conversation into a new domain' },
  { tag: 'LEXICAL_NEED', desc: 'The word feels more precise in one language' },
  { tag: 'POWER_RESISTANCE', desc: 'Pushes back against English-only pressure' },
];

export const SWITCH_TYPES = ['intrasentential', 'intersentential', 'tag', 'phrase', 'quote', 'alternation'];

export const RUBRIC = [
  'Does the speaker move into a different recognizable code?',
  'Does the switch happen inside the same sentence, turn, or exchange?',
  'Does it carry function: identity, emphasis, humor, quote, clarification, etc.?',
  'Is it more than accent, pronunciation, or Chicano English grammar?',
  'Is it not just a proper name or fixed borrowing?',
];