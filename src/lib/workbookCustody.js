// Workbook custody map.
// Defines which workbook holds which class of material, who controls it, and what may
// legitimately be AI-manufactured. The distinction that matters: Book 2 holds instruments
// that AI may draft, and Book 3 holds the governed record of how those instruments are
// allowed to be used. A drafted instrument does not become a rule until Book 3 admits it.

export const CUSTODY_PRINCIPLE =
  'AI may manufacture an instrument. It may not admit one. Every prompt, formula, and rule enters as a Book 2 draft, is vetted by an independent analytical pass with a named human operator, and only then is recorded in Book 3 as governed procedure. Nothing skips a book.';

export const BOOKS = [
  {
    id: 'BOOK-2',
    name: 'Book 2 — Instruments & Prompt Register',
    role: 'Where prompts, scoring instruments, and candidate rules are drafted and staged.',
    aiPermitted: true,
    aiRole:
      'AI may manufacture the artifact: draft prompt text, propose a formula, format a codebook column, transcribe a rule.',
    vetting:
      'Every entry is vetted under an independent analytical pass for skill-setting and fitness before it is eligible to leave this book. The vetting operator is a named human, and the vetting is recorded alongside the draft.',
    controller: 'Central engineering team, with human consulting review.',
    standing: 'STAGED — not procedure, not citable as authority.',
    className: 'border-amber-500/30 bg-amber-500/5',
  },
  {
    id: 'BOOK-3',
    name: 'Book 3 — Governed Procedure & Compliance Record',
    role:
      'Where admitted rules, AI limitations, and the published use conditions live. This dashboard — the Constitution, the thesis framework, the decommission order, the provenance logs — is Book 3.',
    aiPermitted: false,
    aiRole:
      'Clerical only: transcription, formatting, drafting text for human sign-off. AI is barred from assigning, weighting, or admitting anything into this book.',
    vetting:
      'Admission requires a human decision on the record, and the procedure must already be published before it is executed against data.',
    controller: 'Author of record, on the documented decision of the review board.',
    standing: 'GOVERNING — this is the record compliance is measured against.',
    className: 'border-emerald-500/30 bg-emerald-500/5',
  },
];

// What must be public about the statistical system before it is used against data.
export const PUBLIC_DISCLOSURE = [
  {
    question: 'What the system is for',
    answer:
      'The stated purpose of each instrument, in plain language, including what it does not measure. An instrument with no stated limit is not admissible.',
  },
  {
    question: 'How it is to be used',
    answer:
      'The published procedure: inputs, the operation performed, the variable class, and the n. Publication precedes execution, never follows it.',
  },
  {
    question: 'How we will actually use it',
    answer:
      'The specific application inside this project, so that the general procedure and this project\u2019s use of it can be audited separately.',
  },
  {
    question: 'Who controls it',
    answer:
      'A named custodian for the instrument and a named operator for each run. Control is held by people, not by a platform or a model.',
  },
];

// The delegation model. Human-led, AI-assisted, explicitly supervised.
export const DELEGATION_MODEL = {
  structure:
    'A central engineering team with human consulting. Delegation of technical work runs through that team, not through the author directly and not through a model.',
  rationale:
    'The author is the domain authority on the manuscript and is explicitly not the engineering authority. The team exists so that a governance decision never depends on the author holding an engineering background.',
  aiStance:
    'AI is not disregarded and is not treated as optional — it is load-bearing. It is also supervised closely at this level precisely because a non-specialist operator cannot audit an unsupervised model after the fact.',
  layers: [
    ['Author of record', 'Sets intent, holds the manuscript, rules on admission. Not required to hold engineering context.'],
    ['Central engineering team', 'Delegates and executes technical work. Translates governance decisions into implementation.'],
    ['Human consulting', 'Independent analytical review of instruments before admission. Named, on the record.'],
    ['AI', 'Manufactures drafts and performs clerical work under supervision. Never admits, scores, or weights.'],
  ],
};

// Tooling provenance, recorded as fact rather than endorsement.
export const TOOLING_RECORD = {
  statement:
    'The restoration of the manuscript was accomplished on commercial cloud and AI platforms, and the project record states that plainly rather than obscuring it.',
  detail:
    'Google cloud storage held the intellectual property through the restoration without loss. The AI platforms used made the restoration itself tractable. The project does not pretend to have reached this point without them.',
  failsafe:
    'The contamination that forced this governance architecture was not anticipated. It surfaced anyway — and because it surfaced inside a system that could trace it, it became a fail-safe rather than a loss. Each generation of the instrument is more grounded for having been caught.',
  limit:
    'None of this constitutes validation of any platform\u2019s output. Tooling provenance is recorded so that a reader can see what touched the work; it never substitutes for a human recomputation.',
};