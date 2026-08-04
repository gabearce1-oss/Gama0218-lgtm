import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SPREADSHEET_ID = '1aFIQsHE9zZSXbBcpT4wdSUI9Gr5QlYVQLVfNq8VAvBg';
const SHEET_GID = 542844321; // QUARANTINE_LOG sheet

const FIELD_MAP = {
  'quarantine id': 'quarantine_id', 'quarantine_id': 'quarantine_id', 'id': 'quarantine_id', 'q id': 'quarantine_id',
  'item name': 'item_name', 'item_name': 'item_name', 'name': 'item_name', 'title': 'item_name',
  'item type': 'item_type', 'item_type': 'item_type', 'type': 'item_type',
  'source location': 'source_location', 'source_location': 'source_location', 'source': 'source_location', 'location': 'source_location',
  'date added': 'date_added', 'date_added': 'date_added', 'date': 'date_added', 'added': 'date_added',
  'submitted by': 'submitted_by', 'submitted_by': 'submitted_by', 'submitter': 'submitted_by', 'author': 'submitted_by',
  'reason for quarantine': 'reason_for_quarantine', 'reason_for_quarantine': 'reason_for_quarantine', 'reason': 'reason_for_quarantine',
  'affected systems': 'affected_systems', 'affected_systems': 'affected_systems', 'systems': 'affected_systems',
  'risk level': 'risk_level', 'risk_level': 'risk_level', 'risk': 'risk_level', 'severity': 'risk_level',
  'claim status': 'claim_status', 'claim_status': 'claim_status',
  'validation required': 'validation_required', 'validation_required': 'validation_required', 'validation': 'validation_required',
  'review owner': 'review_owner', 'review_owner': 'review_owner', 'owner': 'review_owner',
  'review status': 'review_status', 'review_status': 'review_status',
  'release decision': 'release_decision', 'release_decision': 'release_decision',
  'release date': 'release_date', 'release_date': 'release_date',
  'notes': 'notes', 'note': 'notes', 'comments': 'notes', 'comment': 'notes',
};

const ENUM_FIELDS = {
  item_type: ['Formula', 'Prompt', 'Claim', 'Citation', 'Dataset', 'Manuscript Passage', 'Scoring Rule', 'Automation Rule', 'External Source', 'Unknown'],
  risk_level: ['Low', 'Medium', 'High', 'Critical'],
  claim_status: ['Unreviewed', 'Unverified', 'Internally Plausible', 'Externally Supported', 'Verified', 'Rejected', 'Literary Only'],
  review_status: ['Not Started', 'In Review', 'Needs Evidence', 'Needs Revision', 'Needs Reconciliation', 'Approved for Staging', 'Rejected', 'Archived'],
  release_decision: ['Remain Quarantined', 'Move to Staging', 'Move to Canonical', 'Reject', 'Archive Only'],
};

function normalizeHeader(h) {
  return String(h).trim().toLowerCase().replace(/\n/g, ' ').replace(/\s+/g, ' ').replace(/^"|"$/g, '');
}

function matchEnum(field, rawValue) {
  const options = ENUM_FIELDS[field];
  if (!options) return rawValue;
  const v = String(rawValue).trim();
  // Try exact match first (case-insensitive)
  const exact = options.find(o => o.toLowerCase() === v.toLowerCase());
  if (exact) return exact;
  // Convert underscore/uppercase to title case (e.g. NEEDS_REVISION → Needs Revision)
  const titleCased = v.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  const titleMatch = options.find(o => o.toLowerCase() === titleCased.toLowerCase());
  if (titleMatch) return titleMatch;
  // Try partial match on both raw and title-cased
  const partial = options.find(o => o.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(o.toLowerCase()) || o.toLowerCase().includes(titleCased.toLowerCase()) || titleCased.toLowerCase().includes(o.toLowerCase()));
  if (partial) return partial;
  return titleCased;
}

