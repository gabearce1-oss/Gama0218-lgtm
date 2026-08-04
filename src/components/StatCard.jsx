export default function StatCard({ label, value, sublabel, icon: Icon, accent = 'default' }) {
  const accentClasses = {
    gold: 'text-amber-400',
    red: 'text-red-400',
    teal: 'text-teal-400',
    default: 'text-foreground',
  };
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        {Icon && <Icon className={`w-4 h-4 ${accentClasses[accent]}`} />}
      </div>
      <div className={`font-mono font-bold text-2xl ${accentClasses[accent]}`}>{value}</div>
      {sublabel && <div className="text-xs text-muted-foreground mt-1">{sublabel}</div>}
    </div>
  );
}