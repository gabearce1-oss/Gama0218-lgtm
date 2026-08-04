import { Table2 } from 'lucide-react';
import { OPERATIONALIZATION } from '@/lib/thesisFramework';

const TYPE_CLS = {
  Independent: 'text-sky-300',
  Dependent: 'text-amber-400',
  Benchmark: 'text-orange-300',
  Regressor: 'text-red-300',
};

export default function OperationalizationMatrix() {
  return (
    <section className="rounded-lg border border-border bg-card/40 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
        <Table2 className="h-4 w-4" /> Operationalization matrix
      </div>
      <h2 className="mt-1 text-xl font-bold">Variables, Measured Where</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 font-semibold">Type</th>
              <th className="px-3 py-2 font-semibold">Variable</th>
              <th className="px-3 py-2 font-semibold">Conceptual definition</th>
              <th className="px-3 py-2 font-semibold">Metric / tool</th>
              <th className="px-3 py-2 font-semibold">Warehouse home</th>
              <th className="px-3 py-2 font-semibold">Data class</th>
            </tr>
          </thead>
          <tbody>
            {OPERATIONALIZATION.map((v) => (
              <tr key={v.name} className="border-b border-border/50 align-top last:border-0">
                <td className={`px-3 py-3 font-mono ${TYPE_CLS[v.type]}`}>{v.type}</td>
                <td className="px-3 py-3 font-semibold">{v.name}</td>
                <td className="px-3 py-3 leading-5 text-muted-foreground">{v.definition}</td>
                <td className="px-3 py-3 leading-5 text-muted-foreground">{v.metric}</td>
                <td className="px-3 py-3 font-mono leading-5 text-emerald-300">{v.warehouse}</td>
                <td className="px-3 py-3 font-mono leading-5 text-orange-300">{v.data_class}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}