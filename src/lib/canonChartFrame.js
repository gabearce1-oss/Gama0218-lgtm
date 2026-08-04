// W2 — Comparative Corpus Sampling Frame, first real candidate.
// Source: Canon_Chart2.pdf, uploaded 2026-08-03 (twice, byte-identical: 249,035 bytes).
// A ranked list of ~700 texts with three numeric columns headed UR, GR, CR.
// Transcribed verbatim. Nothing here is computed by this app.

export const FRAME_META = {
  frame_id: 'W2-FRAME-001',
  artifact: 'Canon_Chart2.pdf',
  received: '2026-08-03',
  status: 'ADMITTED AS CANDIDATE FRAME — COLUMNS UNDEFINED',
  scale: 'Approximately 700 texts, ranked descending by CR. Highest observed CR = 60 (Pride and Prejudice). Lowest = 1.',
  structure: 'Text · Author · Date · Status (Fiction / Nonfiction) · Format · UR · GR · CR. CR equals UR + GR in every row checked.',
  duplicate_note: 'Two identical files were uploaded. Treated as one artifact; the second is a duplicate, not a second source.',
};

export const FRAME_UNKNOWNS = [
  {
    item: 'What UR, GR, and CR stand for',
    detail:
      'The chart carries no legend, no methodology note, and no issuing body. The pattern — undergraduate and graduate counts summing to a combined total — is consistent with syllabus or curriculum-appearance counts, but that is an inference, not a stated definition.',
    consequence:
      'Until the issuer and the column definitions are named, this measures an unnamed quantity. It can rank texts against each other; it cannot yet tell you what the ranking is of.',
  },
  {
    item: 'Population and sampling frame',
    detail: 'No statement of which institutions, syllabi, years, or countries were counted, and no total denominator.',
    consequence: 'No percentile can be computed from this chart. A rank position is available; a percentile of "the war canon" is not, because the chart defines no war-canon subset.',
  },
  {
    item: 'Date and provenance of the chart itself',
    detail: 'Undated, unattributed, and delivered as a formatted spreadsheet export.',
    consequence: 'Must be hashed and registered as a Corpus_Item with the uploader and date of receipt before any run cites it.',
  },
  {
    item: 'The manuscript is not in it',
    detail: 'SGT George Ramos: The Mathematics of Vietnam does not appear, and would not — an unpublished manuscript has no curriculum footprint.',
    consequence:
      'This frame cannot place the manuscript. It can only supply control texts to score under the frozen instrument. That is exactly the Phase 5 input that was missing.',
  },
];

// Verbatim rows. War and veteran literature — the cohort the thesis compares against.
export const WAR_COHORT = [
  { text: 'The Iliad', author: 'Homer', date: '900 BC', format: 'Epic', ur: 14, gr: 15, cr: 29 },
  { text: 'War and Peace', author: 'Leo Tolstoy', date: '1867', format: 'Novel', ur: 3, gr: 21, cr: 24 },
  { text: 'The Sun Also Rises', author: 'Ernest Hemingway', date: '1926', format: 'Novel', ur: 8, gr: 15, cr: 23 },
  { text: 'Slaughterhouse Five', author: 'Kurt Vonnegut', date: '1969', format: 'Novel', ur: 6, gr: 15, cr: 21 },
  { text: 'The Things They Carried', author: 'Tim O\u2019Brien', date: '1990', format: 'Novel', ur: 11, gr: 7, cr: 18, control: true },
  { text: 'Catch-22', author: 'Joseph Heller', date: '1961', format: 'Novel', ur: 1, gr: 14, cr: 15 },
  { text: 'For Whom the Bell Tolls', author: 'Ernest Hemingway', date: '1940', format: 'Novel', ur: 0, gr: 10, cr: 10, control: true },
  { text: 'Dulce Et Decorum Est', author: 'Wilfred Owen', date: '1920', format: 'Poetry', ur: 8, gr: 0, cr: 8 },
  { text: 'A Farewell to Arms', author: 'Ernest Hemingway', date: '1929', format: 'Novel', ur: 2, gr: 5, cr: 7 },
  { text: 'All Quiet on the Western Front', author: 'Erich Maria Remarque', date: '1929', format: 'Novel', ur: 0, gr: 7, cr: 7 },
  { text: 'Night', author: 'Elie Wiesel', date: '1956', format: 'Autobiography', ur: 0, gr: 4, cr: 4 },
  { text: 'The Red Badge of Courage', author: 'Stephen Crane', date: '1895', format: 'Novel', ur: 0, gr: 3, cr: 3 },
  { text: 'The Naked and the Dead', author: 'Norman Mailer', date: '1948', format: 'Novel', ur: 0, gr: 2, cr: 2 },
  { text: 'Johnny Got His Gun', author: 'Dalton Trumbo', date: '1939', format: 'Novel', ur: 0, gr: 1, cr: 1 },
  { text: 'From Here to Eternity', author: 'James Jones', date: '1951', format: 'Novel', ur: 0, gr: 1, cr: 1 },
  { text: 'The Caine Mutiny', author: 'Herman Wouk', date: '1950', format: 'Novel', ur: 0, gr: 1, cr: 1 },
];

