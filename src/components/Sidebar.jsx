import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Trophy, AlertOctagon, BookOpen, Cloud, Mic, Sigma, Languages, Users, Shield, Bot, Eye, ScrollText, Flame, Bug, Terminal, FileSearch, Gauge, Vault, Building2, ChefHat, Scale, FileBarChart, Palette, ShieldCheck, Landmark, Microscope, BookMarked, Library, Unplug, Siren, Award, ScanSearch, Plug, Sparkles, SigmaSquare } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/design-roadmap', label: 'Design Roadmap', icon: Palette },
  { to: '/moral-scorer', label: 'Moral Scorer', icon: Scale },
  { to: '/staging-pass', label: 'Staging Pass', icon: ChefHat },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/architecture-report', label: 'Architecture Report', icon: FileBarChart },
  { to: '/forensic-screening', label: 'Forensic Screening', icon: Shield }, 
  { to: '/thesis', label: 'Research Thesis', icon: BookMarked },
  { to: '/corpus-frame', label: 'Corpus Frame', icon: Library },
  { to: '/prize-standard', label: 'Prize Standard', icon: Award },
  { to: '/decommission', label: 'AI Decommission', icon: Unplug },
  { to: '/omega-playbook', label: 'Omega Playbook', icon: BookMarked },
  { to: '/spss-playbook', label: 'SPSS Playbook', icon: SigmaSquare },
  { to: '/constitution', label: 'Constitution', icon: Landmark },
  { to: '/evidence-freeze', label: 'Chain of Custody', icon: ShieldCheck },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/blockers', label: 'Blockers', icon: AlertOctagon },
  { to: '/rules', label: 'Rules', icon: BookOpen },
  { to: '/voice-audit', label: 'Voice Audit', icon: Mic },
  { to: '/sensory-heatmap', label: 'Sensory Heatmap', icon: Eye },
  { to: '/code-switching', label: 'Code-Switching', icon: Languages },
  { to: '/code-switch-manager', label: 'CS Manager', icon: Languages },
  { to: '/voice-profiles', label: 'Voice Profiles', icon: Users },
  { to: '/quarantine', label: 'Restoration Cookbook', icon: Shield },
  { to: '/governance', label: 'Governance', icon: ScrollText },
  { to: '/battle-mysticism', label: 'Battle Mysticism', icon: Flame },
  { to: '/skills', label: 'Skill Library', icon: Sparkles },
  { to: '/prompt-master', label: 'PromptMaster', icon: Terminal },
  { to: '/evidence-claims', label: 'Evidence Claims', icon: FileSearch },
  { to: '/document-scanner', label: 'Document Scanner', icon: ScanSearch },
  { to: '/bug-scanner', label: 'Bug Scanner', icon: Bug },
  { to: '/pacing-reviewer', label: 'Pacing Reviewer', icon: Gauge },
  { to: '/quarantine-log', label: 'Quarantine Log', icon: Vault },
  { to: '/external-audit', label: 'External Audit', icon: Microscope },
  { to: '/outreach', label: 'Outreach', icon: Building2 },
  { to: '/failsafe', label: 'Failsafe Trigger', icon: Siren },
  { to: '/guardrail', label: 'Guardrail', icon: Bot },
  { to: '/integration-stack', label: 'Integration Stack', icon: Plug },
  { to: '/cloud', label: 'Cloud', icon: Cloud },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="w-16 sm:w-60 shrink-0 border-r border-border bg-card/50 flex flex-col h-screen sticky top-0">
      <div className="p-3 sm:p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <Sigma className="w-6 h-6 text-amber-400" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-tight">SGT Ramos</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Mathematics of Vietnam</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-2 sm:p-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center justify-center sm:justify-start gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hidden sm:block p-4 border-t border-border">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">RF 1.5 System</div>
        <div className="text-xs text-muted-foreground mt-1">Manuscript Command Dashboard</div>
      </div>
    </aside>
  );
}