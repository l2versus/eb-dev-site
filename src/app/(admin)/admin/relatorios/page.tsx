import { prisma } from "@/lib/prisma";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DonutChart, BarChartCustom, LineChartCustom } from "@/components/charts/charts";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Award,
  BarChart3,
  Calendar,
  CircleDollarSign,
  Clock,
  Database,
  FileText,
  FolderKanban,
  PieChart,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

export const metadata = { title: "Admin - Relatorios" };
export const dynamic = "force-dynamic";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const COLORS = ["#00f0ff", "#ff00ff", "#10b981", "#f59e0b", "#6366f1", "#ef4444", "#84cc16"];

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value || 0) || 0;
}

function money(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function compactMoney(value: number) {
  if (value >= 1000) return `R$ ${(value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}k`;
  return money(value);
}

function percent(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function deltaLabel(current: number, previous: number) {
  if (!previous) return current > 0 ? "Novo no periodo" : "0%";
  const delta = Math.round(((current - previous) / previous) * 100);
  return `${delta >= 0 ? "+" : ""}${delta}%`;
}

function typeLabel(value: string) {
  const labels: Record<string, string> = {
    LANDING_PAGE: "Landing",
    SITE_INSTITUCIONAL: "Site institucional",
    ECOMMERCE: "E-commerce",
    WEBAPP: "Web app",
    DASHBOARD: "Dashboard",
    API: "API",
    CONSULTORIA: "Consultoria",
    MANUTENCAO: "Manutencao",
    OUTRO: "Outro",
  };

  return labels[value] || value || "Sem tipo";
}

function sourceName(value: string | null) {
  const source = (value || "Sem origem").toLowerCase();
  const labels: Record<string, string> = {
    "orcamento-site": "Orcamento site",
    "cadastro-site": "Cadastro site",
    "admin-propostas": "Admin propostas",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    google: "Google",
    site: "Site",
    website: "Website",
    manual: "Manual",
  };

  return labels[source] || value || "Sem origem";
}

function sumBy<T>(items: T[], picker: (item: T) => number) {
  return items.reduce((total, item) => total + picker(item), 0);
}

function monthlyRevenue(rows: Array<{ date: Date; value: number }>) {
  const values = Array.from({ length: 12 }, () => 0);

  rows.forEach((row) => {
    const date = new Date(row.date);
    values[date.getMonth()] += row.value;
  });

  return MONTHS.map((label, index) => ({ label, valor: values[index] }));
}

function revenueSource(
  transacoes: Array<{ valor: unknown; data: Date }>,
  pedidos: Array<{ valorFinal: unknown; createdAt: Date }>,
  projetos: Array<{ valorPago: unknown; createdAt: Date; dataEntrega: Date | null }>
) {
  const transacoesTotal = sumBy(transacoes, (item) => toNumber(item.valor));
  const pedidosTotal = sumBy(pedidos, (item) => toNumber(item.valorFinal));
  const projetosTotal = sumBy(projetos, (item) => toNumber(item.valorPago));

  if (transacoesTotal > 0) {
    return {
      total: transacoesTotal,
      count: transacoes.length,
      label: "transacoes pagas",
      rows: transacoes.map((item) => ({ date: item.data, value: toNumber(item.valor) })),
    };
  }

  if (pedidosTotal > 0) {
    return {
      total: pedidosTotal,
      count: pedidos.length,
      label: "pedidos pagos",
      rows: pedidos.map((item) => ({ date: item.createdAt, value: toNumber(item.valorFinal) })),
    };
  }

  return {
    total: projetosTotal,
    count: projetos.filter((item) => toNumber(item.valorPago) > 0).length,
    label: "projetos pagos",
    rows: projetos.map((item) => ({
      date: item.dataEntrega || item.createdAt,
      value: toNumber(item.valorPago),
    })),
  };
}

export default async function RelatoriosPage() {
  const year = new Date().getFullYear();
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year + 1, 0, 1);
  const previousStart = new Date(year - 1, 0, 1);

  const [
    transacoesAno,
    transacoesAnterior,
    pedidosAno,
    pedidosAnterior,
    projetosAno,
    projetosAnterior,
    propostasAno,
    clientes,
  ] = await prisma.$transaction([
    prisma.transacao.findMany({
      where: { tipo: "RECEITA", status: "PAGO", data: { gte: yearStart, lt: yearEnd } },
      select: { valor: true, data: true, categoria: true, cliente: true },
      orderBy: { data: "asc" },
    }),
    prisma.transacao.findMany({
      where: { tipo: "RECEITA", status: "PAGO", data: { gte: previousStart, lt: yearStart } },
      select: { valor: true, data: true },
    }),
    prisma.pedido.findMany({
      where: { status: { in: ["PAGO", "APROVADO"] }, createdAt: { gte: yearStart, lt: yearEnd } },
      select: { valorFinal: true, createdAt: true, clienteId: true, nomeCliente: true },
    }),
    prisma.pedido.findMany({
      where: { status: { in: ["PAGO", "APROVADO"] }, createdAt: { gte: previousStart, lt: yearStart } },
      select: { valorFinal: true, createdAt: true },
    }),
    prisma.projeto.findMany({
      where: { createdAt: { gte: yearStart, lt: yearEnd } },
      select: {
        id: true,
        clienteId: true,
        tipo: true,
        status: true,
        valor: true,
        valorPago: true,
        createdAt: true,
        dataInicio: true,
        dataEntrega: true,
      },
    }),
    prisma.projeto.findMany({
      where: { createdAt: { gte: previousStart, lt: yearStart } },
      select: { status: true, valorPago: true, createdAt: true, dataEntrega: true },
    }),
    prisma.proposta.findMany({
      where: { createdAt: { gte: yearStart, lt: yearEnd } },
      select: { id: true, clienteId: true, tipoProjeto: true, status: true, valorFinal: true, createdAt: true },
    }),
    prisma.cliente.findMany({
      include: {
        _count: { select: { projetos: true, propostas: true } },
        pedidos: {
          where: { status: { in: ["PAGO", "APROVADO"] }, createdAt: { gte: yearStart, lt: yearEnd } },
          select: { valorFinal: true },
        },
        projetos: {
          where: { createdAt: { gte: yearStart, lt: yearEnd } },
          select: { valorPago: true, valor: true, status: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const receita = revenueSource(transacoesAno, pedidosAno, projetosAno);
  const receitaAnterior = revenueSource(transacoesAnterior, pedidosAnterior, projetosAnterior);
  const faturamentoAnual = monthlyRevenue(receita.rows);

  const openStatuses = new Set(["RASCUNHO", "PENDENTE", "ENVIADA", "VISUALIZADA", "NEGOCIANDO"]);
  const propostasAbertas = propostasAno.filter((item) => openStatuses.has(item.status));
  const propostasAprovadas = propostasAno.filter((item) => item.status === "APROVADA").length;
  const pipelineAberto = sumBy(propostasAbertas, (item) => toNumber(item.valorFinal));
  const projetosEntregues = projetosAno.filter((item) => item.status === "ENTREGUE").length;
  const projetosEntreguesAnterior = projetosAnterior.filter((item) => item.status === "ENTREGUE").length;
  const clientesNovos = clientes.filter((item) => item.createdAt >= yearStart && item.createdAt < yearEnd).length;
  const clientesNovosAnterior = clientes.filter((item) => item.createdAt >= previousStart && item.createdAt < yearStart).length;
  const clientesAtivos = clientes.filter((item) => item.status === "ATIVO").length;
  const taxaConversao = propostasAno.length
    ? percent(propostasAprovadas, propostasAno.length)
    : percent(clientesAtivos, clientes.length);
  const ticketMedio = receita.count ? receita.total / receita.count : 0;

  const metricas = [
    {
      titulo: "Faturamento pago",
      valor: money(receita.total),
      variacao: deltaLabel(receita.total, receitaAnterior.total),
      positivo: receita.total >= receitaAnterior.total,
      icon: Wallet,
      cor: "emerald",
      detalhe: receita.label,
    },
    {
      titulo: "Pipeline aberto",
      valor: money(pipelineAberto),
      variacao: `${propostasAbertas.length} propostas`,
      positivo: true,
      icon: CircleDollarSign,
      cor: "gold",
      detalhe: "status aberto no CRM",
    },
    {
      titulo: "Projetos entregues",
      valor: String(projetosEntregues),
      variacao: deltaLabel(projetosEntregues, projetosEntreguesAnterior),
      positivo: projetosEntregues >= projetosEntreguesAnterior,
      icon: FolderKanban,
      cor: "brand",
      detalhe: `${projetosAno.length} projetos no ano`,
    },
    {
      titulo: "Taxa conversao",
      valor: `${taxaConversao}%`,
      variacao: propostasAno.length ? `${propostasAprovadas}/${propostasAno.length} propostas` : `${clientesAtivos}/${clientes.length} clientes`,
      positivo: taxaConversao >= 50,
      icon: Target,
      cor: "purple",
      detalhe: propostasAno.length ? "propostas aprovadas" : "clientes ativos",
    },
  ];

  const categoryCounts = new Map<string, number>();
  const categoryBase = projetosAno.length
    ? projetosAno.map((item) => item.tipo)
    : propostasAno.map((item) => item.tipoProjeto);
  categoryBase.forEach((tipo) => categoryCounts.set(typeLabel(tipo), (categoryCounts.get(typeLabel(tipo)) || 0) + 1));
  const projetosPorCategoria = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], index) => ({ name, value, color: COLORS[index % COLORS.length] }));
  const totalCategorias = projetosPorCategoria.reduce((total, item) => total + item.value, 0);

  const origemCounts = new Map<string, number>();
  clientes.forEach((cliente) => {
    const origem = sourceName(cliente.origemLead);
    origemCounts.set(origem, (origemCounts.get(origem) || 0) + 1);
  });
  const origemClientes = Array.from(origemCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, valor]) => ({ name, valor }));

  const tempoMap = new Map<string, { total: number; count: number }>();
  projetosAno
    .filter((projeto) => projeto.dataEntrega)
    .forEach((projeto) => {
      const start = projeto.dataInicio || projeto.createdAt;
      const end = projeto.dataEntrega || projeto.createdAt;
      const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
      const label = typeLabel(projeto.tipo);
      const current = tempoMap.get(label) || { total: 0, count: 0 };
      tempoMap.set(label, { total: current.total + days, count: current.count + 1 });
    });
  const tempoPorTipo = Array.from(tempoMap.entries()).map(([name, data]) => ({
    name,
    valor: Math.round(data.total / data.count),
  }));

  const topClientes = clientes
    .map((cliente) => {
      const pedidosPagos = sumBy(cliente.pedidos, (item) => toNumber(item.valorFinal));
      const projetosPagos = sumBy(cliente.projetos, (item) => toNumber(item.valorPago));
      const faturamento = pedidosPagos || projetosPagos || toNumber(cliente.faturamentoTotal);

      return {
        nome: cliente.nome,
        projetos: cliente._count.projetos,
        propostas: cliente._count.propostas,
        faturamento,
        percentual: receita.total ? Number(((faturamento / receita.total) * 100).toFixed(1)) : 0,
      };
    })
    .sort((a, b) => b.faturamento - a.faturamento || b.projetos - a.projetos || b.propostas - a.propostas)
    .slice(0, 5);

  const bestMonth = faturamentoAnual.reduce((best, item) => (item.valor > best.valor ? item : best), faturamentoAnual[0]);
  const topService = projetosPorCategoria[0];
  const topOrigin = origemClientes[0];

  const comparativo = [
    {
      label: "Faturamento",
      atual: compactMoney(receita.total),
      anterior: compactMoney(receitaAnterior.total),
      variacao: deltaLabel(receita.total, receitaAnterior.total),
      positivo: receita.total >= receitaAnterior.total,
    },
    {
      label: "Projetos",
      atual: String(projetosEntregues),
      anterior: String(projetosEntreguesAnterior),
      variacao: deltaLabel(projetosEntregues, projetosEntreguesAnterior),
      positivo: projetosEntregues >= projetosEntreguesAnterior,
    },
    {
      label: "Clientes novos",
      atual: String(clientesNovos),
      anterior: String(clientesNovosAnterior),
      variacao: deltaLabel(clientesNovos, clientesNovosAnterior),
      positivo: clientesNovos >= clientesNovosAnterior,
    },
    {
      label: "Ticket medio",
      atual: compactMoney(ticketMedio),
      anterior: compactMoney(receitaAnterior.count ? receitaAnterior.total / receitaAnterior.count : 0),
      variacao: deltaLabel(ticketMedio, receitaAnterior.count ? receitaAnterior.total / receitaAnterior.count : 0),
      positivo: ticketMedio >= (receitaAnterior.count ? receitaAnterior.total / receitaAnterior.count : 0),
    },
  ];

  const baseDados = [
    { label: "Clientes", value: clientes.length, icon: Users },
    { label: "Propostas no ano", value: propostasAno.length, icon: FileText },
    { label: "Projetos no ano", value: projetosAno.length, icon: FolderKanban },
    { label: "Transacoes pagas", value: transacoesAno.length, icon: Database },
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Relatorios & Analytics</h2>
          <p className="mt-1 text-sm text-dark-400">Dados reais do PostgreSQL, sem seed fake na tela.</p>
        </div>
        <Badge variant="gold" className="self-start">
          <Calendar className="mr-1 h-3 w-3" /> Ano {year}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {metricas.map((metrica) => (
          <Card key={metrica.titulo} variant="glass" padding="sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-dark-500 sm:text-xs">{metrica.titulo}</p>
                <p className="truncate text-lg font-bold text-white sm:text-2xl">{metrica.valor}</p>
                <div className={`mt-1 flex items-center gap-1 text-xs ${metrica.positivo ? "text-emerald-400" : "text-red-400"}`}>
                  {metrica.positivo ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {metrica.variacao}
                </div>
                <p className="mt-1 truncate text-[11px] text-dark-500">{metrica.detalhe}</p>
              </div>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
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

      <Card variant="gradient">
        <CardHeader
          title="Evolucao do faturamento pago"
          subtitle={`Origem atual: ${receita.label}`}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <LineChartCustom
          data={faturamentoAnual}
          lines={[{ key: "valor", color: "#00f0ff", label: "Faturamento (R$)" }]}
          area
          height={350}
        />
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <Card variant="glass">
          <CardHeader
            title="Projetos por categoria"
            subtitle={projetosAno.length ? "Distribuicao por projetos cadastrados" : "Sem projetos: usando propostas do ano"}
            icon={<PieChart className="h-5 w-5" />}
          />
          <DonutChart
            data={projetosPorCategoria.length ? projetosPorCategoria : [{ name: "Sem dados", value: 1, color: "#3e3f47" }]}
            height={280}
            centerValue={String(totalCategorias)}
            centerLabel="registros"
            format="number"
          />
        </Card>

        <Card variant="glass">
          <CardHeader
            title="Origem dos clientes"
            subtitle="Agrupado pelo campo origemLead"
            icon={<Users className="h-5 w-5" />}
          />
          <BarChartCustom
            data={origemClientes.length ? origemClientes : [{ name: "Sem dados", valor: 0 }]}
            barColor="#ff00ff"
            height={280}
            format="number"
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <Card variant="glass">
          <CardHeader
            title="Tempo medio de entrega"
            subtitle="Calculado por dataInicio/dataEntrega"
            icon={<Clock className="h-5 w-5" />}
          />
          <BarChartCustom
            data={tempoPorTipo.length ? tempoPorTipo : [{ name: "Sem entregas", valor: 0 }]}
            barColor="#00f0ff"
            height={250}
            format="days"
          />
        </Card>

        <Card variant="glass">
          <CardHeader
            title="Base do banco"
            subtitle="Contadores reais que alimentam este painel"
            icon={<Database className="h-5 w-5" />}
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {baseDados.map((item) => (
              <div key={item.label} className="rounded-xl border border-dark-800 bg-dark-900/50 p-4">
                <div className="flex items-center justify-between text-dark-500">
                  <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
                  <item.icon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-2xl font-bold text-white">{item.value.toLocaleString("pt-BR")}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader
          title="Top clientes por faturamento"
          subtitle="Ordenado por pedidos/projetos pagos ou faturamentoTotal"
          icon={<Award className="h-5 w-5" />}
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700/50 text-dark-500">
                <th className="px-3 py-2 text-left font-medium">#</th>
                <th className="px-3 py-2 text-left font-medium">Cliente</th>
                <th className="px-3 py-2 text-left font-medium">Projetos</th>
                <th className="px-3 py-2 text-left font-medium">Propostas</th>
                <th className="px-3 py-2 text-left font-medium">Faturamento</th>
                <th className="px-3 py-2 text-left font-medium">%</th>
              </tr>
            </thead>
            <tbody>
              {topClientes.length ? (
                topClientes.map((cliente, index) => (
                  <tr key={`${cliente.nome}-${index}`} className="border-b border-dark-800/50 transition-colors hover:bg-dark-800/30">
                    <td className="px-3 py-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dark-800 text-xs font-bold text-dark-300">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-medium text-white">{cliente.nome}</td>
                    <td className="px-3 py-3 text-dark-300">{cliente.projetos}</td>
                    <td className="px-3 py-3 text-dark-300">{cliente.propostas}</td>
                    <td className="px-3 py-3 font-medium text-brand-400">{money(cliente.faturamento)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-dark-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500"
                            style={{ width: `${Math.min(cliente.percentual, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-dark-400">{cliente.percentual}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-8 text-center text-dark-500" colSpan={6}>
                    Sem clientes cadastrados no banco.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card variant="glass" className="border-emerald-500/20">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-medium text-white">Melhor mes</p>
              <p className="text-2xl font-bold text-emerald-400">{bestMonth.valor ? bestMonth.label : "Sem receita"}</p>
              <p className="mt-1 text-xs text-dark-500">{money(bestMonth.valor)}</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="border-brand-500/20">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
              <Zap className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <p className="font-medium text-white">Servico top</p>
              <p className="text-2xl font-bold text-brand-400">{topService?.name || "Sem dados"}</p>
              <p className="mt-1 text-xs text-dark-500">{topService ? `${topService.value} registros` : "0 registros"}</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="border-gold-500/20">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10">
              <Activity className="h-5 w-5 text-gold-400" />
            </div>
            <div>
              <p className="font-medium text-white">Canal principal</p>
              <p className="text-2xl font-bold text-gold-400">{topOrigin?.name || "Sem origem"}</p>
              <p className="mt-1 text-xs text-dark-500">{topOrigin ? `${topOrigin.valor} clientes` : "0 clientes"}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card variant="gradient">
        <CardHeader
          title="Comparativo de periodos"
          subtitle={`${year} vs ${year - 1}, usando apenas registros do banco`}
          icon={<FileText className="h-5 w-5" />}
        />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {comparativo.map((item) => (
            <div key={item.label} className="rounded-xl bg-dark-800/30 p-4 text-center">
              <p className="mb-2 text-xs text-dark-500">{item.label}</p>
              <p className="text-xl font-bold text-white">{item.atual}</p>
              <p className="mt-1 text-xs text-dark-500">Anterior: {item.anterior}</p>
              <p className={`mt-1 text-sm font-medium ${item.positivo ? "text-emerald-400" : "text-red-400"}`}>
                {item.variacao}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
