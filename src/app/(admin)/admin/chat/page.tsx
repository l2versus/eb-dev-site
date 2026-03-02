// ══════════════════════════════════════════════════════════════════════════════
// 💬 Chat Admin — Mensagens com Clientes em Tempo Real
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Search,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Archive,
  Check,
  CheckCheck,
  Circle,
  ArrowLeft,
  User,
} from "lucide-react";

interface Conversa {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteEmail: string;
  ultimaMensagem: string;
  ultimaHora: string;
  naoLidas: number;
  status: string;
}

interface Mensagem {
  id: string;
  conversaId: string;
  remetente: "admin" | "cliente";
  remetenteNome: string;
  conteudo: string;
  tipo: string;
  lida: boolean;
  createdAt: string;
}

export default function ChatPage() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar conversas
  const carregarConversas = useCallback(async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setConversas(data);
      }
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar mensagens de uma conversa
  const carregarMensagens = useCallback(async (conversaId: string) => {
    try {
      const res = await fetch(`/api/chat?conversaId=${conversaId}`);
      if (res.ok) {
        const data = await res.json();
        setMensagens(data);
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
  }, []);

  // Polling para novas mensagens
  useEffect(() => {
    carregarConversas();

    pollRef.current = setInterval(() => {
      carregarConversas();
      if (conversaSelecionada) {
        carregarMensagens(conversaSelecionada.id);
      }
    }, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [carregarConversas, carregarMensagens, conversaSelecionada]);

  // Scroll pro final ao receber mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // Selecionar conversa
  const selecionarConversa = async (conversa: Conversa) => {
    setConversaSelecionada(conversa);
    setShowMobile(true);
    await carregarMensagens(conversa.id);

    // Marcar como lidas
    if (conversa.naoLidas > 0) {
      try {
        await fetch("/api/chat", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversaId: conversa.id }),
        });
        carregarConversas();
      } catch {}
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Enviar mensagem
  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !conversaSelecionada) return;

    setEnviando(true);
    const conteudo = novaMensagem.trim();
    setNovaMensagem("");

    // Optimistic update
    const msgTemp: Mensagem = {
      id: `temp-${Date.now()}`,
      conversaId: conversaSelecionada.id,
      remetente: "admin",
      remetenteNome: "Emmanuel",
      conteudo,
      tipo: "texto",
      lida: true,
      createdAt: new Date().toISOString(),
    };
    setMensagens((prev) => [...prev, msgTemp]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversaId: conversaSelecionada.id,
          conteudo,
          remetente: "admin",
          remetenteNome: "Emmanuel",
        }),
      });

      if (res.ok) {
        carregarConversas();
        carregarMensagens(conversaSelecionada.id);
      }
    } catch (error) {
      console.error("Erro ao enviar:", error);
    } finally {
      setEnviando(false);
    }
  };

  // Formatar hora
  const formatarHora = (iso: string) => {
    const date = new Date(iso);
    const agora = new Date();
    const diffMs = agora.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);

    if (diffMin < 1) return "agora";
    if (diffMin < 60) return `${diffMin}min`;
    if (diffHr < 24) return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  // Filtrar conversas
  const conversasFiltradas = conversas.filter((c) =>
    c.clienteNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Total não lidas
  const totalNaoLidas = conversas.reduce((acc, c) => acc + c.naoLidas, 0);

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-2xl overflow-hidden border border-dark-800 bg-dark-900">
      {/* ═══ LISTA DE CONVERSAS ═══════════════════════════════════════ */}
      <div
        className={`${
          showMobile ? "hidden lg:flex" : "flex"
        } flex-col w-full lg:w-80 border-r border-dark-800 bg-dark-900`}
      >
        {/* Header */}
        <div className="p-4 border-b border-dark-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-brand-400" />
              <h2 className="font-bold text-white">Mensagens</h2>
              {totalNaoLidas > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 text-white text-[10px] font-bold px-1.5">
                  {totalNaoLidas}
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar conversa..."
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : conversasFiltradas.length === 0 ? (
            <div className="py-12 text-center text-dark-500 text-sm">
              Nenhuma conversa
            </div>
          ) : (
            conversasFiltradas.map((conversa) => (
              <button
                key={conversa.id}
                onClick={() => selecionarConversa(conversa)}
                className={`w-full flex items-start gap-3 p-4 text-left hover:bg-dark-800/50 transition-colors border-b border-dark-800/50 ${
                  conversaSelecionada?.id === conversa.id ? "bg-dark-800/80" : ""
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {conversa.clienteNome.charAt(0)}
                  </div>
                  {conversa.naoLidas > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 text-white text-[10px] font-bold px-1">
                      {conversa.naoLidas}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium truncate ${conversa.naoLidas > 0 ? "text-white" : "text-dark-300"}`}>
                      {conversa.clienteNome}
                    </p>
                    <span className="text-[10px] text-dark-500 shrink-0 ml-2">
                      {formatarHora(conversa.ultimaHora)}
                    </span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${conversa.naoLidas > 0 ? "text-dark-300 font-medium" : "text-dark-500"}`}>
                    {conversa.ultimaMensagem}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ═══ ÁREA DE CHAT ════════════════════════════════════════════ */}
      <div
        className={`${
          !showMobile ? "hidden lg:flex" : "flex"
        } flex-col flex-1 bg-dark-950`}
      >
        {conversaSelecionada ? (
          <>
            {/* Header do chat */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-dark-800 bg-dark-900">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobile(false)}
                  className="lg:hidden p-1 text-dark-400 hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {conversaSelecionada.clienteNome.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {conversaSelecionada.clienteNome}
                  </p>
                  <p className="text-[10px] text-dark-500">
                    {conversaSelecionada.clienteEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-dark-400 hover:text-brand-400 transition-colors rounded-lg hover:bg-dark-800">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 text-dark-400 hover:text-brand-400 transition-colors rounded-lg hover:bg-dark-800">
                  <Video className="h-4 w-4" />
                </button>
                <button className="p-2 text-dark-400 hover:text-brand-400 transition-colors rounded-lg hover:bg-dark-800">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mensagens.map((msg) => {
                const isAdmin = msg.remetente === "admin";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        isAdmin
                          ? "bg-brand-500 text-white rounded-br-md"
                          : "bg-dark-800 text-dark-200 rounded-bl-md"
                      }`}
                    >
                      {msg.tipo === "link" ? (
                        <a
                          href={msg.conteudo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm underline ${isAdmin ? "text-white/90" : "text-brand-400"}`}
                        >
                          🔗 {msg.conteudo}
                        </a>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.conteudo}</p>
                      )}
                      <div className={`flex items-center gap-1 mt-1 ${isAdmin ? "justify-end" : ""}`}>
                        <span className={`text-[10px] ${isAdmin ? "text-white/50" : "text-dark-500"}`}>
                          {formatarHora(msg.createdAt)}
                        </span>
                        {isAdmin && (
                          msg.lida ? (
                            <CheckCheck className="h-3 w-3 text-white/50" />
                          ) : (
                            <Check className="h-3 w-3 text-white/50" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-dark-800 bg-dark-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  enviarMensagem();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  className="p-2 text-dark-400 hover:text-brand-400 transition-colors"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  ref={inputRef}
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
                <button
                  type="button"
                  className="p-2 text-dark-400 hover:text-brand-400 transition-colors"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  disabled={!novaMensagem.trim() || enviando}
                  className="p-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Estado vazio */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-dark-600" />
              </div>
              <h3 className="text-lg font-semibold text-dark-400 mb-1">
                Selecione uma conversa
              </h3>
              <p className="text-sm text-dark-500">
                Escolha um cliente para iniciar a conversa
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
