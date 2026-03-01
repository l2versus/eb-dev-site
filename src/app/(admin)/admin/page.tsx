// ══════════════════════════════════════════════════════════════════════════════
// 📊 Admin Dashboard — Painel do Desenvolvedor Freelancer
// ══════════════════════════════════════════════════════════════════════════════

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
} from "lucide-react";

export const metadata = { title: "Admin — Dashboard Dev" };

// KPIs de Desenvolvedor
const kpis = [
  {
    titulo: "Faturamento Mensal",
    valor: "R$ 18.500",
    variacao: "+25%",
    positivo: true,
    icon: DollarSign,
    cor: "emerald" as const,
  },
  {
    titulo: "Projetos Ativos",
    valor: "4",
    variacao: "+1 novo",
    positivo: true,
    icon: FolderKanban,
    cor: "brand" as const,
  },
  {
    titulo: "Propostas Enviadas",
    valor: "12",
    variacao: "6 pendentes",
    positivo: true,
    icon: FileText,
    cor: "purple" as const,
  },
  {
    titulo: "Taxa Conversão",
    valor: "58%",
    variacao: "+8%",
    positivo: true,
    icon: TrendingUp,
    cor: "gold" as const,
  },
];

// Faturamento últimos 6 meses
const faturamentoMensal = [
  { label: "Set", valor: 8500 },
  { label: "Out", valor: 12000 },
  { label: "Nov", valor: 15500 },
  { label: "Dez", valor: 22000 },
  { label: "Jan", valor: 14000 },
  { label: "Fev", valor: 18500 },
];

// Projetos por tipo
const projetosPorTipo = [
  { name: "Landing Page", valor: 8 },
  { name: "Institucional", valor: 5 },
  { name: "E-commerce", valor: 3 },
  { name: "WebApp", valor: 2 },
];

// Status dos projetos
const statusProjetos = [
  { name: "Em Desenvolvimento", value: 4, color: "#00f0ff" },
  { name: "Aguardando Feedback", value: 2, color: "#f59e0b" },
  { name: "Entregues (mês)", value: 3, color: "#10b981" },
];

// Projetos em andamento
const projetosAtivos = [
  {
    cliente: "Myka Procópio",
    projeto: "Site Institucional + Agendamento",
    tipo: "Pro",
    progresso: 75,
    valor: "R$ 5.500",
    prazo: "15/03",
    status: "EM_ANDAMENTO",
  },
  {
    cliente: "João Silva",
    projeto: "Landing Page Advocacia",
    tipo: "Starter",
    progresso: 90,
    valor: "R$ 2.500",
    prazo: "05/03",
    status: "REVISAO",
  },
  {
    cliente: "Tech Solutions",
    projeto: "Dashboard Analytics",
    tipo: "Enterprise",
    progresso: 40,
    valor: "R$ 15.000",
    prazo: "30/03",
    status: "EM_ANDAMENTO",
  },
  {
    cliente: "Café Aroma",
    projeto: "E-commerce Café",
    tipo: "Pro",
    progresso: 20,
    valor: "R$ 8.000",
    prazo: "15/04",
    status: "INICIO",
  },
];

// Propostas recentes
const propostas = [
  { cliente: "Clínica Vida", valor: "R$ 5.500", tipo: "Institucional", status: "PENDENTE" },
  { cliente: "Loja Fashion", valor: "R$ 12.000", tipo: "E-commerce", status: "NEGOCIANDO" },
  { cliente: "Academia Fit", valor: "R$ 2.500", tipo: "Landing", status: "APROVADA" },
];

const statusColors: Record<string, string> = {
  EM_ANDAMENTO: "text-brand-400 bg-brand-500/10",
  REVISAO: "text-amber-400 bg-amber-500/10",
  INICIO: "text-purple-400 bg-purple-500/10",
  ENTREGUE: "text-emerald-400 bg-emerald-500/10",
  PENDENTE: "text-amber-400 bg-amber-500/10",
  NEGOCIANDO: "text-purple-400 bg-purple-500/10",
  APROVADA: "text-emerald-400 bg-emerald-500/10",
  RECUSADA: "text-red-400 bg-red-500/10",
};

const statusLabels: Record<string, string> = {
  EM_ANDAMENTO: "Em Andamento",
  REVISAO: "Em Revisão",
  INICIO: "Iniciando",
  ENTREGUE: "Entregue",
  PENDENTE: "Pendente",
  NEGOCIANDO: "Negociando",
  APROVADA: "Aprovada",
  RECUSADA: "Recusada",
};

