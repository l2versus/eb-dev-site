// ══════════════════════════════════════════════════════════════════════════════
// 📅 Agenda Admin — Gerenciamento de Compromissos do Dev Freelancer
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Video,
  FileText,
  Code,
  MessageSquare,
  Presentation,
  Rocket,
} from "lucide-react";

type StatusCompromisso =
  | "PENDENTE"
  | "CONFIRMADO"
  | "EM_ANDAMENTO"
  | "CONCLUIDO"
  | "CANCELADO"
  | "REAGENDADO"
  | "AGUARDANDO";

type TipoCompromisso =
  | "call"
  | "briefing"
  | "proposta"
  | "entrega"
  | "review"
  | "follow_up";

const statusConfig: Record<
  StatusCompromisso,
  { label: string; color: string; bg: string }
> = {
  PENDENTE: { label: "Pendente", color: "text-amber-400", bg: "bg-amber-500/10" },
  CONFIRMADO: { label: "Confirmado", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  EM_ANDAMENTO: { label: "Em Andamento", color: "text-blue-400", bg: "bg-blue-500/10" },
  CONCLUIDO: { label: "Concluído", color: "text-purple-400", bg: "bg-purple-500/10" },
  CANCELADO: { label: "Cancelado", color: "text-red-400", bg: "bg-red-500/10" },
  REAGENDADO: { label: "Reagendado", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  AGUARDANDO: { label: "Aguardando Cliente", color: "text-dark-400", bg: "bg-dark-700/50" },
};

const tipoConfig: Record<TipoCompromisso, { label: string; icon: typeof Video; color: string }> = {
  call: { label: "Call", icon: Video, color: "text-brand-400" },
  briefing: { label: "Briefing", icon: MessageSquare, color: "text-purple-400" },
  proposta: { label: "Apresentação", icon: Presentation, color: "text-gold-400" },
  entrega: { label: "Entrega", icon: Rocket, color: "text-emerald-400" },
  review: { label: "Review", icon: Code, color: "text-blue-400" },
  follow_up: { label: "Follow-up", icon: Phone, color: "text-amber-400" },
};

interface Compromisso {
  id: string;
  cliente: string;
  projeto: string;
  tipo: TipoCompromisso;
  horario: string;
  duracao: string;
  status: StatusCompromisso;
  plataforma?: string;
  notas?: string;
}

const compromissosHoje: Compromisso[] = [
  {
    id: "1",
    cliente: "Myka Procópio",
    projeto: "Site Institucional + Agendamento",
    tipo: "review",
    horario: "09:00",
    duracao: "30min",
    status: "CONCLUIDO",
    plataforma: "Google Meet",
    notas: "Validação do design da home",
  },
  {
    id: "2",
    cliente: "Tech Solutions",
    projeto: "Dashboard Analytics",
    tipo: "call",
    horario: "10:00",
    duracao: "45min",
    status: "EM_ANDAMENTO",
    plataforma: "Zoom",
    notas: "Alinhamento de funcionalidades",
  },
  {
    id: "3",
    cliente: "João Silva",
    projeto: "Landing Page Advocacia",
    tipo: "entrega",
    horario: "11:30",
    duracao: "15min",
    status: "CONFIRMADO",
    notas: "Entrega final + ajustes",
  },
  {
    id: "4",
    cliente: "Clínica Vida",
    projeto: "Site Institucional",
    tipo: "proposta",
    horario: "14:00",
    duracao: "30min",
    status: "PENDENTE",
    plataforma: "Google Meet",
    notas: "Apresentar proposta comercial",
  },
  {
    id: "5",
    cliente: "Café Aroma",
    projeto: "E-commerce Café",
    tipo: "briefing",
    horario: "15:00",
    duracao: "45min",
    status: "CONFIRMADO",
    plataforma: "WhatsApp",
    notas: "Levantar requisitos do e-commerce",
  },
  {
    id: "6",
    cliente: "Marina Costa",
    projeto: "Landing Page Fitness",
    tipo: "follow_up",
    horario: "16:00",
    duracao: "15min",
    status: "PENDENTE",
    plataforma: "WhatsApp",
    notas: "Retornar sobre proposta enviada",
  },
  {
    id: "7",
    cliente: "Academia Fit",
    projeto: "Landing Page Promoções",
    tipo: "proposta",
    horario: "17:00",
    duracao: "30min",
    status: "CANCELADO",
    notas: "Cliente cancelou - remarcar",
  },
  {
    id: "8",
    cliente: "Loja Fashion",
    projeto: "E-commerce Moda",
    tipo: "briefing",
    horario: "18:00",
    duracao: "60min",
    status: "REAGENDADO",
    notas: "Movido para sexta-feira",
  },
];

const horarios = [
  "08:00", "09:00", "10:00", "11:00", "11:30",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

export default function AgendaPage() {
  const [filtroStatus, setFiltroStatus] = useState<string>("TODOS");
  const [filtroTipo, setFiltroTipo] = useState<string>("TODOS");

  const compromissosFiltrados = compromissosHoje.filter((c) => {
    const matchStatus = filtroStatus === "TODOS" || c.status === filtroStatus;
    const matchTipo = filtroTipo === "TODOS" || c.tipo === filtroTipo;
    return matchStatus && matchTipo;
  });

  const contadores = {
    total: compromissosHoje.length,
    confirmados: compromissosHoje.filter(
      (a) => a.status === "CONFIRMADO" || a.status === "EM_ANDAMENTO"
    ).length,
    pendentes: compromissosHoje.filter((a) => a.status === "PENDENTE").length,
    cancelados: compromissosHoje.filter(
      (a) => a.status === "CANCELADO" || a.status === "AGUARDANDO"
    ).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Minha Agenda</h2>
          <p className="text-dark-400 mt-1">
            Calls, reuniões e entregas programadas
          </p>
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />}>
          Novo Compromisso
        </Button>
      </div>

      {/* Stats Rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(tipoConfig).map(([tipo, cfg]) => {
          const count = compromissosHoje.filter((c) => c.tipo === tipo).length;
          const TipoIcon = cfg.icon;
          return (
            <button 
              key={tipo} 
              onClick={() => setFiltroTipo(filtroTipo === tipo ? "TODOS" : tipo)}
              className={`p-4 rounded-2xl border transition-all text-left ${
                filtroTipo === tipo 
                  ? "border-brand-500/50 bg-dark-800/80" 
                  : "border-dark-700/50 bg-dark-900/50 hover:border-brand-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl bg-dark-800 flex items-center justify-center ${cfg.color}`}>
                  <TipoIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{count}</p>
                  <p className="text-xs text-dark-500">{cfg.label}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navegação de data */}
      <Card variant="glass">
        <div className="flex items-center justify-between">
          <button className="p-2 text-dark-400 hover:text-white transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              Sábado, 01 de Março de 2025
            </p>
            <p className="text-sm text-dark-400">
              {contadores.total} compromissos | {contadores.confirmados}{" "}
              confirmados | {contadores.pendentes} pendentes
            </p>
          </div>
          <button className="p-2 text-dark-400 hover:text-white transition-colors">
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
          Todos ({contadores.total})
        </button>
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = compromissosHoje.filter((a) => a.status === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFiltroStatus(key)}
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

      {/* Timeline de Compromissos */}
      <div className="space-y-3">
        {compromissosFiltrados.map((comp) => {
          const statusCfg = statusConfig[comp.status];
          const tipoCfg = tipoConfig[comp.tipo];
          const TipoIcon = tipoCfg.icon;
          return (
            <Card key={comp.id} variant="glass" hover>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Horário */}
                <div className="flex items-center gap-3 sm:w-28 shrink-0">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-dark-800 ${tipoCfg.color}`}>
                    <TipoIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{comp.horario}</p>
                    <p className="text-xs text-dark-500">{comp.duracao}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-white truncate">
                      {comp.cliente}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${statusCfg.bg} ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                    <Badge variant="default" className="text-[10px]">{tipoCfg.label}</Badge>
                  </div>
                  <p className="text-xs text-brand-400">{comp.projeto}</p>
                  <div className="flex items-center gap-4 text-xs text-dark-500 mt-0.5">
                    {comp.plataforma && <span>📍 {comp.plataforma}</span>}
                    {comp.notas && <span className="truncate">💬 {comp.notas}</span>}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 shrink-0">
                  {comp.status === "PENDENTE" && (
                    <>
                      <Button variant="primary" size="sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Confirmar
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {comp.status === "CONFIRMADO" && (
                    <Button variant="outline" size="sm" className="gap-1">
                      <Video className="h-4 w-4" /> Iniciar
                    </Button>
                  )}
                  {comp.status === "EM_ANDAMENTO" && (
                    <Button variant="gold" size="sm">
                      Finalizar
                    </Button>
                  )}
                  {(comp.status === "CANCELADO" || comp.status === "REAGENDADO") && (
                    <Button variant="ghost" size="sm" className="text-dark-500">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Grade de horários rápidos */}
      <Card variant="glass">
        <CardHeader
          title="Horários Disponíveis"
          subtitle="Slots livres para agendar calls"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {horarios.map((h) => {
            const ocupado = compromissosHoje.some((a) => a.horario === h);
            return (
              <button
                key={h}
                disabled={ocupado}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  ocupado
                    ? "bg-dark-800/50 text-dark-600 cursor-not-allowed line-through"
                    : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                }`}
              >
                {h}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Próximas Entregas */}
      <Card variant="gradient">
        <CardHeader
          title="Próximas Entregas da Semana"
          subtitle="Milestones e deadlines"
          icon={<Rocket className="h-5 w-5" />}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {[
            { cliente: "João Silva", projeto: "Landing Page", data: "05/03", tipo: "Entrega Final" },
            { cliente: "Myka Procópio", projeto: "Site Institucional", data: "15/03", tipo: "Milestone 3" },
            { cliente: "Tech Solutions", projeto: "Dashboard", data: "20/03", tipo: "Beta Release" },
          ].map((entrega, i) => (
            <div key={i} className="p-4 rounded-xl bg-dark-800/30 border border-dark-700/50">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="default" className="text-xs">{entrega.tipo}</Badge>
                <span className="text-xs font-bold text-brand-400">{entrega.data}</span>
              </div>
              <p className="text-white font-medium">{entrega.cliente}</p>
              <p className="text-xs text-dark-500">{entrega.projeto}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
