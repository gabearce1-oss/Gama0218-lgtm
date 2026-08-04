import { ShieldQuestion, Check, X } from 'lucide-react';
import { BENCHMARK_QUEUE, BENCHMARK_QUEUE_FIELDS, CONTROL_LANGUAGE } from '@/lib/thesisFramework';

const Flag = ({ on }) =>
  on ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <X className="h-3.5 w-3.5 text-red-400" />;

const statusCls = (s) =>
  s.startsWith('SOURCED') ? 'text-emerald-300' : s.startsWith('SUPERSEDED') ? 'text-orange-300' : 'text-red-300';

export default function BenchmarkVerificationQueue() {
  return (
    <section className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-400">
        <ShieldQuestion className="h-4 w-4" /> Lane B · Article IX
      </div>
      <h2 className="mt-1 text-xl font-bold">External Benchmark Verification Queue</h2>
      <p className="mt-2 max-w-3xl border-l-2 border-red-500/40 pl-3 text-xs leading-6 text-muted-foreground">
        {CONTROL_LANGUAGE.benchmark}
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
              {BENCHMARK_QUEUE_FIELDS.map((f) => (
                <th key={f} className="px-3 py-2 font-semibold">
                  {f}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BENCHMARK_QUEUE.map((b) => (
              <tr key={b.claim} className="border-b border-border/50 align-top last:border-0">
                <td className="px-3 py-3 font-semibold leading-5">
                  {b.claim}
                  <p className="mt-1 font-normal leading-5 text-muted-foreground">{b.note}</p>
                </td>
                <td className="px-3 py-3 font-mono leading-5 text-muted-foreground">{b.claimed_source}</td>
                <td className="px-3 py-3"><Flag on={b.artifact} /></td>
                <td className="px-3 py-3"><Flag on={b.corpus} /></td>
                <td className="px-3 py-3"><Flag on={b.method} /></td>
                <td className="px-3 py-3"><Flag on={b.reproducible} /></td>
                <td className={`px-3 py-3 font-mono text-[10px] font-semibold uppercase leading-5 ${statusCls(b.status)}`}>
                  {b.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}