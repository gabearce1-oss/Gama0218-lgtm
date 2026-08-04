import { Table2 } from 'lucide-react';
import { CODEBOOK_COLUMNS, DATA_CLASS_CODES } from '@/lib/measurementConstitution';

export default function CodebookColumnSpec() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-400 mb-1">
        <Table2 className="w-4 h-4" /> Codebook architecture · USC VM2 model
      </div>
      <h2 className="text-lg font-bold">Required Fields for Every Variable</h2>
      <p className="text-xs text-muted-foreground mt-1 mb-4">
        Modelled on the VM2 source-file dictionary: name, definition, permitted values, data type, size, and an explicit
        modeled-data designation that separates probability estimates from reported facts. SPSS <span className="font-mono">CODEBOOK</span> output
        must agree with this sheet before analysis begins.
      </p>
      <div className="space-y-1.5">
        {CODEBOOK_COLUMNS.map((c) => (
          <div key={c.field} className="flex flex-col gap-0.5 rounded-md border border-border/60 bg-background/40 p-2.5 text-xs sm:flex-row sm:gap-4">
            <span className="font-mono text-cyan-400 sm:w-72 shrink-0">{c.field}</span>
            <span className="text-muted-foreground">{c.purpose}</span>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Permitted data classes</div>
        <div className="flex flex-wrap gap-1.5">
          {DATA_CLASS_CODES.map((d) => (
            <span key={d} className="rounded bg-emerald-500/10 px-2 py-1 font-mono text-[10px] text-emerald-400">{d}</span>
          ))}
        </div>
      </div>
    </section>
  );
}