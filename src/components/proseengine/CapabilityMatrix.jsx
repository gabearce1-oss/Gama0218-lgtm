import { useState } from 'react';
import { ListChecks } from 'lucide-react';
import { CAPABILITIES } from '@/lib/proseEngineAudit';
import CapabilityRow from './CapabilityRow';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'adopt_shape', label: 'Adopt shape' },
  { key: 'rebuild_governed', label: 'Rebuild governed' },
  { key: 'reject_mechanism', label: 'Reject' },
  { key: 'operational', label: 'Operational' },
];

export default function CapabilityMatrix() {
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? CAPABILITIES : CAPABILITIES.filter((c) => c.verdict === filter);

  return (
    <section className="rounded-lg border border-border bg-card/40 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <ListChecks className="h-4 w-4" /> Capability menu · {CAPABILITIES.length} observed functions
      </div>
      <h2 className="mt-1 text-xl font-bold">What They Do, Where It Would Live Here</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        Each row pairs an observed capability with the pain it solves, our current equivalent, the honest gap, and the
        workbook that would own a vetted version. The verdict column is a governance ruling, not a purchase decision.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = f.key === 'all' ? CAPABILITIES.length : CAPABILITIES.filter((c) => c.verdict === f.key).length;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`min-h-9 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === f.key
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label} <span className="font-mono opacity-70">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 space-y-3">
        {shown.map((item) => (
          <CapabilityRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}