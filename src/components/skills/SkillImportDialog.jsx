import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FilePlus2 } from 'lucide-react';
import { parseSkillMarkdown } from '@/lib/skillParse';

export default function SkillImportDialog({ onImported }) {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const preview = text.trim() ? parseSkillMarkdown(text, fileName) : null;

  const submit = async () => {
    setBusy(true);
    await base44.entities.Skill.create(parseSkillMarkdown(text, fileName));
    setBusy(false);
    setText('');
    setFileName('');
    setOpen(false);
    onImported?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2"><FilePlus2 className="h-4 w-4" /> Paste a skill</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Register a skill</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">
          Paste the skill markdown. The header lines (Scope, Calibration, Dependency) and § sections are read
          automatically — nothing is rewritten or interpreted.
        </p>
        <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Source file name (optional)" />
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="# SKILL: Name v1.0&#10;## Subtitle&#10;**Scope:** …"
          className="min-h-[220px] font-mono text-xs"
        />
        {preview && (
          <div className="rounded-md border border-border bg-muted/30 p-3 text-xs">
            <div className="font-semibold">{preview.name} {preview.version && `v${preview.version}`}</div>
            <div className="mt-1 text-muted-foreground">
              {preview.sections.length} sections detected{preview.scope && ` · scope: ${preview.scope}`}
            </div>
          </div>
        )}
        <Button onClick={submit} disabled={!text.trim() || busy}>
          {busy ? 'Registering…' : 'Register as draft'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}