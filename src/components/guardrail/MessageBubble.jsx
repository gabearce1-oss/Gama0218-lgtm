import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronRight, Wrench, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function FunctionDisplay({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  const projection = toolCall.display_projection || {};
  const hideDetails = projection.hide_details && projection.details_redacted;

  const status = toolCall.status || 'pending';
  const statusConfig = {
    pending: { icon: Loader2, text: 'Queued', color: 'text-muted-foreground', spin: true },
    running: { icon: Loader2, text: 'Running', color: 'text-amber-400', spin: true },
    in_progress: { icon: Loader2, text: 'In Progress', color: 'text-amber-400', spin: true },
    completed: { icon: CheckCircle2, text: 'Done', color: 'text-emerald-400', spin: false },
    success: { icon: CheckCircle2, text: 'Success', color: 'text-emerald-400', spin: false },
    failed: { icon: XCircle, text: 'Failed', color: 'text-red-400', spin: false },
    error: { icon: XCircle, text: 'Error', color: 'text-red-400', spin: false },
  };

  const isFailed = status === 'failed' || status === 'error';
  const cfg = isFailed
    ? statusConfig.failed
    : statusConfig[status] || statusConfig.pending;

  const Icon = cfg.icon;
  const label = isFailed
    ? (projection.error_label || cfg.text)
    : (status === 'pending' || status === 'running' || status === 'in_progress')
      ? (projection.active_label || cfg.text)
      : (projection.label || cfg.text);

  let parsedArgs = toolCall.arguments_string;
  try { parsedArgs = JSON.parse(toolCall.arguments_string); } catch {}

  let parsedResults = toolCall.results;
  if (typeof parsedResults === 'string') {
    try { parsedResults = JSON.parse(parsedResults); } catch {}
  }

  const isFailedResult = typeof parsedResults === 'object' && parsedResults !== null && parsedResults.success === false;

  if (hideDetails) {
    return (
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className={`w-3 h-3 ${cfg.spin ? 'animate-spin' : ''}`} />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className="mt-2 text-xs rounded-md border border-border bg-background/50 p-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-1.5 text-left"
      >
        {expanded ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
        <Wrench className={`w-3 h-3 shrink-0 ${cfg.color}`} />
        <span className="font-mono">{toolCall.name}</span>
        <span className={`ml-auto ${cfg.color} inline-flex items-center gap-1`}>
          <Icon className={`w-3 h-3 ${cfg.spin ? 'animate-spin' : ''}`} />
          {label}
        </span>
      </button>
      {expanded && (
        <div className="mt-2 space-y-2 pl-4 border-l border-border/50">
          {toolCall.arguments_string && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Parameters</div>
              <pre className="text-[10px] text-foreground/70 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(parsedArgs, null, 2)}</pre>
            </div>
          )}
          {toolCall.results && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Result</div>
              <pre className={`text-[10px] overflow-x-auto whitespace-pre-wrap ${isFailedResult ? 'text-red-400' : 'text-emerald-400/70'}`}>{JSON.stringify(parsedResults, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isUser ? 'ml-12' : 'mr-12'}`}>
        {message.content && (
          isUser ? (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-4 py-2">
              <p className="text-sm text-foreground">{message.content}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <ReactMarkdown className="text-sm prose prose-sm prose-invert max-w-none prose-headings:text-amber-400 prose-headings:font-bold prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-strong:text-foreground prose-li:text-foreground/80 prose-code:text-cyan-400 prose-code:bg-muted/50 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-background prose-pre:border prose-pre:border-border">
                {message.content}
              </ReactMarkdown>
            </div>
          )
        )}
        {message.tool_calls?.map((tc, idx) => (
          <FunctionDisplay key={idx} toolCall={tc} />
        ))}
      </div>
    </div>
  );
}