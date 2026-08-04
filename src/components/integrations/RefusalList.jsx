import { Ban } from 'lucide-react';
import { REFUSALS } from '@/lib/integrationStack';

export default function RefusalList() {
  return (
    <section className="rounded-lg border border-red-500/30 bg-red-500/5 p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-400">
        <Ban className="h-4 w-4" /> Standing refusals
      </div>
      <ul className="mt-3 space-y-2">
        {REFUSALS.map((r) => (
          <li key={r} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
            {r}
          </li>
        ))}
      </ul>
    </section>
  );
}