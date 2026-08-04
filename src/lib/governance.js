/**
 * Governance Constants — Single Source of Truth
 * Version: RF-1.5 | Prime Directive v1.0
 * Owner: Author / Editorial Governance
 *
 * Change control: Any change requires governance version bump
 * and regression test update.
 *
 * This module is the ONLY place formula coefficients, ceiling,
 * blocker policy, visibility rules, and sync contracts are defined.
 * UI and backend both import from here — no duplicate hard-coding.
 */

export const GOVERNANCE_VERSION = 'v1.1';
export const GOVERNANCE_ANCHOR = 'v25 — 2026-06-24';
export const GOVERNANCE_DATE = '2026-07-01';
export const PRIME_DIRECTIVE_VERSION = 'v1.1';
export const FORMULA_LOCK = 'Active';

// ─── Active Governance Anchor (v25 — 2026-06-24) ───────────────
export const GOVERNANCE_ANCHOR_SPEC = {
  formula: 'Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.1005·MRF',
  ceiling: 114.593,
  vclExemptChapters: [17, 18, 29],
  status: '45 chapters | 248,997 words | mean Ω 111.355 | GST AUTHORIZED',
  note: 'v12 metrics sheets (2026-05-23) are HISTORICAL REFERENCE ONLY. Where v12 and v25 conflict, v25 wins.',
};

// ─── Locked Canon Facts (never contradict, never re-litigate) ──
export const LOCKED_CANON_FACTS = [
  'George Ramos = Joshua Sagasta',
  'Copper taste trigger',
  'Duc/Mai = VC; Mai is MALE',
  "O'Neil = Kentucky; Johnson = Philadelphia",
  'Rodriguez (Ch.1 underage boy) ≠ Ramirez (Ch.10 KIA) — two different Marines',
  "Duc's radio operator = Trong throughout",
  'Toy soldiers = lead; chamoy = sweet-sour paste',
];

// ─── Source-of-Truth Hierarchy (highest wins) ──────────────────
export const SOURCE_OF_TRUTH = [
  { rank: 1, source: "Gabe's explicit rulings in chat" },
  { rank: 2, source: 'v25 Validation Report (governance and scores)' },
  { rank: 3, source: 'RAMOS_TRUE_VOICE.docx (voice and prose baseline)' },
  { rank: 4, source: "Google Drive recovered passages — Gabe's own writing, preferred over any AI substitute" },
  { rank: 5, source: 'Everything else — reference only' },
];

// ─── Ω Formula Spec ────────────────────────────────────────────
export const OMEGA_SPEC = {
  intercept: 71.443,
  coefficients: {
    CLS: 0.124,
    BIS: 0.118,
    SII: 0.089,
    MRF: 0.1005,
  },
  metricRange: { min: 0, max: 100 },
  ceiling: 71.443 + (0.124 + 0.118 + 0.089 + 0.1005) * 100, // = 114.593
  formulaString: 'Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.1005·MRF',
  metricLabels: {
    CLS: 'Chicano Literary Style',
    BIS: 'Biographical Integrity',
    SII: 'Sensory Integration Index',
    MRF: 'Narrative Compression',
  },
  owner: 'Author / Editorial Governance',
};

export function computeOmega(cls, bis, sii, mrf) {
  if (!cls || !bis || !sii || !mrf) return 0;
  const { intercept, coefficients } = OMEGA_SPEC;
  return intercept + coefficients.CLS * cls + coefficients.BIS * bis + coefficients.SII * sii + coefficients.MRF * mrf;
}

export function gapToCeiling(meanOmega) {
  return OMEGA_SPEC.ceiling - meanOmega;
}

// ─── Governance Layers (Prime Directive v2) ────────────────────
export const GOVERNANCE_LAYERS = [
  { order: 0, name: 'Governance', desc: 'Defines the rules, formula, source hierarchy, blocker policy, and change control. Prose cannot override.' },
  { order: 1, name: 'Data Hygiene', desc: 'Verifies evidence, math, military accuracy, timeline, sources, chapter metrics, and claims. Prose cannot override.' },
  { order: 2, name: 'Chicano Lens / CON Lens', desc: 'Checks cultural truth, language logic, code-switching, identity, continuity, and character voice. Prose cannot override.' },
  { order: 3, name: 'Prose', desc: 'Improves rhythm, clarity, tension, imagery, pacing, and emotional force — only after Gates 0–2 pass.' },
];

