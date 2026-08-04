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

function normalizeHeader(h) {
  return String(h).trim().toLowerCase().replace(/\n/g, ' ').replace(/\s+/g, ' ').replace(/^"|"$/g, '');
}

const FIELD_MAP = {
  'blocker_id': 'blocker_id', 'blocker id': 'blocker_id', 'blocker': 'blocker_id', 'id': 'blocker_id',
  'title': 'title', 'name': 'title',
  'severity': 'severity', 'sev': 'severity',
  'description': 'description', 'desc': 'description', 'details': 'description',
  'omega_penalty': 'omega_penalty', 'omega penalty': 'omega_penalty', 'ω penalty': 'omega_penalty', 'penalty': 'omega_penalty',
  'affected_chapters': 'affected_chapters', 'affected chapters': 'affected_chapters', 'chapters': 'affected_chapters', 'ch': 'affected_chapters', 'affected': 'affected_chapters',
  'overlap_pct': 'overlap_pct', 'overlap %': 'overlap_pct', 'overlap': 'overlap_pct', 'overlap_pct': 'overlap_pct',
  'words_at_risk': 'words_at_risk', 'words at risk': 'words_at_risk', 'words': 'words_at_risk',
  'status': 'status',
  'resolution': 'resolution', 'fix': 'resolution',
  'beat_pacing': 'beat_pacing', 'beat pacing': 'beat_pacing', 'beat/pacing': 'beat_pacing', 'beat': 'beat_pacing',
  'flesch_reading_score': 'flesch_reading_score', 'flesch reading score': 'flesch_reading_score', 'flesch': 'flesch_reading_score', 'reading score': 'flesch_reading_score', 'flesch_reading': 'flesch_reading_score',
};

const NUMERIC_FIELDS = new Set(['omega_penalty', 'overlap_pct', 'words_at_risk', 'beat_pacing', 'flesch_reading_score']);
const STRING_FIELDS = new Set(['blocker_id', 'title', 'severity', 'description', 'status', 'resolution']);

function parseChapters(raw) {
  if (!raw) return [];
  return raw.split(/[;|]/).map(s => parseInt(s.trim())).filter(n => !isNaN(n));
}

function mapRowToBlocker(row) {
  const blocker = {};
  for (const [header, rawValue] of Object.entries(row)) {
    const field = FIELD_MAP[normalizeHeader(header)];
    if (!field || !rawValue) continue;
    if (field === 'affected_chapters') {
      const chapters = parseChapters(rawValue);
      if (chapters.length > 0) blocker.affected_chapters = chapters;
    } else if (NUMERIC_FIELDS.has(field)) {
      const n = parseFloat(rawValue.replace(/,/g, ''));
      if (!isNaN(n)) blocker[field] = n;
    } else if (STRING_FIELDS.has(field)) {
      blocker[field] = rawValue.replace(/^"|"$/g, '');
    }
  }
  return blocker;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('dropbox');

    const listRes = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/SGT_Ramos_Manuscript' }),
    });
    if (!listRes.ok) throw new Error(`Dropbox list failed: ${await listRes.text()}`);

    const listData = await listRes.json();
    const csvFiles = (listData.entries || [])
      .filter(e => e.name.endsWith('.csv'))
      .sort((a, b) => new Date(b.server_modified) - new Date(a.server_modified));

    if (csvFiles.length === 0) {
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'dropbox_blockers', status: 'no_files',
        error_message: 'No CSV files found in /SGT_Ramos_Manuscript/'
      });
      return Response.json({ status: 'no_files', message: 'No CSV files found' });
    }

    // Prefer files named with "blocker" or "section"; fall back to latest CSV
    let targetFiles = csvFiles.filter(f =>
      f.name.toLowerCase().includes('blocker') ||
      f.name.toLowerCase().includes('section')
    );
    if (targetFiles.length === 0) targetFiles = [csvFiles[0]];

    // Fetch existing blockers for upsert
    const existingBlockers = await base44.asServiceRole.entities.Blocker.list();
    const blockerMap = {};
    existingBlockers.forEach(b => { blockerMap[b.blocker_id] = b; });

    let totalCreated = 0, totalUpdated = 0, totalSkipped = 0;
    const results = [];

    for (const file of targetFiles) {
      const downloadRes = await fetch('https://content.dropboxapi.com/2/files/download', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Dropbox-API-Arg': JSON.stringify({ path: file.path_display }),
        },
      });
      if (!downloadRes.ok) {
        results.push({ file: file.name, status: 'error', reason: 'download failed' });
        continue;
      }

      const csvText = await downloadRes.text();
      const lines = csvText.split('\n').filter(l => l.trim());
      if (lines.length < 2) {
        results.push({ file: file.name, status: 'skipped', reason: 'empty file' });
        continue;
      }

      const headers = parseCSVLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));
      const hasBlockerHeaders = headers.some(h => FIELD_MAP[normalizeHeader(h)]);
      if (!hasBlockerHeaders) {
        totalSkipped++;
        results.push({ file: file.name, status: 'skipped', reason: 'no blocker headers' });
        continue;
      }

      const toCreate = [];
      const toUpdate = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((h, idx) => { row[h] = (values[idx] || '').trim(); });

        const blocker = mapRowToBlocker(row);
        if (!blocker.blocker_id || !blocker.title) {
          totalSkipped++;
          continue;
        }

        const existing = blockerMap[blocker.blocker_id];
        if (existing) {
          toUpdate.push({ id: existing.id, ...blocker });
          totalUpdated++;
        } else {
          toCreate.push(blocker);
          blockerMap[blocker.blocker_id] = blocker;
          totalCreated++;
        }
      }

      if (toCreate.length > 0) {
        await base44.asServiceRole.entities.Blocker.bulkCreate(toCreate);
      }
      if (toUpdate.length > 0) {
        await base44.asServiceRole.entities.Blocker.bulkUpdate(toUpdate);
      }

      results.push({
        file: file.name,
        created: toCreate.length,
        updated: toUpdate.length,
      });
    }

    await base44.asServiceRole.entities.SyncLog.create({
      source: 'dropbox_blockers',
      file_name: targetFiles.map(f => f.name).join(', '),
      file_modified: targetFiles[0]?.server_modified,
      chapters_updated: totalCreated + totalUpdated,
      chapters_skipped: totalSkipped,
      status: 'success',
    });

    return Response.json({
      status: 'synced',
      files_processed: targetFiles.length,
      blockers_created: totalCreated,
      blockers_updated: totalUpdated,
      blockers_skipped: totalSkipped,
      results,
    });
  } catch (error) {
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'dropbox_blockers', status: 'error', error_message: error.message,
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});