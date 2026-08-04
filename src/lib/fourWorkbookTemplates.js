// Empty, schema-controlled workbook templates (W1–W6).
// Each download contains a _CONTROL sheet (release-package fields) and one sheet per
// master table. Headers only — no data, no coefficients, no scores.

import { RELEASE_PACKAGE_FIELDS } from '@/lib/measurementConstitution';
import { downloadWorkbook } from '@/lib/workbookXml';

const CONTROL_SHEET = { name: '_CONTROL', headers: [...RELEASE_PACKAGE_FIELDS, 'workbook_id', 'owner', 'approver', 'notes'] };

export const WORKBOOKS = [
  {
    id: 'W1',
    file: 'LitCentral_W1_Manuscript_DNA',
    name: 'Manuscript DNA',
    purpose: 'What is actually present in the manuscript. No baseline coefficients, no AI-generated final literary score.',
    sheets: [
      { name: 'Manuscript_Manifest', headers: ['manuscript_id', 'title', 'version', 'file_hash', 'word_count', 'created_at_utc', 'imported_at_utc', 'source_file', 'data_class'] },
      { name: 'Chapter', headers: ['chapter_id', 'manuscript_id', 'chapter_number', 'title', 'act', 'start_offset', 'end_offset', 'text_hash', 'word_count', 'word_count_method', 'status', 'data_class'] },
      { name: 'Scene', headers: ['scene_id', 'chapter_id', 'sequence', 'location', 'narrative_time', 'viewpoint', 'text_hash', 'data_class'] },
      { name: 'Passage', headers: ['passage_id', 'scene_id', 'paragraph_start', 'paragraph_end', 'text_hash', 'revision_id', 'passage_origin', 'data_class'] },
      { name: 'Character_Event', headers: ['event_id', 'scene_id', 'character_id', 'action', 'agency_type', 'consequence', 'data_class'] },
      { name: 'Language_Event', headers: ['event_id', 'passage_id', 'language', 'switch_type', 'speaker', 'narrative_function', 'data_class'] },
      { name: 'Sensory_Event', headers: ['event_id', 'passage_id', 'sensory_mode', 'object', 'narrative_function', 'data_class'] },
      { name: 'Historical_Claim_Link', headers: ['manuscript_claim_id', 'passage_id', 'claim_text', 'materiality', 'evidence_claim_id', 'data_class'] },
      { name: 'Rating_Long', headers: ['rating_id', 'unit_id', 'unit_type', 'construct_id', 'rater_id', 'rater_blinded', 'score', 'applicability', 'confidence', 'timestamp_utc', 'data_class'] },
      { name: 'Revision_Log', headers: ['revision_id', 'manuscript_id', 'chapter_id', 'revised_at_utc', 'agent_id', 'agent_type', 'text_hash_before', 'text_hash_after', 'data_class'] },
    ],
  },
  {
    id: 'W2',
    file: 'LitCentral_W2_Baseline_Chain_of_Custody',
    name: 'Baseline & Evidence Chain of Custody',
    purpose: 'External authority structure: corpus membership, bibliographic and authority records, artifacts, claim-to-source links, hashes.',
    sheets: [
      { name: 'Corpus_Item', headers: ['corpus_item_id', 'work_id', 'corpus_lane', 'inclusion_reason', 'exclusion_flags', 'edition_id', 'reviewer_id', 'data_class'] },
      { name: 'Authority_Record', headers: ['authority_id', 'authority_type', 'control_number_lccn', 'authorized_heading', 'cataloging_source', 'marc_670_source_consulted', 'retrieval_date_utc', 'uri', 'data_class'] },
      { name: 'Edition_Record', headers: ['edition_id', 'isbn', 'lccn', 'oclc', 'publisher', 'publication_date', 'language', 'format', 'data_class'] },
      { name: 'Evidence_Artifact', headers: ['artifact_id', 'title', 'creator', 'repository', 'uri', 'evidence_class', 'original_hash', 'local_hash', 'retrieved_at_utc', 'data_class'] },
      { name: 'Evidence_Claim', headers: ['evidence_claim_id', 'normalized_claim', 'time', 'place', 'people', 'confidence', 'status', 'reviewer_id', 'data_class'] },
      { name: 'Claim_Evidence_Link', headers: ['evidence_claim_id', 'artifact_id', 'page_or_location', 'support_type', 'support_code', 'contradiction_flag', 'reviewer_id', 'data_class'] },
      { name: 'Contradictory_Evidence', headers: ['contradiction_id', 'evidence_claim_id', 'artifact_id', 'nature_of_conflict', 'resolution_status', 'reviewer_id', 'data_class'] },
      { name: 'Corpus_Sampling_Frame', headers: ['frame_id', 'population_definition', 'inclusion_rules', 'exclusion_rules', 'freeze_date_utc', 'approver', 'data_class'] },
      { name: 'Provenance_Event', headers: ['event_id', 'entity_id', 'activity_id', 'activity_type', 'agent_id', 'agent_type', 'used_entity', 'generated_entity', 'started_at_utc', 'ended_at_utc'] },
      { name: 'Hash_Manifest', headers: ['entity_id', 'algorithm', 'digest', 'byte_size', 'previous_digest', 'verification_result', 'verified_at_utc', 'verifier'] },
    ],
  },
  {
    id: 'W3',
    file: 'LitCentral_W3_Methods_Codebook',
    name: 'Methods, Codebook, Prompts, Formulas & Skills',
    purpose: 'The scientific constitution in table form. The only workbook permitted to define official variables and formulas.',
    sheets: [
      { name: 'Variable_Codebook', headers: ['variable_id', 'variable_name', 'construct_id', 'operational_definition', 'unit_of_analysis', 'data_type', 'measurement_level', 'permitted_values', 'field_size', 'missing_rule', 'modeled_flag', 'source_lineage', 'formula_version', 'confidence_uncertainty', 'permitted_use', 'fairness_risk', 'owner', 'approver', 'effective_date', 'retirement_date'] },
      { name: 'Construct_Definition', headers: ['construct_id', 'name', 'definition', 'exclusions', 'unit_of_analysis', 'applicable_corpora', 'approver', 'effective_date'] },
      { name: 'Feature_Catalog', headers: ['feature_id', 'construct_id', 'operational_rule', 'data_type', 'allowed_values', 'missing_rule', 'permitted_use'] },
      { name: 'Formula_Version', headers: ['formula_id', 'version', 'expression', 'coefficient_source', 'status', 'effective_date', 'retired_date', 'supersedes_formula_id', 'approver'] },
      { name: 'Prompt_Template', headers: ['prompt_id', 'version', 'purpose', 'exact_prompt', 'input_schema', 'output_schema', 'prohibited_behavior', 'owner', 'approver'] },
      { name: 'Skill_Version', headers: ['skill_id', 'repository_path', 'commit_sha', 'dependencies', 'tests', 'reviewer', 'effective_date'] },
      { name: 'Model_Run', headers: ['run_id', 'formula_or_model_version', 'dataset_hash', 'syntax_hash', 'software_version', 'seed', 'outputs', 'exception_log', 'status'] },
      { name: 'Test_Case', headers: ['test_id', 'fixed_input', 'expected_output', 'tolerance', 'cultural_fairness_flag', 'last_result'] },
      { name: 'Change_Request', headers: ['request_id', 'rationale', 'evidence', 'impact_analysis', 'approvals', 'decision', 'decision_date'] },
      { name: 'Release_Candidate', headers: ['release_id', 'included_formulas', 'included_prompts', 'included_models', 'test_result', 'reviewer_signatures', 'status'] },
    ],
  },
  {
    id: 'W4',
    file: 'LitCentral_W4_Integrity_Quarantine_Release',
    name: 'Data Integrity, Quarantine & Release',
    purpose: 'Decides whether data are fit to move forward. It does not decide whether prose is good.',
    sheets: [
      { name: 'Quality_Rule', headers: ['rule_id', 'table_or_field', 'condition', 'severity', 'action', 'owner'] },
      { name: 'Validation_Result', headers: ['validation_id', 'rule_id', 'run_id', 'affected_record', 'result', 'evaluated_at_utc'] },
      { name: 'Quarantine_Log', headers: ['quarantine_id', 'entity_id', 'reason', 'source_hash', 'risk_level', 'status', 'disposition', 'reviewer', 'decision_date'] },
      { name: 'Reconciliation', headers: ['reconciliation_id', 'left_source', 'right_source', 'key', 'expected_count', 'actual_count', 'differences', 'status'] },
      { name: 'Missingness_Profile', headers: ['variable', 'valid_count', 'missing_count', 'not_applicable_count', 'missing_type', 'permitted_use'] },
      { name: 'Formula_Reconciliation', headers: ['record_id', 'stored_score', 'recomputed_score', 'formula_id', 'delta', 'tolerance', 'quarantine_triggered'] },
      { name: 'Drift_Monitor', headers: ['metric', 'reference_distribution', 'current_distribution', 'threshold', 'status', 'checked_at_utc'] },
      { name: 'Cultural_Fairness_Alert', headers: ['alert_id', 'test_type', 'variable', 'finding', 'construct_rationale_present', 'disposition', 'reviewer'] },
      { name: 'Override_Log', headers: ['override_id', 'entity_id', 'original_value', 'override_value', 'reason', 'actor', 'approver', 'timestamp_utc'] },
      { name: 'Incident_Log', headers: ['incident_id', 'discovery', 'scope', 'containment', 'root_cause', 'corrective_action', 'closed_at_utc'] },
      { name: 'Access_Log', headers: ['actor', 'role', 'entity', 'action', 'timestamp_utc'] },
      { name: 'Release_Manifest', headers: ['release_id', 'input_hashes', 'output_hashes', 'row_counts', 'software_versions', 'approval_status', 'created_at_utc'] },
      { name: 'Attestation_Log', headers: ['artifact_hash', 'attestation_uri_or_bundle', 'repository', 'workflow', 'commit_sha', 'verification_result', 'verifier', 'verified_at_utc'] },
    ],
  },
  {
    id: 'W5',
    file: 'LitCentral_W5_Prompt_Skill_Operations',
    name: 'Prompt, Skill, Formula & Code Operations',
    purpose: 'Working register for every prompt, skill, formula and script recovered from the audits — where it came from, what it may touch, and how its outputs aggregate into an edit. Clerical only: nothing here may assign a score.',
    sheets: [
      { name: 'Prompt_Register', headers: ['prompt_id', 'version', 'title', 'found_in_audit', 'source_location', 'exact_prompt', 'intended_task', 'clerical_or_scoring', 'contamination_status', 'quarantine_id', 'owner', 'approver', 'effective_date'] },
      { name: 'Prompt_Lineage', headers: ['prompt_id', 'parent_prompt_id', 'change_summary', 'authored_by', 'authored_by_type', 'reviewed_by', 'review_date'] },
      { name: 'Contamination_Check', headers: ['check_id', 'prompt_or_skill_id', 'suspected_leak', 'leak_type', 'evidence', 'affected_outputs', 'containment_action', 'reviewer', 'cleared_flag', 'cleared_date'] },
      { name: 'Skill_Register', headers: ['skill_id', 'skill_name', 'purpose', 'inputs', 'outputs', 'repository_path', 'commit_sha', 'language_runtime', 'dependencies', 'reviewer', 'effective_date'] },
      { name: 'Formula_Register', headers: ['formula_id', 'version', 'expression', 'hand_recomputable_flag', 'codebook_reference', 'coefficient_source', 'status', 'approver', 'effective_date', 'retired_date'] },
      { name: 'Code_Snippet', headers: ['snippet_id', 'skill_id', 'language', 'file_path', 'entry_point', 'purpose', 'test_id', 'reviewer', 'commit_sha'] },
      { name: 'Execution_Record', headers: ['execution_id', 'prompt_or_skill_id', 'operator', 'operator_type', 'input_hash', 'output_hash', 'started_at_utc', 'ended_at_utc', 'exceptions', 'signed_off_by'] },
      { name: 'Output_Aggregation', headers: ['aggregation_id', 'target_unit_id', 'unit_type', 'contributing_execution_ids', 'aggregation_rule', 'conflict_resolution', 'human_reviewer', 'accepted_flag', 'decision_date'] },
      { name: 'Editing_Pass', headers: ['pass_id', 'chapter_id', 'pass_type', 'aggregation_id', 'passages_touched', 'before_text_hash', 'after_text_hash', 'editor', 'signed_off_by', 'completed_at_utc'] },
      { name: 'Prohibited_Use', headers: ['rule_id', 'prompt_or_skill_id', 'prohibited_behavior', 'reason', 'enforcement_point', 'owner'] },
      { name: 'Retirement_Log', headers: ['retirement_id', 'prompt_or_skill_or_formula_id', 'reason', 'replacement_id', 'approver', 'retired_date'] },
    ],
  },
  {
    id: 'W6',
    file: 'LitCentral_W6_Governance_Workflow_SPSS',
    name: 'Baseline Rules, Governance, Workflow & SPSS Instrumentation',
    purpose: 'The heavy book: the baseline rules everything else answers to, the governance record, the turnkey workflow that connects the workbooks, and the SPSS questionnaire and run instrumentation.',
    sheets: [
      { name: 'Baseline_Rule', headers: ['rule_id', 'rule_text', 'rule_class', 'applies_to_workbook', 'authority_source', 'non_negotiable_flag', 'owner', 'approver', 'effective_date', 'superseded_by'] },
      { name: 'Governance_Decision', headers: ['decision_id', 'question', 'options_considered', 'decision', 'rationale', 'evidence_reference', 'decided_by', 'decision_date', 'review_due_date'] },
      { name: 'Role_Authority', headers: ['role_id', 'role_name', 'may_enter_data', 'may_score', 'may_approve_release', 'may_publish', 'restrictions', 'assigned_to'] },
      { name: 'Scoring_Custody', headers: ['custody_id', 'construct_or_variable_id', 'scored_by_role', 'procedure_reference', 'published_before_run_flag', 'attestation_required', 'reviewer_count'] },
      { name: 'Compliance_Register', headers: ['compliance_id', 'rule_id', 'checked_artifact', 'result', 'exception_note', 'checked_by', 'checked_at_utc'] },
      { name: 'Workflow_Stage', headers: ['stage_id', 'sequence', 'stage_name', 'purpose', 'source_workbook', 'target_workbook', 'entry_condition', 'exit_condition', 'blocking_flag', 'owner'] },
      { name: 'Workflow_Handoff', headers: ['handoff_id', 'from_stage_id', 'to_stage_id', 'release_package_id', 'input_hashes', 'output_hashes', 'approver', 'transferred_at_utc'] },
      { name: 'Turnkey_Runbook', headers: ['step_id', 'sequence', 'action', 'operator_role', 'tool_or_workbook', 'expected_result', 'failure_action', 'estimated_duration'] },
      { name: 'SPSS_Questionnaire_Item', headers: ['item_id', 'construct_id', 'question_text', 'response_format', 'scale_points', 'anchors', 'reverse_scored_flag', 'variable_name', 'value_labels', 'missing_codes'] },
      { name: 'SPSS_Variable_Map', headers: ['variable_name', 'source_workbook', 'source_sheet', 'source_field', 'measurement_level', 'value_labels', 'missing_rule', 'transformation_note'] },
      { name: 'SPSS_Dataset_Build', headers: ['build_id', 'dataset_name', 'unit_of_analysis', 'included_variables', 'row_count', 'source_release_id', 'dataset_hash', 'built_by', 'built_at_utc'] },
      { name: 'SPSS_Run_Log', headers: ['run_id', 'build_id', 'analysis_type', 'syntax_file', 'syntax_hash', 'software_version', 'output_file', 'output_hash', 'operator', 'attestation_signed_flag', 'run_at_utc'] },
      { name: 'SPSS_Air_Gap_Attestation', headers: ['attestation_id', 'run_id', 'no_model_contact_confirmed', 'confirmed_by', 'signature_reference', 'notes', 'signed_at_utc'] },
      { name: 'Public_Criteria_Map', headers: ['map_id', 'internal_measure', 'external_criterion', 'issuing_body', 'criterion_citation_apa7', 'relationship', 'claim_permitted_flag', 'reviewer'] },
    ],
  },
];

export function downloadWorkbookTemplate(workbookId) {
  const wb = WORKBOOKS.find((w) => w.id === workbookId);
  if (!wb) return;
  downloadWorkbook(`${wb.file}_TEMPLATE.xml`, [CONTROL_SHEET, ...wb.sheets]);
}