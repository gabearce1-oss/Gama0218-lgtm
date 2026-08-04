import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === ',' && !inQuotes) {
      result.push(current); current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = parseCSVLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = (values[i] || '').trim(); });
    return row;
  });
  return { headers, rows };
}

function normalizeHeader(h) {
  return String(h).trim().toLowerCase().replace(/\n/g, ' ').replace(/\s+/g, ' ').replace(/^"|"$/g, '');
}

const FIELD_MAP = {
  'ch#': 'chapter_number', 'chapter': 'chapter_number', 'ch': 'chapter_number', 'chapter #': 'chapter_number',
  'title': 'title',
  'act': 'act',
  'words': 'word_count', 'word count': 'word_count', 'word_count': 'word_count',
  'cs% density': 'cs_pct', 'cs%': 'cs_pct', 'cs': 'cs_pct',
  'span. tokens': 'spanish_tokens', 'span.tokens': 'spanish_tokens', 'spanish tokens': 'spanish_tokens',
  'sensory present (of 6)': 'sensory_present', 'sensory present': 'sensory_present',
  'sensory total': 'sensory_total',
  'cls est': 'cls_est', 'cls': 'cls_est',
  'bis est': 'bis_est', 'bis': 'bis_est',
  'sii est': 'sii_est', 'sii': 'sii_est',
  'mrf est': 'mrf_est', 'mrf': 'mrf_est',
  'omega est': 'omega_est', 'ω est': 'omega_est', 'omega': 'omega_est', 'ω': 'omega_est',
  'audit omega': 'omega_audit', 'ω audit': 'omega_audit',
  'risk': 'risk',
  'triage': 'triage',
  'status': 'status',
  'priority action': 'priority_action',
};

const NUMERIC_FIELDS = new Set([
  'word_count', 'cs_pct', 'spanish_tokens', 'sensory_present', 'sensory_total',
  'cls_est', 'bis_est', 'sii_est', 'mrf_est', 'omega_est', 'omega_audit',
]);

const STRING_FIELDS = new Set(['title', 'act', 'risk', 'triage', 'status', 'priority_action']);

function mapRowToChapterUpdate(row, chapterMap) {
  let chapterNumber = null;
  const update = {};
  for (const [header, rawValue] of Object.entries(row)) {
    const field = FIELD_MAP[normalizeHeader(header)];
    if (!field || !rawValue) continue;
    if (field === 'chapter_number') {
      const n = parseInt(rawValue.replace(/,/g, ''));
      if (n) chapterNumber = n;
    } else if (STRING_FIELDS.has(field)) {
      update[field] = rawValue;
    } else if (NUMERIC_FIELDS.has(field)) {
      const n = parseFloat(rawValue.replace(/,/g, ''));
      if (!isNaN(n)) update[field] = n;
    }
  }
  if (!chapterNumber || !chapterMap[chapterNumber]) return null;
  update.id = chapterMap[chapterNumber].id;
  return update;
}

