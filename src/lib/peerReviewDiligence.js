// PEER REVIEW DUE DILIGENCE
//
// The governing position: an internal score is a private assertion until an
// independent qualified reader can check it. Peer review is not decoration on
// top of the measurement program — it is the mechanism that converts a number
// into a finding. Everything in this file is an eligibility assessment, not a
// record of acceptance. No submission has been made.

export const FOUNDATION_STATEMENT =
  'Scoring means nothing without peer review. A figure produced inside this system is an internal assertion \u2014 reproducible, versioned, documented, and still unreviewed. Review by qualified independent readers is what makes it a finding. The measurement architecture exists to survive that review, not to substitute for it.';

export const REVIEW_IS_REAL = [
  {
    id: 'REAL-1',
    claim: 'It is the only external check this project has',
    detail:
      'Every internal control \u2014 the codebook, the frozen instrument, the provenance tiers, the quarantine ladder \u2014 is self-administered. Self-administered controls catch arithmetic errors and cannot catch framing errors. Peer review is the only process here staffed by people with no stake in the outcome.',
  },
  {
    id: 'REAL-2',
    claim: 'It is the correction that already worked once',
    detail:
      'The code-switching penalty was not caught by scoring. It was caught by a human reading the output and recognizing that the instrument was measuring the inverse of the declared construct. That is peer review in miniature, and it is the strongest finding this project holds.',
  },
  {
    id: 'REAL-3',
    claim: 'It is what the claim class requires',
    detail:
      'Canon standing is a collective judgement issued by readers, teachers, and archives. This system is permanently barred from issuing it. The only legitimate route to standing runs through the people who make that judgement \u2014 which is to say, through review.',
  },
  {
    id: 'REAL-4',
    claim: 'It converts an unpublished work from absent to assessable',
    detail:
      'Absence from a syllabus frame is a publication-status fact, not a quality fact. Review is the process that changes publication status. It is the one action that alters the structural condition rather than relitigating it.',
  },
];

// Two distinct qualification tracks. The manuscript is eligible under both, for
// different reasons, and they must be pursued through different venues.
export const QUALIFICATION_FRONTS = [
  {
    id: 'FRONT-A',
    front: 'As a historical artifact',
    thesis:
      'A suppressed Chicano Vietnam record, restored and traceable. The manuscript carries documentary material that is not otherwise in the accessible record.',
    grounds: [
      'Primary-source testimony from a population systematically under-represented in the Vietnam literary and historical record.',
      'Restored material: content recovered through documented restoration, with the restoration itself logged rather than silently absorbed.',
      'A provenance chain exists. Source documents, reconciliation audits, and a chain-of-custody record are held, not asserted from memory.',
      'The contamination incident is itself documentable evidence \u2014 a dated record of a commercial model deflating bilingual prose, preserved with transcripts.',
    ],
    reviewers: 'Oral history programs, Chicano/Latino studies faculty, Vietnam-era archives, veteran documentation projects.',
    className: 'border-amber-500/30 bg-amber-500/5',
  },
  {
    id: 'FRONT-B',
    front: 'As literary prose',
    thesis:
      'A craft object that can be held to a standard. Code-switching is not ornament in this manuscript \u2014 it is the mechanism by which displacement is recorded in speech.',
    grounds: [
      'Chapter-level craft data already exists: pacing, readability, beat structure, and word-count architecture across the full manuscript.',
      'Code-switching is annotated at line level with matrix codes and function tags \u2014 a corpus, not an impression.',
      'The prose makes a formal argument: bilingual register carries the evidentiary load, which is a claim a literary reviewer is equipped to evaluate.',
      'Weak points are already identified and disclosed rather than concealed, which is the posture review rewards.',
    ],
    reviewers: 'Literary journals with bilingual and Chicano/Chicana editorial history, MFA-affiliated readers, translation and code-switching scholars.',
    className: 'border-emerald-500/30 bg-emerald-500/5',
  },
  {
    id: 'FRONT-C',
    front: 'As a methodological case',
    thesis:
      'A documented instance of algorithmic bias against bilingual prose, with the governance response recorded in full.',
    grounds: [
      'The bias claim is testable: identical passages, differing register, dated model outputs.',
      'The governance architecture built in response \u2014 decommission order, claim classes, human-recomputation rule \u2014 is publishable independently of the manuscript.',
      'The failure and its correction are both on the record, which is what makes the case usable to other researchers.',
      'No result depends on trusting this project\u2019s own scoring; the case rests on transcripts and procedure.',
    ],
    reviewers: 'Digital humanities venues, computational literary studies, AI ethics and fairness reviewers.',
    className: 'border-sky-500/30 bg-sky-500/5',
  },
];

// Honest readiness. What is in hand versus what review will demand and this project does not yet have.
export const READINESS = {
  in_hand: [
    'Full chapter ledger reconciled against verbatim source documents.',
    'Published codebook structure and empty schema-controlled workbook templates.',
    'Provenance tiers with APA 7 citations for every finding, including unestablished sources named as unestablished.',
    'Dated incident evidence for the code-switching penalty.',
    'A written record of every retired instrument and the reason for its retirement.',
  ],
  not_yet: [
    'No submission has been made to any venue. Nothing here has been reviewed by an independent reader.',
    'Several instrument procedures are not yet published, so the figures they produce are not yet auditable by a reviewer.',
    'The two unreadable forensic PDFs remain unprocessed and cannot support any finding.',
    'Chapter 43 and the Epilogue remain unverified in the ledger.',
    'Control-text scoring under the frozen instrument has not been executed, so no legitimate comparison exists yet.',
  ],
  bar:
    'A reviewer will ask one question of every number: can I reproduce this from the source text using your published procedure? Where the answer is no, the number is withdrawn before submission rather than defended during review.',
};