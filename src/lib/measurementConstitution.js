// LitCentral Measurement Constitution — v1.0 (2026-08-02)
// Governing text for the four-workbook system. LitCentral is the governed evidence
// and measurement warehouse. SPSS is the autonomous laboratory. Cognos is read-only.

export const OPERATING_CHAIN = [
  'Truth360 acquisition',
  'Frozen evidence package',
  'Four autonomous workbooks',
  'Integrity gate',
  'SPSS execution',
  'Independent review',
  'Approved release',
  'Cognos dashboard',
];

export const ARTICLES = [
  {
    id: 'Article I',
    title: 'Separation of powers',
    text: 'LitCentral records observations, authority records, constructs, and provenance. It does not execute the official statistical analysis. SPSS executes analysis from frozen datasets and stored syntax. Cognos publishes approved release tables and creates no coefficients. No layer performs another layer\u2019s function.',
  },
  {
    id: 'Article II',
    title: 'Authority, not compute',
    text: 'The bottleneck is authority, not computing power. Every consequential value must name who defined the variable, who approved the coefficient, what evidence supports it, and how another qualified person reproduces it. Additional infrastructure does not repair an undefined construct.',
  },
  {
    id: 'Article III',
    title: 'AI holds no approval vote',
    text: 'AI may extract, classify, suggest, compare, and flag anomalies. AI must not approve the baseline, assign an official score, alter a coefficient, or promote a result into production. AI agreement with itself is never evidence of reliability.',
  },
  {
    id: 'Article IV',
    title: 'Declared data class on every value',
    text: 'No value enters a workbook without a data class. A zero is not "not applicable." A blank is not "probably absent." Modeled values carry an explicit modeled flag, following the USC VM2 codebook discipline of distinguishing probability estimates from reported facts.',
  },
  {
    id: 'Article V',
    title: 'One-way exchange only',
    text: 'No workbook may overwrite another workbook\u2019s master data. Exchange occurs solely through a controlled, hashed release package. SPSS never reaches back into a live workbook.',
  },
  {
    id: 'Article VI',
    title: 'Cultural fairness is a release condition',
    text: 'A cultural marker may not lower a general craft score without a validated, universally applied construct. Equivalent cultural features must be coded in non-focal canonical works under identical rules. Any unexplained cultural penalty triggers quarantine, never automatic scoring.',
  },
  {
    id: 'Article VII',
    title: 'Legacy scores are preserved, not rewritten',
    text: 'OMEGA_LEGACY is retained with its original dataset hash, formula version, and calculation date under the status SUPERSEDED \u2014 METHODOLOGY UNDER REVIEW. The objective of any rerun is the defensible result, not a higher number.',
  },
  {
    id: 'Article VIII',
    title: 'Nested data is not independent data',
    text: 'The chapters of one manuscript are not independent works. Chapter-level models support internal diagnostics only. Canon-level inference requires multiple works and preferably multiple authors, analysed with mixed-effects methods.',
  },
  {
    id: 'Article IX',
    title: 'Say exactly what each system proved',
    text: 'Bibliographic authority, historical evidence, statistical validation, and literary judgment are named separately in all public language. No system is described as certifying something outside its scope.',
  },
];

// USC VM2 codebook architecture — required for every variable in Workbook 3.
export const CODEBOOK_COLUMNS = [
  { field: 'variable_id / variable_name', purpose: 'Stable machine-readable identity' },
  { field: 'construct', purpose: 'The concept the variable is intended to measure' },
  { field: 'operational_definition', purpose: 'Exactly how the value is produced' },
  { field: 'unit_of_analysis', purpose: 'Work, chapter, scene, passage, claim, or rating' },
  { field: 'data_type', purpose: 'Numeric, string, Boolean, date, categorical' },
  { field: 'measurement_level', purpose: 'Nominal, ordinal, or scale' },
  { field: 'permitted_values', purpose: 'Legal categories or numerical range' },
  { field: 'missing_rule', purpose: 'Unknown, unavailable, not observed, or not applicable' },
  { field: 'modeled_flag', purpose: 'Whether the value is observed or predicted' },
  { field: 'source_lineage', purpose: 'Evidence or upstream field used' },
  { field: 'formula_version / model_version', purpose: 'Exact calculation authority' },
  { field: 'confidence_uncertainty', purpose: 'Stated limits of the value' },
  { field: 'permitted_use', purpose: 'Descriptive, diagnostic, predictive, or release scoring' },
  { field: 'fairness_risk', purpose: 'Cultural or group-comparison implications' },
  { field: 'owner / approver', purpose: 'Human accountability' },
  { field: 'effective_date / retirement_date', purpose: 'Version control' },
];

