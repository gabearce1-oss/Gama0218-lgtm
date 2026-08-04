import { getTier, TIER_CONFIG } from '@/lib/omega';

export default function OmegaDisplay({ omega, size = 'md' }) {
  const tier = getTier(omega);
  const config = TIER_CONFIG[tier];
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-7xl',
  };
  return (
    <div className="flex flex-col items-start">
      <span className={`font-mono font-bold tracking-tight ${sizes[size]} ${config.text}`}>
        {omega ? omega.toFixed(1) : '—'}
      </span>
      <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-0.5">Ω Omega</span>
    </div>
  );
}