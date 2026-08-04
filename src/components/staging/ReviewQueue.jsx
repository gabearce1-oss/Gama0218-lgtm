import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, ChevronDown, ChevronRight, FileCheck } from 'lucide-react';
import { statusColor } from '@/lib/stagingGovernance';

export default function ReviewQueue() {
  const [outputs, setOutputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadData();
    const unsub = base44.entities.CookOutput.subscribe((event) => {
      if (event.type === 'create') setOutputs(prev => [event.data, ...prev]);
      if (event.type === 'update') setOutputs(prev => prev.map(o => o.id === event.data.id ? event.data : o));
      if (event.type === 'delete') setOutputs(prev => prev.filter(o => o.id !== event.data.id));
    });
    return unsub;
  }, []);

  const loadData = async () => {
    try {
      const data = await base44.entities.CookOutput.list('-created_date', 200);
      setOutputs(data);
    } catch (err) {
      console.error('Failed to load cook outputs:', err);
    }
    setLoading(false);
  };

  const parseFindings = (findingsStr) => {
    if (!findingsStr) return [];
    try {
      const parsed = JSON.parse(findingsStr);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [{ issue: findingsStr }];
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-amber-400" /></div>;
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">{outputs.length} cook outputs pending review — Base44 does not auto-apply</p>
      {outputs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <FileCheck className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No cook outputs yet. Outputs from Gemini will appear here for Gabe review.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {outputs.map(o => {
            const findings = parseFindings(o.findings);
            const expanded = expandedId === o.id;
            return (
              <div key={o.id} className="rounded-lg border border-border bg-card overflow-hidden">
                <button onClick={() => setExpandedId(expanded ? null : o.id)} className="w-full p-3 flex items-center gap-3 text-left hover:bg-muted/30">
                  {expanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-cyan-400">{o.cook_output_id}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusColor(o.output_status)}`}>{o.output_status}</span>
                      {o.canon_change_requested && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-500/30 text-red-400 bg-red-500/10">CANON CHANGE</span>}
                    </div>
                    {o.summary && <p className="text-sm mt-1 truncate">{o.summary}</p>}
                    <p className="text-[10px] text-muted-foreground mt-0.5">Packet: {o.cook_packet_id} · {findings.length} findings</p>
                  </div>
                </button>
                {expanded && (
                  <div className="border-t border-border p-3 space-y-3">
                    {findings.map((f, i) => (
                      <div key={i} className="rounded-md border border-border bg-muted/20 p-3 text-xs space-y-1.5">
                        <div><span className="text-muted-foreground">Issue:</span> {f.issue}</div>
                        {f.evidence && <div><span className="text-muted-foreground">Evidence:</span> {f.evidence}</div>}
                        {f.risk_if_unchanged && <div><span className="text-muted-foreground">Risk if unchanged:</span> {f.risk_if_unchanged}</div>}
                        {f.proposed_fix && <div><span className="text-muted-foreground">Proposed fix:</span> {f.proposed_fix}</div>}
                        {f.expected_benefit && <div><span className="text-muted-foreground">Expected benefit:</span> {f.expected_benefit}</div>}
                        {f.effort && <div><span className="text-muted-foreground">Effort:</span> {f.effort}</div>}
                        <div><span className="text-muted-foreground">Gabe approval required?</span> <span className="text-amber-400 font-bold">{f.gabe_approval_required || 'YES'}</span></div>
                      </div>
                    ))}
                    {o.recommended_status && (
                      <div className="text-xs"><span className="text-muted-foreground">Recommended status:</span> <span className={`font-bold px-1.5 py-0.5 rounded border ${statusColor(o.recommended_status)}`}>{o.recommended_status}</span></div>
                    )}
                    {o.writes_requested?.length > 0 && (
                      <div className="text-xs"><span className="text-muted-foreground">Writes requested:</span> {o.writes_requested.join(', ')}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}