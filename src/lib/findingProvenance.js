// Findings Provenance Log.
// Every forensic screening finding is bound here to the source material it rests on,
// cited in APA 7 form. The governing rule is that a finding inherits the weakest
// provenance among its sources: a conflict observed between a verified artifact and an
// unestablished report is a finding ABOUT the report, never a finding about the manuscript.

export const PROVENANCE_RULE =
  'A finding may be recorded only when its source material is named and classified. Where a source cannot be retrieved from an issuing party, the finding is retained as an open conflict and never promoted to a measurement result. Findings inherit the weakest provenance tier among their sources.';

// Provenance tiers, defined explicitly so a reader never has to infer what a label means.
export const TIERS = {
  T1: {
    code: 'T1',
    label: 'Held · provenance established',
    definition:
      'The project physically holds the artifact and its origin is documented. Values may be recomputed by hand from it.',
    className: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
  },
  T2: {
    code: 'T2',
    label: 'Held · provenance unestablished',
    definition:
      'The project holds the file, but its authorship, date, or issuing party is not documented. Readable, not citable as authority.',
    className: 'border-amber-500/30 bg-amber-500/5 text-amber-300',
  },
  T3: {
    code: 'T3',
    label: 'Held · not readable',
    definition:
      'The artifact exists in the project record but cannot be opened or parsed. Its contents can be neither confirmed nor ruled out.',
    className: 'border-orange-500/30 bg-orange-500/5 text-orange-300',
  },
  T4: {
    code: 'T4',
    label: 'Not retrievable',
    definition:
      'Relayed statement with no underlying document. Under APA 7 a non-retrievable communication is not a citable source; it is recorded, not cited.',
    className: 'border-red-500/30 bg-red-500/5 text-red-300',
  },
};

// Source register. APA 7 reference entries for each body of material the findings draw on.
export const SOURCES = {
  'SRC-01': {
    id: 'SRC-01',
    tier: 'T1',
    inText: '(Ramos, n.d.)',
    reference: 'Ramos, G. (n.d.). SGT George Ramos Vault II [Unpublished manuscript]. Held by G. Arce.',
    note: 'The artifact under examination. 44 chapters verified against the source document, plus four loose epilogues.',
    registerRef: 'REF-P1',
  },
  'SRC-02': {
    id: 'SRC-02',
    tier: 'T1',
    inText: '(Arce, 2026)',
    reference:
      'Arce, G. (2026). LitCentral measurement constitution and codebook (Version 1.5) [Unpublished instrument]. OmegaManuscript.',
    note: 'The frozen codebook and the live chapter ledger built under it. Every value is hand-recomputable.',
    registerRef: 'REF-P2',
  },
  'SRC-03': {
    id: 'SRC-03',
    tier: 'T2',
    inText: '(Audit report, n.d.)',
    reference:
      'Audit report of SGT George Ramos Vault II [Unpublished report]. (n.d.). Provenance unestablished. Authorship includes model-generated content per disclosure ATTR-004.',
    note:
      'The document supplying most conflict findings. Blends analysis, generated advice, code excerpts, and submission language, so no single authorship can be assigned to any one passage.',
    registerRef: null,
  },
  'SRC-04': {
    id: 'SRC-04',
    tier: 'T2',
    inText: '(Market baseline record, n.d.)',
    reference:
      'Market baseline record [Unpublished data record]. (n.d.). Provenance unestablished. Coefficients labeled diagnostic or unrecovered within the source itself.',
    note: 'Supplies competing duplicate-chapter flags and competing regression coefficients.',
    registerRef: null,
  },
  'SRC-05': {
    id: 'SRC-05',
    tier: 'T3',
    inText: '[Forensic PDFs, unavailable]',
    reference:
      'Two forensic screening reports [Unpublished PDFs]. (n.d.). Held in project record; files could not be opened for review.',
    note:
      'Because these cannot be read, hidden prompt injection and tainted formulas can be neither confirmed nor excluded from them.',
    registerRef: null,
  },
  'SRC-06': {
    id: 'SRC-06',
    tier: 'T4',
    inText: 'Not citable — non-retrievable communication',
    reference:
      'Third-party representations relayed to the author (n.d.). No underlying document produced. Recorded in the Attribution Verification Ledger as ATTR-001 through ATTR-003.',
    note:
      'APA 7 treats a communication the reader cannot retrieve as non-citable. These statements are therefore logged as withdrawn attributions rather than cited as sources.',
    registerRef: 'ATTR-001 / 002 / 003',
  },
  'SRC-07': {
    id: 'SRC-07',
    tier: 'T2',
    inText: '(Canon chart, n.d.)',
    reference:
      'Canon chart [Data set]. (n.d.). Registered in this project as W2-FRAME-001. Provenance unestablished.',
    note:
      'Roughly 700 ranked titles with frequency counts. Held and readable; admitted as a control sampling frame only, with its percentile claims rejected.',
    registerRef: 'REF-P3',
  },
};

