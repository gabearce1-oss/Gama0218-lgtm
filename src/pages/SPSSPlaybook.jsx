import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Sigma, Loader2 } from 'lucide-react';
import CustodyRoleCard from '@/components/spss/CustodyRoleCard';
import LabShell from '@/components/spss/LabShell';
import ExtractDownloads from '@/components/spss/ExtractDownloads';
import ProtocolSteps from '@/components/spss/ProtocolSteps';
import TestPlanBuilder from '@/components/spss/TestPlanBuilder';
import VariableDictionaryTable from '@/components/spss/VariableDictionaryTable';

export default function SPSSPlaybook() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Chapter.list('chapter_number', 200).then((data) => {
      setChapters(data.filter((c) => c.chapter_number <= 44));
      setLoading(false);
    });
  }, []);

  return (
    <LabShell>
      <div className="mx-auto max-w-6xl p-6 lg:p-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Sigma className="h-4 w-4 text-amber-400" />
            The Lit Lab · Statistical Handoff
          </div>
          <h1 className="text-3xl font-bold tracking-tight">SPSS Playbook</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Extraction bench and protocol for the air-gapped statistical lane. Data leaves here as a clean
            case file; the analysis runs outside and comes back signed.
          </p>
        </div>

        <CustodyRoleCard />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
          </div>
        ) : (
          <>
            <ExtractDownloads chapters={chapters} />
            <TestPlanBuilder chapters={chapters} />
          </>
        )}

        <ProtocolSteps />

        <VariableDictionaryTable />
      </div>
    </LabShell>
  );
}