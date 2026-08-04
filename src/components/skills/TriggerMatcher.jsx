import { useState } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { matchingSkills } from '@/lib/skillParse';

export default function TriggerMatcher({ skills }) {
  const [scene, setScene] = useState('');
  const hits = matchingSkills(skills, scene);

  return (
    <section className="rounded-lg border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
        <Zap className="h-3 w-3" /> Revision trigger check
      </div>
      <h2 className="mt-2 font-bold">Which skills fire on this scene?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Describe or tag the scene you're about to revise. Matching is literal word matching — no AI, no guessing.
      </p>
      <Input
        value={scene}
        onChange={(e) => setScene(e.target.value)}
        placeholder="e.g. Ch.40 tunnel descent, wounded, hand-to-hand"
        className="mt-4"
      />
      <div className="mt-4">
        {!scene.trim() ? (
          <p className="text-xs text-muted-foreground">Type scene tags above to see the applicable skills.</p>
        ) : hits.length ? (
          <ul className="space-y-2">
            {hits.map((s) => (
              <li key={s.id} className="flex items-start gap-2 rounded-md border border-border bg-card p-3 text-sm">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  <span className="font-semibold">{s.name}</span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    matched: {(s.triggers || []).filter((t) => scene.toLowerCase().includes(t.toLowerCase())).join(', ')}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-300">
            No skill fires on those tags. Either the scene needs no skill, or a trigger word is missing from a skill above.
          </p>
        )}
      </div>
    </section>
  );
}