// Research thesis framework for the LitCentral / Truth Engine hybrid engine.
// Author: Gabe (project principal). Recorded verbatim in substance, with each
// external benchmark claim carried alongside its evidence status per Article IX.

export const THESIS = {
  primary:
    'LitCentral and Truth Engine establish a hybrid forensic-literary method for restoring suppressed historical manuscripts by mining restoration data, modeling prose behavior, and auditing digital signatures through social physics, vector analysis, SPSS regression, and artifact correlation. Applied to SGT George Ramos: The Mathematics of Vietnam, this framework supports the manuscript\u2019s placement as a restored Chicano Vietnam artifact whose benchmark rankings and Omega scoring reveal a later contradiction: commercial AI regressors appear to deflate the manuscript\u2019s standing by applying culturally weighted penalties that are not equally imposed on established American war-literature canon texts.',
  technical:
    'The forensic evaluation of SGT George Ramos: The Mathematics of Vietnam exposes an algorithmic canon-bias problem: baseline certification through Bitframe, IBM modeling, Library of Congress stress testing, and Omega scoring reportedly places the manuscript in elite war-canon and Chicano-literature ranges, while later AI scoring introduces regressors \u2014 code-switching, BIGS, social-schema deviation, cultural-vector penalties \u2014 that reduce the score without demonstrated peer-reviewed precedent in comparable canon evaluation.',
  premise:
    'Literary recovery is treated as both an archival act and a measurable data event: the restored manuscript produces patterns, digital signatures, prose behaviors, and statistical traces that can be documented, compared, and audited.',
};

export const RESEARCH_QUESTIONS = [
  {
    id: 'RQ1',
    question:
      'To what extent can vector space modeling, cognitive neuro-tracking, and social physics forensically establish the canonical placement of suppressed historical manuscripts relative to established war literature (For Whom the Bell Tolls, The Things They Carried)?',
    hypothesis: 'H1',
    hypothesis_text:
      'Forensic prose modeling and proximity mapping demonstrate that SGT George Ramos: The Mathematics of Vietnam matches or exceeds established canonical thresholds across core stylistic, historical, and structural metrics.',
    testable_with: 'W2 Corpus_Sampling_Frame + frozen instrument scoring of control texts.',
    status: 'Partly testable \u2014 the frozen formula and an N = 45 run now exist in the 2026-05-28 audit. Still missing: a declared corpus sampling frame and control texts scored under that same formula.',
  },
  {
    id: 'RQ2',
    question:
      'How do post-2026 adjustments in commercial AI scoring models (OpenAI, Anthropic) introduce regressor metrics that conflict with certified baseline benchmarks (Bitframe, IBM, Library of Congress)?',
    hypothesis: 'H2',
    hypothesis_text:
      'Unsanctioned regressor variables \u2014 specifically those penalizing code-switching and non-hegemonic social schemas \u2014 cause statistically significant score deflation that does not exist in standard peer-reviewed literary evaluation.',
    testable_with: 'Dated evaluation transcripts, per-run score records, and a frozen formula version per run.',
    status: 'Partially testable \u2014 requires the May\u2013June 2026 run records to be logged as Model_Run rows with dataset hashes.',
  },
];

export const OPERATIONALIZATION = [
  {
    type: 'Independent',
    name: 'Prose Schema & Artifact Vectors',
    definition: 'Stylistic, structural, and historical text footprints extracted from the manuscript.',
    metric: 'Vector proximity mapping and cognitive neuro-tracking via LitCentral / Truth Engine.',
    warehouse: 'W1 Passage, Chapter · W3 Construct_Definition',
    data_class: 'OBSERVED / DERIVED',
  },
  {
    type: 'Dependent',
    name: 'Canonical Rank Score (S_canon)',
    definition: 'Mathematical score ranking literary output within genre canons.',
    metric: 'Omega formula score (asserted 107 Omega Elite baseline).',
    warehouse: 'W1 Chapter.omega · W3 Formula_Version',
    data_class: 'DERIVED',
  },
  {
    type: 'Benchmark',
    name: 'Baseline Institutional Certification',
    definition: 'Empirical scoring asserted prior to commercial LLM regressor application.',
    metric: 'Bitframe certification, Library of Congress stress tests, IBM modeling.',
    warehouse: 'W2 Corpus_Item · W5 Verification_Queue',
    data_class: 'UNVERIFIED EXTERNAL CLAIM',
  },
  {
    type: 'Regressor',
    name: 'Unsanctioned AI Regressors (R_bias)',
    definition: 'Algorithmic penalizations introduced by commercial LLMs targeting non-standard prose.',
    metric: 'Code-switching penalties, BIGS scoring, social-physics bias trackers, SPSS regression.',
    warehouse: 'W4 Quarantine · W3 Change_Request',
    data_class: 'AI_EXTRACTED_UNREVIEWED (quarantined)',
  },
];