async function syncFileFromDrive(base44, accessToken, fileId, fileName) {
  // 1. Get all sheet names via the Sheets API (CSV export only gets the first sheet)
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${fileId}?fields=sheets.properties.title`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!metaRes.ok) {
    const errText = await metaRes.text();
    await base44.asServiceRole.entities.SyncLog.create({
      source: 'googledrive', file_name: fileName, status: 'error',
      error_message: `Sheets API error (${metaRes.status}): ${errText.substring(0, 200)}`,
    });
    return { updated: 0, skipped: 0, error: `Sheets API error: ${metaRes.status}` };
  }

  const metaData = await metaRes.json();
  const sheetTitles = (metaData.sheets || []).map(s => s.properties.title);
  if (sheetTitles.length === 0) {
    return { updated: 0, skipped: 0, error: 'No sheets found in workbook' };
  }

  // 2. Batch-get values from all sheets (first 200 rows, A–Z)
  const rangesQuery = sheetTitles.map(t => `ranges=${encodeURIComponent(`${t}!A1:Z200`)}`).join('&');
  const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values:batchGet?${rangesQuery}`;
  const batchRes = await fetch(batchUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!batchRes.ok) {
    return { updated: 0, skipped: 0, error: `Batch get failed: ${batchRes.status}` };
  }

  const batchData = await batchRes.json();
  const valueRanges = batchData.valueRanges || [];

  // 3. Find the sheet whose header row matches the most known columns
  let bestHeaders = null;
  let bestDataRows = null;
  let bestMatchCount = 0;

  for (const vr of valueRanges) {
    const rows = vr.values || [];
    if (rows.length < 2) continue;
    // Check the first 5 rows for a header match (data may be below a title row)
    for (let h = 0; h < Math.min(rows.length, 5); h++) {
      const headerRow = rows[h];
      const headers = headerRow.map(c => String(c).trim());
      const matchCount = headers.filter(x => FIELD_MAP[normalizeHeader(x)]).length;
      if (matchCount > bestMatchCount) {
        bestMatchCount = matchCount;
        bestHeaders = headers;
        bestDataRows = rows.slice(h + 1);
      }
    }
  }

  if (!bestDataRows || bestMatchCount === 0) {
    await base44.asServiceRole.entities.SyncLog.create({
      source: 'googledrive', file_name: fileName, status: 'error',
      error_message: `No sheet with recognizable chapter headers in ${fileName}`,
    });
    return { updated: 0, skipped: 0, error: 'No recognizable headers' };
  }

  // 4. Convert 2D rows to header-keyed objects and sync
  const rows = bestDataRows.map(row => {
    const obj = {};
    bestHeaders.forEach((header, i) => { obj[header] = String(row[i] || '').trim(); });
    return obj;
  });

  const chapters = await base44.asServiceRole.entities.Chapter.list();
  const chapterMap = {};
  chapters.forEach(c => { chapterMap[c.chapter_number] = c; });

  let updated = 0, skipped = 0;
  const updates = [];
  for (const row of rows) {
    const u = mapRowToChapterUpdate(row, chapterMap);
    if (!u) { skipped++; continue; }
    updates.push(u);
    updated++;
  }

  if (updates.length > 0) {
    await base44.asServiceRole.entities.Chapter.bulkUpdate(updates);
  }

  await base44.asServiceRole.entities.SyncLog.create({
    source: 'googledrive',
    file_name: fileName,
    chapters_updated: updated,
    chapters_skipped: skipped,
    status: 'success',
  });

  return { updated, skipped };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Check auto-sync setting (manual calls can bypass with force: true; webhooks always pass)
    const wbSettings = await base44.asServiceRole.entities.SyncSettings.filter({ setting_key: 'workbook_ledger_sync' });
    if (wbSettings.length > 0 && !wbSettings[0].enabled) {
      let force = false;
      try { const b = await req.clone().json(); force = b.force === true; } catch {}
      if (!force) {
        return Response.json({ status: 'sync_disabled', message: 'Workbook Ledger auto-sync is disabled.' });
      }
    }

    // Check if this is a webhook-triggered call
    let body = {};
    try { body = await req.json(); } catch {}
    const providerMeta = body?.data?._provider_meta;

    if (providerMeta) {
      const state = providerMeta['x-goog-resource-state'];
      if (state === 'sync') return Response.json({ status: 'sync_ack' });

      // Incremental sync using the Changes API
      const existing = await base44.asServiceRole.entities.SyncState.list();
      let syncRecord = existing.length > 0 ? existing[0] : null;

      if (!syncRecord) {
        const tokenRes = await fetch(
          'https://www.googleapis.com/drive/v3/changes/startPageToken',
          { headers: authHeader }
        );
        const { startPageToken } = await tokenRes.json();
        await base44.asServiceRole.entities.SyncState.create({ page_token: startPageToken });
        return Response.json({ status: 'initialized' });
      }

      const baseUrl = `https://www.googleapis.com/drive/v3/changes?fields=changes(file(id,name,mimeType,modifiedTime)),newStartPageToken,nextPageToken`;
      let changesUrl = baseUrl + `&pageToken=${syncRecord.page_token}`;
      const allChanges = [];
      let newPageToken = null;

      while (changesUrl) {
        const changesRes = await fetch(changesUrl, { headers: authHeader });
        if (!changesRes.ok) break;
        const page = await changesRes.json();
        allChanges.push(...(page.changes || []));
        if (page.newStartPageToken) newPageToken = page.newStartPageToken;
        changesUrl = page.nextPageToken ? baseUrl + `&pageToken=${page.nextPageToken}` : null;
      }

      const SPREADSHEET_TYPES = new Set([
        'application/vnd.google-apps.spreadsheet',
        'text/csv',
      ]);
      const workbookChanges = allChanges.filter(c =>
        c.file && SPREADSHEET_TYPES.has(c.file.mimeType) &&
        (c.file.name.includes('Ramos') || c.file.name.includes('OMEGA') ||
         c.file.name.includes('workbook') || c.file.name.includes('Workbook') ||
         c.file.name.includes('SPSS') || c.file.name.includes('audit') || c.file.name.includes('Audit'))
      );

      const results = [];
      for (const change of workbookChanges) {
        const result = await syncFileFromDrive(base44, accessToken, change.file.id, change.file.name);
        results.push({ file: change.file.name, ...result });
      }

      if (newPageToken) {
        await base44.asServiceRole.entities.SyncState.update(syncRecord.id, { page_token: newPageToken });
      }

      return Response.json({
        status: 'synced',
        trigger: 'webhook',
        files_processed: results.length,
        results,
      });
    }

    // Manual call — find and sync the latest workbook
    const query = encodeURIComponent(
      "(mimeType='application/vnd.google-apps.spreadsheet' or mimeType='text/csv') and trashed=false and (name contains 'Ramos' or name contains 'OMEGA' or name contains 'workbook' or name contains 'Workbook' or name contains 'SPSS' or name contains 'audit' or name contains 'Audit')"
    );
    const url = `https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,mimeType,modifiedTime,size,webViewLink)&q=${query}&orderBy=modifiedTime desc`;

    const driveRes = await fetch(url, { headers: authHeader });
    if (!driveRes.ok) {
      const errText = await driveRes.text();
      return Response.json({ error: `Drive API error: ${errText}` }, { status: driveRes.status });
    }

    const driveData = await driveRes.json();
    const files = (driveData.files || []).map(f => ({
      id: f.id,
      name: f.name,
      modified: f.modifiedTime,
      link: f.webViewLink,
    }));

    if (files.length === 0) {
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'googledrive', status: 'no_files',
        error_message: 'No workbook files found on Google Drive',
      });
      return Response.json({ status: 'no_files', files: [], total: 0 });
    }

    const latest = files[0];
    const syncResult = await syncFileFromDrive(base44, accessToken, latest.id, latest.name);

    return Response.json({
      status: syncResult.error ? 'partial' : 'synced',
      trigger: 'manual',
      file: latest.name,
      modified: latest.modified,
      chapters_updated: syncResult.updated,
      chapters_skipped: syncResult.skipped,
      files,
      total: files.length,
    });
  } catch (error) {
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'googledrive', status: 'error', error_message: error.message,
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});