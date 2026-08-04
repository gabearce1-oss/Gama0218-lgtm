import { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, Send, Loader2, Plus, MessageSquare, Zap, AlertTriangle, Mic, FileSearch, TrendingUp, BarChart3, Trash2, Activity } from 'lucide-react';
import MessageBubble from '@/components/guardrail/MessageBubble';

const QUICK_ACTIONS = [
  { icon: AlertTriangle, label: 'Risk Report', prompt: 'Give me a P0/P1/P2 risk report on the lowest-scoring chapters. Include blocker triage and words_at_risk.' },
  { icon: Mic, label: 'Voice Audit', prompt: 'Audit the code-switching authenticity across the manuscript. Which chapters have decorative rather than purposeful switches?' },
  { icon: FileSearch, label: 'Evidence Gaps', prompt: 'Review evidence claims and identify chapters missing E0-E1 evidence. Which claims are blocked or need review?' },
  { icon: TrendingUp, label: 'Elite Push', prompt: 'Which chapters are closest to Elite (Ω ≥ 109.5)? What specific inserts would push them over?' },
  { icon: BarChart3, label: 'Benchmark', prompt: 'Compare manuscript Omega scores to war canon and Chicano literature benchmarks. Where do we rank?' },
  { icon: Zap, label: 'Blocker Triage', prompt: 'Review all active blockers. Rank by omega_penalty and words_at_risk. What is the overlap percentage?' },
];

const SUGGESTIONS = [
  'Give me a risk report on the lowest-scoring chapters',
  'Audit Ch.29 for code-switching authenticity',
  'Research Vietnam-era Chicano soldier demographics',
  'Which quarantined passages should I approve?',
  'What evidence claims are blocked for Ch.9?',
  'How do I push Ch.36 from 109.4 to Elite?',
];

export default function Guardrail() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const unsubscribe = base44.agents.subscribeToConversation(activeId, (data) => {
      setMessages(data.messages || []);
      setSending(false);
    });
    return () => unsubscribe();
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const convs = await base44.agents.listConversations({ agent_name: 'guardrail' });
      setConversations(convs);
      if (convs.length > 0 && !activeId) {
        setActiveId(convs[0].id);
        const full = await base44.agents.getConversation(convs[0].id);
        setMessages(full.messages || []);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
    setLoading(false);
  };

  const handleNewConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: 'guardrail',
      metadata: { name: 'New Research Session', description: 'Guardrail analysis' }
    });
    setConversations([conv, ...conversations]);
    setActiveId(conv.id);
    setMessages([]);
  };

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation();
    try {
      await base44.agents.updateConversation(id, { metadata: { name: 'Deleted', description: '' } });
      const remaining = conversations.filter(c => c.id !== id);
      setConversations(remaining);
      if (activeId === id) {
        if (remaining.length > 0) {
          setActiveId(remaining[0].id);
          const full = await base44.agents.getConversation(remaining[0].id);
          setMessages(full.messages || []);
        } else {
          setActiveId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleSelectConversation = async (id) => {
    setActiveId(id);
    const full = await base44.agents.getConversation(id);
    setMessages(full.messages || []);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || sending) return;
    setInput('');
    setSending(true);

    if (!activeId) {
      const conv = await base44.agents.createConversation({
        agent_name: 'guardrail',
        metadata: { name: text.slice(0, 40), description: 'Guardrail analysis' }
      });
      setConversations([conv, ...conversations]);
      setActiveId(conv.id);
      const updated = await base44.agents.addMessage(conv, { role: 'user', content: text });
      setMessages(updated.messages || []);
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    try {
      const conv = conversations.find(c => c.id === activeId);
      await base44.agents.addMessage(conv, { role: 'user', content: text });
    } catch (err) {
      setSending(false);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    }
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt) => {
    sendMessage(prompt);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  const activeConv = conversations.find(c => c.id === activeId);

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Sidebar — Conversations */}
      <div className="w-64 shrink-0 border-r border-border bg-card/50 flex flex-col">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-sm font-bold">Guardrail</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Research Bot · v2</div>
            </div>
          </div>
          <button
            onClick={handleNewConversation}
            className="w-full px-3 py-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/20 inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Session
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center p-4">No sessions yet.</p>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 cursor-pointer group ${
                  activeId === conv.id
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate flex-1">{conv.metadata?.name || 'Session'}</span>
                <button
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
        {/* Capabilities footer */}
        <div className="p-3 border-t border-border">
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Agent Access</div>
          <div className="flex flex-wrap gap-1">
            {['Chapter', 'Blocker', 'CodeSwitch', 'Quarantine', 'EvidenceClaim', 'SyncLog'].map(e => (
              <span key={e} className="font-mono text-[9px] rounded border border-border bg-background/50 px-1.5 py-0.5 text-muted-foreground">{e}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <div>
                <h1 className="text-lg font-bold">The Guardrail</h1>
                <p className="text-xs text-muted-foreground">
                  Prime Directive v1.0 · Four-Gate Enforcement · Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.1005·MRF
                </p>
              </div>
            </div>
            {activeConv && (
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                <Activity className="w-3 h-3" />
                {messages.length} msgs
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
              <Shield className="w-12 h-12 text-amber-400/50 mb-4" />
              <h2 className="text-lg font-bold mb-2">Guardrail v2 Ready</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Research historical facts, audit chapter scores, review evidence claims, flag voice risks,
                or generate a manuscript risk report. I enforce the four-gate sequence.
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full mb-4">
                {QUICK_ACTIONS.map(({ icon: Icon, label, prompt }) => (
                  <button
                    key={label}
                    onClick={() => handleQuickAction(prompt)}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-amber-400 hover:border-amber-500/30 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Suggestions */}
              <div className="w-full">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 text-left">Or try…</div>
                <div className="grid grid-cols-1 gap-1.5 w-full">
                  {SUGGESTIONS.map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => { setInput(suggestion); }}
                      className="text-left px-3 py-2 rounded-md border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:border-amber-500/30 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))
          )}
          {sending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardrail is analyzing…
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick action bar (when in conversation) */}
        {messages.length > 0 && (
          <div className="border-t border-border px-4 py-2 flex items-center gap-1.5 overflow-x-auto">
            {QUICK_ACTIONS.slice(0, 4).map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                onClick={() => handleQuickAction(prompt)}
                disabled={sending}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded border border-border text-[10px] font-mono text-muted-foreground hover:text-amber-400 hover:border-amber-500/30 disabled:opacity-40 transition-colors"
              >
                <Icon className="w-3 h-3" /> {label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the Guardrail to research, audit, or report…"
              rows={1}
              className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-amber-500/50 min-h-[40px] max-h-32"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="shrink-0 p-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 disabled:opacity-50 transition-colors"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}