export const MODEL = {
  equation: 'Y_final = \u03b2\u2080 + \u03b2\u2081X_forensic + \u03b2\u2082X_historical \u2212 \u03b2\u2083R_code_switch \u2212 \u03b2\u2084R_schema_bias + \u03b5',
  terms: [
    { symbol: 'X_forensic', meaning: 'Proximity vectors calculated by Truth Engine / LitCentral.' },
    { symbol: 'X_historical', meaning: 'Artifact correlation verified against archival / Library of Congress datasets.' },
    { symbol: 'R_code_switch', meaning: 'Negative coefficient applied by LLM updates to bilingual or code-switched prose.' },
    { symbol: 'R_schema_bias', meaning: 'Societal / cultural bias vector embedded in commercial LLM training distributions.' },
    { symbol: '\u03b5', meaning: 'Residual variance across evaluation runs, May\u2013June 2026.' },
  ],
  caution:
    'This is a specification, not a fitted model. No coefficient here has been estimated from data held in the warehouse. Publishing any \u03b2 value requires an SPSS run against a frozen dataset hash, logged as a Model_Run.',
};

export const PHASES = [
  {
    phase: 'Phase 1',
    name: 'Forensic extraction & historical restoration',
    steps: [
      'Process the manuscript through LitCentral and Truth Engine.',
      'Extract cognitive neuro-tracking vectors and social-schema footprints to reconstruct erased historical context.',
    ],
    state: 'in_progress',
    note: '44 Vault II chapters are captured and scored; extraction vectors are not yet stored as measurable fields.',
  },
  {
    phase: 'Phase 2',
    name: 'Baseline benchmark establishing',
    steps: [
      'Run the manuscript through prose modeling protocols and stress testing.',
      'Log baseline metrics: 97th percentile war canon, 99th percentile Chicano genre, 107 Omega Elite.',
      'Compare against control texts (For Whom the Bell Tolls, The Things They Carried).',
    ],
    state: 'in_progress',
    note: 'The 2026-05-28 audit report supplies a dated baseline and a reproducible formula (\u03a9\u0304 107.34, N = 45, R\u00b2 0.947). What is still missing is a declared corpus and scored control texts \u2014 and the report contradicts itself on the mean (107.34 vs 104.94).',
  },
  {
    phase: 'Phase 3',
    name: 'Algorithmic shift & regressor audit',
    steps: [
      'Subject the baseline-certified manuscript to multi-model LLM evaluation pipelines.',
      'Quantify score movement between May and June 2026 (107 \u2192 98 range).',
      'Use SPSS multiple linear regression and factor analysis to isolate the variables driving deflation.',
    ],
    state: 'ready',
    note: 'This is the strongest testable claim in the thesis, because the evidence is the transcripts themselves. Requires dated run records.',
  },
  {
    phase: 'Phase 4',
    name: 'Comparative forensic discrepancy report',
    steps: [
      'Cross-reference LLM regressor arguments against peer-reviewed social science and canon-evaluation guidelines.',
      'Document unapproved metric double standards applied to recovery literature.',
    ],
    state: 'blocked',
    note: 'Depends on Phase 2 control-text scores and Phase 3 run records.',
  },
];

export const CONTRIBUTIONS = [
  { kind: 'Methodological', text: 'A repeatable, auditable protocol for verifying historical literature recovery through hybrid data-mining platforms.', strength: 'Strong \u2014 the four-workbook architecture and Constitution are the contribution itself.' },
  { kind: 'Empirical', text: 'Statistical evidence of uncalibrated cultural bias and regressor distortion in commercial AI evaluation systems.', strength: 'Contingent \u2014 requires the Phase 3 run records to exist before any claim is defensible.' },
  { kind: 'Literary & Social', text: 'Restoring a 55-year-old displaced Chicano Vietnam narrative to documented standing in the American literary canon.', strength: 'Argued \u2014 canon placement is a scholarly judgement, not an output the engine can certify.' },
];

