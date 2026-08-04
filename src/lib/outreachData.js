export const STRATEGIC_FRAME = 'A historically grounded literary manuscript and evidence-linked public-humanities initiative centered on Chicano Vietnam memory, generational displacement, and archival recovery; supported by documented internal analytics, with external institutional validation in progress.';

export const PRIORITY_COLORS = {
  P0: { border: 'border-red-500/30', text: 'text-red-400', bg: 'bg-red-500/5', label: 'Reach First' },
  P1: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/5', label: 'High-Value Next' },
  P2: { border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/5', label: 'Specialized Follow-On' },
  P3: { border: 'border-muted', text: 'text-muted-foreground', bg: 'bg-muted/5', label: 'Nice to Have' },
};

export const STATUS_COLORS = {
  not_started: 'border-muted text-muted-foreground bg-muted/5',
  drafted: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
  sent: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5',
  replied: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
  meeting_scheduled: 'border-violet-500/30 text-violet-400 bg-violet-500/5',
  meeting_held: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
  submitted: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
  declined: 'border-red-500/30 text-red-400 bg-red-500/5',
  archived: 'border-muted text-muted-foreground bg-muted/5',
};

export const STATUS_OPTIONS = ['not_started', 'drafted', 'sent', 'replied', 'meeting_scheduled', 'meeting_held', 'submitted', 'declined', 'archived'];

export const WAVE_CONFIG = [
  { key: 'quiet_first', label: 'Quiet First Wave', desc: 'UCLA CSRC, Berkeley OHC, Oxford RSC, Wiener, COMPAS', goal: 'Secure serious conversations', signal: 'Meeting or substantive email reply', color: 'red' },
  { key: 'formal_second', label: 'Formal Second Wave', desc: 'UArizona, UTEP, NIOD, AJR Refugee Voices, EHRI', goal: 'Expand archive/research network', signal: 'Invitation to submit materials or consult', color: 'amber' },
  { key: 'veteran_third', label: 'Veteran Third Wave', desc: 'VHP path, veteran archives, deported-veteran orgs', goal: 'Strengthen witness and public-memory layer', signal: 'Testimony interest, advisory support', color: 'cyan' },
  { key: 'public_fourth', label: 'Public Fourth Wave', desc: 'Selected press, newsletter, broader humanities audience', goal: 'Controlled public launch', signal: 'Coverage tied to institutional milestone', color: 'violet' },
];

export const ROLLOUT_TIMELINE = [
  { month: 'Jul 2026', items: ['Canonical manuscript freeze', 'Evidence registry normalization', 'Secrets and access cleanup', 'Provenance binder build'], track: 'Evidence Assembly' },
  { month: 'Jul 2026', items: ['P0 archive and center inquiries'], track: 'Institutional Outreach' },
  { month: 'Aug 2026', items: ['Supabase and evidence schema', 'Automation staging and logging'], track: 'Technical Hardening' },
  { month: 'Aug 2026', items: ['P1 follow-on outreach'], track: 'Institutional Outreach' },
  { month: 'Aug 2026', items: ['Newsletter relaunch'], track: 'Public Communications' },
  { month: 'Sep 2026', items: ['Veteran organization outreach'], track: 'Institutional Outreach' },
  { month: 'Sep 2026', items: ['Soft public update after milestone'], track: 'Public Communications' },
  { month: 'Oct 2026', items: ['Press outreach after institutional proof'], track: 'Public Communications' },
];

export const KPIS = [
  { kpi: 'P0 outreach emails sent', d30: 6, d90: 12, d180: 20 },
  { kpi: 'Substantive replies', d30: 2, d90: 5, d180: 10 },
  { kpi: 'Meetings held', d30: 1, d90: 4, d180: 8 },
  { kpi: 'Archive/research access leads', d30: 2, d90: 5, d180: 8 },
  { kpi: 'Formal institutional submissions', d30: 1, d90: 3, d180: 5 },
  { kpi: 'Newsletter subscribers', d30: 'baseline', d90: '+25%', d180: '+75%' },
  { kpi: 'Evidence items normalized', d30: 250, d90: 1000, d180: 2500 },
  { kpi: 'Claims → public-safe wording', d30: '100% high-risk', d90: 'maintained', d180: 'maintained' },
];

export const RISK_CHECKLIST = [
  { area: 'AI Disclosure', rule: 'Describe the system honestly as AI-assisted where applicable; never claim "zero AI" if tools were used' },
  { area: 'Evidence Inflation', rule: 'No public claim without a source class and confidence band' },
  { area: 'Consent & Testimony', rule: 'Do not circulate personal or oral-history material without clear release status' },
  { area: 'Genealogical Sensitivity', rule: 'Treat lineage and Indigenous identity questions with explicit uncertainty where records are incomplete' },
  { area: 'Security', rule: 'No credentials in docs, repos, email drafts, or slides' },
  { area: 'Privacy', rule: 'Keep internal contact lists and sensitive correspondence out of public workbooks' },
  { area: 'Reproducibility', rule: 'Save search terms, dates, snapshots, and URLs for public-database work' },
  { area: 'Version Control', rule: 'One canonical file name, one public checksum, one decision log' },
  { area: 'Outreach Discipline', rule: 'No mass press blast before an institutional milestone' },
  { area: 'Governance', rule: 'Every automation touching outbound communication should require human approval' },
];

export const ROADMAP = [
  { horizon: 'Next 30 Days', actions: 'Freeze canonical Ramos package; build master workbook; normalize claims and evidence IDs; clean repo/public-doc exposure; send quiet P0 outreach', success: 'One locked package, one working workbook, 4–6 serious outreach emails, no overclaim language' },
  { horizon: 'Next 90 Days', actions: 'Complete provenance binder; obtain at least one substantive institutional meeting; stage technical integrations; relaunch newsletter quietly', success: 'One institutional review path active, one archive or center advising informally, integrations staged not chaotic' },
  { horizon: 'Next 180 Days', actions: 'Complete at least one formal institutional submission; publish a controlled public brief; expand academic and veteran partnerships; only then consider selective press', success: 'External acknowledgement, not just internal enthusiasm' },
];

export const CHANNELS = [
  { channel: 'Direct Academic Email', useFor: 'First contact with P0/P1 institutions, scholars, centers', caution: 'Never send long manifestos' },
  { channel: 'Archive Request Letters', useFor: 'Formal records access, finding-aid inquiries, collection meetings', caution: 'Do not bury the request in ideology' },
  { channel: 'Newsletter', useFor: 'Monthly updates to warm supporters and institutions', caution: 'Do not use as substitute for formal outreach' },
  { channel: 'Press', useFor: 'Only after at least one institutional milestone', caution: 'Never before evidence assembly' },
  { channel: 'Veteran Organizations', useFor: 'Testimony, witness networks, legitimacy in service-memory space', caution: 'Avoid unverifiable aggregate claims' },
  { channel: 'Public Talks / Humanities Events', useFor: 'Credibility, coalition-building, archive-friendly framing', caution: 'Avoid "platform solved it" rhetoric' },
  { channel: 'LinkedIn', useFor: 'Professional updates, institutional tagging, thought-leadership', caution: 'Low-value for raw archival requests' },
  { channel: 'Website Landing Page', useFor: 'Controlled public record, downloadable one-pager, FAQs', caution: 'Do not publish unresolved claim tables' },
  { channel: 'GitHub Public README', useFor: 'Technical posture, roadmap transparency', caution: 'Never expose secrets or internal-only guides' },
];