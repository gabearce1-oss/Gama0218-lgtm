import { Languages } from 'lucide-react';
import { CLS_DOCTRINE } from '@/lib/thesisFramework';

export default function ChicanoLensDoctrine() {
  return (
    <section className="rounded-lg border border-border bg-card/40 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <Languages className="h-4 w-4" /> Chicano Lens · CLS doctrine
      </div>
      <h2 className="mt-1 text-xl font-bold">Cultural Function, Not Spanish Density</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-red-400">CLS is not</div>
          <ul className="mt-2 space-y-1.5">
            {CLS_DOCTRINE.is_not.map((x) => (
              <li key={x} className="flex gap-2 text-xs leading-5 text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">CLS measures</div>
          <ul className="mt-2 space-y-1.5">
            {CLS_DOCTRINE.is.map((x) => (
              <li key={x} className="flex gap-2 text-xs leading-5 text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-4 border-l-2 border-amber-400 pl-3 text-sm leading-6">{CLS_DOCTRINE.consequence}</p>
    </section>
  );
}