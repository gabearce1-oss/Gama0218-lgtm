// ProseEngine capability audit — QUARANTINED external source (QL-EXT-001).
// Observations from the public marketing site only, fetched 2026-08-02. Nothing here is
// verified, adopted, or permitted to influence a canonical score. This file records what
// the product appears to do, what LitCentral already has, and where a vetted version of
// each capability would live under the four-workbook model.

export const AUDIT_META = {
  source: 'https://proseengine.app/',
  reviewed_at: '2026-08-02',
  quarantine_id: 'QL-EXT-001',
  status: 'QUARANTINE — external reference only, not integrated',
  evidence_basis: 'Public marketing copy and screenshots. No product trial, no API, no documentation reviewed.',
};

// verdict: 'adopt_shape' = the idea is sound, our own measured version belongs in a workbook
//          'rebuild_governed' = useful only if rebuilt under codebook discipline
//          'reject_mechanism' = the mechanism itself violates an Article
//          'operational' = convenience/tooling, no measurement authority, low risk
export const CAPABILITIES = [
  {
    id: 'PE-01',
    capability: '14-dimension scene scoring (0–100)',
    observed: 'Hook power, visceral show, micro-tension, pull ending, inference space, character depth, prose craft, emotional impact, tension, pacing, dialogue, mystery, world building, thematic richness.',
    pain: 'I have no idea where to start revising.',
    ours: 'Ω with CLS / BIS / SII / MRF plus deep metrics (moral weight, body memory, grief index, agency under fire, cultural reflex).',
    gap: 'Their dimension inventory is broader on craft mechanics — inference space, micro-tension, and pull ending have no LitCentral equivalent.',
    home: 'W3 · Construct_Definition',
    verdict: 'rebuild_governed',
    note: 'Import as UNVALIDATED candidate constructs needing operational definitions. Never import their numbers.',
  },
  {
    id: 'PE-02',
    capability: 'One-click whole-manuscript improvement with auto-retry',
    observed: 'AI finds every weak spot, rewrites, and retries scenes until they pass its own quality bar. Demo shows +27 points across three drafts.',
    pain: 'Every time I rewrite a chapter, I break something else.',
    ours: 'RestorationDraft cooking with human-gated publish, plus BetaManuscript passage vetting.',
    gap: 'None worth closing. Ours is deliberately slower because a human approves each passage.',
    home: 'Not admissible',
    verdict: 'reject_mechanism',
    note: 'A model optimizing against its own scores is the exact circularity that quarantined OMEGA_LEGACY_v1.1. Article III and Article VII.',
  },
  {
    id: 'PE-03',
    capability: 'Story codex — characters, places, items, factions',
    observed: 'A living wiki that grows with the story; every entry tracks each scene it appears in.',
    pain: 'I can\u2019t keep track of my own world anymore.',
    ours: 'VoiceProfiles and CharacterImpactMatrix cover voice and impact, not a structured world entity.',
    gap: 'Real gap. No place/faction/item entity exists, and no scene-level appearance index.',
    home: 'W1 · Character_Event, Scene',
    verdict: 'adopt_shape',
    note: 'Strongest candidate for our own build. Observed data, no scoring involved.',
  },
  {
    id: 'PE-04',
    capability: 'Canon contradiction enforcement',
    observed: 'Records each character\u2019s established details and flags scenes that contradict them, across a multi-book series.',
    pain: 'Continuity slips readers notice and reviewers punish.',
    ours: 'EvidenceClaim with claim categories including character_canon and timeline; Blocker gate canon_conflict.',
    gap: 'Ours is claim-by-claim and manual. Theirs is continuous and automatic across the whole corpus.',
    home: 'W1 · Historical_Claim_Link → W2 · Contradictory_Evidence',
    verdict: 'adopt_shape',
    note: 'Automate the detection, keep the disposition human. A flag is an observation, not a verdict.',
  },
  {
    id: 'PE-05',
    capability: 'Codex auto-draft from an existing manuscript',
    observed: 'Reads existing prose and drafts characters, places, and factions for the author to review.',
    pain: 'Cataloguing a finished draft by hand is weeks of work.',
    ours: 'scanDriveForProse extracts passages, but drafts no structured world records.',
    gap: 'Extraction to structured entities is missing.',
    home: 'W1 · Character_Event with data_class AI_EXTRACTED_UNREVIEWED',
    verdict: 'rebuild_governed',
    note: 'Permissible only with the unreviewed data class and a named reviewer before anything publishes.',
  },
  {
    id: 'PE-06',
    capability: 'Semantic scene search',
    observed: '"Show me every scene where Elena appears in Athens" — query by character, location, emotion, or detail.',
    pain: 'Finding the one scene you half-remember.',
    ours: 'Chapter listing and filters only. No scene-level or entity-level query.',
    gap: 'Real gap, and it depends on PE-03 existing first.',
    home: 'W1 · Scene, Passage',
    verdict: 'adopt_shape',
    note: 'Retrieval, not measurement. Low governance risk, high daily utility.',
  },
  {
    id: 'PE-07',
    capability: 'Named drafts, word-by-word diff, rollback',
    observed: 'Save named versions, compare them, roll back when a rewrite was worse.',
    pain: 'Never lose a good version.',
    ours: 'RestorationDraft holds original vs cooked scores but not full prose versioning or diffing.',
    gap: 'No prose-level diff or rollback.',
    home: 'W1 · Revision_Log',
    verdict: 'adopt_shape',
    note: 'Revision_Log already specifies text_hash_before / text_hash_after — the schema anticipated this.',
  },
  {
    id: 'PE-08',
    capability: 'Analytics dashboard — radar, bar, line, heatmap',
    observed: 'Visual charts of where tension peaks, where pacing drags, where readers may stop.',
    pain: 'See the story\u2019s shape.',
    ours: 'OmegaRFTrendChart, LeaderboardChart, SensoryHeatmap, VoiceRadarChart, CharacterImpactMatrix.',
    gap: 'Closest match in the whole audit. Ours is comparable and better governed.',
    home: 'Cognos reporting layer',
    verdict: 'operational',
    note: 'No change warranted. Confirms our visual direction rather than challenging it.',
  },
  {
    id: 'PE-09',
    capability: 'Draft-over-draft score progression',
    observed: 'Compare draft 1 to draft 3 and watch scores climb as proof the work is paying off.',
    pain: 'Am I actually improving?',
    ours: 'omega vs omega_audit, and OmegaComparisonTable.',
    gap: 'Ours lacks a clean per-draft series because drafts are not first-class.',
    home: 'W4 · Drift_Monitor',
    verdict: 'rebuild_governed',
    note: 'A rising score is only evidence if the instrument was frozen between drafts. Theirs is not.',
  },
  {
    id: 'PE-10',
    capability: 'Multi-voice audiobook with speaker attribution',
    observed: 'AI detects who speaks each line, matches voices to character files, exports per-chapter MP3s. Bring your own OpenAI / ElevenLabs / Google TTS key with cost estimate.',
    pain: 'Audiobook production cost.',
    ours: 'None.',
    gap: 'Entirely absent. Also genuinely relevant to a code-switched, multilingual manuscript.',
    home: 'Out of measurement scope · production tooling',
    verdict: 'operational',
    note: 'Dialogue attribution alone would feed CodeSwitch speaker tagging — that part is measurement-adjacent and would need review.',
  },
  {
    id: 'PE-11',
    capability: 'Export to DOCX, EPUB, PDF',
    observed: 'Polished manuscript export in every major format.',
    pain: 'Work trapped in a tool.',
    ours: 'chapterExport plus workbook XML templates; no manuscript-format export.',
    gap: 'No DOCX/EPUB/PDF path.',
    home: 'Out of measurement scope · production tooling',
    verdict: 'operational',
    note: 'Pure convenience. No governance exposure.',
  },
  {
    id: 'PE-12',
    capability: 'Three-provider cloud sync and auto-backup',
    observed: 'Syncs to multiple cloud providers with automatic backup so work is never lost.',
    pain: 'A dead laptop, a corrupted file.',
    ours: 'Google Drive and Dropbox connectors, Sheets sync, exportBetaToDrive daily backup.',
    gap: 'Already at parity. Our OneDrive path remains unsupported.',
    home: 'W4 · Release_Manifest, Access_Log',
    verdict: 'operational',
    note: 'Nothing to adopt.',
  },
  {
    id: 'PE-13',
    capability: 'Bring-your-own-model execution',
    observed: 'Use your own model, a free one, or theirs — no key required on the free tier.',
    pain: 'Vendor lock-in and per-token cost.',
    ours: 'Platform-run integrations only, currently blocked by workspace credit exhaustion.',
    gap: 'No model choice, and no cost visibility per run.',
    home: 'W3 · Model_Run',
    verdict: 'rebuild_governed',
    note: 'Model identity and version are already required codebook fields. Swappable models make model_id mandatory, not optional.',
  },
  {
    id: 'PE-14',
    capability: 'Writing habit tracking — goals, streaks, pace projection',
    observed: 'Daily goals, streaks, and words-per-day needed to hit a deadline.',
    pain: 'Deadline drift.',
    ours: 'SprintCalendar and RolloutTimeline are schedule-oriented, not word-pace oriented.',
    gap: 'Minor gap. Not measurement.',
    home: 'Out of measurement scope · author tooling',
    verdict: 'operational',
    note: 'Optional. Lowest priority in the audit.',
  },
];

