import { useCallback, useEffect, useRef, useState } from "react";
import { generateId } from "@/lib/formatters";
import type { Intent } from "@/types/chat";
import type { ChatBubble } from "@/features/copilot/types";
import * as chatApi from "@/features/copilot/api/chatApi";
import { normalizeResponse } from "@/features/copilot/utils";

const STORAGE_KEY = "crime-ai-copilot-history";
const MAX_MESSAGES = 50;

function loadHistory(): ChatBubble[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-MAX_MESSAGES);
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatBubble[]) {
  try {
    const toSave = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function useFloatingChat() {
  const [messages, setMessages] = useState<ChatBubble[]>(loadHistory);
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

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
      } catch {
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
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    messages,
    isSending,
    isOpen,
    sendMessage,
    clearMessages,
    toggleOpen,
  };
}
