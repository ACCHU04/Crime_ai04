import { useCallback, useRef, useState } from "react";
import { generateId } from "@/lib/formatters";
import type { Intent } from "@/types/chat";
import type { ChatBubble } from "../types";
import * as chatApi from "../api/chatApi";
import { normalizeResponse } from "../utils";

export function useChat() {
  const [messages, setMessages] = useState<ChatBubble[]>([]);
  const [isSending, setIsSending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (query: string, intentHint?: Intent | null) => {
      const userMessage: ChatBubble = {
        id: generateId(),
        role: "user",
        content: query,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsSending(true);
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await chatApi.sendMessage(query, intentHint ?? null);

        if (controller.signal.aborted) return;

        const { summary, intent } = normalizeResponse(
          response.intent,
          response.agent,
          response.payload,
        );

        const assistantMessage: ChatBubble = {
          id: generateId(),
          role: "assistant",
          content: summary,
          intent,
          payload: response.payload as Record<string, unknown>,
          isError: !!response.error,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        if (controller.signal.aborted) return;

        const errorMessage: ChatBubble = {
          id: generateId(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          isError: true,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        if (!controller.signal.aborted) {
          setIsSending(false);
        }
      }
    },
    [],
  );

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setIsSending(false);
  }, []);

  return { messages, isSending, sendMessage, clearMessages };
}
