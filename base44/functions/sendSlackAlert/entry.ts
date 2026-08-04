import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SAFETY_THRESHOLD = 2.0;
const BOT_NAME = 'Ramos Audit Bot';
const BOT_ICON = ':rotating_light:';

async function sendSlackDM(accessToken, userEmail, message) {
  // 1. Look up the Slack user by email
  const lookupRes = await fetch(
    `https://slack.com/api/users.lookupByEmail?email=${encodeURIComponent(userEmail)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const lookupData = await lookupRes.json();
  if (!lookupData.ok) {
    throw new Error(`users.lookupByEmail failed: ${lookupData.error}`);
  }
  const slackUserId = lookupData.user.id;

  // 2. Open a DM channel
  const openRes = await fetch('https://slack.com/api/conversations.open', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ users: slackUserId })
  });
  const openData = await openRes.json();
  if (!openData.ok) {
    throw new Error(`conversations.open failed: ${openData.error}`);
  }
  const channelId = openData.channel.id;

  // 3. Post the message
  const postRes = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel: channelId,
      text: message,
      username: BOT_NAME,
      icon_emoji: BOT_ICON
    })
  });
  const postData = await postRes.json();
  if (!postData.ok) {
    throw new Error(`chat.postMessage failed: ${postData.error}`);
  }

  return { sent: true, channel: channelId, user: slackUserId };
}

function formatBlockerAlert(blocker) {
  const chapters = blocker.affected_chapters?.length
    ? blocker.affected_chapters.map(c => `Ch.${String(c).padStart(2, '0')}`).join(', ')
    : '—';
  const lines = [
    `🚨 *P0 BLOCKER DETECTED*`,
    ``,
    `*${blocker.blocker_id}: ${blocker.title}*`,
    `Severity: ${blocker.severity}`,
    `Affected: ${chapters}`,
  ];
  if (blocker.omega_penalty) lines.push(`Ω Penalty: -${blocker.omega_penalty}`);
  if (blocker.overlap_pct) lines.push(`Overlap: ${blocker.overlap_pct}%`);
  if (blocker.words_at_risk) lines.push(`Words at risk: ${blocker.words_at_risk.toLocaleString()}`);
  if (blocker.description) lines.push(``, blocker.description);
  if (blocker.resolution) lines.push(``, `⚠️ *Resolution:* ${blocker.resolution}`);
  return lines.join('\n');
}

function formatChapterAlert(chapter, oldComposite) {
  const lines = [
    `📉 *CHAPTER SCORE BELOW SAFETY THRESHOLD (${SAFETY_THRESHOLD})*`,
    ``,
    `*Ch.${String(chapter.chapter_number).padStart(2, '0')}: ${chapter.title}*`,
    `Composite Ω: ${chapter.composite?.toFixed(2)}${oldComposite !== undefined && oldComposite !== null ? ` (was ${oldComposite.toFixed(2)})` : ''}`,
    `Tier: ${chapter.tier_label || '—'}`,
    `Risk: ${chapter.risk || '—'}`,
  ];
  if (chapter.triage) lines.push(`Triage: ${chapter.triage}`);
  if (chapter.restoration_notes) lines.push(``, chapter.restoration_notes);
  return lines.join('\n');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('slackbot');

    let message = '';
    let alertType = '';

    if (body.alert_type === 'blocker') {
      // Entity automation payload: event + data
      const blocker = body.data || body.blocker;
      if (!blocker) return Response.json({ error: 'No blocker data' }, { status: 400 });
      alertType = 'blocker';
      message = formatBlockerAlert(blocker);
    } else if (body.alert_type === 'chapter') {
      const chapter = body.data || body.chapter;
      const oldComposite = body.old_data?.composite;
      if (!chapter) return Response.json({ error: 'No chapter data' }, { status: 400 });

      // Only alert if composite actually dropped below threshold
      const newComposite = chapter.composite;
      if (newComposite === undefined || newComposite === null || newComposite >= SAFETY_THRESHOLD) {
        return Response.json({ status: 'skipped', reason: 'composite above threshold' });
      }
      // If old data exists and old was also below threshold and didn't change, skip
      if (oldComposite !== undefined && oldComposite !== null && oldComposite < SAFETY_THRESHOLD && Math.abs(oldComposite - newComposite) < 0.01) {
        return Response.json({ status: 'skipped', reason: 'no meaningful drop' });
      }

      alertType = 'chapter';
      message = formatChapterAlert(chapter, oldComposite);
    } else {
      return Response.json({ error: 'Unknown alert_type' }, { status: 400 });
    }

    const result = await sendSlackDM(accessToken, user.email, message);

    return Response.json({ status: 'sent', alert_type: alertType, ...result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});