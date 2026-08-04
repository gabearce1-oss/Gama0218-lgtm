import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Sigma, BookOpen, Trophy, FileText, TrendingUp, Target } from 'lucide-react';
import StatCard from '@/components/StatCard';
import ChapterTable from '@/components/ChapterTable';
import LOCBaselineCard from '@/components/LOCBaselineCard';
import DeepMetricsBreakdown from '@/components/DeepMetricsBreakdown';
import SensoryHeatmapSection from '@/components/SensoryHeatmapSection';
import GovernanceBanner from '@/components/GovernanceBanner';
import OmegaProgressReport from '@/components/OmegaProgressReport';
import OmegaComparisonTable from '@/components/OmegaComparisonTable';
import OmegaTrendChart from '@/components/OmegaTrendChart';
import ManuscriptOmegaProgress from '@/components/ManuscriptOmegaProgress';
import CharacterImpactMatrix from '@/components/CharacterImpactMatrix';
import ManuscriptTemplateDownload from '@/components/ManuscriptTemplateDownload';
import ChapterExportButton from '@/components/ChapterExportButton';
import ManuscriptReadabilitySummary from '@/components/ManuscriptReadabilitySummary';
import ManuscriptSourceStatus from '@/components/ManuscriptSourceStatus';
import { OMEGA_SPEC, gapToCeiling } from '@/lib/governance';

export default function Dashboard() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Chapter.list().then((data) => {
      setChapters(data);
      setLoading(false);
    });
  }, []);

  const vaultIIChapters = chapters.filter((c) => c.chapter_number <= 44);
  const scored = vaultIIChapters.filter((c) => c.omega > 0);
  const meanOmega = scored.length > 0 ? scored.reduce((sum, c) => sum + c.omega, 0) / scored.length : 0;
  const eliteCount = scored.filter((c) => c.omega >= 109.5).length;
  const totalWords = vaultIIChapters.reduce((sum, c) => sum + (c.word_count || 0), 0);
  const sprintHigh = scored.length > 0 ? Math.max(...scored.map((c) => c.omega)) : 0;
  const gapToCeilingVal = gapToCeiling(meanOmega);
  const auditScored = vaultIIChapters.filter((c) => c.omega_audit > 0);
  const auditMean = auditScored.length > 0 ? auditScored.reduce((sum, c) => sum + c.omega_audit, 0) / auditScored.length : 0;
  const auditGap = 111.5 - auditMean;
  const atTarget = auditScored.filter((c) => c.omega_audit >= 111.5).length;
  const pendingCount = vaultIIChapters.filter((c) => c.status === 'pending').length;
  const blockerCount = vaultIIChapters.filter((c) => c.status === 'blocker').length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
            <Sigma className="w-4 h-4 text-amber-400" />
            RF 1.5 Manuscript Command
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">SGT Ramos: The Mathematics of Vietnam</h1>
          <p className="text-muted-foreground mt-1 text-sm">Chapter scoring, revision tracking, and editorial governance dashboard</p>
        </div>
        <ChapterExportButton chapters={chapters} />
      </div>

      <ManuscriptTemplateDownload />

      <GovernanceBanner />

      <ManuscriptSourceStatus />

      <ManuscriptReadabilitySummary chapters={vaultIIChapters} />

      <LOCBaselineCard />

      <DeepMetricsBreakdown />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard label="Mean Ω" value={meanOmega.toFixed(2)} sublabel="of scored chapters" icon={Sigma} accent="gold" />
        <StatCard label="Total Chapters" value={vaultIIChapters.length} sublabel="Vault II verified" icon={BookOpen} />
        <StatCard label="Elite (≥109.5)" value={eliteCount} sublabel={`${scored.length} scored`} icon={Trophy} accent="gold" />
        <StatCard label="Word Count" value={totalWords.toLocaleString()} icon={FileText} />
        <StatCard label="Sprint High" value={sprintHigh.toFixed(1)} sublabel="Ω peak" icon={TrendingUp} accent="gold" />
        <StatCard label="Gap to Ceiling" value={gapToCeilingVal.toFixed(2)} sublabel={`${OMEGA_SPEC.ceiling.toFixed(3)} max`} icon={Target} accent={gapToCeilingVal < 0 ? 'teal' : 'red'} />
      </div>

      {auditMean > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="Audit Mean Ω" value={auditMean.toFixed(2)} sublabel="LitCentral verified" icon={Sigma} accent="gold" />
          <StatCard label="Audit Target" value="111.5" sublabel="v11.5 standard" icon={Target} />
          <StatCard label="Gap to Target" value={auditGap.toFixed(2)} sublabel="points to close" icon={Target} accent={auditGap > 0 ? 'red' : 'teal'} />
          <StatCard label="At Target" value={`${atTarget}/44`} sublabel="≥111.5 Ω" icon={Trophy} accent="gold" />
        </div>
      )}

      <div className="flex items-center gap-4 mb-6 text-sm flex-wrap">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400" />{scored.length} Scored</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" />{pendingCount} Pending</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400" />{blockerCount} Blockers</div>
        <Link to="/roadmap" className="ml-auto text-xs text-amber-400 hover:underline">View Roadmap →</Link>
      </div>

      <OmegaProgressReport />

      <ManuscriptOmegaProgress />

      <OmegaTrendChart />

      <OmegaComparisonTable />

      <CharacterImpactMatrix />

      <SensoryHeatmapSection chapters={vaultIIChapters} />

      <div>
        <h2 className="text-lg font-bold mb-4">Vault II Chapter Registry</h2>
        <ChapterTable chapters={vaultIIChapters} loading={loading} />
      </div>
    </div>
  );
}