"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Columns3,
  Copy,
  Edit3,
  ExternalLink,
  FileText,
  Flame,
  Gauge,
  Inbox,
  Link2,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  Pause,
  Phone,
  Play,
  Plus,
  Power,
  RefreshCw,
  Save,
  Search,
  Send,
  SendHorizontal,
  Settings2,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Trash2,
  UserRound,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";

type ClienteStatus = "LEAD" | "PROSPECT" | "NEGOCIANDO" | "ATIVO" | "INATIVO" | "PERDIDO";
type ClienteTipo = "PF" | "PJ";
type ViewMode = "pipeline" | "dashboard" | "inbox" | "envios" | "templates" | "webhooks" | "bots" | "whatsapp";

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

interface EvolutionSnapshot {
  config?: {
    configured: boolean;
    source: string;
    instance: string;
    apiUrlConfigured: boolean;
    apiKeyConfigured: boolean;
    apiUrlPreview?: string;
  };
  state?: {
    configured: boolean;
    instance: string;
    state: string;
    source: string;
    error?: string;
  };
}

const stages: Array<{
  status: ClienteStatus;
  title: string;
  subtitle: string;
  accent: string;
  icon: string;
}> = [
  { status: "LEAD", title: "Novos", subtitle: "Entrada", accent: "#3b82f6", icon: "01" },
  { status: "PROSPECT", title: "Contactados", subtitle: "Fit validado", accent: "#06b6d4", icon: "02" },
  { status: "NEGOCIANDO", title: "Negociando", subtitle: "Proposta ativa", accent: "#f59e0b", icon: "03" },
  { status: "ATIVO", title: "Convertidos", subtitle: "Cliente", accent: "#10b981", icon: "04" },
  { status: "PERDIDO", title: "Perdidos", subtitle: "Reativar", accent: "#ef4444", icon: "05" },
];

const statusLabel: Record<ClienteStatus, string> = {
  LEAD: "Lead",
  PROSPECT: "Prospect",
  NEGOCIANDO: "Negociando",
  ATIVO: "Ativo",
  INATIVO: "Inativo",
  PERDIDO: "Perdido",
};

const sourceLabel: Record<string, string> = {
  "orcamento-site": "Site",
  "cadastro-site": "Cadastro",
  "admin-propostas": "Proposta",
  site: "Site",
  website: "Site",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  manual: "Manual",
};

const stageTemplates: Record<ClienteStatus, { id: string; title: string; body: string }> = {
  LEAD: {
    id: "entrada",
    title: "Boas-vindas",
    body:
      "Ola {nome}, aqui e o Emmanuel. Vi seu contato pelo site e ja consigo te orientar sobre o melhor caminho para captar clientes com uma presenca digital profissional. Qual nicho da sua agencia/negocio hoje?",
  },
  PROSPECT: {
    id: "qualificado",
    title: "Qualificacao",
    body:
      "Boa, {nome}. Para eu fechar um diagnostico certeiro, me manda: objetivo principal, publico-alvo, oferta e prazo ideal. Com isso eu te respondo com o caminho e uma estimativa.",
  },
  NEGOCIANDO: {
    id: "proposta",
    title: "Proposta aberta",
    body:
      "{nome}, montei o direcionamento do projeto. A ideia e transformar sua primeira dobra e seu funil em uma maquina de gerar conversa qualificada. Quer que eu te envie o orcamento por aqui?",
  },
  ATIVO: {
    id: "fechamento",
    title: "Fechamento",
    body:
      "{nome}, consigo reservar a janela de producao para seu projeto. Posso te mandar o proximo passo e as condicoes para iniciar?",
  },
  INATIVO: {
    id: "reativacao",
    title: "Reativacao",
    body:
      "Ola {nome}, passando para retomar nosso papo. Se ainda fizer sentido melhorar site, oferta ou funil, eu consigo te mostrar um plano objetivo ainda hoje.",
  },
  PERDIDO: {
    id: "reativacao",
    title: "Reativacao",
    body:
      "Ola {nome}, passando para retomar nosso papo. Se ainda fizer sentido melhorar site, oferta ou funil, eu consigo te mostrar um plano objetivo ainda hoje.",
  },
};

const defaultAutomation: Record<ClienteStatus, boolean> = {
  LEAD: false,
  PROSPECT: true,
  NEGOCIANDO: true,
  ATIVO: false,
  INATIVO: false,
  PERDIDO: false,
};

const tabs: Array<{ id: ViewMode; label: string; icon: ReactNode }> = [
  { id: "pipeline", label: "Pipeline", icon: <Columns3 className="h-4 w-4" /> },
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "inbox", label: "Inbox", icon: <Inbox className="h-4 w-4" /> },
  { id: "envios", label: "Envios", icon: <SendHorizontal className="h-4 w-4" /> },
  { id: "templates", label: "Templates", icon: <FileText className="h-4 w-4" /> },
  { id: "webhooks", label: "Webhooks", icon: <Link2 className="h-4 w-4" /> },
  { id: "bots", label: "Bots", icon: <Bot className="h-4 w-4" /> },
  { id: "whatsapp", label: "WhatsApp", icon: <Smartphone className="h-4 w-4" /> },
];

