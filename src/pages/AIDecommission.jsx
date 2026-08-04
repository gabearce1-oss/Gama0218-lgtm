import DecommissionOrderCard from '@/components/decommission/DecommissionOrderCard';
import DecommissionedTable from '@/components/decommission/DecommissionedTable';
import AnalyticalToolkit from '@/components/decommission/AnalyticalToolkit';
import RevisedSpecCard from '@/components/decommission/RevisedSpecCard';
import SpssIsolationCard from '@/components/decommission/SpssIsolationCard';
import AiRoleCharterCard from '@/components/decommission/AiRoleCharterCard';
import ScoringCustodyCard from '@/components/decommission/ScoringCustodyCard';
import PublicProcedureCard from '@/components/decommission/PublicProcedureCard';

export default function AIDecommission() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      <DecommissionOrderCard />
      <AiRoleCharterCard />
      <ScoringCustodyCard />
      <SpssIsolationCard />
      <PublicProcedureCard />
      <DecommissionedTable />
      <AnalyticalToolkit />
      <RevisedSpecCard />
    </div>
  );
}