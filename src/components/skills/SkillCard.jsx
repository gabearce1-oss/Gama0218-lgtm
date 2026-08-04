import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronRight, Layers, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SkillTriggerEditor from './SkillTriggerEditor';

const STATUS_STYLES = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  draft: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  retired: 'bg-muted text-muted-foreground border-border',
};

export default function SkillCard({ skill, onChanged }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-lg border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 p-5 text-left"
      >
        {open ? <ChevronDown className="mt-1 h-4 w-4 text-primary" /> : <ChevronRight className="mt-1 h-4 w-4 text-muted-foreground" />}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold">{skill.name}</h2>
            {skill.version && <span className="font-mono text-xs text-muted-foreground">v{skill.version}</span>}
            <Badge variant="outline" className={STATUS_STYLES[skill.status] || STATUS_STYLES.draft}>
              {skill.status || 'draft'}
            </Badge>
          </div>
          {skill.subtitle && <p className="mt-1 text-sm text-muted-foreground">{skill.subtitle}</p>}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {skill.scope && <span>Scope: {skill.scope}</span>}
            {skill.sections?.length ? (
              <span className="flex items-center gap-1"><Layers className="h-3 w-3" />{skill.sections.length} sections</span>
            ) : null}
            {skill.dependency && (
              <span className="flex items-center gap-1"><Link2 className="h-3 w-3" />pairs with a dependency</span>
            )}
          </div>
        </div>
      </button>

      <div className="border-t border-border p-5">
        <SkillTriggerEditor skill={skill} onChanged={onChanged} />
      </div>

      {open && (
        <div className="border-t border-border p-5">
          {skill.calibration && (
            <p className="mb-4 rounded-md border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
              <span className="font-semibold text-primary">Calibration:</span> {skill.calibration}
            </p>
          )}
          <div className="prose prose-invert prose-sm max-w-none prose-headings:font-heading prose-table:text-xs prose-th:text-left">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{skill.body_markdown || '_No body recorded._'}</ReactMarkdown>
          </div>
        </div>
      )}
    </section>
  );
}