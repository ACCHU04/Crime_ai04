import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useChat } from "./hooks/useChat";
import { ChatInput } from "./components/ChatInput";
import { ChatMessage } from "./components/ChatMessage";
import { SqlResultsTable } from "./components/SqlResultsTable";
import { AnalyticsResults } from "./components/AnalyticsResults";
import { GraphResults } from "./components/GraphResults";
import { SuggestedQuestions } from "./components/SuggestedQuestions";
import type { SqlQueryPayload } from "./types";
import type { AnalyticsPayload } from "./types";
import type { GraphPayload } from "./types";

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
        <Bot className="h-4 w-4 text-[var(--accent)]" />
      </div>
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-muted)] [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-muted)] [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-muted)] [animation-delay:300ms]" />
        </div>
      </div>
    </motion.div>
  );
}

export default function CopilotPage() {
  const { messages, isSending, sendMessage, clearMessages } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[calc(100vh-4rem)] flex-col"
    >
      <div className="flex items-center justify-between">
        <PageHeader
          title="AI Copilot"
          description="Natural language crime intelligence assistant"
        />
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearMessages} className="gap-1.5">
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
        <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <Bot className="h-8 w-8 text-[var(--accent)]" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-[var(--text-primary)]">Ask anything</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  The AI classifies your intent and routes to SQL queries, analytics, graph exploration, or investigation tools.
                </p>
              </div>
              <SuggestedQuestions onSelect={sendMessage} disabled={isSending} />
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              <ChatMessage message={msg} />
              {msg.role === "assistant" && !msg.isError && msg.payload && (
                <div className="ml-11">
                  {renderPayload(msg.intent, msg.payload)}
                </div>
              )}
            </div>
          ))}

          {isSending && <TypingIndicator />}
        </div>
      </div>

      <div className="mt-3">
        <ChatInput onSend={sendMessage} disabled={isSending} />
      </div>
    </motion.div>
  );
}

function renderPayload(intent: string | undefined, payload: Record<string, unknown>): React.ReactNode {
  if (!payload) return null;

  switch (intent) {
    case "sql_query":
      return <SqlResultsTable payload={payload as unknown as SqlQueryPayload} />;
    case "analytics":
      return <AnalyticsResults payload={payload as unknown as AnalyticsPayload} />;
    case "graph":
      return <GraphResults payload={payload as unknown as GraphPayload} />;
    default:
      return null;
  }
}