// ─── Blocker Policy ────────────────────────────────────────────
export const BLOCKER_SEVERITY = {
  Critical: { desc: 'Breaks truth, timeline, formula, military accuracy, or canon', example: 'Wrong weapon for year' },
  Major: { desc: 'Damages continuity, chapter logic, or character arc', example: 'Conflicting event sequence' },
  Moderate: { desc: 'Weakens scene truth but does not break canon', example: 'Thin motivation' },
  Minor: { desc: 'Local issue', example: 'Repeated phrase, small clarity issue' },
};

export const BLOCKER_REQUIRED_FIELDS = [
  'blocker_id', 'title', 'severity', 'omega_penalty', 'affected_chapters',
  'reason', 'source_or_evidence', 'created_by', 'created_at', 'status',
];

// Overlap rule: words_at_risk_unique counts each chapter once;
// multi_blocked_words counts chapters under 2+ active blockers.
export function computeOverlap(chapters, blockers) {
  const active = blockers.filter(b => b.status === 'active');
  const affectedChapterNumbers = new Set();
  const chapterHitCount = {};

  active.forEach(b => {
    (b.affected_chapters || []).forEach(chNum => {
      affectedChapterNumbers.add(chNum);
      chapterHitCount[chNum] = (chapterHitCount[chNum] || 0) + 1;
    });
  });

  const wordsAtRiskUnique = affectedChapterNumbers.size > 0
    ? chapters.filter(c => affectedChapterNumbers.has(c.chapter_number))
        .reduce((sum, c) => sum + (c.word_count || 0), 0)
    : 0;

  const multiBlockedChapterNumbers = new Set(
    Object.entries(chapterHitCount).filter(([, count]) => count >= 2).map(([chNum]) => Number(chNum))
  );

  const multiBlockedWords = multiBlockedChapterNumbers.size > 0
    ? chapters.filter(c => multiBlockedChapterNumbers.has(c.chapter_number))
        .reduce((sum, c) => sum + (c.word_count || 0), 0)
    : 0;

  const overlapPct = wordsAtRiskUnique > 0 ? multiBlockedWords / wordsAtRiskUnique : 0;

  return { wordsAtRiskUnique, multiBlockedWords, overlapPct };
}

// ─── Public Access Policy ──────────────────────────────────────
export const PUBLIC_SUMMARY = {
  visible: ['mean_omega', 'total_chapters', 'total_word_count', 'elite_chapter_count', 'gap_to_ceiling', 'governance_version', 'last_public_refresh'],
  hidden: ['edit_buttons', 'delete_controls', 'sync_buttons', 'blocker_creation', 'formula_editing', 'chapter_scoring_inputs', 'admin_panels', 'private_notes', 'source_workbooks'],
};

// ─── Sync Status Contract ──────────────────────────────────────
export const SYNC_STATUS = {
  values: ['success', 'error', 'no_files'],
  noFilesContract: {
    status: 'no_files',
    message: 'No matching workbook or prose files found for current sync pattern.',
    matched_files: 0,
    created_files: 0,
    updated_files: 0,
    error: null,
  },
};

// ─── CodeSwitching Filter Spec ─────────────────────────────────
export const CODESWITCHING_EMPTY_STATE = 'No code-switching instances match these filters. Try clearing matrix-code, switch-type, speaker, or chapter filters.';

export const CODESWITCHING_FUNCTIONS = [
  'Clarification', 'Contextual switch', 'Quotation', 'Emphasis',
  'Interjection', 'Lexical need', 'Topic construction', 'Triggered switch',
];

// ─── Military Source Registry ───────────────────────────────────
export const MILITARY_REGISTRY = {
  types: ['weapon', 'aircraft', 'vehicle', 'unit', 'rank', 'location', 'tactic'],
  fields: ['item', 'type', 'year', 'branch', 'variant', 'theater', 'chapter', 'source', 'confidence', 'status'],
  checkCategories: [
    'weapon_available_in_year',
    'aircraft_variant_correct',
    'landing_behavior_possible',
    'unit_deployment_plausible',
    'rank_title_correct',
    'radio_procedure_period_correct',
    'terrain_weather_plausibility',
  ],
  statuses: ['verified', 'needs_review', 'blocked'],
};

