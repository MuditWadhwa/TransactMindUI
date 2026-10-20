import { ChatMessageDto, ChatReplyDto } from "@/types/chat.dto";
import { apiClient } from "./apiClient";

export const chatService = {
  async chat(message: ChatMessageDto) {
    return await apiClient<ChatReplyDto>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(message)
    });
  }
}