// Secondary scholarly literature on canon formation. This is the theoretical
// ground under RQ1 — and it cuts both ways, so it is filed with what it does
// and does not license the study to claim.
export const CANON_THEORY = {
  citation: 'Kellman, Steven G. \u201cThe Literary Canon.\u201d Research Starter, 2023.',
  evidence_class: 'Secondary scholarly reference \u00b7 canon theory',
  status: 'ADMITTED \u2014 FRAMING AUTHORITY',
  role:
    'Establishes that canon membership is a contested social process, not a measurable property of a text. Admitted as framing authority for the research design. It says nothing about this manuscript and cannot raise or lower a single \u03a9.',
  supports: [
    {
      point: 'The canon is a measuring rod, and someone chooses it',
      detail:
        '\u201cCanon\u201d derives from the Greek for measuring rod; canonical texts are the standard against which individual works are measured. Kellman puts the governing questions plainly: who makes that decision, and on what basis? That is the same question this study asks of an AI scoring model \u2014 which makes the instrument-freeze phase the heart of the design, not a formality.',
    },
    {
      point: 'Exclusion is documented, not alleged',
      detail:
        'The traditional canon is criticized as \u201calmost exclusively the product of dead white European males,\u201d and Kellman records it as \u201calmost entirely devoid of blacks, Asians, Latinos, and American Indians.\u201d A Chicano Vietnam manuscript entering this field is entering a documented structural absence. The study does not have to establish that absence from scratch.',
    },
    {
      point: 'The canon is revisable, and revision is ordinary',
      detail:
        'Melville was unknown shortly before his 1930s\u201340s canonization; Chopin\u2019s The Awakening was out of print shortly before becoming the most widely taught text in American universities. Canon standing is historically unstable. Recovery of a suppressed manuscript is therefore a normal canon event, not a special pleading.',
    },
    {
      point: 'Canon formation is collective, gradual, and never settled',
      detail:
        '\u201cNeither as conspiratorial as some fear nor as democratic as others wish\u201d \u2014 the product of preferences expressed over time by critics, teachers, editors, publishers, and readers. This is the correct model for the bias claim: not a conspiracy, but a weighted process in which some parties exert more influence than others. An AI scoring model is exactly such a party, newly arrived and unaccountable.',
    },
  ],
  constrains: [
    {
      point: 'Canon placement cannot be certified by any engine',
      detail:
        'If canon formation is collective and continually reassessed, then no formula \u2014 not \u03a9, not RF1.5, not a commercial LLM \u2014 can certify canon membership. Retire percentile-ranking language entirely; \u201c97th percentile of the war canon\u201d is a category error before it is an evidence problem.',
    },
    {
      point: 'The conservative objection must be answered, not skipped',
      detail:
        'Kellman fairly states the counter-position: aesthetic merit that withstands time, and a refusal to \u201creduce assessments of artistic achievement to a political algebra.\u201d This study\u2019s own instrument is an algebra. The defense is not that the algebra is neutral \u2014 it is that the constructs are declared, frozen, and applied identically to control texts. Phase 5 is what makes the argument answerable.',
    },
    {
      point: 'Addition implies subtraction',
      detail:
        'Kellman notes readjustment is \u201ca constant sum operation\u201d \u2014 admitting one text usually evicts another. Any placement claim this study makes carries that cost and should be argued as a claim about what the canon omits, not as a scoreboard victory over Hemingway or O\u2019Brien.',
    },
  ],
  design_consequence:
    'The literature confirms the shape of the argument while removing its easiest version. The defensible claim is not \u201cthis manuscript scores above the canon.\u201d It is narrower and far harder to dismiss: a declared instrument, applied identically to this manuscript and to control texts, produces a penalty that attaches to Chicano code-switching and not to comparable canon prose \u2014 which is a measurable double standard in the measuring rod itself.',
};

