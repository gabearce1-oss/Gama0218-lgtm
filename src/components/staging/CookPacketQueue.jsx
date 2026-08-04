import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Loader2, ChefHat, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateCookPacketId, statusColor, isVCLExempt, LOCKED_FACTS, COOK_ACTIONS } from '@/lib/stagingGovernance';

export default function CookPacketQueue() {
  const [packets, setPackets] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedAction, setSelectedAction] = useState('VOICECHECK');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
    const unsub = base44.entities.CookPacket.subscribe((event) => {
      if (event.type === 'create') setPackets(prev => [event.data, ...prev]);
      if (event.type === 'update') setPackets(prev => prev.map(p => p.id === event.data.id ? event.data : p));
      if (event.type === 'delete') setPackets(prev => prev.filter(p => p.id !== event.data.id));
    });
    return unsub;
  }, []);

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([
        base44.entities.CookPacket.list('-created_date', 200),
        base44.entities.Chapter.list('-chapter_number', 100)
      ]);
      setPackets(p);
      setChapters(c);
    } catch (err) {
      console.error('Failed to load cook packets:', err);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!selectedChapter) return;
    setCreating(true);
    try {
      const chapter = chapters.find(c => c.id === selectedChapter);
      const packetId = generateCookPacketId(chapter.chapter_number);
      await base44.entities.CookPacket.create({
        cook_packet_id: packetId,
        packet_status: 'READY_FOR_GEMINI',
        requested_action: selectedAction,
        chapter_number: chapter.chapter_number,
        chapter_title: chapter.title || '',
        source_sheet: 'SGT_Ramos_LitCentral_FULL_METRICS',
        source_status: 'RAW_LEGACY',
        stored_omega: chapter.omega || null,
        stored_omega_status: 'LEGACY_LOCKED',
        candidate_formula: 'RF_1_5',
        v25_status: 'STAGING_NON_CANON',
        vcl_exempt: isVCLExempt(chapter.chapter_number),
        fix_note: chapter.notes || chapter.priority_action || '',
        locked_facts: LOCKED_FACTS,
        gabe_approval_required: true
      });
      await base44.entities.Changelog.create({
        change_id: `CHG-${Date.now()}`,
        change_type: 'CREATE_COOK_PACKET',
        entity_type: 'CookPacket',
        entity_id: packetId,
        chapter_number: chapter.chapter_number,
        description: `Created cook packet ${packetId} for Ch.${chapter.chapter_number} (${selectedAction})`,
        gabe_approved: false
      });
      setDialogOpen(false);
      setSelectedChapter(null);
    } catch (err) {
      console.error('Failed to create cook packet:', err);
    }
    setCreating(false);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-amber-400" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{packets.length} cook packets in queue</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
              <Plus className="w-4 h-4 mr-1" /> Create Cook Packet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Cook Packet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Chapter</label>
                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
                  <SelectContent>
                    {chapters.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        Ch.{c.chapter_number}: {c.title || 'Untitled'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Requested Action</label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COOK_ACTIONS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {selectedChapter && (() => {
                const ch = chapters.find(c => c.id === selectedChapter);
                if (!ch) return null;
                const vcl = isVCLExempt(ch.chapter_number);
                return (
                  <div className="rounded-md border border-border bg-muted/30 p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-muted-foreground" /> Stored Ω: <span className="font-mono">{ch.omega?.toFixed(1) || '—'}</span> <span className="text-[9px] text-muted-foreground">(LEGACY_LOCKED)</span></div>
                    <div>v25 Status: <span className="text-amber-400">STAGING_NON_CANON</span></div>
                    {vcl && <div className="flex items-center gap-1.5 text-amber-400"><AlertTriangle className="w-3 h-3" /> VCL-EXEMPT — CLS scoring blocked</div>}
                    <div className="text-muted-foreground">Gabe approval required: YES</div>
                  </div>
                );
              })()}
              <Button onClick={handleCreate} disabled={!selectedChapter || creating} className="w-full bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30">
                {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ChefHat className="w-4 h-4 mr-2" />}
                Generate Cook Packet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {packets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <ChefHat className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No cook packets yet. Create one to send to Gemini.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {packets.map(p => (
            <div key={p.id} className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-amber-400">{p.cook_packet_id}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusColor(p.packet_status)}`}>{p.packet_status}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{p.requested_action}</span>
                </div>
                <div className="text-sm mt-1">Ch.{p.chapter_number}: {p.chapter_title || 'Untitled'}</div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span>Stored Ω: <span className="font-mono">{p.stored_omega?.toFixed(1) || '—'}</span></span>
                  <span className="text-muted-foreground">LEGACY_LOCKED</span>
                  <span>v25: {p.v25_status}</span>
                  {p.vcl_exempt && <span className="text-amber-400">VCL-EXEMPT</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}