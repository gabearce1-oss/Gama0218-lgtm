import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Loader2, Download, ArrowLeft, Flame, Beaker, FileUp, ExternalLink, CheckCircle } from 'lucide-react';
import EditorialVerdictBanner from '@/components/beta/EditorialVerdictBanner';
import PassageVettingCard from '@/components/beta/PassageVettingCard';
import { detectGenericPatterns } from '@/lib/betaVetting';

export default function BetaManuscript() {
  const [passages, setPassages] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [p1, p2] = await Promise.all([
        base44.entities.Quarantine.filter({ status: 'approved' }, '-scanned_date', 500, 0),
        base44.entities.Quarantine.filter({ status: 'approved' }, '-scanned_date', 500, 500),
      ]);
      setPassages([...p1, ...p2]);
      const d = await base44.entities.RestorationDraft.list('-chapter_number', 100);
      setDrafts(d.sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)));
    } catch (err) {
      console.error('Failed to load beta manuscript:', err);
    }
    setLoading(false);
  };

  // Group passages by chapter
  const byChapter = {};
  passages.forEach((p) => {
    const ch = p.chapter_suggestion;
    if (ch != null) {
      if (!byChapter[ch]) byChapter[ch] = [];
      byChapter[ch].push(p);
    }
  });
  const chapterNumbers = Object.keys(byChapter).map(Number).sort((a, b) => a - b);
  const flaggedCount = passages.filter((p) => detectGenericPatterns(p.passage_text).length > 0).length;

  const handleDownload = () => {
    let text = 'SGT RAMOS: THE MATHEMATICS OF VIETNAM\nBETA RESTORATION MANUSCRIPT — UNAUTHENTICATED DRAFT\nGenerated: ' + new Date().toLocaleString() + '\n';
    text += '='.repeat(60) + '\n\n';

    chapterNumbers.forEach((chNum) => {
      const draft = drafts.find((d) => d.chapter_number === chNum);
      const chPassages = byChapter[chNum];
      text += `\n${'='.repeat(60)}\n`;
      text += `CHAPTER ${chNum}${draft?.chapter_title ? ': ' + draft.chapter_title : ''}\n`;
      text += `${'='.repeat(60)}\n`;
      if (draft?.cooked_omega) {
        text += `[BETA Ω: ${draft.cooked_omega.toFixed(1)} | CLS: ${draft.cooked_cls} | BIS: ${draft.cooked_bis} | SII: ${draft.cooked_sii} | MRF: ${draft.cooked_mrf}]\n`;
        text += `[${chPassages.length} restoration passages integrated]\n`;
        if (draft.llm_reasoning) text += `[Scoring rationale: ${draft.llm_reasoning}]\n`;
      }
      text += '\n';
      chPassages.forEach((p, i) => {
        text += `--- Passage ${i + 1} (${p.voice_dimension || p.opportunity_type || 'restoration'}) ---\n`;
        text += `${p.passage_text}\n\n`;
        if (p.suggested_application) text += `[Application note: ${p.suggested_application}]\n\n`;
      });
      text += '\n';
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SGT_Ramos_Beta_Restoration.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportToDocs = async () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 border-4 border-muted border-t-orange-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/quarantine" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="w-3 h-3" /> Back to Quarantine
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-orange-500/10 border border-orange-500/30 p-2">
              <Beaker className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Beta Restoration Manuscript</h1>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">Beta</span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                {passages.length} candidate passages organized by chapter — an editorial suggestion database to vet, not finished prose. Nothing here has been published to the real manuscript.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportToDocs}
              disabled={exporting || drafts.length === 0}
              className="px-4 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
              {exporting ? 'Exporting...' : 'Export to Docs'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium hover:bg-orange-500/20 inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>
      </div>

      <EditorialVerdictBanner />

      {/* Export Result */}
      {exportResult && (
        <div className={`rounded-lg border p-4 mb-6 ${exportResult.error ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
          {exportResult.error ? (
            <p className="text-sm text-red-400">Export failed: {exportResult.error}</p>
          ) : (
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-400">
                  Exported {exportResult.docs_created} chapter doc{exportResult.docs_created !== 1 ? 's' : ''} to Google Drive
                  {exportResult.errors > 0 && <span className="text-red-400"> · {exportResult.errors} errors</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {exportResult.folder_name}
                  {exportResult.share_status === 'shared_editable' && ' · shared: anyone with the link can edit'}
                  {exportResult.share_status === 'share_failed' && ' · sharing failed — set permissions manually in Drive'}
                </p>
                {exportResult.folder_url && (
                  <a
                    href={exportResult.folder_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs text-emerald-400 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Open folder in Google Drive
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Chapters</div>
          <div className="font-mono font-bold text-xl text-orange-400 mt-1">{chapterNumbers.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Candidate Passages</div>
          <div className="font-mono font-bold text-xl text-amber-400 mt-1">{passages.length}</div>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI-Generic Flags</div>
          <div className="font-mono font-bold text-xl text-red-400 mt-1">{flaggedCount}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mean Cooked Ω</div>
          <div className="font-mono font-bold text-xl text-emerald-400 mt-1">
            {drafts.length > 0 ? (drafts.reduce((s, d) => s + (d.cooked_omega || 0), 0) / drafts.length).toFixed(1) : '—'}
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-8">
        {chapterNumbers.map((chNum) => {
          const draft = drafts.find((d) => d.chapter_number === chNum);
          const chPassages = byChapter[chNum];
          return (
            <div key={chNum} className="rounded-lg border border-border bg-card overflow-hidden">
              {/* Chapter Header */}
              <div className="border-b border-border bg-orange-500/5 px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-orange-400 font-bold">Chapter {chNum}</div>
                    <h2 className="text-lg font-bold">{draft?.chapter_title || 'Untitled'}</h2>
                  </div>
                  {draft?.cooked_omega && (
                    <div className="text-right shrink-0">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Beta Ω</div>
                      <div className="font-mono font-bold text-xl text-emerald-400">{draft.cooked_omega.toFixed(1)}</div>
                      <div className="text-[9px] text-muted-foreground font-mono">
                        CLS {draft.cooked_cls} · BIS {draft.cooked_bis} · SII {draft.cooked_sii} · MRF {draft.cooked_mrf}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono text-amber-400">{chPassages.length} passages</span>
                  {draft?.llm_reasoning && (
                    <span className="text-[10px] text-muted-foreground italic truncate">— {draft.llm_reasoning}</span>
                  )}
                </div>
              </div>

              {/* Passages */}
              <div className="px-5 py-4 space-y-4">
                {chPassages.map((p, i) => (
                  <PassageVettingCard key={p.id || i} passage={p} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 rounded-lg border border-orange-500/30 bg-orange-500/5 p-4 text-center">
        <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">
          End of suggestion database. Run each passage through the four-question test before adapting it — insert only what sounds like the specific character, adds a new image, moves the scene, and beats the existing prose.
        </p>
        <Link
          to="/quarantine"
          className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium hover:bg-orange-500/20"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Restoration Kitchen
        </Link>
      </div>
    </div>
  );
}