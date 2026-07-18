import api from "@/services/axios";
import type { ChatRequest, ChatResponse, Intent } from "@/types/chat";

export async function sendMessage(
  query: string,
  intentHint?: Intent | null,
): Promise<ChatResponse> {
  const payload: ChatRequest = {
    query,
    intent_hint: intentHint ?? null,
  };

  const { data } = await api.post<ChatResponse>("/chat/", payload);
  return data;
}
