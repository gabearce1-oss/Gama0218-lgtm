import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function sendSlackDM(accessToken, userEmail, message) {
  const lookupRes = await fetch(
    `https://slack.com/api/users.lookupByEmail?email=${encodeURIComponent(userEmail)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const lookupData = await lookupRes.json();
  if (!lookupData.ok) throw new Error(`users.lookupByEmail failed: ${lookupData.error}`);
  const slackUserId = lookupData.user.id;

  const openRes = await fetch('https://slack.com/api/conversations.open', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ users: slackUserId })
  });
  const openData = await openRes.json();
  if (!openData.ok) throw new Error(`conversations.open failed: ${openData.error}`);
  const channelId = openData.channel.id;

  const postRes = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel: channelId,
      text: message,
      username: 'Ramos Restoration Bot',
      icon_emoji: ':white_check_mark:'
    })
  });
  const postData = await postRes.json();
  if (!postData.ok) throw new Error(`chat.postMessage failed: ${postData.error}`);
  return { sent: true, channel: channelId };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Bulk update all quarantined passages to approved
    const result = await base44.asServiceRole.entities.Quarantine.updateMany(
      { status: 'quarantined' },
      { $set: { status: 'approved' } }
    );

    const approvedCount = result.updated || 0;

    // Send Slack notification
    let slackResult = null;
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('slackbot');
      if (accessToken) {
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        const message = [
          `✅ *Bulk Restoration Sync Complete*`,
          ``,
          `*${approvedCount}* quarantined passages approved and applied to the manuscript.`,
          `Processed by: ${user.full_name || user.email}`,
          `Timestamp: ${timestamp} (PT)`,
          ``,
          `View the beta manuscript: https://your-app.base44.app/beta-manuscript`
        ].join('\n');
        slackResult = await sendSlackDM(accessToken, user.email, message);
      }
    } catch (slackErr) {
      // Don't fail the whole operation if Slack notification fails
      slackResult = { error: slackErr.message };
    }

    return Response.json({
      approved: approvedCount,
      total: approvedCount,
      has_more: result.has_more || false,
      slack_notification: slackResult
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});