// ─── Regression Test Suite ──────────────────────────────────────
export const REGRESSION_TESTS = [
  { priority: 'P0', name: 'Verify displayed locked formula equals computed Ω', desc: 'Protects core math. No formula drift.' },
  { priority: 'P0', name: 'Create overlapping blockers and verify aggregated penalties', desc: 'Protects dashboard truth and risk math.' },
  { priority: 'P0', name: 'View public manuscript summary', desc: 'Protects read-only/public governance. Prevents accidental write access.' },
  { priority: 'P1', name: 'Cloud sync with no matching files records no_files', desc: 'Protects integration data hygiene and audit logs.' },
  { priority: 'P1', name: 'Filter CodeSwitching to an empty result set', desc: 'Protects CON/Chicano-lens analysis UI from misleading data.' },
];

// ─── Sync Direction Matrix (Governance v1.1) ───────────────────
// Real-time sync moves packets, not canon.
export const SYNC_DIRECTION_MATRIX = [
  { from: 'Workbook', to: 'Base44 staging', allowed: true, note: 'Read-only import, tagged RAW_LEGACY or STAGING' },
  { from: 'Base44 staging', to: 'Gemini', allowed: true, note: 'Cook packets only' },
  { from: 'Gemini', to: 'Base44 review queue', allowed: true, note: 'Cook outputs only, COOKED_PENDING_REVIEW' },
  { from: 'Base44', to: 'Workbook RAW/master sheets', allowed: false, note: 'Never. Gabe applies promoted changes manually or via signed export' },
  { from: 'v25 items', to: 'canon', allowed: false, note: 'Only through V25_PROMOTION_GATE with Gabe decision' },
  { from: 'Draft rows (WORDS=0 / INITIAL DRAFT)', to: 'any export', allowed: false, note: 'BLOCKED_DRAFT' },
  { from: 'Quarantined rows', to: 'any export', allowed: false, note: '' },
  { from: 'Anything', to: 'public claims', allowed: false, note: 'Gabe only, evidence bundle required' },
];

// ─── Forbidden Sync Failure Protocol ───────────────────────────
export const SYNC_FAILURE_PROTOCOL = [
  'Block the write.',
  'Log to SYNC_LOG with status BLOCKED.',
  'Create a QUARANTINE_LOG entry for the attempted payload.',
  'Notify Gabe in the dashboard blockers panel.',
  'Do not retry automatically.',
];

// ─── Prime Directive v1.1 ───────────────────────────────────────
export const PRIME_DIRECTIVE = {
  version: 'v1.1',
  coreRule: 'A refinement cannot improve prose by damaging truth.',
  shortVersion: 'Governance defines the rules. Data Hygiene proves the facts. Chicano Lens protects the cultural and language truth. Prose makes it sing.',
  gates: [
    { gate: 0, name: 'Governance', purpose: 'Defines the rules, formula, source hierarchy, blocker policy, and change control', proseOverride: false },
    { gate: 1, name: 'Data Hygiene', purpose: 'Checks evidence, math, military accuracy, timeline, sources, chapter metrics, and claims', proseOverride: false },
    { gate: 2, name: 'Chicano Lens / CON Lens', purpose: 'Checks cultural truth, language logic, code-switching, identity, continuity, and character voice', proseOverride: false },
    { gate: 3, name: 'Prose', purpose: 'Improves rhythm, clarity, tension, imagery, pacing, and emotional force', proseOverride: true, note: 'Only after Gates 0–2 pass' },
  ],
};

// ─── Evidence Classes ───────────────────────────────────────────
export const EVIDENCE_CLASSES = [
  { class: 'E0', name: 'Locked Canon', desc: 'Author-approved story bible, chapter truth, character history', supportsHardFact: true },
  { class: 'E1', name: 'Primary Evidence', desc: 'Manuals, official records, period documents, military specs, maps, photographs', supportsHardFact: true },
  { class: 'E2', name: 'Strong Secondary Evidence', desc: 'Credible histories, academic books, museum sources, expert references', supportsHardFact: 'Usually' },
  { class: 'E3', name: 'Scholarly Framework', desc: 'Linguistic/cultural frameworks like Ali and Kirkpatrick', supportsHardFact: 'Yes, for categories' },
  { class: 'E4', name: 'Fragment Cluster', desc: 'Multiple partial clues that point in the same direction', supportsHardFact: 'Sometimes' },
  { class: 'E5', name: 'Modeled Narrative Inference', desc: 'Best-fit reconstruction for story logic', supportsHardFact: false },
  { class: 'E6', name: 'Authorial Invention', desc: 'Created for fiction, theme, or dramatic structure', supportsHardFact: false },
];

