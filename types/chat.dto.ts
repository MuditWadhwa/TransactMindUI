interface ChatSession {
  sessionId: string;
}

export interface ChatMessageDto extends ChatSession {
  message: string;
}

export interface ChatReplyDto extends ChatSession {
  reply: string;
}