// ══════════════════════════════════════════════════════════════════════════════
// 📊 Admin Dashboard — Painel Dinâmico do Desenvolvedor Freelancer
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DonutChart, BarChartCustom, LineChartCustom } from "@/components/charts/charts";
import {
  DollarSign,
  FolderKanban,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Star,
  Zap,
  FileText,
  Code2,
  Rocket,
  CheckCircle,
  AlertCircle,
  Timer,
  MessageCircle,
  Users,
  RefreshCw,
  Loader2,
  Calendar,
  Activity,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  clienteNome: string;
  clienteEmail: string;
  status: string;
  prioridade: string;
  valor: number;
  progresso: number;
  prazo: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Conversa {
  id: string;
  clienteNome: string;
  ultimaMensagem: string;
  ultimaHora: string;
  naoLidas: number;
  status: string;
}

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; css: string }> = {
  briefing: { label: "Briefing", css: "text-purple-400 bg-purple-500/10" },
  design: { label: "Design", css: "text-amber-400 bg-amber-500/10" },
  desenvolvimento: { label: "Em Dev", css: "text-brand-400 bg-brand-500/10" },
  revisao: { label: "Revisão", css: "text-orange-400 bg-orange-500/10" },
  entregue: { label: "Entregue", css: "text-emerald-400 bg-emerald-500/10" },
};

const prioridadeConfig: Record<string, { label: string; css: string }> = {
  baixa: { label: "Baixa", css: "text-dark-400" },
  media: { label: "Média", css: "text-amber-400" },
  alta: { label: "Alta", css: "text-orange-400" },
  urgente: { label: "Urgente", css: "text-red-400" },
};

// ─── Faturamento Mock (6 meses) ──────────────────────────────────────────────
const faturamentoMensal = [
  { label: "Set", valor: 8500 },
  { label: "Out", valor: 12000 },
  { label: "Nov", valor: 15500 },
  { label: "Dez", valor: 22000 },
  { label: "Jan", valor: 14000 },
  { label: "Fev", valor: 18500 },
];

