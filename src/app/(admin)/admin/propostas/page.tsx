// ══════════════════════════════════════════════════════════════════════════════
// 📄 Propostas — Gerador de Propostas + PDF Export
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FileText,
  Download,
  Plus,
  Trash2,
  Eye,
  Send,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  Clock,
  CheckCircle,
  Edit3,
  Copy,
  Printer,
  Loader2,
  Package,
  X,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ItemProposta {
  id: string;
  descricao: string;
  detalhes: string;
  valor: number;
}

interface Proposta {
  id: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  clienteEmpresa: string;
  titulo: string;
  descricao: string;
  itens: ItemProposta[];
  desconto: number;
  prazoEstimado: string;
  validade: string;
  observacoes: string;
  criadaEm: string;
  status: "rascunho" | "enviada" | "aprovada" | "recusada";
}

// ─── Templates de itens comuns ────────────────────────────────────────────────
const templateItens: Record<string, ItemProposta[]> = {
  "Landing Page": [
    { id: "1", descricao: "Design UI/UX responsivo", detalhes: "Layout moderno com Figma, mobile-first", valor: 800 },
    { id: "2", descricao: "Desenvolvimento Frontend", detalhes: "Next.js + TailwindCSS + animações", valor: 1200 },
    { id: "3", descricao: "SEO Otimizado", detalhes: "Meta tags, Schema.org, Core Web Vitals", valor: 300 },
    { id: "4", descricao: "Deploy + Domínio", detalhes: "Vercel + configuração DNS", valor: 200 },
  ],
  "Site Institucional": [
    { id: "1", descricao: "Design UI/UX (5+ páginas)", detalhes: "Prototipação completa no Figma", valor: 1500 },
    { id: "2", descricao: "Desenvolvimento Full-Stack", detalhes: "Next.js, CMS headless, formulários", valor: 3000 },
    { id: "3", descricao: "Blog integrado", detalhes: "Sistema de posts com markdown", valor: 800 },
    { id: "4", descricao: "SEO + Analytics", detalhes: "Google Analytics, Search Console, Sitemap", valor: 500 },
    { id: "5", descricao: "Deploy + Manutenção 30d", detalhes: "Vercel + suporte técnico", valor: 500 },
  ],
  "E-commerce": [
    { id: "1", descricao: "Design E-commerce", detalhes: "Catálogo, carrinho, checkout", valor: 2500 },
    { id: "2", descricao: "Desenvolvimento Full-Stack", detalhes: "Next.js + API + banco de dados", valor: 5000 },
    { id: "3", descricao: "Gateway de pagamento", detalhes: "Mercado Pago / Stripe integrado", valor: 1500 },
    { id: "4", descricao: "Painel administrativo", detalhes: "CRUD produtos, pedidos, relatórios", valor: 2000 },
    { id: "5", descricao: "Deploy + Infra", detalhes: "Vercel + DB + Storage", valor: 800 },
  ],
  "Web App": [
    { id: "1", descricao: "Prototipação UX", detalhes: "Wireframes, fluxos de usuário", valor: 2000 },
    { id: "2", descricao: "Frontend React/Next.js", detalhes: "Interface interativa, responsiva", valor: 4000 },
    { id: "3", descricao: "Backend + API", detalhes: "Node.js, Prisma, PostgreSQL", valor: 5000 },
    { id: "4", descricao: "Autenticação + Segurança", detalhes: "NextAuth, RBAC, criptografia", valor: 1500 },
    { id: "5", descricao: "Testes + QA", detalhes: "Unitários, E2E, cross-browser", valor: 1000 },
    { id: "6", descricao: "Deploy + CI/CD", detalhes: "Docker, Vercel, GitHub Actions", valor: 800 },
  ],
};

// ─── Gerador de ID ────────────────────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 9);

// ─── Propostas salvas (in-memory + localStorage) ─────────────────────────────
const STORAGE_KEY = "eb-propostas";