export const RED_FLAGS = [
  {
    id: 'RF-01',
    flag: 'Score-chasing rewrite loop',
    evidence: '"Auto-retries weak scenes until they pass the quality bar." "If it\u2019s not good enough, the AI rewrites it until it is."',
    article: 'Article III · Article VII',
    risk: 'Critical',
    consequence: 'The reported gain measures the optimizer, not the prose. Any adopted coefficient would inherit the circularity we already quarantined.',
    control: 'Never import their scores or deltas. If we replicate the shape, the instrument must be frozen before the rewrite and the rewrite must be human-approved.',
  },
  {
    id: 'RF-02',
    flag: 'No published codebook or operational definitions',
    evidence: '14 named dimensions with 0–100 outputs; no definitions, scale anchors, or scoring rules published.',
    article: 'Article II · Article IV',
    risk: 'High',
    consequence: 'The numbers name no authority. Two scenes scoring 60 cannot be shown to mean the same thing.',
    control: 'Treat every dimension as a candidate construct requiring our own operational definition before use.',
  },
  {
    id: 'RF-03',
    flag: 'No rater reliability or corpus justification',
    evidence: 'No inter-rater agreement, validation study, or stated reference corpus behind "what counts as strong."',
    article: 'Article II · SPSS Gates 2–3',
    risk: 'High',
    consequence: 'Construct validity is unestablished, so cross-work comparison is unsupported.',
    control: 'Any adopted dimension passes our own reliability and construct-validity gates first.',
  },
  {
    id: 'RF-04',
    flag: 'Unverified reach and audience claims',
    evidence: 'Marketing-level claims of broad reach and reader/beta-reader benefit. Observed: a 4-subscriber promotional channel.',
    article: 'Article IX',
    risk: 'Medium',
    consequence: 'Citing their traction as evidence of validity would repeat the withdrawn baseline-card error.',
    control: 'Any reach, usage, or beta-reader figure requires a primary source before it is recorded as fact.',
  },
  {
    id: 'RF-05',
    flag: 'Single composite /100 headline score',
    evidence: '"0/100 Overall" above the 14 sub-dimensions.',
    article: 'Five-profile release rule',
    risk: 'Medium',
    consequence: 'One figure hides which authority supports which claim — the same reason solitary Ω was retired.',
    control: 'If replicated, report as separate validated profiles, never as one number.',
  },
  {
    id: 'RF-06',
    flag: 'Model-drafted world records presented as canon',
    evidence: 'AI drafts characters, places, and factions from the prose for review.',
    article: 'Article IV',
    risk: 'Medium',
    consequence: 'Extracted detail can silently become canon without a reviewer.',
    control: 'Mandatory AI_EXTRACTED_UNREVIEWED class until a named human approves.',
  },
  {
    id: 'RF-07',
    flag: 'Manuscript custody with a third party',
    evidence: 'Full manuscript, codex, and bring-your-own-key traffic held in an external product.',
    article: 'Article V',
    risk: 'Medium',
    consequence: 'Unpublished war-canon material and cultural voice data leave our chain of custody.',
    control: 'No manuscript upload during quarantine. Evaluate with synthetic or already-public text only.',
  },
];

