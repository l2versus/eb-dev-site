// ══════════════════════════════════════════════════════════════════════════════
// 👥 Admin — Gerenciamento de Clientes e Leads (Conectado à API)
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useRealtime } from "@/hooks/use-realtime";
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Globe,
  FolderKanban,
  DollarSign,
  Star,
  MoreVertical,
  MessageSquare,
  ArrowUpRight,
  Building,
  Calendar,
  TrendingUp,
  Loader2,
  RefreshCw,
  X,
  Send,
  Edit,
  Trash2,
  ExternalLink,
  Wifi,
  WifiOff,
} from "lucide-react";

// Tipos
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
  faturamentoTotal: number;
  rating: number;
  tags: string[];
  notas: string | null;
  origemLead: string | null;
  ultimoContato: string | null;
  createdAt: string;
  _count?: {
    projetos: number;
    propostas: number;
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
  // Estados
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClienteStatus | "TODOS">("TODOS");
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    site: "",
    tipo: "PF" as ClienteTipo,
    status: "LEAD" as ClienteStatus,
    tags: [] as string[],
    notas: "",
    origemLead: "",
  });

  // Realtime connection
  const { connected, emit } = useRealtime({
    onEvent: (event) => {
      if (event.type === "novo_cliente") {
        carregarClientes();
      }
    },
  });

  // Carregar clientes
  const carregarClientes = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "TODOS") params.set("status", statusFilter);
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/clientes?${params}`);
      if (!res.ok) throw new Error("Erro ao carregar clientes");
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  // Filtrar clientes localmente para busca rápida
  const clientesFiltrados = clientes.filter((cliente) => {
    const matchSearch =
      !searchTerm ||
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.empresa?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "TODOS" || cliente.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = {
    total: clientes.length,
    ativos: clientes.filter((c) => c.status === "ATIVO").length,
    leads: clientes.filter((c) => c.status === "LEAD").length,
    prospects: clientes.filter((c) => c.status === "PROSPECT").length,
    negociando: clientes.filter((c) => c.status === "NEGOCIANDO").length,
  };

  // Salvar cliente (criar ou editar)
  const salvarCliente = async () => {
    setSaving(true);
    try {
      const url = editingCliente ? `/api/clientes/${editingCliente.id}` : "/api/clientes";
      const method = editingCliente ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      // Emitir evento em tempo real
      emit("novo_cliente", { nome: form.nome });

      setShowModal(false);
      setEditingCliente(null);
      resetForm();
      carregarClientes();
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setSaving(false);
    }
  };

  // Excluir cliente
  const excluirCliente = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
      carregarClientes();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  // Abrir modal de edição
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
      tags: cliente.tags || [],
      notas: cliente.notas || "",
      origemLead: cliente.origemLead || "",
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setForm({
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
      site: "",
      tipo: "PF",
      status: "LEAD",
      tags: [],
      notas: "",
      origemLead: "",
    });
  };

  // Enviar WhatsApp
  const enviarWhatsApp = (telefone: string) => {
    const numero = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numero}`, "_blank");
  };

  // Formatar valor
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Clientes & Leads</h2>
            {/* Indicador de conexão tempo real */}
            <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              connected ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
            }`}>
              {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {connected ? "Ao vivo" : "Offline"}
            </span>
          </div>
          <p className="text-dark-400 mt-1">Gerencie seu funil de vendas e clientes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={carregarClientes} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
          <Button onClick={() => { resetForm(); setEditingCliente(null); setShowModal(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
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
            {(["TODOS", "ATIVO", "LEAD", "PROSPECT"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === status
                    ? "bg-brand-500 text-white"
                    : "bg-dark-800 text-dark-400 hover:bg-dark-700"
                }`}
              >
                {status === "TODOS" ? "Todos" : statusConfig[status].label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {clientesFiltrados.map((cliente) => (
          <Card
            key={cliente.id}
            variant="glass"
            className="hover:border-brand-500/30 transition-all cursor-pointer"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Avatar e Info Principal */}
              <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
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
                  <div className="flex items-center gap-4 mt-1 text-xs text-dark-500">
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
                  <p className="text-lg font-bold text-white">{cliente._count?.projetos || 0}</p>
                  <p className="text-xs text-dark-500">Projetos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-brand-400">{formatarValor(Number(cliente.faturamentoTotal) || 0)}</p>
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

      {clientesFiltrados.length === 0 && (
        <Card variant="glass" className="text-center py-12">
          <Users className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">Nenhum cliente encontrado</p>
          <p className="text-dark-500 text-sm mt-1">Tente ajustar os filtros de busca</p>
        </Card>
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

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-dark-950/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-900 rounded-2xl p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            <p className="text-dark-300">Carregando clientes...</p>
          </div>
        </div>
      )}

      {/* Modal de Criação/Edição */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingCliente(null); resetForm(); }}
        title={editingCliente ? "Editar Cliente" : "Novo Cliente"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome *"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Nome do cliente"
            />
            <Input
              label="Email *"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Telefone"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              placeholder="(85) 99999-9999"
            />
            <Input
              label="Empresa"
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              placeholder="Nome da empresa"
            />
          </div>

          <Input
            label="Site"
            value={form.site}
            onChange={(e) => setForm({ ...form, site: e.target.value })}
            placeholder="www.exemplo.com.br"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as ClienteTipo })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="PF">Pessoa Física</option>
                <option value="PJ">Pessoa Jurídica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ClienteStatus })}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
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

          <Input
            label="Origem do Lead"
            value={form.origemLead}
            onChange={(e) => setForm({ ...form, origemLead: e.target.value })}
            placeholder="Ex: Google, Instagram, Indicação..."
          />

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Notas</label>
            <textarea
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              placeholder="Observações sobre o cliente..."
              rows={3}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => { setShowModal(false); setEditingCliente(null); resetForm(); }}
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
    </div>
  );
}
