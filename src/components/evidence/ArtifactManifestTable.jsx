import { FileDigit } from 'lucide-react';
import { ARTIFACT_MANIFEST } from '@/lib/evidenceFreeze';

export default function ArtifactManifestTable() {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 mb-1">
        <FileDigit className="w-4 h-4" /> Evidence manifest · frozen
      </div>
      <h2 className="text-lg font-bold">Source Artifacts &amp; SHA-256 Digests</h2>
      <p className="text-xs text-muted-foreground mt-1 mb-4">
        First entries in the manifest. Any later copy whose digest differs from these values is a different artifact and enters quarantine.
      </p>
      <div className="space-y-3">
        {ARTIFACT_MANIFEST.map((a) => (
          <div key={a.entity_id} className="rounded-md border border-border/60 bg-background/40 p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-xs text-amber-400">{a.entity_id}</span>
              <span className="font-bold text-sm">{a.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.entity_type}</span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-emerald-400">{a.data_class}</span>
            </div>
            <div className="mt-2 font-mono text-[11px] break-all text-muted-foreground">sha256: {a.sha256}</div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{a.finding}</p>
          </div>
        ))}
      </div>
    </section>
  );
}