export default function AdminDashboardPage() {
  const hoje = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-dark-400 mt-1 capitalize">
            Visão geral — {hoje}
          </p>
        </div>
        <Badge variant="gold">
          <Zap className="h-3 w-3 mr-1" /> Tempo real
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.titulo} variant="glass">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-dark-400 mb-1">{kpi.titulo}</p>
                <p className="text-2xl font-bold text-white">{kpi.valor}</p>
                <div
                  className={`flex items-center gap-1 mt-1 text-xs ${
                    kpi.positivo ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {kpi.positivo ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {kpi.variacao}
                </div>
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
            lines={[
              { key: "valor", color: "#00f0ff", label: "Faturamento (R$)" },
            ]}
            area
            height={300}
          />
        </Card>

        {/* Donut status (1/3) */}
        <Card variant="glass">
          <CardHeader
            title="Status Projetos"
            subtitle="9 projetos no mês"
            icon={<FolderKanban className="h-5 w-5" />}
          />
          <DonutChart
            data={statusProjetos}
            height={220}
            centerValue="9"
            centerLabel="projetos"
          />
        </Card>
      </div>

      {/* Linha 2: Tipos + Projetos Ativos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projetos por tipo */}
        <Card variant="glass">
          <CardHeader
            title="Projetos por Tipo"
            subtitle="Histórico completo"
            icon={<Code2 className="h-5 w-5" />}
          />
          <BarChartCustom
            data={projetosPorTipo}
            barColor="#ff00ff"
            height={250}
          />
        </Card>

        {/* Tabela de projetos */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader
            title="Projetos em Andamento"
            subtitle="Acompanhe o progresso"
            icon={<Rocket className="h-5 w-5" />}
          />
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
                {projetosAtivos.map((proj, i) => (
                  <tr
                    key={i}
                    className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div>
                        <p className="text-white font-medium">{proj.cliente}</p>
                        <p className="text-xs text-dark-500">{proj.valor}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div>
                        <p className="text-dark-300">{proj.projeto}</p>
                        <p className="text-xs text-brand-400">{proj.tipo}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
                            style={{ width: `${proj.progresso}%` }}
                          />
                        </div>
                        <span className="text-xs text-dark-400 w-8">{proj.progresso}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-dark-300">{proj.prazo}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          statusColors[proj.status] || "text-dark-400"
                        }`}
                      >
                        {statusLabels[proj.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Propostas Recentes */}
      <Card variant="glass">
        <CardHeader
          title="Propostas Recentes"
          subtitle="Últimas oportunidades"
          icon={<FileText className="h-5 w-5" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {propostas.map((prop, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 hover:border-brand-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-medium">{prop.cliente}</p>
                  <p className="text-xs text-dark-500">{prop.tipo}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                    statusColors[prop.status] || "text-dark-400"
                  }`}
                >
                  {statusLabels[prop.status]}
                </span>
              </div>
              <p className="text-xl font-bold text-brand-400">{prop.valor}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Métricas extras */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card variant="glass">
          <div className="text-center">
            <p className="text-3xl font-bold gradient-text-brand">R$ 5.125</p>
            <p className="text-xs text-dark-400 mt-1">Ticket Médio</p>
          </div>
        </Card>
        <Card variant="glass">
          <div className="text-center">
            <p className="text-3xl font-bold gradient-text-gold">18</p>
            <p className="text-xs text-dark-400 mt-1">Projetos Entregues</p>
          </div>
        </Card>
        <Card variant="glass">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">4.9★</p>
            <p className="text-xs text-dark-400 mt-1">Avaliação Média</p>
          </div>
        </Card>
        <Card variant="glass">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">12 dias</p>
            <p className="text-xs text-dark-400 mt-1">Prazo Médio Entrega</p>
          </div>
        </Card>
      </div>

      {/* Próximas Entregas */}
      <Card variant="gradient">
        <CardHeader
          title="Próximas Entregas"
          subtitle="Atenção aos prazos"
          icon={<Timer className="h-5 w-5" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {projetosAtivos.sort((a, b) => {
            const [diaA, mesA] = a.prazo.split('/').map(Number);
            const [diaB, mesB] = b.prazo.split('/').map(Number);
            return (mesA * 100 + diaA) - (mesB * 100 + diaB);
          }).map((proj, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                i === 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-dark-700/50 bg-dark-800/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {i === 0 ? (
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-dark-500" />
                )}
                <span className={`text-sm font-bold ${i === 0 ? 'text-amber-400' : 'text-dark-300'}`}>
                  {proj.prazo}
                </span>
              </div>
              <p className="text-white font-medium text-sm">{proj.cliente}</p>
              <p className="text-xs text-dark-500 truncate">{proj.projeto}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${i === 0 ? 'bg-amber-500' : 'bg-brand-500'}`}
                    style={{ width: `${proj.progresso}%` }}
                  />
                </div>
                <span className="text-xs text-dark-500">{proj.progresso}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
