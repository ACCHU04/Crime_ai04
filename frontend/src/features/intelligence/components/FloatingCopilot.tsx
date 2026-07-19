import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Trash2, Send, Loader2, User, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { INTENT_LABELS } from "@/lib/constants";
import type { ChatBubble } from "@/features/copilot/types";
import { getIntentColor } from "@/features/copilot/utils";
import { useFloatingChat } from "../hooks/useFloatingChat";
import { SuggestedQuestions } from "@/features/copilot/components/SuggestedQuestions";

function FloatingMessage({ message }: { message: ChatBubble }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
          {message.isError ? (
            <AlertCircle className="h-3 w-3 text-red-400" />
          ) : (
            <Bot className="h-3 w-3 text-blue-400" />
          )}
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 ${
          isUser
            ? "bg-blue-600 text-white"
            : message.isError
              ? "border border-red-500/30 bg-red-500/10 text-red-300"
              : "border border-slate-700 bg-slate-800 text-slate-200"
        }`}
      >
        {!isUser && message.intent && (
          <div className="mb-1">
            <Badge className={`${getIntentColor(message.intent)} text-[9px] px-1.5 py-0`}>
              {INTENT_LABELS[message.intent] ?? message.intent}
            </Badge>
          </div>
        )}
        <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>

      {isUser && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
          <User className="h-3 w-3 text-slate-400" />
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
        <Bot className="h-3 w-3 text-blue-400" />
      </div>
      <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export function FloatingCopilot() {
  const { messages, isSending, isOpen, sendMessage, clearMessages, toggleOpen } =
    useFloatingChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input) return;
    const trimmed = input.value.trim();
    if (!trimmed || isSending) return;
    sendMessage(trimmed);
    input.value = "";
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-600/30 text-white transition-colors hover:bg-blue-500"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Bot className="h-6 w-6" />
        )}
        {!isOpen && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
            {messages.length > 99 ? "99" : messages.length}
          </span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[500px] flex flex-col rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-slate-200">Copilot</span>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearMessages}
                    className="rounded p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                    title="Clear history"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={toggleOpen}
                  className="rounded p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Ask about cases, trends, or networks</p>
                  </div>
                  <SuggestedQuestions onSelect={sendMessage} disabled={isSending} />
                </div>
              )}

              {messages.map((msg) => (
                <FloatingMessage key={msg.id} message={msg} />
              ))}

              {isSending && <TypingIndicator />}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-slate-700 p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask anything..."
                  disabled={isSending}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