// ─── Data Hygiene Results ───────────────────────────────────────
export const DATA_HYGIENE_RESULTS = [
  { result: 'PASS', desc: 'Evidence supports the claim' },
  { result: 'PASS WITH MODELING', desc: 'Claim is plausible but based on fragments; must be labeled' },
  { result: 'NEEDS REVIEW', desc: 'Evidence is incomplete or conflicting' },
  { result: 'BLOCKED', desc: 'Claim is false, impossible, anachronistic, or contradicts canon' },
  { result: 'AUTHORIAL INVENTION', desc: 'Fictionalized intentionally; must not be displayed as verified fact' },
];

// ─── Dashboard Evidence Labels ──────────────────────────────────
export const EVIDENCE_LABELS = [
  { label: 'Verified', evidenceClass: 'E0–E1' },
  { label: 'Canon-Locked', evidenceClass: 'E0' },
  { label: 'Strongly Supported', evidenceClass: 'E1–E2' },
  { label: 'Fragment-Supported', evidenceClass: 'E4' },
  { label: 'Modeled Reconstruction', evidenceClass: 'E5' },
  { label: 'Authorial Invention', evidenceClass: 'E6' },
  { label: 'Needs Review', evidenceClass: '—' },
  { label: 'Blocked', evidenceClass: '—' },
  { label: 'Accepted Risk', evidenceClass: 'E5' },
];

// ─── Blocker Gate Mapping ───────────────────────────────────────
export const BLOCKER_GATES = [
  { gate: 'governance', name: 'Governance', severities: ['critical'], desc: 'Formula mismatch, spec violation, change control breach' },
  { gate: 'data_hygiene', name: 'Data Hygiene', severities: ['critical', 'major'], desc: 'Wrong weapon for era, impossible aircraft action, unsupported claim, stale chart data' },
  { gate: 'chicano_lens', name: 'Chicano Lens', severities: ['major', 'moderate'], desc: 'Stereotyped voice, mislabeled dialect, code-switch lacks function, voice drifts' },
  { gate: 'prose', name: 'Prose', severities: ['moderate', 'minor'], desc: 'Clunky sentence, repeated word, pacing issue, weak cultural specificity' },
];

export const BLOCKER_EVIDENCE_STATUS = [
  { value: 'verified_conflict', desc: 'Claim contradicts verified evidence' },
  { value: 'missing_evidence', desc: 'No evidence found to support the claim' },
  { value: 'modeled_unclear', desc: 'Modeled narrative with unclear fragment basis' },
  { value: 'canon_conflict', desc: 'Claim contradicts locked canon' },
  { value: 'prose_issue', desc: 'Pure prose quality issue, no evidence concern' },
];

// ─── Refinement Workflow ─────────────────────────────────────────
export const REFINEMENT_WORKFLOW = [
  { step: 1, name: 'Ingest chapter / scene / annotation' },
  { step: 2, name: 'Identify factual claims' },
  { step: 3, name: 'Identify canon claims' },
  { step: 4, name: 'Identify language/cultural claims' },
  { step: 5, name: 'Assign evidence class' },
  { step: 6, name: 'Run Data Hygiene' },
  { step: 7, name: 'Open blockers if evidence fails' },
  { step: 8, name: 'Run Chicano Lens' },
  { step: 9, name: 'Open blockers if cultural/voice logic fails' },
  { step: 10, name: 'Run Prose refinement' },
  { step: 11, name: 'Save revision notes' },
  { step: 12, name: 'Update dashboard metrics' },
];

// ─── Modeled Narrative Required Fields ───────────────────────────
export const MODELED_NARRATIVE_FIELDS = [
  { field: 'fragment_basis', desc: 'What fragments inspired it?' },
  { field: 'narrative_purpose', desc: 'Why does the model exist?' },
  { field: 'confidence', desc: 'Low, medium, high' },
  { field: 'contradiction_check', desc: 'Does it conflict with verified evidence?' },
  { field: 'replacement_rule', desc: 'What happens if stronger evidence appears later?' },
  { field: 'display_label', desc: 'Modeled, plausible, speculative, or authorial invention' },
];

// ─── Evidence Claim Categories ───────────────────────────────────
export const CLAIM_CATEGORIES = [
  'military', 'timeline', 'weapon', 'aircraft', 'vehicle', 'geography',
  'language', 'character_canon', 'formula', 'word_count', 'code_switching', 'modeled_narrative',
];

export const CONFIDENCE_LEVELS = ['verified', 'high', 'medium', 'low', 'speculative'];