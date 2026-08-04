// Omega Playbook — internal scorecard constants.
// Every number here is reproducible by hand from the published formula.

export const FORMULA = {
  id: 'OMEGA-RF15-001',
  name: 'LitCentral Omega RF 1.5',
  text: 'Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.1005·MRF',
  intercept: 71.443,
};

export const CEILING = 114.593; // all four components at 100
export const FLOOR = 71.443; // all four components at 0
export const ELITE_GATE = 109.5;

export const COMPONENTS = [
  { key: 'CLS', label: 'Chicano Lens Score', weight: 0.124, note: 'Cultural register, code-switching, barrio/familia markers.' },
  { key: 'BIS', label: 'Beats Intensity Score', weight: 0.118, note: 'Emotional beat weight across the six valences.' },
  { key: 'SII', label: 'Sensory Immersion Index', weight: 0.089, note: 'Counted sensory constants present per chapter.' },
  { key: 'MRF', label: 'Master Revision Framework', weight: 0.1005, note: 'Structural compliance and revision completeness.' },
];

// 114.593 is the internal reconstruction target, not a canon merit claim.
export const CEILING_DOCTRINE = [
  'The ceiling is arithmetic, not editorial: it is what the formula returns when every component is entered at 100.',
  'Reaching 114.593 means the four component sheets are complete — it does not mean the chapter is canon-grade.',
  'A reconstruction score is only valid if a human can recompute it by hand from the codebook and the source text.',
  'No AI may assign or weight any component value. AI is clerical: transcription, formatting, drafting for sign-off.',
];

export const SCORECARD_TRACKS = [
  {
    id: 'internal',
    name: 'Internal scorecard',
    scope: 'Held by this project. Not a public claim.',
    holds: [
      'Ω under RF 1.5, recomputed from CLS/BIS/SII/MRF entries',
      'Reconstruction target 114.593 (formula ceiling)',
      'Elite gate 109.5 as an internal review threshold',
      'Prose craft measures: pacing, fatigue, sensory density',
    ],
    forbids: [
      'Presenting Ω as an external ranking or award standing',
      'Comparing Ω against corpus percentiles',
      'Any score entered by a model rather than a human reader',
    ],
  },
  {
    id: 'public',
    name: 'Public criteria',
    scope: 'Owned by outside institutions. We follow theirs, unchanged.',
    holds: [
      'Library of Congress and Pulitzer-aligned published criteria',
      'Peer review by qualified third-party readers',
      'Documented procedure published before any data run',
      'APA 7 attribution for every cited source',
    ],
    forbids: [
      'Substituting our Ω for their rubric',
      'Rewriting their criteria to fit our instrument',
      'Claiming standing we have not been awarded',
    ],
  },
];

export const SPSS_LANE = {
  label: 'ISO-SPSS-001',
  statements: [
    'SPSS is an air-gapped statistical lab: no model touches its syntax, data, or output.',
    'Every run carries a signed human attestation before its output is quotable.',
    'Descriptives and regressions describe our own entries only — never the external corpus.',
  ],
};

/** Ω under RF 1.5 for a set of component values. */
export function omegaRF15({ cls = 0, bis = 0, sii = 0, mrf = 0 }) {
  return FORMULA.intercept + 0.124 * cls + 0.118 * bis + 0.089 * sii + 0.1005 * mrf;
}

/** Points of Ω still available on each component before the ceiling. */
export function headroom({ cls = 0, bis = 0, sii = 0, mrf = 0 }) {
  const values = { CLS: cls, BIS: bis, SII: sii, MRF: mrf };
  return COMPONENTS.map((c) => ({
    ...c,
    value: values[c.key],
    pointsLeft: Math.max(0, 100 - values[c.key]),
    omegaLeft: Math.max(0, 100 - values[c.key]) * c.weight,
  }));
}