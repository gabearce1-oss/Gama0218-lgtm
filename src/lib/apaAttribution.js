// APA 7 attribution register.
// Only two classes of entry are permitted here:
//   PRIMARY  - artifacts this project physically holds (manuscript, workbooks, corpora).
//   FRAMING  - published scholarship already formally adopted by the project.
// A citation slot with no held artifact and no adopted publication stays UNRESOLVED.
// Nothing is added to this register from model recall.

export const AUTHOR_OF_RECORD = 'Arce, G.';

export const REFERENCES = [
  {
    id: 'REF-P1',
    class: 'PRIMARY',
    reference:
      'Ramos, G. (n.d.). SGT George Ramos Vault II [Unpublished manuscript]. Held by G. Arce.',
    inText: '(Ramos, n.d.)',
    role: 'The artifact under examination. 44 chapters verified from the source document, plus four loose epilogues.',
    held: true,
  },
  {
    id: 'REF-P2',
    class: 'PRIMARY',
    reference:
      'Arce, G. (2026). LitCentral measurement constitution and codebook (Version 1.5) [Unpublished instrument]. OmegaManuscript.',
    inText: '(Arce, 2026)',
    role: 'The frozen codebook. Defines every variable a human must be able to recompute by hand.',
    held: true,
  },
  {
    id: 'REF-P3',
    class: 'PRIMARY',
    reference:
      'Canon chart [Data set]. (n.d.). Registered in this project as W2-FRAME-001. Provenance unestablished.',
    inText: '(Canon chart, n.d.)',
    role:
      'Approximately 700 ranked titles with frequency counts. Registered as a control sampling frame; its percentile claims are rejected.',
    held: true,
  },
  {
    id: 'REF-P4',
    class: 'PRIMARY',
    reference:
      'Arce, G. (2026). External audit register: QL-EXT-001 quarantine methodology [Unpublished record]. OmegaManuscript.',
    inText: '(Arce, 2026)',
    role: 'Governs how external and model-authored artifacts are held out of the measurement record.',
    held: true,
  },
  {
    id: 'REF-F1',
    class: 'FRAMING',
    reference:
      'Kellman, S. G. (2023). Nimble tongues: Studies in literary translingualism. Purdue University Press.',
    inText: '(Kellman, 2023)',
    role:
      'Framing authority for canon formation and translingual writing. Cited for theory only — never as a source of scores or percentiles.',
    held: true,
  },
];

// Citation slots the argument would need but the project cannot currently fill.
export const UNRESOLVED_SLOTS = [
  {
    slot: 'Institutional review of the manuscript',
    needed: 'A dated review document on institutional letterhead, with a named reviewer and a retrievable identifier.',
    status: 'UNRESOLVED — see the Attribution Verification Ledger on Forensic Screening.',
  },
  {
    slot: 'Library of Congress audit or scholarship record',
    needed: 'An LoC-issued document, award notice, or file number retrievable from the institution itself.',
    status: 'UNRESOLVED — no such document is held.',
  },
  {
    slot: 'Percentile standing of the manuscript against a canon population',
    needed:
      'A defined population, a documented sampling frame, and a published ranking instrument. None of the three exist.',
    status: 'UNRESOLVED — claim withdrawn rather than cited.',
  },
];

export const CITATION_RULE =
  'A source is citable here only if the project holds the artifact or the publication has been formally adopted. Model-recalled citations are not admissible, and an unfillable slot is recorded as unresolved rather than approximated.';