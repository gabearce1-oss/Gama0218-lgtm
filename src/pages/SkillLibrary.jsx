import { useCallback, useEffect, useState } from 'react';
import { BookMarked } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SkillCard from '@/components/skills/SkillCard';
import SkillImportDialog from '@/components/skills/SkillImportDialog';
import TriggerMatcher from '@/components/skills/TriggerMatcher';

export default function SkillLibrary() {
  const [skills, setSkills] = useState(null);

  const load = useCallback(() => {
    base44.entities.Skill.list('-created_date', 100).then(setSkills);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!skills) return <div className="p-8 text-muted-foreground">Loading skill library…</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 lg:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
            <BookMarked className="h-4 w-4" /> Revision instruments
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">Skill Library</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Your reference skills, stored whole, with the trigger words that make each one fire during a revision.
            A skill is a standard you wrote — it never scores a chapter and never edits prose on its own.
          </p>
        </div>
        <SkillImportDialog onImported={load} />
      </header>

      <TriggerMatcher skills={skills} />

      {skills.length ? (
        <div className="space-y-4">
          {skills.map((s) => <SkillCard key={s.id} skill={s} onChanged={load} />)}
        </div>
      ) : (
        <p className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No skills registered yet. Paste one to begin.
        </p>
      )}
    </div>
  );
}