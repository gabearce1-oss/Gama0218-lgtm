import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Gavel } from 'lucide-react';
import { statusColor } from '@/lib/stagingGovernance';

export default function GabeRulingsPanel() {
  const [rulings, setRulings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const unsub = base44.entities.GabeRuling.subscribe((event) => {
      if (event.type === 'create') setRulings(prev => [event.data, ...prev]);
      if (event.type === 'update') setRulings(prev => prev.map(r => r.id === event.data.id ? event.data : r));
      if (event.type === 'delete') setRulings(prev => prev.filter(r => r.id !== event.data.id));
    });
    return unsub;
  }, []);

  const loadData = async () => {
    try {
      const data = await base44.entities.GabeRuling.list('-created_date', 200);
      setRulings(data);
    } catch (err) {
      console.error('Failed to load Gabe rulings:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-amber-400" /></div>;
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">{rulings.length} Gabe rulings on record</p>
      {rulings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Gavel className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No Gabe rulings yet. Rulings on disputed items will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rulings.map(r => (
            <div key={r.id} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-amber-400">{r.ruling_id}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">{r.ruling_type}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusColor(r.promoted_status)}`}>{r.promoted_status}</span>
              </div>
              {r.ruling_text && <p className="text-sm mt-1">{r.ruling_text}</p>}
              {r.decision && <p className="text-xs text-muted-foreground mt-1">{r.decision}</p>}
              <div className="text-[10px] text-muted-foreground mt-1">
                {r.cook_packet_id && <span>Packet: {r.cook_packet_id}</span>}
                {r.decision_date && <span className="ml-2">{new Date(r.decision_date).toLocaleDateString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}