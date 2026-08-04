// Phase 1 — Evidence Freeze register.
// Immutable audit record of source artifacts and the provenance envelope every
// downstream entity must carry. Nothing here is a score or a quality claim.

export const ARTIFACT_MANIFEST = [
  {
    entity_id: 'ART-001',
    name: 'Omega_Chapter_Architecture.csv',
    entity_type: 'Source dataset',
    sha256: '8066ef57081335bc632dc930e648e6470ea1d0dc90cc6de81370ae81a978098f',
    finding:
      '46 chapter records across 54 fields. Observed data, estimates, derived scores, editorial decisions, cultural indicators, and final outputs are mixed in one table. Nine fields entirely empty.',
    data_class: 'OBSERVED',
  },
  {
    entity_id: 'ART-002',
    name: 'omega-scribe-flow (6).zip',
    entity_type: 'Application package',
    sha256: '41915d736acf32389ba8a3ccd68e312ad241c639c76a408ecbacb5a3f2a303b9',
    finding:
      'Base44/React application. Governance, evidence, quarantine, and sync concepts present; several hard-coded baseline claims and insufficient provenance fields.',
    data_class: 'OBSERVED',
  },
  {
    entity_id: 'ART-003',
    name: 'DataScienceUserGuide.pdf',
    entity_type: 'Reference documentation',
    sha256: '154c2c9491ca31a99b7cb1fbcc6064d99378b762b45469258e290db15a9f447a',
    finding:
      '2026 Q2 Analytic Solver guide. Supports workflows, feature selection, text mining, regression, scoring, partitioning, and model-risk analysis. Reinforces the train / validate / test / score / risk separation.',
    data_class: 'OBSERVED',
  },
];

export const PROVENANCE_ENVELOPE = [
  { group: 'Identity', fields: ['entity_id', 'entity_type', 'data_class'] },
  { group: 'Source', fields: ['source_uri', 'source_repository', 'source_control_number', 'source_retrieved_at_utc', 'source_sha256'] },
  { group: 'Local custody', fields: ['local_sha256', 'parent_entity_id', 'parent_sha256'] },
  { group: 'Activity', fields: ['activity_id', 'activity_type', 'generated_at_utc'] },
  { group: 'Agent', fields: ['agent_id', 'agent_type', 'tool_name', 'tool_version'] },
  { group: 'Model & prompt', fields: ['model_id', 'model_version', 'prompt_id', 'prompt_version'] },
  { group: 'Formula', fields: ['formula_id', 'formula_version'] },
  { group: 'Review', fields: ['reviewer_id', 'review_status', 'release_id'] },
];

export const DATA_CLASSES = [
  { code: 'OBSERVED', note: 'Directly present in the manuscript or source artifact.' },
  { code: 'HUMAN_RATED', note: 'Assigned by a qualified, identified rater.' },
  { code: 'AI_EXTRACTED_UNREVIEWED', note: 'Proposed by a model. Never publishable.' },
  { code: 'AI_EXTRACTED_APPROVED', note: 'Model proposal accepted by a named human reviewer.' },
  { code: 'DERIVED', note: 'Calculated from other fields by a versioned formula.' },
  { code: 'MISSING', note: 'Unknown or unavailable. Distinct from zero and from not observed.' },
  { code: 'NOT_APPLICABLE', note: 'The construct did not apply to this unit. Never encoded as zero.' },
];

// Language scope. Bibliographic control is not statistical or literary certification.
export const AUTHORITY_LANES = [
  {
    authority: 'Bibliographic authority',
    question: 'What is the work, edition, author, subject, classification?',
    permitted: 'LOC-sourced corpus · LOC-anchored authority records · LOC-referenced evidence baseline',
    prohibited: 'LOC-verified literary score · LOC-certified ranking',
  },
  {
    authority: 'Historical-evidence authority',
    question: 'What happened, when, where, according to which primary or secondary source?',
    permitted: 'Claim-level support index with numerator, denominator, contradictions, and unresolved claims shown',
    prohibited: 'Probability that a chapter is true',
  },
  {
    authority: 'Literary-standard authority',
    question: 'Which works are in the corpus, which dimensions are assessed, what counts as strong?',
    permitted: 'Documented corpus-selection criteria, scholarly justification, expert review',
    prohibited: 'Silent delegation of literary judgment to a catalog',
  },
  {
    authority: 'Statistical validation authority',
    question: 'Do the relationships hold, reproducibly, across groups?',
    permitted: 'Stored SPSS syntax, fixed input hashes, seeded bootstrap intervals, diagnostics',
    prohibited: 'A model rewriting the baseline it was tested against',
  },
];

export const FREEZE_GATE = [
  { item: 'All source artifacts entered in the manifest with SHA-256 digests', status: 'met' },
  { item: 'Hard-coded baseline-card publication disabled, artifact preserved as superseded', status: 'met' },
  { item: 'Repository snapshot and current outputs preserved', status: 'pending' },
  { item: '45-versus-46 chapter lineage discrepancy reconciled', status: 'open' },
  { item: 'omega vs omega_audit lineage documented (score_formula_id, score_version, supersedes_score_id)', status: 'open' },
];