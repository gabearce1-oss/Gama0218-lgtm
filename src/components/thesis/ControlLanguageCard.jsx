import { Gavel } from 'lucide-react';
import { CONTROL_LANGUAGE } from '@/lib/thesisFramework';

export default function ControlLanguageCard() {
  return (
    <section className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <Gavel className="h-4 w-4" /> Governing language · preserve verbatim
      </div>
      <p className="mt-3 border-l-2 border-amber-400 pl-4 text-sm leading-7">{CONTROL_LANGUAGE.governing}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {CONTROL_LANGUAGE.standing.map((s) => (
          <span
            key={s}
            className="rounded border border-red-500/40 bg-red-500/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-red-300"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}