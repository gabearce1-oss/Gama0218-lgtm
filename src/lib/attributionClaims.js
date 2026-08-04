// Attribution Verification Ledger.
// Records attributions made ABOUT the manuscript by third parties, and what the
// project can actually document. These are verification records, not findings of
// misconduct. "Not substantiated" means no retrievable document exists — it is a
// statement about the evidence available to this project, not about any person.

export const LEDGER_RULE =
  'Each row records an attribution and the document that would substantiate it. Where no retrievable document exists, the attribution is withdrawn from the record. No row asserts intent, and no row is an allegation against a named person or institution.';

export const ATTRIBUTION_CLAIMS = [
  {
    id: 'ATTR-001',
    attribution: 'A Library of Congress audit of the manuscript, and an associated scholarship invitation (May).',
    surfaced_via: 'Third-party representation relayed to the author.',
    document_required:
      'An LoC-issued audit report, award notice, or file reference retrievable directly from the institution.',
    author_inquiry:
      'The author sought the underlying audit. No audit of this description was located, and no LoC-issued record was produced.',
    status: 'NOT_SUBSTANTIATED',
    disposition:
      'Withdrawn from the measurement and reputational record. May not be cited, restated, or used as standing.',
  },
  {
    id: 'ATTR-002',
    attribution: 'A scholarly review attributed to Dr. Gonzalez, a colleague of the author.',
    surfaced_via: 'Third-party representation relayed to the author.',
    document_required:
      'A dated review signed by the named reviewer, or the reviewer\'s own confirmation of authorship.',
    author_inquiry:
      'The author, who knows the named colleague professionally, found no record that such a review was authored or requested.',
    status: 'NOT_SUBSTANTIATED',
    disposition:
      'Withdrawn. Attributing a review to a named scholar without that scholar\'s confirmation is treated here as a governance failure regardless of origin.',
  },
  {
    id: 'ATTR-003',
    attribution: 'Institutional acceptance or endorsement associated with USC, the author\'s alma mater.',
    surfaced_via: 'Third-party representation relayed to the author.',
    document_required: 'Institutional correspondence or an acceptance record retrievable from the university.',
    author_inquiry: 'Not verifiable. No institutional document was produced.',
    status: 'NOT_VERIFIABLE',
    disposition: 'Withdrawn. Recorded as an author concern pending institutional response.',
  },
  {
    id: 'ATTR-004',
    attribution:
      'Use of AI technology in drafting and revision, disclosed by Mr. Harris.',
    surfaced_via: 'Direct disclosure by the party involved.',
    document_required: 'The disclosure itself.',
    author_inquiry:
      'Disclosed and verifiable. This is the one row in the ledger that is documented, and it is what allows the model-authored material to be identified and separated rather than guessed at.',
    status: 'DISCLOSED_AND_VERIFIABLE',
    disposition:
      'Accepted as provenance evidence. Material identified through this disclosure is routed to quarantine (QL-EXT-001), not deleted.',
  },
];

export const STATUS_STYLES = {
  NOT_SUBSTANTIATED: { label: 'Not substantiated', className: 'border-red-500/30 bg-red-500/5 text-red-300' },
  NOT_VERIFIABLE: { label: 'Not verifiable', className: 'border-amber-500/30 bg-amber-500/5 text-amber-300' },
  DISCLOSED_AND_VERIFIABLE: {
    label: 'Disclosed · verifiable',
    className: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
  },
};

export const STANDARD_OF_PROOF =
  'Substantiation requires a document retrievable from the issuing institution or a confirmation from the named individual. Plausibility, relay, and model-generated summaries do not substantiate an attribution.';