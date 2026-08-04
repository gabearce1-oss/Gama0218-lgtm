import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Push half of the two-way Workbook Ledger sync: writes Chapter entity data OUT to a
// dedicated WORKBOOK_LEDGER tab. The pull half (Sheets -> app) is googledriveSyncWorkbooks.
const SPREADSHEET_ID = '1aFIQsHE9zZSXbBcpT4wdSUI9Gr5QlYVQLVfNq8VAvBg';
const SHEET_TITLE = 'WORKBOOK_LEDGER';

const HEADERS = [
  'Chapter #', 'Title', 'Act', 'Word Count', 'CS% Density', 'Span. Tokens',
  'Sensory Present', 'Sensory Total', 'CLS Est', 'BIS Est', 'SII Est', 'MRF Est',
  'Omega Est', 'Audit Omega', 'Risk', 'Triage', 'Status', 'Priority Action',
];

// Maps a Chapter record to a row in the header order above.
function chapterToRow(c) {
  const v = (x) => (x == null ? '' : String(x));
  return [
    v(c.chapter_number), v(c.title), v(c.act), v(c.word_count), v(c.cs_pct),
    v(c.spanish_tokens), v(c.sensory_present), v(c.sensory_total), v(c.cls_est),
    v(c.bis_est), v(c.sii_est), v(c.mrf_est), v(c.omega_est), v(c.omega_audit),
    v(c.risk), v(c.triage), v(c.status), v(c.priority_action),
  ];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Honor the enable toggle (manual calls bypass with force: true)
    const settings = await base44.asServiceRole.entities.SyncSettings.filter({ setting_key: 'workbook_ledger_sync' });
    if (settings.length > 0 && !settings[0].enabled) {
      let force = false;
      try { const b = await req.clone().json(); force = b.force === true; } catch {}
      if (!force) {
        return Response.json({ status: 'sync_disabled', message: 'Workbook Ledger auto-sync is disabled.' });
      }
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // 1. Ensure the WORKBOOK_LEDGER tab exists
    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties(sheetId,title)`,
      { headers: authHeader }
    );
    if (!metaRes.ok) {
      const errText = await metaRes.text();
      return Response.json({ error: `Sheets API error (${metaRes.status}): ${errText.substring(0, 200)}` }, { status: 502 });
    }
    const metaData = await metaRes.json();
    const targetSheet = (metaData.sheets || []).find(s => s.properties.title === SHEET_TITLE);
    if (!targetSheet) {
      const createRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
        {
          method: 'POST',
          headers: authHeader,
          body: JSON.stringify({
            requests: [{ addSheet: { properties: { title: SHEET_TITLE, gridProperties: { rowCount: 1000, columnCount: 26 } } } }]
          })
        }
      );
      if (!createRes.ok) {
        const errText = await createRes.text();
        return Response.json({ error: `Failed to create sheet tab: ${errText.substring(0, 200)}` }, { status: 502 });
      }
    }

    // 2. Fetch all chapters
    const chapters = await base44.asServiceRole.entities.Chapter.list('chapter_number', 500);
    chapters.sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0));

    // 3. Build values (header + rows)
    const values = [HEADERS, ...chapters.map(chapterToRow)];

    // 4. Clear then write
    const clearRange = encodeURIComponent(`${SHEET_TITLE}!A1:Z1000`);
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${clearRange}:clear`,
      { method: 'POST', headers: authHeader }
    );

    const writeRange = encodeURIComponent(`${SHEET_TITLE}!A1`);
    const writeRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${writeRange}?valueInputOption=RAW`,
      { method: 'PUT', headers: authHeader, body: JSON.stringify({ values }) }
    );
    if (!writeRes.ok) {
      const errText = await writeRes.text();
      return Response.json({ error: `Write API error (${writeRes.status}): ${errText.substring(0, 200)}` }, { status: 502 });
    }
    const writeData = await writeRes.json();

    // 5. Update settings + log
    const settingRecords = await base44.asServiceRole.entities.SyncSettings.filter({ setting_key: 'workbook_ledger_sync' });
    if (settingRecords.length > 0) {
      await base44.asServiceRole.entities.SyncSettings.update(settingRecords[0].id, {
        last_synced: new Date().toISOString(),
        last_sync_status: 'success',
        last_sync_summary: `${chapters.length} chapters exported to sheet`,
      });
    }
    await base44.asServiceRole.entities.SyncLog.create({
      source: 'googlesheets_export',
      file_name: SHEET_TITLE,
      chapters_updated: chapters.length,
      chapters_skipped: 0,
      status: 'success',
    });

    return Response.json({
      status: 'synced',
      sheet: SHEET_TITLE,
      rows_written: chapters.length,
      updated_cells: writeData.updatedCells || 0,
    });
  } catch (error) {
    try {
      const base44 = createClientFromRequest(req);
      const settingRecords = await base44.asServiceRole.entities.SyncSettings.filter({ setting_key: 'workbook_ledger_sync' });
      if (settingRecords.length > 0) {
        await base44.asServiceRole.entities.SyncSettings.update(settingRecords[0].id, {
          last_synced: new Date().toISOString(),
          last_sync_status: 'error',
          last_sync_summary: error.message.substring(0, 200),
        });
      }
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'googlesheets_export', file_name: SHEET_TITLE, status: 'error', error_message: error.message,
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});