import { computeOmega as govComputeOmega } from '@/lib/governance';

// Re-export from governance single source of truth
export const computeOmega = govComputeOmega;

export function getTier(omega) {
  if (!omega || omega === 0) return 'unscored';
  if (omega >= 109.5) return 'elite';
  if (omega >= 108) return 'near-elite';
  if (omega >= 106) return 'strong';
  if (omega >= 103) return 'mid';
  return 'weak';
}

export const TIER_CONFIG = {
  elite: { label: 'Elite', color: '#C9A84C', dot: 'bg-amber-400', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  'near-elite': { label: 'Near-Elite', color: '#C0C0C0', dot: 'bg-slate-300', text: 'text-slate-300', badge: 'bg-slate-400/10 text-slate-300 border-slate-400/30' },
  strong: { label: 'Strong', color: '#2DD4BF', dot: 'bg-teal-400', text: 'text-teal-400', badge: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
  mid: { label: 'Mid', color: '#F59E0B', dot: 'bg-orange-400', text: 'text-orange-400', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  weak: { label: 'Weak', color: '#EF4444', dot: 'bg-red-400', text: 'text-red-400', badge: 'bg-red-500/10 text-red-400 border-red-500/30' },
  unscored: { label: 'Unscored', color: '#6B7280', dot: 'bg-gray-600', text: 'text-gray-500', badge: 'bg-gray-500/10 text-gray-500 border-gray-500/30' },
};