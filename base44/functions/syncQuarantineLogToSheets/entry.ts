import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SPREADSHEET_ID = '1aFIQsHE9zZSXbBcpT4wdSUI9Gr5QlYVQLVfNq8VAvBg';
const SHEET_GID = 542844321; // QUARANTINE_LOG sheet

const HEADERS = [
  'Quarantine ID', 'Item Name', 'Item Type', 'Source Location', 'Date Added',
  'Submitted By', 'Reason for Quarantine', 'Affected Systems', 'Risk Level',
  'Claim Status', 'Validation Required', 'Review Owner', 'Review Status',
  'Release Decision', 'Release Date', 'Notes'
];

function escapeValue(v) {
  if (v == null) return '';
  if (typeof v === 'string' && v.match(/^\d{4}-\d{2}-\d{2}T/)) {
    try { return new Date(v).toLocaleDateString('en-US'); } catch { return v; }
  }
  return String(v);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Automation-triggered runs have no user context; user-initiated runs still resolve a user.
    let user = null;
    try { user = await base44.auth.me(); } catch { user = null; }

    // Check auto-sync setting (manual calls can bypass with force: true)
    const qSettings = await base44.asServiceRole.entities.SyncSettings.filter({ setting_key: 'quarantine_log_sync' });
    if (qSettings.length > 0 && !qSettings[0].enabled) {
      let force = false;
      try { const b = await req.clone().json(); force = b.force === true; } catch {}
      if (!force) {
        return Response.json({ status: 'sync_disabled', message: 'Quarantine Log auto-sync is disabled. Enable it in Cloud Integrations settings.' });
      }
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // 1. Resolve sheet title from gid
    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties(sheetId,title)`,
      { headers: authHeader }
    );
    if (!metaRes.ok) {
      const errText = await metaRes.text();
      return Response.json({ error: `Sheets API error (${metaRes.status}): ${errText.substring(0, 200)}` }, { status: 502 });
    }
    const metaData = await metaRes.json();
    const sheets = metaData.sheets || [];
    const targetSheet = sheets.find(s => s.properties.sheetId === SHEET_GID);
    if (!targetSheet) {
      return Response.json({ error: `Sheet with gid ${SHEET_GID} not found` }, { status: 404 });
    }
    const sheetTitle = targetSheet.properties.title;

    // 2. Fetch all QuarantineLog records (paginated)
    const allRecords = [];
    let skip = 0;
    const limit = 500;
    let hasMore = true;
    while (hasMore) {
      const batch = await base44.asServiceRole.entities.QuarantineLog.list('-created_date', limit, skip);
      allRecords.push(...batch);
      hasMore = batch.length === limit;
      skip += limit;
    }

    // 3. Build values array (header + data rows)
    const values = [HEADERS];
    for (const r of allRecords) {
      values.push([
        escapeValue(r.quarantine_id),
        escapeValue(r.item_name),
        escapeValue(r.item_type),
        escapeValue(r.source_location),
        escapeValue(r.date_added),
        escapeValue(r.submitted_by),
        escapeValue(r.reason_for_quarantine),
        escapeValue(r.affected_systems),
        escapeValue(r.risk_level),
        escapeValue(r.claim_status),
        escapeValue(r.validation_required),
        escapeValue(r.review_owner),
        escapeValue(r.review_status),
        escapeValue(r.release_decision),
        escapeValue(r.release_date),
        escapeValue(r.notes),
      ]);
    }

    // 4. Clear existing data range (A1:Z5000) then write new values
    const clearRange = encodeURIComponent(`${sheetTitle}!A1:Z5000`);
    const clearRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${clearRange}:clear`,
      { method: 'POST', headers: authHeader }
    );
    if (!clearRes.ok) {
      const errText = await clearRes.text();
      return Response.json({ error: `Clear API error (${clearRes.status}): ${errText.substring(0, 200)}` }, { status: 502 });
    }

    // 5. Write new values
    const writeRange = encodeURIComponent(`${sheetTitle}!A1`);
    const writeRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${writeRange}?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify({ values })
      }
    );
    if (!writeRes.ok) {
      const errText = await writeRes.text();
      return Response.json({ error: `Write API error (${writeRes.status}): ${errText.substring(0, 200)}` }, { status: 502 });
    }

    const writeData = await writeRes.json();

    // 6. Log the sync
    await base44.asServiceRole.entities.SyncLog.create({
      source: 'googlesheets_export',
      file_name: `${sheetTitle} (gid:${SHEET_GID})`,
      chapters_updated: allRecords.length,
      chapters_skipped: 0,
      status: 'success',
    });

    return Response.json({
      status: 'synced',
      sheet: sheetTitle,
      rows_written: allRecords.length,
      updated_cells: writeData.updatedCells || 0,
    });
  } catch (error) {
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'googlesheets_export',
        status: 'error',
        error_message: error.message,
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});