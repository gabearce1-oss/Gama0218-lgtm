import { downloadWorkbook } from '@/lib/workbookXml';
import { VARIABLE_DICTIONARY, PROTOCOL_STEPS, SYNTAX_TEMPLATE, CUSTODY_ROLE } from '@/lib/spssProtocol';

const stamp = () => new Date().toISOString().slice(0, 10);

/** Flat rectangular case file: one row per chapter, one column per SPSS variable. */
export function downloadSpssExtract(chapters) {
  const headers = VARIABLE_DICTIONARY.map((v) => v.name);
  const rows = chapters.map((c) => VARIABLE_DICTIONARY.map((v) => c[v.field] ?? ''));
  downloadWorkbook(`SPSS_Data_Extract_${stamp()}.xls`, [
    { name: 'Data', headers, rows },
    {
      name: 'Variable Dictionary',
      headers: ['Variable', 'Label', 'Measurement Level', 'Permitted Range', 'Source Field'],
      rows: VARIABLE_DICTIONARY.map((v) => [v.name, v.label, v.level, v.range, v.field]),
    },
    {
      name: 'Provenance',
      headers: ['Item', 'Value'],
      rows: [
        ['Extract date', stamp()],
        ['Cases exported', String(chapters.length)],
        ['Source', 'Chapter registry — live entity data'],
        ['Extraction lane', CUSTODY_ROLE.label],
        ['Analysis environment', 'IBM SPSS Statistics — external, air-gapped'],
        ['Attestation', 'Unsigned until a named human signs the run'],
      ],
    },
  ]);
}

/** Protocol + dictionary + syntax, no case data — the document Devin reads. */
export function downloadSpssPlaybook() {
  downloadWorkbook(`SPSS_Protocol_Playbook_${stamp()}.xls`, [
    {
      name: 'Protocol',
      headers: ['Step', 'Name', 'Detail'],
      rows: PROTOCOL_STEPS.map((s) => [s.id, s.name, s.detail]),
    },
    {
      name: 'Custody Role',
      headers: ['Type', 'Statement'],
      rows: [
        ...CUSTODY_ROLE.holds.map((h) => ['Holds', h]),
        ...CUSTODY_ROLE.forbids.map((f) => ['Forbids', f]),
      ],
    },
    {
      name: 'Variable Dictionary',
      headers: ['Variable', 'Label', 'Measurement Level', 'Permitted Range', 'Source Field'],
      rows: VARIABLE_DICTIONARY.map((v) => [v.name, v.label, v.level, v.range, v.field]),
    },
    {
      name: 'Syntax Template',
      headers: ['Line'],
      rows: SYNTAX_TEMPLATE.split('\n').map((l) => [l]),
    },
  ]);
}

/** Plain .sps syntax file, ready to open in SPSS. */
export function downloadSyntaxFile() {
  const url = URL.createObjectURL(new Blob([SYNTAX_TEMPLATE], { type: 'text/plain' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `AZTLAN_TE360_${stamp()}.sps`;
  link.click();
  URL.revokeObjectURL(url);
}