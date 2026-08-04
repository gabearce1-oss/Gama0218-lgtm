import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('dropbox');

    const chapters = await base44.asServiceRole.entities.Chapter.list();

    const headers = ['Ch#', 'Title', 'Act', 'Words', 'CS% Density', 'Spanish Tokens', 'Sensory Present (of 6)', 'Sensory Total', 'CLS Est', 'BIS Est', 'SII Est', 'MRF Est', 'Omega Est', 'Audit Omega', 'Risk', 'Triage', 'Status', 'Priority Action'];
    const rows = chapters
      .sort((a, b) => a.chapter_number - b.chapter_number)
      .map(c => [
        c.chapter_number,
        `"${(c.title || '').replace(/"/g, '""')}"`,
        c.act || '',
        c.word_count || '',
        c.cs_pct || '',
        c.spanish_tokens || '',
        c.sensory_present || '',
        c.sensory_total || '',
        c.cls_est || '',
        c.bis_est || '',
        c.sii_est || '',
        c.mrf_est || '',
        c.omega_est || '',
        c.omega_audit || '',
        c.risk || '',
        c.triage || '',
        c.status || '',
        `"${(c.priority_action || '').replace(/"/g, '""')}"`
      ].join(','));

    const csv = headers.join(',') + '\n' + rows.join('\n');
    const csvBytes = new TextEncoder().encode(csv);

    const dropboxPath = '/SGT_Ramos_Manuscript/mathematics_of_vietnam_scoring_template.csv';
    const apiArgs = JSON.stringify({
      path: dropboxPath,
      mode: 'overwrite',
      autorename: false,
      mute: true,
    });

    const uploadRes = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Dropbox-API-Arg': apiArgs,
        'Content-Type': 'application/octet-stream',
      },
      body: csvBytes,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return Response.json({ error: `Dropbox upload failed: ${errText}` }, { status: uploadRes.status });
    }

    const uploadData = await uploadRes.json();

    const shareRes = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: dropboxPath,
        settings: { requested_visibility: 'view' },
      }),
    });

    let shareUrl = null;
    if (shareRes.ok) {
      const shareData = await shareRes.json();
      shareUrl = shareData.url;
    }

    return Response.json({
      status: 'uploaded',
      path: uploadData.path_display,
      size: uploadData.size,
      share_url: shareUrl,
      chapter_count: chapters.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});