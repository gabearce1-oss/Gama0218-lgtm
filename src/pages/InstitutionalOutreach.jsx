import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Building2, Mail, ShieldCheck, Target, Loader2, Filter, Globe } from 'lucide-react';
import InstitutionCard from '@/components/InstitutionCard';
import RolloutTimeline from '@/components/RolloutTimeline';
import {
  STRATEGIC_FRAME, WAVE_CONFIG,
  KPIS, RISK_CHECKLIST, ROADMAP, CHANNELS,
} from '@/lib/outreachData';

export default function InstitutionalOutreach() {
  const [institutions, setInstitutions] = useState([]);
  const [outreach, setOutreach] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchData();
    const unsubInst = base44.entities.Institution.subscribe((event) => {
      if (event.type === 'create') setInstitutions((prev) => [event.data, ...prev]);
      if (event.type === 'update') setInstitutions((prev) => prev.map((i) => (i.id === event.data.id ? event.data : i)));
      if (event.type === 'delete') setInstitutions((prev) => prev.filter((i) => i.id !== event.data.id));
    });
    const unsubOut = base44.entities.OutreachAction.subscribe((event) => {
      if (event.type === 'create') setOutreach((prev) => [event.data, ...prev]);
      if (event.type === 'update') setOutreach((prev) => prev.map((o) => (o.id === event.data.id ? event.data : o)));
      if (event.type === 'delete') setOutreach((prev) => prev.filter((o) => o.id !== event.data.id));
    });
    return () => { unsubInst(); unsubOut(); };
  }, []);

  const fetchData = async () => {
    try {
      const [insts, outs] = await Promise.all([
        base44.entities.Institution.list('-priority', 200),
        base44.entities.OutreachAction.list('-created_date', 200),
      ]);
      setInstitutions(insts);
      setOutreach(outs);
    } catch (err) {
      console.error('Failed to load outreach data:', err);
    }
    setLoading(false);
  };

  const handleStatusChange = async (action, newStatus) => {
    setUpdating(action.id);
    const patch = { status: newStatus };
    if (newStatus === 'replied' && !action.reply_date) patch.reply_date = new Date().toISOString();
    await base44.entities.OutreachAction.update(action.id, patch);
    setOutreach(outreach.map((o) => (o.id === action.id ? { ...o, ...patch } : o)));
    setUpdating(null);
  };

  const handleAddOutreach = async (institution) => {
    const actionId = `OUT-${Date.now().toString().slice(-6)}`;
    const segment = institution.type.toLowerCase().includes('archive') ? 'academic_archive'
      : institution.type.toLowerCase().includes('oral') ? 'oral_history'
      : 'research_center';
    const newAction = {
      action_id: actionId,
      institution_id: institution.institution_id,
      institution_name: institution.name,
      segment,
      rationale: institution.mission_fit,
      priority: institution.priority,
      wave: institution.priority === 'P0' ? 'quiet_first' : institution.priority === 'P1' ? 'formal_second' : 'quiet_first',
      outreach_owner: 'Gabriel Arce',
      status: 'not_started',
      next_action: 'Draft evidence-led inquiry email',
    };
    await base44.entities.OutreachAction.create(newAction);
  };

  const filtered = filter === 'all' ? institutions : institutions.filter((i) => i.priority === filter);
  const sorted = [...filtered].sort((a, b) => (a.priority || 'P3').localeCompare(b.priority || 'P3'));
  const p0Count = institutions.filter((i) => i.priority === 'P0').length;
  const p1Count = institutions.filter((i) => i.priority === 'P1').length;
  const sentCount = outreach.filter((o) => ['sent', 'replied', 'meeting_scheduled', 'meeting_held', 'submitted'].includes(o.status)).length;
  const repliedCount = outreach.filter((o) => ['replied', 'meeting_scheduled', 'meeting_held', 'submitted'].includes(o.status)).length;
  const meetingCount = outreach.filter((o) => ['meeting_scheduled', 'meeting_held'].includes(o.status)).length;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Building2 className="w-4 h-4 text-amber-400" />
          Institutional Search & Outreach Report
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Institutional Outreach</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Validate first, narrate second, scale third — a provenance-disciplined path to institutional hardening.
        </p>
      </div>

      {/* Strategic Frame */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 mb-6">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Executive Communications Posture</div>
            <p className="text-sm text-foreground italic">{STRATEGIC_FRAME}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-red-400">P0 Targets</div>
          <div className="font-mono font-bold text-2xl text-red-400 mt-1">{p0Count}</div>
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-amber-400">P1 Targets</div>
          <div className="font-mono font-bold text-2xl text-amber-400 mt-1">{p1Count}</div>
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-cyan-400">Outreach Sent</div>
          <div className="font-mono font-bold text-2xl text-cyan-400 mt-1">{sentCount}</div>
        </div>
        <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-violet-400">Replies</div>
          <div className="font-mono font-bold text-2xl text-violet-400 mt-1">{repliedCount}</div>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-emerald-400">Meetings</div>
          <div className="font-mono font-bold text-2xl text-emerald-400 mt-1">{meetingCount}</div>
        </div>
      </div>

      {/* Outreach Waves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {WAVE_CONFIG.map((wave, idx) => {
          const colorMap = { red: 'border-red-500/30 bg-red-500/5 text-red-400', amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400', cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400', violet: 'border-violet-500/30 bg-violet-500/5 text-violet-400' };
          return (
            <div key={wave.key} className={`rounded-lg border p-4 ${colorMap[wave.color]}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold">Wave {idx + 1}</span>
                <span className="text-sm font-bold">{wave.label}</span>
              </div>
              <p className="text-xs text-foreground mb-1">{wave.desc}</p>
              <div className="text-[10px] text-muted-foreground mt-1">
                <span className="font-bold">Goal:</span> {wave.goal}<br />
                <span className="font-bold">Signal:</span> {wave.signal}
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Table */}
      <div className="rounded-lg border border-border bg-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider">KPI Targets</h2>
        </div>
        <div className="grid grid-cols-4 gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">
          <div>KPI</div>
          <div className="text-center">30-Day</div>
          <div className="text-center">90-Day</div>
          <div className="text-center">180-Day</div>
        </div>
        {KPIS.map((kpi) => (
          <div key={kpi.kpi} className="grid grid-cols-4 gap-2 px-2 py-1.5 border-b border-border/50 last:border-0 text-xs">
            <div className="text-foreground">{kpi.kpi}</div>
            <div className="text-center font-mono text-muted-foreground">{kpi.d30}</div>
            <div className="text-center font-mono text-amber-400">{kpi.d90}</div>
            <div className="text-center font-mono text-emerald-400">{kpi.d180}</div>
          </div>
        ))}
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        {['all', 'P0', 'P1', 'P2', 'P3'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
              filter === f
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Institution Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No institutions loaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {sorted.map((inst) => (
            <InstitutionCard
              key={inst.id}
              institution={inst}
              outreach={outreach}
              onStatusChange={handleStatusChange}
              onAddOutreach={handleAddOutreach}
              updating={updating}
            />
          ))}
        </div>
      )}

      {/* Rollout Timeline */}
      <div className="mb-8">
        <RolloutTimeline />
      </div>

      {/* Roadmap */}
      <div className="rounded-lg border border-border bg-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider">Prioritized Roadmap</h2>
        </div>
        <div className="space-y-4">
          {ROADMAP.map((phase) => (
            <div key={phase.horizon} className="border-b border-border/50 pb-4 last:border-0">
              <div className="text-sm font-bold text-amber-400 mb-1">{phase.horizon}</div>
              <div className="text-xs text-foreground mb-1">{phase.actions}</div>
              <div className="text-xs text-emerald-400 italic">✓ {phase.success}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Channels */}
      <div className="rounded-lg border border-border bg-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider">Recommended Channels</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CHANNELS.map((ch) => (
            <div key={ch.channel} className="rounded-md border border-border bg-background/50 p-3">
              <div className="text-sm font-bold text-foreground">{ch.channel}</div>
              <div className="text-xs text-muted-foreground mt-1"><span className="font-bold text-emerald-400">Use for:</span> {ch.useFor}</div>
              <div className="text-xs text-muted-foreground mt-0.5"><span className="font-bold text-red-400">Caution:</span> {ch.caution}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Checklist */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider">Risk & Ethics Checklist</h2>
        </div>
        <div className="space-y-2">
          {RISK_CHECKLIST.map((risk) => (
            <div key={risk.area} className="flex items-start gap-3 border-b border-border/50 pb-2 last:border-0">
              <span className="font-mono text-xs font-bold text-amber-400 shrink-0 w-40">{risk.area}</span>
              <span className="text-xs text-muted-foreground">{risk.rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}