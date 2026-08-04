// DECOMMISSION ORDER — AI removed from the measurement chain.
//
// Every component below produced numbers that cannot be recomputed by a human
// from the source text. That is the disqualifying property: not that a machine
// was involved, but that the output is unauditable. Vector proximity and social
// physics are the two worst offenders, because they are the layers through which
// cultural penalty entered the score while presenting as geometry.

export const ORDER = {
  effective: '2026-08-03',
  scope: 'All scoring, ranking, and comparison outputs in this system.',
  rule:
    'No number may enter the measurement record unless a human can reproduce it by hand from the source text using the published codebook. If reproduction requires a model, the number is not evidence.',
  ai_permitted_role:
    'Clerical only \u2014 formatting, transcription for human verification, drafting prose that a named human then re-authors and signs. AI may never assign, weight, or adjust a score.',
  ai_forbidden_role:
    'Measurement, scoring, weighting, ranking, similarity judgement, construct inference, or any operation whose output is a number the system stores.',
};

export const DECOMMISSIONED = [
  {
    id: 'DEC-1',
    component: 'Vector space proximity modeling',
    claimed: 'That distance between text embeddings measures literary proximity to canon works.',
    compromised:
      'Embedding space is trained on published corpora that structurally under-represent Chicano and bilingual prose. Distance to canon is therefore distance to the training distribution, not to literary quality. The metric encodes the exclusion it was being used to test.',
    unauditable: 'No human can recompute an embedding distance from the page. The number cannot be checked, only trusted.',
    replaced_by: 'Hand-coded content analysis against a published codebook, with two independent raters.',
  },
  {
    id: 'DEC-2',
    component: 'Social physics',
    claimed: 'That social-schema conformity could be modeled as a physical force acting on the text.',
    compromised:
      'The "schema" is whatever the model absorbed as normal social behavior. Prose depicting barrio family structure and institutional confrontation registers as deviation from that norm, so the metric converts cultural difference into measured error. This is the mechanism of the deflation, dressed as physics.',
    unauditable: 'No published construct definition, no rater instructions, no reproducible procedure. The term has no operational meaning in this system.',
    replaced_by: 'Nothing. The construct is withdrawn entirely \u2014 there is no salvageable measurement underneath it.',
  },
  {
    id: 'DEC-3',
    component: 'Cognitive neuro-tracking',
    claimed: 'That reader cognitive and attentional response could be inferred from prose features.',
    compromised:
      'No reader was ever measured. There is no eye-tracking data, no response panel, no instrument. The values were model estimates of a human response that was never collected.',
    unauditable: 'Estimates of unobserved data are not observations. Class MISSING, not DERIVED.',
    replaced_by: 'Declared as absent. If reader response matters, it requires actual readers \u2014 a rated panel with reliability statistics.',
  },
  {
    id: 'DEC-4',
    component: 'Code-switching penalty / BIGS / cultural-vector regressors',
    claimed: 'That bilingual and code-switched passages warranted negative score weight.',
    compromised:
      'Direction-inverted against the declared construct: code-switching under pressure is the displacement event the manuscript exists to record. These regressors also have no peer-reviewed precedent in canon evaluation and were never declared before the data was seen.',
    unauditable: 'Coefficients were never published. The penalty magnitude is unknown and unreproducible.',
    replaced_by:
      'Deterministic switch counts from the hand-annotated code-switch ledger, with function tags. Counted, not scored \u2014 and never negatively weighted.',
  },
  {
    id: 'DEC-5',
    component: 'AI-assigned composite \u03a9 and AI-drafted regressors',
    claimed: 'A single scalar summarising manuscript quality, produced or adjusted by model evaluation.',
    compromised:
      'Circular: models graded prose they had themselves rewritten or advised on, and coefficients drifted between runs on identical text (107 \u2192 98). A score that moves while its input does not is measuring the instrument, not the manuscript.',
    unauditable: 'Run-to-run instability with no version control on the weights.',
    replaced_by:
      'A frozen, published linear composite over hand-coded and counted components, with a version number and a dataset hash per run.',
  },
];

