import { motion } from "framer-motion";
import { Bot, User, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { INTENT_LABELS } from "@/lib/constants";
import type { ChatBubble } from "../types";
import { getIntentColor } from "../utils";

interface ChatMessageProps {
  message: ChatBubble;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          {message.isError ? (
            <AlertCircle className="h-4 w-4 text-red-400" />
          ) : (
            <Bot className="h-4 w-4 text-[var(--accent)]" />
          )}
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-xl px-4 py-3 ${
          isUser
            ? "bg-[var(--accent)] text-white"
            : message.isError
              ? "border border-red-500/30 bg-red-500/10 text-red-300"
              : "border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)]"
        }`}
      >
        {!isUser && message.intent && (
          <div className="mb-2 flex items-center gap-2">
            <Badge className={getIntentColor(message.intent)}>
              {INTENT_LABELS[message.intent] ?? message.intent}
            </Badge>
          </div>
        )}

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          <User className="h-4 w-4 text-[var(--text-secondary)]" />
        </div>
      )}
    </motion.div>
  );
}
