import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Get Google Drive token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    if (!accessToken) return Response.json({ error: 'Google Drive not connected' }, { status: 400 });

    const authHeader = { 'Authorization': `Bearer ${accessToken}` };

    // Fetch drafts and approved passages
    const drafts = await base44.asServiceRole.entities.RestorationDraft.list('-chapter_number', 100);
    if (drafts.length === 0) {
      return Response.json({ error: 'No beta restoration drafts found. Cook passages first.' }, { status: 400 });
    }

    // Fetch approved passages (paginate in batches of 500)
    const allPassages = [];
    let offset = 0;
    while (true) {
      const batch = await base44.asServiceRole.entities.Quarantine.filter({ status: 'approved' }, '-scanned_date', 500, offset);
      allPassages.push(...batch);
      if (batch.length < 500) break;
      offset += 500;
    }

    // Group passages by chapter
    const passagesByChapter = {};
    allPassages.forEach((p) => {
      const ch = p.chapter_suggestion;
      if (ch != null) {
        if (!passagesByChapter[ch]) passagesByChapter[ch] = [];
        passagesByChapter[ch].push(p);
      }
    });

    // Create folder
    const dateStr = new Date().toISOString().split('T')[0];
    const folderName = `SGT Ramos Beta Restoration ${dateStr}`;
    const folderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });
    if (!folderRes.ok) {
      const err = await folderRes.text();
      return Response.json({ error: `Failed to create folder: ${err}` }, { status: 500 });
    }
    const folder = await folderRes.json();
    const folderId = folder.id;
    const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

    // Make the folder shareable — anyone with the link can edit
    let shareStatus = 'shared_editable';
    const permRes = await fetch(`https://www.googleapis.com/drive/v3/files/${folderId}/permissions`, {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'writer', type: 'anyone' }),
    });
    if (!permRes.ok) shareStatus = 'share_failed';

    // Helper: convert text to HTML
    const escapeHtml = (text) => {
      if (!text) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    };

    // Create one Google Doc per chapter
    let docsCreated = 0;
    let errors = 0;

    for (const draft of drafts.sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0))) {
      const chNum = draft.chapter_number;
      const chPassages = passagesByChapter[chNum] || [];

      // Build HTML content
      const parts = [];

      // Title
      parts.push(`<h1>Chapter ${chNum}: ${escapeHtml(draft.chapter_title || 'Untitled')}</h1>`);

      // Score summary box
      parts.push('<hr>');
      parts.push('<table border="1" cellpadding="6" style="border-collapse:collapse;">');
      parts.push('<tr style="background:#f0f0f0;"><th>Metric</th><th>Before</th><th>After (Cooked)</th><th>Delta</th></tr>');
      const rows = [
        ['Omega', draft.original_omega, draft.cooked_omega],
        ['CLS', draft.original_cls, draft.cooked_cls],
        ['BIS', draft.original_bis, draft.cooked_bis],
        ['SII', draft.original_sii, draft.cooked_sii],
        ['MRF', draft.original_mrf, draft.cooked_mrf],
      ];
      rows.forEach(([label, before, after]) => {
        const delta = before != null && after != null ? (after - before).toFixed(1) : '—';
        const beforeStr = before != null ? Number(before).toFixed(1) : '—';
        const afterStr = after != null ? Number(after).toFixed(1) : '—';
        const deltaColor = before != null && after != null ? (after >= before ? 'green' : 'red') : 'black';
        parts.push(`<tr><td><b>${label}</b></td><td>${beforeStr}</td><td>${afterStr}</td><td style="color:${deltaColor};font-weight:bold;">${delta === '—' ? '—' : (delta >= 0 ? '+' : '') + delta}</td></tr>`);
      });
      parts.push('</table>');

      // Meta
      parts.push(`<p><b>Status:</b> ${draft.status || 'draft'} &nbsp; | &nbsp; <b>Approved passages:</b> ${draft.approved_passages || chPassages.length} &nbsp; | &nbsp; <b>Cooked:</b> ${draft.cooked_date ? new Date(draft.cooked_date).toLocaleDateString() : '—'}</p>`);

      // LLM reasoning
      if (draft.llm_reasoning) {
        parts.push('<h2>Scoring Rationale</h2>');
        parts.push(`<p><i>${escapeHtml(draft.llm_reasoning)}</i></p>`);
      }

      // Passages
      if (chPassages.length > 0) {
        parts.push('<h2>Restoration Passages</h2>');
        chPassages.forEach((p, i) => {
          parts.push(`<h3>Passage ${i + 1}</h3>`);
          const tags = [p.voice_dimension, p.opportunity_type].filter(Boolean);
          if (tags.length > 0) parts.push(`<p><small><b>Tags:</b> ${tags.join(' · ')}</small></p>`);
          parts.push(`<p>${escapeHtml(p.passage_text)}</p>`);
          if (p.suggested_application) {
            parts.push(`<p><small><b>Application note:</b> ${escapeHtml(p.suggested_application)}</small></p>`);
          }
        });
      }

      const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${parts.join('\n')}</body></html>`;

      // Create Google Doc via multipart upload (convert HTML to Google Doc)
      const boundary = 'beta_export_' + Math.random().toString(36).substring(2);
      const metadata = JSON.stringify({
        name: `Ch${chNum} - ${draft.chapter_title || 'Untitled'}`,
        parents: [folderId],
        mimeType: 'application/vnd.google-apps.document',
      });
      const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: text/html\r\n\r\n${htmlContent}\r\n--${boundary}--`;

      const docRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', {
        method: 'POST',
        headers: {
          ...authHeader,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body,
      });

      if (docRes.ok) {
        docsCreated++;
      } else {
        errors++;
      }
    }

    return Response.json({
      success: true,
      folder_url: folderUrl,
      folder_name: folderName,
      docs_created: docsCreated,
      errors,
      share_status: shareStatus,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});