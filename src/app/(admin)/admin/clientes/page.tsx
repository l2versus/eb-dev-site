// ══════════════════════════════════════════════════════════════════════════════
// 👥 Admin — Gerenciamento de Clientes e Leads
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

// Tipos
type ClienteStatus = "ATIVO" | "LEAD" | "PROSPECT" | "INATIVO";
type ClienteTipo = "PF" | "PJ";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  site?: string;
  tipo: ClienteTipo;
  status: ClienteStatus;
  totalProjetos: number;
  faturamentoTotal: string;
  ultimoContato: string;
  rating: number;
  tags: string[];
}

// Mock de dados de clientes
const clientesMock: Cliente[] = [
  {
    id: "1",
    nome: "Myka Procópio",
    email: "contato@mykaprocopio.com.br",
    telefone: "(85) 99999-8888",
    empresa: "Myka Procópio Estética",
    site: "mykaprocopio.com.br",
    tipo: "PJ",
    status: "ATIVO",
    totalProjetos: 2,
    faturamentoTotal: "R$ 8.500",
    ultimoContato: "2024-02-28",
    rating: 5,
    tags: ["Premium", "Recorrente"],
  },
  {
    id: "2",
    nome: "João Silva",
    email: "joao@advocaciasilva.com.br",
    telefone: "(85) 98877-6655",
    empresa: "Silva & Associados",
    tipo: "PJ",
    status: "ATIVO",
    totalProjetos: 1,
    faturamentoTotal: "R$ 2.500",
    ultimoContato: "2024-02-25",
    rating: 5,
    tags: ["Advocacia"],
  },
  {
    id: "3",
    nome: "Tech Solutions Ltda",
    email: "projetos@techsolutions.io",
    telefone: "(11) 99888-7766",
    empresa: "Tech Solutions",
    site: "techsolutions.io",
    tipo: "PJ",
    status: "ATIVO",
    totalProjetos: 3,
    faturamentoTotal: "R$ 35.000",
    ultimoContato: "2024-02-27",
    rating: 5,
    tags: ["Enterprise", "Tecnologia"],
  },
  {
    id: "4",
    nome: "Café Aroma",
    email: "contato@cafearoma.com.br",
    telefone: "(85) 98765-4321",
    empresa: "Café Aroma LTDA",
    tipo: "PJ",
    status: "ATIVO",
    totalProjetos: 1,
    faturamentoTotal: "R$ 8.000",
    ultimoContato: "2024-02-20",
    rating: 4,
    tags: ["E-commerce", "Alimentos"],
  },
  {
    id: "5",
    nome: "Marina Costa",
    email: "marina.costa@gmail.com",
    telefone: "(85) 99123-4567",
    tipo: "PF",
    status: "LEAD",
    totalProjetos: 0,
    faturamentoTotal: "R$ 0",
    ultimoContato: "2024-02-29",
    rating: 0,
    tags: ["Landing Page"],
  },
  {
    id: "6",
    nome: "Clínica Vida",
    email: "atendimento@clinicavida.com.br",
    telefone: "(85) 3333-4444",
    empresa: "Clínica Vida Saúde",
    tipo: "PJ",
    status: "PROSPECT",
    totalProjetos: 0,
    faturamentoTotal: "R$ 0",
    ultimoContato: "2024-02-28",
    rating: 0,
    tags: ["Saúde", "Institucional"],
  },
  {
    id: "7",
    nome: "Academia Fit",
    email: "marketing@academiafit.com.br",
    telefone: "(85) 99777-8888",
    empresa: "Academia Fit Center",
    tipo: "PJ",
    status: "PROSPECT",
    totalProjetos: 0,
    faturamentoTotal: "R$ 0",
    ultimoContato: "2024-02-27",
    rating: 0,
    tags: ["Fitness", "Landing"],
  },
];

const statusConfig: Record<ClienteStatus, { label: string; color: string }> = {
  ATIVO: { label: "Cliente Ativo", color: "text-emerald-400 bg-emerald-500/10" },
  LEAD: { label: "Lead", color: "text-brand-400 bg-brand-500/10" },
  PROSPECT: { label: "Prospect", color: "text-purple-400 bg-purple-500/10" },
  INATIVO: { label: "Inativo", color: "text-dark-500 bg-dark-700/30" },
};

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClienteStatus | "TODOS">("TODOS");

  const clientesFiltrados = clientesMock.filter((cliente) => {
    const matchSearch =
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.empresa?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "TODOS" || cliente.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: clientesMock.length,
    ativos: clientesMock.filter((c) => c.status === "ATIVO").length,
    leads: clientesMock.filter((c) => c.status === "LEAD").length,
    prospects: clientesMock.filter((c) => c.status === "PROSPECT").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Clientes & Leads</h2>
          <p className="text-dark-400 mt-1">Gerencie seu funil de vendas e clientes</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
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
                        statusConfig[cliente.status].color
                      }`}
                    >
                      {statusConfig[cliente.status].label}
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
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {cliente.telefone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Métricas */}
              <div className="flex items-center gap-6 lg:gap-8">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{cliente.totalProjetos}</p>
                  <p className="text-xs text-dark-500">Projetos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-brand-400">{cliente.faturamentoTotal}</p>
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
                <div className="text-center hidden sm:block">
                  <p className="text-sm text-dark-300">
                    {new Date(cliente.ultimoContato).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-xs text-dark-500">Último contato</p>
                </div>
              </div>

              {/* Tags e Ações */}
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-1">
                  {cliente.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <button className="p-2 rounded-lg hover:bg-dark-700 transition-colors">
                  <MoreVertical className="h-4 w-4 text-dark-400" />
                </button>
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
            { label: "Leads", count: stats.leads, value: "R$ 7.500", color: "brand" },
            { label: "Prospects", count: stats.prospects, value: "R$ 8.000", color: "purple" },
            { label: "Negociação", count: 2, value: "R$ 17.500", color: "gold" },
            { label: "Fechados", count: stats.ativos, value: "R$ 54.000", color: "emerald" },
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
              <p className="text-xl font-bold text-white">{stage.value}</p>
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
    </div>
  );
}
