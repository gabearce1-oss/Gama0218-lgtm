// Guardrail workbook export: the tripwire registry, rule authority and failsafe event log
// as they stand on the site, written out as workbook rows so the automation reads from the
// same table a human can audit by hand.

import { TRIPWIRES, RULE_AUTHORITY } from '@/lib/failsafe';
import { downloadWorkbook } from '@/lib/workbookXml';

const TRIPWIRE_HEADERS = [
  'tripwire_id', 'name', 'category', 'watches', 'on_trip_action',
  'default_state', 'halts_pipeline', 'clearance_requires', 'automation_hook',
];

const AUTHORITY_HEADERS = ['authority_id', 'standing', 'statement'];

const EVENT_HEADERS = [
  'event_id', 'tripwire_id', 'title', 'category', 'severity', 'trigger_state',
  'halts_pipeline', 'detected_at_utc', 'detected_by', 'detection_source',
  'affected_systems', 'evidence', 'containment_action', 'human_reviewer',
  'signed_off', 'cleared_at_utc', 'notes',
];

const EXAM_HEADERS = [
  'exam_id', 'tripwire_id', 'exam_date_utc', 'examiner', 'what_it_blocked',
  'what_it_let_through', 'what_it_should_have_caught', 'fault_found', 'corrective_action', 'signed_off_by',
];

const tripwireRows = () =>
  TRIPWIRES.map((t) => [
    t.id, t.name, t.category, t.watches, t.onTrip,
    'Armed', 'TRUE', 'Named human reviewer + date', `failsafe_event.tripwire_id = ${t.id}`,
  ]);

const authorityRows = () => [
  ...RULE_AUTHORITY.held.map((s, i) => [`RA-H${i + 1}`, 'Held by humans', s]),
  ...RULE_AUTHORITY.granted.map((s, i) => [`RA-G${i + 1}`, 'Granted to models (clerical)', s]),
];

const eventRows = (events) =>
  events.map((e) => [
    e.event_id || e.id, e.tripwire_id, e.title, e.category, e.severity, e.trigger_state,
    e.halts_pipeline ? 'TRUE' : 'FALSE', e.detected_at || e.created_date, e.detected_by, e.detection_source,
    e.affected_systems, e.evidence, e.containment_action, e.human_reviewer,
    e.signed_off ? 'TRUE' : 'FALSE', e.cleared_at, e.notes,
  ]);

export function downloadGuardrailWorkbook(events = []) {
  downloadWorkbook('LitCentral_Guardrail_Workbook.xml', [
    { name: 'Tripwire_Registry', headers: TRIPWIRE_HEADERS, rows: tripwireRows() },
    { name: 'Rule_Authority', headers: AUTHORITY_HEADERS, rows: authorityRows() },
    { name: 'Failsafe_Event_Log', headers: EVENT_HEADERS, rows: eventRows(events) },
    { name: 'Guardrail_Examination', headers: EXAM_HEADERS },
  ]);
}

export const GUARDRAIL_SHEETS = [
  { name: 'Tripwire_Registry', count: TRIPWIRES.length, note: 'All eight tripwires, armed, with their trip actions.' },
  { name: 'Rule_Authority', count: RULE_AUTHORITY.held.length + RULE_AUTHORITY.granted.length, note: 'What humans hold and what models are granted.' },
  { name: 'Failsafe_Event_Log', count: null, note: 'Every event currently on the site, with sign-off state.' },
  { name: 'Guardrail_Examination', count: 0, note: 'Blank — for the scheduled exam records (FS-05).' },
];