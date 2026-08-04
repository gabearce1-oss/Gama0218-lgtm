import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Pull half of the two-way Restoration Drafts sync: reads edits made in the
// RESTORATION_DRAFTS tab back INTO RestorationDraft entities. The push half
// (app -> Sheets) is syncRestorationDraftsToSheets.
const SPREADSHEET_ID = '1aFIQsHE9zZSXbBcpT4wdSUI9Gr5QlYVQLVfNq8VAvBg';
const SHEET_TITLE = 'RESTORATION_DRAFTS';

const FIELD_MAP = {
  'chapter #': 'chapter_number', 'chapter': 'chapter_number', 'ch': 'chapter_number', 'chapter_number': 'chapter_number',
  'chapter title': 'chapter_title', 'title': 'chapter_title', 'chapter_title': 'chapter_title',
  'original ω': 'original_omega', 'original omega': 'original_omega', 'original_omega': 'original_omega',
  'cooked ω': 'cooked_omega', 'cooked omega': 'cooked_omega', 'cooked_omega': 'cooked_omega',
  'original cls': 'original_cls', 'original_cls': 'original_cls',
  'cooked cls': 'cooked_cls', 'cooked_cls': 'cooked_cls',
  'original bis': 'original_bis', 'original_bis': 'original_bis',
  'cooked bis': 'cooked_bis', 'cooked_bis': 'cooked_bis',
  'original sii': 'original_sii', 'original_sii': 'original_sii',
  'cooked sii': 'cooked_sii', 'cooked_sii': 'cooked_sii',
  'original mrf': 'original_mrf', 'original_mrf': 'original_mrf',
  'cooked mrf': 'cooked_mrf', 'cooked_mrf': 'cooked_mrf',
  'approved passages': 'approved_passages', 'approved_passages': 'approved_passages',
  'status': 'status',
  'llm reasoning': 'llm_reasoning', 'llm_reasoning': 'llm_reasoning',
};

const NUMERIC_FIELDS = new Set([
  'chapter_number', 'original_omega', 'cooked_omega', 'original_cls', 'cooked_cls',
  'original_bis', 'cooked_bis', 'original_sii', 'cooked_sii', 'original_mrf',
  'cooked_mrf', 'approved_passages',
]);
const STATUS_OPTIONS = ['draft', 'published', 'rejected'];

function normalizeHeader(h) {
  return String(h).trim().toLowerCase().replace(/\n/g, ' ').replace(/\s+/g, ' ').replace(/^"|"$/g, '').replace(/^δ\s*/, 'delta ');
}

function mapRow(headers, row) {
  const update = {};
  let chapterNumber = null;
  headers.forEach((header, i) => {
    const field = FIELD_MAP[normalizeHeader(header)];
    const raw = String(row[i] || '').trim();
    if (!field || !raw) return;
    if (field === 'chapter_number') {
      const n = parseInt(raw.replace(/,/g, ''));
      if (!isNaN(n)) chapterNumber = n;
    } else if (NUMERIC_FIELDS.has(field)) {
      const n = parseFloat(raw.replace(/,/g, ''));
      if (!isNaN(n)) update[field] = n;
    } else if (field === 'status') {
      const match = STATUS_OPTIONS.find(o => o === raw.toLowerCase());
      if (match) update.status = match;
    } else {
      update[field] = raw;
    }
  });
  if (chapterNumber == null) return null;
  update.chapter_number = chapterNumber;
  return update;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Honor the enable toggle (manual calls bypass with force: true)
    const settings = await base44.asServiceRole.entities.SyncSettings.filter({ setting_key: 'restoration_drafts_sync' });
    if (settings.length > 0 && !settings[0].enabled) {
      let force = false;
      try { const b = await req.clone().json(); force = b.force === true; } catch {}
      if (!force) {
        return Response.json({ status: 'sync_disabled', message: 'Restoration Drafts auto-sync is disabled.' });
      }
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // 1. Confirm the tab exists
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
      return Response.json({ status: 'no_sheet', message: `${SHEET_TITLE} tab not found — export first.` });
    }

    // 2. Read values
    const range = encodeURIComponent(`${SHEET_TITLE}!A1:Z5000`);
    const valuesRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`,
      { headers: authHeader }
    );
    if (!valuesRes.ok) {
      const errText = await valuesRes.text();
      return Response.json({ error: `Values API error (${valuesRes.status}): ${errText.substring(0, 200)}` }, { status: 502 });
    }
    const rows = (await valuesRes.json()).values || [];
    if (rows.length < 2) {
      return Response.json({ status: 'no_data', message: 'Sheet has no data rows' });
    }

    // 3. Find header row
    let bestHeaders = null, bestDataRows = null, bestMatchCount = 0;
    for (let h = 0; h < Math.min(rows.length, 3); h++) {
      const headerRow = rows[h].map(c => String(c).trim());
      const matchCount = headerRow.filter(x => FIELD_MAP[normalizeHeader(x)]).length;
      if (matchCount > bestMatchCount) {
        bestMatchCount = matchCount;
        bestHeaders = headerRow;
        bestDataRows = rows.slice(h + 1);
      }
    }
    if (!bestDataRows || bestMatchCount === 0) {
      return Response.json({ error: 'No recognizable headers in sheet' }, { status: 422 });
    }

    // 4. Map rows keyed by chapter_number
    const parsed = [];
    for (const row of bestDataRows) {
      const mapped = mapRow(bestHeaders, row);
      if (mapped) parsed.push(mapped);
    }
    if (parsed.length === 0) {
      return Response.json({ status: 'no_valid_rows', message: 'No rows with a chapter number' });
    }

    // 5. Upsert by chapter_number
    const existing = await base44.asServiceRole.entities.RestorationDraft.list('-chapter_number', 500);
    const existingMap = {};
    existing.forEach(r => { if (r.chapter_number != null) existingMap[r.chapter_number] = r; });

    const toCreate = [], toUpdate = [];
    for (const record of parsed) {
      const match = existingMap[record.chapter_number];
      if (match) toUpdate.push({ id: match.id, ...record });
      else toCreate.push(record);
    }

    let created = 0, updated = 0;
    for (let i = 0; i < toCreate.length; i += 100) {
      const batch = toCreate.slice(i, i + 100);
      if (batch.length > 0) { await base44.asServiceRole.entities.RestorationDraft.bulkCreate(batch); created += batch.length; }
    }
    for (let i = 0; i < toUpdate.length; i += 100) {
      const batch = toUpdate.slice(i, i + 100);
      if (batch.length > 0) { await base44.asServiceRole.entities.RestorationDraft.bulkUpdate(batch); updated += batch.length; }
    }

    await base44.asServiceRole.entities.SyncLog.create({
      source: 'googlesheets',
      file_name: SHEET_TITLE,
      chapters_updated: created + updated,
      chapters_skipped: 0,
      status: 'success',
    });

    return Response.json({ status: 'synced', sheet: SHEET_TITLE, rows_read: parsed.length, created, updated, total: created + updated });
  } catch (error) {
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'googlesheets', file_name: SHEET_TITLE, status: 'error', error_message: error.message,
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});