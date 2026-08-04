import { CODE_LABELS, matrixCellColor, codeColor } from '@/lib/codeSwitchColors';

export default function MatrixGrid({ switches, chapters }) {
  const sortedChapters = [...chapters].sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0));

  // Build matrix: chapter_number × matrix_code → count
  const matrix = {};
  const codeCounts = {};
  CODE_LABELS.forEach(c => { codeCounts[c.code] = 0; });

  sortedChapters.forEach(ch => {
    matrix[ch.chapter_number] = {};
    CODE_LABELS.forEach(c => { matrix[ch.chapter_number][c.code] = 0; });
  });

  switches.forEach(s => {
    if (!s.matrix_code || !matrix[s.chapter_number]) return;
    if (matrix[s.chapter_number][s.matrix_code] !== undefined) {
      matrix[s.chapter_number][s.matrix_code]++;
      codeCounts[s.matrix_code]++;
    }
  });

  const maxCell = Math.max(1, ...Object.values(matrix).flatMap(ch => Object.values(ch)));

  return (
    <div className="rounded-lg border border-border bg-card p-5 mb-6 overflow-x-auto">
      <h2 className="text-lg font-bold mb-1">Matrix Code × Chapter Grid</h2>
      <p className="text-sm text-muted-foreground mb-4">Where each language code appears across the manuscript. Darker = denser switching.</p>

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 pr-3 text-left text-muted-foreground font-medium sticky left-0 bg-card">Ch.</th>
            {CODE_LABELS.map(c => (
              <th key={c.code} className="py-2 px-1.5 text-center font-mono text-[10px] text-muted-foreground" title={c.label}>
                {c.code}
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
                {CODE_LABELS.map(c => {
                  const count = row[c.code] || 0;
                  return (
                    <td key={c.code} className={`py-1 px-1 text-center font-mono text-[10px] ${matrixCellColor(count, maxCell)}`}>
                      {count > 0 ? count : '·'}
                    </td>
                  );
                })}
                <td className="py-1 pl-2 text-center font-mono text-[10px] font-bold text-amber-400">{rowTotal > 0 ? rowTotal : ''}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border">
            <td className="py-2 pr-3 font-mono text-[10px] text-muted-foreground font-bold sticky left-0 bg-card">Σ</td>
            {CODE_LABELS.map(c => (
              <td key={c.code} className="py-2 px-1 text-center font-mono text-[10px] font-bold text-amber-400">
                {codeCounts[c.code] > 0 ? codeCounts[c.code] : '·'}
              </td>
            ))}
            <td className="py-2 pl-2 text-center font-mono text-[10px] font-bold text-amber-400">
              {switches.length}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Code legend */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
        {CODE_LABELS.map(c => (
          <span key={c.code} className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-mono ${codeColor(c.code)}`}>
            {c.code}
          </span>
        ))}
      </div>
    </div>
  );
}