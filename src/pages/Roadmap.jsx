import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Map, Zap, Clock, Archive } from 'lucide-react';
import SprintCalendar from '@/components/SprintCalendar';

const PRIORITY_CONFIG = {
  immediate: { label: 'Immediate', className: 'border-red-500/30 text-red-400 bg-red-500/5', icon: Zap },
  next: { label: 'Next', className: 'border-amber-500/30 text-amber-400 bg-amber-500/5', icon: Clock },
  routine: { label: 'Routine', className: 'border-slate-400/30 text-slate-400 bg-slate-400/5', icon: Archive },
};

export default function Roadmap() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Chapter.list().then((data) => {
      setChapters(data);
      setLoading(false);
    });
  }, []);

  const priorityChapters = chapters
    .filter((c) => c.priority && c.priority !== 'routine')
    .sort((a, b) => {
      const order = { immediate: 0, next: 1, routine: 2 };
      return (order[a.priority] || 2) - (order[b.priority] || 2);
    });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Map className="w-4 h-4 text-amber-400" />
          Scoring & Revision Roadmap
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Editorial Roadmap</h1>
        <p className="text-muted-foreground mt-1 text-sm">Prioritized scoring queue and four-week sprint calendar</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Priority Scoring Queue</h2>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {priorityChapters.map((chapter) => {
              const config = PRIORITY_CONFIG[chapter.priority] || PRIORITY_CONFIG.routine;
              const Icon = config.icon;
              return (
                <Link
                  key={chapter.id}
                  to={`/chapter/${chapter.id}`}
                  className={`flex items-center gap-4 rounded-lg border p-4 hover:scale-[1.01] transition-transform ${config.className}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">Ch.{String(chapter.chapter_number).padStart(2, '0')}</span>
                      <span className="font-bold text-sm">{chapter.title}</span>
                    </div>
                    {chapter.priority_reason && (
                      <p className="text-xs text-muted-foreground mt-1">{chapter.priority_reason}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border ${config.className}`}>{config.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Sprint Calendar — Jun 29 → Jul 27</h2>
        <SprintCalendar />
      </div>
    </div>
  );
}