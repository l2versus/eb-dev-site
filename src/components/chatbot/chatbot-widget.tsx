// ══════════════════════════════════════════════════════════════════════════════
// 🤖 Componente: ChatbotWidget — EB Dev Assistant (Cyberpunk Theme)
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Olá! 👋 Sou o assistente virtual do Emmanuel Bezerra, desenvolvedor Full-Stack. Como posso ajudar?\n\n💡 Pergunte sobre serviços, valores, projetos ou prazos!",
      timestamp: new Date(),
      suggestions: ["Quais serviços?", "Quanto custa?", "Ver projetos", "Prazo de entrega"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setHasNewMessage(false);
    }
  }, [isOpen]);

  // Show notification after 5s
  useEffect(() => {
    const t = setTimeout(() => setHasNewMessage(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.resposta,
        timestamp: new Date(),
        suggestions: data.sugestoes,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Ops, tive um problema técnico. 😅 Tente novamente!",
          timestamp: new Date(),
          suggestions: ["Tentar novamente"],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* ─── Botão Flutuante Cyberpunk Premium ───────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            {/* Notification badge com animação melhorada */}
            {hasNewMessage && (
              <motion.div
                initial={{ scale: 0, opacity: 0, x: 10 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0, x: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -top-3 -left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#00d4e6] text-[11px] font-bold text-black whitespace-nowrap shadow-[0_0_20px_rgba(0,240,255,0.5),0_4px_12px_rgba(0,0,0,0.3)]"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </motion.div>
                Posso te ajudar!
                {/* Seta apontando para o botão */}
                <div className="absolute -bottom-1.5 right-3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#00d4e6]" />
              </motion.div>
            )}

            {/* Pulse ring animado */}
            <motion.div
              animate={{ scale: [1, 1.4, 1.4], opacity: [0.4, 0, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-[#00f0ff]/40"
            />
            <motion.div
              animate={{ scale: [1, 1.6, 1.6], opacity: [0.3, 0, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.4 }}
              className="absolute inset-0 rounded-full border-2 border-[#00f0ff]/30"
            />

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0a0a0f] to-[#14141f] border-2 border-[#00f0ff]/60 text-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.4),inset_0_0_20px_rgba(0,240,255,0.1)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6),inset_0_0_30px_rgba(0,240,255,0.2)] transition-all duration-300"
              aria-label="Abrir chat"
            >
              {/* Glow interno */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#00f0ff]/10 to-transparent" />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(0,240,255,0.15),transparent,transparent)] opacity-50"
              />
              <MessageCircle className="h-7 w-7 relative z-10" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Janela do Chat ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[600px] h-[80vh] flex flex-col rounded-2xl border border-[#00f0ff]/15 bg-[#0a0a0f]/98 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,240,255,0.1)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e2e] bg-[#0a0a0f]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/25">
                    <Zap className="h-5 w-5 text-[#00f0ff]" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#00ff41] border-2 border-[#0a0a0f]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    EB Assistant
                  </h3>
                  <p className="text-[10px] text-[#00ff41] font-mono">
                    ● Online agora
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-[#6b6b80] hover:text-white hover:bg-[#1e1e2e] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div
                    className={`flex gap-2.5 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#00f0ff]/10 text-[#00f0ff]">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-[#00f0ff] text-black rounded-br-md font-medium"
                          : "bg-[#16161f] text-[#e2e2ef] rounded-bl-md border border-[#1e1e2e]"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {msg.role === "user" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1e1e2e] text-[#6b6b80]">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {/* Sugestões rápidas */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-9">
                      {msg.suggestions.map((sug) => {
                        const isWhatsApp = /whatsapp|wpp|wp/i.test(sug);
                        if (isWhatsApp) {
                          return (
                            <a
                              key={sug}
                              href="https://wa.me/5585998500344?text=Ol%C3%A1%20Emmanuel!%20Vim%20pelo%20chat%20do%20site%20e%20quero%20falar%20sobre%20meu%20projeto."
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] px-3 py-1.5 rounded-full border border-[#00ff41]/40 text-[#00ff41] bg-[#00ff41]/5 hover:bg-[#00ff41]/15 hover:border-[#00ff41]/60 transition-all font-mono"
                            >
                              {sug}
                            </a>
                          );
                        }
                        return (
                          <button
                            key={sug}
                            onClick={() => sendMessage(sug)}
                            className="text-[11px] px-3 py-1.5 rounded-full border border-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]/40 transition-all font-mono"
                          >
                            {sug}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#00f0ff]/10 text-[#00f0ff]">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#00f0ff]/50 animate-bounce [animation-delay:0ms]" />
                      <span className="h-2 w-2 rounded-full bg-[#00f0ff]/50 animate-bounce [animation-delay:150ms]" />
                      <span className="h-2 w-2 rounded-full bg-[#00f0ff]/50 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[#1e1e2e] p-3 bg-[#0a0a0f]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 rounded-xl border border-[#1e1e2e] bg-[#16161f] px-4 py-2.5 text-sm text-white placeholder:text-[#6b6b80] focus:outline-none focus:border-[#00f0ff]/40 transition-colors font-sans"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00f0ff] text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="text-[9px] text-[#6b6b80] mt-2 text-center font-mono">
                EB Dev Assistant — Respostas instantâneas
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
