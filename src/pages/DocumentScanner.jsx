import { useCallback, useEffect, useState } from 'react';
import { ScanSearch } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ScanRunPanel from '@/components/scanner/ScanRunPanel';
import HitFeed from '@/components/scanner/HitFeed';
import LocatorRegistry from '@/components/scanner/LocatorRegistry';

export default function DocumentScanner() {
  const [locators, setLocators] = useState(null);
  const [run, setRun] = useState(null);
  const [hits, setHits] = useState([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  const loadRun = useCallback(async () => {
    const runs = await base44.entities.ScanRun.list('-created_date', 1);
    setRun(runs[0] || null);
  }, []);

  const loadHits = useCallback(async () => {
    setHits(await base44.entities.ScanHit.list('-created_date', 60));
  }, []);

  useEffect(() => {
    base44.functions
      .invoke('scanDocumentLocators', { listLocators: true })
      .then((r) => setLocators(r.data.locators || []))
      .catch(() => setLocators([]));
    loadRun();
    loadHits();
  }, [loadRun, loadHits]);

  // Real-time: refresh as the crawler writes runs and hits.
  useEffect(() => {
    const unsubHits = base44.entities.ScanHit.subscribe(() => loadHits());
    const unsubRuns = base44.entities.ScanRun.subscribe(() => loadRun());
    return () => {
      unsubHits();
      unsubRuns();
    };
  }, [loadHits, loadRun]);

  const handleRun = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('scanDocumentLocators', { maxFiles: 10 });
      if (res.data.error) setError(res.data.error);
    } catch (e) {
      setError(e.message);
    }
    await loadRun();
    await loadHits();
    setRunning(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
      <header>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
          <ScanSearch className="h-4 w-4" /> Research tooling · document crawler
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">Document Scanner</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Pattern-based locators crawl the connected Drive and pull out chapter boundaries, Spanish and caló tokens,
          sensory vocabulary, dates, units, hardware, hedge language, draft markers and text-recognition damage — each
          with its file, line and character offset so any hit can be re-found by hand.
        </p>
      </header>

      <ScanRunPanel run={run} running={running} error={error} onRun={handleRun} />
      <HitFeed hits={hits} />
      <LocatorRegistry locators={locators} />
    </div>
  );
}