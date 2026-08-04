const sheets = [
  {
    name: 'Chapter Registry',
    headers: ['chapter_number', 'title', 'act', 'status', 'word_count', 'priority', 'priority_reason', 'risk', 'triage', 'tier_label', 'priority_action', 'notes'],
  },
  {
    name: 'Narrative Scorecard',
    headers: ['chapter_number', 'omega', 'omega_audit', 'omega_est', 'cls', 'cls_est', 'bis', 'bis_est', 'sii', 'sii_est', 'mrf', 'mrf_est', 'character_agency', 'emotional_resonance', 'dialogue', 'reader_retention', 'cinematic_potential'],
  },
  {
    name: 'Prose & Sensory Review',
    headers: ['chapter_number', 'voice', 'lens', 'cs_score', 'cs_pct', 'spanish_tokens', 'familia', 'barrio', 'hist', 'carnalismo', 'composite', 'moral_weight', 'body_memory', 'grief_index', 'agency_under_fire', 'cultural_reflex', 'beat_pacing', 'flesch_reading_score', 'sensory_present', 'sensory_total', 'restoration_notes'],
  },
  {
    name: 'Editorial Flags',
    headers: ['chapter_number', 'blocker_ids', 'bugs', 'smells', 'vulnerabilities'],
  },
  {
    name: 'Code Switch Log',
    headers: ['chapter_number', 'position', 'speaker', 'line_text', 'matrix_code', 'switch_to', 'switch_type', 'function_tag', 'count_switch'],
  },
  {
    name: 'Evidence & Editorial Review',
    headers: ['chapter_number', 'scene_id', 'claim_text', 'claim_category', 'evidence_class', 'source_title', 'source_url_or_file', 'source_note', 'confidence', 'editorial_status', 'reviewer', 'reviewed_at'],
  },
  {
    name: 'Restoration Review',
    headers: ['chapter_number', 'chapter_title', 'original_omega', 'cooked_omega', 'original_cls', 'cooked_cls', 'original_bis', 'cooked_bis', 'original_sii', 'cooked_sii', 'original_mrf', 'cooked_mrf', 'approved_passages', 'llm_reasoning', 'status', 'cooked_date'],
  },
];

const escapeXml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function downloadManuscriptWorkbook() {
  const worksheets = sheets.map(({ name, headers }) => `\n    <Worksheet ss:Name="${escapeXml(name)}">\n      <Table>\n        <Row>${headers.map((header) => `<Cell ss:StyleID="header"><Data ss:Type="String">${escapeXml(header)}</Data></Cell>`).join('')}</Row>\n      </Table>\n    </Worksheet>`).join('');
  const workbook = `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n  <Styles>\n    <Style ss:ID="header"><Font ss:Bold="1"/><Interior ss:Color="#E6B64A" ss:Pattern="Solid"/></Style>\n  </Styles>${worksheets}\n</Workbook>`;
  const url = URL.createObjectURL(new Blob([workbook], { type: 'application/vnd.ms-excel' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Omega_Manuscript_Workbook_Template.xml';
  link.click();
  URL.revokeObjectURL(url);
}