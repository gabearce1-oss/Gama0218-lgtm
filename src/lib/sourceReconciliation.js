// Extracted directly from SGTGeorgeRamosVaultII.docx (word/document.xml, 2026-08-03).
// Counts are literal whitespace-token counts of body paragraphs under each chapter heading.
// Nothing here is modeled, estimated, or model-generated.

export const SOURCE_META = {
  artifact: 'SGTGeorgeRamosVaultII.docx',
  extracted_at: '2026-08-03',
  method: 'Direct OOXML paragraph extraction; headings matched on "CHAPTER n —"',
  heading_blocks: 54,
  distinct_numbers: 43,
  total_words: 264828,
  mapped_words: 262285,
  standalone_epilogues: 4,
};

export const RECONCILIATION_FINDINGS = [
  {
    id: 'SRC-1',
    title: 'The 46-chapter ledger does not exist in the source',
    detail:
      'The source contains 54 chapter-heading blocks carrying 43 distinct chapter numbers, ending at Chapter 44. The app held 46 sequential records. The count was never read from the manuscript.',
    consequence: 'Chapter count is now stated as read: 43 numbered chapters, 44 as the highest number.',
  },
  {
    id: 'SRC-2',
    title: 'Every 5,200-word count was a placeholder',
    detail:
      'Thirty-four records carried an identical 5,200-word value. Real counts range from 2,064 (Ch. 29) to 11,921 (Ch. 30). Total body words: 264,828.',
    consequence: 'All word counts replaced with literal counts. Any figure computed per-1,000-words was wrong.',
  },
  {
    id: 'SRC-3',
    title: 'Fourteen chapters had no title, and several stored titles do not match the source',
    detail:
      'Ch. 3 was stored as "The Genocide Algorithm"; the source heading reads "THE DIVERSITY PROJECT". Ch. 18 was "Untitled"; the source reads "Broken Wing" — a title the app had filed under Ch. 36, which the source titles "Mathematics of Revenge".',
    consequence: 'Titles replaced verbatim from the source headings, capitalisation included.',
  },
  {
    id: 'SRC-4',
    title: 'Five chapter numbers are used twice in the source',
    detail:
      'Numbers 20, 21, 23, 30 and 33 each head more than one block — e.g. Ch. 21 heads both "Don\'t Fuck with Familia" and "El Cazador Y El Guardian"; Ch. 30 heads four blocks. Word counts for these are summed across their blocks and their titles taken from the first occurrence.',
    consequence: 'DEFECT, unresolved. Numbering must be corrected in the manuscript before these chapters are scored.',
  },
  {
    id: 'SRC-5',
    title: 'Chapter 43 is absent; stored records 43, 45 and 46 have no source counterpart',
    detail:
      'No block in the source is headed Chapter 43, and numbering stops at 44. Records 43, 45 and 46 — including "Epilogue: The Name on the Record" — match nothing in the file and were left untouched rather than invented over.',
    consequence: 'Those three records are unverified against source and are not eligible for finalisation.',
  },
  {
    id: 'SRC-6',
    title: 'Four epilogues sit inside the numbered sequence',
    detail:
      'Standalone epilogue blocks (962, 271, 655 and 655 words) appear after Ch. 14, Ch. 36 and Ch. 38, and one is duplicated verbatim. They carry no chapter number and are excluded from the mapped total.',
    consequence: '2,543 words of the manuscript sit outside the chapter ledger entirely.',
  },
];

export const SCORE_DISPOSITION = {
  ruling: 'Ω and every sub-score in this ledger remain legacy values. They were not recomputed from this source.',
  reason:
    'The scores were produced against a placeholder ledger with wrong titles and uniform word counts, under the AI-assigned instrument now decommissioned. Rewriting them from the corrected text would require the frozen human-coded instrument and two named raters.',
  next: 'Correct the duplicate numbering, resolve records 43/45/46, then hand-score against the published codebook.',
};

// Numbers whose source headings collide, and records with no source match.
export const DUPLICATE_NUMBERS = [20, 21, 23, 30, 33];
export const UNMATCHED_RECORDS = [43, 45, 46];