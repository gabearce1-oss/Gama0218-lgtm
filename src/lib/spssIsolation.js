export const SPSS_ISOLATION = {
  order_id: 'ISO-SPSS-001',
  effective: '2026-08-03',
  rule:
    'SPSS is an air-gapped statistical lab. No AI may operate inside it, on it, or on anything entering or leaving it.',
};

export const PROHIBITED = [
  'No AI-assisted or AI-embedded features enabled inside SPSS — no assistants, no suggested models, no automated variable or model selection.',
  'No syntax written, drafted, completed, corrected, or reviewed by a model. Syntax is typed by a named analyst.',
  'No AI-generated, AI-extracted, AI-imputed, or AI-transformed values in any dataset that is opened in SPSS.',
  'No output leaves SPSS through an AI summariser, interpreter, or report writer. Tables are read and written up by a human.',
  'No cloud, plug-in, extension, or network service that routes SPSS data or output through a model.',
  'No model may be consulted to choose a test, set a threshold, interpret a coefficient, or decide what is significant.',
];

export const REQUIRED = [
  ['Input provenance', 'Every dataset entering SPSS carries a SHA-256 hash and a class per variable: OBSERVED, HUMAN_RATED, or DERIVED. AI_EXTRACTED variables are refused at the door, approved or not.'],
  ['Transfer method', 'Datasets move in as flat files exported from the governed warehouse. No live connector, no API pull, no sync.'],
  ['Syntax custody', 'All analysis is run from saved .sps syntax files, authored and signed by a named analyst, versioned and retained.'],
  ['Reproducibility', 'Any result must re-run from the same file plus the same syntax and produce identical output. If it cannot, it is not a result.'],
  ['Attestation', 'Each run is logged with the analyst name, dataset hash, syntax version, and a signed statement that no model touched the run.'],
];

export const BOUNDARY = [
  { zone: 'SPSS — the lab', status: 'AI-FREE', detail: 'Statistical computation. Human-authored syntax over human-verified data. Autonomous; not governed by the app.' },
  { zone: 'LitCentral — the warehouse', status: 'AI-FREE FOR MEASUREMENT', detail: 'Holds the governed record. May use AI only for clerical work that never produces a stored number.' },
  { zone: 'Cognos — reporting', status: 'READ-ONLY', detail: 'Displays what the lab and warehouse already established. Computes nothing new.' },
];

export const VIOLATION = {
  consequence:
    'Any result produced in a session where AI touched the environment, the data, the syntax, or the write-up is void. It is not corrected or re-reviewed — the dataset is re-exported and the run is repeated clean.',
};