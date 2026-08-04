import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import * as XLSX from 'npm:xlsx@0.18.5';

const FILE_URL = 'https://media.base44.com/files/public/6a4338debd58ef6c645481a9/0139f9343_GT_RAMOS_SPSS_WORKBOOK_AUDIT_2026-07-01.xlsx';

function num(v) {
  if (v == null || v === 'NULL' || v === '') return undefined;
  const n = parseFloat(String(v).replace(/,/g, ''));
  return isNaN(n) ? undefined : n;
}
function str(v) {
  if (v == null || v === 'NULL' || v === '') return undefined;
  return String(v).trim();
}

// Map the severity words in the audit to the Blocker severity enum (P0/P1/P2).
function mapSeverity(raw) {
  const v = String(raw || '').toUpperCase();
  if (v.includes('CRITICAL') || v.includes('BLOCKER')) return 'P0';
  if (v.includes('HIGH')) return 'P1';
  return 'P2';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    let dryRun = false;
    try { const b = await req.clone().json(); dryRun = b.dryRun === true; } catch {}

    const resp = await fetch(FILE_URL);
    const buf = new Uint8Array(await resp.arrayBuffer());
    const wb = XLSX.read(buf, { type: 'array' });

    const readSheet = (name) => {
      const ws = wb.Sheets[name];
      if (!ws) return [];
      return XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
    };

    // ---- 1. RF15 CERTIFIED SCORES (sheet 03) -> Chapter ----
    // Header row index 2; cols: Ch#,Title,Act,CLS,BIS,SII,MRF,Omega_RF15,Tier,MetricValidation,VCL,DUP,Core,Notes
    const scoresAoa = readSheet('03_RF15_CERTIFIED_SCORES');
    const scoreRows = scoresAoa.slice(3).filter(r => typeof r[0] === 'number');

    const chapters = await base44.asServiceRole.entities.Chapter.list('chapter_number', 500);
    const chapterMap = {};
    chapters.forEach(c => { chapterMap[c.chapter_number] = c; });

    const chapterUpdates = [];
    const chapterSkipped = [];
    for (const r of scoreRows) {
      const chNum = r[0];
      const existing = chapterMap[chNum];
      if (!existing) { chapterSkipped.push(chNum); continue; }
      const update = { id: existing.id };
      const cls = num(r[3]); const bis = num(r[4]); const sii = num(r[5]); const mrf = num(r[6]);
      const omega = num(r[7]); const tier = str(r[8]);
      if (cls != null) update.cls = cls;
      if (bis != null) update.bis = bis;
      if (sii != null) update.sii = sii;
      if (mrf != null) update.mrf = mrf;
      if (omega != null) { update.omega = omega; update.omega_audit = omega; }
      if (tier) update.tier_label = tier;
      chapterUpdates.push(update);
    }

    // ---- 2. ANOMALY LOG (sheet 05) -> Blocker ----
    // Header row index 2; cols: Code,Chapter,Title,Category,Severity,Description,RequiredAction,Status
    const anomAoa = readSheet('05_ANOMALY_LOG');
    const anomRows = anomAoa.slice(3).filter(r => /^ANO-\d+/i.test(String(r[0] || '')));
    const anomalyBlockers = anomRows.map(r => {
      const chLabel = str(r[1]) || '';
      const chMatch = chLabel.match(/\d+/);
      const chNum = chMatch ? parseInt(chMatch[0]) : undefined;
      return {
        blocker_id: str(r[0]),
        title: `${str(r[3]) || 'Anomaly'} — ${str(r[2]) || chLabel}`,
        severity: mapSeverity(r[4]),
        gate: 'data_hygiene',
        description: str(r[5]),
        required_fix: str(r[6]),
        affected_chapters: chNum ? [chNum] : [],
        source_reference: '05_ANOMALY_LOG',
        status: 'active',
      };
    });

    // ---- 3. DECISION QUEUE (sheet 10) -> Blocker ----
    // Header row index 2; cols: Code,Priority,Item,Situation,RequiredAction,DecisionAuthority,InterimRule,Status
    const dqAoa = readSheet('10_DECISION_QUEUE');
    const dqRows = dqAoa.slice(3).filter(r => /^DQ-\d+/i.test(String(r[0] || '')));
    const decisionBlockers = dqRows.map(r => {
      const situation = str(r[3]) || '';
      const chMatch = situation.match(/Ch\s?0*(\d+)/i);
      const chNum = chMatch ? parseInt(chMatch[1]) : undefined;
      return {
        blocker_id: str(r[0]),
        title: str(r[2]) || 'Decision Item',
        severity: mapSeverity(r[1]),
        gate: 'governance',
        description: situation,
        required_fix: str(r[4]),
        resolution: str(r[6]),
        affected_chapters: chNum ? [chNum] : [],
        source_reference: '10_DECISION_QUEUE',
        status: 'active',
      };
    });

    const allBlockers = [...anomalyBlockers, ...decisionBlockers].filter(b => b.blocker_id && b.title);

    // Upsert blockers by blocker_id
    const existingBlockers = await base44.asServiceRole.entities.Blocker.list('-created_date', 500);
    const blockerMap = {};
    existingBlockers.forEach(b => { if (b.blocker_id) blockerMap[b.blocker_id] = b; });
    const blockerCreate = [];
    const blockerUpdate = [];
    for (const b of allBlockers) {
      const ex = blockerMap[b.blocker_id];
      if (ex) blockerUpdate.push({ id: ex.id, ...b });
      else blockerCreate.push(b);
    }

    const summary = {
      chapters_to_update: chapterUpdates.length,
      chapters_skipped: chapterSkipped,
      blockers_to_create: blockerCreate.length,
      blockers_to_update: blockerUpdate.length,
      blocker_ids: allBlockers.map(b => b.blocker_id),
    };

    if (dryRun) {
      return Response.json({ status: 'dry_run', ...summary, sampleChapter: chapterUpdates[0], sampleBlocker: allBlockers[0] });
    }

    // Execute writes
    if (chapterUpdates.length > 0) {
      for (let i = 0; i < chapterUpdates.length; i += 100) {
        await base44.asServiceRole.entities.Chapter.bulkUpdate(chapterUpdates.slice(i, i + 100));
      }
    }
    if (blockerCreate.length > 0) {
      for (let i = 0; i < blockerCreate.length; i += 100) {
        await base44.asServiceRole.entities.Blocker.bulkCreate(blockerCreate.slice(i, i + 100));
      }
    }
    if (blockerUpdate.length > 0) {
      for (let i = 0; i < blockerUpdate.length; i += 100) {
        await base44.asServiceRole.entities.Blocker.bulkUpdate(blockerUpdate.slice(i, i + 100));
      }
    }

    return Response.json({ status: 'imported', ...summary });
  } catch (error) {
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});