export const DATA_CLASS_CODES = [
  'OBSERVED',
  'HUMAN_RATED',
  'AI_EXTRACTED_UNREVIEWED',
  'AI_EXTRACTED_APPROVED',
  'DERIVED',
  'MISSING',
  'NOT_APPLICABLE',
];

export const SPSS_GATES = [
  { gate: 'Gate 1', name: 'Data eligibility', work: 'IDs, ranges, duplicates, missing codes, measurement levels, applicability, lineage.', condition: 'No unexplained duplicate ID, impossible value, or lineage conflict. Zero never means not applicable.' },
  { gate: 'Gate 2', name: 'Measurement reliability', work: 'ICC for continuous ratings; kappa or agreement tables for categorical judgments.', condition: 'Predeclared agreement threshold met by independent human raters. AI self-agreement excluded.' },
  { gate: 'Gate 3', name: 'Construct validity', work: 'Correlations, factor structure, item behavior, expert content review, applicability across groups.', condition: 'Interpretable structure demonstrated. Cronbach\u2019s alpha alone is not accepted as proof.' },
  { gate: 'Gate 4', name: 'Model diagnostics', work: 'Residuals, influence statistics, collinearity and rank-deficiency screening, coefficient intervals, sensitivity tests.', condition: 'No unexplained influential case, severe collinearity, or unstable coefficient.' },
  { gate: 'Gate 5', name: 'Stability and uncertainty', work: 'Bootstrap resampling with fixed seed and stored settings.', condition: 'Coefficient signs and substantive conclusions remain stable across resamples.' },
  { gate: 'Gate 6', name: 'Nested-data modeling', work: 'Mixed models for raters, passages, chapters, works, and authors as nested sources.', condition: 'No claim treats correlated observations as independent.' },
  { gate: 'Gate 7', name: 'Cultural fairness', work: 'Identifier-swap tests, applicability audit, cross-corpus feature coding, coefficient-sign checks under alternate corpora, ablation.', condition: 'No cultural penalty without a validated construct rationale. Failures quarantine, not score.' },
];

export const ANALYSIS_PACKAGE = [
  '.sav frozen dataset',
  '.sps syntax',
  '.spv output',
  'generated CODEBOOK',
  'source-data hash',
  'syntax hash',
  'software version',
  'random seed',
  'model / formula version',
  'exception log',
  'reviewer sign-off',
];

export const RELEASE_PACKAGE_FIELDS = [
  'schema_version',
  'source_workbook_hash',
  'export_hash',
  'row_count',
  'created_at_utc',
  'producing_process',
  'approval_status',
  'release_id',
];

export const REVIEW_BOARD = [
  { reviewer: 'Statistician / psychometrician', authority: 'Sampling, reliability, construct validity, regression protocol' },
  { reviewer: 'Digital-humanities / computational-literature scholar', authority: 'Corpus design and text measurement' },
  { reviewer: 'Chicano literature or Chicano studies scholar', authority: 'Cultural constructs, voice, code-switching, fairness instrument' },
  { reviewer: 'Vietnam or military historian', authority: 'Historical claim adequacy and corpus context' },
  { reviewer: 'Archivist / metadata specialist', authority: 'Provenance, source records, editions, chain of custody' },
  { reviewer: 'Author (Gabe)', authority: 'Canon authority' },
  { reviewer: 'Engineering', authority: 'Reproducibility' },
  { reviewer: 'AI', authority: 'No approval vote' },
];

export const RELEASE_PROFILES = [
  'General narrative craft',
  'Historical evidentiary support',
  'Chicano cultural fidelity',
  'Canon-pattern similarity',
  'Reader-response validation',
];

export const LANGUAGE_RULES = [
  { permitted: 'LOC-anchored bibliographic and authority records', prohibited: 'LOC-certified literary score' },
  { permitted: 'GitHub attestation proves which repository, workflow, environment, commit, and event produced a build', prohibited: 'GitHub certified the historical truth' },
  { permitted: 'Analyses executed from frozen datasets and reproducible SPSS syntax', prohibited: 'IBM certified the score' },
  { permitted: 'AI-induced narrative drift \u2014 measurable divergence between an authoritative source passage and a generated or revised output (experimental)', prohibited: 'Generative displacement, presented as established science' },
  { permitted: 'Measured association between predeclared variables and an independent outcome', prohibited: 'Correlation described as causation without a supporting design' },
];

export const DRIFT_MEASURES = [
  'Historical-claim preservation rate',
  'Character and event mutation rate',
  'Named-entity substitution rate',
  'Chronology violation rate',
  'Code-switch preservation rate',
  'Semantic distance from source',
  'Human-rated voice displacement',
  'Unsupported-content insertion rate',
  'Percentage of generated text without provenance',
];