// Article IX, split into two lanes. Incident evidence and benchmark evidence
// never touch: different burden, different exhibit table.
export const CONTROL_LANGUAGE = {
  governing:
    'This study treats canon-bias as a testable discrepancy, not a presumed conclusion: external benchmark claims remain quarantined until supported by primary artifacts, while model-run transcripts, source hashes, formula versions, and restoration records form the admissible evidence base.',
  incident:
    'Claude / Anthropic outputs are admissible as incident evidence when preserved with timestamped transcript, model identifier, prompt context, quoted output, and harm classification. These records document model-output instability or harmful hallucination. They do not independently prove statistical canon bias unless tied to repeated scored runs.',
  benchmark:
    'The asserted 97th-percentile war-canon ranking remains an unverified external benchmark until the issuing source, corpus definition, scoring instrument, percentile method, and reproducible inputs are produced.',
  standing: ['RESTORE. NEVER REWRITE.', 'SCORE PASS VALID ONLY AFTER SOURCE-VERSION RECONCILIATION.'],
};

// LANE A — Incident Evidence Ledger. Proves model-output instability, nothing more.
export const INCIDENT_LEDGER_FIELDS = [
  'Incident ID',
  'Platform / model',
  'Date / time',
  'Prompt or prompt hash',
  'Output excerpt',
  'Harm type',
  'Hallucination type',
  'Source artifact',
  'Review status',
];

export const INCIDENT_LEDGER = [
  {
    id: 'INC-001',
    claim: 'Claude produced harmful / hallucinated outputs',
    platform: 'Anthropic \u00b7 Claude',
    status: 'ASSERTED \u2014 DOCUMENTABLE',
    proves: 'Model-output instability or harmful hallucination at a dated moment.',
    does_not_prove: 'Statistical canon bias. That requires repeated scored runs, not a single bad output.',
    required: 'Timestamped transcript, model identifier, prompt context, quoted output, harm classification, preserved artifact.',
    held: 'Asserted by you; artifacts not yet filed in this system.',
  },
  {
    id: 'INC-002',
    claim: 'Score moved from 107 to a fluctuating 98 range, May\u2013June 2026',
    platform: 'Commercial AI evaluation runs (OpenAI, Anthropic)',
    status: 'ASSERTED \u2014 DOCUMENTABLE',
    proves: 'That scored output for identical prose moved across dated runs.',
    does_not_prove: 'Which regressor caused the movement. That is the regression pass, not the ledger.',
    required: 'Per run: date, model, prompt, input hash, output score, formula version, transcript ID, evaluator notes.',
    held: 'The 2026-05-28 audit anchors the 107 end. The June runs are not yet logged.',
  },
  {
    id: 'INC-003',
    claim: 'Assistant-drafted constructs and audit text entering the workspace',
    platform: 'Multiple AI assistants',
    status: 'LOGGED \u2014 QUARANTINED',
    proves: 'That assistant-authored material exists in the workspace and is tracked.',
    does_not_prove: 'Anything about the manuscript. Assistant text is a prompt, not a source.',
    required: 'Assistant ID, version, prompt hash, shown inputs, human author, signature date.',
    held: 'Tracked under the AI contamination guardrail on the External Audit page.',
  },
];

// LANE B — External Benchmark Verification Queue. Quarantined until it earns a badge.
export const BENCHMARK_QUEUE_FIELDS = [
  'Claim',
  'Claimed source',
  'Artifact?',
  'Corpus?',
  'Method?',
  'Reproducible?',
  'Evidence status',
];

