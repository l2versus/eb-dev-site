// ══════════════════════════════════════════════════════════════════════════════
// 👤 Portal do Cliente — Painel Principal (Dados reais)
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Circle,
  MessageSquare,
  FileText,
  Calendar,
  Download,
  DollarSign,
  Bell,
  LogOut,
  ChevronRight,
  ExternalLink,
  Loader2,
  FolderKanban,
  CreditCard,
  RefreshCw,
} from "lucide-react";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
}

interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  tipo: string;
  status: string;
  progresso: number;
  prazoEntrega?: string;
  urlPreview?: string;
  urlProducao?: string;
}

interface Proposta {
  id: string;
  titulo: string;
  valor: number;
  valorFinal: number;
  status: string;
  validade: string;
  tipoProjeto: string;
}

interface Pedido {
  id: string;
  codigo: string;
  descricao: string;
  valorFinal: number;
  status: string;
  metodoPagamento: string;
  createdAt: string;
}

const statusProjetoConfig: Record<string, { label: string; color: string }> = {
  BRIEFING: { label: "Briefing", color: "text-purple-400 bg-purple-500/10" },
  PROPOSTA_ENVIADA: { label: "Proposta Enviada", color: "text-blue-400 bg-blue-500/10" },
  AGUARDANDO_PAGAMENTO: { label: "Aguardando Pagamento", color: "text-gold-400 bg-gold-500/10" },
  EM_DESENVOLVIMENTO: { label: "Em Desenvolvimento", color: "text-brand-400 bg-brand-500/10" },
  REVISAO: { label: "Em Revisão", color: "text-amber-400 bg-amber-500/10" },
  AJUSTES: { label: "Em Ajustes", color: "text-orange-400 bg-orange-500/10" },
  ENTREGUE: { label: "Entregue", color: "text-emerald-400 bg-emerald-500/10" },
  CANCELADO: { label: "Cancelado", color: "text-red-400 bg-red-500/10" },
  PAUSADO: { label: "Pausado", color: "text-dark-400 bg-dark-700/30" },
};

const statusPedidoConfig: Record<string, { label: string; color: string }> = {
  PENDENTE: { label: "Pendente", color: "text-amber-400 bg-amber-500/10" },
  AGUARDANDO_PAGAMENTO: { label: "Aguardando", color: "text-gold-400 bg-gold-500/10" },
  PROCESSANDO: { label: "Processando", color: "text-blue-400 bg-blue-500/10" },
  APROVADO: { label: "Aprovado", color: "text-emerald-400 bg-emerald-500/10" },
  PAGO: { label: "Pago", color: "text-emerald-400 bg-emerald-500/10" },
  CANCELADO: { label: "Cancelado", color: "text-red-400 bg-red-500/10" },
  EXPIRADO: { label: "Expirado", color: "text-dark-400 bg-dark-700/30" },
};

