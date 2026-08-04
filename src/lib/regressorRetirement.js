export const RETIRED_REGRESSORS = [
  { name: 'Gold Desk regressor', reason: 'Model-generated weighting; no published codebook a human can reproduce.' },
  { name: 'McDonald regressor', reason: 'Coefficients cannot be recomputed by hand from the source text.' },
  { name: 'Vector proximity scoring', reason: 'Embedding distance imports cultural bias as merit.' },
  { name: 'Social physics scoring', reason: 'No verifiable source procedure; circular against its own output.' },
  { name: 'AI reasoning scores', reason: 'AI is barred from assigning or weighting any score.' },
];

export const ADHERED_STANDARDS = [
  { name: 'Published accounting-style procedure', note: 'A stated formula, applied the same way every time, reproducible by hand.' },
  { name: 'Pulitzer Prize criteria', note: 'Public, sanctioned award criteria — not model inference.' },
  { name: 'Peer-reviewed book award criteria', note: 'Verified, externally reviewed, published before use.' },
  { name: 'Library of Congress baselines', note: 'Institutional record, citable and auditable.' },
];

export const RETIREMENT_RULE =
  'No regressor may re-enter the measurement record. Any number in this report must trace to a published, peer-reviewed, or institutionally sanctioned procedure that a human can reproduce by hand. This is a locked rule, not a preference.';