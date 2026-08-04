export const systemStages = [
  ['Source capture', 'Vault II is the verified 44-chapter source. Chapter records, evidence claims, code-switching entries, blocker records, and notes are captured in the platform.', 'cyan'],
  ['Quarantine & restoration', 'Candidate passages are held in Quarantine, reviewed by people, then staged as RestorationDraft records. Approved drafts can be published back to a chapter scorecard.', 'amber'],
  ['Scoring & safeguards', 'RF 1.5 calculates Ω from CLS, BIS, SII, and MRF. Governance, data hygiene, Chicano Lens, and prose form the ordered review gates.', 'emerald'],
  ['Decision & reporting', 'Chapter scorecards, dashboards, architecture reports, exports, and logs present the approved working record to collaborators.', 'violet'],
];

export const currentBoundaries = [
  ['Verified source scope', 'Vault II is 44 chapters. Two legacy chapter records remain in the database but are excluded from the current-source dashboard view.', 'amber'],
  ['Scoring record', 'The active RF 1.5 formula is centrally defined in governance. One historical governance label still refers to 45 chapters, so it does not match the current 44-chapter source scope.', 'red'],
  ['Restoration control', 'The Cookbook preserves candidates, Quarantine separates their review status, and owner approval can publish a restoration draft to a chapter scorecard.', 'emerald'],
  ['Workbook boundary', 'The four-workbook separation—manuscript; prompts, tools, and formulas; data hygiene and chain of custody; and rankings—does not yet exist as distinct workbook domains in the platform.', 'red'],
  ['Decontamination boundary', 'There is no dedicated, end-to-end decontamination workflow represented in the platform today. Quarantine provides review containment, but it is not a verified decontamination control.', 'red'],
  ['External analysis', 'SPSS is not integrated into the platform and remains an autonomous external analysis environment.', 'cyan'],
];

export const connectorLandscape = [
  ['Connected sources', 'Services with an authorized connection or an existing connector-backed path.', ['Google Drive', 'Dropbox', 'Google Sheets workspace connector', 'Slack Bot', 'Supabase'], 'cyan'],
  ['Platform handling', 'Configured functions import, export, scan, or monitor material without directly making it canonical.', ['Drive and Dropbox workbook sync', 'Prose scanning', 'Restoration export', 'Workbook ledger sync', 'Slack alert path'], 'amber'],
  ['Safeguarded records', 'Material is held in reviewable platform records before score or reporting use.', ['Quarantine', 'Evidence claims', 'Blockers', 'Cook packets and outputs', 'Rulings and promotion gates'], 'violet'],
];