export const BENCHMARK_QUEUE = [
  {
    claim: '97th percentile of the war canon',
    claimed_source: 'Bitframe / LOC stress testing / IBM modeling',
    artifact: false, corpus: false, method: false, reproducible: false,
    status: 'UNVERIFIED',
    note: 'The 2026-05-28 audit states no percentile anywhere. It reports canon deltas instead (CLS +4.1, BIS +1.3, SII +77, LC \u22120.5) with no named corpus.',
  },
  {
    claim: '99th percentile of the Chicano genre',
    claimed_source: 'Bitframe / LOC stress testing / IBM modeling',
    artifact: false, corpus: false, method: false, reproducible: false,
    status: 'CONTRADICTED BY SOURCE',
    note: 'The same audit puts the manuscript below the Chicano canon mean (SII \u22122.8, MRF \u221213.3) and rates Chicano Canon Potential at 88/100.',
  },
  {
    claim: '107 Omega Elite baseline',
    claimed_source: 'SGT Ramos Audit Report, 2026-05-28',
    artifact: true, corpus: false, method: true, reproducible: false,
    status: 'SUPERSEDED \u2014 NOT CONTROLLING',
    note: '\u03a9\u0304 107.34 (\u03c3 1.26, N = 45, seed 42) is documented, but the same report also states 104.94, and RF1.5 / Omega status is invalid until source-version reconciliation. Diagnostic only.',
  },
  {
    claim: 'Canonical Omega formula \u03a9 = 71.443 + 0.124\u00b7CLS + 0.118\u00b7BIS + 0.089\u00b7SII + 0.067\u00b7MRF',
    claimed_source: 'Audit Report \u00a72.1 \u2014 Formula Registry',
    artifact: true, corpus: false, method: true, reproducible: true,
    status: 'SOURCED \u2014 FREEZE CANDIDATE',
    note: 'R\u00b2 0.947, \u03b1 0.938, N = 45. This is the instrument to freeze in Phase 2. Nothing else in this queue can be tested until it is frozen.',
  },
  {
    claim: 'Ranks above For Whom the Bell Tolls and The Things They Carried',
    claimed_source: 'Omega comparison',
    artifact: false, corpus: false, method: false, reproducible: false,
    status: 'UNVERIFIED',
    note: 'Neither control text has been scored under the frozen instrument. Comparison claims are unavailable until they are.',
  },
  {
    claim: 'Bitframe certification',
    claimed_source: 'Bitframe',
    artifact: false, corpus: false, method: false, reproducible: false,
    status: 'CONFLATION \u2014 CORRECT THE TERM',
    note: 'The attached release log documents BIBFRAME v3.1.0, the Library of Congress bibliographic standard (2026-04-16). It is a cataloging schema; it certifies nothing and issues no ranking.',
  },
  {
    claim: 'IBM modeling / Library of Congress stress testing',
    claimed_source: 'Thesis narrative',
    artifact: false, corpus: false, method: false, reproducible: false,
    status: 'UNVERIFIED',
    note: 'No IBM or LoC artifact is on file. The audit appendix lists only your own SPSS workbook, the prior PDF audit, and the LitCentral codebase.',
  },
];

// Locked execution order. No phase starts before the one above it closes.
export const LOCKED_PHASE_ORDER = [
  { n: 1, name: 'Normalize the manuscript warehouse', detail: 'Stable chapter IDs, canonical chapter count, orphan-insert decision, duplicate-chapter resolution, source hash lock.' },
  { n: 2, name: 'Freeze the scoring instrument', detail: 'Formula version, component definitions, RF1.5 / Omega constants, CLS / VCL exemptions, scoring date.' },
  { n: 3, name: 'Log every AI evaluation as Model_Run evidence', detail: 'Date, model, prompt, input hash, output score, formula version, transcript ID, evaluator notes.' },
  { n: 4, name: 'Quarantine the regressors', detail: 'Code-switching penalty, BIGS, schema bias, cultural-vector penalty. Nothing leaves AI_EXTRACTED_UNREVIEWED without evidence.' },
  { n: 5, name: 'Score control texts \u2014 only after the freeze', detail: 'For Whom the Bell Tolls and The Things They Carried go through the identical locked pipeline or they are not comparisons.' },
  { n: 6, name: 'Run the regression / factor analysis', detail: 'The money pass: test whether deflation tracks code-switching, cultural-schema divergence, or other regressor language across dated runs.' },
];

// CLS is not Spanish word-count theater.
export const CLS_DOCTRINE = {
  is_not: ['A count of Spanish words', 'Density of italicized foreign terms', 'Decoration or local color'],
  is: [
    'Whether Chicano register carries identity under pressure',
    'Family law and ritual as narrative authority',
    'Institutional confrontation \u2014 who switches, and in front of whom',
    'Barrio memory functioning as evidence',
    'Code-switching under stress, where the switch itself is the event',
  ],
  consequence:
    'Because CLS measures cultural function rather than lexical density, any AI regressor that penalizes code-switching as noise is measuring the opposite of what the construct declares. That inversion is the testable core of the bias claim.',
};