// Each finding, bound to its sources. `finding` text matches the screening register verbatim.
export const FINDING_PROVENANCE = [
  {
    id: 'FP-01',
    severity: 'Critical',
    finding: 'Canonical dataset drift',
    sources: ['SRC-01', 'SRC-02', 'SRC-03'],
    evidence:
      'Three chapter counts are in circulation: 46 in the live ledger, 45 named canonical by the audit report, and 44 verified against the source document.',
    reasoning:
      'Only the count of 44 rests on a T1 artifact, because it was read from the manuscript itself. The other two counts are a project record and an unestablished report respectively.',
    closure:
      'Freeze one manuscript version and recount from SRC-01 alone. The competing counts are then superseded rather than reconciled.',
    inherited: 'T2',
  },
  {
    id: 'FP-02',
    severity: 'Critical',
    finding: 'Duplicate-chapter evidence conflict',
    sources: ['SRC-03', 'SRC-04'],
    evidence:
      'The audit report flags Ch. 9/10 as near-duplicates; the market baseline record flags Ch. 17/18 instead. The two do not overlap.',
    reasoning:
      'Both sources sit at T2, so neither can adjudicate the other. A disagreement between two unestablished sources produces no finding about the manuscript at all.',
    closure:
      'Run a hand comparison of all four chapters against the frozen text of SRC-01 and record the result as a first-party finding.',
    inherited: 'T2',
  },
  {
    id: 'FP-03',
    severity: 'High',
    finding: 'Score and baseline drift',
    sources: ['SRC-02', 'SRC-03'],
    evidence:
      'Manuscript-wide \u03a9 appears as 104.94 and as 107.34 in supplied records, neither matching the live-ledger mean.',
    reasoning:
      'The supplied values cannot be recomputed by hand because the procedure that produced them is not documented in the source. Under the codebook that alone bars them from the measurement record.',
    closure:
      'Recompute \u03a9 for every chapter under SRC-02 by hand. Supplied values are retained as artifacts of the dispute, not as comparisons.',
    inherited: 'T2',
  },
  {
    id: 'FP-04',
    severity: 'High',
    finding: 'Word-count reconciliation',
    sources: ['SRC-01', 'SRC-03'],
    evidence:
      'The audit report documents 241,117 words against a 248,812 chapter sum — a variance of +7,695 words, or +3.2%.',
    reasoning:
      'This is the one conflict where the first-party record is the stronger one: the per-chapter counts read from the source document displace both supplied figures.',
    closure:
      'Publish the per-chapter counts from SRC-01 as the count of record. The variance then documents the report, not the manuscript.',
    inherited: 'T2',
  },
  {
    id: 'FP-05',
    severity: 'High',
    finding: 'Formula provenance not established',
    sources: ['SRC-03', 'SRC-04'],
    evidence:
      'The audit labels its regression canonical while simultaneously labeling several market coefficients diagnostic or unrecovered.',
    reasoning:
      'A source that contradicts itself on the standing of its own coefficients cannot serve as external validation for anything. This finding is the documentary basis for the decommission order.',
    closure:
      'None available from these sources. Any surviving coefficient must be re-derived under a published procedure with a named human operator.',
    inherited: 'T2',
  },
  {
    id: 'FP-06',
    severity: 'Medium',
    finding: 'Institutional claims need primary records',
    sources: ['SRC-06'],
    evidence:
      'Repository, certification, timestamp, and institutional-status statements appear in the supplied reports with no issuing-party records behind them.',
    reasoning:
      'Every one of these traces to a relayed statement with no retrievable document, which is the definition of a T4 source. They are not weak citations; they are not citations.',
    closure:
      'Already closed by withdrawal. ATTR-001 through ATTR-003 record these as not substantiated or not verifiable, and they may not be restated as standing.',
    inherited: 'T4',
  },
  {
    id: 'FP-07',
    severity: 'Medium',
    finding: 'Mixed-source document risk',
    sources: ['SRC-03'],
    evidence:
      'The audit source interleaves human analysis, generated advice, code, and submission language without attribution boundaries.',
    reasoning:
      'Because authorship cannot be assigned passage by passage, no passage in it can be promoted individually. The disclosure at ATTR-004 is what makes this separable rather than merely suspected.',
    closure:
      'Keep narrative claims and evidence records partitioned in every handoff. Material identified through the ATTR-004 disclosure routes to quarantine QL-EXT-001.',
    inherited: 'T2',
  },
  {
    id: 'FP-08',
    severity: 'Medium',
    finding: 'Unreadable forensic sources',
    sources: ['SRC-05'],
    evidence: 'Two supplied forensic PDFs remain unopenable, so their contents are entirely unexamined.',
    reasoning:
      'An unreadable file supports no conclusion in either direction. Recording it as an open gap is the only defensible treatment; treating silence as absence of contamination would be an inference.',
    closure:
      'Obtain readable copies from the supplying party, or record the gap permanently in the chain of custody.',
    inherited: 'T3',
  },
];

export const SEVERITY_STYLES = {
  Critical: 'border-red-500/30 bg-red-500/10 text-red-300',
  High: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Medium: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
};

// Counts for the log header — computed, never hardcoded.
export function provenanceSummary() {
  const byTier = Object.keys(TIERS).reduce((acc, t) => ({ ...acc, [t]: 0 }), {});
  FINDING_PROVENANCE.forEach((f) => {
    byTier[f.inherited] += 1;
  });
  const firstParty = FINDING_PROVENANCE.filter((f) => f.sources.some((s) => SOURCES[s].tier === 'T1')).length;
  return {
    findings: FINDING_PROVENANCE.length,
    sources: Object.keys(SOURCES).length,
    byTier,
    firstParty,
  };
}