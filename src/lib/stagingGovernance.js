export const STAGING_STATUS_VALUES = [
  'RAW_LEGACY', 'STAGING', 'READY_FOR_GEMINI', 'COOKING', 'COOKED_PENDING_REVIEW',
  'NEEDS_GABE_RULING', 'NEEDS_REVIEW', 'BLOCKED_DRAFT', 'BLOCKED_TIMELINE_CONFLICT',
  'BLOCKED_DUPLICATION', 'BLOCKED_VCL_EXEMPT', 'BLOCKED_IMPOSSIBLE_SCORE',
  'QUARANTINED', 'PROMOTED_BY_GABE', 'LOCKED_CANON', 'REJECTED', 'ARCHIVED'
];

export const VCL_EXEMPT_CHAPTERS = [17, 18, 29];
export const OMEGA_CEILING_RF15 = 114.593;
export const RF15_FORMULA = 'Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.1005·MRF';

export const LOCKED_FACTS = [
  'George Ramos = Joshua Sagasta',
  'Copper taste trigger',
  'Duc/Mai = VC; Mai is MALE',
  "O'Neil = Kentucky",
  'Johnson = Philadelphia',
  'Rodriguez Ch.1 underage boy ≠ Ramirez Ch.10 KIA',
  "Duc's radio operator = Trong throughout",
  'Toy soldiers = lead; chamoy = sweet-sour paste'
];

export const PROMOTED_STATUS_VALUES = [
  'NOT_REVIEWED', 'STAGING_ONLY', 'PROMOTED_FOR_CALCULATION',
  'PROMOTED_FOR_CANON', 'REJECTED', 'QUARANTINED'
];

export const COOK_ACTIONS = [
  'VOICECHECK', 'FORENSIC', 'RESTORE_PROPOSAL', 'FORMULA_RECONCILE',
  'EXPORT_PREP', 'AUDIT_ONLY', 'QUARANTINE_REVIEW'
];

export const ALLOWED_ACTIONS = [
  'CREATE_COOK_PACKET', 'SUBMIT_TO_GEMINI', 'IMPORT_GEMINI_OUTPUT',
  'REQUEST_GABE_RULING', 'MARK_NEEDS_REVIEW', 'REQUEST_QUARANTINE',
  'LOG_CHANGE', 'DISPLAY_STATUS', 'EXPORT_STAGING_REPORT'
];

export const FORBIDDEN_ACTIONS = [
  'DELETE_ROW', 'DIRECT_EDIT_CANON', 'OVERWRITE_STORED_OMEGA',
  'REORDER_CANON_CHAPTERS', 'PROMOTE_V25_AUTOMATICALLY', 'MARK_CERTIFIED',
  'MARK_EXTERNAL_VALIDATED', 'SYNC_DRAFT_TO_CANON', 'CHANGE_FORMULA_AUTHORITY',
  'RESOLVE_DUPLICATION_WITHOUT_GABE'
];

export function computeBlockStatus(chapter) {
  if (!chapter) return null;
  const words = chapter.word_count || 0;
  const fixNote = [chapter.notes, chapter.priority_action, chapter.restoration_notes]
    .filter(Boolean).join(' ');

  if (words === 0) return 'BLOCKED_DRAFT';
  if (fixNote.toUpperCase().includes('INITIAL DRAFT')) return 'BLOCKED_DRAFT';
  if (fixNote.toLowerCase().includes('timeline conflict')) return 'BLOCKED_TIMELINE_CONFLICT';
  if (VCL_EXEMPT_CHAPTERS.includes(chapter.chapter_number) && chapter.cls != null && chapter.cls > 0) return 'BLOCKED_VCL_EXEMPT';
  if (chapter.omega != null && chapter.omega > OMEGA_CEILING_RF15) return 'BLOCKED_IMPOSSIBLE_SCORE';
  return null;
}

export function isExportBlocked(chapter) {
  if (!chapter) return true;
  if (chapter.chapter_number === 47) return true;
  return computeBlockStatus(chapter) !== null;
}

export function isVCLExempt(chapterNumber) {
  return VCL_EXEMPT_CHAPTERS.includes(chapterNumber);
}

export function generateCookPacketId(chapterNumber) {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const hm = now.toTimeString().slice(0, 5).replace(/:/g, '');
  return `COOK-CH${String(chapterNumber || '00').padStart(2, '0')}_${ymd}_${hm}`;
}

export function statusColor(status) {
  if (!status) return 'text-muted-foreground bg-muted/50 border-border';
  if (status.startsWith('BLOCKED')) return 'text-red-400 bg-red-500/10 border-red-500/30';
  if (status === 'QUARANTINED') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  if (status === 'LOCKED_CANON' || status === 'PROMOTED_BY_GABE') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (status === 'RAW_LEGACY') return 'text-muted-foreground bg-muted/50 border-border';
  if (status === 'REJECTED' || status === 'ARCHIVED') return 'text-muted-foreground bg-muted/50 border-border';
  if (status === 'PROMOTED_FOR_CALCULATION' || status === 'PROMOTED_FOR_CANON') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (status === 'STAGING_ONLY' || status === 'NOT_REVIEWED') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
}