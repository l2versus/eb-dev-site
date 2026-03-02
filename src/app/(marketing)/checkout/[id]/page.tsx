// ══════════════════════════════════════════════════════════════════════════════
// 💳 Página de Checkout — Pagamento via Mercado Pago (PIX / Cartão)
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  QrCode,
  CreditCard,
  Check,
  Copy,
  Clock,
  Shield,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Smartphone,
  AlertCircle,
} from "lucide-react";

interface Proposta {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  valorFinal: number;
  cliente: {
    nome: string;
    email: string;
    telefone?: string;
  };
}

interface PagamentoData {
  pedidoId: string;
  codigo: string;
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  pixExpiresAt?: string;
  checkoutUrl?: string;
}

type MetodoPagamento = "pix" | "cartao";
type StatusPagamento = "idle" | "loading" | "aguardando" | "aprovado" | "erro";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const propostaId = params.id as string;

  // Estado
  const [proposta, setProposta] = useState<Proposta | null>(null);
  const [loading, setLoading] = useState(true);
  const [metodo, setMetodo] = useState<MetodoPagamento>("pix");
  const [status, setStatus] = useState<StatusPagamento>("idle");
  const [pagamento, setPagamento] = useState<PagamentoData | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState<number | null>(null);

  // Formulário cartão
  const [formCartao, setFormCartao] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
    parcelas: 1,
  });

  // Formulário PIX
  const [formPix, setFormPix] = useState({
    cpf: "",
    nome: "",
  });

  // Carregar proposta
  useEffect(() => {
    async function carregarProposta() {
      try {
        const res = await fetch(`/api/propostas/${propostaId}`);
        if (!res.ok) throw new Error("Proposta não encontrada");
        const data = await res.json();
        setProposta(data);
        setFormPix({ cpf: "", nome: data.cliente?.nome || "" });
      } catch (error) {
        console.error("Erro ao carregar proposta:", error);
      } finally {
        setLoading(false);
      }
    }

    if (propostaId) {
      carregarProposta();
    }
  }, [propostaId]);

  // Timer do PIX
  useEffect(() => {
    if (!pagamento?.pixExpiresAt) return;

    const interval = setInterval(() => {
      const agora = new Date().getTime();
      const expira = new Date(pagamento.pixExpiresAt!).getTime();
      const diff = Math.max(0, Math.floor((expira - agora) / 1000));
      setTempoRestante(diff);

      if (diff <= 0) {
        clearInterval(interval);
        setStatus("erro");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pagamento?.pixExpiresAt]);

  // Polling para verificar pagamento
  useEffect(() => {
    if (status !== "aguardando" || !pagamento?.pedidoId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout?pedidoId=${pagamento.pedidoId}`);
        const data = await res.json();
        
        if (data.status === "PAGO" || data.status === "APROVADO") {
          setStatus("aprovado");
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status, pagamento?.pedidoId]);

  // Copiar código PIX
  const copiarPix = useCallback(() => {
    if (!pagamento?.pixQrCode) return;
    navigator.clipboard.writeText(pagamento.pixQrCode);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }, [pagamento?.pixQrCode]);

  // Processar pagamento PIX
  const processarPix = async () => {
    if (!proposta || !formPix.cpf || !formPix.nome) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propostaId: proposta.id,
          nome: formPix.nome,
          email: proposta.cliente.email,
          telefone: proposta.cliente.telefone,
          cpf: formPix.cpf.replace(/\D/g, ""),
          valor: proposta.valorFinal,
          descricao: proposta.titulo,
          metodoPagamento: "pix",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPagamento({
        pedidoId: data.pedidoId,
        codigo: data.codigo,
        pixQrCode: data.pixQrCode,
        pixQrCodeBase64: data.pixQrCodeBase64,
        pixExpiresAt: data.pixExpiresAt,
      });
      setStatus("aguardando");
    } catch (error: any) {
      console.error("Erro:", error);
      setStatus("erro");
    }
  };

  // Processar pagamento Cartão
  const processarCartao = async () => {
    if (!proposta) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propostaId: proposta.id,
          nome: proposta.cliente.nome,
          email: proposta.cliente.email,
          valor: proposta.valorFinal,
          descricao: proposta.titulo,
          metodoPagamento: "cartao",
          parcelas: formCartao.parcelas,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirecionar para checkout do MP
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error: any) {
      console.error("Erro:", error);
      setStatus("erro");
    }
  };

  // Formatar tempo
  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}:${seg.toString().padStart(2, "0")}`;
  };

  // Formatar CPF
  const formatarCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  // Proposta não encontrada
  if (!proposta) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Proposta não encontrada</h1>
          <p className="text-dark-400 mb-6">O link pode estar expirado ou inválido.</p>
          <Link href="/">
            <Button variant="primary">Voltar ao início</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Pagamento aprovado
  if (status === "aprovado") {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Pagamento Confirmado!
          </h1>
          <p className="text-dark-400 mb-6">
            Seu pagamento foi processado com sucesso. Você receberá um email com
            os detalhes do seu projeto.
          </p>
          <div className="bg-dark-900 rounded-xl p-4 mb-6 border border-dark-800">
            <p className="text-sm text-dark-400">Código do pedido</p>
            <p className="text-xl font-mono font-bold text-brand-400">
              {pagamento?.codigo}
            </p>
          </div>
          <Link href="/">
            <Button variant="primary" size="lg">
              Voltar ao início
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="border-b border-dark-800 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Voltar</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-dark-500">
            <Shield className="h-4 w-4 text-emerald-500" />
            Pagamento seguro
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Coluna Esquerda - Resumo */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-dark-900 rounded-2xl p-6 border border-dark-800 sticky top-24">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Resumo do Pedido
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-dark-400">Projeto</p>
                    <p className="text-white font-medium">{proposta.titulo}</p>
                  </div>
                  {proposta.descricao && (
                    <div>
                      <p className="text-sm text-dark-400">Descrição</p>
                      <p className="text-dark-300 text-sm">{proposta.descricao}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-dark-400">Cliente</p>
                    <p className="text-white">{proposta.cliente.nome}</p>
                  </div>
                </div>

                <div className="border-t border-dark-800 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-dark-400">Subtotal</span>
                    <span className="text-white">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(proposta.valor)}
                    </span>
                  </div>
                  {proposta.valor !== proposta.valorFinal && (
                    <div className="flex items-center justify-between mb-2 text-emerald-400">
                      <span>Desconto</span>
                      <span>
                        -{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(proposta.valor - proposta.valorFinal)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-dark-800">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold text-brand-400">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(proposta.valorFinal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Formulário */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Finalizar Pagamento
              </h1>
              <p className="text-dark-400 mb-8">
                Escolha a forma de pagamento e conclua sua compra
              </p>

              {/* Seleção de método */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                  onClick={() => setMetodo("pix")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    metodo === "pix"
                      ? "border-brand-500 bg-brand-500/10"
                      : "border-dark-700 hover:border-dark-600"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      metodo === "pix" ? "bg-brand-500" : "bg-dark-800"
                    }`}
                  >
                    <QrCode className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">PIX</p>
                    <p className="text-xs text-dark-400">Aprovação imediata</p>
                  </div>
                  {metodo === "pix" && (
                    <Check className="h-5 w-5 text-brand-500 ml-auto" />
                  )}
                </button>

                <button
                  onClick={() => setMetodo("cartao")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    metodo === "cartao"
                      ? "border-brand-500 bg-brand-500/10"
                      : "border-dark-700 hover:border-dark-600"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      metodo === "cartao" ? "bg-brand-500" : "bg-dark-800"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">Cartão</p>
                    <p className="text-xs text-dark-400">Até 12x</p>
                  </div>
                  {metodo === "cartao" && (
                    <Check className="h-5 w-5 text-brand-500 ml-auto" />
                  )}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {/* Formulário PIX */}
                {metodo === "pix" && status !== "aguardando" && (
                  <motion.div
                    key="pix-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <Input
                      label="Nome completo"
                      value={formPix.nome}
                      onChange={(e) =>
                        setFormPix({ ...formPix, nome: e.target.value })
                      }
                      placeholder="Seu nome completo"
                    />
                    <Input
                      label="CPF"
                      value={formPix.cpf}
                      onChange={(e) =>
                        setFormPix({ ...formPix, cpf: formatarCPF(e.target.value) })
                      }
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={processarPix}
                      loading={status === "loading"}
                      disabled={!formPix.cpf || !formPix.nome || status === "loading"}
                    >
                      Gerar código PIX
                    </Button>
                  </motion.div>
                )}

                {/* QR Code PIX */}
                {metodo === "pix" && status === "aguardando" && pagamento && (
                  <motion.div
                    key="pix-qr"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center"
                  >
                    <div className="bg-white p-4 rounded-2xl inline-block mb-6">
                      {pagamento.pixQrCodeBase64 ? (
                        <img
                          src={`data:image/png;base64,${pagamento.pixQrCodeBase64}`}
                          alt="QR Code PIX"
                          className="w-48 h-48"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-dark-300" />
                        </div>
                      )}
                    </div>

                    {/* Timer */}
                    {tempoRestante !== null && tempoRestante > 0 && (
                      <div className="flex items-center justify-center gap-2 mb-4 text-amber-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          Expira em {formatarTempo(tempoRestante)}
                        </span>
                      </div>
                    )}

                    {/* Código PIX */}
                    <div className="bg-dark-900 rounded-xl p-4 mb-6 border border-dark-800">
                      <p className="text-xs text-dark-400 mb-2">PIX Copia e Cola</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={pagamento.pixQrCode || ""}
                          className="flex-1 bg-dark-800 rounded-lg px-3 py-2 text-xs text-dark-300 font-mono truncate"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={copiarPix}
                          icon={copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        >
                          {copiado ? "Copiado!" : "Copiar"}
                        </Button>
                      </div>
                    </div>

                    {/* Instruções */}
                    <div className="text-left bg-dark-900/50 rounded-xl p-4 border border-dark-800">
                      <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-brand-400" />
                        Como pagar
                      </h4>
                      <ol className="space-y-2 text-sm text-dark-300">
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                            1
                          </span>
                          Abra o app do seu banco
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                            2
                          </span>
                          Escolha pagar via PIX / QR Code
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                            3
                          </span>
                          Escaneie o código ou cole a chave
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                            4
                          </span>
                          Confirme o pagamento
                        </li>
                      </ol>
                    </div>

                    {/* Status */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-dark-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Aguardando confirmação do pagamento...</span>
                    </div>
                  </motion.div>
                )}

                {/* Formulário Cartão */}
                {metodo === "cartao" && (
                  <motion.div
                    key="cartao-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Parcelas */}
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">
                        Parcelas
                      </label>
                      <select
                        value={formCartao.parcelas}
                        onChange={(e) =>
                          setFormCartao({
                            ...formCartao,
                            parcelas: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                          <option key={n} value={n}>
                            {n}x de{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(proposta.valorFinal / n)}
                            {n === 1 ? " à vista" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-dark-900/50 rounded-xl p-4 border border-dark-800">
                      <p className="text-sm text-dark-400 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        Você será redirecionado para o checkout seguro do Mercado Pago
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={processarCartao}
                      loading={status === "loading"}
                      disabled={status === "loading"}
                      icon={<CreditCard className="h-4 w-4" />}
                    >
                      Pagar com Cartão
                    </Button>
                  </motion.div>
                )}

                {/* Erro */}
                {status === "erro" && (
                  <motion.div
                    key="erro"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Erro no pagamento
                    </h3>
                    <p className="text-dark-400 mb-4">
                      Não foi possível processar seu pagamento. Tente novamente.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => setStatus("idle")}
                      icon={<RefreshCw className="h-4 w-4" />}
                    >
                      Tentar novamente
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-dark-500">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Criptografia SSL
            </span>
            <span>•</span>
            <span>Pagamento processado por Mercado Pago</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
