// ══════════════════════════════════════════════════════════════════════════════
// 👥 Admin — Gerenciamento de Clientes e Leads (localStorage + shared-project)
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import {
  loadClientes,
  addCliente,
  updateCliente,
  deleteCliente as removeCliente,
  getClienteStats,
  type Cliente,
  type ClienteStatus,
  type ClienteTipo,
} from "@/lib/shared-clientes";
import {
  loadProjects,
  updateProject,
  addMessage,
  addFile,
  genId,
  type ProjetoCliente,
  type ProjetoFase,
} from "@/lib/shared-project";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  FolderKanban,
  Star,
  MessageSquare,
  ArrowUpRight,
  Building,
  TrendingUp,
  Loader2,
  Edit,
  Trash2,
  ExternalLink,
  FileText,
  ClipboardList,
  Upload,
  CheckCircle2,
  Clock,
  Circle,
  Send,
} from "lucide-react";

const statusConfig: Record<ClienteStatus, { label: string; color: string }> = {
  ATIVO: { label: "Cliente Ativo", color: "text-emerald-400 bg-emerald-500/10" },
  LEAD: { label: "Lead", color: "text-brand-400 bg-brand-500/10" },
  PROSPECT: { label: "Prospect", color: "text-purple-400 bg-purple-500/10" },
  NEGOCIANDO: { label: "Negociando", color: "text-gold-400 bg-gold-500/10" },
  INATIVO: { label: "Inativo", color: "text-dark-500 bg-dark-700/30" },
  PERDIDO: { label: "Perdido", color: "text-red-400 bg-red-500/10" },
};

