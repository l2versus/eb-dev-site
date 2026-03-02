// ══════════════════════════════════════════════════════════════════════════════
// 📋 Log de Atividades — Histórico de ações do sistema admin
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Activity,
  Clock,
  User,
  FileText,
  DollarSign,
  MessageCircle,
  Settings,
  FolderKanban,
  CalendarDays,
  Filter,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  Download,
  Eye,
  Bell,
  LogIn,
  LogOut,
  Edit,
  Plus,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Categoria = "projeto" | "financeiro" | "chat" | "proposta" | "config" | "agenda" | "cliente" | "sistema" | "auth";
type Nivel = "info" | "success" | "warning" | "error";

interface LogEntry {
  id: string;
  timestamp: string;
  categoria: Categoria;
  nivel: Nivel;
  acao: string;
  descricao: string;
  usuario: string;
  detalhes?: string;
  ip?: string;
}

// ─── Dados mock ───────────────────────────────────────────────────────────────
const now = new Date();
const h = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();

const mockLogs: LogEntry[] = [
  { id: "1", timestamp: h(0.1), categoria: "auth", nivel: "info", acao: "Login", descricao: "Acesso ao painel admin", usuario: "Emmanuel Bezerra", ip: "189.40.xx.xx" },
  { id: "2", timestamp: h(0.5), categoria: "projeto", nivel: "success", acao: "Status atualizado", descricao: "Projeto 'Myka Procópio' movido para Revisão", usuario: "Emmanuel Bezerra", detalhes: "Status anterior: Desenvolvimento → Revisão. Progresso: 85%" },
  { id: "3", timestamp: h(1), categoria: "chat", nivel: "info", acao: "Nova mensagem", descricao: "Resposta enviada para João Silva", usuario: "Emmanuel Bezerra" },
  { id: "4", timestamp: h(1.5), categoria: "proposta", nivel: "success", acao: "Proposta criada", descricao: "Proposta 'Site Institucional' para Café Aroma — R$ 6.300", usuario: "Emmanuel Bezerra", detalhes: "5 itens, prazo 4-6 semanas, validade 15 dias" },
  { id: "5", timestamp: h(2), categoria: "financeiro", nivel: "success", acao: "Pagamento recebido", descricao: "PIX R$ 3.500 de Tech Solutions Ltda", usuario: "Sistema", detalhes: "Ref: Projeto App Delivery — 2ª parcela" },
  { id: "6", timestamp: h(3), categoria: "agenda", nivel: "info", acao: "Compromisso criado", descricao: "Reunião com L2Versus agendada para amanhã", usuario: "Emmanuel Bezerra" },
  { id: "7", timestamp: h(4), categoria: "config", nivel: "warning", acao: "Configurações salvas", descricao: "Perfil atualizado — valor/hora alterado", usuario: "Emmanuel Bezerra", detalhes: "Valor/hora: R$ 120 → R$ 150" },
  { id: "8", timestamp: h(5), categoria: "sistema", nivel: "info", acao: "Backup automático", descricao: "Backup dos dados realizado com sucesso", usuario: "Sistema" },
  { id: "9", timestamp: h(6), categoria: "cliente", nivel: "success", acao: "Novo cliente", descricao: "Café Aroma cadastrado via formulário de contato", usuario: "Sistema", detalhes: "Email: contato@cafearoma.com.br, Tel: (85) 98765-4321" },
  { id: "10", timestamp: h(8), categoria: "proposta", nivel: "warning", acao: "Proposta expirando", descricao: "Proposta para Dr. André — validade em 2 dias", usuario: "Sistema" },
  { id: "11", timestamp: h(10), categoria: "projeto", nivel: "info", acao: "Comentário adicionado", descricao: "Feedback do cliente no projeto 'Dashboard RH'", usuario: "Emmanuel Bezerra" },
  { id: "12", timestamp: h(12), categoria: "financeiro", nivel: "warning", acao: "Pagamento pendente", descricao: "Fatura de R$ 2.800 vencida — João Silva", usuario: "Sistema", detalhes: "Vencimento: há 3 dias. Projeto: Redesign Blog" },
  { id: "13", timestamp: h(14), categoria: "sistema", nivel: "error", acao: "Erro de integração", descricao: "Falha na conexão com API do WhatsApp", usuario: "Sistema", detalhes: "Timeout após 30s. Retry em 5 minutos." },
  { id: "14", timestamp: h(16), categoria: "auth", nivel: "warning", acao: "Tentativa de login", descricao: "Login falhou — senha incorreta", usuario: "desconhecido@test.com", ip: "45.230.xx.xx" },
  { id: "15", timestamp: h(20), categoria: "projeto", nivel: "success", acao: "Projeto entregue", descricao: "Landing Page Fitness entregue ao cliente", usuario: "Emmanuel Bezerra", detalhes: "Tempo total: 12 dias. Nota do cliente: 5/5" },
  { id: "16", timestamp: h(24), categoria: "chat", nivel: "info", acao: "Lead capturado", descricao: "Novo contato via chatbot — Maria Eduarda", usuario: "Chatbot", detalhes: "Interesse: E-commerce, Orçamento: R$ 8-12k" },
  { id: "17", timestamp: h(28), categoria: "financeiro", nivel: "success", acao: "Boleto pago", descricao: "DAS MEI competência anterior quitado", usuario: "Emmanuel Bezerra" },
  { id: "18", timestamp: h(32), categoria: "sistema", nivel: "info", acao: "Deploy", descricao: "Nova versão publicada na Vercel (v2.4.1)", usuario: "GitHub Actions", detalhes: "Commit: fix(ui): corrigir responsividade mobile" },
  { id: "19", timestamp: h(48), categoria: "proposta", nivel: "success", acao: "Proposta aprovada", descricao: "Myka Procópio aprovou proposta de R$ 4.500", usuario: "Sistema", detalhes: "Tempo de resposta: 3 dias" },
  { id: "20", timestamp: h(72), categoria: "auth", nivel: "info", acao: "Sessão expirada", descricao: "Token JWT renovado automaticamente", usuario: "Emmanuel Bezerra" },
];

