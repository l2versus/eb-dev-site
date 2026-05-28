// ══════════════════════════════════════════════════════════════════════════════
// 📋 Projetos Kanban — Drag & Drop + Scroll por arrasto (estilo ClickUp)
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FolderKanban,
  Plus,
  Clock,
  DollarSign,
  User,
  BarChart3,
  GripVertical,
  Calendar,
  Edit3,
  Trash2,
  X,
  Eye,
} from "lucide-react";

type ProjetoStatus = "briefing" | "design" | "desenvolvimento" | "revisao" | "entregue";
type ProjetoPrioridade = "baixa" | "media" | "alta" | "urgente";

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  clienteNome: string;
  clienteEmail: string;
  status: ProjetoStatus;
  prioridade: ProjetoPrioridade;
  valor: number;
  progresso: number;
  prazo: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

const COLUNAS = [
  { key: "briefing" as const, label: "📋 Briefing", color: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/30", badge: "bg-blue-500/20 text-blue-300" },
  { key: "design" as const, label: "🎨 Design", color: "from-purple-500/20 to-purple-600/5", border: "border-purple-500/30", badge: "bg-purple-500/20 text-purple-300" },
  { key: "desenvolvimento" as const, label: "⚡ Desenvolvimento", color: "from-amber-500/20 to-amber-600/5", border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-300" },
  { key: "revisao" as const, label: "🔍 Revisão", color: "from-cyan-500/20 to-cyan-600/5", border: "border-cyan-500/30", badge: "bg-cyan-500/20 text-cyan-300" },
  { key: "entregue" as const, label: "✅ Entregue", color: "from-green-500/20 to-green-600/5", border: "border-green-500/30", badge: "bg-green-500/20 text-green-300" },
];

const PRIORIDADES: Record<ProjetoPrioridade, { label: string; color: string }> = {
  baixa: { label: "Baixa", color: "bg-dark-700 text-dark-300" },
  media: { label: "Média", color: "bg-blue-500/20 text-blue-300" },
  alta: { label: "Alta", color: "bg-amber-500/20 text-amber-300" },
  urgente: { label: "Urgente", color: "bg-red-500/20 text-red-300" },
};

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [detalheProjeto, setDetalheProjeto] = useState<Projeto | null>(null);
  const [editando, setEditando] = useState<Projeto | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "lista">("kanban");

  // ─── Drag & Drop state ────────────────────────────────────────────
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ProjetoStatus | null>(null);

  // ─── Drag-to-scroll (estilo ClickUp) ──────────────────────────────
  const boardRef = useRef<HTMLDivElement>(null);
  const isDraggingBoard = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleBoardPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Só ativa scroll por arrasto se clicou no fundo do board (não em um card)
    const target = e.target as HTMLElement;
    if (target.closest("[data-card]") || target.closest("button")) return;
    
    isDraggingBoard.current = true;
    startX.current = e.clientX;
    scrollLeft.current = boardRef.current?.scrollLeft || 0;
    boardRef.current?.setPointerCapture(e.pointerId);
    if (boardRef.current) boardRef.current.style.cursor = "grabbing";
  }, []);

  const handleBoardPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingBoard.current || !boardRef.current) return;
    e.preventDefault();
    const dx = e.clientX - startX.current;
    boardRef.current.scrollLeft = scrollLeft.current - dx;
  }, []);

  const handleBoardPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingBoard.current = false;
    if (boardRef.current) {
      boardRef.current.releasePointerCapture(e.pointerId);
      boardRef.current.style.cursor = "grab";
    }
  }, []);

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    clienteNome: "",
    clienteEmail: "",
    status: "briefing" as ProjetoStatus,
    prioridade: "media" as ProjetoPrioridade,
    valor: 0,
    prazo: "",
    tags: "",
  });

  const fetchProjetos = useCallback(async () => {
    try {
      const res = await fetch("/api/projetos");
      if (!res.ok) throw new Error("Erro ao carregar projetos");
      const data = await res.json();
      setProjetos(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao carregar projetos");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void fetchProjetos();
  }, [fetchProjetos]);

  // Mover projeto para coluna (via drag ou botão)
  const moverProjeto = async (projeto: Projeto, novoStatus: ProjetoStatus) => {
    const progressoMap: Record<ProjetoStatus, number> = {
      briefing: 10, design: 30, desenvolvimento: 60, revisao: 85, entregue: 100,
    };

    try {
      const res = await fetch("/api/projetos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: projeto.id,
          status: novoStatus,
          progresso: progressoMap[novoStatus],
        }),
      });
      if (!res.ok) throw new Error("Erro ao mover projeto");
      await fetchProjetos();
      toast.success(`Movido para ${COLUNAS.find(c => c.key === novoStatus)?.label || novoStatus}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao mover projeto");
    }
  };

  // ─── Drag handlers ─────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, projetoId: string) => {
    setDraggedId(projetoId);
    e.dataTransfer.effectAllowed = "move";
    // Transparência visual no card arrastado
    const el = e.currentTarget as HTMLElement;
    setTimeout(() => el.style.opacity = "0.4", 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = "1";
    setDraggedId(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent, colKey: ProjetoStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colKey);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, colKey: ProjetoStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    if (!draggedId) return;
    const projeto = projetos.find(p => p.id === draggedId);
    if (projeto && projeto.status !== colKey) {
      void moverProjeto(projeto, colKey);
    }
    setDraggedId(null);
  };

  // ─── Touch drag (mobile) ──────────────────────────────────────────
  const touchDragId = useRef<string | null>(null);
  const touchClone = useRef<HTMLElement | null>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const handleTouchStart = (e: React.TouchEvent, projetoId: string) => {
    const touch = e.touches[0];
    touchDragId.current = projetoId;
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    hasMoved.current = false;
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchDragId.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPos.current.x);
    const dy = Math.abs(touch.clientY - touchStartPos.current.y);
    
    // Só ativa drag se moveu mais de 10px
    if (dx < 10 && dy < 10) return;
    hasMoved.current = true;
    e.preventDefault();

    // Criar clone visual
    if (!touchClone.current) {
      const card = document.querySelector(`[data-card-id="${touchDragId.current}"]`) as HTMLElement;
      if (!card) return;
      const clone = card.cloneNode(true) as HTMLElement;
      clone.style.position = "fixed";
      clone.style.zIndex = "9999";
      clone.style.width = card.offsetWidth + "px";
      clone.style.opacity = "0.85";
      clone.style.pointerEvents = "none";
      clone.style.transform = "rotate(3deg) scale(1.05)";
      clone.style.boxShadow = "0 20px 40px rgba(0,0,0,0.5)";
      document.body.appendChild(clone);
      touchClone.current = clone;
      card.style.opacity = "0.3";
    }

    touchClone.current.style.left = touch.clientX - 130 + "px";
    touchClone.current.style.top = touch.clientY - 40 + "px";

    // Highlight coluna sob o touch
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const colEl = elements.find(el => (el as HTMLElement).dataset?.colKey) as HTMLElement | undefined;
    
    document.querySelectorAll("[data-col-key]").forEach(el => {
      (el as HTMLElement).style.background = "";
    });
    if (colEl) {
      colEl.style.background = "rgba(0, 240, 255, 0.05)";
      setDragOverCol(colEl.dataset.colKey as ProjetoStatus);
    } else {
      setDragOverCol(null);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchDragId.current) return;
    
    // Limpar clone visual
    if (touchClone.current) {
      touchClone.current.remove();
      touchClone.current = null;
    }

    // Restaurar opacidade do card original
    const card = document.querySelector(`[data-card-id="${touchDragId.current}"]`) as HTMLElement;
    if (card) card.style.opacity = "1";

    // Limpar highlights
    document.querySelectorAll("[data-col-key]").forEach(el => {
      (el as HTMLElement).style.background = "";
    });

    // Drop na coluna
    if (hasMoved.current && dragOverCol && touchDragId.current) {
      const projeto = projetos.find(p => p.id === touchDragId.current);
      if (projeto && projeto.status !== dragOverCol) {
        void moverProjeto(projeto, dragOverCol);
      }
    }

    touchDragId.current = null;
    setDragOverCol(null);
    hasMoved.current = false;
  }, [dragOverCol, projetos]);

  useEffect(() => {
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

  // Salvar projeto (criar ou editar)
  const salvarProjeto = async () => {
    const payload = {
      titulo: form.titulo,
      descricao: form.descricao,
      clienteNome: form.clienteNome,
      clienteEmail: form.clienteEmail,
      status: form.status,
      prioridade: form.prioridade,
      valor: form.valor,
      prazo: form.prazo || new Date(Date.now() + 30 * 86400000).toISOString(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (editando) {
      const res = await fetch("/api/projetos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editando.id, ...payload }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Erro ao atualizar projeto.");
        return;
      }
      toast.success("Projeto atualizado!");
    } else {
      const res = await fetch("/api/projetos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Erro ao criar projeto.");
        return;
      }
      toast.success("Projeto criado!");
    }
    await fetchProjetos();
    fecharModal();
  };

  // Excluir
  const excluirProjeto = async (id: string) => {
    const res = await fetch(`/api/projetos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || "Erro ao excluir projeto.");
      return;
    }
    await fetchProjetos();
    setDetalheProjeto(null);
    toast.success("Projeto excluido!");
  };

  // Modal
  const abrirModal = (projeto?: Projeto) => {
    if (projeto) {
      setEditando(projeto);
      setForm({
        titulo: projeto.titulo,
        descricao: projeto.descricao,
        clienteNome: projeto.clienteNome,
        clienteEmail: projeto.clienteEmail,
        status: projeto.status,
        prioridade: projeto.prioridade,
        valor: projeto.valor,
        prazo: projeto.prazo.split("T")[0],
        tags: projeto.tags.join(", "),
      });
    } else {
      setEditando(null);
      setForm({
        titulo: "", descricao: "", clienteNome: "", clienteEmail: "",
        status: "briefing", prioridade: "media", valor: 0, prazo: "", tags: "",
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEditando(null);
  };

  // Stats
  const totalValor = projetos.reduce((acc, p) => acc + p.valor, 0);
  const emAndamento = projetos.filter((p) => p.status !== "entregue").length;
  const mediaProgresso = projetos.length > 0
    ? Math.round(projetos.reduce((acc, p) => acc + p.progresso, 0) / projetos.length)
    : 0;

  const diasRestantes = (prazo: string) => {
    const diff = Math.ceil((new Date(prazo).getTime() - Date.now()) / 86400000);
    if (diff < 0) return { text: `${Math.abs(diff)}d atrasado`, color: "text-red-400" };
    if (diff === 0) return { text: "Hoje", color: "text-amber-400" };
    if (diff <= 3) return { text: `${diff}d`, color: "text-amber-400" };
    return { text: `${diff}d`, color: "text-dark-400" };
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="h-5 w-5 sm:h-6 sm:w-6 text-brand-400" />
            Projetos
          </h1>
          <p className="text-sm text-dark-400 mt-1">
            {projetos.length} projetos · {emAndamento} em andamento
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex bg-dark-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${viewMode === "kanban" ? "bg-brand-500 text-white" : "text-dark-400 hover:text-white"}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode("lista")}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${viewMode === "lista" ? "bg-brand-500 text-white" : "text-dark-400 hover:text-white"}`}
            >
              Lista
            </button>
          </div>
          <Button size="sm" onClick={() => abrirModal()} className="gap-2">
            <Plus className="h-4 w-4" /> Novo
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="p-3 sm:p-4 bg-dark-900 border-dark-800">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-brand-500/10">
              <FolderKanban className="h-4 w-4 sm:h-5 sm:w-5 text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-dark-400">Total</p>
              <p className="text-lg sm:text-xl font-bold text-white">{projetos.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-dark-900 border-dark-800">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-dark-400">Valor Total</p>
              <p className="text-sm sm:text-xl font-bold text-white truncate">
                R$ {totalValor.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-dark-900 border-dark-800">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-dark-400">Progresso</p>
              <p className="text-lg sm:text-xl font-bold text-white">{mediaProgresso}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* KANBAN VIEW — Drag & Drop + Scroll por arrasto */}
      {viewMode === "kanban" ? (
        <div
          ref={boardRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-1 px-1 select-none"
          style={{ cursor: "grab", scrollBehavior: "auto" }}
          onPointerDown={handleBoardPointerDown}
          onPointerMove={handleBoardPointerMove}
          onPointerUp={handleBoardPointerUp}
          onPointerCancel={handleBoardPointerUp}
        >
          {COLUNAS.map((coluna) => {
            const projetosColuna = projetos.filter((p) => p.status === coluna.key);
            const isOver = dragOverCol === coluna.key;

            return (
              <div
                key={coluna.key}
                className="shrink-0 w-64 sm:w-72"
                data-col-key={coluna.key}
                onDragOver={(e) => handleDragOver(e, coluna.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, coluna.key)}
              >
                <div className={`rounded-t-xl p-3 bg-gradient-to-b ${coluna.color} border ${coluna.border} border-b-0`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">{coluna.label}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${coluna.badge}`}>
                      {projetosColuna.length}
                    </span>
                  </div>
                </div>

                <div
                  className={`space-y-2 p-2 border ${coluna.border} border-t-0 rounded-b-xl min-h-[200px] transition-colors duration-200 ${
                    isOver
                      ? "bg-brand-500/10 border-brand-500/40 ring-2 ring-brand-500/20"
                      : "bg-dark-900/50"
                  }`}
                >
                  {projetosColuna.map((projeto) => {
                    const prazoInfo = diasRestantes(projeto.prazo);
                    const isDragged = draggedId === projeto.id;
                    return (
                      <div
                        key={projeto.id}
                        data-card
                        data-card-id={projeto.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, projeto.id)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) => handleTouchStart(e, projeto.id)}
                        onClick={() => {
                          if (!hasMoved.current) setDetalheProjeto(projeto);
                        }}
                        className={`bg-dark-900 border border-dark-800 rounded-xl p-3 hover:border-dark-700 transition-all group cursor-grab active:cursor-grabbing ${
                          isDragged ? "opacity-40 scale-95" : ""
                        }`}
                      >
                        {/* Drag handle indicator */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PRIORIDADES[projeto.prioridade].color}`}>
                            {PRIORIDADES[projeto.prioridade].label}
                          </span>
                          <GripVertical className="h-3.5 w-3.5 text-dark-600 group-hover:text-dark-400 transition-colors" />
                        </div>

                        <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">{projeto.titulo}</h4>
                        <p className="text-[11px] text-dark-400 flex items-center gap-1 mb-2">
                          <User className="h-3 w-3" />
                          {projeto.clienteNome}
                        </p>

                        <div className="mb-2">
                          <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all"
                              style={{ width: `${projeto.progresso}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-dark-500 mt-0.5">{projeto.progresso}%</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-dark-500" />
                            <span className={`text-[10px] font-medium ${prazoInfo.color}`}>{prazoInfo.text}</span>
                          </div>
                          <span className="text-[10px] text-dark-500 font-medium">
                            R$ {projeto.valor.toLocaleString("pt-BR")}
                          </span>
                        </div>

                        {projeto.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {projeto.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-dark-800 text-dark-400">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {projetosColuna.length === 0 && (
                    <div className={`py-8 text-center border-2 border-dashed rounded-xl transition-colors ${
                      isOver ? "border-brand-500/40 bg-brand-500/5" : "border-dark-800/50"
                    }`}>
                      <p className="text-xs text-dark-600">
                        {isOver ? "Soltar aqui" : "Arraste um card aqui"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LISTA VIEW */
        <Card className="bg-dark-900 border-dark-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-800">
                  <th className="text-left text-xs font-medium text-dark-400 p-4">Projeto</th>
                  <th className="text-left text-xs font-medium text-dark-400 p-4">Cliente</th>
                  <th className="text-left text-xs font-medium text-dark-400 p-4">Status</th>
                  <th className="text-left text-xs font-medium text-dark-400 p-4">Prioridade</th>
                  <th className="text-left text-xs font-medium text-dark-400 p-4">Progresso</th>
                  <th className="text-left text-xs font-medium text-dark-400 p-4">Prazo</th>
                  <th className="text-right text-xs font-medium text-dark-400 p-4">Valor</th>
                  <th className="text-right text-xs font-medium text-dark-400 p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {projetos.map((projeto) => {
                  const col = COLUNAS.find((c) => c.key === projeto.status)!;
                  const prazoInfo = diasRestantes(projeto.prazo);
                  return (
                    <tr key={projeto.id} className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-medium text-white">{projeto.titulo}</p>
                        <div className="flex gap-1 mt-1">
                          {projeto.tags.slice(0, 2).map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-dark-800 text-dark-400">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-dark-300">{projeto.clienteNome}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${col.badge}`}>{col.label}</span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${PRIORIDADES[projeto.prioridade].color}`}>
                          {PRIORIDADES[projeto.prioridade].label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-dark-800 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${projeto.progresso}%` }} />
                          </div>
                          <span className="text-xs text-dark-400">{projeto.progresso}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs ${prazoInfo.color}`}>{prazoInfo.text}</span>
                      </td>
                      <td className="p-4 text-right text-sm text-white font-medium">
                        R$ {projeto.valor.toLocaleString("pt-BR")}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setDetalheProjeto(projeto)} className="p-1.5 text-dark-400 hover:text-brand-400 rounded-lg hover:bg-dark-800">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => abrirModal(projeto)} className="p-1.5 text-dark-400 hover:text-amber-400 rounded-lg hover:bg-dark-800">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => void excluirProjeto(projeto.id)} className="p-1.5 text-dark-400 hover:text-red-400 rounded-lg hover:bg-dark-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODAL DETALHE */}
      {detalheProjeto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetalheProjeto(null)}>
          <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORIDADES[detalheProjeto.prioridade].color}`}>
                      {PRIORIDADES[detalheProjeto.prioridade].label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${COLUNAS.find((c) => c.key === detalheProjeto.status)!.badge}`}>
                      {COLUNAS.find((c) => c.key === detalheProjeto.status)!.label}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{detalheProjeto.titulo}</h2>
                </div>
                <button onClick={() => setDetalheProjeto(null)} className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-dark-300 mb-4">{detalheProjeto.descricao}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between py-2 border-b border-dark-800">
                  <span className="text-xs text-dark-400 flex items-center gap-1"><User className="h-3 w-3" /> Cliente</span>
                  <span className="text-sm text-white">{detalheProjeto.clienteNome}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-dark-800">
                  <span className="text-xs text-dark-400 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Valor</span>
                  <span className="text-sm text-white font-medium">R$ {detalheProjeto.valor.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-dark-800">
                  <span className="text-xs text-dark-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> Prazo</span>
                  <span className={`text-sm font-medium ${diasRestantes(detalheProjeto.prazo).color}`}>
                    {new Date(detalheProjeto.prazo).toLocaleDateString("pt-BR")} ({diasRestantes(detalheProjeto.prazo).text})
                  </span>
                </div>
                <div className="py-2 border-b border-dark-800">
                  <span className="text-xs text-dark-400 block mb-2">Progresso</span>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all" style={{ width: `${detalheProjeto.progresso}%` }} />
                  </div>
                  <p className="text-xs text-dark-500 mt-1">{detalheProjeto.progresso}% completo</p>
                </div>
              </div>

              {detalheProjeto.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {detalheProjeto.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-lg bg-dark-800 text-dark-300">{tag}</span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => { setDetalheProjeto(null); abrirModal(detalheProjeto); }} variant="outline" className="flex-1 gap-1">
                  <Edit3 className="h-4 w-4" /> Editar
                </Button>
                <Button onClick={() => void excluirProjeto(detalheProjeto.id)} className="gap-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30">
                  <Trash2 className="h-4 w-4" /> Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CRIAR/EDITAR */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={fecharModal}>
          <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">
                  {editando ? "Editar Projeto" : "Novo Projeto"}
                </h2>
                <button onClick={fecharModal} className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-dark-400 mb-1 block">Título do Projeto *</label>
                  <input
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    placeholder="Ex: Site Institucional — Empresa X"
                  />
                </div>
                <div>
                  <label className="text-xs text-dark-400 mb-1 block">Descrição</label>
                  <textarea
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    rows={3}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
                    placeholder="Descreva o escopo do projeto..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Cliente</label>
                    <input
                      value={form.clienteNome}
                      onChange={(e) => setForm({ ...form, clienteNome: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Email</label>
                    <input
                      value={form.clienteEmail}
                      onChange={(e) => setForm({ ...form, clienteEmail: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as ProjetoStatus })}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    >
                      {COLUNAS.map((c) => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Prioridade</label>
                    <select
                      value={form.prioridade}
                      onChange={(e) => setForm({ ...form, prioridade: e.target.value as ProjetoPrioridade })}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Valor (R$)</label>
                    <input
                      type="number"
                      value={form.valor}
                      onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Prazo</label>
                    <input
                      type="date"
                      value={form.prazo}
                      onChange={(e) => setForm({ ...form, prazo: e.target.value })}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-dark-400 mb-1 block">Tags (separadas por vírgula)</label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    placeholder="Next.js, React, E-commerce"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button onClick={fecharModal} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={() => void salvarProjeto()} disabled={!form.titulo.trim()} className="flex-1">
                  {editando ? "Salvar" : "Criar Projeto"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