export const POC_PHASES = [
  {
    phase: 'P1',
    name: 'Hold and observe',
    outcome: 'Logged as QL-EXT-001, Literary Only, Remain Quarantined. This audit page is the artifact.',
    gate: 'No manuscript content leaves LitCentral.',
    status: 'done',
  },
  {
    phase: 'P2',
    name: 'Construct harvest',
    outcome: 'Write our own operational definition for each of the 14 dimensions we care about, into W3 Construct_Definition, marked candidate.',
    gate: 'Definitions authored by us. Their scores stay out.',
    status: 'ready',
  },
  {
    phase: 'P3',
    name: 'Capability build — codex first',
    outcome: 'Build PE-03, PE-04, PE-06, PE-07 natively: world entities, contradiction flags, scene search, prose revision log.',
    gate: 'Observed data only. No new scoring dimension ships in this phase.',
    status: 'ready',
  },
  {
    phase: 'P4',
    name: 'Blind shadow comparison',
    outcome: 'Score three already-public chapters under our frozen instrument, compare rank order against their output, record agreement.',
    gate: 'Instrument frozen before the run. Result is diagnostic, never canonical.',
    status: 'blocked',
    blocker: 'Requires public-safe text selection and a frozen formula version.',
  },
  {
    phase: 'P5',
    name: 'Review board ruling',
    outcome: 'Statistician, DH scholar, and Chicano literature reviewer rule on which dimensions may be promoted to staging.',
    gate: 'Unanimous documented sign-off, or the item stays quarantined.',
    status: 'blocked',
    blocker: 'Depends on P2–P4 evidence.',
  },
];

