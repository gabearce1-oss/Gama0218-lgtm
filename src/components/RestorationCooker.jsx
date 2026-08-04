import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Flame, Loader2, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Beaker, RotateCcw, FileText, UploadCloud, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RestorationCooker({ approvedCount }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cooking, setCooking] = useState(false);
  const [cookResult, setCookResult] = useState(null);
  const [confirmCook, setConfirmCook] = useState(false);
  const [publishing, setPublishing] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  useEffect(() => {
    fetchDrafts();
    const unsubscribe = base44.entities.RestorationDraft.subscribe((event) => {
      if (event.type === 'create') setDrafts((prev) => [...prev, event.data].sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)));
      if (event.type === 'update') setDrafts((prev) => prev.map((d) => (d.id === event.data.id ? event.data : d)).sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)));
      if (event.type === 'delete') setDrafts((prev) => prev.filter((d) => d.id !== event.data.id));
    });
    return unsubscribe;
  }, []);

  const fetchDrafts = async () => {
    try {
      const data = await base44.entities.RestorationDraft.list('-chapter_number', 100);
      setDrafts(data.sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)));
    } catch (err) {
      console.error('Failed to load drafts:', err);
    }
    setLoading(false);
  };

  const handleCook = async (force = false) => {
    setCooking(true);
    setCookResult(null);
    try {
      const res = await base44.functions.invoke('cookRestoration', { force });
      setCookResult(res.data);
      setConfirmCook(false);
      fetchDrafts();
    } catch (err) {
      setCookResult({ error: err.message });
      setConfirmCook(false);
    }
    setCooking(false);
  };

  const handleExport = async () => {
    setExporting(true);
    setExportResult(null);
    try {
      const res = await base44.functions.invoke('exportBetaToDrive', {});
      setExportResult(res.data);
    } catch (err) {
      setExportResult({ error: err.message });
    }
    setExporting(false);
  };

  const handlePublish = async (draft) => {
    setPublishing(draft.id);
    try {
      const chapters = await base44.entities.Chapter.filter({ chapter_number: draft.chapter_number }, null, 1);
      if (chapters.length > 0) {
        const ch = chapters[0];
        await base44.entities.Chapter.update(ch.id, {
          omega: draft.cooked_omega,
          cls: draft.cooked_cls,
          bis: draft.cooked_bis,
          sii: draft.cooked_sii,
          mrf: draft.cooked_mrf,
          status: 'scored',
        });
      }
      await base44.entities.RestorationDraft.update(draft.id, { status: 'published' });
      await base44.entities.Quarantine.updateMany(
        { chapter_suggestion: draft.chapter_number, status: 'approved' },
        { $set: { status: 'merged' } }
      );
    } catch (err) {
      console.error('Publish failed:', err);
    }
    setPublishing(null);
  };

  const scoredDrafts = drafts.filter((d) => d.cooked_omega != null);
  const withOriginal = scoredDrafts.filter((d) => d.original_omega != null);
  const meanOriginal = withOriginal.length > 0
    ? withOriginal.reduce((s, d) => s + d.original_omega, 0) / withOriginal.length
    : null;
  const meanCooked = scoredDrafts.length > 0
    ? scoredDrafts.reduce((s, d) => s + d.cooked_omega, 0) / scoredDrafts.length
    : 0;
  const totalPassages = drafts.reduce((s, d) => s + (d.approved_passages || 0), 0);
  const publishedCount = drafts.filter((d) => d.status === 'published').length;
  const draftCount = drafts.filter((d) => d.status === 'draft').length;

  return (
    <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-5 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-orange-500/10 border border-orange-500/30 p-2">
            <Beaker className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Preserved Restoration Cookbook</h2>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">Review only</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Stages vetted passages into a second quarantine for editorial review. Nothing can change chapter scores until you approve a verified formula.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {drafts.length > 0 && (
            <>
              <Link
                to="/beta-manuscript"
                className="px-3 py-2 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 inline-flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Preview Beta
              </Link>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="px-3 py-2 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-xs text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                {exporting ? 'Exporting...' : 'Export to Drive'}
              </button>
              <button
                onClick={() => handleCook(true)}
                disabled={cooking}
                className="px-3 py-2 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Re-Cook All
              </button>
            </>
          )}
          <button
            onClick={() => { if (approvedCount > 0) setConfirmCook(true); }}
            disabled={cooking || approvedCount === 0}
            className="px-4 py-2 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium hover:bg-orange-500/20 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {cooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
            {cooking ? 'Cooking...' : 'Cook Restoration'}
          </button>
        </div>
      </div>

      {/* Confirmation */}
      {confirmCook && (
        <div className="rounded-md border border-orange-500/30 bg-orange-500/10 p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-orange-400">Cook {approvedCount} approved passages into chapter drafts?</p>
              <p className="text-xs text-muted-foreground mt-1">
                This evaluates each chapter's restored prose and generates draft Ω scores. Results stay in beta staging — nothing is published to the real chapters. If the cook times out, re-run to continue from where it stopped.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleCook(false)}
                  disabled={cooking}
                  className="px-3 py-1.5 rounded-md bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold hover:bg-orange-500/30 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {cooking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Flame className="w-3.5 h-3.5" />}
                  Start Cooking
                </button>
                <button
                  onClick={() => setConfirmCook(false)}
                  className="px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cook Result */}
      {cookResult && (
        <div className={`rounded-md border p-3 mb-4 ${cookResult.error ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
          {cookResult.error ? (
            <p className="text-sm text-red-400">Cook failed: {cookResult.error}</p>
          ) : (
            <div className="text-sm">
              <span className="font-bold text-emerald-400">
                {cookResult.partial ? 'Partial cook complete:' : 'Cook complete:'}
              </span>{' '}
              <span className="text-foreground">{cookResult.cooked} chapters cooked</span>
              {cookResult.skipped > 0 && <span className="text-muted-foreground"> · {cookResult.skipped} already had drafts</span>}
              {cookResult.errors > 0 && <span className="text-red-400"> · {cookResult.errors} errors</span>}
              {cookResult.partial && <span className="text-orange-400"> · {cookResult.message}</span>}
            </div>
          )}
        </div>
      )}

      {/* Export Result */}
      {exportResult && (
        <div className={`rounded-md border p-3 mb-4 ${exportResult.error ? 'border-red-500/30 bg-red-500/5' : 'border-cyan-500/30 bg-cyan-500/5'}`}>
          {exportResult.error ? (
            <p className="text-sm text-red-400">Export failed: {exportResult.error}</p>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <UploadCloud className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-cyan-400 font-bold">Exported to Google Drive:</span>
              <span className="text-foreground">{exportResult.docs_created} docs created</span>
              {exportResult.errors > 0 && <span className="text-red-400">· {exportResult.errors} errors</span>}
              <a
                href={exportResult.folder_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:underline"
              >
                Open Folder <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      {drafts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="rounded-md border border-border bg-card/50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Drafts</div>
            <div className="font-mono font-bold text-xl text-orange-400 mt-0.5">{draftCount}</div>
          </div>
          <div className="rounded-md border border-border bg-card/50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Published</div>
            <div className="font-mono font-bold text-xl text-emerald-400 mt-0.5">{publishedCount}</div>
          </div>
          <div className="rounded-md border border-border bg-card/50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Passages Cooked</div>
            <div className="font-mono font-bold text-xl text-amber-400 mt-0.5">{totalPassages}</div>
          </div>
          <div className="rounded-md border border-border bg-card/50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mean Ω Before</div>
            <div className="font-mono font-bold text-xl text-muted-foreground mt-0.5">{meanOriginal ? meanOriginal.toFixed(1) : '—'}</div>
          </div>
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-emerald-400">Mean Ω After</div>
            <div className="font-mono font-bold text-xl text-emerald-400 mt-0.5">{meanCooked.toFixed(1)}</div>
          </div>
        </div>
      )}

      {/* Draft List */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
        </div>
      ) : drafts.length > 0 ? (
        <div className="space-y-1.5">
          <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 pb-1">
            <div className="col-span-1">Ch.</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-2 text-center">Before</div>
            <div className="col-span-2 text-center">After</div>
            <div className="col-span-1 text-center">Δ</div>
            <div className="col-span-1 text-center">Passages</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
          {drafts.map((draft) => {
            const delta = draft.original_omega != null ? draft.cooked_omega - draft.original_omega : null;
            const isPositive = delta != null && delta >= 0;
            const isNew = draft.original_omega == null;
            const isPublished = draft.status === 'published';
            return (
              <div
                key={draft.id}
                className={`grid grid-cols-12 gap-2 items-center px-2 py-2 rounded-md border ${
                  isPublished ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border bg-card/30'
                }`}
              >
                <div className="col-span-1 font-mono text-sm font-bold text-muted-foreground">{draft.chapter_number}</div>
                <div className="col-span-4 text-sm truncate">{draft.chapter_title}</div>
                <div className="col-span-2 text-center font-mono text-sm text-muted-foreground">
                  {draft.original_omega != null ? draft.original_omega.toFixed(1) : '—'}
                </div>
                <div className="col-span-2 text-center font-mono text-sm font-bold text-foreground">
                  {draft.cooked_omega?.toFixed(1)}
                </div>
                <div className="col-span-1 text-center">
                  {isNew ? (
                    <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400">NEW</span>
                  ) : (
                    <span className={`inline-flex items-center gap-0.5 font-mono text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {delta >= 0 ? '+' : ''}{delta.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="col-span-1 text-center font-mono text-xs text-amber-400">{draft.approved_passages}</div>
                <div className="col-span-1 text-right">
                  {isPublished ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />
                  ) : (
                    <span className="text-[9px] font-bold text-amber-400">Owner approval</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4">
          <Flame className="w-6 h-6 text-orange-400/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">
            {approvedCount > 0
              ? `${approvedCount} approved passages ready to cook. Click "Cook Restoration" to generate draft scores.`
              : 'No approved passages yet. Approve quarantined passages first, then cook them.'}
          </p>
        </div>
      )}
    </div>
  );
}