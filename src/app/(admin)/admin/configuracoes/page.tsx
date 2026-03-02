// ══════════════════════════════════════════════════════════════════════════════
// ⚙️ Configurações — Perfil, integrações e preferências do freelancer
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Settings,
  Clock,
  Calendar,
  Shield,
  Bell,
  Save,
  Plus,
  Trash2,
  Globe,
  CreditCard,
  MessageSquare,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Code2,
  Github,
  Loader2,
  Check,
  Palette,
  DollarSign,
  FileText,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ConfigPerfil {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  bio: string;
  github: string;
  linkedin: string;
  site: string;
  pixChave: string;
  pixTipo: string;
  valorHora: string;
}

interface ConfigNotificacoes {
  novoLead: boolean;
  novaMensagem: boolean;
  projetoAtualizado: boolean;
  pagamentoRecebido: boolean;
  lembreteEntrega: boolean;
  emailSemanal: boolean;
}

interface ConfigPreferencias {
  tema: "dark" | "auto";
  idioma: string;
  moeda: string;
  fusoHorario: string;
  diasTrabalho: boolean[];
  horaInicio: string;
  horaFim: string;
}

const STORAGE_KEY = "eb-admin-config";

// ─── Defaults ─────────────────────────────────────────────────────────────────
const defaultPerfil: ConfigPerfil = {
  nome: "Emmanuel Bezerra",
  email: "admin@emmanuelbezerra.dev",
  telefone: "(85) 99850-0344",
  cidade: "Fortaleza - CE",
  bio: "Desenvolvedor Full-Stack especializado em Next.js, React, Node.js e TypeScript",
  github: "https://github.com/emmanuelbezerradev",
  linkedin: "https://linkedin.com/in/emmanuelbezerra",
  site: "https://emmanuelbezerra.dev",
  pixChave: "",
  pixTipo: "CPF",
  valorHora: "150",
};

const defaultNotificacoes: ConfigNotificacoes = {
  novoLead: true,
  novaMensagem: true,
  projetoAtualizado: true,
  pagamentoRecebido: true,
  lembreteEntrega: true,
  emailSemanal: false,
};

const defaultPreferencias: ConfigPreferencias = {
  tema: "dark",
  idioma: "pt-BR",
  moeda: "BRL",
  fusoHorario: "America/Fortaleza",
  diasTrabalho: [true, true, true, true, true, false, false], // Seg-Sex
  horaInicio: "09:00",
  horaFim: "18:00",
};

