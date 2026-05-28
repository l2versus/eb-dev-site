// ══════════════════════════════════════════════════════════════════════════════
// 👥 Admin — Gerenciamento de Clientes e Leads (Prisma API)
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
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

const genId = () => Math.random().toString(36).slice(2, 10);

// ─── Types (compatíveis com Prisma schema) ──────────────────────────────────
type ClienteStatus = "ATIVO" | "LEAD" | "PROSPECT" | "NEGOCIANDO" | "INATIVO" | "PERDIDO";
type ClienteTipo = "PF" | "PJ";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  empresa: string | null;
  site: string | null;
  tipo: ClienteTipo;
  status: ClienteStatus;
  faturamentoTotal: string | number;
  rating: number;
  tags: string[];
  notas: string | null;
  origemLead: string | null;
  ultimoContato: string | null;
  createdAt: string;
  totalProjetos?: number;
  totalPropostas?: number;
}

type ProjetoFaseStatus = "pending" | "in_progress" | "completed";

interface ProjetoFase {
  id: number;
  name: string;
  status: ProjetoFaseStatus;
  date: string;
  description: string;
}

interface BriefingFile {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  uploadedBy: "admin" | "cliente";
  url?: string;
}

interface BriefingMessage {
  id: string;
  from: "Emmanuel" | "Cliente";
  date: string;
  message: string;
}

interface ProjetoCliente {
  id: string;
  name: string;
  clienteNome: string;
  clienteEmail: string;
  status: string;
  package: string;
  startDate: string;
  expectedDelivery: string;
  progress: number;
  investment: string;
  paid: string;
  remaining: string;
  phases: ProjetoFase[];
  files: BriefingFile[];
  messages: BriefingMessage[];
  nextSteps: string[];
  accessCode: string;
}

interface ProjetoApi {
  id: string;
  titulo: string;
  clienteNome: string;
  clienteEmail: string;
  status: string;
  valor: number;
  progresso: number;
  prazo: string;
}

function buildPhases(progress: number): ProjetoFase[] {
  const steps = [
    ["Briefing & Discovery", "Levantamento de requisitos"],
    ["Wireframes & UX", "Estrutura visual"],
    ["Design Visual", "Layout final"],
    ["Desenvolvimento", "Codificacao"],
    ["Testes & QA", "Validacao"],
    ["Entrega Final", "Deploy"],
  ];
  const completedUntil = Math.floor((progress / 100) * steps.length);

  return steps.map(([name, description], index) => ({
    id: index + 1,
    name,
    status:
      index < completedUntil
        ? "completed"
        : index === completedUntil && progress < 100
        ? "in_progress"
        : "pending",
    date: "-",
    description,
  }));
}

