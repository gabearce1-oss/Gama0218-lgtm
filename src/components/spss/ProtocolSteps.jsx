import { PROTOCOL_STEPS } from '@/lib/spssProtocol';

export default function ProtocolSteps() {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Handoff Protocol</h2>
      <div className="space-y-2">
        {PROTOCOL_STEPS.map((s) => (
          <div key={s.id} className="flex gap-4 rounded-lg border border-border bg-card p-4">
            <div className="shrink-0 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 font-mono text-xs font-bold text-amber-400">
              {s.id}
            </div>
            <div>
              <div className="text-sm font-semibold">{s.name}</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}