// ─── Helpers visuais ──────────────────────────────────────────────────────────
const catIcons: Record<Categoria, React.ReactNode> = {
  projeto: <FolderKanban className="h-4 w-4" />,
  financeiro: <DollarSign className="h-4 w-4" />,
  chat: <MessageCircle className="h-4 w-4" />,
  proposta: <FileText className="h-4 w-4" />,
  config: <Settings className="h-4 w-4" />,
  agenda: <CalendarDays className="h-4 w-4" />,
  cliente: <User className="h-4 w-4" />,
  sistema: <Zap className="h-4 w-4" />,
  auth: <LogIn className="h-4 w-4" />,
};

const catLabels: Record<Categoria, string> = {
  projeto: "Projeto",
  financeiro: "Financeiro",
  chat: "Chat",
  proposta: "Proposta",
  config: "Config",
  agenda: "Agenda",
  cliente: "Cliente",
  sistema: "Sistema",
  auth: "Auth",
};

const catColors: Record<Categoria, string> = {
  projeto: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  financeiro: "text-green-400 bg-green-500/10 border-green-500/20",
  chat: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  proposta: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  config: "text-gray-400 bg-gray-500/10 border-gray-500/20",
  agenda: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  cliente: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  sistema: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  auth: "text-red-400 bg-red-500/10 border-red-500/20",
};

const nivelIcons: Record<Nivel, React.ReactNode> = {
  info: <Info className="h-3.5 w-3.5 text-blue-400" />,
  success: <CheckCircle className="h-3.5 w-3.5 text-green-400" />,
  warning: <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />,
  error: <AlertTriangle className="h-3.5 w-3.5 text-red-400" />,
};

const nivelBadge: Record<Nivel, "info" | "success" | "gold" | "danger"> = {
  info: "info",
  success: "success",
  warning: "gold",
  error: "danger",
};

function tempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Agora";
  if (min < 60) return `${min}min atrás`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  const dias = Math.floor(hrs / 24);
  return `${dias}d atrás`;
}

