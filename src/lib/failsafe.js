// Failsafe trigger registry. A tripwire is armed by default and halts the pipeline when it trips.
// Nothing here is decided by a model: every clearance requires a named human sign-off.

export const TRIPWIRES = [
  {
    id: 'FS-01',
    name: 'Account or drive security signal',
    watches: 'Google/Drive security alerts, unexpected sign-ins, revoked or re-scoped tokens.',
    onTrip: 'Freeze all sync in and out. Re-verify hashes on the last release package before anything moves again.',
    category: 'Security breach',
  },
  {
    id: 'FS-02',
    name: 'Access anomaly',
    watches: 'File access by an actor with no role authority, or edits outside the assigned workflow stage.',
    onTrip: 'Record the actor, the entity and the action. Roll the record back to the last signed state.',
    category: 'Access anomaly',
  },
  {
    id: 'FS-03',
    name: 'Missed or silently dropped data',
    watches: 'Row-count mismatch between source and destination, blank required fields, chapters absent from a ledger.',
    onTrip: 'Quarantine the destination table. No downstream reporting until the reconciliation closes.',
    category: 'Missed data',
  },
  {
    id: 'FS-04',
    name: 'Unverified claim reaching a report',
    watches: 'A finding rendered without its provenance tier or APA 7 citation attached.',
    onTrip: 'Pull the finding from the report surface and send it back to the provenance log.',
    category: 'Unverified claim',
  },
  {
    id: 'FS-05',
    name: 'Guardrail examination',
    watches: 'Scheduled review of guardrail behavior: what it blocked, what it let through, what it should have caught.',
    onTrip: 'Log the examination result whether or not it found a fault. A clean exam is still a record.',
    category: 'Guardrail examination',
  },
  {
    id: 'FS-06',
    name: 'Scoring custody violation',
    watches: 'Any score, weight or ranking entered by a model rather than a certified human operator.',
    onTrip: 'Void the value, quarantine the record, and log the prompt or skill that produced it.',
    category: 'Scoring custody violation',
  },
  {
    id: 'FS-07',
    name: 'Formula drift',
    watches: 'Stored score no longer matches the score recomputed by hand from the published formula.',
    onTrip: 'Hold the stored value as legacy. Do not overwrite until formula authority is confirmed.',
    category: 'Formula drift',
  },
  {
    id: 'FS-08',
    name: 'Sync or backup failure',
    watches: 'A scheduled export, import or backup that did not complete, or completed with errors.',
    onTrip: 'Treat the destination as stale. Re-run only after the cause is written into the incident record.',
    category: 'Sync failure',
  },
];

export const RULE_AUTHORITY = {
  heading: 'Who makes the rules',
  held: [
    'Humans write the rules. Certification and accountability sit with named people, not systems.',
    'A model is not qualified to set governance, assign a score, or clear its own trigger.',
    'Every clearance carries a reviewer name and a date, or it is not cleared.',
  ],
  granted: [
    'Models are genuinely strong at the clerical work: transcription, formatting, retrieval, drafting for sign-off.',
    'That work has real value for restoring a record that institutions let go dark.',
    'Under a guardrail, with peer review and a documented ethos, the collaboration is productive — and it stays bounded.',
  ],
};

export const SEVERITY_STYLES = {
  Critical: 'border-red-500/40 bg-red-500/10 text-red-300',
  High: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  Medium: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  Low: 'border-border bg-muted text-muted-foreground',
};

export const STATE_STYLES = {
  Tripped: 'border-red-500/40 bg-red-500/10 text-red-300',
  'Standing risk': 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  Contained: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  Armed: 'border-border bg-muted text-muted-foreground',
  Cleared: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
};

export const OPEN_STATES = ['Tripped', 'Standing risk', 'Contained'];