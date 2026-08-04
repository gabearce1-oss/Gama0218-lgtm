import { useMemo, useState } from 'react';
import { Download, FlaskConical } from 'lucide-react';
import { TEST_CATALOG, SAMPLING_FRAMES, REQUEST_FLOW } from '@/lib/spssTestPlans';
import { buildSyntax, requestId, downloadSyntax, downloadRequestForm } from '@/lib/spssSyntaxGen';
import TestCatalogPicker from './TestCatalogPicker';
import VariableSelector from './VariableSelector';
import SyntaxPreview from './SyntaxPreview';
import ImagingBench from './ImagingBench';
import { applyFrame, computeImaging } from '@/lib/spssImaging';

export default function TestPlanBuilder({ chapters }) {
  const caseCount = chapters.length;
  const [test, setTest] = useState(TEST_CATALOG[0]);
  const [frameId, setFrameId] = useState('ALL');
  const [dv, setDv] = useState('');
  const [factor, setFactor] = useState('');
  const [vars, setVars] = useState([]);

  const frame = SAMPLING_FRAMES.find((f) => f.id === frameId);

  const ready =
    (!test.needs.includes('dv') || dv) &&
    (!test.needs.includes('factor') || factor) &&
    (!(test.needs.includes('vars') || test.needs.includes('ivs')) || vars.length > 0);

  const reqId = useMemo(() => requestId(test.id), [test.id, frameId, dv, factor, vars.join()]);
  const syntax = ready ? buildSyntax({ test, frame, dv, factor, vars, reqId }) : '';

  const framedRows = useMemo(() => applyFrame(chapters, frame), [chapters, frame]);
  const imaging = ready ? computeImaging({ test, rows: framedRows, dv, factor, vars }) : null;

  const selectTest = (t) => {
    setTest(t);
    setDv('');
    setFactor('');
    setVars([]);
  };

  const onChange = (patch) => {
    if ('dv' in patch) setDv(patch.dv);
    if ('factor' in patch) setFactor(patch.factor);
    if ('vars' in patch) setVars(patch.vars);
  };

  const exportBoth = () => {
    downloadSyntax(syntax, reqId);
    downloadRequestForm({ test, frame, dv, factor, vars, reqId, syntax, caseCount });
  };

  return (
    <section className="mb-6">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        <FlaskConical className="h-4 w-4 text-amber-400" /> Test Request Builder
      </h2>

      <div className="rounded-lg border border-border bg-card p-5">
        <ol className="mb-5 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
          {REQUEST_FLOW.map((s, i) => (
            <li key={s} className="flex gap-2">
              <span className="font-mono text-amber-400">{i + 1}.</span> {s}
            </li>
          ))}
        </ol>

        <TestCatalogPicker selectedId={test.id} onSelect={selectTest} />

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sampling frame
              </span>
              <select
                value={frameId}
                onChange={(e) => setFrameId(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-amber-500/50 focus:outline-none"
              >
                {SAMPLING_FRAMES.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </label>

            <VariableSelector test={test} dv={dv} factor={factor} vars={vars} onChange={onChange} />
          </div>

          <SyntaxPreview test={test} syntax={syntax} ready={ready} />
        </div>

        <div className="mt-5">
          <ImagingBench imaging={imaging} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <span className="font-mono text-xs text-muted-foreground">{reqId}</span>
          <button
            onClick={exportBoth}
            disabled={!ready}
            className="ml-auto inline-flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" /> Generate request form + syntax
          </button>
        </div>
      </div>
    </section>
  );
}