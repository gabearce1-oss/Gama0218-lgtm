import { FunctionSquare } from 'lucide-react';
import { REVISED_SPEC } from '@/lib/aiDecommission';

export default function RevisedSpecCard() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
        <FunctionSquare className="h-4 w-4" /> Model specification
      </div>
      <h2 className="mt-1 text-xl font-bold tracking-tight">The regression is withdrawn, not re-fitted</h2>

      <div className="mt-4 rounded-md border border-red-500/40 bg-red-500/5 p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-red-400">Withdrawn</div>
        <p className="mt-1.5 font-mono text-xs leading-6 line-through decoration-red-500/60">{REVISED_SPEC.withdrawn}</p>
        <p className="mt-2 text-sm leading-6">{REVISED_SPEC.withdrawn_reason}</p>
      </div>

      <div className="mt-3 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">In force</div>
        <p className="mt-1.5 font-mono text-sm leading-6 text-emerald-200">{REVISED_SPEC.replacement}</p>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {REVISED_SPEC.terms.map((t) => (
              <tr key={t.symbol} className="border-b border-border/40 align-top">
                <td className="py-1.5 pr-3 font-mono text-xs font-semibold text-primary">{t.symbol}</td>
                <td className="py-1.5 pr-3 leading-6">{t.source}</td>
                <td className="py-1.5 whitespace-nowrap font-mono text-[10px] text-muted-foreground">{t.class}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{REVISED_SPEC.weights}</p>
      </div>
    </section>
  );
}