// Audit of an external, AI-authored repository that targets this same manuscript.
// Source: github.com/Trruth360/Gama0218-lgtm @ 7a6d2b4 — "LitCentral v13: The
// RamosCanon Report", dated 2026-05-25, authored "AI-Assisted Development".
// Held at arm's length under the same rule as ProseEngine: the shape of a good
// idea may be adopted; the numbers and the authorship may not.

export const RAMOSCANON_META = {
  quarantine_id: 'QL-EXT-002',
  status: 'QUARANTINED — EXTERNAL ARTIFACT, NON-CANONICAL',
  source: 'github.com/Trruth360/Gama0218-lgtm @ 7a6d2b4',
  artifact: 'LitCentral v13 — The RamosCanon Report (RamosCanon.md, src/lib/gates.js)',
  dated: '2026-05-25',
  authorship: 'Declared "AI-Assisted Development" — no human author of record.',
  reviewed_at: '2026-08-03',
  evidence_basis:
    'Read directly from the commit: the report document, the three-gate definitions, the audit-function specification, and the external-source adapter list. No output of this system has been executed or scored here.',
};

// The one finding that has to be resolved before anything else is discussed.
export const OMEGA_COLLISION = {
  headline: 'Two different things are both called Ω',
  ours: 'Manuscript Ω — a literary-metric composite on a ~100-point scale. Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.067·MRF. Reported values run 105–110.',
  theirs:
    'v13 audit Ω — a document-defect score on a 1–10 scale. Ω = MAX(1, MIN(10, 10 − avg_severity / 2)). Gate One passes at Ω ≥ 5.0; "publication-ready" at Ω ≥ 8.0.',
  why_it_matters:
    'These measure unrelated things: one scores the prose, the other scores how badly a document is written up. They share a symbol, a platform name, and a manuscript. Any sentence reading "Ω improved by 0.3" or "Ω 8.0 = publication-ready" belongs to their scale and is meaningless against yours — and a reader, an agent, or a future audit will silently merge them.',
  ruling:
    'Rename on contact. Their metric is recorded here as AUDIT_DEFECT_SCORE_v13, never as Ω. No v13 figure may be entered into the manuscript warehouse, cited in the thesis, or compared to a manuscript Ω value.',
};

export const RAMOSCANON_FINDINGS = [
  {
    id: 'RC-01',
    verdict: 'adopt_shape',
    title: 'Verbatim evidence quotes mandatory on every finding',
    detail:
      'v13 makes evidence_quotes[] required rather than optional, with line numbers and context, and tracks evidence_completeness as findings_with_quotes / total_findings.',
    ours:
      'This is the correct instinct and it matches Article IX. Adopt the requirement and the completeness ratio for our own EvidenceClaim records. Build it ourselves; do not import theirs.',
  },
  {
    id: 'RC-02',
    verdict: 'adopt_shape',
    title: 'SHA-256 version freeze before any scoring run',
    detail:
      'freezeManuscriptVersion hashes manuscript content and refuses to create an audit run unless the frozen version passes normalization.',
    ours:
      'Identical in spirit to Phase 1 of the locked order and to the Chain of Custody manifest. Confirms the sequencing: hash first, score second. Adopt as design confirmation, not as code.',
  },
  {
    id: 'RC-03',
    verdict: 'reject_mechanism',
    title: 'An LLM grades the manuscript, then the score grades the LLM',
    detail:
      'Gate One invokes an LLM that returns findings and severities; audit Ω is then computed from those same model-assigned severities, and Gate Two requires the model-derived score to improve by ≥ 0.3.',
    ours:
      'Circular, and the same defect logged against ProseEngine: the instrument and the subject are the same model. A severity is an AI assignment, not a measurement. Rejected as a scoring mechanism; permissible only as an unreviewed candidate flag awaiting human rating.',
  },
  {
    id: 'RC-04',
    verdict: 'reject_mechanism',
    title: 'Blinded review asserted but not implemented',
    detail:
      'Gate Two passes when blinded_review_passed is true, with an approval chain of methods expert, domain expert, lead reviewer, and publishing committee, plus SLAs in hours.',
    ours:
      'A boolean field is not a blinded review, and named roles with 4-hour SLAs describe an organization that does not exist here. Our three-reviewer process requires a signature and a date per reviewer. Do not import a flag that claims human review nobody performed.',
  },
  {
    id: 'RC-05',
    verdict: 'flag_conflict',
    title: 'Gate Zero hard-codes exactly 45 canonical chapters',
    detail:
      'Gate Zero blocks all audits unless canonical_chapter_count === 45, and the report claims a 45-chapter canonical inventory with a separate non-canonical epilogue count.',
    ours:
      'Independent corroboration of the 45 figure and of the units-versus-numbering split already in reconciliation — this app tracks 44. It does not resolve the conflict: no source here explains the Angel Flight orphan insert or the duplicate chapters. Treat as a second witness to the defect, not as the ruling.',
  },
  {
    id: 'RC-06',
    verdict: 'flag_conflict',
    title: 'Library of Congress adapter is a BIBFRAME lookup',
    detail:
      'The LoC connector points at loc.gov/bibframe with capabilities listed as LCCN lookup, control numbers, and authority records.',
    ours:
      'Confirms the correction already in the benchmark queue: LoC / BIBFRAME is bibliographic metadata retrieval. It looks up catalog records. It does not stress-test, certify, or rank a manuscript — which is exactly what the thesis narrative has been claiming it did.',
  },
  {
    id: 'RC-07',
    verdict: 'rebuild_governed',
    title: 'Six external metadata adapters for a comparative corpus',
    detail:
      'Crossref, Open Library, Google Books, Library of Congress, Semantic Scholar, and TMDB feed an ExternalWork corpus with relevance scoring.',
    ours:
      'The genuinely useful piece. A declared, reproducible corpus is the missing input behind every unverified percentile claim, and these are the right registries to build one from. Rebuild under our own governance with the sampling frame declared up front — and note that relevance scoring is a modeled value, not an observation.',
  },
  {
    id: 'RC-08',
    verdict: 'reject_mechanism',
    title: 'Remediation tasks and "publication-ready" status are seed fiction',
    detail:
      '14 seed tasks across 4 sprints with target Ω scores, priorities, and owners; a status banner declaring all v12 bugs fixed; publication-ready at audit Ω ≥ 8.0.',
    ours:
      'Placeholder tasks with invented targets and owners, plus a self-declared all-clear. None of it is tied to a finding in our ledger. Nothing here may be presented as the manuscript\u2019s remediation plan or its readiness state.',
  },
];

export const RAMOSCANON_RULING = {
  disposition:
    'QL-EXT-002 stays quarantined. Three ideas graduate as design confirmation only — mandatory verbatim evidence, hash-before-score version freezing, and a declared external corpus. Every number, every gate threshold, every task, and every readiness claim stays outside the warehouse.',
  guardrail:
    'The report names no human author. Under the contamination rule it is PENDING_HUMAN_AUTHORSHIP: it may be read and audited, but it cannot be cited as a source, and nothing in it may be re-entered into this app without a human author, a date, and a signature.',
  next_action:
    'Log the Ω symbol collision as a P0 governance blocker before the v13 vocabulary spreads into agent or award-facing materials.',
};