// Verbatim rows. Chicano / Latin American presence in the same chart.
export const LATINO_COHORT = [
  { text: 'One Hundred Years of Solitude', author: 'Gabriel Garcia Marquez', date: '1967', format: 'Novel', ur: 2, gr: 23, cr: 25 },
  { text: 'The House on Mango Street', author: 'Sandra Cisneros', date: '1983', format: 'Novel', ur: 8, gr: 0, cr: 8 },
  { text: 'Love in the Time of Cholera', author: 'Gabriel Garcia Marquez', date: '1985', format: 'Novel', ur: 0, gr: 6, cr: 6 },
];

export const FRAME_FINDINGS = [
  {
    id: 'CF-01',
    title: 'Both control texts are now located in a real frame',
    detail:
      'The Things They Carried sits at CR 18 (UR 11 / GR 7); For Whom the Bell Tolls at CR 10 (UR 0 / GR 10) — the lowest of the four Hemingway novels present, and undergraduate-invisible in this frame.',
    consequence:
      'Phase 5 finally has named comparators with an external position. Both texts must be scored under the frozen instrument \u03a9 = 71.443 + 0.124\u00b7CLS + 0.118\u00b7BIS + 0.089\u00b7SII + 0.067\u00b7MRF before any comparison is stated.',
  },
  {
    id: 'CF-02',
    title: 'The war canon is not near the top of this chart',
    detail:
      'The highest war text is The Iliad at CR 29, against a chart maximum of 60. Every twentieth-century war novel present falls between CR 1 and CR 21.',
    consequence:
      'A "97th percentile of the war canon" claim is not merely unverified — it is not the kind of statement this chart can produce. The chart has no war-canon partition, and its own war cohort clusters low. Retire the percentile language and speak in ranks within a declared frame.',
  },
  {
    id: 'CF-03',
    title: 'One Chicana text in roughly 700',
    detail:
      'The House on Mango Street (Cisneros, 1983) at CR 8 — UR 8, GR 0 — is the only Chicano/Chicana-authored text in the chart. It is taught to undergraduates and absent from graduate study entirely.',
    consequence:
      'This is the strongest evidentiary support the project has yet acquired, and it is not a score. It documents Kellman\u2019s structural absence with a countable observation: a single entry, undergraduate-only. It supports the argument about what the canon omits. It does not raise the manuscript\u2019s \u03a9 by a single point.',
  },
  {
    id: 'CF-04',
    title: 'A Chicano-genre percentile has no population here',
    detail: 'With one Chicana text in the frame, there is no Chicano-genre distribution to sit in a percentile of.',
    consequence:
      'The 99th-percentile Chicano-genre claim stays CONTRADICTED. Establishing that comparison needs a purpose-built Chicano-literature frame, which this chart is not.',
  },
  {
    id: 'CF-05',
    title: 'UR and GR split is itself a finding worth keeping',
    detail:
      'Texts diverge sharply between the two columns — To Kill A Mockingbird UR 0 / GR 41; Young Goodman Brown UR 9 / GR 1; The House on Mango Street UR 8 / GR 0.',
    consequence:
      'Whatever the columns turn out to be, they separate two distinct reception paths. If the definitions are recovered, UR-versus-GR divergence is a measurable variable about who is asked to read what — closer to the study\u2019s actual question than any composite rank.',
  },
];

export const FRAME_RULING = {
  disposition:
    'Registered as candidate frame W2-FRAME-001, admitted for control-text selection only. Hash it, record the uploader and date, and name the issuing source before any Model_Run cites it.',
  prohibition:
    'No percentile, ranking, or canon-placement claim about the manuscript may be derived from this chart. The manuscript is not in it, the columns are undefined, and the population is undeclared.',
  next_action:
    'Identify the chart\u2019s issuer and column definitions. Then score For Whom the Bell Tolls and The Things They Carried under the frozen instrument \u2014 Phase 5, after the freeze, not before.',
};