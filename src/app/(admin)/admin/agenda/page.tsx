// ══════════════════════════════════════════════════════════════════════════════
// 📅 Agenda Admin — Gerenciamento de Compromissos (Funcional com Mock)
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  Phone,
  Video,
  MessageSquare,
  Presentation,
  Rocket,
  Code,
  Loader2,
  RefreshCw,
  Edit,
  Trash2,
  Save,
} from "lucide-react";

type StatusCompromisso =
  | "PENDENTE"
  | "CONFIRMADO"
  | "EM_ANDAMENTO"
  | "CONCLUIDO"
  | "CANCELADO"
  | "REAGENDADO";

type TipoCompromisso =
  | "CALL"
  | "BRIEFING"
  | "PROPOSTA"
  | "ENTREGA"
  | "REVIEW"
  | "FOLLOWUP"
  | "REUNIAO";

const statusConfig: Record<StatusCompromisso, { label: string; color: string; bg: string }> = {
  PENDENTE: { label: "Pendente", color: "text-amber-400", bg: "bg-amber-500/10" },
  CONFIRMADO: { label: "Confirmado", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  EM_ANDAMENTO: { label: "Em Andamento", color: "text-blue-400", bg: "bg-blue-500/10" },
  CONCLUIDO: { label: "Concluído", color: "text-purple-400", bg: "bg-purple-500/10" },
  CANCELADO: { label: "Cancelado", color: "text-red-400", bg: "bg-red-500/10" },
  REAGENDADO: { label: "Reagendado", color: "text-cyan-400", bg: "bg-cyan-500/10" },
};

const tipoConfig: Record<TipoCompromisso, { label: string; icon: typeof Video; color: string }> = {
  CALL: { label: "Call", icon: Video, color: "text-brand-400" },
  BRIEFING: { label: "Briefing", icon: MessageSquare, color: "text-purple-400" },
  PROPOSTA: { label: "Proposta", icon: Presentation, color: "text-gold-400" },
  ENTREGA: { label: "Entrega", icon: Rocket, color: "text-emerald-400" },
  REVIEW: { label: "Review", icon: Code, color: "text-blue-400" },
  FOLLOWUP: { label: "Follow-up", icon: Phone, color: "text-amber-400" },
  REUNIAO: { label: "Reunião", icon: Video, color: "text-cyan-400" },
};

interface Compromisso {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: TipoCompromisso;
  dataHora: string;
  duracao: number;
  status: StatusCompromisso;
  plataforma?: string;
  linkReuniao?: string;
  notas?: string;
  clienteNome?: string;
}

// Dados mock iniciais
const compromissosMock: Compromisso[] = [
  {
    id: "1",
    titulo: "Validação do design da home",
    tipo: "REVIEW",
    dataHora: new Date().toISOString().split("T")[0] + "T09:00:00",
    duracao: 30,
    status: "CONCLUIDO",
    plataforma: "Google Meet",
    notas: "Validação do design da home",
    clienteNome: "Myka Procópio",
  },
  {
    id: "2",
    titulo: "Alinhamento de funcionalidades",
    tipo: "CALL",
    dataHora: new Date().toISOString().split("T")[0] + "T10:00:00",
    duracao: 45,
    status: "EM_ANDAMENTO",
    plataforma: "Zoom",
    notas: "Alinhamento de funcionalidades",
    clienteNome: "Tech Solutions",
  },
  {
    id: "3",
    titulo: "Entrega final + ajustes",
    tipo: "ENTREGA",
    dataHora: new Date().toISOString().split("T")[0] + "T11:30:00",
    duracao: 15,
    status: "CONFIRMADO",
    clienteNome: "João Silva",
  },
  {
    id: "4",
    titulo: "Apresentar proposta comercial",
    tipo: "PROPOSTA",
    dataHora: new Date().toISOString().split("T")[0] + "T14:00:00",
    duracao: 30,
    status: "PENDENTE",
    plataforma: "Google Meet",
    notas: "Apresentar proposta comercial",
    clienteNome: "Clínica Vida",
  },
  {
    id: "5",
    titulo: "Levantar requisitos do e-commerce",
    tipo: "BRIEFING",
    dataHora: new Date().toISOString().split("T")[0] + "T15:00:00",
    duracao: 45,
    status: "CONFIRMADO",
    plataforma: "WhatsApp",
    notas: "Levantar requisitos do e-commerce",
    clienteNome: "Café Aroma",
  },
  {
    id: "6",
    titulo: "Retornar sobre proposta enviada",
    tipo: "FOLLOWUP",
    dataHora: new Date().toISOString().split("T")[0] + "T16:00:00",
    duracao: 15,
    status: "PENDENTE",
    plataforma: "WhatsApp",
    clienteNome: "Marina Costa",
  },
];

export default function AgendaPage() {
  // Estados
  const [compromissos, setCompromissos] = useState<Compromisso[]>(compromissosMock);
  const [loading, setLoading] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [filtroStatus, setFiltroStatus] = useState<StatusCompromisso | "TODOS">("TODOS");
  const [filtroTipo, setFiltroTipo] = useState<TipoCompromisso | "TODOS">("TODOS");
  const [showModal, setShowModal] = useState(false);
  const [editingCompromisso, setEditingCompromisso] = useState<Compromisso | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    tipo: "REUNIAO" as TipoCompromisso,
    dataHora: "",
    duracao: 30,
    status: "PENDENTE" as StatusCompromisso,
    plataforma: "Google Meet",
    linkReuniao: "",
    notas: "",
    clienteNome: "",
  });

  // Formatar data para exibição
  const formatarDataExibicao = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Navegar datas
  const navegarData = (direcao: "anterior" | "proxima") => {
    const novaData = new Date(dataSelecionada);
    novaData.setDate(novaData.getDate() + (direcao === "proxima" ? 1 : -1));
    setDataSelecionada(novaData);
  };

  // Filtrar compromissos do dia
  const compromissosDoDia = compromissos.filter((c) => {
    const dataComp = new Date(c.dataHora).toDateString();
    const dataSel = dataSelecionada.toDateString();
    return dataComp === dataSel;
  });

  // Filtrar por status e tipo
  const compromissosFiltrados = compromissosDoDia.filter((c) => {
    const matchStatus = filtroStatus === "TODOS" || c.status === filtroStatus;
    const matchTipo = filtroTipo === "TODOS" || c.tipo === filtroTipo;
    return matchStatus && matchTipo;
  });

  // Stats do dia
  const stats = {
    total: compromissosDoDia.length,
    confirmados: compromissosDoDia.filter((c) => c.status === "CONFIRMADO" || c.status === "EM_ANDAMENTO").length,
    pendentes: compromissosDoDia.filter((c) => c.status === "PENDENTE").length,
    concluidos: compromissosDoDia.filter((c) => c.status === "CONCLUIDO").length,
  };

  // Horários disponíveis
  const horariosOcupados = compromissosDoDia.map((c) => {
    const hora = new Date(c.dataHora).getHours();
    return `${hora.toString().padStart(2, "0")}:00`;
  });
  const todosHorarios = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  // Reset form
  const resetForm = () => {
    const agora = new Date(dataSelecionada);
    agora.setHours(agora.getHours() + 1, 0, 0, 0);

    setForm({
      titulo: "",
      descricao: "",
      tipo: "REUNIAO",
      dataHora: agora.toISOString().slice(0, 16),
      duracao: 30,
      status: "PENDENTE",
      plataforma: "Google Meet",
      linkReuniao: "",
      notas: "",
      clienteNome: "",
    });
  };

  // Abrir modal novo
  const abrirNovoCompromisso = (horario?: string) => {
    setEditingCompromisso(null);
    const dataBase = new Date(dataSelecionada);
    if (horario) {
      const [hora] = horario.split(":");
      dataBase.setHours(parseInt(hora), 0, 0, 0);
    } else {
      dataBase.setHours(dataBase.getHours() + 1, 0, 0, 0);
    }
    setForm({
      titulo: "",
      descricao: "",
      tipo: "REUNIAO",
      dataHora: dataBase.toISOString().slice(0, 16),
      duracao: 30,
      status: "PENDENTE",
      plataforma: "Google Meet",
      linkReuniao: "",
      notas: "",
      clienteNome: "",
    });
    setShowModal(true);
  };

  // Abrir modal edição
  const abrirEdicao = (comp: Compromisso) => {
    setEditingCompromisso(comp);
    setForm({
      titulo: comp.titulo,
      descricao: comp.descricao || "",
      tipo: comp.tipo,
      dataHora: comp.dataHora.slice(0, 16),
      duracao: comp.duracao,
      status: comp.status,
      plataforma: comp.plataforma || "Google Meet",
      linkReuniao: comp.linkReuniao || "",
      notas: comp.notas || "",
      clienteNome: comp.clienteNome || "",
    });
    setShowModal(true);
  };

  // Salvar compromisso
  const salvarCompromisso = () => {
    setSaving(true);

    setTimeout(() => {
      if (editingCompromisso) {
        // Editar existente
        setCompromissos((prev) =>
          prev.map((c) =>
            c.id === editingCompromisso.id
              ? { ...c, ...form }
              : c
          )
        );
      } else {
        // Criar novo
        const novo: Compromisso = {
          id: `comp-${Date.now()}`,
          ...form,
        };
        setCompromissos((prev) => [...prev, novo]);
      }

      setShowModal(false);
      setEditingCompromisso(null);
      resetForm();
      setSaving(false);
    }, 300);
  };

  // Excluir compromisso
  const excluirCompromisso = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este compromisso?")) return;
    setCompromissos((prev) => prev.filter((c) => c.id !== id));
  };

  // Alterar status rápido
  const alterarStatus = (id: string, novoStatus: StatusCompromisso) => {
    setCompromissos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: novoStatus } : c))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Minha Agenda</h2>
          <p className="text-dark-400 mt-1">Calls, reuniões e entregas programadas</p>
        </div>
        <Button
          variant="gold"
          size="sm"
          onClick={() => abrirNovoCompromisso()}
          icon={<Plus className="h-4 w-4" />}
        >
          Novo Compromisso
        </Button>
      </div>

      {/* Stats por tipo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(tipoConfig).map(([tipo, cfg]) => {
          const count = compromissosDoDia.filter((c) => c.tipo === tipo).length;
          const TipoIcon = cfg.icon;
          return (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(filtroTipo === tipo ? "TODOS" : (tipo as TipoCompromisso))}
              className={`p-3 rounded-xl border transition-all text-left ${
                filtroTipo === tipo
                  ? "border-brand-500/50 bg-dark-800/80"
                  : "border-dark-700/50 bg-dark-900/50 hover:border-brand-500/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg bg-dark-800 flex items-center justify-center ${cfg.color}`}>
                  <TipoIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{count}</p>
                  <p className="text-[10px] text-dark-500">{cfg.label}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navegação de data */}
      <Card variant="glass">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navegarData("anterior")}
            className="p-2 text-dark-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-lg font-bold text-white capitalize">
              {formatarDataExibicao(dataSelecionada)}
            </p>
            <p className="text-sm text-dark-400">
              {stats.total} compromissos | {stats.confirmados} confirmados | {stats.pendentes} pendentes
            </p>
          </div>
          <button
            onClick={() => navegarData("proxima")}
            className="p-2 text-dark-400 hover:text-white transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Card>

      {/* Filtros de Status */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltroStatus("TODOS")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filtroStatus === "TODOS"
              ? "bg-brand-500/20 text-brand-400"
              : "bg-dark-800 text-dark-400 hover:text-white"
          }`}
        >
          Todos ({stats.total})
        </button>
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = compromissosDoDia.filter((c) => c.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setFiltroStatus(key as StatusCompromisso)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filtroStatus === key
                  ? `${cfg.bg} ${cfg.color}`
                  : "bg-dark-800 text-dark-400 hover:text-white"
              }`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista de Compromissos */}
      {compromissosFiltrados.length === 0 ? (
        <Card variant="glass" className="text-center py-12">
          <CalendarDays className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 mb-4">Nenhum compromisso para este dia</p>
          <Button variant="primary" size="sm" onClick={() => abrirNovoCompromisso()}>
            Agendar Compromisso
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {compromissosFiltrados
            .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
            .map((comp) => {
              const statusCfg = statusConfig[comp.status];
              const tipoCfg = tipoConfig[comp.tipo] || tipoConfig.REUNIAO;
              const TipoIcon = tipoCfg.icon;
              const hora = new Date(comp.dataHora).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <Card key={comp.id} variant="glass" hover>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Horário */}
                    <div className="flex items-center gap-3 sm:w-28 shrink-0">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-dark-800 ${tipoCfg.color}`}>
                        <TipoIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{hora}</p>
                        <p className="text-xs text-dark-500">{comp.duracao}min</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-semibold text-white truncate">
                          {comp.titulo}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${statusCfg.bg} ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                        <Badge variant="default" className="text-[10px]">{tipoCfg.label}</Badge>
                      </div>
                      {comp.clienteNome && (
                        <p className="text-xs text-brand-400">{comp.clienteNome}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-dark-500 mt-0.5">
                        {comp.plataforma && <span>📍 {comp.plataforma}</span>}
                        {comp.notas && <span className="truncate">💬 {comp.notas}</span>}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 shrink-0">
                      {comp.status === "PENDENTE" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => alterarStatus(comp.id, "CONFIRMADO")}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Confirmar
                        </Button>
                      )}
                      {comp.status === "CONFIRMADO" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alterarStatus(comp.id, "EM_ANDAMENTO")}
                        >
                          <Video className="h-4 w-4 mr-1" /> Iniciar
                        </Button>
                      )}
                      {comp.status === "EM_ANDAMENTO" && (
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => alterarStatus(comp.id, "CONCLUIDO")}
                        >
                          Finalizar
                        </Button>
                      )}
                      <button
                        onClick={() => abrirEdicao(comp)}
                        className="p-2 text-dark-400 hover:text-brand-400 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => excluirCompromisso(comp.id)}
                        className="p-2 text-dark-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      {/* Horários Disponíveis */}
      <Card variant="glass">
        <CardHeader
          title="Horários Disponíveis"
          subtitle="Clique em um horário para agendar"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <div className="grid grid-cols-5 sm:grid-cols-9 gap-2 mt-4">
          {todosHorarios.map((h) => {
            const ocupado = horariosOcupados.includes(h);
            return (
              <button
                key={h}
                disabled={ocupado}
                onClick={() => !ocupado && abrirNovoCompromisso(h)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  ocupado
                    ? "bg-dark-800/50 text-dark-600 cursor-not-allowed line-through"
                    : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                }`}
              >
                {h}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCompromisso(null);
        }}
        title={editingCompromisso ? "Editar Compromisso" : "Novo Compromisso"}
        size="lg"
      >
        <div className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Título *</label>
            <Input
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Ex: Call com cliente"
            />
          </div>

          {/* Data/Hora e Duração */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Data e Hora *</label>
              <Input
                type="datetime-local"
                value={form.dataHora}
                onChange={(e) => setForm({ ...form, dataHora: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Duração</label>
              <select
                value={form.duracao}
                onChange={(e) => setForm({ ...form, duracao: parseInt(e.target.value) })}
                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hora</option>
                <option value={90}>1h30</option>
                <option value={120}>2 horas</option>
              </select>
            </div>
          </div>

          {/* Tipo e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoCompromisso })}
                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                {Object.entries(tipoConfig).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as StatusCompromisso })}
                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Cliente</label>
            <Input
              value={form.clienteNome}
              onChange={(e) => setForm({ ...form, clienteNome: e.target.value })}
              placeholder="Nome do cliente"
            />
          </div>

          {/* Plataforma e Link */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Plataforma</label>
              <select
                value={form.plataforma}
                onChange={(e) => setForm({ ...form, plataforma: e.target.value })}
                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom</option>
                <option value="Teams">Microsoft Teams</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Link da reunião</label>
              <Input
                value={form.linkReuniao}
                onChange={(e) => setForm({ ...form, linkReuniao: e.target.value })}
                placeholder="https://meet.google.com/..."
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Notas</label>
            <textarea
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              placeholder="Anotações sobre o compromisso..."
              rows={3}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingCompromisso(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={salvarCompromisso}
              loading={saving}
              disabled={!form.titulo || !form.dataHora}
              icon={<Save className="h-4 w-4" />}
            >
              {editingCompromisso ? "Salvar Alterações" : "Criar Compromisso"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
