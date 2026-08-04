import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { scanText, wordCount, LOCATORS } from '../../shared/locators.js';

// Deterministic locator crawler over Google Drive text documents.
// No model is involved: patterns in / offsets out, reproducible by hand.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    if (body.listLocators === true) {
      return Response.json({
        locators: LOCATORS.map((l) => ({ id: l.id, name: l.name, class: l.class, note: l.note })),
      });
    }

    const maxFiles = Math.min(body.maxFiles || 10, 25);
    const runId = `SCAN-${Date.now()}`;
    const startedAt = new Date().toISOString();

    const run = await base44.asServiceRole.entities.ScanRun.create({
      run_id: runId,
      source: 'googledrive',
      status: 'running',
      started_at: startedAt,
    });

    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
      const authHeader = { Authorization: `Bearer ${accessToken}` };

      const query = encodeURIComponent(
        "(mimeType='application/vnd.google-apps.document' or mimeType='text/plain') and trashed=false"
      );
      const listUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType)&pageSize=${maxFiles}&orderBy=modifiedTime desc`;
      const listRes = await fetch(listUrl, { headers: authHeader });
      if (!listRes.ok) {
        const detail = await listRes.text();
        await base44.asServiceRole.entities.ScanRun.update(run.id, {
          status: 'error',
          error_message: `Drive API error: ${detail.slice(0, 300)}`,
          finished_at: new Date().toISOString(),
        });
        return Response.json({ error: 'Drive API error', run_id: runId, detail }, { status: 502 });
      }

      const files = (await listRes.json()).files || [];
      if (files.length === 0) {
        await base44.asServiceRole.entities.ScanRun.update(run.id, {
          status: 'no_files',
          finished_at: new Date().toISOString(),
        });
        return Response.json({ status: 'no_files', run_id: runId, message: 'No text documents found in Drive.' });
      }

      let filesScanned = 0;
      let filesSkipped = 0;
      let hitsCreated = 0;
      let wordsScanned = 0;
      const details = [];

      for (const file of files) {
        let text = '';
        const url =
          file.mimeType === 'application/vnd.google-apps.document'
            ? `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`
            : `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
        const res = await fetch(url, { headers: authHeader });
        if (!res.ok) {
          filesSkipped++;
          details.push({ file: file.name, status: 'fetch_error' });
          continue;
        }
        text = await res.text();
        if (text.trim().length < 40) {
          filesSkipped++;
          details.push({ file: file.name, status: 'too_short' });
          continue;
        }

        const hits = scanText(text);
        wordsScanned += wordCount(text);
        filesScanned++;

        if (hits.length) {
          const records = hits.map((h) => ({
            ...h,
            occurrences: h.occurrences || 1,
            run_id: runId,
            source_file: file.name,
            source_file_id: file.id,
            review_status: 'new',
          }));
          for (let i = 0; i < records.length; i += 100) {
            await base44.asServiceRole.entities.ScanHit.bulkCreate(records.slice(i, i + 100));
          }
          hitsCreated += records.length;
        }

        details.push({ file: file.name, status: 'scanned', hits: hits.length });

        await base44.asServiceRole.entities.ScanRun.update(run.id, {
          files_seen: files.length,
          files_scanned: filesScanned,
          files_skipped: filesSkipped,
          hits_created: hitsCreated,
          words_scanned: wordsScanned,
        });
      }

      await base44.asServiceRole.entities.ScanRun.update(run.id, {
        status: 'complete',
        files_seen: files.length,
        files_scanned: filesScanned,
        files_skipped: filesSkipped,
        hits_created: hitsCreated,
        words_scanned: wordsScanned,
        finished_at: new Date().toISOString(),
      });

      return Response.json({
        status: 'success',
        run_id: runId,
        files_seen: files.length,
        files_scanned: filesScanned,
        files_skipped: filesSkipped,
        hits_created: hitsCreated,
        words_scanned: wordsScanned,
        details,
      });
    } catch (scanErr) {
      await base44.asServiceRole.entities.ScanRun.update(run.id, {
        status: 'error',
        error_message: String(scanErr.message).slice(0, 300),
        finished_at: new Date().toISOString(),
      });
      return Response.json({ error: scanErr.message, run_id: runId }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}