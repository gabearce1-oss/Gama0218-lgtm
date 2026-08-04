// SPSS handoff protocol — this app is the warehouse/monitor, not the analyst.
// Extraction happens here; the statistical run happens outside, air-gapped.

export const CUSTODY_ROLE = {
  label: 'ISO-SPSS-001 · Warehouse role',
  holds: [
    'Inventory: every chapter row, score component, and blocker is tracked here.',
    'Extraction: SPSS-ready flat files are generated on demand from live entity data.',
    'Monitoring: the run is visible in the command center as a logged handoff.',
  ],
  forbids: [
    'Running the statistics. SPSS is outside this environment and stays outside.',
    'Writing any SPSS-derived value back into canon without a signed human ruling.',
    'Any model assigning, weighting, or adjusting a component score.',
  ],
};

export const PROTOCOL_STEPS = [
  {
    id: 'P1',
    name: 'Freeze the frame',
    detail: 'Confirm the chapter registry scope (Vault II, 44 verified chapters) before extraction. Any pending or blocker row is exported with its status intact — never silently dropped.',
  },
  {
    id: 'P2',
    name: 'Extract flat file',
    detail: 'Download the SPSS Data Extract below. One row per chapter, one column per variable, no merged cells, no formulas — SPSS reads it as a clean rectangular case file.',
  },
  {
    id: 'P3',
    name: 'Carry the dictionary',
    detail: 'The Variable Dictionary sheet travels with the data: name, label, measurement level, and permitted range for every column. SPSS variable view is built from this, not from guesswork.',
  },
  {
    id: 'P4',
    name: 'Run outside, air-gapped',
    detail: 'Descriptives, frequencies, and regressions are executed in IBM SPSS Statistics by the human analyst. No syntax, data, or output passes through a model.',
  },
  {
    id: 'P5',
    name: 'Sign the attestation',
    detail: 'Output is only quotable once a named human signs the run: date, syntax file, dataset checksum, and reviewer. Unsigned output is treated as quarantined.',
  },
  {
    id: 'P6',
    name: 'Return the footprint',
    detail: 'Signed results come back as a forensic footprint record — logged, versioned, and readable in the command center. Governance decisions remain with the administrator.',
  },
];

// name, label, level, range — mirrors what SPSS variable view expects.
export const VARIABLE_DICTIONARY = [
  { field: 'chapter_number', name: 'CHNUM', label: 'Chapter number', level: 'Ordinal', range: '1–44' },
  { field: 'title', name: 'CHTITLE', label: 'Chapter title', level: 'Nominal', range: 'String' },
  { field: 'act', name: 'ACT', label: 'Narrative act', level: 'Nominal', range: 'I / II / III' },
  { field: 'status', name: 'CHSTAT', label: 'Scoring status', level: 'Nominal', range: 'scored / pending / blocker' },
  { field: 'word_count', name: 'WORDS', label: 'Chapter word count', level: 'Scale', range: '0–∞' },
  { field: 'omega', name: 'OMEGA', label: 'Omega score (RF 1.5)', level: 'Scale', range: '71.443–114.593' },
  { field: 'omega_audit', name: 'OMEGAAUD', label: 'Omega, audit-verified', level: 'Scale', range: '71.443–114.593' },
  { field: 'cls', name: 'CLS', label: 'Chicano Lens Score', level: 'Scale', range: '0–100' },
  { field: 'bis', name: 'BIS', label: 'Beats Intensity Score', level: 'Scale', range: '0–100' },
  { field: 'sii', name: 'SII', label: 'Sensory Immersion Index', level: 'Scale', range: '0–100' },
  { field: 'mrf', name: 'MRF', label: 'Master Revision Framework', level: 'Scale', range: '0–100' },
  { field: 'moral_weight', name: 'MORALWT', label: 'Moral weight', level: 'Scale', range: '0–100' },
  { field: 'agency_under_fire', name: 'AGENCY', label: 'Agency under fire', level: 'Scale', range: '0–100' },
  { field: 'grief_index', name: 'GRIEF', label: 'Grief index', level: 'Scale', range: '0–100' },
  { field: 'body_memory', name: 'BODYMEM', label: 'Body memory', level: 'Scale', range: '0–100' },
  { field: 'cultural_reflex', name: 'CULTREF', label: 'Cultural reflex', level: 'Scale', range: '0–100' },
  { field: 'beat_pacing', name: 'PACING', label: 'Beat pacing', level: 'Scale', range: '0–100' },
  { field: 'flesch_reading_score', name: 'FLESCH', label: 'Flesch reading ease', level: 'Scale', range: '0–100' },
  { field: 'cs_pct', name: 'CSPCT', label: 'Code-switch percentage', level: 'Scale', range: '0–100' },
  { field: 'spanish_tokens', name: 'SPTOKEN', label: 'Spanish token count', level: 'Scale', range: '0–∞' },
  { field: 'sensory_present', name: 'SENSPRES', label: 'Sensory constants present', level: 'Scale', range: '0–∞' },
  { field: 'sensory_total', name: 'SENSTOT', label: 'Sensory constants possible', level: 'Scale', range: '0–∞' },
];

export const SYNTAX_TEMPLATE = `* AZTLAN TruthEngine360 — SPSS handoff syntax template.
* Run against the extracted flat file. Human-executed, air-gapped.

DESCRIPTIVES VARIABLES=OMEGA CLS BIS SII MRF
  /STATISTICS=MEAN STDDEV MIN MAX.

FREQUENCIES VARIABLES=ACT CHSTAT
  /ORDER=ANALYSIS.

REGRESSION
  /DEPENDENT OMEGA
  /METHOD=ENTER CLS BIS SII MRF.

CORRELATIONS
  /VARIABLES=OMEGA MORALWT AGENCY GRIEF PACING FLESCH
  /PRINT=TWOTAIL NOSIG.
`;