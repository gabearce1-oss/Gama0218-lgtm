import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, X } from 'lucide-react';

export default function SkillTriggerEditor({ skill, onChanged }) {
  const [draft, setDraft] = useState('');
  const triggers = skill.triggers || [];

  const save = async (next) => {
    await base44.entities.Skill.update(skill.id, { triggers: next });
    onChanged?.();
  };

  const add = async () => {
    const v = draft.trim();
    if (!v || triggers.includes(v)) return;
    setDraft('');
    await save([...triggers, v]);
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
        <Zap className="h-3 w-3" /> Trigger conditions
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Words that make this skill fire during revision — scene types, weapons, characters, chapter tags.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {triggers.length ? (
          triggers.map((t) => (
            <Badge key={t} variant="outline" className="gap-1 border-primary/30 bg-primary/5 font-mono text-[11px] text-primary">
              {t}
              <button onClick={() => save(triggers.filter((x) => x !== t))} aria-label={`Remove ${t}`}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">No triggers yet — this skill will never fire on its own.</span>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="e.g. tunnel, napalm, hand-to-hand"
          className="h-9 max-w-xs text-sm"
        />
        <Button size="sm" variant="secondary" onClick={add} disabled={!draft.trim()}>Add trigger</Button>
      </div>
    </div>
  );
}