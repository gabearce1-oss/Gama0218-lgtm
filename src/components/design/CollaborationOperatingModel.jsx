import { CheckCircle2, UsersRound } from 'lucide-react';
import { collaborationPractices } from '@/lib/designRoadmap';

export default function CollaborationOperatingModel() {
  return (
    <section className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5">
      <div className="flex items-center gap-2 mb-3">
        <UsersRound className="w-4 h-4 text-emerald-400" />
        <h2 className="text-sm font-bold text-emerald-400">Collaboration Operating Model</h2>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4">A shared operating model keeps product decisions, editorial governance, and engineering delivery aligned as the platform evolves.</p>
      <ul className="space-y-2">
        {collaborationPractices.map((practice) => (
          <li key={practice} className="flex gap-2 text-xs text-foreground/90">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
            <span>{practice}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}