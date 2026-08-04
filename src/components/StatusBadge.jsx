const STATUS_CONFIG = {
  scored: { label: 'Scored', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  pending: { label: 'Pending', className: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  blocker: { label: 'Blocker', className: 'bg-red-500/10 text-red-400 border-red-500/30' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}