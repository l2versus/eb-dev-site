// ══════════════════════════════════════════════════════════════════════════════
// 💰 Financeiro — API Prisma (Transações reais)
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { LineChartCustom, DonutChart, BarChartCustom } from "@/components/charts/charts";
import { toast } from "sonner";
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
  Edit,
  Trash2,
  Save,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
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

// Calcular faturamento mensal a partir das transações
function calcFaturamentoMensal(transacoes: Transacao[], meses: number = 6) {
  const result: { label: string; receita: number; despesa: number }[] = [];
  const now = new Date();
  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mes = d.getMonth();
    const ano = d.getFullYear();
    const receita = transacoes
      .filter((t) => t.tipo === "receita" && t.status === "pago" && new Date(t.data).getMonth() === mes && new Date(t.data).getFullYear() === ano)
      .reduce((s, t) => s + t.valor, 0);
    const despesa = transacoes
      .filter((t) => t.tipo === "despesa" && t.status === "pago" && new Date(t.data).getMonth() === mes && new Date(t.data).getFullYear() === ano)
      .reduce((s, t) => s + t.valor, 0);
    result.push({ label: labels[mes], receita, despesa });
  }
  return result;
}

const statusConfig: Record<string, { label: string; css: string; icon: typeof CheckCircle }> = {
  pago: { label: "Pago", css: "text-emerald-400 bg-emerald-500/10", icon: CheckCircle },
  pendente: { label: "Pendente", css: "text-amber-400 bg-amber-500/10", icon: Clock },
  atrasado: { label: "Atrasado", css: "text-red-400 bg-red-500/10", icon: AlertTriangle },
  cancelado: { label: "Cancelado", css: "text-dark-500 bg-dark-700/50", icon: XCircle },
};

const defaultForm = {
  tipo: "receita" as "receita" | "despesa",
  descricao: "",
  valor: "",
  categoria: "Projeto",
  data: new Date().toISOString().split("T")[0],
  status: "pago" as "pago" | "pendente" | "atrasado" | "cancelado",
  metodo: "PIX",
  cliente: "",
};