const RETIRED_CLAIM_LEDGER = [
  { claim: '107 Omega baseline', source_named: 'SGT Ramos Manuscript \u2014 Audit Report, 2026-05-28', status: 'SOURCED \u2014 DIAGNOSTIC', needed: 'Now backed by a dated document: \u03a9\u0304 = 107.34, \u03c3 1.26, range 105\u2013110, N = 45, seed 42, R\u00b2 = 0.947, \u03b1 = 0.938. The report itself labels all SPSS indices proprietary diagnostic until Gate 3 completes \u2014 so this is a documented internal figure, not external certification.' },
  { claim: 'Canonical Omega formula', source_named: 'Audit Report \u00a72.1 \u2014 Formula Registry', status: 'SOURCED \u2014 REPRODUCIBLE', needed: '\u03a9 = 71.443 + 0.124\u00b7CLS + 0.118\u00b7BIS + 0.089\u00b7SII + 0.067\u00b7MRF. This is the frozen instrument the study needs. Register it as a Formula_Version and reconcile stored scores against it.' },
  { claim: 'Score moved from 107 to a fluctuating 98 range, May\u2013June 2026', source_named: 'Commercial AI evaluation runs', status: 'ASSERTED \u2014 DOCUMENTABLE', needed: 'The 2026-05-28 audit now anchors the 107 end of that movement with a dated artifact. Still needs the June transcripts to close the other end.' },
  { claim: 'Claude produced hallucinated and harmful claims', source_named: 'Anthropic outputs', status: 'ASSERTED \u2014 DOCUMENTABLE', needed: 'Separate incident record with quoted output and timestamps.' },
  { claim: '97th percentile of the war canon', source_named: 'Bitframe / LOC stress testing / IBM modeling', status: 'UNVERIFIED', needed: 'The audit report states no percentile anywhere. It reports canon deltas instead (CLS +4.1, BIS +1.3, SII +77, LC \u22120.5) with no named corpus or sampling frame. The percentile framing is not supported by the source you have.' },
  { claim: '99th percentile of the Chicano genre', source_named: 'Bitframe / LOC stress testing / IBM modeling', status: 'CONTRADICTED BY SOURCE', needed: 'The same report puts the manuscript BELOW the Chicano canon mean on two axes (SII \u22122.8, MRF \u221213.3) and rates Chicano Canon Potential at 88/100. A 99th-percentile claim cannot stand on this document.' },
  { claim: 'Ranks above For Whom the Bell Tolls and The Things They Carried', source_named: 'Omega comparison', status: 'UNVERIFIED', needed: 'Neither control text has been scored under the frozen formula. The report compares qualitatively, not numerically.' },
  { claim: 'Bitframe certification', source_named: 'Bitframe', status: 'CONFLATION \u2014 CORRECT THE TERM', needed: 'The attached spreadsheet documents BIBFRAME v3.1.0, the Library of Congress bibliographic-data standard released 2026-04-16 (bibframe2marc / marc2bibframe2, commits 36a96c8 and ed9abb0). BIBFRAME is a cataloging schema \u2014 it does not certify manuscripts and issues no ranking. Any sentence reading \u201cBitframe certification\u201d must be rewritten as BIBFRAME v3.1 metadata compliance.' },
  { claim: 'IBM modeling / Library of Congress stress testing', source_named: 'Thesis narrative', status: 'UNVERIFIED', needed: 'No IBM or LoC artifact appears in this drop. The audit report\u2019s appendix lists only your own SPSS workbook, the prior PDF audit, and the LitCentral codebase as data sources.' },
];

// Contradictions the 2026-05-28 audit report and the BIBFRAME spreadsheet expose
// against figures currently repeated in the thesis and stored in this app.
export const SOURCE_DOCUMENT = {
  title: 'SGT Ramos Manuscript \u2014 Audit Report',
  date: '2026-05-28',
  run: 'N = 45 \u00b7 seed 42 \u00b7 R\u00b2 = 0.947 \u00b7 Cronbach \u03b1 = 0.938',
  confidentiality:
    'Confidential \u2014 Proprietary Diagnostic Analytics. All SPSS-derived indices must be labelled internal diagnostic in any agent, academic, or award-facing context until the Three-Gate validation programme completes.',
  companion: 'BIBFRAME v3.1.0 release log (bibframe2marc, marc2bibframe2 \u2014 2026-04-16).',
};