function mapRowToQuarantineLog(headers, row) {
  const update = {};
  let hasQuarantineId = false;

  headers.forEach((header, i) => {
    const field = FIELD_MAP[normalizeHeader(header)];
    const rawValue = String(row[i] || '').trim();
    if (!field || !rawValue) return;

    if (field === 'quarantine_id') {
      update[field] = rawValue;
      hasQuarantineId = true;
    } else if (ENUM_FIELDS[field]) {
      update[field] = matchEnum(field, rawValue);
    } else {
      update[field] = rawValue;
    }
  });

  if (!hasQuarantineId || !update.item_name) return null;
  return update;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Check auto-sync setting (manual calls can bypass with force: true)
    const qSettings = await base44.asServiceRole.entities.SyncSettings.filter({ setting_key: 'quarantine_log_sync' });
    if (qSettings.length > 0 && !qSettings[0].enabled) {
      let force = false;
      try { const b = await req.clone().json(); force = b.force === true; } catch {}
      if (!force) {
        return Response.json({ status: 'sync_disabled', message: 'Quarantine Log auto-sync is disabled.' });
      }
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // 1. Get sheet titles + gids to find the right sheet
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

    // 2. Read values from the target sheet
    const range = encodeURIComponent(`${sheetTitle}!A1:Z500`);
    const valuesRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`,
      { headers: authHeader }
    );
    if (!valuesRes.ok) {
      const errText = await valuesRes.text();
      return Response.json({ error: `Values API error (${valuesRes.status}): ${errText.substring(0, 200)}` }, { status: 502 });
    }

    const valuesData = await valuesRes.json();
    const rows = valuesData.values || [];
    if (rows.length < 2) {
      return Response.json({ status: 'no_data', message: 'Sheet has no data rows' });
    }

    // 3. Find header row (first row with most recognized columns)
    let bestHeaders = null;
    let bestDataRows = null;
    let bestMatchCount = 0;

    for (let h = 0; h < Math.min(rows.length, 5); h++) {
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

    // 4. Map rows to QuarantineLog entries
    const newRecords = [];
    for (const row of bestDataRows) {
      const mapped = mapRowToQuarantineLog(bestHeaders, row);
      if (mapped) newRecords.push(mapped);
    }

    if (newRecords.length === 0) {
      return Response.json({ status: 'no_valid_rows', message: 'No rows with required quarantine_id + item_name' });
    }

    // 5. Fetch existing QuarantineLog records to determine upsert vs create
    const existing = await base44.asServiceRole.entities.QuarantineLog.list('-created_date', 500);
    const existingMap = {};
    existing.forEach(r => { if (r.quarantine_id) existingMap[r.quarantine_id] = r; });

    const toCreate = [];
    const toUpdate = [];
    let skipped = 0;

    for (const record of newRecords) {
      const existingRecord = existingMap[record.quarantine_id];
      if (existingRecord) {
        toUpdate.push({ id: existingRecord.id, ...record });
      } else {
        toCreate.push(record);
      }
    }

    // 6. Execute bulk operations
    let created = 0, updated = 0;
    if (toCreate.length > 0) {
      // bulkCreate in batches of 100
      for (let i = 0; i < toCreate.length; i += 100) {
        const batch = toCreate.slice(i, i + 100);
        await base44.asServiceRole.entities.QuarantineLog.bulkCreate(batch);
        created += batch.length;
      }
    }
    if (toUpdate.length > 0) {
      for (let i = 0; i < toUpdate.length; i += 100) {
        const batch = toUpdate.slice(i, i + 100);
        await base44.asServiceRole.entities.QuarantineLog.bulkUpdate(batch);
        updated += batch.length;
      }
    }

    // 7. Log the sync
    await base44.asServiceRole.entities.SyncLog.create({
      source: 'googlesheets',
      file_name: `${sheetTitle} (gid:${SHEET_GID})`,
      chapters_updated: created + updated,
      chapters_skipped: skipped,
      status: 'success',
    });

    return Response.json({
      status: 'synced',
      sheet: sheetTitle,
      rows_read: newRecords.length,
      created,
      updated,
      total: created + updated,
    });
  } catch (error) {
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'googlesheets',
        status: 'error',
        error_message: error.message,
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});