export const AUDIT_WORKBOOK = {
  file: 'LitCentral_W5_External_Capability_Audit',
  sheets: [
    { name: '_CONTROL', headers: ['audit_id', 'source_uri', 'source_reviewed_at_utc', 'evidence_basis', 'quarantine_id', 'schema_version', 'owner', 'approver', 'approval_status', 'notes'] },
    { name: 'Capability_Observed', headers: ['capability_id', 'capability_name', 'observed_description', 'observation_source', 'observed_at_utc', 'author_pain_addressed', 'data_class'] },
    { name: 'Infrastructure_Map', headers: ['capability_id', 'litcentral_equivalent', 'gap_description', 'target_workbook', 'target_sheet', 'build_effort', 'depends_on_capability_id'] },
    { name: 'Governance_Verdict', headers: ['capability_id', 'verdict', 'articles_engaged', 'permitted_use', 'prohibited_use', 'reviewer', 'decision_date'] },
    { name: 'Red_Flag_Register', headers: ['flag_id', 'flag_name', 'evidence_quote', 'article_violated', 'risk_level', 'consequence', 'required_control', 'status'] },
    { name: 'POC_Plan', headers: ['phase', 'phase_name', 'intended_outcome', 'gate_condition', 'status', 'blocker', 'owner', 'target_date'] },
    { name: 'Candidate_Construct', headers: ['candidate_id', 'external_dimension_name', 'our_operational_definition', 'unit_of_analysis', 'measurement_level', 'scale_anchors', 'overlaps_existing_construct', 'promotion_status'] },
    { name: 'Verification_Queue', headers: ['claim_id', 'external_claim', 'claim_type', 'primary_source_required', 'source_found', 'verification_result', 'verified_by', 'verified_at_utc'] },
  ],
};

const escapeXml = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function downloadAuditWorkbook() {
  const worksheets = AUDIT_WORKBOOK.sheets
    .map(({ name, headers }) => `\n    <Worksheet ss:Name="${escapeXml(name)}">\n      <Table>\n        <Row>${headers
      .map((h) => `<Cell ss:StyleID="header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`)
      .join('')}</Row>\n      </Table>\n    </Worksheet>`)
    .join('');
  const workbook = `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n  <Styles>\n    <Style ss:ID="header"><Font ss:Bold="1"/><Interior ss:Color="#E6B64A" ss:Pattern="Solid"/></Style>\n  </Styles>${worksheets}\n</Workbook>`;
  const url = URL.createObjectURL(new Blob([workbook], { type: 'application/vnd.ms-excel' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${AUDIT_WORKBOOK.file}_TEMPLATE.xml`;
  link.click();
  URL.revokeObjectURL(url);
}