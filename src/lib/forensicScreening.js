export const screeningFindings = [
  ['Critical', 'Canonical dataset drift', 'The live ledger has 46 chapters; the audit names 45 as canonical; the latest operational count is 44. Freeze one manuscript version before any new scoring run.'],
  ['Critical', 'Duplicate-chapter evidence conflict', 'The audit flags Ch. 9/10 as near-duplicates, while the market baseline flags Ch. 17/18. Verify both against the frozen manuscript text before using either finding.'],
  ['High', 'Score and baseline drift', 'The supplied records present different manuscript-wide Ω values (104.94, 107.34, and the live-ledger mean). Treat all comparisons as diagnostic until a single source workbook is selected.'],
  ['High', 'Word-count reconciliation', 'The audit documents 241,117 words versus a 248,812 chapter sum: a +7,695-word (+3.2%) variance requiring a frozen-text recount.'],
  ['High', 'Formula provenance not established', 'The readable audit labels the regression canonical, yet also labels several market coefficients diagnostic or unrecovered. Do not use them as external validation.'],
  ['Medium', 'Institutional claims need primary records', 'Repository, certification, timestamp, and institutional-status statements in the supplied reports need original receipts or catalog records before they are presented as verified.'],
  ['Medium', 'Mixed-source document risk', 'The audit source blends analysis, generated advice, code excerpts, and submission language. Keep narrative claims separate from evidence records in the engineering handoff.'],
  ['Medium', 'Unreadable forensic sources', 'The two supplied forensic PDFs remain unavailable for review, so hidden prompts or tainted formulas cannot be confirmed or ruled out from those files.'],
];

export function duplicateMetricGroups(chapters) {
  const groups = chapters.reduce((result, chapter) => {
    const key = ['cls', 'bis', 'sii', 'mrf', 'word_count'].map((field) => chapter[field] ?? '—').join('|');
    result[key] = [...(result[key] || []), chapter];
    return result;
  }, {});
  return Object.values(groups).filter((group) => group.length > 1);
}