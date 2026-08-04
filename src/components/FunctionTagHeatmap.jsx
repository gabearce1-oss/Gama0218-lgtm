import { FUNCTION_TAGS } from '@/lib/codeSwitchData';
import { functionColor } from '@/lib/codeSwitchColors';

export default function FunctionTagHeatmap({ switches, chapters }) {
  const sortedChapters = [...chapters].sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0));

  // Build matrix: chapter_number × function_tag → count
  const matrix = {};
  const tagCounts = {};
  FUNCTION_TAGS.forEach(f => { tagCounts[f.tag] = 0; });

  sortedChapters.forEach(ch => {
    matrix[ch.chapter_number] = {};
    FUNCTION_TAGS.forEach(f => { matrix[ch.chapter_number][f.tag] = 0; });
  });

  switches.forEach(s => {
    if (!s.function_tag || !matrix[s.chapter_number]) return;
    if (matrix[s.chapter_number][s.function_tag] !== undefined) {
      matrix[s.chapter_number][s.function_tag]++;
      tagCounts[s.function_tag]++;
    }
  });

  const maxCell = Math.max(1, ...Object.values(matrix).flatMap(ch => Object.values(ch)));

  return (
    <div className="rounded-lg border border-border bg-card p-5 mb-6 overflow-x-auto">
      <h2 className="text-lg font-bold mb-1">Function Tag × Chapter Heatmap</h2>
      <p className="text-sm text-muted-foreground mb-4">How language shifts function socio-pragmatically across each chapter.</p>

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 pr-3 text-left text-muted-foreground font-medium sticky left-0 bg-card">Ch.</th>
            {FUNCTION_TAGS.map(f => (
              <th key={f.tag} className="py-2 px-1 text-center font-mono text-[9px] text-muted-foreground" title={f.desc}>
                {f.tag.replace('_', ' ')}
              </th>
            ))}
            <th className="py-2 pl-2 text-center text-muted-foreground font-medium">Σ</th>
          </tr>
        </thead>
        <tbody>
          {sortedChapters.map(ch => {
            const row = matrix[ch.chapter_number] || {};
            const rowTotal = Object.values(row).reduce((a, b) => a + b, 0);
            return (
              <tr key={ch.id} className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-1 pr-3 font-mono text-[10px] text-muted-foreground sticky left-0 bg-card">
                  {String(ch.chapter_number).padStart(2, '0')}
                </td>
                {FUNCTION_TAGS.map(f => {
                  const count = row[f.tag] || 0;
                  const ratio = count / maxCell;
                  const bg = count === 0 ? 'bg-muted/10 text-muted-foreground/40' 
                    : ratio >= 0.75 ? 'bg-violet-500/30 text-violet-300 font-bold'
                    : ratio >= 0.5 ? 'bg-violet-500/20 text-violet-400'
                    : ratio >= 0.25 ? 'bg-violet-500/10 text-violet-400/70'
                    : 'bg-violet-500/5 text-muted-foreground';
                  return (
                    <td key={f.tag} className={`py-1 px-1 text-center font-mono text-[10px] ${bg}`}>
                      {count > 0 ? count : '·'}
                    </td>
                  );
                })}
                <td className="py-1 pl-2 text-center font-mono text-[10px] font-bold text-violet-400">{rowTotal > 0 ? rowTotal : ''}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border">
            <td className="py-2 pr-3 font-mono text-[10px] text-muted-foreground font-bold sticky left-0 bg-card">Σ</td>
            {FUNCTION_TAGS.map(f => (
              <td key={f.tag} className="py-2 px-1 text-center font-mono text-[10px] font-bold text-violet-400">
                {tagCounts[f.tag] > 0 ? tagCounts[f.tag] : '·'}
              </td>
            ))}
            <td className="py-2 pl-2 text-center font-mono text-[10px] font-bold text-violet-400">
              {switches.length}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Function tag legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/50">
        {FUNCTION_TAGS.map(f => (
          <div key={f.tag} className="flex items-start gap-2">
            <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[9px] font-mono shrink-0 ${functionColor(f.tag)}`}>
              {f.tag}
            </span>
            <span className="text-[10px] text-muted-foreground">{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}