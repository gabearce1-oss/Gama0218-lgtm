import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const DEFAULT_SETTINGS = [
  { setting_key: 'quarantine_log_sync', enabled: true, last_sync_status: 'never' },
  { setting_key: 'restoration_drafts_sync', enabled: true, last_sync_status: 'never' },
  { setting_key: 'workbook_ledger_sync', enabled: true, last_sync_status: 'never' },
];

const SETTING_META = {
  quarantine_log_sync: {
    label: 'Quarantine Log',
    description: 'Bidirectional sync between QuarantineLog records and the Google Sheets QUARANTINE_LOG tab.',
    function_name: 'syncQuarantineLogToSheets',
  },
  restoration_drafts_sync: {
    label: 'Restoration Drafts',
    description: 'Exports all RestorationDraft records (cooked Ω, CLS, BIS, SII, MRF) to the RESTORATION_DRAFTS sheet tab.',
    function_name: 'syncRestorationDraftsToSheets',
  },
  workbook_ledger_sync: {
    label: 'Workbook Ledger',
    description: 'Syncs chapter metrics and RF 1.5 scores from Google Sheets workbooks into Chapter entities.',
    function_name: 'googledriveSyncWorkbooks',
  },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // GET: return all settings (create defaults if missing)
    if (req.method === 'GET') {
      const existing = await base44.asServiceRole.entities.SyncSettings.list();
      const existingMap = {};
      existing.forEach(s => { existingMap[s.setting_key] = s; });

      // Create any missing defaults
      for (const def of DEFAULT_SETTINGS) {
        if (!existingMap[def.setting_key]) {
          const created = await base44.asServiceRole.entities.SyncSettings.create(def);
          existingMap[def.setting_key] = created;
        }
      }

      const settings = DEFAULT_SETTINGS.map(def => {
        const s = existingMap[def.setting_key];
        return {
          setting_key: s.setting_key,
          enabled: s.enabled,
          last_synced: s.last_synced || null,
          last_sync_status: s.last_sync_status || 'never',
          last_sync_summary: s.last_sync_summary || null,
          label: SETTING_META[s.setting_key].label,
          description: SETTING_META[s.setting_key].description,
          function_name: SETTING_META[s.setting_key].function_name,
        };
      });

      return Response.json({ settings });
    }

    // POST: toggle a specific setting, or list all if no setting_key
    if (req.method === 'POST') {
      const body = await req.json();
      const { setting_key, enabled } = body;

      // No setting_key → return all settings (like GET)
      if (!setting_key) {
        const existing = await base44.asServiceRole.entities.SyncSettings.list();
        const existingMap = {};
        existing.forEach(s => { existingMap[s.setting_key] = s; });

        for (const def of DEFAULT_SETTINGS) {
          if (!existingMap[def.setting_key]) {
            const created = await base44.asServiceRole.entities.SyncSettings.create(def);
            existingMap[def.setting_key] = created;
          }
        }

        const settings = DEFAULT_SETTINGS.map(def => {
          const s = existingMap[def.setting_key];
          return {
            setting_key: s.setting_key,
            enabled: s.enabled,
            last_synced: s.last_synced || null,
            last_sync_status: s.last_sync_status || 'never',
            last_sync_summary: s.last_sync_summary || null,
            label: SETTING_META[s.setting_key].label,
            description: SETTING_META[s.setting_key].description,
            function_name: SETTING_META[s.setting_key].function_name,
          };
        });

        return Response.json({ settings });
      }

      if (!SETTING_META[setting_key]) {
        return Response.json({ error: 'Invalid setting_key' }, { status: 400 });
      }

      const existing = await base44.asServiceRole.entities.SyncSettings.filter({ setting_key });
      if (existing.length === 0) {
        return Response.json({ error: 'Setting not found' }, { status: 404 });
      }

      const updated = await base44.asServiceRole.entities.SyncSettings.update(existing[0].id, {
        enabled: enabled === true,
      });

      return Response.json({
        setting_key: updated.setting_key,
        enabled: updated.enabled,
        label: SETTING_META[setting_key].label,
      });
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});