function money(value: number | string | null | undefined) {
  const number = Number(value || 0);
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function timeAgo(value: string | null | undefined) {
  if (!value) return "Sem contato";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Agora";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Ontem";
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}m`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function whatsappHref(telefone: string, message = "") {
  const digits = telefone.replace(/\D/g, "");
  const phone = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

function applyTemplate(message: string, cliente: Cliente) {
  return message.replace(/\{(\w+)\}/g, (_, key) => {
    const values: Record<string, string> = {
      nome: cliente.nome.split(" ")[0] || cliente.nome,
      empresa: cliente.empresa || "sua empresa",
      status: statusLabel[cliente.status],
    };
    return values[key] || "";
  });
}

function temperature(cliente: Cliente) {
  if (cliente.status === "ATIVO") return { label: "Ganho", color: "#10b981", icon: Star };
  if (cliente.status === "NEGOCIANDO" || Number(cliente.faturamentoTotal) > 0) {
    return { label: "Quente", color: "#f97316", icon: Flame };
  }
  if ((cliente.totalPropostas || 0) > 0 || cliente.status === "PROSPECT") {
    return { label: "Morno", color: "#facc15", icon: Target };
  }
  return { label: "Frio", color: "#3b82f6", icon: Sparkles };
}

function byStatus(clientes: Cliente[], status: ClienteStatus) {
  return clientes.filter((cliente) => cliente.status === status);
}

function payloadCliente(cliente: Cliente, overrides: Partial<Cliente> = {}) {
  const next = { ...cliente, ...overrides };
  return {
    nome: next.nome,
    email: next.email,
    telefone: next.telefone,
    empresa: next.empresa,
    site: next.site,
    tipo: next.tipo,
    status: next.status,
    tags: next.tags,
    notas: next.notas,
    origemLead: next.origemLead,
    rating: next.rating,
  };
}

function evolutionStateLabel(value: string) {
  const labels: Record<string, string> = {
    open: "Online",
    connected: "Online",
    connecting: "Conectando",
    not_configured: "Sem config",
    error: "Erro",
    close: "Offline",
    disconnected: "Offline",
  };

  return labels[value?.toLowerCase?.() || ""] || value || "Sem config";
}

export default function CrmPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Cliente | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);
  const [view, setView] = useState<ViewMode>("pipeline");
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [evolution, setEvolution] = useState<EvolutionSnapshot | null>(null);
  const [evolutionLoading, setEvolutionLoading] = useState(false);
  const [evolutionOutput, setEvolutionOutput] = useState<string>("");
  const [evolutionForm, setEvolutionForm] = useState({
    apiUrl: "",
    apiKey: "",
    instance: "emmanuel-crm",
    phone: "",
  });
  const [automation, setAutomation] = useState<Record<ClienteStatus, boolean>>(defaultAutomation);
  const [newLead, setNewLead] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    origemLead: "site",
    tags: "",
    notas: "",
  });

  const loadClientes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/clientes");
      if (!response.ok) throw new Error("Erro ao carregar CRM");
      setClientes(await response.json());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao carregar CRM");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEvolution = useCallback(async () => {
    setEvolutionLoading(true);
    try {
      const response = await fetch("/api/evolution");
      if (!response.ok) throw new Error("Erro ao consultar Evolution");
      const data = (await response.json()) as EvolutionSnapshot;
      setEvolution(data);
      setEvolutionForm((current) => ({
        ...current,
        instance: data.config?.instance || current.instance,
      }));
    } catch (error) {
      setEvolution({
        config: {
          configured: false,
          source: "empty",
          instance: "emmanuel-crm",
          apiUrlConfigured: false,
          apiKeyConfigured: false,
        },
        state: {
          configured: false,
          instance: "emmanuel-crm",
          state: "not_configured",
          source: "empty",
          error: error instanceof Error ? error.message : "Erro na Evolution API",
        },
      });
    } finally {
      setEvolutionLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClientes();
    void loadEvolution();
  }, [loadClientes, loadEvolution]);

  useEffect(() => {
    const raw = window.localStorage.getItem("eb-crm-automation");
    if (!raw) return;
    try {
      setAutomation({ ...defaultAutomation, ...JSON.parse(raw) });
    } catch {
      setAutomation(defaultAutomation);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("eb-crm-automation", JSON.stringify(automation));
  }, [automation]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clientes;
    return clientes.filter((cliente) =>
      [cliente.nome, cliente.email, cliente.telefone, cliente.empresa, cliente.origemLead, ...cliente.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [clientes, search]);

  const metrics = useMemo(() => {
    const active = clientes.filter((cliente) => cliente.status !== "PERDIDO" && cliente.status !== "INATIVO");
    const totalValue = clientes.reduce((sum, cliente) => sum + Number(cliente.faturamentoTotal || 0), 0);
    const proposals = clientes.reduce((sum, cliente) => sum + (cliente.totalPropostas || 0), 0);
    const won = clientes.filter((cliente) => cliente.status === "ATIVO").length;
    const rate = clientes.length ? Math.round((won / clientes.length) * 100) : 0;

    return { active: active.length, totalValue, proposals, rate };
  }, [clientes]);

  const hotLeads = useMemo(
    () =>
      clientes
        .filter((cliente) => cliente.status === "NEGOCIANDO" || (cliente.totalPropostas || 0) > 0)
        .slice(0, 8),
    [clientes]
  );

  const state = evolution?.state?.state || "not_configured";
  const connected = ["open", "connected"].includes(state);
  const backgroundImage = "/images/gsap-profile-code.png";

  const sendWhatsapp = useCallback(
    async (cliente: Cliente, message: string, templateId?: string) => {
      if (!cliente.telefone) {
        toast.error("Lead sem telefone.");
        return;
      }

      const finalMessage = applyTemplate(message, cliente).trim();
      if (!finalMessage) {
        toast.error("Mensagem vazia.");
        return;
      }

      setSendingId(cliente.id);
      try {
        const response = await fetch("/api/whatsapp-send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clienteId: cliente.id,
            telefone: cliente.telefone,
            nome: cliente.nome,
            empresa: cliente.empresa,
            mensagem: finalMessage,
            templateId,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Erro ao enviar WhatsApp");

        if (data.method === "redirect" && data.whatsappUrl) {
          window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
          toast.info(data.configured ? "Evolution falhou; abri WhatsApp Web." : "Evolution sem config; abri WhatsApp Web.");
        } else {
          toast.success("Mensagem enviada pela Evolution.");
        }

        await loadEvolution();
        await loadClientes();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao enviar WhatsApp");
      } finally {
        setSendingId(null);
      }
    },
    [loadClientes, loadEvolution]
  );

  const moveCliente = useCallback(
    async (cliente: Cliente, nextStatus: ClienteStatus) => {
      if (cliente.status === nextStatus) return;

      const optimistic = { ...cliente, status: nextStatus };
      setClientes((current) => current.map((item) => (item.id === cliente.id ? optimistic : item)));
      if (selected?.id === cliente.id) setSelected(optimistic);

      try {
        const response = await fetch(`/api/clientes/${cliente.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadCliente(cliente, { status: nextStatus })),
        });
        if (!response.ok) throw new Error("Nao foi possivel mover o lead");
        toast.success(`${cliente.nome} movido para ${statusLabel[nextStatus]}`);

        const template = stageTemplates[nextStatus];
        if (automation[nextStatus] && template && cliente.telefone) {
          await sendWhatsapp(optimistic, template.body, template.id);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao mover lead");
        void loadClientes();
      }
    },
    [automation, loadClientes, selected, sendWhatsapp]
  );

  const updateCliente = useCallback(
    async (cliente: Cliente, overrides: Partial<Cliente>) => {
      const updated = { ...cliente, ...overrides };
      setClientes((current) => current.map((item) => (item.id === cliente.id ? updated : item)));
      if (selected?.id === cliente.id) setSelected(updated);

      try {
        const response = await fetch(`/api/clientes/${cliente.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadCliente(cliente, overrides)),
        });
        if (!response.ok) throw new Error("Nao foi possivel salvar lead");
        toast.success("Lead atualizado.");
        await loadClientes();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar lead");
        void loadClientes();
      }
    },
    [loadClientes, selected]
  );

  const deleteCliente = useCallback(
    async (cliente: Cliente) => {
      setDeletingId(cliente.id);
      try {
        const response = await fetch(`/api/clientes/${cliente.id}`, { method: "DELETE" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Nao foi possivel excluir lead");

        setClientes((current) => current.filter((item) => item.id !== cliente.id));
        if (selected?.id === cliente.id) setSelected(null);
        toast.success("Lead excluido do banco.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao excluir lead");
      } finally {
        setDeletingId(null);
      }
    },
    [selected]
  );

  const createLead = async () => {
    if (!newLead.nome.trim() || !newLead.email.trim()) {
      toast.error("Nome e email sao obrigatorios.");
      return;
    }

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: newLead.nome,
          email: newLead.email,
          telefone: newLead.telefone || null,
          empresa: newLead.empresa || null,
          tipo: newLead.empresa ? "PJ" : "PF",
          status: "LEAD",
          tags: newLead.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          notas: newLead.notas || null,
          origemLead: newLead.origemLead || "manual",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Nao foi possivel criar lead");
      }

      setShowNewLead(false);
      setNewLead({ nome: "", email: "", telefone: "", empresa: "", origemLead: "site", tags: "", notas: "" });
      toast.success("Lead criado no banco.");
      await loadClientes();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar lead");
    }
  };

  const saveEvolution = async () => {
    setEvolutionLoading(true);
    try {
      const response = await fetch("/api/evolution", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evolutionForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao salvar Evolution");
      setEvolution(data);
      setEvolutionForm((current) => ({ ...current, apiKey: "" }));
      toast.success("Evolution API salva.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar Evolution");
    } finally {
      setEvolutionLoading(false);
    }
  };

  const runEvolutionAction = async (action: "status" | "connect" | "create" | "restart") => {
    setEvolutionLoading(true);
    setEvolutionOutput("");
    try {
      const response = await fetch("/api/evolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, phone: evolutionForm.phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro na Evolution API");
      setEvolutionOutput(JSON.stringify(data.data || data, null, 2));
      await loadEvolution();
      toast.success("Evolution respondeu.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro na Evolution API");
    } finally {
      setEvolutionLoading(false);
    }
  };

  return (
    <div className="-m-3 min-h-[calc(100vh-3.5rem)] overflow-x-hidden bg-[#050403] text-white sm:-m-4 lg:-m-8">
      <div className="relative min-h-[calc(100vh-3.5rem)]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={backgroundImage}
            alt=""
            className="h-full w-full object-cover object-right opacity-55 saturate-[0.95]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_24%,rgba(217,156,34,0.18),transparent_30%),linear-gradient(90deg,#050403_0%,rgba(5,4,3,0.82)_38%,rgba(5,4,3,0.5)_100%)]" />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1540px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <Link href="/admin" className="mb-4 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gold-400/25 bg-gold-400/10 text-gold-200">
                  <Target className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-black text-white sm:text-3xl">CRM - Pipeline de Vendas</h2>
                  <p className="mt-1 text-sm text-white/45">
                    {clientes.length} leads - {money(metrics.totalValue)} em pipeline
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-4 text-sm font-semibold text-white/70 backdrop-blur-xl transition hover:bg-white/10 hover:text-white">
                <Gauge className="h-4 w-4" />
                AI Score
              </button>
              <button
                type="button"
                onClick={() => setShowNewLead(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-red-500 px-5 text-sm font-black text-white shadow-[0_16px_40px_rgba(225,74,114,0.26)] transition hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                Novo Lead
              </button>
            </div>
          </header>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <Metric label="Leads ativos" value={String(metrics.active)} accent="#3b82f6" />
            <Metric label="Pipeline" value={money(metrics.totalValue)} accent="#d99c22" />
            <Metric label="Propostas" value={String(metrics.proposals)} accent="#a855f7" />
            <Metric label="Fechamento" value={`${metrics.rate}%`} accent="#10b981" />
            <Metric label="Evolution" value={evolutionStateLabel(state)} accent={connected ? "#10b981" : "#ef4444"} />
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-2 shadow-2xl shadow-black/20 backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setView(tab.id)}
                  className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition ${
                    view === tab.id
                      ? "bg-white/16 text-white shadow-inner"
                      : tab.id === "whatsapp"
                      ? "text-emerald-400 hover:bg-white/10"
                      : "text-white/45 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-2 text-xs text-white/65">
              <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400" : "bg-red-400"}`} />
              Instancia {evolution?.config?.instance || "emmanuel-crm"}
              <button onClick={() => void loadEvolution()} className="rounded-lg p-1.5 text-white/45 transition hover:bg-white/10 hover:text-white">
                <RefreshCw className={`h-3.5 w-3.5 ${evolutionLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {view === "pipeline" && (
            <PipelineView
              clientes={clientes}
              filtered={filtered}
              loading={loading}
              search={search}
              draggedId={draggedId}
              onSearch={setSearch}
              onDraggedId={setDraggedId}
              onMove={moveCliente}
              onSelect={setSelected}
            />
          )}

          {view === "dashboard" && <DashboardView clientes={clientes} metrics={metrics} />}
          {view === "inbox" && <InboxView clientes={filtered} onSelect={setSelected} />}
          {view === "envios" && (
            <EnviosView hotLeads={hotLeads} sendingId={sendingId} onSelectLead={setSelected} onSend={sendWhatsapp} />
          )}
          {view === "templates" && <TemplatesView automation={automation} onAutomationChange={setAutomation} />}
          {view === "webhooks" && <WebhooksView />}
          {view === "bots" && (
            <BotPanel
              automation={automation}
              onAutomationChange={setAutomation}
              hotLeads={hotLeads}
              onSelectLead={setSelected}
              onSend={sendWhatsapp}
              sendingId={sendingId}
            />
          )}
          {view === "whatsapp" && (
            <EvolutionPanel
              snapshot={evolution}
              form={evolutionForm}
              output={evolutionOutput}
              loading={evolutionLoading}
              onFormChange={setEvolutionForm}
              onSave={() => void saveEvolution()}
              onAction={(action) => void runEvolutionAction(action)}
            />
          )}
        </div>
      </div>

      {selected && (
        <LeadDrawer
          cliente={selected}
          sending={sendingId === selected.id}
          deleting={deletingId === selected.id}
          onClose={() => setSelected(null)}
          onMove={(status) => void moveCliente(selected, status)}
          onSend={(message, templateId) => void sendWhatsapp(selected, message, templateId)}
          onDelete={() => void deleteCliente(selected)}
          onSave={(overrides) => void updateCliente(selected, overrides)}
        />
      )}

      {showNewLead && (
        <NewLeadModal
          value={newLead}
          onChange={setNewLead}
          onClose={() => setShowNewLead(false)}
          onSave={() => void createLead()}
        />
      )}
    </div>
  );
}

function PipelineView({
  clientes,
  filtered,
  loading,
  search,
  draggedId,
  onSearch,
  onDraggedId,
  onMove,
  onSelect,
}: {
  clientes: Cliente[];
  filtered: Cliente[];
  loading: boolean;
  search: string;
  draggedId: string | null;
  onSearch: (value: string) => void;
  onDraggedId: (id: string | null) => void;
  onMove: (cliente: Cliente, status: ClienteStatus) => void;
  onSelect: (cliente: Cliente) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-2xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="font-black text-white">Emmanuel Bot</p>
              <p className="text-xs text-white/40">Qualifica leads de agencia, site e funil</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-400">Ativo</span>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-gold-400/30 bg-gold-400/10 px-4 text-sm font-bold text-gold-300">
              <Pause className="h-4 w-4" />
              Pausar
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Buscar lead..."
            className="h-11 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/28 focus:border-gold-400/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["Todos", "Quente", "Morno", "Frio"].map((label) => (
            <button key={label} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/55 hover:bg-white/10 hover:text-white">
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-3">
        <div className="flex min-h-[360px] min-w-max gap-3">
          {stages.map((stage) => {
            const stageLeads = byStatus(filtered, stage.status);

            return (
              <motion.section
                key={stage.status}
                layout
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  const cliente = clientes.find((item) => item.id === draggedId);
                  if (cliente) onMove(cliente, stage.status);
                  onDraggedId(null);
                }}
                className="w-[220px] shrink-0 overflow-hidden rounded-2xl border bg-black/30 backdrop-blur-xl"
                style={{ borderColor: `${stage.accent}55` }}
              >
                <div className="border-b border-white/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: stage.accent }} />
                      <div>
                        <h3 className="text-sm font-black text-white">{stage.title}</h3>
                        <p className="text-[10px] text-white/32">{stage.subtitle}</p>
                      </div>
                    </div>
                    <span className="rounded-lg px-2 py-1 text-xs font-black" style={{ background: `${stage.accent}18`, color: stage.accent }}>
                      {stageLeads.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 p-2">
                  {loading ? (
                    Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="h-24 animate-pulse rounded-xl bg-white/10" />
                    ))
                  ) : stageLeads.length === 0 ? (
                    <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-white/25">
                      Arraste leads aqui
                    </div>
                  ) : (
                    stageLeads.map((cliente) => (
                      <LeadCard
                        key={cliente.id}
                        cliente={cliente}
                        onSelect={() => onSelect(cliente)}
                        onDragStart={() => onDraggedId(cliente.id)}
                      />
                    ))
                  )}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardView({ clientes, metrics }: { clientes: Cliente[]; metrics: { active: number; totalValue: number; proposals: number; rate: number } }) {
  const maxCount = Math.max(1, ...stages.map((stage) => byStatus(clientes, stage.status).length));
  const hot = clientes.filter((cliente) => temperature(cliente).label === "Quente").length;
  const warm = clientes.filter((cliente) => temperature(cliente).label === "Morno").length;
  const cold = clientes.filter((cliente) => temperature(cliente).label === "Frio").length;

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <GlassPanel className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <MiniKpi label="Total leads" value={String(clientes.length)} accent="#ffffff" />
        <MiniKpi label="Ativos" value={String(metrics.active)} accent="#3b82f6" />
        <MiniKpi label="Convertidos" value={String(byStatus(clientes, "ATIVO").length)} accent="#10b981" />
        <MiniKpi label="Perdidos" value={String(byStatus(clientes, "PERDIDO").length)} accent="#ef4444" />
        <MiniKpi label="Conversao" value={`${metrics.rate}%`} accent="#facc15" />
        <MiniKpi label="Propostas" value={String(metrics.proposals)} accent="#a855f7" />
      </GlassPanel>

      <GlassPanel>
        <SectionTitle title="Temperatura dos leads" subtitle="Prioridade comercial por comportamento" />
        <ProgressRow label="Quente" value={hot} total={clientes.length} color="#f97316" />
        <ProgressRow label="Morno" value={warm} total={clientes.length} color="#facc15" />
        <ProgressRow label="Frio" value={cold} total={clientes.length} color="#3b82f6" />
      </GlassPanel>

      <GlassPanel className="xl:col-span-2">
        <SectionTitle title="Funil de conversao" subtitle="Distribuicao atual do Kanban" />
        <div className="mt-5 space-y-4">
          {stages.map((stage) => {
            const count = byStatus(clientes, stage.status).length;
            return (
              <div key={stage.status} className="grid grid-cols-[120px_1fr_44px] items-center gap-3">
                <span className="text-sm text-white/55">{stage.title}</span>
                <div className="h-3 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full rounded-full" style={{ width: `${Math.max(6, (count / maxCount) * 100)}%`, background: stage.accent }} />
                </div>
                <span className="text-right text-sm text-white/55">{count}</span>
              </div>
            );
          })}
        </div>
      </GlassPanel>
    </div>
  );
}

function InboxView({ clientes, onSelect }: { clientes: Cliente[]; onSelect: (cliente: Cliente) => void }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
      <GlassPanel className="space-y-2">
        <SectionTitle title="Inbox comercial" subtitle="Leads e conversas recentes" />
        {clientes.slice(0, 12).map((cliente) => (
          <button
            key={cliente.id}
            onClick={() => onSelect(cliente)}
            className="flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-black/20 p-3 text-left transition hover:bg-white/10"
          >
            <Avatar cliente={cliente} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-white">{cliente.nome}</p>
              <p className="truncate text-xs text-white/40">{cliente.notas || cliente.email}</p>
            </div>
            <span className="text-[11px] text-white/30">{timeAgo(cliente.ultimoContato || cliente.createdAt)}</span>
          </button>
        ))}
      </GlassPanel>
      <GlassPanel>
        <SectionTitle title="Atendimento" subtitle="Selecione um lead para abrir o drawer completo" />
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/35">
          As conversas do WhatsApp recebidas pelo webhook entram no modulo Chat e ficam vinculadas ao lead.
        </div>
      </GlassPanel>
    </div>
  );
}

function EnviosView({
  hotLeads,
  sendingId,
  onSelectLead,
  onSend,
}: {
  hotLeads: Cliente[];
  sendingId: string | null;
  onSelectLead: (cliente: Cliente) => void;
  onSend: (cliente: Cliente, message: string, templateId?: string) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <GlassPanel>
        <SectionTitle title="Central de envios" subtitle="Disparo manual via Evolution ou fallback WhatsApp Web" />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {hotLeads.length ? (
            hotLeads.map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-start gap-3">
                  <Avatar cliente={lead} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-white">{lead.nome}</p>
                    <p className="truncate text-xs text-white/40">{lead.empresa || lead.email}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSend(lead, stageTemplates.NEGOCIANDO.body, stageTemplates.NEGOCIANDO.id)}
                    disabled={!lead.telefone || sendingId === lead.id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-3 py-2 text-xs font-black text-black disabled:opacity-50"
                  >
                    {sendingId === lead.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Enviar
                  </button>
                  <button onClick={() => onSelectLead(lead)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10">
                    <ExternalLink className="h-4 w-4" />
                    Abrir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/35">
              Nenhum lead quente por enquanto.
            </div>
          )}
        </div>
      </GlassPanel>
      <GlassPanel>
        <SectionTitle title="Sequencia sugerida" subtitle="Cadencia para agencias" />
        <div className="mt-5 space-y-3">
          {["D0: diagnostico", "D1: prova e portfolio", "D3: proposta objetiva", "D7: reativacao"].map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-black text-gold-300">0{index + 1}</p>
              <p className="mt-1 text-sm font-bold text-white">{step}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

function TemplatesView({
  automation,
  onAutomationChange,
}: {
  automation: Record<ClienteStatus, boolean>;
  onAutomationChange: (value: Record<ClienteStatus, boolean>) => void;
}) {
  return (
    <GlassPanel>
      <SectionTitle title="Templates e automacoes" subtitle="Mensagens usadas pelo Kanban e pelo bot" />
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {stages.map((stage) => {
          const template = stageTemplates[stage.status];
          return (
            <div key={stage.status} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: stage.accent }}>
                    {stage.title}
                  </p>
                  <h3 className="mt-2 font-black text-white">{template.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onAutomationChange({ ...automation, [stage.status]: !automation[stage.status] })}
                  className={`h-7 w-12 rounded-full p-1 transition ${automation[stage.status] ? "bg-emerald-500" : "bg-white/15"}`}
                >
                  <span className={`block h-5 w-5 rounded-full bg-white transition ${automation[stage.status] ? "translate-x-5" : ""}`} />
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/55">{template.body}</p>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

function WebhooksView() {
  const webhookUrl = "https://www.ebdevelop.com.br/api/evolution/webhook";
  return (
    <GlassPanel>
      <SectionTitle title="Webhooks" subtitle="Entrada do bot comercial e Evolution API" />
      <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">Evolution webhook</p>
            <code className="mt-3 block break-all rounded-xl bg-black/35 px-4 py-3 text-sm text-white/80">{webhookUrl}</code>
          </div>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(webhookUrl);
              toast.success("Webhook copiado.");
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-bold text-white hover:bg-white/10"
          >
            <Copy className="h-4 w-4" />
            Copiar
          </button>
        </div>
      </div>
    </GlassPanel>
  );
}

function BotPanel({
  automation,
  onAutomationChange,
  hotLeads,
  onSelectLead,
  onSend,
  sendingId,
}: {
  automation: Record<ClienteStatus, boolean>;
  onAutomationChange: (value: Record<ClienteStatus, boolean>) => void;
  hotLeads: Cliente[];
  onSelectLead: (cliente: Cliente) => void;
  onSend: (cliente: Cliente, message: string, templateId?: string) => void;
  sendingId: string | null;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <TemplatesView automation={automation} onAutomationChange={onAutomationChange} />
      <EnviosView hotLeads={hotLeads} sendingId={sendingId} onSelectLead={onSelectLead} onSend={onSend} />
    </div>
  );
}

function EvolutionPanel({
  snapshot,
  form,
  output,
  loading,
  onFormChange,
  onSave,
  onAction,
}: {
  snapshot: EvolutionSnapshot | null;
  form: { apiUrl: string; apiKey: string; instance: string; phone: string };
  output: string;
  loading: boolean;
  onFormChange: (value: { apiUrl: string; apiKey: string; instance: string; phone: string }) => void;
  onSave: () => void;
  onAction: (action: "status" | "connect" | "create" | "restart") => void;
}) {
  const state = snapshot?.state?.state || "not_configured";
  const configured = Boolean(snapshot?.config?.configured);
  const connected = ["open", "connected"].includes(state);

  return (
    <div className="space-y-5">
      <GlassPanel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${connected ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-400" : "border-white/10 bg-white/5 text-white/35"}`}>
              {connected ? <Wifi className="h-6 w-6" /> : <WifiOff className="h-6 w-6" />}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">Conexao WhatsApp</p>
              <h3 className="mt-1 text-xl font-black text-white">Evolution API</h3>
              <p className="text-sm text-white/40">Instance: {snapshot?.config?.instance || "emmanuel-crm"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-black ${connected ? "text-emerald-400" : "text-red-300"}`}>
              {connected ? "Ativo" : evolutionStateLabel(state)}
            </span>
            <button
              onClick={() => onAction(configured ? "connect" : "status")}
              disabled={loading || !configured}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-5 text-sm font-black text-emerald-400 transition hover:bg-emerald-400/15 disabled:opacity-45"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
              Conectar WhatsApp
            </button>
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel>
          <SectionTitle title="Configurar instancia" subtitle="Salva no banco; env continua como fallback" />
          <div className="mt-5 grid gap-3">
            <Field label="Evolution API URL" value={form.apiUrl} onChange={(apiUrl) => onFormChange({ ...form, apiUrl })} placeholder={snapshot?.config?.apiUrlPreview || "https://evolution.seudominio.com"} />
            <Field label="API Key" value={form.apiKey} onChange={(apiKey) => onFormChange({ ...form, apiKey })} placeholder={snapshot?.config?.apiKeyConfigured ? "Chave ja salva; preencha para trocar" : "apikey"} />
            <Field label="Instance" value={form.instance} onChange={(instance) => onFormChange({ ...form, instance })} placeholder="emmanuel-crm" />
            <Field label="Telefone para parear/testar" value={form.phone} onChange={(phone) => onFormChange({ ...form, phone })} placeholder="5585998500344" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <ActionButton onClick={onSave} disabled={loading} icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}>
              Salvar
            </ActionButton>
            <ActionButton onClick={() => onAction("status")} disabled={loading} icon={<RefreshCw className="h-4 w-4" />}>
              Status
            </ActionButton>
            <ActionButton onClick={() => onAction("create")} disabled={loading || !configured} icon={<Plus className="h-4 w-4" />}>
              Criar instancia
            </ActionButton>
            <ActionButton onClick={() => onAction("connect")} disabled={loading || !configured} icon={<Play className="h-4 w-4" />}>
              Conectar QR
            </ActionButton>
          </div>
        </GlassPanel>

        <GlassPanel>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatusCard label="Estado" value={evolutionStateLabel(state)} ok={connected} />
            <StatusCard label="Origem" value={snapshot?.config?.source || "empty"} ok={configured} />
            <StatusCard label="Instance" value={snapshot?.config?.instance || "emmanuel-crm"} ok />
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Webhook do bot</p>
            <code className="mt-3 block break-all rounded-xl bg-black/35 px-4 py-3 text-sm text-white/80">
              https://www.ebdevelop.com.br/api/evolution/webhook
            </code>
          </div>
          {output && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-white/45">Resposta</p>
              <pre className="max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-5 text-white/55">{output}</pre>
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}

function LeadDrawer({
  cliente,
  sending,
  deleting,
  onClose,
  onMove,
  onSend,
  onDelete,
  onSave,
}: {
  cliente: Cliente;
  sending: boolean;
  deleting: boolean;
  onClose: () => void;
  onMove: (status: ClienteStatus) => void;
  onSend: (message: string, templateId?: string) => void;
  onDelete: () => void;
  onSave: (overrides: Partial<Cliente>) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notes, setNotes] = useState(cliente.notas || "");
  const defaultTemplate = stageTemplates[cliente.status];
  const [message, setMessage] = useState(defaultTemplate ? applyTemplate(defaultTemplate.body, cliente) : "");

  useEffect(() => {
    setNotes(cliente.notas || "");
    const template = stageTemplates[cliente.status];
    setMessage(template ? applyTemplate(template.body, cliente) : "");
  }, [cliente]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.aside
        initial={{ x: 480 }}
        animate={{ x: 0 }}
        exit={{ x: 480 }}
        onClick={(event) => event.stopPropagation()}
        className="h-full w-full max-w-[480px] overflow-y-auto border-l border-white/10 bg-[#070606]/95 p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-gold-400">Lead</p>
            <h3 className="mt-2 break-words text-2xl font-black text-white">{cliente.nome}</h3>
            <p className="text-sm text-white/40">{statusLabel[cliente.status]}</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-white/45 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          <Info icon={<Mail className="h-4 w-4" />} label="Email" value={cliente.email} />
          <Info icon={<Phone className="h-4 w-4" />} label="Telefone" value={cliente.telefone || "Nao informado"} />
          <Info icon={<Building2 className="h-4 w-4" />} label="Empresa" value={cliente.empresa || "Pessoa fisica"} />
          <Info icon={<CircleDollarSign className="h-4 w-4" />} label="Valor fechado" value={money(cliente.faturamentoTotal)} />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-black uppercase tracking-wider text-white/35">Mover para</p>
          <div className="grid grid-cols-2 gap-2">
            {stages.map((stage) => (
              <button
                key={stage.status}
                type="button"
                onClick={() => onMove(stage.status)}
                className="rounded-xl border px-3 py-2 text-left text-xs font-bold transition hover:bg-white/10"
                style={{
                  borderColor: cliente.status === stage.status ? stage.accent : "rgba(255,255,255,0.1)",
                  color: cliente.status === stage.status ? stage.accent : "rgba(255,255,255,0.72)",
                }}
              >
                {stage.title}
              </button>
            ))}
          </div>
        </div>

        <GlassInner title="Briefing / nota" icon={<Edit3 className="h-4 w-4" />}>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold-500/60"
          />
          <button onClick={() => onSave({ notas: notes })} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/10">
            <Save className="h-4 w-4" />
            Salvar nota
          </button>
        </GlassInner>

        <GlassInner title="WhatsApp / Evolution" icon={<MessageCircle className="h-4 w-4" />}>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm leading-6 text-white outline-none focus:border-gold-500/60"
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => onSend(message, defaultTemplate?.id)} disabled={!cliente.telefone || sending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-3 py-2 text-sm font-black text-black hover:bg-gold-400 disabled:opacity-50">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Enviar API
            </button>
            <a href={cliente.telefone ? whatsappHref(cliente.telefone, message) : "#"} target="_blank" rel="noreferrer" className={`inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/10 ${!cliente.telefone ? "pointer-events-none opacity-50" : ""}`}>
              <ArrowUpRight className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </GlassInner>

        <div className="mt-5 grid gap-2">
          <a href={`mailto:${cliente.email}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/10">
            <Mail className="h-4 w-4" />
            Enviar email
          </a>
          {confirmDelete ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm font-bold text-red-200">Excluir lead e vinculos comerciais?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => setConfirmDelete(false)} className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/10">
                  Cancelar
                </button>
                <button onClick={onDelete} disabled={deleting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-black text-white hover:bg-red-400 disabled:opacity-50">
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Excluir
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-500/10">
              <Trash2 className="h-4 w-4" />
              Excluir lead
            </button>
          )}
        </div>
      </motion.aside>
    </div>
  );
}

function LeadCard({ cliente, onSelect, onDragStart }: { cliente: Cliente; onSelect: () => void; onDragStart: () => void }) {
  const temp = temperature(cliente);
  const TempIcon = temp.icon;
  const tags = cliente.tags.filter(Boolean).slice(0, 2);

  return (
    <motion.article
      layout
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-grab rounded-xl border border-white/10 bg-[#080706]/85 p-3 shadow-xl transition hover:border-gold-400/35 active:cursor-grabbing"
    >
      <div className="flex items-start gap-3">
        <Avatar cliente={cliente} />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-black text-white">{cliente.nome}</h4>
          <p className="truncate text-[11px] text-white/36">{cliente.empresa || cliente.email}</p>
        </div>
      </div>
      {cliente.notas && <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-white/52">{cliente.notas}</p>}
      <div className="mt-3 flex flex-wrap gap-1">
        <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-black" style={{ background: `${temp.color}16`, color: temp.color }}>
          <TempIcon className="h-3 w-3" />
          {temp.label}
        </span>
        {tags.map((tag) => (
          <span key={tag} className="rounded-lg bg-white/8 px-2 py-1 text-[10px] text-white/50">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3 text-[11px] text-white/34">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3 w-3" />
          {timeAgo(cliente.ultimoContato || cliente.createdAt)}
        </span>
        <span>{sourceLabel[cliente.origemLead || ""] || cliente.origemLead || "Manual"}</span>
      </div>
    </motion.article>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-[11px] font-black uppercase tracking-wider text-white/52">{label}</span>
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
      </div>
      <p className="mt-3 truncate text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function MiniKpi({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[11px] font-black uppercase tracking-wider text-white/35">{label}</p>
      <p className="mt-3 text-2xl font-black" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function ProgressRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mt-4 grid grid-cols-[88px_1fr_64px] items-center gap-3">
      <span className="text-sm font-bold" style={{ color }}>
        {label}
      </span>
      <div className="h-3 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-right text-sm text-white/45">{value} ({pct}%)</span>
    </div>
  );
}

function GlassPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl ${className}`}>
      {children}
    </section>
  );
}

function GlassInner({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/35">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/40">{subtitle}</p>
    </div>
  );
}

function Avatar({ cliente }: { cliente: Cliente }) {
  const temp = temperature(cliente);
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-black" style={{ background: `${temp.color}18`, color: temp.color, border: `1px solid ${temp.color}33` }}>
      {initials(cliente.nome)}
    </div>
  );
}

function StatusCard({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs font-black uppercase tracking-wider text-white/35">{label}</p>
      <p className={`mt-2 truncate text-lg font-black ${ok ? "text-emerald-300" : "text-red-300"}`}>{value}</p>
    </div>
  );
}

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/35">
        {icon}
        {label}
      </div>
      <p className="mt-2 break-words text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function ActionButton({ children, icon, disabled, onClick }: { children: ReactNode; icon: ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-white transition hover:bg-white/10 disabled:opacity-45">
      {icon}
      {children}
    </button>
  );
}

function NewLeadModal({
  value,
  onChange,
  onClose,
  onSave,
}: {
  value: { nome: string; email: string; telefone: string; empresa: string; origemLead: string; tags: string; notas: string };
  onChange: (value: { nome: string; email: string; telefone: string; empresa: string; origemLead: string; tags: string; notas: string }) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const update = (key: keyof typeof value, next: string) => onChange({ ...value, [key]: next });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#070606] shadow-2xl">
        <div className="h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-black text-white">Novo lead</h3>
              <p className="text-sm text-white/40">Cadastro direto no banco do CRM.</p>
            </div>
            <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-white/45 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label="Nome" value={value.nome} onChange={(next) => update("nome", next)} icon={<UserRound className="h-4 w-4" />} />
            <Field label="Email" value={value.email} onChange={(next) => update("email", next)} icon={<Mail className="h-4 w-4" />} />
            <Field label="Telefone" value={value.telefone} onChange={(next) => update("telefone", next)} icon={<Phone className="h-4 w-4" />} />
            <Field label="Empresa" value={value.empresa} onChange={(next) => update("empresa", next)} icon={<Building2 className="h-4 w-4" />} />
            <Field label="Origem" value={value.origemLead} onChange={(next) => update("origemLead", next)} />
            <Field label="Tags" value={value.tags} onChange={(next) => update("tags", next)} />
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-white/35">Notas</label>
              <textarea
                value={value.notas}
                onChange={(event) => update("notas", event.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white/65 hover:text-white">
              Cancelar
            </button>
            <button onClick={onSave} className="rounded-xl bg-gold-500 px-4 py-2 text-sm font-black text-black hover:bg-gold-400">
              Criar lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  icon,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-white/35">{label}</label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">{icon}</span>}
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`h-10 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-gold-500/60 ${icon ? "pl-10" : ""}`}
        />
      </div>
    </div>
  );
}
