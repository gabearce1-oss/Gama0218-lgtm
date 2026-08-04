// Two standalone downloads: the integration register (populated from the live stack) and the
// blank workflow template that connects the workbooks stage by stage.

import { LANES, REFUSALS, STATUS_META } from '@/lib/integrationStack';
import { downloadWorkbook } from '@/lib/workbookXml';

const REGISTER_HEADERS = [
  'integration_id', 'lane', 'name', 'status', 'what_it_does', 'used_by',
  'data_leaving_custody', 'scoring_authority', 'credential_owner', 'reviewer', 'review_date',
];

const REFUSAL_HEADERS = ['refusal_id', 'refusal', 'authority_source', 'approver'];

const CONNECTION_HEADERS = [
  'connection_id', 'integration_id', 'account_or_workspace', 'scopes_granted',
  'granted_by', 'granted_at_utc', 'rotation_due', 'revoked_at_utc', 'notes',
];

const INCIDENT_HEADERS = [
  'incident_id', 'integration_id', 'failure_type', 'detected_at_utc', 'tripwire_id',
  'containment_action', 'root_cause', 'corrective_action', 'closed_at_utc', 'signed_off_by',
];

const registerRows = () =>
  LANES.flatMap((lane, li) =>
    lane.items.map((it, ii) => [
      `INT-${String(li + 1).padStart(2, '0')}${String(ii + 1).padStart(2, '0')}`,
      lane.lane,
      it.name,
      STATUS_META[it.status].label,
      it.does,
      it.usedBy,
      '',
      it.status === 'refused' ? 'REFUSED' : 'NONE',
      '',
      '',
      '',
    ]),
  );

export function downloadIntegrationRegister() {
  downloadWorkbook('LitCentral_Integration_Register.xml', [
    { name: 'Integration_Register', headers: REGISTER_HEADERS, rows: registerRows() },
    { name: 'Refusal_Register', headers: REFUSAL_HEADERS, rows: REFUSALS.map((r, i) => [`REF-${i + 1}`, r, '', '']) },
    { name: 'Connection_Log', headers: CONNECTION_HEADERS },
    { name: 'Integration_Incident', headers: INCIDENT_HEADERS },
  ]);
}

const WORKFLOW_SHEETS = [
  { name: 'Workflow_Stage', headers: ['stage_id', 'sequence', 'stage_name', 'purpose', 'source_workbook', 'target_workbook', 'entry_condition', 'exit_condition', 'blocking_flag', 'owner'] },
  { name: 'Stage_Task', headers: ['task_id', 'stage_id', 'sequence', 'task', 'operator_role', 'tool_or_integration', 'input', 'expected_output', 'duration_estimate'] },
  { name: 'Handoff', headers: ['handoff_id', 'from_stage_id', 'to_stage_id', 'release_package_id', 'input_hashes', 'output_hashes', 'approver', 'transferred_at_utc'] },
  { name: 'Gate_Check', headers: ['gate_id', 'stage_id', 'condition_checked', 'rule_id', 'result', 'blocking', 'checked_by', 'checked_at_utc'] },
  { name: 'Role_Assignment', headers: ['assignment_id', 'stage_id', 'role_name', 'assigned_to', 'may_enter_data', 'may_score', 'may_approve', 'restrictions'] },
  { name: 'Automation_Hook', headers: ['hook_id', 'stage_id', 'trigger_type', 'trigger_detail', 'function_or_integration', 'clerical_only_flag', 'failure_tripwire_id', 'owner'] },
  { name: 'Exception_Path', headers: ['exception_id', 'stage_id', 'exception_condition', 'diversion_target', 'quarantine_required', 'notify_role', 'resolution_owner'] },
  { name: 'Cycle_Log', headers: ['cycle_id', 'workflow_version', 'started_at_utc', 'finished_at_utc', 'stages_completed', 'stages_blocked', 'operator', 'signed_off_by'] },
  { name: 'Turnkey_Runbook', headers: ['step_id', 'sequence', 'action', 'operator_role', 'tool_or_workbook', 'expected_result', 'failure_action', 'estimated_duration'] },
];

export function downloadWorkflowTemplate() {
  downloadWorkbook('LitCentral_Workflow_TEMPLATE.xml', WORKFLOW_SHEETS);
}

export const DOWNLOADS = [
  {
    id: 'register',
    title: 'Integration Register workbook',
    detail: 'Populated with every integration below, plus the refusal register. Blank connection and incident sheets for credentials and failures.',
    sheets: ['Integration_Register', 'Refusal_Register', 'Connection_Log', 'Integration_Incident'],
    run: downloadIntegrationRegister,
  },
  {
    id: 'workflow',
    title: 'Workflow template',
    detail: 'Blank. Stages, tasks, handoffs, gate checks, role assignments, automation hooks, exception paths, cycle log and the turnkey runbook.',
    sheets: WORKFLOW_SHEETS.map((s) => s.name),
    run: downloadWorkflowTemplate,
  },
];