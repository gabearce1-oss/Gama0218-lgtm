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
        source: 'dropbox', status: 'no_files',
        error_message: 'No CSV files found in /SGT_Ramos_Manuscript/'
      });
      return Response.json({ status: 'no_files', message: 'No CSV files found' });
    }

    const latestFile = csvFiles[0];

    const downloadRes = await fetch('https://content.dropboxapi.com/2/files/download', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Dropbox-API-Arg': JSON.stringify({ path: latestFile.path_display }),
      },
    });
    if (!downloadRes.ok) throw new Error(`Download failed: ${await downloadRes.text()}`);

    const csvText = await downloadRes.text();
    const lines = csvText.split('\n').filter(l => l.trim());
    if (lines.length < 2) {
      return Response.json({ status: 'empty', message: 'CSV has no data rows' });
    }

    const chapters = await base44.asServiceRole.entities.Chapter.list();
    const chapterMap = {};
    chapters.forEach(c => { chapterMap[c.chapter_number] = c; });

    let updated = 0, skipped = 0;
    const updates = [];

    for (let i = 1; i < lines.length; i++) {
      const v = parseCSVLine(lines[i]);
      const num = parseInt(v[0]);
      if (!num || !chapterMap[num]) { skipped++; continue; }

      const u = { id: chapterMap[num].id };
      if (v[1]) u.title = v[1];
      if (v[2]) u.act = v[2];
      const wc = parseInt(v[3]); if (wc) u.word_count = wc;
      const cs = parseFloat(v[4]); if (cs) u.cs_pct = cs;
      const st = parseInt(v[5]); if (st) u.spanish_tokens = st;
      const sp = parseInt(v[6]); if (sp) u.sensory_present = sp;
      const sTotal = parseInt(v[7]); if (sTotal) u.sensory_total = sTotal;
      const cls = parseFloat(v[8]); if (cls) u.cls_est = cls;
      const bis = parseFloat(v[9]); if (bis) u.bis_est = bis;
      const sii = parseFloat(v[10]); if (sii) u.sii_est = sii;
      const mrf = parseFloat(v[11]); if (mrf) u.mrf_est = mrf;
      const oe = parseFloat(v[12]); if (oe) u.omega_est = oe;
      const oa = parseFloat(v[13]); if (oa) u.omega_audit = oa;
      if (v[14]) u.risk = v[14];
      if (v[15]) u.triage = v[15];
      if (v[16]) u.status = v[16];
      if (v[17]) u.priority_action = v[17];

      updates.push(u);
      updated++;
    }

    if (updates.length > 0) {
      await base44.asServiceRole.entities.Chapter.bulkUpdate(updates);
    }

    await base44.asServiceRole.entities.SyncLog.create({
      source: 'dropbox',
      file_name: latestFile.name,
      file_modified: latestFile.server_modified,
      chapters_updated: updated,
      chapters_skipped: skipped,
      status: 'success',
    });

    return Response.json({
      status: 'synced',
      file: latestFile.name,
      modified: latestFile.server_modified,
      chapters_updated: updated,
      chapters_skipped: skipped,
      total_chapters: chapters.length,
    });
  } catch (error) {
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'dropbox', status: 'error', error_message: error.message,
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});