import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const OMEGA_THRESHOLD = 105.0;
const BOT_NAME = 'Ramos Pacing Bot';
const BOT_ICON = ':stopwatch:';

async function sendSlackDM(accessToken, userEmail, message) {
  const lookupRes = await fetch(
    `https://slack.com/api/users.lookupByEmail?email=${encodeURIComponent(userEmail)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const lookupData = await lookupRes.json();
  if (!lookupData.ok) throw new Error(`users.lookupByEmail failed: ${lookupData.error}`);

  const openRes = await fetch('https://slack.com/api/conversations.open', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ users: lookupData.user.id })
  });
  const openData = await openRes.json();
  if (!openData.ok) throw new Error(`conversations.open failed: ${openData.error}`);

  const postRes = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel: openData.channel.id,
      text: message,
      username: BOT_NAME,
      icon_emoji: BOT_ICON
    })
  });
  const postData = await postRes.json();
  if (!postData.ok) throw new Error(`chat.postMessage failed: ${postData.error}`);
  return { channel: openData.channel.id };
}

function formatAlert(draft, omega) {
  const lines = [
    '⏱️ *CHAPTER APPROVED — READY FOR PACING REVIEW*',
    '',
    `*Ch.${String(draft.chapter_number).padStart(2, '0')}: ${draft.chapter_title || 'Untitled'}*`,
    `Cooked Ω: ${omega.toFixed(3)} (threshold ${OMEGA_THRESHOLD})`,
  ];
  if (draft.original_omega != null) lines.push(`Original Ω: ${draft.original_omega}`);
  if (draft.approved_passages != null) lines.push(`Approved passages: ${draft.approved_passages}`);
  lines.push('', 'No active blockers on this chapter — cleared for pacing review.');
  return lines.join('\n');
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const draftId = body.draft_id;
    if (!draftId) return Response.json({ error: 'draft_id required' }, { status: 400 });

    const draft = await base44.asServiceRole.entities.RestorationDraft.get(draftId);
    if (!draft) return Response.json({ error: 'Draft not found' }, { status: 404 });

    const omega = Number(draft.cooked_omega);
    if (!Number.isFinite(omega) || omega < OMEGA_THRESHOLD) {
      return Response.json({ status: 'skipped', reason: 'omega below threshold', omega: draft.cooked_omega });
    }

    const blockers = await base44.asServiceRole.entities.Blocker.filter({ status: 'active' });
    const chapterBlocked = (blockers || []).some(b =>
      (b.affected_chapters || []).map(Number).includes(Number(draft.chapter_number))
    );
    if (chapterBlocked) {
      return Response.json({ status: 'skipped', reason: 'active blocker on chapter' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('slackbot');
    const users = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    const recipients = (users || []).map(u => u.email).filter(Boolean);
    if (recipients.length === 0) {
      return Response.json({ status: 'skipped', reason: 'no reviewer recipients' });
    }

    const message = formatAlert(draft, omega);
    const results = [];
    for (const email of recipients) {
      try {
        const r = await sendSlackDM(accessToken, email, message);
        results.push({ email, sent: true, ...r });
      } catch (err) {
        results.push({ email, sent: false, error: err.message });
      }
    }

    return Response.json({ status: 'sent', chapter_number: draft.chapter_number, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}