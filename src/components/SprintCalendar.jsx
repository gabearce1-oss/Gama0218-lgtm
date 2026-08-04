const WEEKS = [
  {
    week: 1,
    label: 'Week 1',
    dates: 'Jun 29 – Jul 5',
    tasks: [
      { lane: 'Sync & Blocker Work', title: 'Resolve DUP-001', chapter: 'Ch.17' },
      { lane: 'Sync & Blocker Work', title: 'Resolve DUP-002', chapter: 'Ch.13' },
      { lane: 'Sync & Blocker Work', title: 'Resolve DUP-003', chapter: 'Ch.16' },
    ],
  },
  {
    week: 2,
    label: 'Week 2',
    dates: 'Jul 6 – 12',
    tasks: [
      { lane: 'Priority Scoring', title: 'Score Ch.17 — Boundary Shift', chapter: 'Ch.17' },
      { lane: 'Priority Scoring', title: 'Score Ch.25 — Sacred Heart Battle', chapter: 'Ch.25' },
    ],
  },
  {
    week: 3,
    label: 'Week 3',
    dates: 'Jul 13 – 19',
    tasks: [
      { lane: 'Priority Scoring', title: 'Score Ch.40 — Ares: Death of a God', chapter: 'Ch.40' },
      { lane: 'Structural Recovery', title: 'Act III chapter mapping', chapter: 'Ch.33-45' },
    ],
  },
  {
    week: 4,
    label: 'Week 4',
    dates: 'Jul 20 – 26',
    tasks: [
      { lane: 'Archival Package', title: 'Consolidate audit reports', chapter: 'All' },
      { lane: 'Archival Package', title: 'Final Ω baseline lock', chapter: 'All' },
    ],
  },
];

const LANE_COLORS = {
  'Sync & Blocker Work': 'border-red-500/30 bg-red-500/5',
  'Priority Scoring': 'border-amber-500/30 bg-amber-500/5',
  'Structural Recovery': 'border-teal-500/30 bg-teal-500/5',
  'Archival Package': 'border-slate-400/30 bg-slate-400/5',
};

export default function SprintCalendar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {WEEKS.map((week) => (
        <div key={week.week} className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3">
            <div className="text-sm font-bold">{week.label}</div>
            <div className="text-xs text-muted-foreground font-mono">{week.dates}</div>
          </div>
          <div className="space-y-2">
            {week.tasks.map((task, i) => (
              <div key={i} className={`rounded-md border p-3 ${LANE_COLORS[task.lane]}`}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{task.lane}</div>
                <div className="text-xs font-medium">{task.title}</div>
                <div className="text-[10px] text-muted-foreground font-mono mt-1">{task.chapter}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}