import { Download, Table2, FileText, Code2 } from 'lucide-react';
import { downloadSpssExtract, downloadSpssPlaybook, downloadSyntaxFile } from '@/lib/spssExtract';

function DownloadCard({ icon: Icon, title, detail, action, disabled }) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-amber-400" /> {title}
      </div>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
      <button
        onClick={action}
        disabled={disabled}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Download className="h-3.5 w-3.5" /> Download
      </button>
    </div>
  );
}

export default function ExtractDownloads({ chapters }) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Extraction Bench · {chapters.length} cases available
      </h2>
      <div className="grid gap-3 md:grid-cols-3">
        <DownloadCard
          icon={Table2}
          title="SPSS Data Extract"
          detail="Flat case file — one row per chapter, one column per variable, plus the dictionary and provenance sheets. Opens straight into SPSS."
          action={() => downloadSpssExtract(chapters)}
          disabled={chapters.length === 0}
        />
        <DownloadCard
          icon={FileText}
          title="Protocol Playbook"
          detail="The procedure document: six handoff steps, custody role, variable dictionary, and syntax template. No case data — safe to circulate."
          action={downloadSpssPlaybook}
        />
        <DownloadCard
          icon={Code2}
          title="Syntax File (.sps)"
          detail="Descriptives, frequencies, the RF 1.5 regression, and the moral-landscape correlations, ready to run by hand in SPSS."
          action={downloadSyntaxFile}
        />
      </div>
    </section>
  );
}