import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ChefHat, Shield, Gavel, FileCheck, GitBranch, Lock, AlertTriangle, Ban, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CookPacketQueue from '@/components/staging/CookPacketQueue';
import ReviewQueue from '@/components/staging/ReviewQueue';
import V25PromotionGatePanel from '@/components/staging/V25PromotionGatePanel';
import GabeRulingsPanel from '@/components/staging/GabeRulingsPanel';
import { RF15_FORMULA, OMEGA_CEILING_RF15, VCL_EXEMPT_CHAPTERS, LOCKED_FACTS, ALLOWED_ACTIONS, FORBIDDEN_ACTIONS, computeBlockStatus } from '@/lib/stagingGovernance';

export default function StagingPass() {
  const [chapters, setChapters] = useState([]);
  const [packets, setPackets] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [rulings, setRulings] = useState([]);
  const [quarantineCount, setQuarantineCount] = useState(0);
  const [blockerCount, setBlockerCount] = useState(0);

  useEffect(() => {
    base44.entities.Chapter.list('-chapter_number', 100).then(setChapters);
    base44.entities.CookPacket.list('-created_date', 200).then(setPackets);
    base44.entities.CookOutput.list('-created_date', 200).then(setOutputs);
    base44.entities.GabeRuling.list('-created_date', 200).then(setRulings);
    base44.entities.QuarantineLog.list('-created_date', 200).then(d => setQuarantineCount(d.length));
    base44.entities.Blocker.filter({ status: 'active' }).then(d => setBlockerCount(d.length));
  }, []);

  const blockedChapters = chapters.filter(c => computeBlockStatus(c) !== null);
  const pendingPackets = packets.filter(p => p.packet_status === 'READY_FOR_GEMINI').length;
  const pendingReview = outputs.filter(o => o.output_status === 'COOKED_PENDING_REVIEW').length;
  const pendingRulings = rulings.filter(r => r.promoted_status === 'NOT_REVIEWED').length;

  const stats = [
    { label: 'Cook Packets Ready', value: pendingPackets, icon: ChefHat, color: 'text-amber-400' },
    { label: 'Review Queue', value: pendingReview, icon: FileCheck, color: 'text-cyan-400' },
    { label: 'Gabe Rulings Pending', value: pendingRulings, icon: Gavel, color: 'text-amber-400' },
    { label: 'Quarantine Log', value: quarantineCount, icon: Shield, color: 'text-amber-400' },
    { label: 'Active Blockers', value: blockerCount, icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Blocked Chapters', value: blockedChapters.length, icon: Ban, color: 'text-red-400' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <ChefHat className="w-4 h-4 text-amber-400" />
          Kitchen Pass Console
        </div>
        <h1 className="text-3xl font-bold tracking-tight">LitCentral Staging Pass</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Base44 = kitchen pass · Gemini = cook · Gabe = canon authority. Display, stage, route, filter, and protect — never auto-promote.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-3 text-center">
            <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
            <div className="font-mono font-bold text-xl">{s.value}</div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {blockedChapters.length > 0 && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Ban className="w-4 h-4 text-red-400" />
            <span className="text-sm font-bold text-red-400">{blockedChapters.length} chapters blocked from canon/export</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {blockedChapters.map(c => (
              <span key={c.id} className="text-[10px] font-mono px-2 py-0.5 rounded border border-red-500/30 bg-red-500/10 text-red-400">
                Ch.{c.chapter_number}: {computeBlockStatus(c)}
              </span>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="packets">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="packets"><ChefHat className="w-3.5 h-3.5 mr-1.5" />Cook Packets</TabsTrigger>
          <TabsTrigger value="review"><FileCheck className="w-3.5 h-3.5 mr-1.5" />Review Queue</TabsTrigger>
          <TabsTrigger value="v25"><GitBranch className="w-3.5 h-3.5 mr-1.5" />V25 Gate</TabsTrigger>
          <TabsTrigger value="rulings"><Gavel className="w-3.5 h-3.5 mr-1.5" />Gabe Rulings</TabsTrigger>
          <TabsTrigger value="governance"><Shield className="w-3.5 h-3.5 mr-1.5" />Governance</TabsTrigger>
        </TabsList>

        <TabsContent value="packets"><CookPacketQueue /></TabsContent>
        <TabsContent value="review"><ReviewQueue /></TabsContent>
        <TabsContent value="v25"><V25PromotionGatePanel /></TabsContent>
        <TabsContent value="rulings"><GabeRulingsPanel /></TabsContent>
        <TabsContent value="governance">
          <div className="space-y-6">
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 mb-2"><Lock className="w-4 h-4 text-amber-400" /><span className="text-sm font-bold text-amber-400">Candidate Formula (v25 STAGING_NON_CANON)</span></div>
              <p className="font-mono text-sm text-foreground">{RF15_FORMULA}</p>
              <p className="text-xs text-muted-foreground mt-1">Ceiling: {OMEGA_CEILING_RF15} · Scores above ceiling → BLOCKED_IMPOSSIBLE_SCORE</p>
              <p className="text-xs text-amber-400 mt-1">Not promoted to canon until Gabe approves via V25 Promotion Gate.</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-400" /><span className="text-sm font-bold">VCL-Exempt Chapters</span></div>
              <p className="text-xs text-muted-foreground">CLS scoring is blocked for: <span className="text-amber-400 font-mono">Ch.{VCL_EXEMPT_CHAPTERS.join(', Ch.')}</span></p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2"><Lock className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-bold">Locked Facts (in every cook packet)</span></div>
              <ul className="space-y-1">
                {LOCKED_FACTS.map((f, i) => <li key={i} className="text-xs text-foreground/90 flex items-start gap-1.5"><Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />{f}</li>)}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2 mb-2"><Check className="w-4 h-4 text-emerald-400" /><span className="text-sm font-bold text-emerald-400">Allowed Actions</span></div>
                <ul className="space-y-0.5">{ALLOWED_ACTIONS.map(a => <li key={a} className="text-[11px] font-mono text-foreground/80">{a}</li>)}</ul>
              </div>
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                <div className="flex items-center gap-2 mb-2"><Ban className="w-4 h-4 text-red-400" /><span className="text-sm font-bold text-red-400">Forbidden Actions</span></div>
                <ul className="space-y-0.5">{FORBIDDEN_ACTIONS.map(a => <li key={a} className="text-[11px] font-mono text-foreground/80 line-through opacity-60">{a}</li>)}</ul>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2"><Ban className="w-4 h-4 text-red-400" /><span className="text-sm font-bold">Automatic Block Rules</span></div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2"><span className="font-mono text-red-400">WORDS = 0</span> → BLOCKED_DRAFT</div>
                <div className="flex items-center gap-2"><span className="font-mono text-red-400">FIX NOTE contains "INITIAL DRAFT"</span> → BLOCKED_DRAFT</div>
                <div className="flex items-center gap-2"><span className="font-mono text-red-400">FIX NOTE contains "timeline conflict"</span> → BLOCKED_TIMELINE_CONFLICT</div>
                <div className="flex items-center gap-2"><span className="font-mono text-red-400">Ch.17, Ch.18, Ch.29 + CLS attempted</span> → BLOCKED_VCL_EXEMPT</div>
                <div className="flex items-center gap-2"><span className="font-mono text-red-400">Ω &gt; {OMEGA_CEILING_RF15}</span> → BLOCKED_IMPOSSIBLE_SCORE</div>
                <div className="flex items-center gap-2"><span className="font-mono text-red-400">Ch.47 placeholder</span> → blocked from export</div>
                <div className="flex items-center gap-2"><span className="font-mono text-amber-400">v25 not promoted</span> → STAGING only</div>
                <div className="flex items-center gap-2"><span className="font-mono text-amber-400">row quarantined</span> → excluded from export</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}