import { Archive, Ban } from 'lucide-react';

// SUPERSEDED ARTIFACT — publication withdrawn 2026-08-02 (Evidence Freeze, Phase 1).
// These figures were hard-coded and cannot be audited: the application exposes no
// corpus manifest, LOC control numbers, selection rules, rater records, statistical
// syntax, item definitions, model output, or signed LOC instrument supporting them.
// The card is retained, not deleted, so the correction itself stays visible.
const SUPERSEDED_CLAIMS = [
  { label: 'War Canon Rank', value: '#97' },
  { label: 'Chicano Lit Rank', value: '#99' },
  { label: 'Manuscript Ω̄', value: '107.34 · σ 1.26 · range 105–110' },
  { label: 'Elite Tier', value: '45/45 at Ω ≥ 105' },
  { label: 'Stated N', value: '45 chapters (supplied CSV contains 46)' },
  { label: 'Stated fit', value: 'R² 0.947 · Cronbach α 0.938' },
];

export default function LOCBaselineCard() {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Ban className="w-4 h-4 text-red-400" />
        <span className="text-xs uppercase tracking-wider text-red-400 font-semibold">
          Publication withdrawn · superseded artifact · 2026-08-02
        </span>
      </div>
      <h2 className="text-xl font-bold mb-2">World Literature Baseline (Unverified)</h2>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4 max-w-3xl">
        These figures were hard-coded into the application and are not auditable. No corpus manifest, authority control
        numbers, selection rules, rater records, statistical syntax, item definitions, model output, or signed Library of
        Congress instrument supports them. The stated chapter count also conflicts with the source dataset. They are
        preserved here as a record of the claim and its withdrawal, and must not be cited, exported, or compared against.
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {SUPERSEDED_CLAIMS.map((c) => (
          <div key={c.label} className="flex items-baseline gap-2 rounded-md border border-border/60 bg-background/40 p-3">
            <Archive className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.label}</span>
            <span className="ml-auto font-mono text-xs text-muted-foreground line-through">{c.value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        <span className="text-red-400 font-semibold">Defensible language only:</span> LOC-sourced corpus, LOC-anchored
        authority records, LOC-referenced evidence baseline. Not &ldquo;LOC-verified literary score.&rdquo;
      </p>
    </div>
  );
}