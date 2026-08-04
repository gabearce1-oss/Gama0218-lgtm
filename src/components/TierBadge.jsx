import { getTier, TIER_CONFIG } from '@/lib/omega';

export default function TierBadge({ omega, size = 'sm' }) {
  const tier = getTier(omega);
  const config = TIER_CONFIG[tier];
  const sizeClass = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.badge} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}