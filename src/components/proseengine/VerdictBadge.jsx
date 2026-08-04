const STYLES = {
  adopt_shape: { label: 'Adopt shape', cls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  rebuild_governed: { label: 'Rebuild governed', cls: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
  reject_mechanism: { label: 'Reject mechanism', cls: 'border-red-500/40 bg-red-500/10 text-red-300' },
  operational: { label: 'Operational only', cls: 'border-sky-500/40 bg-sky-500/10 text-sky-300' },
};

export default function VerdictBadge({ verdict }) {
  const s = STYLES[verdict] || STYLES.operational;
  return (
    <span className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${s.cls}`}>
      {s.label}
    </span>
  );
}