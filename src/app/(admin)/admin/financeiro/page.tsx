// ══════════════════════════════════════════════════════════════════════════════
// 💰 Financeiro — Gestão Financeira Freelancer Dev
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChartCustom, DonutChart, BarChartCustom } from "@/components/charts/charts";
import {
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Wallet,
  Download,
  Filter,
  AlertTriangle,
  Receipt,
  PiggyBank,
  CalendarDays,
  Loader2,
  RefreshCw,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Projeto {
  id: string;
  titulo: string;
  clienteNome: string;
  status: string;
  valor: number;
  prazo: string;
  progresso: number;
  tags: string[];
}

interface Transacao {
  id: string;
  tipo: "receita" | "despesa";
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  status: "pago" | "pendente" | "atrasado" | "cancelado";
  metodo?: string;
  cliente?: string;
}

// ─── Dados de transações (in-memory mock) ─────────────────────────────────────
const transacoesMock: Transacao[] = [
  { id: "1", tipo: "receita", descricao: "Site Institucional - Myka Procópio", valor: 5500, categoria: "Projeto", data: "2026-02-28", status: "pago", metodo: "PIX", cliente: "Myka Procópio" },
  { id: "2", tipo: "receita", descricao: "Landing Page Advocacia - João Silva", valor: 2500, categoria: "Projeto", data: "2026-02-20", status: "pago", metodo: "Transferência", cliente: "João Silva" },
  { id: "3", tipo: "receita", descricao: "Dashboard Analytics - Tech Solutions (1ª parcela)", valor: 7500, categoria: "Projeto", data: "2026-02-15", status: "pago", metodo: "PIX", cliente: "Tech Solutions" },
  { id: "4", tipo: "receita", descricao: "Manutenção mensal - L2Versus", valor: 800, categoria: "Manutenção", data: "2026-02-05", status: "pago", metodo: "PIX", cliente: "L2Versus" },
  { id: "5", tipo: "receita", descricao: "E-commerce Café - Café Aroma (sinal)", valor: 3200, categoria: "Projeto", data: "2026-01-28", status: "pago", metodo: "Boleto", cliente: "Café Aroma" },
  { id: "6", tipo: "receita", descricao: "Dashboard Analytics - Tech Solutions (2ª parcela)", valor: 7500, categoria: "Projeto", data: "2026-03-15", status: "pendente", metodo: "PIX", cliente: "Tech Solutions" },
  { id: "7", tipo: "receita", descricao: "E-commerce Café - Café Aroma (final)", valor: 4800, categoria: "Projeto", data: "2026-04-15", status: "pendente", metodo: "PIX", cliente: "Café Aroma" },
  { id: "8", tipo: "despesa", descricao: "Vercel Pro", valor: 100, categoria: "Infraestrutura", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "9", tipo: "despesa", descricao: "Domínios + DNS", valor: 85, categoria: "Infraestrutura", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "10", tipo: "despesa", descricao: "Figma Pro", valor: 60, categoria: "Ferramentas", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "11", tipo: "despesa", descricao: "ChatGPT Plus", valor: 100, categoria: "Ferramentas", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "12", tipo: "despesa", descricao: "Neon (DB) + AWS", valor: 45, categoria: "Infraestrutura", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "13", tipo: "despesa", descricao: "GitHub Copilot", valor: 50, categoria: "Ferramentas", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "14", tipo: "despesa", descricao: "Contador MEI", valor: 200, categoria: "Fiscal", data: "2026-02-10", status: "pago", metodo: "PIX" },
  { id: "15", tipo: "despesa", descricao: "DAS MEI", valor: 75, categoria: "Fiscal", data: "2026-02-20", status: "pago", metodo: "Boleto" },
];

// Faturamento últimos 6 meses
const faturamentoMensal = [
  { label: "Set", receita: 8500, despesa: 680 },
  { label: "Out", receita: 12000, despesa: 720 },
  { label: "Nov", receita: 15500, despesa: 750 },
  { label: "Dez", receita: 22000, despesa: 810 },
  { label: "Jan", receita: 14000, despesa: 700 },
  { label: "Fev", receita: 19500, despesa: 715 },
];

const statusConfig: Record<string, { label: string; css: string; icon: typeof CheckCircle }> = {
  pago: { label: "Pago", css: "text-emerald-400 bg-emerald-500/10", icon: CheckCircle },
  pendente: { label: "Pendente", css: "text-amber-400 bg-amber-500/10", icon: Clock },
  atrasado: { label: "Atrasado", css: "text-red-400 bg-red-500/10", icon: AlertTriangle },
  cancelado: { label: "Cancelado", css: "text-dark-500 bg-dark-700/50", icon: XCircle },
};

export default function FinanceiroPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [transacoes] = useState<Transacao[]>(transacoesMock);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "receita" | "despesa">("todos");

  const fetchProjetos = useCallback(async () => {
    try {
      const res = await fetch("/api/projetos");
      if (res.ok) {
        const data = await res.json();
        setProjetos(Array.isArray(data) ? data : []);
      }
    } catch {/* usar mock */} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjetos(); }, [fetchProjetos]);

  // ─── Cálculos financeiros ─────────────────────────────────────────────────
  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  const transacoesMes = transacoes.filter((t) => {
    const d = new Date(t.data);
    return d.getMonth() + 1 === mesAtual && d.getFullYear() === anoAtual;
  });

  const receitaMes = transacoesMes
    .filter((t) => t.tipo === "receita" && t.status === "pago")
    .reduce((s, t) => s + t.valor, 0);

  const despesaMes = transacoesMes
    .filter((t) => t.tipo === "despesa" && t.status === "pago")
    .reduce((s, t) => s + t.valor, 0);

  const lucroMes = receitaMes - despesaMes;
  const margemMes = receitaMes > 0 ? ((lucroMes / receitaMes) * 100).toFixed(1) : "0";

  const receitaTotal = transacoes
    .filter((t) => t.tipo === "receita" && t.status === "pago")
    .reduce((s, t) => s + t.valor, 0);

  const pendente = transacoes
    .filter((t) => t.tipo === "receita" && t.status === "pendente")
    .reduce((s, t) => s + t.valor, 0);

  // Valor total dos projetos (pipeline)
  const pipelineTotal = projetos.reduce((s, p) => s + (p.valor || 0), 0);

  // Métodos de pagamento
  const metodoCount = transacoes
    .filter((t) => t.tipo === "receita" && t.status === "pago")
    .reduce((acc, t) => {
      const m = t.metodo || "Outro";
      acc[m] = (acc[m] || 0) + t.valor;
      return acc;
    }, {} as Record<string, number>);

  const metodoColors: Record<string, string> = {
    PIX: "#10b981",
    Transferência: "#00f0ff",
    Boleto: "#f59e0b",
    Cartão: "#e14a72",
    Outro: "#8b5cf6",
  };

  const metodoDonut = Object.entries(metodoCount).map(([name, value]) => ({
    name,
    value,
    color: metodoColors[name] || "#6b6b80",
  }));

  // Despesas por categoria
  const despesaCat = transacoes
    .filter((t) => t.tipo === "despesa" && t.status === "pago")
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
      return acc;
    }, {} as Record<string, number>);

  const despesaBar = Object.entries(despesaCat)
    .map(([name, valor]) => ({ name, valor }))
    .sort((a, b) => b.valor - a.valor);

  // Filtrar transações para tabela
  const transacoesFiltradas = filtroTipo === "todos"
    ? transacoes
    : transacoes.filter((t) => t.tipo === filtroTipo);

  const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR")}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Financeiro</h2>
          <p className="text-dark-400 mt-1">
            Gestão de receitas, despesas e fluxo de caixa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Financeiros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-400 mb-1">Receita do Mês</p>
              <p className="text-2xl font-bold text-white">{fmt(receitaMes)}</p>
              <p className="text-xs text-dark-500 mt-1">Fev/2026</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-400 mb-1">Lucro Líquido</p>
              <p className="text-2xl font-bold text-white">{fmt(lucroMes)}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400">
                <ArrowUp className="h-3 w-3" /> Margem: {margemMes}%
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-400 mb-1">A Receber</p>
              <p className="text-2xl font-bold text-white">{fmt(pendente)}</p>
              <p className="text-xs text-amber-400 mt-1">Parcelas futuras</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-400 mb-1">Pipeline Total</p>
              <p className="text-2xl font-bold text-white">{fmt(pipelineTotal)}</p>
              <p className="text-xs text-dark-500 mt-1">{projetos.length} projetos</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <PiggyBank className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="gradient" className="lg:col-span-2">
          <CardHeader
            title="Receita vs Despesas"
            subtitle="Últimos 6 meses"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <LineChartCustom
            data={faturamentoMensal}
            lines={[
              { key: "receita", color: "#10b981", label: "Receita (R$)" },
              { key: "despesa", color: "#ef4444", label: "Despesas (R$)" },
            ]}
            area
            height={300}
          />
        </Card>

        <Card variant="glass">
          <CardHeader
            title="Métodos de Recebimento"
            subtitle="Por valor recebido"
            icon={<CreditCard className="h-5 w-5" />}
          />
          {metodoDonut.length > 0 ? (
            <DonutChart
              data={metodoDonut}
              height={220}
              centerValue="PIX"
              centerLabel="principal"
            />
          ) : (
            <div className="flex items-center justify-center h-[220px] text-dark-500 text-sm">
              Sem dados
            </div>
          )}
        </Card>
      </div>

      {/* Despesas por categoria + Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="glass">
          <CardHeader
            title="Despesas por Categoria"
            subtitle="Custos operacionais"
            icon={<Wallet className="h-5 w-5" />}
          />
          <BarChartCustom data={despesaBar} barColor="#ef4444" height={250} />
        </Card>

        <Card variant="glass" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <CardHeader
              title="Transações"
              subtitle={`${transacoesFiltradas.length} registros`}
              icon={<CalendarDays className="h-5 w-5" />}
            />
            <div className="flex gap-1">
              {(["todos", "receita", "despesa"] as const).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setFiltroTipo(tipo)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    filtroTipo === tipo
                      ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                      : "text-dark-400 hover:text-white hover:bg-dark-700/50"
                  }`}
                >
                  {tipo === "todos" ? "Todos" : tipo === "receita" ? "Receitas" : "Despesas"}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-dark-900">
                <tr className="text-dark-500 border-b border-dark-700/50">
                  <th className="text-left py-2 px-3 font-medium">Descrição</th>
                  <th className="text-left py-2 px-3 font-medium">Valor</th>
                  <th className="text-left py-2 px-3 font-medium">Categoria</th>
                  <th className="text-left py-2 px-3 font-medium">Data</th>
                  <th className="text-left py-2 px-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transacoesFiltradas
                  .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                  .map((t) => {
                    const cfg = statusConfig[t.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <tr
                        key={t.id}
                        className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <div>
                            <p className="text-white font-medium text-xs">{t.descricao}</p>
                            {t.cliente && (
                              <p className="text-[10px] text-dark-500">{t.cliente}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-bold text-sm ${
                              t.tipo === "receita" ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {t.tipo === "despesa" ? "- " : "+ "}
                            {fmt(t.valor)}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs text-dark-400 px-2 py-0.5 bg-dark-800 rounded-md">
                            {t.categoria}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-dark-400 text-xs">
                          {new Date(t.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${cfg.css}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Resumo rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="glass">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">{fmt(receitaTotal)}</p>
            <p className="text-xs text-dark-400 mt-1">Total Recebido</p>
          </div>
        </Card>
        <Card variant="glass">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-400">{fmt(despesaMes)}/mês</p>
            <p className="text-xs text-dark-400 mt-1">Custos Operacionais</p>
          </div>
        </Card>
        <Card variant="glass">
          <div className="text-center">
            <p className="text-3xl font-bold gradient-text-brand">{margemMes}%</p>
            <p className="text-xs text-dark-400 mt-1">Margem de Lucro</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
