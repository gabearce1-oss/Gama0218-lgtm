import { Flame, Heart, Skull, Crosshair, Globe } from 'lucide-react';

const SOUL_METRICS = [
  {
    key: 'moral_weight',
    label: 'Moral Weight',
    icon: Crosshair,
    desc: 'Does the character carry a conscience? Do their choices cost them something?',
  },
  {
    key: 'body_memory',
    label: 'Body Memory',
    icon: Heart,
    desc: 'Physical/sensory grounding — blood, dust, heat, fear. Is the character embodied in the scene?',
  },
  {
    key: 'grief_index',
    label: 'Grief Index',
    icon: Skull,
    desc: 'How much loss and death weight accumulates on the character.',
  },
  {
    key: 'agency_under_fire',
    label: 'Agency Under Fire',
    icon: Flame,
    desc: 'Does the character act or react in combat? Do they have will, or are they swept along?',
  },
  {
    key: 'cultural_reflex',
    label: 'Cultural Reflex',
    icon: Globe,
    desc: 'Chicano identity surfacing instinctively mid-battle — not explained, just there.',
  },
];

function scoreColor(value) {
  if (value == null) return 'text-muted-foreground';
  if (value >= 4) return 'text-emerald-400';
  if (value >= 3) return 'text-amber-400';
  if (value >= 2) return 'text-orange-400';
  return 'text-red-400';
}

function scoreBg(value) {
  if (value == null) return 'border-border bg-card';
  if (value >= 4) return 'border-emerald-500/30 bg-emerald-500/5';
  if (value >= 3) return 'border-amber-500/30 bg-amber-500/5';
  if (value >= 2) return 'border-orange-500/30 bg-orange-500/5';
  return 'border-red-500/30 bg-red-500/5';
}

export default function CharacterSoulSection({ chapter, editMode, formData, setFormData }) {
  const data = editMode ? formData : chapter;

  const scoredMetrics = SOUL_METRICS.filter(m => data?.[m.key] != null);
  const avg = scoredMetrics.length > 0
    ? scoredMetrics.reduce((sum, m) => sum + data[m.key], 0) / scoredMetrics.length
    : null;

  return (
    <div className="rounded-lg border border-border bg-card p-6 mb-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-bold">Character Soul Metrics</h2>
        </div>
        {avg != null && !editMode && (
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Soul Avg</div>
            <div className={`font-mono text-xl font-bold ${scoreColor(avg)}`}>{avg.toFixed(2)}</div>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        The human dimensions beneath the scores — what gives these characters a soul in battle.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SOUL_METRICS.map(({ key, label, icon: Icon, desc }) => {
          const value = data?.[key];
          return (
            <div
              key={key}
              className={`rounded-md border p-4 ${scoreBg(value)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${scoreColor(value)}`} />
                  <span className="text-sm font-semibold">{label}</span>
                </div>
                {editMode ? (
                  <input
                    type="number"
                    step="0.1"
                    value={formData[key] ?? ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: parseFloat(e.target.value) || 0 })
                    }
                    className="w-20 bg-background border border-border rounded-md px-2 py-1 font-mono text-sm text-right focus:outline-none focus:border-amber-500/50"
                  />
                ) : (
                  <span className={`font-mono text-lg font-bold ${scoreColor(value)}`}>
                    {value != null ? value.toFixed(1) : '—'}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}