// ═══ Componente Principal ═════════════════════════════════════════════════════
export default function LogAtividadesPage() {
  const [logs] = useState<LogEntry[]>(mockLogs);
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | "todos">("todos");
  const [filtroNivel, setFiltroNivel] = useState<Nivel | "todos">("todos");
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  // ─── Filtro ──────────────────────────────────────────────────────────
  const logsFiltrados = useMemo(() => {
    return logs.filter((l) => {
      if (filtroCategoria !== "todos" && l.categoria !== filtroCategoria) return false;
      if (filtroNivel !== "todos" && l.nivel !== filtroNivel) return false;
      if (busca) {
        const q = busca.toLowerCase();
        return (
          l.acao.toLowerCase().includes(q) ||
          l.descricao.toLowerCase().includes(q) ||
          l.usuario.toLowerCase().includes(q) ||
          (l.detalhes?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [logs, busca, filtroCategoria, filtroNivel]);

  // ─── Estatísticas ───────────────────────────────────────────────────
  const stats = useMemo(() => {
    const hoje = new Date().toDateString();
    const logsHoje = logs.filter((l) => new Date(l.timestamp).toDateString() === hoje);
    return {
      total: logs.length,
      hoje: logsHoje.length,
      erros: logs.filter((l) => l.nivel === "error").length,
      warnings: logs.filter((l) => l.nivel === "warning").length,
    };
  }, [logs]);

  const toggleExpand = (id: string) => {
    setExpandidos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Log de Atividades</h2>
          <p className="text-dark-400 mt-1">Histórico completo de ações e eventos do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} onClick={() => {
            const csv = ["Timestamp,Categoria,Nível,Ação,Descrição,Usuário", ...logs.map(l => `${l.timestamp},${l.categoria},${l.nivel},"${l.acao}","${l.descricao}",${l.usuario}`)].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "logs.csv"; a.click();
            URL.revokeObjectURL(url);
            toast.success("Logs exportados!");
          }}>
            Exportar
          </Button>
          <Button variant="outline" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={() => toast.success("Logs atualizados!")}>
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total de registros", value: stats.total, icon: <Activity className="h-5 w-5" />, color: "text-brand-400" },
          { label: "Ações hoje", value: stats.hoje, icon: <Clock className="h-5 w-5" />, color: "text-blue-400" },
          { label: "Warnings", value: stats.warnings, icon: <AlertTriangle className="h-5 w-5" />, color: "text-yellow-400" },
          { label: "Erros", value: stats.erros, icon: <AlertTriangle className="h-5 w-5" />, color: "text-red-400" },
        ].map((s, i) => (
          <Card key={i} variant="glass" className="!p-4">
            <div className="flex items-center gap-3">
              <div className={`${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-dark-500">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar ação, descrição, usuário..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-700 bg-dark-800/50 text-sm text-white placeholder:text-dark-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-all"
          />
        </div>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value as Categoria | "todos")}
          className="px-3 py-2.5 rounded-xl border border-dark-700 bg-dark-800/50 text-sm text-white focus:border-brand-500 focus:outline-none cursor-pointer"
        >
          <option value="todos">Todas categorias</option>
          {Object.entries(catLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={filtroNivel}
          onChange={(e) => setFiltroNivel(e.target.value as Nivel | "todos")}
          className="px-3 py-2.5 rounded-xl border border-dark-700 bg-dark-800/50 text-sm text-white focus:border-brand-500 focus:outline-none cursor-pointer"
        >
          <option value="todos">Todos níveis</option>
          <option value="info">Info</option>
          <option value="success">Sucesso</option>
          <option value="warning">Warning</option>
          <option value="error">Erro</option>
        </select>
      </div>

      {/* Timeline de logs */}
      <div className="space-y-1">
        {logsFiltrados.length === 0 ? (
          <Card variant="glass">
            <div className="text-center py-12">
              <Activity className="h-10 w-10 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400">Nenhum registro encontrado</p>
            </div>
          </Card>
        ) : (
          logsFiltrados.map((log) => {
            const expanded = expandidos.has(log.id);
            return (
              <div
                key={log.id}
                className="group p-4 rounded-xl border border-dark-800/50 bg-dark-900/30 hover:bg-dark-800/30 hover:border-dark-700/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Ícone nível */}
                  <div className="mt-0.5 shrink-0">{nivelIcons[log.nivel]}</div>

                  {/* Conteúdo principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm text-white font-medium">{log.acao}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${catColors[log.categoria]}`}>
                        {catIcons[log.categoria]}
                        {catLabels[log.categoria]}
                      </span>
                    </div>
                    <p className="text-sm text-dark-300 leading-relaxed">{log.descricao}</p>

                    {/* Detalhes expandíveis */}
                    {log.detalhes && expanded && (
                      <div className="mt-2 p-3 rounded-lg bg-dark-800/50 border border-dark-700/30 text-xs text-dark-400 leading-relaxed">
                        {log.detalhes}
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-dark-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {log.usuario}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {tempoRelativo(log.timestamp)}
                      </span>
                      {log.ip && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> {log.ip}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand button */}
                  {log.detalhes && (
                    <button
                      onClick={() => toggleExpand(log.id)}
                      className="p-1 text-dark-600 hover:text-dark-300 transition-colors shrink-0"
                    >
                      {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-dark-600 py-4">
        Exibindo {logsFiltrados.length} de {logs.length} registros
      </div>
    </div>
  );
}
