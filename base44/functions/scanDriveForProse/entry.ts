import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const VOICE_PROFILE = `
MANUSCRIPT VOICE PROFILE — SGT Ramos: The Mathematics of Vietnam

The manuscript follows a Chicano war narrative with four squad voice vectors:

VECTOR 1 — O'Neil (Kentucky/Rural): Sparse, instinctive, reads spaces before people. Short declaratives. Silence is part of the voice. "Trees don't lie." "Where I'm from, quiet don't mean gone."

VECTOR 2 — Herrera (Bronx): Controlled, authoritative. Compressed under pressure. Spanish surfaces for privacy, emphasis, or grief. "Mira, we need clean timing." "The dead don't leave. They just get quiet."

VECTOR 3 — Hoshnsin (Philadelphia): City suspicion. Fast, sardonic, deflects with humor but catches everything. "Everything's too quiet to you. Trees too loud too?"

VECTOR 4 — Tijuana (Border/TJ): Border-smart, fluid, funny when things are ugly. Tactical bilingualism — moves between English and Spanish without apology. Elastic, teasing, confident. Markers: güey, órale, no manches, neta, vámonos. "This isn't luck, güey. This is Tijuana math."

CODE-SWITCH RULES: Every Spanish/English switch must be purposeful (identity, solidarity, emphasis, humor, quote, culture, lexical need, power/resistance). Never decorative.

OMEGA BENCHMARK: Manuscript baseline Ω̄ = 107.34. Components: CLS (Chicano Literary Style), BIS (Biographical Integrity), SII (Sensory Integration Index), MRF (Narrative Compression). Range 105–110. Target ceiling 114.593.

VOICE TEST: A line passes if (1) speaker identifiable without tag, (2) dialect marker isn't doing all the work, (3) reveals attitude not just geography, (4) any code-switch has a reason, (5) sounds like a person, not a Wikipedia page wearing boots.
`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const forceRescan = body.force === true;
    const maxFiles = body.maxFiles || 20;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // List manuscript-like files: Google Docs, plain text, .docx
    const query = encodeURIComponent(
      "(mimeType='application/vnd.google-apps.document' or mimeType='text/plain' or fileExtension='docx') and trashed=false"
    );
    const listUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,fileExtension)&pageSize=${maxFiles}&orderBy=modifiedTime desc`;
    const listRes = await fetch(listUrl, { headers: authHeader });
    if (!listRes.ok) {
      const errBody = await listRes.text();
      return Response.json({ error: 'Drive API error', detail: errBody }, { status: 502 });
    }
    const listData = await listRes.json();
    const files = listData.files || [];

    if (files.length === 0) {
      return Response.json({ status: 'no_files', message: 'No manuscript files found in Google Drive.', scanned: 0 });
    }

    const results = { scanned: 0, skipped: 0, opportunities: 0, errors: 0, details: [] };

    for (const file of files) {
      try {
        // Skip already-scanned files unless force is true
        if (!forceRescan) {
          const existing = await base44.asServiceRole.entities.Quarantine.filter({ source_file_id: file.id }, '-created_date', 1);
          if (existing && existing.length > 0) {
            results.skipped++;
            results.details.push({ file: file.name, status: 'skipped' });
            continue;
          }
        }

        // Extract text based on file type
        let text = '';
        let sourceType = 'text_file';

        if (file.mimeType === 'application/vnd.google-apps.document') {
          sourceType = 'google_doc';
          const exportUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`;
          const exportRes = await fetch(exportUrl, { headers: authHeader });
          if (!exportRes.ok) {
            results.errors++;
            results.details.push({ file: file.name, status: 'export_error' });
            continue;
          }
          text = await exportRes.text();
        } else if (file.mimeType === 'text/plain' || file.fileExtension === 'txt') {
          sourceType = 'text_file';
          const dlUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
          const dlRes = await fetch(dlUrl, { headers: authHeader });
          if (!dlRes.ok) {
            results.errors++;
            results.details.push({ file: file.name, status: 'download_error' });
            continue;
          }
          text = await dlRes.text();
        } else if (file.fileExtension === 'docx') {
          sourceType = 'docx';
          // Download the .docx binary, upload to base44 storage, then extract
          const dlUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
          const dlRes = await fetch(dlUrl, { headers: authHeader });
          if (!dlRes.ok) {
            results.errors++;
            results.details.push({ file: file.name, status: 'download_error' });
            continue;
          }
          const arrayBuffer = await dlRes.arrayBuffer();
          const fileObj = new File([arrayBuffer], file.name, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          const uploadResult = await base44.integrations.Core.UploadFile({ file: fileObj });
          const extractResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
            file_url: uploadResult.file_url,
            json_schema: {
              type: 'object',
              properties: {
                text_content: { type: 'string' }
              }
            }
          });
          text = (extractResult.output && extractResult.output.text_content) ? extractResult.output.text_content : '';
          if (!text) {
            results.errors++;
            results.details.push({ file: file.name, status: 'extract_error' });
            continue;
          }
        } else {
          results.skipped++;
          continue;
        }

        // Truncate to keep LLM call manageable
        const truncated = text.length > 8000 ? text.substring(0, 8000) : text;
        if (truncated.trim().length < 50) {
          results.skipped++;
          results.details.push({ file: file.name, status: 'too_short' });
          continue;
        }

        results.scanned++;

        // Send to LLM for voice-profile evaluation
        const llmResponse = await base44.integrations.Core.InvokeLLM({
          prompt: `You are a literary editor auditing manuscripts for the "SGT Ramos: The Mathematics of Vietnam" project.

${VOICE_PROFILE}

Below is text extracted from a file titled "${file.name}". Evaluate it for passages of EXCEPTIONAL prose that could improve the manuscript's voice and spirit. Look for:
- Vivid sensory detail that elevates SII (Sensory Integration Index)
- Authentic Chicano voice / code-switching that elevates CLS (Chicano Literary Style)
- Strong emotional resonance that elevates BIS (Biographical Integrity)
- Tight narrative compression that elevates MRF
- Dialogue that passes the Voice Test (speaker identifiable, attitude revealed, switches purposeful)

Only select passages that are genuinely strong — quality over quantity. Return up to 3 opportunities.

TEXT TO EVALUATE:
---
${truncated}
---

Return JSON with an "opportunities" array. Each opportunity must include:
- passage_text: the exact passage (1-4 sentences)
- voice_dimension: which Omega dimension it could improve (CLS, BIS, SII, MRF, Code-Switching, Voice, Sensory, Emotional Resonance, or Dialogue)
- opportunity_type: prose_quality, voice_match, code_switch, sensory_detail, emotional_depth, dialogue_strength, or rhythm
- reason: why this passage is an opportunity (1-2 sentences)
- suggested_application: how it could be applied to improve the manuscript (1 sentence)
- match_score: 0-100, how well it matches the manuscript voice profile
- chapter_suggestion: which chapter (1-45) it might improve, or 0 if general

If the text has no exceptional passages, return an empty opportunities array.`,
          response_json_schema: {
            type: 'object',
            properties: {
              opportunities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    passage_text: { type: 'string' },
                    voice_dimension: { type: 'string' },
                    opportunity_type: { type: 'string' },
                    reason: { type: 'string' },
                    suggested_application: { type: 'string' },
                    match_score: { type: 'number' },
                    chapter_suggestion: { type: 'number' }
                  }
                }
              }
            }
          }
        });

        const opportunities = llmResponse.opportunities || [];

        for (const opp of opportunities) {
          await base44.asServiceRole.entities.Quarantine.create({
            source_file: file.name,
            source_file_id: file.id,
            source_type: sourceType,
            passage_text: opp.passage_text,
            voice_dimension: opp.voice_dimension,
            opportunity_type: opp.opportunity_type,
            reason: opp.reason,
            suggested_application: opp.suggested_application,
            match_score: opp.match_score,
            status: 'quarantined',
            chapter_suggestion: opp.chapter_suggestion || 0,
            scanned_date: new Date().toISOString()
          });
          results.opportunities++;
        }

        results.details.push({
          file: file.name,
          status: 'scanned',
          opportunities: opportunities.length
        });
      } catch (fileErr) {
        results.errors++;
        results.details.push({ file: file.name, status: 'error', error: fileErr.message });
      }
    }

    return Response.json({
      status: 'success',
      scanned: results.scanned,
      skipped: results.skipped,
      opportunities: results.opportunities,
      errors: results.errors,
      details: results.details
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});