export default function AdminDashboardPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchDados = useCallback(async () => {
    try {
      const [projRes, chatRes] = await Promise.all([
        fetch("/api/projetos").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/chat").then((r) => (r.ok ? r.json() : [])),
      ]);
      setProjetos(Array.isArray(projRes) ? projRes : []);
      setConversas(Array.isArray(chatRes) ? chatRes : []);
      setLastUpdate(new Date());
    } catch {
      // Manter dados anteriores em caso de erro
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDados();
    const interval = setInterval(fetchDados, 30000); // Refresh a cada 30s
    return () => clearInterval(interval);
  }, [fetchDados]);

  // ─── Métricas calculadas ──────────────────────────────────────────────────
  const projetosAtivos = projetos.filter((p) => p.status !== "entregue");
  const projetosEntregues = projetos.filter((p) => p.status === "entregue");
  const faturamentoTotal = projetos.reduce((acc, p) => acc + (p.valor || 0), 0);
  const faturamentoAtivos = projetosAtivos.reduce((acc, p) => acc + (p.valor || 0), 0);
  const mensagensNaoLidas = conversas.reduce((acc, c) => acc + (c.naoLidas || 0), 0);
  const ticketMedio = projetos.length > 0 ? faturamentoTotal / projetos.length : 0;

  // Status dos projetos para donut
  const statusCount = projetos.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusDonut = [
    { name: "Briefing", value: statusCount.briefing || 0, color: "#a855f7" },
    { name: "Design", value: statusCount.design || 0, color: "#f59e0b" },
    { name: "Em Dev", value: statusCount.desenvolvimento || 0, color: "#00f0ff" },
    { name: "Revisão", value: statusCount.revisao || 0, color: "#f97316" },
    { name: "Entregue", value: statusCount.entregue || 0, color: "#10b981" },
  ].filter((s) => s.value > 0);

  // Projetos por prioridade para bar chart
  const prioridadeCount = projetos.reduce((acc, p) => {
    acc[p.prioridade] = (acc[p.prioridade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const prioridadeBar = [
    { name: "Baixa", valor: prioridadeCount.baixa || 0 },
    { name: "Média", valor: prioridadeCount.media || 0 },
    { name: "Alta", valor: prioridadeCount.alta || 0 },
    { name: "Urgente", valor: prioridadeCount.urgente || 0 },
  ];

  // Próximos prazos (projetos ativos ordenados por prazo)
  const proximosEntregas = [...projetosAtivos].sort(
    (a, b) => new Date(a.prazo).getTime() - new Date(b.prazo).getTime()
  );

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ─── KPIs ─────────────────────────────────────────────────────────────────
  const kpis = [
    {
      titulo: "Faturamento Total",
      valor: `R$ ${faturamentoTotal.toLocaleString("pt-BR")}`,
      extra: `${projetosAtivos.length} ativos: R$ ${faturamentoAtivos.toLocaleString("pt-BR")}`,
      icon: DollarSign,
      cor: "emerald" as const,
    },
    {
      titulo: "Projetos",
      valor: `${projetos.length}`,
      extra: `${projetosAtivos.length} ativos · ${projetosEntregues.length} entregues`,
      icon: FolderKanban,
      cor: "brand" as const,
    },
    {
      titulo: "Mensagens não lidas",
      valor: `${mensagensNaoLidas}`,
      extra: `${conversas.length} conversas`,
      icon: MessageCircle,
      cor: "purple" as const,
    },
    {
      titulo: "Ticket Médio",
      valor: `R$ ${ticketMedio.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`,
      extra: `${projetos.length} projetos no total`,
      icon: TrendingUp,
      cor: "gold" as const,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400 mx-auto" />
          <p className="text-dark-400 text-sm">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-dark-400 mt-1 capitalize">Visão geral — {hoje}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDados}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-dark-400 hover:text-white bg-dark-800/50 hover:bg-dark-700/50 border border-dark-700/50 rounded-lg transition-all"
          >
            <RefreshCw className="h-3 w-3" />
            Atualizar
          </button>
          <Badge variant="gold">
            <Activity className="h-3 w-3 mr-1" />{" "}
            {lastUpdate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.titulo} variant="glass">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-dark-400 mb-1">{kpi.titulo}</p>
                <p className="text-2xl font-bold text-white">{kpi.valor}</p>
                <p className="text-xs text-dark-500 mt-1">{kpi.extra}</p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  kpi.cor === "emerald"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : kpi.cor === "brand"
                    ? "bg-brand-500/10 text-brand-400"
                    : kpi.cor === "purple"
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-gold-500/10 text-gold-400"
                }`}
              >
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Faturamento (2/3) */}
        <Card variant="gradient" className="lg:col-span-2">
          <CardHeader
            title="Faturamento Mensal"
            subtitle="Últimos 6 meses"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <LineChartCustom
            data={faturamentoMensal}
            lines={[{ key: "valor", color: "#00f0ff", label: "Faturamento (R$)" }]}
            area
            height={300}
          />
        </Card>

        {/* Donut status (1/3) */}
        <Card variant="glass">
          <CardHeader
            title="Status Projetos"
            subtitle={`${projetos.length} projetos total`}
            icon={<FolderKanban className="h-5 w-5" />}
          />
          {statusDonut.length > 0 ? (
            <DonutChart
              data={statusDonut}
              height={220}
              centerValue={String(projetos.length)}
              centerLabel="projetos"
            />
          ) : (
            <div className="flex items-center justify-center h-[220px] text-dark-500 text-sm">
              Nenhum projeto
            </div>
          )}
        </Card>
      </div>

      {/* Linha 2: Prioridades + Projetos Ativos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projetos por prioridade */}
        <Card variant="glass">
          <CardHeader
            title="Por Prioridade"
            subtitle="Distribuição atual"
            icon={<Code2 className="h-5 w-5" />}
          />
          <BarChartCustom data={prioridadeBar} barColor="#ff00ff" height={250} />
        </Card>

        {/* Tabela de projetos ativos */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader
            title="Projetos em Andamento"
            subtitle={`${projetosAtivos.length} projetos ativos`}
            icon={<Rocket className="h-5 w-5" />}
          />
          {projetosAtivos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-dark-500 border-b border-dark-700/50">
                    <th className="text-left py-2 px-3 font-medium">Cliente</th>
                    <th className="text-left py-2 px-3 font-medium">Projeto</th>
                    <th className="text-left py-2 px-3 font-medium">Progresso</th>
                    <th className="text-left py-2 px-3 font-medium">Prazo</th>
                    <th className="text-left py-2 px-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projetosAtivos.map((proj) => (
                    <tr
                      key={proj.id}
                      className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div>
                          <p className="text-white font-medium">{proj.clienteNome}</p>
                          <p className="text-xs text-dark-500">
                            R$ {proj.valor.toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <p className="text-dark-300">{proj.titulo}</p>
                          <div className="flex gap-1 mt-1">
                            {proj.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 bg-brand-500/10 text-brand-400 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all"
                              style={{ width: `${proj.progresso}%` }}
                            />
                          </div>
                          <span className="text-xs text-dark-400 w-8">{proj.progresso}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-dark-300">
                        {new Date(proj.prazo).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                            statusConfig[proj.status]?.css || "text-dark-400"
                          }`}
                        >
                          {statusConfig[proj.status]?.label || proj.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-dark-500 text-sm">
              Nenhum projeto ativo
            </div>
          )}
        </Card>
      </div>

      {/* Chat + Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversas recentes */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader
            title="Conversas Recentes"
            subtitle={`${mensagensNaoLidas} não lidas`}
            icon={<MessageCircle className="h-5 w-5" />}
          />
          {conversas.length > 0 ? (
            <div className="divide-y divide-dark-700/50">
              {conversas.slice(0, 5).map((conversa) => (
                <div
                  key={conversa.id}
                  className="flex items-center gap-4 py-3 px-2 hover:bg-dark-800/30 rounded-lg transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/20 to-purple-500/20 text-sm font-bold text-brand-400 shrink-0">
                    {conversa.clienteNome
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium text-sm">{conversa.clienteNome}</p>
                      <span className="text-[10px] text-dark-500">
                        {new Date(conversa.ultimaHora).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-dark-400 truncate">{conversa.ultimaMensagem}</p>
                  </div>
                  {conversa.naoLidas > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shrink-0">
                      {conversa.naoLidas}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-dark-500 text-sm">
              Nenhuma conversa
            </div>
          )}
        </Card>

        {/* Métricas rápidas */}
        <div className="space-y-4">
          <Card variant="glass">
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text-brand">
                R$ {ticketMedio.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-dark-400 mt-1">Ticket Médio</p>
            </div>
          </Card>
          <Card variant="glass">
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text-gold">{projetosEntregues.length}</p>
              <p className="text-xs text-dark-400 mt-1">Projetos Entregues</p>
            </div>
          </Card>
          <Card variant="glass">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">{conversas.length}</p>
              <p className="text-xs text-dark-400 mt-1">Conversas</p>
            </div>
          </Card>
          <Card variant="glass">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">{projetosAtivos.length}</p>
              <p className="text-xs text-dark-400 mt-1">Em Andamento</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Próximas Entregas */}
      {proximosEntregas.length > 0 && (
        <Card variant="gradient">
          <CardHeader
            title="Próximas Entregas"
            subtitle="Atenção aos prazos"
            icon={<Timer className="h-5 w-5" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {proximosEntregas.slice(0, 4).map((proj, i) => {
              const diasRestantes = Math.ceil(
                (new Date(proj.prazo).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              const urgente = diasRestantes <= 3;

              return (
                <div
                  key={proj.id}
                  className={`p-4 rounded-xl border ${
                    urgente
                      ? "border-amber-500/30 bg-amber-500/5"
                      : "border-dark-700/50 bg-dark-800/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {urgente ? (
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Calendar className="h-4 w-4 text-dark-500" />
                    )}
                    <span
                      className={`text-sm font-bold ${urgente ? "text-amber-400" : "text-dark-300"}`}
                    >
                      {new Date(proj.prazo).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                    {diasRestantes > 0 && (
                      <span className="text-[10px] text-dark-500 ml-auto">
                        {diasRestantes}d restantes
                      </span>
                    )}
                    {diasRestantes <= 0 && (
                      <span className="text-[10px] text-red-400 ml-auto font-bold">ATRASADO</span>
                    )}
                  </div>
                  <p className="text-white font-medium text-sm">{proj.clienteNome}</p>
                  <p className="text-xs text-dark-500 truncate">{proj.titulo}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${urgente ? "bg-amber-500" : "bg-brand-500"}`}
                        style={{ width: `${proj.progresso}%` }}
                      />
                    </div>
                    <span className="text-xs text-dark-500">{proj.progresso}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
