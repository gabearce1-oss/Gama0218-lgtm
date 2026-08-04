import { downloadWorkbook } from '@/lib/workbookXml';

const stamp = () => new Date().toISOString().slice(0, 10);

export function requestId(testId) {
  return `TR-${testId}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

/** Build runnable SPSS syntax for one planned test. */
export function buildSyntax({ test, frame, dv, factor, vars, reqId }) {
  const header = [
    `* ${reqId} — ${test.name} (${test.family}).`,
    `* Frame: ${frame.label}.`,
    `* Generated ${stamp()} from the AZTLAN TE360 extraction bench. Human-executed, air-gapped.`,
    '',
  ];
  const select = frame.filter
    ? [`USE ALL.`, `SELECT IF (${frame.filter}).`, `EXECUTE.`, '']
    : [];

  const list = vars.join(' ');
  let body = [];
  switch (test.id) {
    case 'DESC':
      body = [`DESCRIPTIVES VARIABLES=${list}`, `  /STATISTICS=MEAN STDDEV MIN MAX.`];
      break;
    case 'FREQ':
      body = [`FREQUENCIES VARIABLES=${list}`, `  /BARCHART FREQ`, `  /ORDER=ANALYSIS.`];
      break;
    case 'CORR':
      body = [`CORRELATIONS`, `  /VARIABLES=${list}`, `  /PRINT=TWOTAIL NOSIG`, `  /MISSING=PAIRWISE.`];
      break;
    case 'REG':
      body = [
        `REGRESSION`,
        `  /STATISTICS COEFF OUTS R ANOVA COLLIN TOL`,
        `  /DEPENDENT ${dv}`,
        `  /METHOD=ENTER ${list}`,
        `  /RESIDUALS NORMPROB(ZRESID).`,
      ];
      break;
    case 'ANOVA':
      body = [
        `ONEWAY ${dv} BY ${factor}`,
        `  /STATISTICS DESCRIPTIVES HOMOGENEITY`,
        `  /PLOT MEANS`,
        `  /POSTHOC=TUKEY ALPHA(0.05).`,
      ];
      break;
    case 'TTEST':
      body = [`T-TEST GROUPS=${factor}`, `  /VARIABLES=${dv}`, `  /CRITERIA=CI(.95).`];
      break;
    case 'RELY':
      body = [`RELIABILITY`, `  /VARIABLES=${list}`, `  /SCALE('TE360 Components') ALL`, `  /STATISTICS=DESCRIPTIVE CORR`, `  /SUMMARY=TOTAL.`];
      break;
    case 'FACT':
      body = [
        `FACTOR`,
        `  /VARIABLES ${list}`,
        `  /PRINT INITIAL KMO EXTRACTION ROTATION`,
        `  /PLOT EIGEN`,
        `  /EXTRACTION PC`,
        `  /ROTATION VARIMAX.`,
      ];
      break;
    default:
      body = ['* No syntax defined for this test.'];
  }
  return [...header, ...select, ...body, '', `* Imaging: ${test.graph}.`].join('\n');
}

export function downloadSyntax(syntax, reqId) {
  const url = URL.createObjectURL(new Blob([syntax], { type: 'text/plain' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${reqId}.sps`;
  link.click();
  URL.revokeObjectURL(url);
}

/** The signed request form that travels with the syntax. */
export function downloadRequestForm({ test, frame, dv, factor, vars, reqId, syntax, caseCount }) {
  downloadWorkbook(`${reqId}_Request_Form.xls`, [
    {
      name: 'Request',
      headers: ['Field', 'Value'],
      rows: [
        ['Request ID', reqId],
        ['Test', `${test.name} (${test.id})`],
        ['Family', test.family],
        ['Purpose', test.purpose],
        ['Sampling frame', frame.label],
        ['Frame filter', frame.filter || 'None — full frame'],
        ['Cases in extract', String(caseCount)],
        ['Dependent variable', dv || 'n/a'],
        ['Grouping factor', factor || 'n/a'],
        ['Variables', vars.join(', ')],
        ['Planned imaging', test.graph],
        ['Generated', stamp()],
        ['Analysis environment', 'IBM SPSS Statistics — external, air-gapped'],
      ],
    },
    {
      name: 'Assumptions',
      headers: ['Assumption', 'Checked', 'Analyst note'],
      rows: test.assumptions.map((a) => [a, '', '']),
    },
    {
      name: 'Attestation',
      headers: ['Field', 'Value'],
      rows: [
        ['Analyst name', ''],
        ['Run date', ''],
        ['SPSS version', ''],
        ['Dataset file', ''],
        ['Output file', ''],
        ['Signature', ''],
        ['Status', 'UNSIGNED — output not quotable until signed'],
      ],
    },
    { name: 'Syntax', headers: ['Line'], rows: syntax.split('\n').map((l) => [l]) },
  ]);
}