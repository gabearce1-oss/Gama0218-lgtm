import { chapterSignals } from '@/lib/architectureReport';

const metric = (value) => value?.toFixed?.(1) ?? '—';

export default function ArchitectureTable({ chapters }) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-5"><h2 className="font-bold">Chapter Architecture Ledger</h2><p className="mt-1 text-sm text-muted-foreground">Every chapter in narrative order, with core score and engagement signals.</p></div>
      <div className="overflow-x-auto"><table className="min-w-[1050px] w-full text-sm"><thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground"><tr>{['Ch.', 'Act', 'Title', 'Ω', 'CLS', 'BIS', 'SII', 'MRF', 'Agency', 'Emotion', 'Dialogue', 'Retention', 'Words', 'Review signals'].map((label) => <th key={label} className="px-4 py-3 text-left">{label}</th>)}</tr></thead><tbody>{chapters.map((chapter) => <tr key={chapter.id} className="border-t border-border/60"><td className="px-4 py-3 font-mono">{String(chapter.chapter_number).padStart(2, '0')}</td><td className="px-4 py-3">{chapter.act || '—'}</td><td className="px-4 py-3 font-medium">{chapter.title}</td>{['omega', 'cls', 'bis', 'sii', 'mrf', 'character_agency', 'emotional_resonance', 'dialogue', 'reader_retention'].map((key) => <td key={key} className="px-4 py-3 font-mono text-muted-foreground">{metric(chapter[key])}</td>)}<td className="px-4 py-3 font-mono text-muted-foreground">{chapter.word_count?.toLocaleString() || '—'}</td><td className="px-4 py-3 text-xs text-amber-300">{chapterSignals(chapter).join(' · ') || 'Clear'}</td></tr>)}</tbody></table></div>
    </section>
  );
}