// What the research uses instead. All of it hand-checkable.
export const TOOLKIT = [
  {
    tool: 'Descriptive statistics',
    answers: 'Central tendency, dispersion, and distribution shape of each component across chapters and control texts.',
    outputs: 'N, mean, SD, median, quartiles, skew, range.',
    why_admissible: 'Plain arithmetic. Reproducible on paper from the stored values.',
  },
  {
    tool: 'Frequency counts & content analysis',
    answers: 'How often a declared textual feature occurs \u2014 code switches, sensory channels, ritual markers, institutional confrontations.',
    outputs: 'Counts, rates per 1,000 words, cross-tabulations.',
    why_admissible: 'Each count traces to a marked passage. A second reader can recount it.',
  },
  {
    tool: 'Inter-rater reliability',
    answers: 'Whether two humans applying the codebook independently reach the same coding.',
    outputs: 'Cohen\u2019s \u03ba per construct, percent agreement, disagreement log.',
    why_admissible: 'This is what replaces the model\u2019s claim to objectivity: agreement between named raters, reported with its failures.',
  },
  {
    tool: 'Internal consistency',
    answers: 'Whether the components of a composite behave as one construct.',
    outputs: 'Cronbach\u2019s \u03b1, item-total correlations.',
    why_admissible: 'Computed from the stored component scores; independently verifiable in SPSS.',
  },
  {
    tool: 'Nonparametric comparison',
    answers: 'Whether manuscript and control texts differ on a component, without assuming normality on small samples.',
    outputs: 'Mann\u2013Whitney U, chi-square, effect sizes.',
    why_admissible: 'Appropriate to count data and small N. Assumptions are stated, not hidden in a model.',
  },
  {
    tool: 'Correlation & OLS regression',
    answers: 'How components relate, and how much variance each explains in the composite.',
    outputs: 'Pearson r, R\u00b2, coefficients with standard errors.',
    why_admissible:
      'Admissible only over hand-coded and counted predictors. No latent, embedded, or model-inferred variable may enter as a term.',
  },
  {
    tool: 'Provenance hashing',
    answers: 'Which exact text produced which numbers.',
    outputs: 'SHA-256 per source file, recorded per run.',
    why_admissible: 'Makes every result re-runnable against the identical input. Without it no statistic is reproducible.',
  },
];

// The model spec, corrected. Observed and human-rated terms only.
export const REVISED_SPEC = {
  withdrawn: 'Y_final = \u03b2\u2080 + \u03b2\u2081X_forensic + \u03b2\u2082X_historical \u2212 \u03b2\u2083R_code_switch \u2212 \u03b2\u2084R_schema_bias + \u03b5',
  withdrawn_reason:
    'Two terms were model-inferred (X_forensic proximity vectors, R_schema_bias) and one carried an inverted sign (R_code_switch). No coefficient was ever estimated. The specification is withdrawn, not re-fitted.',
  replacement:
    'D = w\u2081\u00b7Displacement + w\u2082\u00b7Restoration + w\u2083\u00b7RegisterFunction + w\u2084\u00b7TestimonyIntegrity',
  terms: [
    { symbol: 'Displacement', source: 'Human-rated against codebook, two raters, \u03ba reported.', class: 'HUMAN_RATED' },
    { symbol: 'Restoration', source: 'Count of historical claims returned to the record with a traceable source.', class: 'OBSERVED' },
    { symbol: 'RegisterFunction', source: 'Hand-annotated code-switch ledger with function tags. Positive direction, enforced.', class: 'OBSERVED' },
    { symbol: 'TestimonyIntegrity', source: 'Human-rated fidelity to the verified record.', class: 'HUMAN_RATED' },
  ],
  weights:
    'Weights are declared and published before any run, then frozen with a version number. They are set by the principal investigator, not fitted to produce a preferred result and not proposed by a model.',
};