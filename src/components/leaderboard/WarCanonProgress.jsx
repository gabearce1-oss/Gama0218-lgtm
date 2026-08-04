import { Library } from 'lucide-react';
import { canonProgress } from '@/lib/warCanonBenchmarks';
import WarCanonRow from './WarCanonRow';

export default function WarCanonProgress({ chapters }) {
  const rows = canonProgress(chapters);
  const measured = rows.filter((r) => r.mean !== null);
  const met = measured.filter((r) => r.mean >= r.target).length;
  return (
    <section className="mb-6 rounded-lg border border-border bg-card">
      <header className="border-b border-border p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400"><Library className="h-4 w-4" />War canon benchmark</div>
        <h2 className="mt-2 text-lg font-bold">Manuscript Progress vs Top 10 War Canon Standards</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Each reference work contributes only verifiable bibliographic facts and the craft standard it is canonically recognized for. No score is attributed to these books; the value shown is this manuscript's own measured mean for the corresponding dimension across the 44 verified Vault II chapters, compared to the platform's documented 8.5 threshold.
        </p>
        <div className="mt-3 font-mono text-xs text-muted-foreground">{met}/{measured.length} standards met · {rows.length - measured.length} not yet measured</div>
      </header>
      <div>{rows.map((entry, idx) => <WarCanonRow key={entry.title} entry={entry} rank={idx + 1} />)}</div>
    </section>
  );
}