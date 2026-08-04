import { useCallback, useEffect, useState } from 'react';
import { Siren } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { OPEN_STATES } from '@/lib/failsafe';
import FailsafeStatusBanner from '@/components/failsafe/FailsafeStatusBanner';
import TripwireRegistry from '@/components/failsafe/TripwireRegistry';
import RaiseTriggerDialog from '@/components/failsafe/RaiseTriggerDialog';
import FailsafeEventRow from '@/components/failsafe/FailsafeEventRow';
import RuleAuthorityCard from '@/components/failsafe/RuleAuthorityCard';
import GuardrailWorkbookExport from '@/components/failsafe/GuardrailWorkbookExport';

export default function FailsafeTrigger() {
  const [events, setEvents] = useState(null);

  const load = useCallback(() => {
    base44.entities.FailsafeEvent.list('-created_date', 100).then(setEvents);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!events) return <div className="p-8 text-muted-foreground">Loading failsafe state…</div>;

  const openCounts = events.reduce((acc, e) => {
    if (OPEN_STATES.includes(e.trigger_state) && e.tripwire_id) {
      acc[e.tripwire_id] = (acc[e.tripwire_id] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      <header>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-400">
          <Siren className="h-4 w-4" /> Guardrail · failsafe
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">Failsafe Trigger</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          One place where breaches, access anomalies, missed data and guardrail examinations land. A tripped wire halts the
          pipeline and stays open until a named human contains it and signs it off.
        </p>
      </header>

      <FailsafeStatusBanner events={events} />
      <RaiseTriggerDialog onRaised={load} />
      <TripwireRegistry counts={openCounts} />

      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-bold">Trigger log</h2>
        <p className="mt-1 text-sm text-muted-foreground">Newest first. Nothing is deleted — clearance is recorded, not erased.</p>
        {events.length ? (
          <div className="mt-4 space-y-3">
            {events.map((e) => <FailsafeEventRow key={e.id} event={e} onChanged={load} />)}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No triggers recorded yet.</p>
        )}
      </section>

      <GuardrailWorkbookExport events={events} />
      <RuleAuthorityCard />
    </div>
  );
}