export default function FinanceiroPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "receita" | "despesa">("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  // Carregar transações da API ao montar
  const fetchTransacoes = useCallback(async () => {
    try {
      const res = await fetch("/api/financeiro");
      if (!res.ok) throw new Error("Erro ao buscar transações");
      const data = await res.json();
      setTransacoes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar transações.");
    }
  }, []);

  useEffect(() => {
    fetchTransacoes();
  }, [fetchTransacoes]);

  const fetchProjetos = useCallback(async () => {
    try {
      const res = await fetch("/api/projetos");
      if (res.ok) {
        const data = await res.json();
        setProjetos(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Erro ao carregar projetos do banco.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjetos(); }, [fetchProjetos]);

  // ═══ CRUD ═══
  const abrirNova = () => {
    setEditingId(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const abrirEdicao = (t: Transacao) => {
    setEditingId(t.id);
    setForm({
      tipo: t.tipo,
      descricao: t.descricao,
      valor: String(t.valor),
      categoria: t.categoria,
      data: t.data,
      status: t.status,
      metodo: t.metodo || "PIX",
      cliente: t.cliente || "",
    });
    setShowModal(true);
  };

  const salvarTransacao = async () => {
    if (!form.descricao.trim() || !form.valor) return;
    setSaving(true);
    try {
      const payload = {
        tipo: form.tipo,
        descricao: form.descricao,
        valor: form.valor,
        categoria: form.categoria,
        data: form.data,
        status: form.status,
        metodo: form.metodo,
        cliente: form.cliente || null,
      };

      if (editingId) {
        const res = await fetch(`/api/financeiro/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erro ao atualizar");
        }
        toast.success("Transação atualizada!");
      } else {
        const res = await fetch("/api/financeiro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erro ao criar");
        }
        toast.success("Transação criada!");
      }

      setShowModal(false);
      setEditingId(null);
      setForm(defaultForm);
      await fetchTransacoes();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const excluirTransacao = async (id: string) => {
    if (!confirm("Excluir esta transação?")) return;
    try {
      const res = await fetch(`/api/financeiro/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
      toast.success("Transação excluída.");
      await fetchTransacoes();
    } catch {
      toast.error("Erro ao excluir transação.");
    }
  };

  // ═══ Exportar CSV ═══
  const exportarCSV = () => {
    const header = "Tipo,Descrição,Valor,Categoria,Data,Status,Método,Cliente";
    const rows = transacoes.map((t) =>
      [t.tipo, `"${t.descricao}"`, t.valor, t.categoria, t.data, t.status, t.metodo || "", t.cliente || ""].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financeiro-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado!");
  };

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

  // Faturamento mensal calculado dos dados reais
  const faturamentoMensal = calcFaturamentoMensal(transacoes);

  // Label dinâmico do mês atual
  const mesLabel = new Date().toLocaleDateString("pt-BR", { month: "short", year: "numeric" });

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
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Financeiro</h2>
          <p className="text-dark-400 text-sm mt-1">
            Gestão de receitas, despesas e fluxo de caixa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} onClick={exportarCSV}>
            Exportar
          </Button>
          <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />} onClick={abrirNova}>
            Nova Transação
          </Button>
        </div>
      </div>

      {/* KPIs Financeiros */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card variant="glass">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-400 mb-1">Receita do Mês</p>
              <p className="text-lg sm:text-2xl font-bold text-white">{fmt(receitaMes)}</p>
              <p className="text-xs text-dark-500 mt-1 capitalize">{mesLabel}</p>
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
              <p className="text-lg sm:text-2xl font-bold text-white">{fmt(lucroMes)}</p>
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
              <p className="text-lg sm:text-2xl font-bold text-white">{fmt(pendente)}</p>
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
              <p className="text-lg sm:text-2xl font-bold text-white">{fmt(pipelineTotal)}</p>
              <p className="text-xs text-dark-500 mt-1">{projetos.length} projetos</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <PiggyBank className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
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
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
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
                  <th className="text-left py-2 px-3 font-medium">Ações</th>
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
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => abrirEdicao(t)} className="p-1.5 text-dark-400 hover:text-brand-400 transition-colors"><Edit className="h-3.5 w-3.5" /></button>
                            <button onClick={() => excluirTransacao(t.id)} className="p-1.5 text-dark-400 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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

      {/* ═══ Modal Nova/Editar Transação ═══ */}
      <Modal
        open={showModal}
        onOpenChange={(v) => { if (!v) { setShowModal(false); setEditingId(null); } }}
        title={editingId ? "Editar Transação" : "Nova Transação"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as "receita" | "despesa" })} className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "pago" | "pendente" | "atrasado" | "cancelado" })} className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="atrasado">Atrasado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Descrição *</label>
            <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Ex: Projeto Site Institucional" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Valor (R$) *</label>
              <Input type="number" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} placeholder="5000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Data</label>
              <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Categoria</label>
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                <option value="Projeto">Projeto</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Ferramentas">Ferramentas</option>
                <option value="Fiscal">Fiscal</option>
                <option value="Marketing">Marketing</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Método</label>
              <select value={form.metodo} onChange={(e) => setForm({ ...form, metodo: e.target.value })} className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                <option value="PIX">PIX</option>
                <option value="Transferência">Transferência</option>
                <option value="Boleto">Boleto</option>
                <option value="Cartão">Cartão</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Cliente</label>
            <Input value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} placeholder="Nome do cliente (opcional)" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditingId(null); }}>Cancelar</Button>
            <Button variant="primary" onClick={salvarTransacao} loading={saving} disabled={!form.descricao || !form.valor} icon={<Save className="h-4 w-4" />}>
              {editingId ? "Salvar Alterações" : "Criar Transação"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
