export const analysisWorkflow = [
  ['1. Preserve', 'Keep the full manuscript data set and its provenance intact.', 'emerald'],
  ['2. Specify', 'Define the question, variables, coding rules, sample, and intended test before analysis.', 'cyan'],
  ['3. Clean', 'Record validation, missing-data, and transformation decisions in a reproducible review log.', 'amber'],
  ['4. Review', 'Use qualified human reviewers and documented questionnaires to interpret analysis outputs.', 'violet'],
  ['5. Govern', 'Only source-backed, approved measures may affect the canonical score; exploratory findings remain diagnostic.', 'red'],
];

export const excelHandoff = [
  'Use one row per variable or measure—do not combine unrelated measures in one cell.',
  'Include: measure name, definition, source, collection method, data type, allowed values, and owner.',
  'Mark the role as Canonical score, Diagnostic only, Reviewer input, or Quarantined candidate.',
  'Record missing-data and cleansing rules separately from the source values.',
  'For every score-affecting measure, cite the supporting standard and its approval record.',
  'Keep questionnaire responses and reviewer identities in their designated protected columns or files.',
];