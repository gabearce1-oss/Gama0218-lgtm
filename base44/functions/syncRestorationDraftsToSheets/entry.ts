import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SPREADSHEET_ID = '1aFIQsHE9zZSXbBcpT4wdSUI9Gr5QlYVQLVfNq8VAvBg';
const SHEET_TITLE = 'RESTORATION_DRAFTS';

const HEADERS = [
  'Chapter #', 'Chapter Title', 'Original Ω', 'Cooked Ω', 'Δ Ω',
  'Original CLS', 'Cooked CLS', 'Original BIS', 'Cooked BIS',
  'Original SII', 'Cooked SII', 'Original MRF', 'Cooked MRF',
  'Approved Passages', 'Status', 'Cooked Date', 'LLM Reasoning'
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
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Check auto-sync setting (manual calls can bypass with force: true)
    const settings = await base44.asServiceRole.entities.SyncSettings.filter({ setting_key: 'restoration_drafts_sync' });
    if (settings.length > 0 && !settings[0].enabled) {
      let force = false;
      try { const b = await req.clone().json(); force = b.force === true; } catch {}
      if (!force) {
        return Response.json({ status: 'sync_disabled', message: 'Restoration Drafts auto-sync is disabled. Enable it in Cloud Integrations settings.' });
      }
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // 1. Ensure the RESTORATION_DRAFTS sheet tab exists
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
    let targetSheet = sheets.find(s => s.properties.title === SHEET_TITLE);

    // Create the sheet tab if it doesn't exist
    if (!targetSheet) {
      const createRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
        {
          method: 'POST',
          headers: authHeader,
          body: JSON.stringify({
            requests: [{
              addSheet: { properties: { title: SHEET_TITLE, gridProperties: { rowCount: 1000, columnCount: 20 } } }
            }]
          })
        }
      );
      if (!createRes.ok) {
        const errText = await createRes.text();
        return Response.json({ error: `Failed to create sheet tab: ${errText.substring(0, 200)}` }, { status: 502 });
      }
    }

    // 2. Fetch all RestorationDraft records
    const allRecords = [];
    let skip = 0;
    const limit = 500;
    let hasMore = true;
    while (hasMore) {
      const batch = await base44.asServiceRole.entities.RestorationDraft.list('-chapter_number', limit, skip);
      allRecords.push(...batch);
      hasMore = batch.length === limit;
      skip += limit;
    }

    // Sort by chapter number
    allRecords.sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0));

    // 3. Build values array
    const values = [HEADERS];
    for (const r of allRecords) {
      const delta = (r.original_omega != null && r.cooked_omega != null)
        ? Number((r.cooked_omega - r.original_omega).toFixed(2))
        : null;
      values.push([
        escapeValue(r.chapter_number),
        escapeValue(r.chapter_title),
        escapeValue(r.original_omega),
        escapeValue(r.cooked_omega),
        escapeValue(delta),
        escapeValue(r.original_cls),
        escapeValue(r.cooked_cls),
        escapeValue(r.original_bis),
        escapeValue(r.cooked_bis),
        escapeValue(r.original_sii),
        escapeValue(r.cooked_sii),
        escapeValue(r.original_mrf),
        escapeValue(r.cooked_mrf),
        escapeValue(r.approved_passages),
        escapeValue(r.status),
        escapeValue(r.cooked_date),
        escapeValue(r.llm_reasoning),
      ]);
    }

    // 4. Clear existing data then write
    const clearRange = encodeURIComponent(`${SHEET_TITLE}!A1:Z5000`);
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${clearRange}:clear`,
      { method: 'POST', headers: authHeader }
    );

    const writeRange = encodeURIComponent(`${SHEET_TITLE}!A1`);
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

    // 5. Update sync settings
    const settingRecords = await base44.asServiceRole.entities.SyncSettings.filter({ setting_key: 'restoration_drafts_sync' });
    if (settingRecords.length > 0) {
      await base44.asServiceRole.entities.SyncSettings.update(settingRecords[0].id, {
        last_synced: new Date().toISOString(),
        last_sync_status: 'success',
        last_sync_summary: `${allRecords.length} drafts exported`,
      });
    }

    // 6. Log the sync
    await base44.asServiceRole.entities.SyncLog.create({
      source: 'googlesheets_export',
      file_name: `${SHEET_TITLE}`,
      chapters_updated: allRecords.length,
      chapters_skipped: 0,
      status: 'success',
    });

    return Response.json({
      status: 'synced',
      sheet: SHEET_TITLE,
      rows_written: allRecords.length,
      updated_cells: writeData.updatedCells || 0,
    });
  } catch (error) {
    try {
      const base44 = createClientFromRequest(req);
      const settingRecords = await base44.asServiceRole.entities.SyncSettings.filter({ setting_key: 'restoration_drafts_sync' });
      if (settingRecords.length > 0) {
        await base44.asServiceRole.entities.SyncSettings.update(settingRecords[0].id, {
          last_synced: new Date().toISOString(),
          last_sync_status: 'error',
          last_sync_summary: error.message.substring(0, 200),
        });
      }
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'googlesheets_export',
        file_name: SHEET_TITLE,
        status: 'error',
        error_message: error.message,
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});