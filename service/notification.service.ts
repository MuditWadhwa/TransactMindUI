import { BASE_URL } from "@/config";
import { useAuthStore } from "@/store/useAuthStore";

export const notificationService = {
  subscribeSSE(id: string, onComplete: () => void, onError?: () => void) {
    const controller = new AbortController();
    const token = useAuthStore.getState().getToken();

    (async () => {
      try {
        const response = await fetch(`${BASE_URL}/notifications/subscribe/${id}`, {
          headers: {
            Accept: "text/event-stream",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          if (chunk.includes("AI_TASK_COMPLETED")) {
            controller.abort();
            onComplete();
            return;
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError" && onError) onError();
      }
    })();

    return () => controller.abort();
  },
};