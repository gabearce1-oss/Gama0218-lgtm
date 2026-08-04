import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { statusColor, PROMOTED_STATUS_VALUES } from '@/lib/stagingGovernance';

export default function V25PromotionGatePanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ promotion_id: '', v25_item_type: '', v25_claim_or_formula: '', source_location: '', conflicts_with: '', evidence_status: '', recommended_action: '', notes: '' });

  useEffect(() => {
    loadData();
    const unsub = base44.entities.V25PromotionGate.subscribe((event) => {
      if (event.type === 'create') setItems(prev => [event.data, ...prev]);
      if (event.type === 'update') setItems(prev => prev.map(i => i.id === event.data.id ? event.data : i));
      if (event.type === 'delete') setItems(prev => prev.filter(i => i.id !== event.data.id));
    });
    return unsub;
  }, []);

  const loadData = async () => {
    try {
      const data = await base44.entities.V25PromotionGate.list('-created_date', 200);
      setItems(data);
    } catch (err) {
      console.error('Failed to load V25 promotion gate:', err);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.promotion_id || !form.v25_claim_or_formula) return;
    try {
      await base44.entities.V25PromotionGate.create({ ...form, promoted_status: 'NOT_REVIEWED' });
      setForm({ promotion_id: '', v25_item_type: '', v25_claim_or_formula: '', source_location: '', conflicts_with: '', evidence_status: '', recommended_action: '', notes: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create promotion gate item:', err);
    }
  };

  const handlePromote = async (item, newStatus) => {
    await base44.entities.V25PromotionGate.update(item.id, { promoted_status: newStatus, gabe_decision: newStatus, decision_date: new Date().toISOString() });
    await base44.entities.Changelog.create({
      change_id: `CHG-${Date.now()}`,
      change_type: 'PROMOTE_V25',
      entity_type: 'V25PromotionGate',
      entity_id: item.promotion_id,
      description: `V25 item ${item.promotion_id} promoted to ${newStatus}`,
      new_value: newStatus,
      gabe_approved: newStatus === 'PROMOTED_FOR_CANON' || newStatus === 'PROMOTED_FOR_CALCULATION'
    });
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-amber-400" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{items.length} v25 items pending gate review</p>
        <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" /> Add Item
        </Button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-border bg-card p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Promotion ID (e.g. PROMO-RF15-001)" value={form.promotion_id} onChange={e => setForm({...form, promotion_id: e.target.value})} className="text-xs" />
            <Input placeholder="Item type (e.g. Formula, Chapter Count)" value={form.v25_item_type} onChange={e => setForm({...form, v25_item_type: e.target.value})} className="text-xs" />
          </div>
          <Input placeholder="Claim or formula" value={form.v25_claim_or_formula} onChange={e => setForm({...form, v25_claim_or_formula: e.target.value})} className="text-xs" />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Source location" value={form.source_location} onChange={e => setForm({...form, source_location: e.target.value})} className="text-xs" />
            <Input placeholder="Conflicts with" value={form.conflicts_with} onChange={e => setForm({...form, conflicts_with: e.target.value})} className="text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Evidence status" value={form.evidence_status} onChange={e => setForm({...form, evidence_status: e.target.value})} className="text-xs" />
            <Input placeholder="Recommended action" value={form.recommended_action} onChange={e => setForm({...form, recommended_action: e.target.value})} className="text-xs" />
          </div>
          <Input placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="text-xs" />
          <Button onClick={handleCreate} size="sm" className="bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30">Add to Gate</Button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <ShieldCheck className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No v25 items in the promotion gate yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-amber-400">{item.promotion_id}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusColor(item.promoted_status)}`}>{item.promoted_status}</span>
                  {item.v25_item_type && <span className="text-[9px] text-muted-foreground">{item.v25_item_type}</span>}
                </div>
                <select
                  value={item.promoted_status}
                  onChange={e => handlePromote(item, e.target.value)}
                  className="text-[10px] bg-muted border border-border rounded px-2 py-1 text-foreground"
                >
                  {PROMOTED_STATUS_VALUES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <p className="text-sm mt-1">{item.v25_claim_or_formula}</p>
              {item.conflicts_with && <p className="text-[10px] text-red-400 mt-1">⚠ Conflicts: {item.conflicts_with}</p>}
              {item.notes && <p className="text-[10px] text-muted-foreground mt-1">{item.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}