function loadPropostas(): Proposta[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function savePropostas(propostas: Proposta[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(propostas));
}

export default function PropostasPage() {
  const [propostas, setPropostas] = useState<Proposta[]>(() => loadPropostas());
  const [editando, setEditando] = useState<Proposta | null>(null);
  const [previewAberto, setPreviewAberto] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // ─── Nova Proposta ──────────────────────────────────────────────────────
  const novaProposta = useCallback((): Proposta => ({
    id: genId(),
    clienteNome: "",
    clienteEmail: "",
    clienteTelefone: "",
    clienteEmpresa: "",
    titulo: "",
    descricao: "",
    itens: [{ id: genId(), descricao: "", detalhes: "", valor: 0 }],
    desconto: 0,
    prazoEstimado: "2-4 semanas",
    validade: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    observacoes: "",
    criadaEm: new Date().toISOString(),
    status: "rascunho",
  }), []);

  // ─── Handlers ──────────────────────────────────────────────────────────
  const update = (key: keyof Proposta, value: unknown) => {
    if (!editando) return;
    setEditando({ ...editando, [key]: value });
  };

  const addItem = () => {
    if (!editando) return;
    setEditando({
      ...editando,
      itens: [...editando.itens, { id: genId(), descricao: "", detalhes: "", valor: 0 }],
    });
  };

  const removeItem = (id: string) => {
    if (!editando) return;
    setEditando({ ...editando, itens: editando.itens.filter((i) => i.id !== id) });
  };

  const updateItem = (id: string, key: keyof ItemProposta, value: string | number) => {
    if (!editando) return;
    setEditando({
      ...editando,
      itens: editando.itens.map((i) => (i.id === id ? { ...i, [key]: value } : i)),
    });
  };

  const aplicarTemplate = (tipo: string) => {
    if (!editando) return;
    const itens = templateItens[tipo]?.map((i) => ({ ...i, id: genId() })) || [];
    setEditando({ ...editando, titulo: tipo, itens });
    toast.success(`Template "${tipo}" aplicado!`);
  };

  const salvarProposta = () => {
    if (!editando) return;
    const idx = propostas.findIndex((p) => p.id === editando.id);
    let novas: Proposta[];
    if (idx >= 0) {
      novas = [...propostas];
      novas[idx] = editando;
    } else {
      novas = [editando, ...propostas];
    }
    setPropostas(novas);
    savePropostas(novas);
    toast.success("Proposta salva!");
  };

  const deletarProposta = (id: string) => {
    const novas = propostas.filter((p) => p.id !== id);
    setPropostas(novas);
    savePropostas(novas);
    if (editando?.id === id) setEditando(null);
    toast.success("Proposta removida.");
  };

  const duplicarProposta = (p: Proposta) => {
    const nova = { ...p, id: genId(), criadaEm: new Date().toISOString(), status: "rascunho" as const };
    const novas = [nova, ...propostas];
    setPropostas(novas);
    savePropostas(novas);
    setEditando(nova);
    toast.success("Proposta duplicada!");
  };

  // ─── Cálculos ──────────────────────────────────────────────────────────
  const subtotal = editando ? editando.itens.reduce((s, i) => s + (i.valor || 0), 0) : 0;
  const descontoValor = editando ? (subtotal * (editando.desconto || 0)) / 100 : 0;
  const total = subtotal - descontoValor;

  // ─── Gerar PDF (print) ─────────────────────────────────────────────────
  const gerarPDF = () => {
    if (!previewRef.current) return;
    const content = previewRef.current.innerHTML;
    const win = window.open("", "_blank", "width=800,height=1000");
    if (!win) {
      toast.error("Permita pop-ups para gerar o PDF.");
      return;
    }
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Proposta - ${editando?.titulo || "EB Dev"}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; color: #1a1a2e; background: white; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #00f0ff; }
          .logo { font-size: 28px; font-weight: 900; color: #0a0a1a; }
          .logo span { color: #00f0ff; }
          .info { text-align: right; font-size: 12px; color: #666; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #00f0ff; margin-bottom: 12px; }
          h1 { font-size: 24px; margin-bottom: 8px; }
          .desc { color: #555; font-size: 14px; line-height: 1.6; }
          .client-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; }
          .client-grid dt { color: #888; } .client-grid dd { font-weight: 500; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th { background: #f5f5f5; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; border-bottom: 2px solid #ddd; }
          td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; }
          .valor { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
          .totais { margin-top: 20px; text-align: right; }
          .totais .row { display: flex; justify-content: flex-end; gap: 40px; padding: 6px 0; font-size: 14px; }
          .totais .total { font-size: 20px; font-weight: 900; color: #00f0ff; border-top: 2px solid #00f0ff; padding-top: 10px; margin-top: 10px; }
          .terms { font-size: 11px; color: #888; line-height: 1.6; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #aaa; }
          @media print { body { padding: 20px; } @page { margin: 1cm; } }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const statusBadge: Record<string, { variant: "default" | "gold" | "success" | "danger" | "info"; label: string }> = {
    rascunho: { variant: "default", label: "Rascunho" },
    enviada: { variant: "info", label: "Enviada" },
    aprovada: { variant: "success", label: "Aprovada" },
    recusada: { variant: "danger", label: "Recusada" },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Propostas</h2>
          <p className="text-dark-400 mt-1">
            Crie, gerencie e exporte propostas profissionais
          </p>
        </div>
        <Button
          variant="gold"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setEditando(novaProposta())}
        >
          Nova Proposta
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ═══ Lista de propostas ═══ */}
        <div className="space-y-3">
          <p className="text-xs text-dark-400 font-medium uppercase tracking-wider">
            Propostas ({propostas.length})
          </p>
          {propostas.length === 0 ? (
            <Card variant="glass">
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-dark-600 mx-auto mb-3" />
                <p className="text-sm text-dark-400">Nenhuma proposta ainda</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => setEditando(novaProposta())}
                >
                  Criar primeira
                </Button>
              </div>
            </Card>
          ) : (
            propostas.map((p) => (
              <div
                key={p.id}
                onClick={() => setEditando(p)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  editando?.id === p.id
                    ? "border-brand-500/40 bg-brand-500/5"
                    : "border-dark-700/50 bg-dark-800/30 hover:border-dark-600"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-white font-medium truncate flex-1">
                    {p.titulo || "Sem título"}
                  </p>
                  <Badge variant={statusBadge[p.status]?.variant || "default"} size="sm">
                    {statusBadge[p.status]?.label}
                  </Badge>
                </div>
                <p className="text-xs text-dark-500 truncate">{p.clienteNome || "Cliente não definido"}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-brand-400">
                    {fmt(p.itens.reduce((s, i) => s + (i.valor || 0), 0))}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); duplicarProposta(p); }}
                      className="p-1 text-dark-500 hover:text-brand-400 transition-colors"
                      title="Duplicar"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deletarProposta(p.id); }}
                      className="p-1 text-dark-500 hover:text-red-400 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ═══ Editor de proposta ═══ */}
        <div className="lg:col-span-2 space-y-6">
          {!editando ? (
            <Card variant="glass">
              <div className="text-center py-16">
                <FileText className="h-12 w-12 text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400">Selecione ou crie uma proposta</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Templates rápidos */}
              <div>
                <p className="text-xs text-dark-400 font-medium uppercase tracking-wider mb-2">
                  Templates rápidos
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(templateItens).map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => aplicarTemplate(tipo)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-dark-800 text-dark-300 border border-dark-700/50 hover:border-brand-500/30 hover:text-brand-400 transition-all"
                    >
                      <Package className="h-3 w-3 inline mr-1" />
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dados do cliente */}
              <Card variant="glass">
                <CardHeader title="Dados do Cliente" icon={<User className="h-5 w-5" />} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nome"
                    value={editando.clienteNome}
                    onChange={(e) => update("clienteNome", e.target.value)}
                    icon={<User className="h-4 w-4" />}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={editando.clienteEmail}
                    onChange={(e) => update("clienteEmail", e.target.value)}
                    icon={<Mail className="h-4 w-4" />}
                  />
                  <Input
                    label="Telefone"
                    value={editando.clienteTelefone}
                    onChange={(e) => update("clienteTelefone", e.target.value)}
                    icon={<Phone className="h-4 w-4" />}
                  />
                  <Input
                    label="Empresa"
                    value={editando.clienteEmpresa}
                    onChange={(e) => update("clienteEmpresa", e.target.value)}
                    icon={<Building className="h-4 w-4" />}
                  />
                </div>
              </Card>

              {/* Detalhes da proposta */}
              <Card variant="glass">
                <CardHeader title="Detalhes da Proposta" icon={<FileText className="h-5 w-5" />} />
                <div className="space-y-4">
                  <Input
                    label="Título"
                    value={editando.titulo}
                    onChange={(e) => update("titulo", e.target.value)}
                    placeholder="Ex: Desenvolvimento de Site Institucional"
                  />
                  <div>
                    <label className="block text-xs text-dark-400 mb-1.5 font-medium uppercase tracking-wider">
                      Descrição
                    </label>
                    <textarea
                      value={editando.descricao}
                      onChange={(e) => update("descricao", e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-dark-700 bg-dark-800/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-all resize-none"
                      placeholder="Breve descrição do escopo..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Prazo estimado"
                      value={editando.prazoEstimado}
                      onChange={(e) => update("prazoEstimado", e.target.value)}
                      icon={<Clock className="h-4 w-4" />}
                    />
                    <Input
                      label="Validade da proposta"
                      type="date"
                      value={editando.validade}
                      onChange={(e) => update("validade", e.target.value)}
                      icon={<Calendar className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </Card>

              {/* Itens / Escopo */}
              <Card variant="glass">
                <CardHeader title="Itens do Escopo" subtitle={`${editando.itens.length} itens`} icon={<CheckCircle className="h-5 w-5" />} />
                <div className="space-y-3">
                  {editando.itens.map((item, idx) => (
                    <div key={item.id} className="p-3 rounded-xl border border-dark-700/50 bg-dark-800/20 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-dark-500 font-mono w-6">{String(idx + 1).padStart(2, "0")}</span>
                        <input
                          value={item.descricao}
                          onChange={(e) => updateItem(item.id, "descricao", e.target.value)}
                          className="flex-1 bg-transparent text-sm text-white placeholder:text-dark-600 focus:outline-none"
                          placeholder="Descrição do item"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-dark-500">R$</span>
                          <input
                            type="number"
                            value={item.valor || ""}
                            onChange={(e) => updateItem(item.id, "valor", Number(e.target.value))}
                            className="w-24 bg-dark-700/50 rounded-lg px-2 py-1 text-sm text-white text-right focus:outline-none focus:ring-1 focus:ring-brand-500/30"
                            placeholder="0"
                          />
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-dark-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <input
                        value={item.detalhes}
                        onChange={(e) => updateItem(item.id, "detalhes", e.target.value)}
                        className="w-full bg-transparent text-xs text-dark-400 placeholder:text-dark-600 focus:outline-none pl-8"
                        placeholder="Detalhes adicionais..."
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    icon={<Plus className="h-4 w-4" />}
                    onClick={addItem}
                  >
                    Adicionar Item
                  </Button>
                </div>

                {/* Totais */}
                <div className="mt-6 pt-4 border-t border-dark-700/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Subtotal</span>
                    <span className="text-white font-medium">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-dark-400">Desconto</span>
                      <input
                        type="number"
                        value={editando.desconto || ""}
                        onChange={(e) => update("desconto", Number(e.target.value))}
                        className="w-16 bg-dark-700/50 rounded-lg px-2 py-0.5 text-xs text-white text-center focus:outline-none"
                        placeholder="0"
                        min={0}
                        max={100}
                      />
                      <span className="text-dark-500 text-xs">%</span>
                    </div>
                    <span className="text-red-400">- {fmt(descontoValor)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-dark-700/50">
                    <span className="text-white">Total</span>
                    <span className="text-brand-400">{fmt(total)}</span>
                  </div>
                </div>
              </Card>

              {/* Observações */}
              <Card variant="glass">
                <CardHeader title="Observações" icon={<Edit3 className="h-5 w-5" />} />
                <textarea
                  value={editando.observacoes}
                  onChange={(e) => update("observacoes", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-dark-700 bg-dark-800/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-all resize-none"
                  placeholder="Condições de pagamento, termos, etc..."
                />
              </Card>

              {/* Ações */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="gold"
                  size="sm"
                  icon={<Save className="h-4 w-4" />}
                  onClick={salvarProposta}
                >
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Eye className="h-4 w-4" />}
                  onClick={() => { salvarProposta(); setPreviewAberto(true); }}
                >
                  Preview & PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Send className="h-4 w-4" />}
                  onClick={() => {
                    update("status", "enviada");
                    toast.success("Status alterado para 'Enviada'");
                  }}
                >
                  Marcar Enviada
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══ Modal Preview / PDF ═══ */}
      {previewAberto && editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            {/* Toolbar */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b">
              <p className="text-sm font-bold text-gray-800">Preview da Proposta</p>
              <div className="flex gap-2">
                <button
                  onClick={gerarPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" /> Imprimir / PDF
                </button>
                <button
                  onClick={() => setPreviewAberto(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo do PDF */}
            <div ref={previewRef} className="p-10 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
              {/* Header */}
              <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, paddingBottom: 20, borderBottom: "3px solid #00f0ff" }}>
                <div>
                  <div className="logo" style={{ fontSize: 28, fontWeight: 900 }}>
                    EB<span style={{ color: "#00f0ff" }}>.</span>Dev
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                    Emmanuel Bezerra — Full-Stack Developer
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 12, color: "#666" }}>
                  <div>emmanuelbezerra.dev</div>
                  <div>admin@emmanuelbezerra.dev</div>
                  <div>(85) 99850-0344</div>
                  <div style={{ marginTop: 8, fontSize: 11, color: "#aaa" }}>
                    Emitida em: {new Date(editando.criadaEm).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>

              {/* Título */}
              <div className="section" style={{ marginBottom: 30 }}>
                <div className="section-title" style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#00f0ff", marginBottom: 12 }}>
                  Proposta Comercial
                </div>
                <h1 style={{ fontSize: 24, marginBottom: 8 }}>{editando.titulo}</h1>
                {editando.descricao && (
                  <p className="desc" style={{ color: "#555", fontSize: 14, lineHeight: 1.6 }}>
                    {editando.descricao}
                  </p>
                )}
              </div>

              {/* Cliente */}
              <div className="section" style={{ marginBottom: 30 }}>
                <div className="section-title" style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#00f0ff", marginBottom: 12 }}>
                  Cliente
                </div>
                <div className="client-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                  <div><span style={{ color: "#888" }}>Nome:</span> <strong>{editando.clienteNome}</strong></div>
                  <div><span style={{ color: "#888" }}>Email:</span> {editando.clienteEmail}</div>
                  {editando.clienteTelefone && <div><span style={{ color: "#888" }}>Telefone:</span> {editando.clienteTelefone}</div>}
                  {editando.clienteEmpresa && <div><span style={{ color: "#888" }}>Empresa:</span> {editando.clienteEmpresa}</div>}
                </div>
              </div>

              {/* Itens */}
              <div className="section" style={{ marginBottom: 30 }}>
                <div className="section-title" style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#00f0ff", marginBottom: 12 }}>
                  Escopo do Projeto
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ background: "#f5f5f5", textAlign: "left", padding: "10px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", borderBottom: "2px solid #ddd" }}>#</th>
                      <th style={{ background: "#f5f5f5", textAlign: "left", padding: "10px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", borderBottom: "2px solid #ddd" }}>Descrição</th>
                      <th style={{ background: "#f5f5f5", textAlign: "right", padding: "10px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#666", borderBottom: "2px solid #ddd" }}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editando.itens.map((item, i) => (
                      <tr key={item.id}>
                        <td style={{ padding: 12, borderBottom: "1px solid #eee", fontSize: 13, color: "#888" }}>{String(i + 1).padStart(2, "0")}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid #eee", fontSize: 13 }}>
                          <strong>{item.descricao}</strong>
                          {item.detalhes && <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{item.detalhes}</div>}
                        </td>
                        <td style={{ padding: 12, borderBottom: "1px solid #eee", fontSize: 13, textAlign: "right", fontWeight: 600 }}>{fmt(item.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: 20, textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 40, padding: "6px 0", fontSize: 14 }}>
                    <span style={{ color: "#888" }}>Subtotal</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  {editando.desconto > 0 && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 40, padding: "6px 0", fontSize: 14 }}>
                      <span style={{ color: "#888" }}>Desconto ({editando.desconto}%)</span>
                      <span style={{ color: "#e74c3c" }}>- {fmt(descontoValor)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 40, fontSize: 20, fontWeight: 900, color: "#00f0ff", borderTop: "2px solid #00f0ff", paddingTop: 10, marginTop: 10 }}>
                    <span>Total</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>
              </div>

              {/* Termos */}
              <div style={{ marginBottom: 30 }}>
                <div className="section-title" style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#00f0ff", marginBottom: 12 }}>
                  Informações
                </div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.8 }}>
                  <div>⏱ <strong>Prazo estimado:</strong> {editando.prazoEstimado}</div>
                  <div>📅 <strong>Validade:</strong> {new Date(editando.validade).toLocaleDateString("pt-BR")}</div>
                  {editando.observacoes && <div style={{ marginTop: 8 }}>📝 {editando.observacoes}</div>}
                </div>
              </div>

              {/* Footer */}
              <div style={{ marginTop: 40, textAlign: "center", fontSize: 11, color: "#aaa" }}>
                Emmanuel Bezerra — Desenvolvedor Full-Stack &middot; emmanuelbezerra.dev &middot; CNPJ/MEI
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Needed for Save button icon reference
function Save(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/>
      <path d="M7 3v4a1 1 0 0 0 1 1h7"/>
    </svg>
  );
}