function projetoApiToBriefing(projeto: ProjetoApi, cliente: Cliente): ProjetoCliente {
  return {
    id: projeto.id,
    name: projeto.titulo,
    clienteNome: projeto.clienteNome || cliente.nome,
    clienteEmail: projeto.clienteEmail || cliente.email,
    status: projeto.status,
    package: "Standard",
    startDate: new Date().toISOString().split("T")[0],
    expectedDelivery: projeto.prazo ? new Date(projeto.prazo).toISOString().split("T")[0] : "",
    progress: projeto.progresso || 0,
    investment: formatarMoeda(projeto.valor || 0),
    paid: "R$ 0,00",
    remaining: formatarMoeda(projeto.valor || 0),
    phases: buildPhases(projeto.progresso || 0),
    files: [],
    messages: [],
    nextSteps: ["Definir proxima entrega"],
    accessCode: cliente.nome.split(" ")[0].toLowerCase(),
  };
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

function getClienteStats(clientes: Cliente[]) {
  return {
    total: clientes.length,
    ativos: clientes.filter((c) => c.status === "ATIVO").length,
    leads: clientes.filter((c) => c.status === "LEAD").length,
    prospects: clientes.filter((c) => c.status === "PROSPECT").length,
    negociando: clientes.filter((c) => c.status === "NEGOCIANDO").length,
    faturamentoTotal: clientes.reduce((acc, c) => acc + (Number(c.faturamentoTotal) || 0), 0),
  };
}

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

  /* ═══ Carregar da API Prisma ══════════════════════════════════════════════ */
  const fetchClientes = useCallback(async (search?: string, status?: string) => {
    try {
      const params = new URLSearchParams();
      const s = status ?? statusFilter;
      const q = search ?? searchTerm;
      if (s !== "TODOS") params.set("status", s);
      if (q) params.set("search", q);
      const res = await fetch(`/api/clientes?${params.toString()}`);
      if (!res.ok) throw new Error("Erro ao buscar clientes");
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar clientes.");
    } finally {
      setLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carregar inicial + quando muda filtro de status
  useEffect(() => {
    fetchClientes(searchTerm, statusFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Debounce para busca por texto
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClientes(searchTerm, statusFilter);
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  /* ═══ Filtros (feitos pela API via searchTerm/statusFilter) ═════════════ */
  const clientesFiltrados = clientes;

  const stats = getClienteStats(clientes);

  /* ═══ CRUD — persiste via API Prisma ══════════════════════════════════════ */
  const salvarCliente = async () => {
    if (!form.nome.trim() || !form.email.trim()) return;
    setSaving(true);
    try {
      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const body = {
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
      };

      if (editingCliente) {
        const res = await fetch(`/api/clientes/${editingCliente.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, rating: editingCliente.rating }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erro ao atualizar");
        }
        toast.success("Cliente atualizado!");
      } else {
        const res = await fetch("/api/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erro ao criar");
        }
        toast.success("Cliente criado!");
      }

      setShowModal(false);
      setEditingCliente(null);
      resetForm();
      await fetchClientes();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar cliente.");
    } finally {
      setSaving(false);
    }
  };

  const excluirCliente = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
      toast.success("Cliente excluído.");
      await fetchClientes();
    } catch {
      toast.error("Erro ao excluir cliente.");
    }
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

  /* ═══ Briefing conectado ao PostgreSQL via /api/projetos ════════════════ */
  const abrirBriefing = async (cliente: Cliente) => {
    setBriefingCliente(cliente);

    try {
      const res = await fetch("/api/projetos");
      if (!res.ok) throw new Error("Erro ao carregar projetos");
      const projetos = (await res.json()) as ProjetoApi[];
      let projeto = projetos.find(
        (p) =>
          p.clienteNome.toLowerCase() === cliente.nome.toLowerCase() ||
          p.clienteEmail?.toLowerCase() === cliente.email.toLowerCase(),
      );

      if (!projeto) {
        const createRes = await fetch("/api/projetos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: `Projeto - ${cliente.nome}`,
            descricao: cliente.notas || "Briefing criado pelo CRM.",
            clienteNome: cliente.nome,
            clienteEmail: cliente.email,
            status: "briefing",
            prioridade: "media",
            valor: 0,
            progresso: 0,
            tags: ["CRM"],
          }),
        });
        if (!createRes.ok) throw new Error("Erro ao criar projeto do cliente");
        projeto = await createRes.json();
      }

      if (!projeto) throw new Error("Projeto nao encontrado");
      setBriefingProjeto(projetoApiToBriefing(projeto, cliente));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao abrir briefing");
      setBriefingProjeto(null);
    }

    setBriefingTab("fases");
    setShowBriefing(true);
  };

  const atualizarFase = async (faseId: number, novoStatus: ProjetoFaseStatus) => {
    if (!briefingProjeto) return;
    const updated = { ...briefingProjeto };
    updated.phases = updated.phases.map((f) =>
      f.id === faseId ? { ...f, status: novoStatus } : f
    );
    const completed = updated.phases.filter((f) => f.status === "completed").length;
    updated.progress = Math.round((completed / updated.phases.length) * 100);
    setBriefingProjeto({ ...updated });

    const status =
      updated.progress >= 100
        ? "entregue"
        : updated.progress >= 80
        ? "revisao"
        : updated.progress >= 45
        ? "desenvolvimento"
        : updated.progress >= 20
        ? "design"
        : "briefing";

    try {
      const res = await fetch("/api/projetos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: updated.id, progresso: updated.progress, status }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar fase");
      toast.success("Fase atualizada no banco!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar fase");
    }
  };

  const enviarMensagemBriefing = async () => {
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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId: briefingCliente?.id,
          conteudo: novaMensagem.trim(),
          remetente: "admin",
          remetenteNome: "Emmanuel",
        }),
      });
      if (!res.ok) throw new Error("Erro ao enviar mensagem");
      setBriefingProjeto((prev) =>
        prev ? { ...prev, messages: [msg, ...prev.messages] } : prev
      );
      setNovaMensagem("");
      toast.success("Mensagem salva no chat!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao enviar mensagem");
    }
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
      setBriefingProjeto((prev) =>
        prev ? { ...prev, files: [...prev.files, novoArquivo] } : prev
      );
      toast.info("Arquivo anexado nesta sessao. Storage permanente sera ligado ao proximo passo.");
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Clientes & Leads</h2>
          <p className="text-dark-400 text-sm mt-1">Gerencie seu funil de vendas e clientes</p>
        </div>
        <Button
          variant="gold"
          size="sm"
          className="w-full sm:w-auto sm:self-start"
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
      <Card variant="glass" padding="sm">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-500" />
            <Input
              placeholder="Buscar por nome, email ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {(["TODOS", "ATIVO", "LEAD", "PROSPECT", "NEGOCIANDO"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
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
              padding="sm"
              className="hover:border-brand-500/30 transition-all"
            >
              <div className="space-y-3">
                {/* Avatar + Info + Status */}
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-linear-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-lg shrink-0">
                    {cliente.nome.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base text-white font-semibold truncate">{cliente.nome}</h3>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] sm:text-xs font-medium ${
                          statusConfig[cliente.status]?.color || "text-dark-400 bg-dark-700/30"
                        }`}
                      >
                        {statusConfig[cliente.status]?.label || cliente.status}
                      </span>
                    </div>
                    {cliente.tipo === "PJ" && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Badge variant="default" className="text-[10px]">
                          <Building className="h-3 w-3 mr-1" />
                          Empresa
                        </Badge>
                      </div>
                    )}
                    {cliente.empresa && (
                      <p className="text-xs sm:text-sm text-dark-400 truncate">{cliente.empresa}</p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs text-dark-500">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{cliente.email}</span>
                      </span>
                      {cliente.telefone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 shrink-0" />
                          {cliente.telefone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Métricas + Ações - mobile-first row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-dark-800/50">
                  <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto">
                    <div className="text-center shrink-0">
                      <p className="text-sm sm:text-lg font-bold text-white">{cliente.totalProjetos ?? 0}</p>
                      <p className="text-[10px] text-dark-500">Projetos</p>
                    </div>
                    <div className="text-center shrink-0">
                      <p className="text-sm sm:text-lg font-bold text-brand-400">
                        {formatarValor(Number(cliente.faturamentoTotal) || 0)}
                      </p>
                      <p className="text-[10px] text-dark-500">Faturado</p>
                    </div>
                    {cliente.rating > 0 && (
                      <div className="text-center shrink-0">
                        <p className="text-sm sm:text-lg font-bold text-gold-400 flex items-center">
                          {cliente.rating}
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 ml-1 fill-gold-400" />
                        </p>
                        <p className="text-[10px] text-dark-500">Rating</p>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => void abrirBriefing(cliente)}
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
      <Card variant="gradient" padding="sm">
        <CardHeader
          title="Pipeline de Vendas"
          subtitle="Visão do funil"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
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
                        void atualizarFase(fase.id, e.target.value as ProjetoFaseStatus)
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void enviarMensagemBriefing();
                    }}
                    placeholder="Escreva uma mensagem..."
                    className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                  <button
                    onClick={() => void enviarMensagemBriefing()}
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