export default function ClientesPage() {
  /* ═══ State ═══════════════════════════════════════════════════════════════ */
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClienteStatus | "TODOS">("TODOS");
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [saving, setSaving] = useState(false);

  // Briefing state
  const [showBriefing, setShowBriefing] = useState(false);
  const [briefingCliente, setBriefingCliente] = useState<Cliente | null>(null);
  const [briefingProjeto, setBriefingProjeto] = useState<ProjetoCliente | null>(null);
  const [briefingTab, setBriefingTab] = useState<"fases" | "arquivos" | "mensagens">("fases");
  const [novaMensagem, setNovaMensagem] = useState("");

  // Form state
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    site: "",
    tipo: "PF" as ClienteTipo,
    status: "LEAD" as ClienteStatus,
    tags: "",
    notas: "",
    origemLead: "",
  });

  /* ═══ Carregar do localStorage ════════════════════════════════════════════ */
  useEffect(() => {
    setClientes(loadClientes());
    setLoaded(true);
  }, []);

  /* ═══ Filtros ═════════════════════════════════════════════════════════════ */
  const clientesFiltrados = clientes.filter((cliente) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !searchTerm ||
      cliente.nome.toLowerCase().includes(term) ||
      cliente.email.toLowerCase().includes(term) ||
      (cliente.empresa?.toLowerCase().includes(term) ?? false);
    const matchStatus = statusFilter === "TODOS" || cliente.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = getClienteStats(clientes);

  /* ═══ CRUD — persiste em localStorage ═════════════════════════════════════ */
  const salvarCliente = () => {
    if (!form.nome.trim() || !form.email.trim()) return;
    setSaving(true);
    try {
      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (editingCliente) {
        const updated = updateCliente(editingCliente.id, {
          nome: form.nome,
          email: form.email,
          telefone: form.telefone || null,
          empresa: form.empresa || null,
          site: form.site || null,
          tipo: form.tipo,
          status: form.status,
          tags: tagsArray,
          notas: form.notas || null,
          origemLead: form.origemLead || null,
          ultimoContato: new Date().toISOString().split("T")[0],
        });
        setClientes(updated);
        toast.success("Cliente atualizado!");
      } else {
        const novo: Cliente = {
          id: `cli-${Date.now()}`,
          nome: form.nome,
          email: form.email,
          telefone: form.telefone || null,
          empresa: form.empresa || null,
          site: form.site || null,
          tipo: form.tipo,
          status: form.status,
          faturamentoTotal: 0,
          rating: 0,
          tags: tagsArray,
          notas: form.notas || null,
          origemLead: form.origemLead || null,
          ultimoContato: new Date().toISOString().split("T")[0],
          createdAt: new Date().toISOString().split("T")[0],
          projetos: 0,
          propostas: 0,
        };
        const updated = addCliente(novo);
        setClientes(updated);
        toast.success("Cliente criado!");
      }
      setShowModal(false);
      setEditingCliente(null);
      resetForm();
    } catch {
      toast.error("Erro ao salvar cliente.");
    } finally {
      setSaving(false);
    }
  };

  const excluirCliente = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    const updated = removeCliente(id);
    setClientes(updated);
    toast.success("Cliente excluído.");
  };

  /* ═══ Helpers ═════════════════════════════════════════════════════════════ */
  const resetForm = () => {
    setForm({
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
      site: "",
      tipo: "PF",
      status: "LEAD",
      tags: "",
      notas: "",
      origemLead: "",
    });
  };

  const abrirEdicao = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setForm({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone || "",
      empresa: cliente.empresa || "",
      site: cliente.site || "",
      tipo: cliente.tipo,
      status: cliente.status,
      tags: (cliente.tags || []).join(", "),
      notas: cliente.notas || "",
      origemLead: cliente.origemLead || "",
    });
    setShowModal(true);
  };

  const enviarWhatsApp = (telefone: string) => {
    const numero = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numero}`, "_blank");
  };

  const formatarValor = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  /* ═══ Briefing (shared-project.ts) ═══════════════════════════════════════ */
  const abrirBriefing = (cliente: Cliente) => {
    setBriefingCliente(cliente);
    const projetos = loadProjects();
    const projeto = projetos.find(
      (p) =>
        p.clienteNome.toLowerCase() === cliente.nome.toLowerCase() ||
        p.clienteEmail?.toLowerCase() === cliente.email.toLowerCase()
    );
    if (projeto) {
      setBriefingProjeto({ ...projeto });
    } else {
      const novoProjeto: ProjetoCliente = {
        id: `PRJ-${Date.now()}`,
        name: `Projeto — ${cliente.nome}`,
        clienteNome: cliente.nome,
        clienteEmail: cliente.email,
        status: "in_progress",
        package: "Standard",
        startDate: new Date().toISOString().split("T")[0],
        expectedDelivery: "",
        progress: 0,
        investment: "A definir",
        paid: "R$ 0",
        remaining: "A definir",
        phases: [
          { id: 1, name: "Briefing & Discovery", status: "pending", date: "-", description: "Levantamento de requisitos" },
          { id: 2, name: "Wireframes & UX", status: "pending", date: "-", description: "Estrutura visual" },
          { id: 3, name: "Design Visual", status: "pending", date: "-", description: "Layout final" },
          { id: 4, name: "Desenvolvimento", status: "pending", date: "-", description: "Codificação" },
          { id: 5, name: "Testes & QA", status: "pending", date: "-", description: "Validação" },
          { id: 6, name: "Entrega Final", status: "pending", date: "-", description: "Deploy" },
        ],
        files: [],
        messages: [],
        nextSteps: ["Definir escopo do projeto"],
        accessCode: cliente.nome.split(" ")[0].toLowerCase(),
      };
      updateProject(novoProjeto);
      setBriefingProjeto(novoProjeto);
    }
    setBriefingTab("fases");
    setShowBriefing(true);
  };

  const atualizarFase = (faseId: number, novoStatus: ProjetoFase["status"]) => {
    if (!briefingProjeto) return;
    const updated = { ...briefingProjeto };
    updated.phases = updated.phases.map((f) =>
      f.id === faseId ? { ...f, status: novoStatus } : f
    );
    const completed = updated.phases.filter((f) => f.status === "completed").length;
    updated.progress = Math.round((completed / updated.phases.length) * 100);
    updateProject(updated);
    setBriefingProjeto({ ...updated });
    toast.success("Fase atualizada!");
  };

  const enviarMensagemBriefing = () => {
    if (!briefingProjeto || !novaMensagem.trim()) return;
    const msg = {
      id: genId(),
      from: "Emmanuel" as const,
      date: new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      message: novaMensagem.trim(),
    };
    addMessage(briefingProjeto.id, msg);
    setBriefingProjeto((prev) =>
      prev ? { ...prev, messages: [msg, ...prev.messages] } : prev
    );
    setNovaMensagem("");
    toast.success("Mensagem enviada!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!briefingProjeto || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const novoArquivo = {
        id: genId(),
        name: file.name,
        type: file.name.split(".").pop() || "file",
        size:
          file.size > 1048576
            ? `${(file.size / 1048576).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(0)} KB`,
        date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        uploadedBy: "admin" as const,
        url: reader.result as string,
      };
      addFile(briefingProjeto.id, novoArquivo);
      setBriefingProjeto((prev) =>
        prev ? { ...prev, files: [...prev.files, novoArquivo] } : prev
      );
      toast.success("Arquivo enviado!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ═══ Loading ═════════════════════════════════════════════════════════════ */
  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  /* ═══ Render ══════════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Clientes & Leads</h2>
          <p className="text-dark-400 mt-1">Gerencie seu funil de vendas e clientes</p>
        </div>
        <Button
          variant="gold"
          size="sm"
          onClick={() => {
            resetForm();
            setEditingCliente(null);
            setShowModal(true);
          }}
          icon={<Plus className="h-4 w-4" />}
        >
          Novo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card variant="glass">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-dark-400">Total</p>
            </div>
          </div>
        </Card>
        <Card variant="glass">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.ativos}</p>
              <p className="text-xs text-dark-400">Ativos</p>
            </div>
          </div>
        </Card>
        <Card variant="glass">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.leads}</p>
              <p className="text-xs text-dark-400">Leads</p>
            </div>
          </div>
        </Card>
        <Card variant="glass">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Building className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.prospects}</p>
              <p className="text-xs text-dark-400">Prospects</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="glass">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-500" />
            <Input
              placeholder="Buscar por nome, email ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["TODOS", "ATIVO", "LEAD", "PROSPECT", "NEGOCIANDO"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === st
                    ? "bg-brand-500 text-white"
                    : "bg-dark-800 text-dark-400 hover:bg-dark-700"
                }`}
              >
                {st === "TODOS" ? "Todos" : statusConfig[st].label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Lista de Clientes */}
      {clientesFiltrados.length === 0 ? (
        <Card variant="glass" className="text-center py-12">
          <Users className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 mb-4">Nenhum cliente encontrado</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              resetForm();
              setEditingCliente(null);
              setShowModal(true);
            }}
          >
            Adicionar Cliente
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clientesFiltrados.map((cliente) => (
            <Card
              key={cliente.id}
              variant="glass"
              className="hover:border-brand-500/30 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Avatar + Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {cliente.nome.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold truncate">{cliente.nome}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          statusConfig[cliente.status]?.color || "text-dark-400 bg-dark-700/30"
                        }`}
                      >
                        {statusConfig[cliente.status]?.label || cliente.status}
                      </span>
                      {cliente.tipo === "PJ" && (
                        <Badge variant="default" className="text-xs">
                          <Building className="h-3 w-3 mr-1" />
                          Empresa
                        </Badge>
                      )}
                    </div>
                    {cliente.empresa && (
                      <p className="text-sm text-dark-400 truncate">{cliente.empresa}</p>
                    )}
                    <div className="flex items-center gap-4 mt-1 text-xs text-dark-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {cliente.email}
                      </span>
                      {cliente.telefone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {cliente.telefone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Métricas */}
                <div className="flex items-center gap-6 lg:gap-8">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{cliente.projetos}</p>
                    <p className="text-xs text-dark-500">Projetos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-brand-400">
                      {formatarValor(Number(cliente.faturamentoTotal) || 0)}
                    </p>
                    <p className="text-xs text-dark-500">Faturado</p>
                  </div>
                  {cliente.rating > 0 && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-gold-400 flex items-center">
                        {cliente.rating}
                        <Star className="h-4 w-4 ml-1 fill-gold-400" />
                      </p>
                      <p className="text-xs text-dark-500">Rating</p>
                    </div>
                  )}
                  {cliente.ultimoContato && (
                    <div className="text-center hidden sm:block">
                      <p className="text-sm text-dark-300">
                        {new Date(cliente.ultimoContato).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-xs text-dark-500">Último contato</p>
                    </div>
                  )}
                </div>

                {/* Tags e Ações */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-wrap gap-1">
                    {cliente.tags?.map((tag) => (
                      <Badge key={tag} variant="default" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => abrirBriefing(cliente)}
                      className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors"
                      title="Ver Briefing"
                    >
                      <ClipboardList className="h-4 w-4" />
                    </button>
                    {cliente.telefone && (
                      <button
                        onClick={() => enviarWhatsApp(cliente.telefone!)}
                        className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-400 transition-colors"
                        title="Enviar WhatsApp"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => abrirEdicao(cliente)}
                      className="p-2 rounded-lg hover:bg-brand-500/10 text-brand-400 transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => excluirCliente(cliente.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pipeline Visual */}
      <Card variant="gradient">
        <CardHeader
          title="Pipeline de Vendas"
          subtitle="Visão do funil"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          {[
            { label: "Leads", count: stats.leads, color: "brand" },
            { label: "Prospects", count: stats.prospects, color: "purple" },
            { label: "Negociação", count: stats.negociando, color: "gold" },
            { label: "Fechados", count: stats.ativos, color: "emerald" },
          ].map((stage, i) => (
            <div
              key={stage.label}
              className={`p-4 rounded-xl border ${
                stage.color === "brand"
                  ? "border-brand-500/30 bg-brand-500/5"
                  : stage.color === "purple"
                  ? "border-purple-500/30 bg-purple-500/5"
                  : stage.color === "gold"
                  ? "border-gold-500/30 bg-gold-500/5"
                  : "border-emerald-500/30 bg-emerald-500/5"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-400">{stage.label}</span>
                <span
                  className={`text-xs font-medium ${
                    stage.color === "brand"
                      ? "text-brand-400"
                      : stage.color === "purple"
                      ? "text-purple-400"
                      : stage.color === "gold"
                      ? "text-gold-400"
                      : "text-emerald-400"
                  }`}
                >
                  {stage.count}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{stage.count}</p>
              {i < 3 && (
                <div className="mt-2">
                  <ArrowUpRight
                    className={`h-4 w-4 ${
                      stage.color === "brand"
                        ? "text-brand-400"
                        : stage.color === "purple"
                        ? "text-purple-400"
                        : "text-gold-400"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* ═══ Modal Criar/Editar Cliente ══════════════════════════════════════ */}
      <Modal
        open={showModal}
        onOpenChange={(v) => {
          if (!v) {
            setShowModal(false);
            setEditingCliente(null);
            resetForm();
          }
        }}
        title={editingCliente ? "Editar Cliente" : "Novo Cliente"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Nome *</label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome do cliente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Email *</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Telefone</label>
              <Input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                placeholder="(85) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Empresa</label>
              <Input
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Site</label>
            <Input
              value={form.site}
              onChange={(e) => setForm({ ...form, site: e.target.value })}
              placeholder="www.exemplo.com.br"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as ClienteTipo })}
                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="PF">Pessoa Física</option>
                <option value="PJ">Pessoa Jurídica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ClienteStatus })}
                className="w-full h-10 bg-dark-800 border border-dark-700 rounded-xl px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="LEAD">Lead</option>
                <option value="PROSPECT">Prospect</option>
                <option value="NEGOCIANDO">Negociando</option>
                <option value="ATIVO">Cliente Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="PERDIDO">Perdido</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Origem do Lead</label>
              <Input
                value={form.origemLead}
                onChange={(e) => setForm({ ...form, origemLead: e.target.value })}
                placeholder="Ex: Google, Instagram, Indicação..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Tags (separar por vírgula)</label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Premium, E-commerce, Saúde..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Notas</label>
            <textarea
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              placeholder="Observações sobre o cliente..."
              rows={3}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingCliente(null);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={salvarCliente}
              loading={saving}
              disabled={!form.nome || !form.email || saving}
            >
              {editingCliente ? "Salvar Alterações" : "Criar Cliente"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ═══ Modal de Briefing ═══════════════════════════════════════════════ */}
      <Modal
        open={showBriefing}
        onOpenChange={(v) => {
          if (!v) {
            setShowBriefing(false);
            setBriefingCliente(null);
            setBriefingProjeto(null);
          }
        }}
        title={briefingCliente ? `Briefing — ${briefingCliente.nome}` : "Briefing"}
        size="full"
      >
        {briefingProjeto && (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Resumo rápido */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-dark-800/50 rounded-xl p-3 text-center">
                <p className="text-xs text-dark-400">Progresso</p>
                <p className="text-xl font-bold text-brand-400">{briefingProjeto.progress}%</p>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-3 text-center">
                <p className="text-xs text-dark-400">Investimento</p>
                <p className="text-sm font-bold text-white">{briefingProjeto.investment}</p>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-3 text-center">
                <p className="text-xs text-dark-400">Pago</p>
                <p className="text-sm font-bold text-emerald-400">{briefingProjeto.paid}</p>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-3 text-center">
                <p className="text-xs text-dark-400">Código Acesso</p>
                <p className="text-sm font-bold text-gold-400">{briefingProjeto.accessCode}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-dark-700 pb-2">
              {(
                [
                  { key: "fases" as const, label: "Fases", icon: <FolderKanban className="h-4 w-4" /> },
                  { key: "arquivos" as const, label: "Arquivos", icon: <FileText className="h-4 w-4" /> },
                  { key: "mensagens" as const, label: "Mensagens", icon: <MessageSquare className="h-4 w-4" /> },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setBriefingTab(tab.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    briefingTab === tab.key
                      ? "bg-brand-500 text-white"
                      : "text-dark-400 hover:bg-dark-800"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Fases */}
            {briefingTab === "fases" && (
              <div className="space-y-3">
                {briefingProjeto.phases.map((fase) => (
                  <div
                    key={fase.id}
                    className="flex items-center gap-3 bg-dark-800/40 rounded-xl p-3"
                  >
                    <div className="flex-shrink-0">
                      {fase.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : fase.status === "in_progress" ? (
                        <Clock className="h-5 w-5 text-brand-400 animate-pulse" />
                      ) : (
                        <Circle className="h-5 w-5 text-dark-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm ${
                          fase.status === "completed"
                            ? "text-emerald-300"
                            : fase.status === "in_progress"
                            ? "text-white"
                            : "text-dark-400"
                        }`}
                      >
                        {fase.name}
                      </p>
                      <p className="text-xs text-dark-500">
                        {fase.description} · {fase.date}
                      </p>
                    </div>
                    <select
                      value={fase.status}
                      onChange={(e) =>
                        atualizarFase(fase.id, e.target.value as ProjetoFase["status"])
                      }
                      className="bg-dark-700 border border-dark-600 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="pending">Pendente</option>
                      <option value="in_progress">Em Progresso</option>
                      <option value="completed">Concluído</option>
                    </select>
                  </div>
                ))}

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-dark-400 mb-1">
                    <span>Progresso Geral</span>
                    <span className="text-brand-400 font-bold">{briefingProjeto.progress}%</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${briefingProjeto.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Arquivos */}
            {briefingTab === "arquivos" && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-dark-600 hover:border-brand-500 cursor-pointer transition-colors">
                  <Upload className="h-5 w-5 text-brand-400" />
                  <span className="text-sm text-dark-300">Enviar novo arquivo</span>
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
                {briefingProjeto.files.length === 0 && (
                  <p className="text-sm text-dark-500 text-center py-4">Nenhum arquivo ainda</p>
                )}
                {briefingProjeto.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 bg-dark-800/40 rounded-xl p-3"
                  >
                    <FileText className="h-5 w-5 text-brand-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-dark-500">
                        {file.size} · {file.date} · por{" "}
                        {file.uploadedBy === "admin" ? "Emmanuel" : "Cliente"}
                      </p>
                    </div>
                    {file.url && (
                      <a
                        href={file.url}
                        download={file.name}
                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-brand-400" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Mensagens */}
            {briefingTab === "mensagens" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && enviarMensagemBriefing()}
                    placeholder="Escreva uma mensagem..."
                    className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                  <button
                    onClick={enviarMensagemBriefing}
                    disabled={!novaMensagem.trim()}
                    className="p-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                {briefingProjeto.messages.length === 0 && (
                  <p className="text-sm text-dark-500 text-center py-4">Nenhuma mensagem ainda</p>
                )}
                {briefingProjeto.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-xl p-3 ${
                      msg.from === "Emmanuel"
                        ? "bg-brand-500/10 border border-brand-500/20 ml-4"
                        : "bg-dark-800/60 border border-dark-700 mr-4"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium ${
                          msg.from === "Emmanuel" ? "text-brand-400" : "text-purple-400"
                        }`}
                      >
                        {msg.from}
                      </span>
                      <span className="text-xs text-dark-500">{msg.date}</span>
                    </div>
                    <p className="text-sm text-dark-200">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
