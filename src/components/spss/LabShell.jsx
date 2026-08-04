import { Beaker, CircleDot, Thermometer } from 'lucide-react';
import AirlockEntry from './AirlockEntry';

const READOUTS = [
  { label: 'Bench', value: 'ISO-SPSS-001' },
  { label: 'Mode', value: 'AIR-GAPPED' },
  { label: 'Frame', value: 'VAULT II · 44' },
];

/** Visual shell that gives the statistical bench its own laboratory identity. */
export default function LabShell({ children }) {
  return (
    <div className="lab-bench min-h-screen">
      <AirlockEntry />
      <div className="border-b border-cyan-500/20 bg-[#08131a]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-2.5 lg:px-8">
          <div className="flex items-center gap-2">
            <Beaker className="h-4 w-4 text-cyan-300" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">
              The Lit Lab · Literary Measurement Bench
            </span>
          </div>
          {READOUTS.map((r) => (
            <div key={r.label} className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-500/50">{r.label}</span>
              <span className="font-mono text-[10px] tracking-wider text-cyan-100/80">{r.value}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-emerald-300/80">
              <CircleDot className="h-3 w-3 animate-pulse" /> Bench live
            </span>
            <span className="hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-cyan-500/50 sm:flex">
              <Thermometer className="h-3 w-3" /> No model in loop
            </span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}