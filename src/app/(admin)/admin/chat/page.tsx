// ══════════════════════════════════════════════════════════════════════════════
// 💬 Chat Admin — 100% localStorage (sem API)
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  loadConversas,
  loadMensagens,
  enviarMensagem,
  marcarComoLida,
  type Conversa,
  type Mensagem,
} from "@/lib/shared-chat";
import { toast } from "sonner";
import {
  MessageCircle,
  Send,
  Search,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";

export default function ChatPage() {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setConversas(loadConversas());
    setLoaded(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // Selecionar conversa
  const selecionarConversa = (conversa: Conversa) => {
    setConversaSelecionada(conversa);
    setShowMobile(true);
    const msgs = loadMensagens(conversa.id);
    setMensagens(msgs);

    if (conversa.naoLidas > 0) {
      marcarComoLida(conversa.id);
      setConversas(loadConversas());
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Enviar mensagem
  const handleEnviar = () => {
    if (!novaMensagem.trim() || !conversaSelecionada) return;

    enviarMensagem(conversaSelecionada.id, novaMensagem.trim(), "admin", "Emmanuel");
    setNovaMensagem("");
    setMensagens(loadMensagens(conversaSelecionada.id));
    setConversas(loadConversas());
    toast.success("Mensagem enviada!");
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

  const totalNaoLidas = conversas.reduce((acc, c) => acc + c.naoLidas, 0);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] flex rounded-2xl overflow-hidden border border-dark-800 bg-dark-900">
      {/* LISTA DE CONVERSAS */}
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
          {conversasFiltradas.length === 0 ? (
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

      {/* ÁREA DE CHAT */}
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
                <button onClick={() => toast.info("Ligação — em breve")} className="p-2 text-dark-400 hover:text-brand-400 transition-colors rounded-lg hover:bg-dark-800">
                  <Phone className="h-4 w-4" />
                </button>
                <button onClick={() => toast.info("Videochamada — em breve")} className="p-2 text-dark-400 hover:text-brand-400 transition-colors rounded-lg hover:bg-dark-800">
                  <Video className="h-4 w-4" />
                </button>
                <button onClick={() => toast.info("Mais opções — em breve")} className="p-2 text-dark-400 hover:text-brand-400 transition-colors rounded-lg hover:bg-dark-800">
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
                      <p className="text-sm whitespace-pre-wrap">{msg.conteudo}</p>
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
                  handleEnviar();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => toast.info("Anexar arquivo — em breve")}
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
                  onClick={() => toast.info("Emojis — em breve")}
                  className="p-2 text-dark-400 hover:text-brand-400 transition-colors"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  disabled={!novaMensagem.trim()}
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
                Escolha um cliente para ver as mensagens
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
