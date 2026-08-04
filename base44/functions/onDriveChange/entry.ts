import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const providerMeta = body?.data?._provider_meta || {};
    const state = providerMeta['x-goog-resource-state'];

    // Initial sync handshake — just acknowledge
    if (state === 'sync') {
      return Response.json({ status: 'sync_ack' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Load or initialize the sync state (page token for incremental changes)
    const existing = await base44.asServiceRole.entities.SyncState.list();
    let syncRecord = existing.length > 0 ? existing[0] : null;

    if (!syncRecord) {
      const tokenRes = await fetch(
        'https://www.googleapis.com/drive/v3/changes/startPageToken',
        { headers: authHeader }
      );
      const { startPageToken } = await tokenRes.json();
      await base44.asServiceRole.entities.SyncState.create({ page_token: startPageToken });
      return Response.json({ status: 'initialized', message: 'Sync state created. Next webhook will process changes.' });
    }

    // Fetch all pages of changes since last sync
    const baseUrl = `https://www.googleapis.com/drive/v3/changes?fields=changes(file(id,name,mimeType,fileExtension,modifiedTime)),newStartPageToken,nextPageToken`;
    let changesUrl = baseUrl + `&pageToken=${syncRecord.page_token}`;
    const allChanges = [];
    let newPageToken = null;

    while (changesUrl) {
      const changesRes = await fetch(changesUrl, { headers: authHeader });
      if (!changesRes.ok) {
        return Response.json({ status: 'api_error', detail: await changesRes.text() }, { status: 502 });
      }
      const page = await changesRes.json();
      allChanges.push(...(page.changes || []));
      if (page.newStartPageToken) newPageToken = newPageToken;
      changesUrl = page.nextPageToken ? baseUrl + `&pageToken=${page.nextPageToken}` : null;
    }

    // Save the new page token immediately after fetching changes
    if (newPageToken) {
      await base44.asServiceRole.entities.SyncState.update(syncRecord.id, { page_token: newPageToken });
    }

    // Filter for manuscript-like files (Google Docs, text, docx) that still exist
    const manuscriptMimeTypes = ['application/vnd.google-apps.document', 'text/plain'];
    const manuscriptChanges = allChanges.filter(c => {
      if (!c.file) return false;
      const mt = c.file.mimeType || '';
      const ext = c.file.fileExtension || '';
      return manuscriptMimeTypes.includes(mt) || ext === 'docx' || ext === 'txt';
    });

    if (manuscriptChanges.length === 0) {
      return Response.json({ status: 'no_manuscript_changes', changes_seen: allChanges.length });
    }

    // Invoke the existing scan function to process new/modified files
    // (it already skips files that have been scanned and not modified)
    const scanResult = await base44.functions.invoke('scanDriveForProse', { force: true, maxFiles: 50 });

    // Log the sync event
    await base44.asServiceRole.entities.SyncLog.create({
      source: 'google_drive_webhook',
      file_name: manuscriptChanges.map(c => c.file.name).join(', '),
      chapters_updated: scanResult.data?.opportunities || 0,
      chapters_skipped: scanResult.data?.skipped || 0,
      status: 'success',
    });

    return Response.json({
      status: 'success',
      changes_detected: manuscriptChanges.length,
      files: manuscriptChanges.map(c => c.file.name),
      scan_result: scanResult.data,
    });
  } catch (error) {
    // Log the error
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.SyncLog.create({
        source: 'google_drive_webhook',
        file_name: '',
        chapters_updated: 0,
        chapters_skipped: 0,
        status: 'error',
        error_message: error.message,
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});