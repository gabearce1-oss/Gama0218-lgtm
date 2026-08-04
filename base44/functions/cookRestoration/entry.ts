import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    let body = {};
    try { body = await req.json(); } catch (_) {}
    const force = body.force === true;

    // Get all approved quarantine passages
    const approved = await base44.asServiceRole.entities.Quarantine.filter({ status: 'approved' }, '-scanned_date', 1000);

    // Group by chapter
    const byChapter = {};
    approved.forEach(q => {
      const ch = q.chapter_suggestion;
      if (ch != null) {
        if (!byChapter[ch]) byChapter[ch] = [];
        byChapter[ch].push(q);
      }
    });

    const chapterCount = Object.keys(byChapter).length;
    if (chapterCount === 0) {
      return Response.json({ cooked: 0, skipped: 0, errors: 0, total_chapters: 0, message: 'No approved passages to cook.' });
    }

    // Get chapters for current scores
    const chapters = await base44.asServiceRole.entities.Chapter.list('-chapter_number', 100);

    // Get existing drafts (for resumability)
    const existingDrafts = await base44.asServiceRole.entities.RestorationDraft.list('-chapter_number', 100);
    const draftMap = {};
    existingDrafts.forEach(d => { draftMap[d.chapter_number] = d; });

    let cooked = 0;
    let skipped = 0;
    let errors = 0;
    const results = [];
    const startTime = Date.now();
    const TIME_LIMIT = 25000; // 25s — return partial results, re-run to continue

    for (const [chStr, passages] of Object.entries(byChapter)) {
      const chNum = Number(chStr);

      // Time guard — if approaching limit, return what we have
      if (Date.now() - startTime > TIME_LIMIT) {
        return Response.json({
          cooked,
          skipped,
          errors,
          total_chapters: chapterCount,
          partial: true,
          message: `Time limit reached. ${cooked} chapters cooked, ${chapterCount - cooked - skipped} remaining. Re-run to continue.`,
          results
        });
      }

      if (!force && draftMap[chNum]) {
        skipped++;
        continue;
      }

      const chapter = chapters.find(c => c.chapter_number === chNum);

      // Build passage summary — sample up to 15 passages, truncated
      const passageTexts = passages.map(p => p.passage_text).filter(Boolean);
      const passageSummary = passageTexts.slice(0, 15).map((t, i) => `[${i+1}] ${t.substring(0, 400)}`).join('\n\n');

      try {
        const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `You are scoring a chapter of "SGT Ramos: The Mathematics of Vietnam", a Chicano Vietnam War novel.

Chapter ${chNum}: "${chapter?.title || 'Untitled'}"
${passages.length} approved prose restoration passages have been merged into this chapter.

Here are sample passages that were integrated into the prose:
${passageSummary}

Score the chapter's prose quality on four dimensions (0-100 scale). Be rigorous but fair — these passages add emotional depth, sensory details, code-switching authenticity, and dialogue strength:
- CLS (Chicano Literary Style): Authenticity of Chicano voice, code-switching, cultural specificity, barrio language
- BIS (Biographical Integrity): Emotional truth, character depth, biographical resonance, moral weight
- SII (Sensory Integration Index): Sensory detail density — sight, sound, smell, touch, taste, body memory
- MRF (Narrative Compression): Pacing, rhythm, narrative density, compression of meaning into prose

Return ONLY a JSON object.`,
          response_json_schema: {
            type: "object",
            properties: {
              cls: { type: "number", description: "Chicano Literary Style score 0-100" },
              bis: { type: "number", description: "Biographical Integrity score 0-100" },
              sii: { type: "number", description: "Sensory Integration Index score 0-100" },
              mrf: { type: "number", description: "Narrative Compression score 0-100" },
              reasoning: { type: "string", description: "Brief explanation of scores" }
            },
            required: ["cls", "bis", "sii", "mrf", "reasoning"]
          }
        });

        const cookedOmega = 71.443 + 0.124 * llmResponse.cls + 0.118 * llmResponse.bis + 0.089 * llmResponse.sii + 0.1005 * llmResponse.mrf;

        const draftData = {
          chapter_number: chNum,
          chapter_title: chapter?.title || 'Untitled',
          original_omega: chapter?.omega || null,
          cooked_omega: Math.round(cookedOmega * 100) / 100,
          original_cls: chapter?.cls || null,
          cooked_cls: llmResponse.cls,
          original_bis: chapter?.bis || null,
          cooked_bis: llmResponse.bis,
          original_sii: chapter?.sii || null,
          cooked_sii: llmResponse.sii,
          original_mrf: chapter?.mrf || null,
          cooked_mrf: llmResponse.mrf,
          approved_passages: passages.length,
          llm_reasoning: llmResponse.reasoning,
          status: 'draft',
          cooked_date: new Date().toISOString()
        };

        if (draftMap[chNum] && force) {
          await base44.asServiceRole.entities.RestorationDraft.update(draftMap[chNum].id, draftData);
        } else {
          await base44.asServiceRole.entities.RestorationDraft.create(draftData);
        }

        results.push({
          chapter: chNum,
          title: chapter?.title || 'Untitled',
          original_omega: chapter?.omega || null,
          cooked_omega: draftData.cooked_omega,
          passages: passages.length
        });
        cooked++;
      } catch (err) {
        errors++;
        results.push({ chapter: chNum, error: err.message });
      }
    }

    return Response.json({
      cooked,
      skipped,
      errors,
      total_chapters: chapterCount,
      partial: false,
      results
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});