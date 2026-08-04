import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, ArrowUpDown } from 'lucide-react';
import TierBadge from './TierBadge';
import StatusBadge from './StatusBadge';
import { getTier, TIER_CONFIG } from '@/lib/omega';

function ScoreCell({ value }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return (
    <span className={`font-mono ${TIER_CONFIG[getTier(value)].text}`}>{value.toFixed(1)}</span>
  );
}

export default function ChapterTable({ chapters, loading }) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('chapter_number');
  const [sortDir, setSortDir] = useState('asc');
  const [filterAct, setFilterAct] = useState('all');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = chapters.filter((c) => filterAct === 'all' || c.act === filterAct);
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortField] || 0;
    const bv = b[sortField] || 0;
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  const SortHeader = ({ field, children, align = 'right' }) => (
    <th
      className={`px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground cursor-pointer select-none ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}
      onClick={() => handleSort(field)}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}>
        {children} <ArrowUpDown className="w-3 h-3" />
      </div>
    </th>
  );

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-3">
        Click any chapter row to open its scorecard and edit CLS, BIS, SII &amp; MRF sub-scores — Ω recalculates automatically.
      </p>
      <div className="flex items-center gap-2 mb-4">
        {['all', 'I', 'II', 'III'].map((act) => (
          <button
            key={act}
            onClick={() => setFilterAct(act)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterAct === act
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-muted-foreground border border-border hover:text-foreground'
            }`}
          >
            {act === 'all' ? 'All Acts' : `Act ${act}`}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <SortHeader field="chapter_number" align="left">#</SortHeader>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Title</th>
              <SortHeader field="omega">Ω</SortHeader>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">CLS</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">BIS</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">SII</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">MRF</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Tier</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Status</th>
              <SortHeader field="word_count">Words</SortHeader>
              <th className="px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((chapter) => (
              <tr
                key={chapter.id}
                onClick={() => navigate(`/chapter/${chapter.id}`)}
                className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono text-muted-foreground">{String(chapter.chapter_number).padStart(2, '0')}</td>
                <td className="px-4 py-3 font-medium text-foreground hover:text-amber-400 hover:underline">{chapter.title}</td>
                <td className="px-4 py-3 text-right"><ScoreCell value={chapter.omega} /></td>
                <td className="px-4 py-3 text-right font-mono text-muted-foreground">{chapter.cls ? chapter.cls.toFixed(1) : '—'}</td>
                <td className="px-4 py-3 text-right font-mono text-muted-foreground">{chapter.bis ? chapter.bis.toFixed(1) : '—'}</td>
                <td className="px-4 py-3 text-right font-mono text-muted-foreground">{chapter.sii ? chapter.sii.toFixed(1) : '—'}</td>
                <td className="px-4 py-3 text-right font-mono text-muted-foreground">{chapter.mrf ? chapter.mrf.toFixed(1) : '—'}</td>
                <td className="px-4 py-3 text-center"><TierBadge omega={chapter.omega} size="xs" /></td>
                <td className="px-4 py-3 text-center"><StatusBadge status={chapter.status} /></td>
                <td className="px-4 py-3 text-right font-mono text-muted-foreground">{chapter.word_count ? chapter.word_count.toLocaleString() : '—'}</td>
                <td className="px-2 py-3">
                  <span className="inline-flex items-center gap-1 text-xs text-amber-400/70 whitespace-nowrap">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}