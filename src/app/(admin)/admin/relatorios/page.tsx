// ══════════════════════════════════════════════════════════════════════════════
// 📈 Admin — Relatórios e Analytics
// ══════════════════════════════════════════════════════════════════════════════

import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DonutChart, BarChartCustom, LineChartCustom } from "@/components/charts/charts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FolderKanban,
  Users,
  Clock,
  Target,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  Activity,
  FileText,
} from "lucide-react";

export const metadata = { title: "Admin — Relatórios" };

// Faturamento Anual
const faturamentoAnual = [
  { label: "Jan", valor: 14000 },
  { label: "Fev", valor: 18500 },
  { label: "Mar", valor: 12000 },
  { label: "Abr", valor: 22000 },
  { label: "Mai", valor: 19500 },
  { label: "Jun", valor: 25000 },
  { label: "Jul", valor: 21000 },
  { label: "Ago", valor: 28000 },
  { label: "Set", valor: 24000 },
  { label: "Out", valor: 31000 },
  { label: "Nov", valor: 27500 },
  { label: "Dez", valor: 35000 },
];

// Projetos por categoria
const projetosPorCategoria = [
  { name: "Landing Pages", value: 45, color: "#00f0ff" },
  { name: "Sites Institucionais", value: 28, color: "#ff00ff" },
  { name: "E-commerce", value: 15, color: "#10b981" },
  { name: "Web Apps", value: 8, color: "#f59e0b" },
  { name: "Outros", value: 4, color: "#6366f1" },
];

// Origem dos clientes
const origemClientes = [
  { name: "Indicação", valor: 42 },
  { name: "Google", valor: 28 },
  { name: "Instagram", valor: 18 },
  { name: "LinkedIn", valor: 8 },
  { name: "Outros", valor: 4 },
];

// Tempo médio por projeto
const tempoPorTipo = [
  { name: "Landing", valor: 7 },
  { name: "Institucional", valor: 14 },
  { name: "E-commerce", valor: 21 },
  { name: "WebApp", valor: 30 },
];

// Métricas de Performance
const metricas = [
  {
    titulo: "Faturamento YTD",
    valor: "R$ 278.500",
    variacao: "+32%",
    positivo: true,
    icon: DollarSign,
    cor: "emerald",
  },
  {
    titulo: "Projetos Entregues",
    valor: "42",
    variacao: "+18 vs ano anterior",
    positivo: true,
    icon: FolderKanban,
    cor: "brand",
  },
  {
    titulo: "Ticket Médio",
    valor: "R$ 6.630",
    variacao: "+15%",
    positivo: true,
    icon: Target,
    cor: "purple",
  },
  {
    titulo: "Taxa Conversão",
    valor: "62%",
    variacao: "+8%",
    positivo: true,
    icon: TrendingUp,
    cor: "gold",
  },
];

// Top Clientes por faturamento
const topClientes = [
  { nome: "Tech Solutions", projetos: 5, faturamento: "R$ 52.000", percentual: 18.7 },
  { nome: "Grupo Empresarial XYZ", projetos: 3, faturamento: "R$ 38.500", percentual: 13.8 },
  { nome: "Myka Procópio", projetos: 4, faturamento: "R$ 24.000", percentual: 8.6 },
  { nome: "Café Aroma", projetos: 2, faturamento: "R$ 18.000", percentual: 6.5 },
  { nome: "João Silva Advocacia", projetos: 3, faturamento: "R$ 15.500", percentual: 5.6 },
];

// Metas anuais
const metas = [
  { meta: "Faturamento", atual: 278500, objetivo: 350000 },
  { meta: "Projetos", atual: 42, objetivo: 50 },
  { meta: "Clientes Novos", atual: 18, objetivo: 25 },
  { meta: "Taxa Conversão", atual: 62, objetivo: 70 },
];

