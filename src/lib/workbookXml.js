// Shared SpreadsheetML writer. Sheets are { name, headers, rows? } — rows are arrays of
// cell values in header order. Used by both the blank template vault and populated exports.

const escapeXml = (v) =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const cell = (v, style) =>
  `<Cell${style ? ` ss:StyleID="${style}"` : ''}><Data ss:Type="String">${escapeXml(v)}</Data></Cell>`;

export function downloadWorkbook(fileName, sheets) {
  const worksheets = sheets
    .map(({ name, headers, rows = [] }) => {
      const headerRow = `<Row>${headers.map((h) => cell(h, 'header')).join('')}</Row>`;
      const dataRows = rows.map((r) => `<Row>${headers.map((_, i) => cell(r[i])).join('')}</Row>`).join('');
      return `\n    <Worksheet ss:Name="${escapeXml(name)}">\n      <Table>${headerRow}${dataRows}</Table>\n    </Worksheet>`;
    })
    .join('');
  const workbook = `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n  <Styles>\n    <Style ss:ID="header"><Font ss:Bold="1"/><Interior ss:Color="#E6B64A" ss:Pattern="Solid"/></Style>\n  </Styles>${worksheets}\n</Workbook>`;
  const url = URL.createObjectURL(new Blob([workbook], { type: 'application/vnd.ms-excel' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}