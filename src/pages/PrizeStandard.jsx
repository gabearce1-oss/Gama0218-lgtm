import { Link } from 'react-router-dom';
import { Award, Library } from 'lucide-react';
import NonCompetitionDisclaimer from '@/components/prize/NonCompetitionDisclaimer';
import ProcessGuardrailTable from '@/components/prize/ProcessGuardrailTable';
import PrizeSourceList from '@/components/prize/PrizeSourceList';

export default function PrizeStandard() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 lg:p-8">
      <header className="rounded-lg border border-primary/30 bg-primary/5 p-6">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
          <Award className="h-4 w-4" /> Prize standard · governance guardrail
        </div>
        <h1 className="text-3xl font-bold tracking-tight">How a Real Prize Is Judged</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The Pulitzer process, recorded from its own published documentation, then turned into rules this project must
          follow. The point is not to win anything. The point is that the most respected literary judgment in the country
          is run by named humans with no formula — and that is the record being set straight.
        </p>
      </header>

      <NonCompetitionDisclaimer />
      <ProcessGuardrailTable />

      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Library className="h-4 w-4" /> Canon data
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The comparative corpus — roughly 700 texts with their undergraduate, graduate and combined course counts — is held
          verbatim in the Corpus Frame, along with its unknowns, its reception divergence, and the three Chicano/Latin
          American entries it actually contains.
        </p>
        <Link
          to="/corpus-frame"
          className="mt-4 inline-flex min-h-11 items-center rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
        >
          Open the Canon Chart
        </Link>
      </section>

      <PrizeSourceList />
    </div>
  );
}