export default function RelatoriosPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Relatórios & Analytics</h2>
          <p className="text-dark-400 mt-1">Análise completa do seu negócio freelancer</p>
        </div>
        <Badge variant="gold">
          <Calendar className="h-3 w-3 mr-1" /> Ano 2024
        </Badge>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((metrica) => (
          <Card key={metrica.titulo} variant="glass">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-dark-400 mb-1">{metrica.titulo}</p>
                <p className="text-2xl font-bold text-white">{metrica.valor}</p>
                <div
                  className={`flex items-center gap-1 mt-1 text-xs ${
                    metrica.positivo ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {metrica.positivo ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {metrica.variacao}
                </div>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  metrica.cor === "emerald"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : metrica.cor === "brand"
                    ? "bg-brand-500/10 text-brand-400"
                    : metrica.cor === "purple"
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-gold-500/10 text-gold-400"
                }`}
              >
                <metrica.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráfico de Faturamento Anual */}
      <Card variant="gradient">
        <CardHeader
          title="Evolução do Faturamento"
          subtitle="Comparativo mensal — 2024"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <LineChartCustom
          data={faturamentoAnual}
          lines={[{ key: "valor", color: "#00f0ff", label: "Faturamento (R$)" }]}
          area
          height={350}
        />
      </Card>

      {/* Linha 2: Categorias + Origem */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projetos por Categoria */}
        <Card variant="glass">
          <CardHeader
            title="Projetos por Categoria"
            subtitle="Distribuição do portfólio"
            icon={<PieChart className="h-5 w-5" />}
          />
          <DonutChart
            data={projetosPorCategoria}
            height={280}
            centerValue="100%"
            centerLabel="do total"
          />
        </Card>

        {/* Origem dos Clientes */}
        <Card variant="glass">
          <CardHeader
            title="Origem dos Clientes"
            subtitle="De onde vêm seus leads"
            icon={<Users className="h-5 w-5" />}
          />
          <BarChartCustom data={origemClientes} barColor="#ff00ff" height={280} />
        </Card>
      </div>

      {/* Tempo Médio + Progresso das Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tempo Médio por Tipo */}
        <Card variant="glass">
          <CardHeader
            title="Tempo Médio de Entrega"
            subtitle="Dias por tipo de projeto"
            icon={<Clock className="h-5 w-5" />}
          />
          <BarChartCustom data={tempoPorTipo} barColor="#00f0ff" height={250} />
        </Card>

        {/* Progresso das Metas */}
        <Card variant="glass">
          <CardHeader
            title="Metas Anuais"
            subtitle="Progresso em 2024"
            icon={<Target className="h-5 w-5" />}
          />
          <div className="space-y-4 mt-4">
            {metas.map((meta) => {
              const percentual = Math.round((meta.atual / meta.objetivo) * 100);
              const isValueMeta = meta.meta === "Faturamento";
              return (
                <div key={meta.meta}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-300">{meta.meta}</span>
                    <span className="text-sm font-medium text-white">
                      {isValueMeta
                        ? `R$ ${meta.atual.toLocaleString("pt-BR")} / R$ ${meta.objetivo.toLocaleString("pt-BR")}`
                        : `${meta.atual} / ${meta.objetivo}`}
                    </span>
                  </div>
                  <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentual >= 100
                          ? "bg-emerald-500"
                          : percentual >= 75
                          ? "bg-brand-500"
                          : percentual >= 50
                          ? "bg-gold-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(percentual, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-dark-500 mt-1">
                    {percentual}% da meta{percentual >= 100 && " ✓ Atingida!"}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Top Clientes */}
      <Card variant="glass">
        <CardHeader
          title="Top 5 Clientes por Faturamento"
          subtitle="Principais contas do ano"
          icon={<Award className="h-5 w-5" />}
        />
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-dark-500 border-b border-dark-700/50">
                <th className="text-left py-2 px-3 font-medium">#</th>
                <th className="text-left py-2 px-3 font-medium">Cliente</th>
                <th className="text-left py-2 px-3 font-medium">Projetos</th>
                <th className="text-left py-2 px-3 font-medium">Faturamento</th>
                <th className="text-left py-2 px-3 font-medium">% do Total</th>
              </tr>
            </thead>
            <tbody>
              {topClientes.map((cliente, i) => (
                <tr
                  key={cliente.nome}
                  className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                >
                  <td className="py-3 px-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        i === 0
                          ? "bg-gold-500/20 text-gold-400"
                          : i === 1
                          ? "bg-dark-600/50 text-dark-300"
                          : i === 2
                          ? "bg-amber-700/20 text-amber-600"
                          : "bg-dark-800 text-dark-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white font-medium">{cliente.nome}</td>
                  <td className="py-3 px-3 text-dark-300">{cliente.projetos}</td>
                  <td className="py-3 px-3 text-brand-400 font-medium">{cliente.faturamento}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden max-w-20">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
                          style={{ width: `${cliente.percentual}%` }}
                        />
                      </div>
                      <span className="text-xs text-dark-400">{cliente.percentual}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="glass" className="border-emerald-500/20">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-medium">Melhor Mês</p>
              <p className="text-2xl font-bold text-emerald-400">Dezembro</p>
              <p className="text-xs text-dark-500 mt-1">R$ 35.000 faturados</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="border-brand-500/20">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <p className="text-white font-medium">Serviço Top</p>
              <p className="text-2xl font-bold text-brand-400">Landing Pages</p>
              <p className="text-xs text-dark-500 mt-1">45% dos projetos</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="border-gold-500/20">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-gold-400" />
            </div>
            <div>
              <p className="text-white font-medium">Canal Principal</p>
              <p className="text-2xl font-bold text-gold-400">Indicações</p>
              <p className="text-xs text-dark-500 mt-1">42% dos clientes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Comparativo Período */}
      <Card variant="gradient">
        <CardHeader
          title="Comparativo de Períodos"
          subtitle="Este ano vs Ano anterior"
          icon={<FileText className="h-5 w-5" />}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {[
            { label: "Faturamento", atual: "R$ 278.5k", anterior: "R$ 211.0k", variacao: "+32%" },
            { label: "Projetos", atual: "42", anterior: "24", variacao: "+75%" },
            { label: "Clientes", atual: "28", anterior: "19", variacao: "+47%" },
            { label: "Ticket Médio", atual: "R$ 6.630", anterior: "R$ 5.750", variacao: "+15%" },
          ].map((item) => (
            <div key={item.label} className="text-center p-4 rounded-xl bg-dark-800/30">
              <p className="text-xs text-dark-500 mb-2">{item.label}</p>
              <p className="text-xl font-bold text-white">{item.atual}</p>
              <p className="text-xs text-dark-500 mt-1">Anterior: {item.anterior}</p>
              <p className="text-sm font-medium text-emerald-400 mt-1">{item.variacao}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
