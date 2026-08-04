import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Pushes Blocker records out to a BLOCKERS tab in the shared workbook.
// Unresolved blockers (status "active") are written in red so reviewers can spot them.
const SPREADSHEET_ID = '1aFIQsHE9zZSXbBcpT4wdSUI9Gr5QlYVQLVfNq8VAvBg';
const SHEET_TITLE = 'BLOCKERS';

const HEADERS = [
  'Blocker ID', 'Title', 'Severity', 'Gate', 'Evidence Status', 'Description',
  'Affected Chapters', 'Words at Risk', 'Status', 'Required Fix', 'Resolution', 'Source Reference',
];

function blockerToRow(b) {
  const v = (x) => (x == null ? '' : Array.isArray(x) ? x.join(', ') : String(x));
  return [
    v(b.blocker_id), v(b.title), v(b.severity), v(b.gate), v(b.evidence_status),
    v(b.description), v(b.affected_chapters), v(b.words_at_risk), v(b.status),
    v(b.required_fix), v(b.resolution), v(b.source_reference),
  ];
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // 1. Ensure the BLOCKERS tab exists and get its sheetId
    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties(sheetId,title)`,
      { headers: authHeader }
    );
    if (!metaRes.ok) {
      const errText = await metaRes.text();
      return Response.json({ error: `Sheets API error (${metaRes.status}): ${errText.substring(0, 200)}` }, { status: 502 });
    }
    const metaData = await metaRes.json();
    let target = (metaData.sheets || []).find((s) => s.properties.title === SHEET_TITLE);
    if (!target) {
      const createRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`, {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({
          requests: [{ addSheet: { properties: { title: SHEET_TITLE, gridProperties: { rowCount: 2000, columnCount: 26 } } } }],
        }),
      });
      if (!createRes.ok) {
        const errText = await createRes.text();
        return Response.json({ error: `Failed to create sheet tab: ${errText.substring(0, 200)}` }, { status: 502 });
      }
      const created = await createRes.json();
      target = { properties: created.replies[0].addSheet.properties };
    }
    const sheetId = target.properties.sheetId;

    // 2. Fetch all blockers (paginated)
    const blockers = [];
    let skip = 0;
    const limit = 500;
    let hasMore = true;
    while (hasMore) {
      const batch = await base44.asServiceRole.entities.Blocker.list('blocker_id', limit, skip);
      blockers.push(...batch);
      hasMore = batch.length === limit;
      skip += limit;
    }

    // 3. Clear then write header + rows
    const clearRange = encodeURIComponent(`${SHEET_TITLE}!A1:Z2000`);
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${clearRange}:clear`, {
      method: 'POST',
      headers: authHeader,
    });

    const values = [HEADERS, ...blockers.map(blockerToRow)];
    const writeRange = encodeURIComponent(`${SHEET_TITLE}!A1`);
    const writeRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${writeRange}?valueInputOption=RAW`,
      { method: 'PUT', headers: authHeader, body: JSON.stringify({ values }) }
    );
    if (!writeRes.ok) {
      const errText = await writeRes.text();
      return Response.json({ error: `Write API error (${writeRes.status}): ${errText.substring(0, 200)}` }, { status: 502 });
    }

    // 4. Reset formatting, then color unresolved blocker rows red
    const formatRequests = [
      {
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: values.length, startColumnIndex: 0, endColumnIndex: HEADERS.length },
          cell: { userEnteredFormat: { textFormat: { foregroundColor: { red: 0.85, green: 0.87, blue: 0.9 }, bold: false } } },
          fields: 'userEnteredFormat.textFormat',
        },
      },
      {
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: HEADERS.length },
          cell: { userEnteredFormat: { textFormat: { bold: true } } },
          fields: 'userEnteredFormat.textFormat.bold',
        },
      },
    ];
    blockers.forEach((b, i) => {
      if (b.status === 'active') {
        formatRequests.push({
          repeatCell: {
            range: { sheetId, startRowIndex: i + 1, endRowIndex: i + 2, startColumnIndex: 0, endColumnIndex: HEADERS.length },
            cell: { userEnteredFormat: { textFormat: { foregroundColor: { red: 0.8, green: 0.1, blue: 0.1 }, bold: true } } },
            fields: 'userEnteredFormat.textFormat',
          },
        });
      }
    });
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({ requests: formatRequests }),
    });

    await base44.asServiceRole.entities.SyncLog.create({
      source: 'googlesheets_export',
      file_name: SHEET_TITLE,
      chapters_updated: blockers.length,
      chapters_skipped: 0,
      status: 'success',
    });

    return Response.json({
      status: 'synced',
      sheet: SHEET_TITLE,
      rows_written: blockers.length,
      flagged_red: blockers.filter((b) => b.status === 'active').length,
    });
  } catch (error) {
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'googlesheets_export', file_name: SHEET_TITLE, status: 'error', error_message: error.message,
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
}