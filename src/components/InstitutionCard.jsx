import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, Mail, Calendar, ArrowRight } from 'lucide-react';
import { PRIORITY_COLORS, STATUS_COLORS, STATUS_OPTIONS } from '@/lib/outreachData';

export default function InstitutionCard({ institution, outreach, onStatusChange, onAddOutreach, updating }) {
  const [expanded, setExpanded] = useState(false);
  const colors = PRIORITY_COLORS[institution.priority] || PRIORITY_COLORS.P3;
  const instOutreach = outreach.filter((o) => o.institution_id === institution.institution_id);
  const latest = instOutreach[0];

  return (
    <div className={`rounded-lg border ${colors.border} ${colors.bg} overflow-hidden`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/20 transition-colors">
        <span className={`font-mono text-xs font-bold shrink-0 px-2 py-0.5 rounded border ${colors.border} ${colors.text}`}>{institution.priority}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold truncate">{institution.name}</div>
          <div className="text-xs text-muted-foreground truncate">{institution.type} · {institution.location}</div>
        </div>
        {latest && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${STATUS_COLORS[latest.status] || ''}`}>{latest.status.replace(/_/g, ' ')}</span>
        )}
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-border p-4 space-y-3 bg-card/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Mission Fit</div>
              <p className="text-foreground">{institution.mission_fit}</p>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Programs</div>
              <p className="text-foreground">{institution.programs}</p>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Funding / Partnership</div>
              <p className="text-foreground">{institution.funding_mechanism}</p>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Public Contact</div>
              <p className="text-foreground">{institution.public_contact || '—'}</p>
            </div>
          </div>

          {institution.key_contacts && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Key Contacts</div>
              <p className="text-xs text-muted-foreground">{institution.key_contacts}</p>
            </div>
          )}

          {/* Outreach Controls */}
          {latest ? (
            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Segment:</span>
                <span className="text-foreground">{latest.segment.replace(/_/g, ' ')}</span>
              </div>
              {latest.contact_date && (
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Contacted:</span>
                  <span className="text-foreground">{new Date(latest.contact_date).toLocaleDateString()}</span>
                </div>
              )}
              {latest.next_action && (
                <div className="flex items-center gap-2 text-xs">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-muted-foreground">Next:</span>
                  <span className="text-amber-400">{latest.next_action}</span>
                </div>
              )}
              <div className="flex items-center gap-2 pt-1">
                <select
                  value={latest.status}
                  onChange={(e) => onStatusChange(latest, e.target.value)}
                  disabled={updating === latest.id}
                  className="bg-background border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-amber-500/50 flex-1"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
                {updating === latest.id && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
              </div>
              {latest.notes && <p className="text-xs text-muted-foreground italic">{latest.notes}</p>}
            </div>
          ) : (
            <button
              onClick={() => onAddOutreach(institution)}
              className="w-full mt-2 px-3 py-2 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 inline-flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Start Outreach Tracking
            </button>
          )}
        </div>
      )}
    </div>
  );
}