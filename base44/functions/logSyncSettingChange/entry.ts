import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const { entity_id, data = {}, old_data = {}, changed_fields = [] } = body;

  const record = data && Object.keys(data).length
    ? data
    : await base44.asServiceRole.entities.SyncSettings.get(entity_id);

  const changeId = `SYNCSET-${Date.now()}`;
  const fields = (changed_fields || []).join(', ') || 'unspecified';

  const entry = await base44.asServiceRole.entities.Changelog.create({
    change_id: changeId,
    change_type: 'LOG_CHANGE',
    entity_type: 'SyncSettings',
    entity_id,
    description: `Sync setting "${record?.setting_key ?? entity_id}" updated (${fields})`,
    old_value: JSON.stringify({ enabled: old_data?.enabled, last_sync_status: old_data?.last_sync_status }),
    new_value: JSON.stringify({ enabled: record?.enabled, last_sync_status: record?.last_sync_status }),
    gabe_approved: false
  });

  return Response.json({ status: 'logged', change_id: changeId, id: entry.id });
});