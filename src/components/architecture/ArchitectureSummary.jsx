import { BookOpen, Sigma, AlertTriangle, CircleDot } from 'lucide-react';

const cards = [
  { key: 'total', label: 'Chapters', icon: BookOpen },
  { key: 'scored', label: 'Scored', icon: CircleDot },
  { key: 'meanOmega', label: 'Mean Ω', icon: Sigma },
  { key: 'weak', label: 'Weak-point flags', icon: AlertTriangle },
];

export default function ArchitectureSummary({ metrics }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon }) => (
        <div key={key} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{label}</span><Icon className="h-4 w-4 text-amber-400" /></div>
          <p className="mt-3 font-mono text-2xl font-bold">{key === 'meanOmega' ? metrics[key].toFixed(2) : metrics[key]}</p>
          {key === 'scored' && <p className="mt-1 text-xs text-muted-foreground">{metrics.unscored} unscored</p>}
          {key === 'weak' && <p className="mt-1 text-xs text-muted-foreground">Require review</p>}
        </div>
      ))}
    </div>
  );
}