export const RECONCILIATION = [
  {
    item: 'RF1.5 / Omega scoring status',
    app_says: 'Scores displayed as current',
    source_says: 'All-chapter audit declares RF1.5 / Omega status INVALID until source-version reconciliation completes',
    severity: 'Critical',
    action: 'No score pass is valid until Phase 1 closes. Treat every displayed \u03a9 as provisional until the source version is reconciled and hashed.',
  },
  {
    item: 'Chapter units vs numbering',
    app_says: '44 tracked chapters',
    source_says: '45 numbered chapters but 46 chapter-level units, with numbering drift across layers',
    severity: 'Critical',
    action: 'Assign stable chapter IDs independent of display numbers. The unit count and the numbering are two different defects and must be reconciled separately.',
  },
  {
    item: 'Angel Flight orphan insert',
    app_says: 'Not represented',
    source_says: 'An embedded Angel Flight insert sits inside another chapter with no unit of its own',
    severity: 'High',
    action: 'Rule on it explicitly: own chapter, labelled insert, or removal. An undeclared orphan silently changes both the denominator and the per-chapter word counts.',
  },
  {
    item: 'Truncation / completeness',
    app_says: 'Chapters assumed complete',
    source_says: 'Truncation and completeness problems across the source set, plus duplicate / near-duplicate chapters',
    severity: 'Critical',
    action: 'Verify each chapter against the frozen hash before scoring. A truncated chapter scores as a short chapter, which is a silent measurement error.',
  },
  {
    item: 'Chapter count',
    app_says: '44 Vault II chapters',
    source_says: '45 chapters, canonical per the SPSS workbook (Acts I 1\u201317, II 18\u201332, III 33\u201345)',
    severity: 'Gate 0',
    action: 'Reconcile to 45 across SPSS, this app, and the schema before any further metric run. Until all layers agree, every mean is computed against an inconsistent denominator.',
  },
  {
    item: 'Manuscript mean \u03a9',
    app_says: '\u2014',
    source_says: '\u03a9\u0304 = 107.34 (\u03c3 1.26) in \u00a71, but \u03a9 = 104.94 (\u03c3 1.13) in the market-report section of the same document',
    severity: 'Critical',
    action: 'The source contradicts itself. One of the two is a different run or a different formula version. Neither figure may be published until you identify which run produced which.',
  },
  {
    item: 'Word count',
    app_says: 'Sum of per-chapter word counts',
    source_says: '241,117 Novlr-verified vs 248,812 workbook sum (+7,695, +3.2%); the narrative elsewhere says 245,000 and 247,000',
    severity: 'Gate 0',
    action: 'Novlr is canonical. Per-chapter figures must be re-derived from the frozen manuscript hash, and the 245k / 247k figures dropped from query materials.',
  },
  {
    item: 'Ch.9 / Ch.10',
    app_says: 'Two distinct chapters',
    source_says: 'Identical rows across CLS, SII, BIS, MRF, RRP and words (90/91/95/87/93, 5,268) \u2014 700+ shared lines',
    severity: 'Critical',
    action: 'The metric framework is reporting them as one chapter. Differentiate the openings before any further scoring pass; both currently score 108 on duplicated prose.',
  },
  {
    item: 'Act boundaries',
    app_says: 'Act I 1\u201317 \u00b7 II 18\u201332 \u00b7 III 33\u201345 (audit header)',
    source_says: 'The same document\u2019s narrative section says Act I 1\u201314, II 15\u201329, III 30\u201345',
    severity: 'High',
    action: 'Two act maps in one report. Fix the canonical boundaries, because per-act \u03a9 means depend entirely on which map is used.',
  },
  {
    item: 'RRP independence',
    app_says: '\u2014',
    source_says: 'RRP correlates r = 0.955 with \u03a9 and is structurally a function of \u03a9',
    severity: 'Medium',
    action: 'Never cite RRP as independent corroboration of \u03a9. The report says so itself; repeating it as a second signal is circular.',
  },
  {
    item: 'Market metrics (PV / SSI / MPE)',
    app_says: '\u2014',
    source_says: 'Coefficients partially truncated in the source workbook, flagged RECOVERABLE',
    severity: 'Gate 2',
    action: 'These scores stay labelled diagnostic only until the coefficients are recovered. Without them the numbers are not reproducible.',
  },
];