export default function ClientePainelPage() {
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"projetos" | "propostas" | "pagamentos">("projetos");

  // Verificar autenticação e carregar dados
  useEffect(() => {
    const stored = localStorage.getItem("clientePortal");
    if (!stored) {
      router.push("/cliente/login");
      return;
    }

    try {
      const clienteData = JSON.parse(stored);
      setCliente(clienteData);
      carregarDados(clienteData.id);
    } catch {
      localStorage.removeItem("clientePortal");
      router.push("/cliente/login");
    }
  }, [router]);

  // Carregar dados do cliente
  const carregarDados = async (clienteId: string) => {
    setLoading(true);
    try {
      // Carregar projetos
      const resProjetos = await fetch(`/api/cliente-dados?clienteId=${clienteId}&tipo=projetos`);
      if (resProjetos.ok) {
        const data = await resProjetos.json();
        setProjetos(data.projetos || []);
        setPropostas(data.propostas || []);
        setPedidos(data.pedidos || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("clientePortal");
    router.push("/cliente/login");
  };

  // Formatar valor
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-dark-400">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="border-b border-dark-800 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-sm font-medium text-white">Portal do Cliente</h1>
              <p className="text-xs text-dark-500">{cliente?.nome}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => cliente && carregarDados(cliente.id)}
              icon={<RefreshCw className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="glass">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <FolderKanban className="h-5 w-5 text-brand-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{projetos.length}</p>
                <p className="text-xs text-dark-400">Projetos</p>
              </div>
            </div>
          </Card>
          <Card variant="glass">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{propostas.length}</p>
                <p className="text-xs text-dark-400">Propostas</p>
              </div>
            </div>
          </Card>
          <Card variant="glass">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {pedidos.filter((p) => p.status === "PAGO").length}
                </p>
                <p className="text-xs text-dark-400">Pagos</p>
              </div>
            </div>
          </Card>
          <Card variant="glass">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-gold-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gold-400">
                  {formatarValor(
                    pedidos
                      .filter((p) => p.status === "PAGO")
                      .reduce((acc, p) => acc + Number(p.valorFinal), 0)
                  )}
                </p>
                <p className="text-xs text-dark-400">Investido</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-dark-800 pb-4">
          {[
            { id: "projetos", label: "Projetos", icon: FolderKanban },
            { id: "propostas", label: "Propostas", icon: FileText },
            { id: "pagamentos", label: "Pagamentos", icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-brand-500 text-white"
                  : "text-dark-400 hover:bg-dark-800"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        {activeTab === "projetos" && (
          <div className="space-y-4">
            {projetos.length === 0 ? (
              <Card variant="glass" className="text-center py-12">
                <FolderKanban className="h-12 w-12 text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400">Nenhum projeto em andamento</p>
              </Card>
            ) : (
              projetos.map((projeto) => (
                <Card key={projeto.id} variant="glass" className="hover:border-brand-500/30 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold">{projeto.nome}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                          statusProjetoConfig[projeto.status]?.color || "text-dark-400 bg-dark-700/30"
                        }`}>
                          {statusProjetoConfig[projeto.status]?.label || projeto.status}
                        </span>
                      </div>
                      {projeto.descricao && (
                        <p className="text-sm text-dark-400 mb-3">{projeto.descricao}</p>
                      )}
                      {/* Barra de progresso */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-brand-500 to-brand-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${projeto.progresso}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-brand-400">
                          {projeto.progresso}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {projeto.prazoEntrega && (
                        <div className="text-right">
                          <p className="text-xs text-dark-500">Prazo</p>
                          <p className="text-sm text-dark-300">
                            {new Date(projeto.prazoEntrega).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      )}
                      {projeto.urlPreview && (
                        <Link
                          href={projeto.urlPreview}
                          target="_blank"
                          className="p-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "propostas" && (
          <div className="space-y-4">
            {propostas.length === 0 ? (
              <Card variant="glass" className="text-center py-12">
                <FileText className="h-12 w-12 text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400">Nenhuma proposta disponível</p>
              </Card>
            ) : (
              propostas.map((proposta) => (
                <Card key={proposta.id} variant="glass" className="hover:border-brand-500/30 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{proposta.titulo}</h3>
                      <p className="text-sm text-dark-400">{proposta.tipoProjeto}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-brand-400">
                          {formatarValor(Number(proposta.valorFinal))}
                        </p>
                        <p className="text-xs text-dark-500">
                          Válido até {new Date(proposta.validade).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      {proposta.status === "ENVIADA" || proposta.status === "VISUALIZADA" ? (
                        <Link href={`/checkout/${proposta.id}`}>
                          <Button variant="primary" size="sm">
                            Aceitar e Pagar
                          </Button>
                        </Link>
                      ) : (
                        <Badge variant="default">
                          {proposta.status === "APROVADA" ? "Aprovada" : proposta.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "pagamentos" && (
          <div className="space-y-4">
            {pedidos.length === 0 ? (
              <Card variant="glass" className="text-center py-12">
                <CreditCard className="h-12 w-12 text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400">Nenhum pagamento registrado</p>
              </Card>
            ) : (
              pedidos.map((pedido) => (
                <Card key={pedido.id} variant="glass">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-brand-400">{pedido.codigo}</span>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                          statusPedidoConfig[pedido.status]?.color || "text-dark-400 bg-dark-700/30"
                        }`}>
                          {statusPedidoConfig[pedido.status]?.label || pedido.status}
                        </span>
                      </div>
                      <p className="text-sm text-dark-400">{pedido.descricao}</p>
                      <p className="text-xs text-dark-500 mt-1">
                        {new Date(pedido.createdAt).toLocaleDateString("pt-BR")} · {pedido.metodoPagamento}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        {formatarValor(Number(pedido.valorFinal))}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* WhatsApp CTA */}
        <Card variant="gradient" className="mt-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Dúvidas ou sugestões?</h3>
              <p className="text-dark-400 text-sm">Fale diretamente comigo pelo WhatsApp</p>
            </div>
            <Link
              href="https://wa.me/5585998500344"
              target="_blank"
            >
              <Button variant="primary" icon={<ChevronRight className="h-4 w-4" />}>
                Enviar mensagem
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
