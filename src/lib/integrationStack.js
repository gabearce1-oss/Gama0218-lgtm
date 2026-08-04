// The integration stack: what is wired now, what is worth wiring next, and what is refused.
// Status is factual — "live" only where the connector is authorized on this app today.

export const STATUS_META = {
  live: { label: 'Live', style: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  ready: { label: 'Ready to wire', style: 'border-sky-500/40 bg-sky-500/10 text-sky-300' },
  paused: { label: 'Paused · credits', style: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
  refused: { label: 'Refused', style: 'border-red-500/40 bg-red-500/10 text-red-300' },
};

export const LANES = [
  {
    lane: 'Document & manuscript custody',
    items: [
      { name: 'Google Drive', status: 'live', does: 'Reads chapter documents, writes exports and backups.', usedBy: 'Document Scanner, workbook sync, beta export.' },
      { name: 'Dropbox', status: 'live', does: 'Second custody location for workbooks and blockers.', usedBy: 'Workbook sync, template upload.' },
      { name: 'Google Sheets', status: 'ready', does: 'Two-way ledger sync for quarantine, drafts and workbook rows.', usedBy: 'Sheets sync functions (workspace credentials registered).' },
      { name: 'Box / SharePoint / OneDrive', status: 'ready', does: 'Institutional custody if an archive requires their storage.', usedBy: 'Not wired — add only when an institution asks.' },
    ],
  },
  {
    lane: 'Signal & notification',
    items: [
      { name: 'Slack', status: 'live', does: 'Posts failsafe trips, sync failures and scan summaries to a channel.', usedBy: 'sendSlackAlert.' },
      { name: 'Slack (inbound)', status: 'ready', does: 'Raise a failsafe trigger or request a scan from a Slack message.', usedBy: 'Not wired — webhook events already supported.' },
      { name: 'Email to registered users', status: 'paused', does: 'Digest of open triggers and review queue.', usedBy: 'Blocked while Integration credits are exhausted.' },
    ],
  },
  {
    lane: 'AI — clerical lane only',
    items: [
      { name: 'Gemini (via AI gateway)', status: 'paused', does: 'Transcription, formatting, retrieval, drafting for human sign-off.', usedBy: 'Backend functions; no scoring authority, ever.' },
      { name: 'OpenAI (via AI gateway)', status: 'paused', does: 'Same clerical lane, second opinion on transcription only.', usedBy: 'Backend functions; no scoring authority, ever.' },
      { name: 'File text extraction', status: 'paused', does: 'Pulls text out of .docx and PDF so locators can scan them.', usedBy: 'Document Scanner — the one real gap in the crawler today.' },
      { name: 'Any AI-assigned score', status: 'refused', does: 'Would let a model set a number that enters the record.', usedBy: 'Refused by the decommission order and scoring custody.' },
    ],
  },
  {
    lane: 'Analytics & statistics',
    items: [
      { name: 'SPSS (air-gapped)', status: 'live', does: 'The only lane permitted to execute official analysis.', usedBy: 'W6 questionnaire, variable map, run log, air-gap attestation.' },
      { name: 'In-app event analytics', status: 'ready', does: 'Which reports get opened, which queues stall, where review dies.', usedBy: 'Not wired — page and action events only, no manuscript content.' },
      { name: 'Google Analytics / Search Console', status: 'ready', does: 'Reach data once anything is published publicly.', usedBy: 'Not wired — nothing is public yet.' },
      { name: 'BigQuery / Snowflake / Databricks', status: 'refused', does: 'Cloud warehouse execution of the analysis.', usedBy: 'Refused — no cloud. SPSS stays the lab.' },
    ],
  },
  {
    lane: 'Research & institutional',
    items: [
      { name: 'GitHub', status: 'ready', does: 'Commit SHAs for the skill and code registers, signed attestations.', usedBy: 'Would fill W5 Skill_Register and W4 Attestation_Log.' },
      { name: 'Notion / Confluence', status: 'ready', does: 'Where an institutional partner keeps their review notes.', usedBy: 'Not wired — add per partner.' },
      { name: 'Supabase', status: 'live', does: 'Read-only project status check.', usedBy: 'supabaseProjectStatus.' },
    ],
  },
];

export const REFUSALS = [
  'No cloud analysis engine. SPSS is the lab and it stays air-gapped.',
  'No model touches SPSS syntax, data or output.',
  'No integration may write a score, weight or ranking. Clerical work only, under a named human sign-off.',
  'No manuscript text leaves custody for an analytics vendor.',
];