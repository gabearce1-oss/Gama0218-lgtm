import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('supabase');

    const projectsRes = await fetch('https://api.supabase.com/v1/projects', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!projectsRes.ok) {
      const errText = await projectsRes.text();
      return Response.json({ error: `Supabase API error: ${errText}` }, { status: projectsRes.status });
    }

    const projects = await projectsRes.json();

    const projectSummaries = (projects || []).map(p => ({
      id: p.id,
      name: p.name,
      ref: p.ref,
      region: p.region,
      status: p.status,
      created_at: p.created_at,
      organization_id: p.organization_id,
    }));

    return Response.json({
      projects: projectSummaries,
      total: projectSummaries.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});