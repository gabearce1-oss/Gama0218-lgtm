import { BookText } from 'lucide-react';
import { APA_SOURCES } from '@/lib/prizeStandard';

export default function PrizeSourceList() {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <BookText className="h-4 w-4" /> References (APA 7)
      </div>
      <ul className="mt-3 space-y-2">
        {APA_SOURCES.map((ref) => (
          <li key={ref} className="text-xs leading-relaxed text-muted-foreground">{ref}</li>
        ))}
      </ul>
    </section>
  );
}