// GOV-AI-003 — Custody of scoring, public procedure, and language discipline.
// Amends the decommission order: it named what AI stops doing. This names who
// holds scoring instead, and under what published procedure.

export const CUSTODY_RULE =
  'Scoring is held by humans, or by third parties operating under the published procedure. AI participates in building and verification support only, and holds no scoring role of any kind.';

export const CUSTODIANS = [
  {
    party: 'Named human analyst',
    holds: 'Assignment of every score. Signs the run and the codebook application by name.',
    accountable: 'Reproducibility by hand from the source text.',
    class: 'PRIMARY_CUSTODY',
  },
  {
    party: 'Third-party operator (e.g. a GitHub-hosted implementation)',
    holds:
      'Execution of the published procedure against the frozen codebook. May compute, but may not define, weight, or reinterpret.',
    accountable: 'Producing identical output on re-run from the same input and syntax.',
    class: 'DELEGATED_EXECUTION',
  },
  {
    party: 'AI',
    holds:
      'Platform construction, verbatim transcription, formatting, drafting for human signature, and verification support — surfacing a mismatch for a human to adjudicate.',
    accountable: 'Never holds a score. Never adjudicates. Never selects a method.',
    class: 'NO_SCORING_ROLE',
  },
];

export const CUSTODY_CLASS_STYLES = {
  PRIMARY_CUSTODY: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
  DELEGATED_EXECUTION: 'border-sky-500/30 bg-sky-500/5 text-sky-300',
  NO_SCORING_ROLE: 'border-red-500/30 bg-red-500/5 text-red-300',
};

// The SPSS procedure is published as a document of record, not released as a result.
export const PROCEDURE_STAGES = [
  {
    stage: 'S1',
    name: 'Codebook publication',
    detail:
      'The frozen codebook is published first: every variable, its class, and the hand operation that produces it. Nothing is scored before the definition is public.',
  },
  {
    stage: 'S2',
    name: 'Procedure publication',
    detail:
      'The SPSS procedure itself is published — input format, variable classing, syntax, and the order of operations — so any reader can see how Ramos literature is handled before seeing any number.',
  },
  {
    stage: 'S3',
    name: 'Independent execution',
    detail:
      'A human analyst or a third-party operator runs the published procedure. Saved syntax, signed by name, with a per-run attestation that no model touched it (ISO-SPSS-001).',
  },
  {
    stage: 'S4',
    name: 'Replication',
    detail:
      'An identical re-run is required. A result that does not reproduce is not a finding, and is repeated clean rather than reviewed.',
  },
  {
    stage: 'S5',
    name: 'Entry into the record',
    detail:
      'Only a replicated, signed, hand-reproducible value enters the measurement record. Everything else stays in quarantine.',
  },
];

export const PACE_STATEMENT =
  'This is a long process, and it is meant to be. Measurement is not a load thrown in a washer and dryer — each stage is a document of record that must stand on its own before the next one opens.';

// Language discipline. A learning curve is assumed; the correction is procedural, not blame.
export const RETIRED_LANGUAGE = [
  { term: 'ranked / percentile / top-tier', why: 'No population, sampling frame, or ranking instrument exists.' },
  { term: 'canon standing', why: 'Not the object of study, and never derived from the instrument.' },
  { term: 'validated / proven', why: 'Reserved for a replicated run under the published procedure.' },
  { term: 'audit', why: 'Reserved for an audit that produced a retrievable document from an issuing body.' },
  { term: 'peer-reviewed / endorsed', why: 'Requires a named reviewer\'s own confirmation.' },
  { term: 'AI-measured / AI-scored', why: 'Not a category that can exist under this governance.' },
];

export const PERMITTED_LANGUAGE = [
  'counted · recorded · transcribed verbatim',
  'hand-reproducible · replicated · signed by analyst',
  'quarantined · pending verification · not substantiated',
  'sampling frame · frequency count · institutional assignment',
  'author concern · influence declined · withdrawn from the record',
];

export const LANGUAGE_RULE =
  'Terminology is part of the instrument. Where imprecise language has been used, it is corrected in the record rather than defended — this is a learning curve, and the correction is procedural.';