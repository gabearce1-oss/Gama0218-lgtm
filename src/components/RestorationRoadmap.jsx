import { Link } from 'react-router-dom';
import { AlertTriangle, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

const TIER_CONFIG = {
  CR: {
    label: 'Critical — Full Restore',
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'border-red-500/30 bg-red-500/5',
    badge: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
  HI: {
    label: 'High — Significant Loss',
    icon: Wrench,
    color: 'text-amber-400',
    bg: 'border-amber-500/30 bg-amber-500/5',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  ME: {
    label: 'Medium — Focused Repair',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'border-emerald-500/30 bg-emerald-500/5',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
};

export default function RestorationRoadmap({ chapters }) {
  const scored = chapters.filter(c => c.composite !== undefined && c.composite !== null);
  const sorted = [...scored].sort((a, b) => (a.composite || 0) - (b.composite || 0));

  const groups = { CR: [], HI: [], ME: [] };
  sorted.forEach(ch => {
    const tier = ch.tier_label;
    if (groups[tier]) groups[tier].push(ch);
  });

  const tierOrder = ['CR', 'HI', 'ME'];

  return (
    <div className="space-y-6">
      {tierOrder.map(tier => {
        const config = TIER_CONFIG[tier];
        const items = groups[tier];
        if (!items || items.length === 0) return null;
        const Icon = config.icon;

        return (
          <div key={tier} className={`rounded-lg border p-5 ${config.bg}`}>
            <div className="flex items-center gap-2 mb-4">
              <Icon className={`w-5 h-5 ${config.color}`} />
              <h3 className="text-base font-bold">{config.label}</h3>
              <span className={`ml-auto text-xs font-mono px-2 py-0.5 rounded border ${config.badge}`}>
                {items.length} chapter{items.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(ch => (
                <Link
                  key={ch.id}
                  to={`/chapter/${ch.id}`}
                  className="block rounded-md border border-border bg-card/50 p-3 hover:border-amber-500/30 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-muted-foreground">Ch.{String(ch.chapter_number).padStart(2, '0')}</span>
                    <span className={`font-mono text-sm font-bold ${config.color}`}>
                      {ch.composite?.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs font-medium line-clamp-1 mb-2 group-hover:text-amber-400">{ch.title}</div>
                  {ch.triage && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <ArrowRight className="w-2.5 h-2.5" />
                      <span className="line-clamp-1">{ch.triage}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}