"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Bot, RotateCcw, Loader2 } from "lucide-react";
import { chatService } from "@/service/chat.service";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! Ask me anything about your expenses, budgets, or spending trends." }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem("TransactMind_chat_session_id");
    const initialSession = savedSession || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `session_${Date.now()}`);
    setSessionId(initialSession);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  const quickPrompts = [
    "Food spend this month?",
    "Where did I spend most?",
    "What is my daily burn rate?"
  ];

  const playBubbleSound = () => {
    try {
      const audio = new Audio("/sounds/message_bubble_pop_sound.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => { });
    } catch { }
  };

  const handleResetSession = () => {
    const newSession = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `session_${Date.now()}`;
    setSessionId(newSession);
    localStorage.setItem("TransactMind_chat_session_id", newSession);
    setMessages([
      { role: "ai", text: "Started a fresh session! What would you like to know about your finances?" }
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    playBubbleSound();
    setIsTyping(true);

    try {
      const activeSession = sessionId || `session_${Date.now()}`;
      const res = await chatService.chat({
        message: query,
        sessionId: activeSession,
      });

      if (res?.sessionId) {
        setSessionId(res.sessionId);
        localStorage.setItem("TransactMind_chat_session_id", res.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res?.reply || "I couldn't generate a response." }
      ]);
      playBubbleSound();
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I ran into an issue connecting to the chat service. Please try again." }
      ]);
      playBubbleSound();
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-2xl shadow-purple-900/60 border border-purple-400/30 transition-all hover:scale-105"
        >
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>Ask AI</span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 rounded-2xl border border-purple-500/30 bg-zinc-900 shadow-2xl shadow-purple-950/40 flex flex-col h-[480px] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between p-3.5 border-b border-zinc-800 bg-zinc-950/60 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-400">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">TransactMind Assistant</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">● Online</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetSession}
                title="New Chat Session"
                className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-2.5 rounded-xl whitespace-pre-wrap leading-relaxed ${m.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-zinc-950 border border-zinc-800 text-zinc-200"
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                  <span className="text-[11px]">Analyzing finances...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2.5 border-t border-zinc-800 bg-zinc-950/80 rounded-b-2xl space-y-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={isTyping}
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 text-[10px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors disabled:opacity-40"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                disabled={isTyping}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your expenses..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-3 pr-9 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-70"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="absolute right-1.5 p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-3 w-3" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}