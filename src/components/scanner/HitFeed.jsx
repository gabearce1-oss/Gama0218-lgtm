import { useState } from 'react';
import { Activity } from 'lucide-react';
import { CLASS_META, CLASS_KEYS } from '@/lib/locatorMeta';
import HitRow from './HitRow';

export default function HitFeed({ hits }) {
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? hits : hits.filter((h) => h.locator_class === filter);
  const counts = hits.reduce((acc, h) => ({ ...acc, [h.locator_class]: (acc[h.locator_class] || 0) + 1 }), {});

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Activity className="h-4 w-4" /> Live hit feed · {hits.length}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Updates as the crawler writes. Newest first.</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`min-h-9 rounded-md border px-3 py-1.5 text-xs ${filter === 'all' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
        >
          All ({hits.length})
        </button>
        {CLASS_KEYS.filter((k) => counts[k]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={`min-h-9 rounded-md border px-3 py-1.5 text-xs ${filter === k ? CLASS_META[k].style : 'border-border text-muted-foreground'}`}
          >
            {CLASS_META[k].label} ({counts[k]})
          </button>
        ))}
      </div>

      {shown.length ? (
        <div className="mt-4 space-y-2">
          {shown.map((h) => <HitRow key={h.id} hit={h} />)}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">No hits recorded yet. Run a scan to populate the feed.</p>
      )}
    </section>
  );
}