export default function ConfiguracoesPage() {
  const [perfil, setPerfil] = useState<ConfigPerfil>(defaultPerfil);
  const [notificacoes, setNotificacoes] = useState<ConfigNotificacoes>(defaultNotificacoes);
  const [preferencias, setPreferencias] = useState<ConfigPreferencias>(defaultPreferencias);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Carregar configurações do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.perfil) setPerfil({ ...defaultPerfil, ...data.perfil });
        if (data.notificacoes) setNotificacoes({ ...defaultNotificacoes, ...data.notificacoes });
        if (data.preferencias) setPreferencias({ ...defaultPreferencias, ...data.preferencias });
      }
    } catch {
      // usar defaults
    }
    setLoaded(true);
  }, []);

  // Salvar tudo
  const handleSave = useCallback(() => {
    setSaving(true);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ perfil, notificacoes, preferencias, savedAt: new Date().toISOString() })
      );
      setTimeout(() => {
        setSaving(false);
        toast.success("Configurações salvas com sucesso!");
      }, 500);
    } catch {
      setSaving(false);
      toast.error("Erro ao salvar configurações.");
    }
  }, [perfil, notificacoes, preferencias]);

  // Helpers
  const updatePerfil = (key: keyof ConfigPerfil, value: string) =>
    setPerfil((p) => ({ ...p, [key]: value }));

  const toggleNotif = (key: keyof ConfigNotificacoes) =>
    setNotificacoes((n) => ({ ...n, [key]: !n[key] }));

  const toggleDia = (index: number) =>
    setPreferencias((p) => ({
      ...p,
      diasTrabalho: p.diasTrabalho.map((d, i) => (i === index ? !d : d)),
    }));

  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Configurações</h2>
          <p className="text-dark-400 mt-1">Perfil, preferências e integrações</p>
        </div>
        <Button
          variant="gold"
          size="sm"
          icon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ═══ Perfil Profissional ═══ */}
        <Card variant="glass">
          <CardHeader
            title="Perfil Profissional"
            subtitle="Informações públicas e de contato"
            icon={<User className="h-5 w-5" />}
          />
          <div className="space-y-4">
            <Input
              label="Nome completo"
              value={perfil.nome}
              onChange={(e) => updatePerfil("nome", e.target.value)}
              icon={<User className="h-4 w-4" />}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={perfil.email}
                onChange={(e) => updatePerfil("email", e.target.value)}
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Telefone"
                value={perfil.telefone}
                onChange={(e) => updatePerfil("telefone", e.target.value)}
                icon={<Phone className="h-4 w-4" />}
              />
            </div>
            <Input
              label="Cidade"
              value={perfil.cidade}
              onChange={(e) => updatePerfil("cidade", e.target.value)}
              icon={<MapPin className="h-4 w-4" />}
            />
            <div>
              <label className="block text-xs text-dark-400 mb-1.5 font-medium uppercase tracking-wider">
                Bio / Especialidade
              </label>
              <textarea
                value={perfil.bio}
                onChange={(e) => updatePerfil("bio", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-dark-700 bg-dark-800/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-all resize-none"
              />
            </div>
          </div>
        </Card>

        {/* ═══ Links & Redes Sociais ═══ */}
        <Card variant="glass">
          <CardHeader
            title="Links & Redes"
            subtitle="GitHub, LinkedIn, portfólio"
            icon={<Globe className="h-5 w-5" />}
          />
          <div className="space-y-4">
            <Input
              label="GitHub"
              value={perfil.github}
              onChange={(e) => updatePerfil("github", e.target.value)}
              icon={<Github className="h-4 w-4" />}
              placeholder="https://github.com/..."
            />
            <Input
              label="LinkedIn"
              value={perfil.linkedin}
              onChange={(e) => updatePerfil("linkedin", e.target.value)}
              icon={<Briefcase className="h-4 w-4" />}
              placeholder="https://linkedin.com/in/..."
            />
            <Input
              label="Website / Portfólio"
              value={perfil.site}
              onChange={(e) => updatePerfil("site", e.target.value)}
              icon={<Code2 className="h-4 w-4" />}
              placeholder="https://..."
            />

            <div className="pt-4 border-t border-dark-700/50">
              <p className="text-xs text-dark-400 mb-3 font-medium uppercase tracking-wider">
                Dados Financeiros
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs text-dark-400 mb-1.5">Tipo PIX</label>
                  <select
                    value={perfil.pixTipo}
                    onChange={(e) => updatePerfil("pixTipo", e.target.value)}
                    className="w-full rounded-xl border border-dark-700 bg-dark-800/50 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none transition-all"
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                    <option value="Email">Email</option>
                    <option value="Telefone">Telefone</option>
                    <option value="Aleatória">Aleatória</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Input
                    label="Chave PIX"
                    value={perfil.pixChave}
                    onChange={(e) => updatePerfil("pixChave", e.target.value)}
                    icon={<DollarSign className="h-4 w-4" />}
                    placeholder="Sua chave PIX"
                  />
                </div>
              </div>
              <div className="mt-3">
                <Input
                  label="Valor/hora (R$)"
                  type="number"
                  value={perfil.valorHora}
                  onChange={(e) => updatePerfil("valorHora", e.target.value)}
                  icon={<Clock className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ═══ Horário de Trabalho ═══ */}
        <Card variant="glass">
          <CardHeader
            title="Horário de Trabalho"
            subtitle="Disponibilidade para clientes"
            icon={<Clock className="h-5 w-5" />}
          />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Início"
                type="time"
                value={preferencias.horaInicio}
                onChange={(e) =>
                  setPreferencias((p) => ({ ...p, horaInicio: e.target.value }))
                }
              />
              <Input
                label="Fim"
                type="time"
                value={preferencias.horaFim}
                onChange={(e) =>
                  setPreferencias((p) => ({ ...p, horaFim: e.target.value }))
                }
              />
            </div>
            <div>
              <p className="text-xs text-dark-400 mb-2 font-medium uppercase tracking-wider">
                Dias de Trabalho
              </p>
              <div className="flex flex-wrap gap-2">
                {diasSemana.map((dia, i) => (
                  <button
                    key={dia}
                    onClick={() => toggleDia(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      preferencias.diasTrabalho[i]
                        ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                        : "bg-dark-800 text-dark-600 border border-dark-700/50 hover:border-dark-600"
                    }`}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-dark-400 mb-1.5">Fuso horário</label>
              <select
                value={preferencias.fusoHorario}
                onChange={(e) =>
                  setPreferencias((p) => ({ ...p, fusoHorario: e.target.value }))
                }
                className="w-full rounded-xl border border-dark-700 bg-dark-800/50 px-3 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none transition-all"
              >
                <option value="America/Fortaleza">Fortaleza (GMT-3)</option>
                <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                <option value="America/Manaus">Manaus (GMT-4)</option>
                <option value="America/Belem">Belém (GMT-3)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* ═══ Notificações ═══ */}
        <Card variant="glass">
          <CardHeader
            title="Notificações"
            subtitle="Alertas e automações"
            icon={<Bell className="h-5 w-5" />}
          />
          <div className="space-y-3">
            {([
              { key: "novoLead" as const, label: "Novo lead / visita no site" },
              { key: "novaMensagem" as const, label: "Nova mensagem no chat" },
              { key: "projetoAtualizado" as const, label: "Projeto atualizado" },
              { key: "pagamentoRecebido" as const, label: "Pagamento recebido" },
              { key: "lembreteEntrega" as const, label: "Lembrete de entrega (3 dias antes)" },
              { key: "emailSemanal" as const, label: "Relatório semanal por email" },
            ]).map((notif) => (
              <div
                key={notif.key}
                className="flex items-center justify-between p-3 rounded-xl border border-dark-700/50 bg-dark-800/30"
              >
                <p
                  className={`text-sm ${
                    notificacoes[notif.key] ? "text-white" : "text-dark-500"
                  }`}
                >
                  {notif.label}
                </p>
                <button
                  onClick={() => toggleNotif(notif.key)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    notificacoes[notif.key] ? "bg-brand-500" : "bg-dark-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                      notificacoes[notif.key] ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* ═══ Integrações ═══ */}
        <Card variant="glass">
          <CardHeader
            title="Integrações"
            subtitle="APIs e serviços conectados"
            icon={<Globe className="h-5 w-5" />}
          />
          <div className="space-y-3">
            {[
              { nome: "WhatsApp API", icon: MessageSquare, status: "Em breve", ativo: false },
              { nome: "Mercado Pago", icon: CreditCard, status: "Em breve", ativo: false },
              { nome: "GitHub", icon: Github, status: "Em breve", ativo: false },
              { nome: "Google Analytics", icon: Globe, status: "Em breve", ativo: false },
            ].map((integracao, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-dark-700/50 bg-dark-800/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      integracao.ativo
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-dark-700/50 text-dark-500"
                    }`}
                  >
                    <integracao.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{integracao.nome}</p>
                    <p className={`text-xs ${integracao.ativo ? "text-emerald-400" : "text-dark-500"}`}>
                      {integracao.status}
                    </p>
                  </div>
                </div>
                <Badge variant={integracao.ativo ? "success" : "default"} size="sm">
                  {integracao.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* ═══ Segurança ═══ */}
        <Card variant="glass">
          <CardHeader
            title="Segurança"
            subtitle="Proteção e privacidade"
            icon={<Shield className="h-5 w-5" />}
          />
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-emerald-400" />
                <p className="text-sm font-semibold text-white">Sessão JWT</p>
              </div>
              <p className="text-xs text-dark-400">
                Autenticação via NextAuth.js com tokens JWT. Sessão expira em 1h ou ao fechar o
                navegador.
              </p>
              <Badge variant="success" size="sm" className="mt-2">
                Ativo
              </Badge>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-emerald-400" />
                <p className="text-sm font-semibold text-white">Headers de Segurança</p>
              </div>
              <p className="text-xs text-dark-400">
                CSP, X-Frame-Options, HSTS e demais headers configurados no next.config.
              </p>
              <Badge variant="success" size="sm" className="mt-2">
                Ativo
              </Badge>
            </div>
            <div className="p-4 rounded-xl border border-brand-500/20 bg-brand-500/5">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-brand-400" />
                <p className="text-sm font-semibold text-white">Dados Locais</p>
              </div>
              <p className="text-xs text-dark-400">
                Configurações salvas no localStorage do navegador. Dados de projetos e chat são
                armazenados em memória (sessão do servidor).
              </p>
              <Badge variant="info" size="sm" className="mt-2">
                Local Storage
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
