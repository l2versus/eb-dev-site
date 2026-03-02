// ══════════════════════════════════════════════════════════════════════════════
// 💰 SharedFinanceiro — Persistência localStorage para Transações
// ══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = "eb-admin-financeiro";

export interface Transacao {
  id: string;
  tipo: "receita" | "despesa";
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  status: "pago" | "pendente" | "atrasado" | "cancelado";
  metodo?: string;
  cliente?: string;
}

const defaultTransacoes: Transacao[] = [
  { id: "1", tipo: "receita", descricao: "Site Institucional - Myka Procópio", valor: 5500, categoria: "Projeto", data: "2026-02-28", status: "pago", metodo: "PIX", cliente: "Myka Procópio" },
  { id: "2", tipo: "receita", descricao: "Landing Page Advocacia - João Silva", valor: 2500, categoria: "Projeto", data: "2026-02-20", status: "pago", metodo: "Transferência", cliente: "João Silva" },
  { id: "3", tipo: "receita", descricao: "Dashboard Analytics - Tech Solutions (1ª parcela)", valor: 7500, categoria: "Projeto", data: "2026-02-15", status: "pago", metodo: "PIX", cliente: "Tech Solutions" },
  { id: "4", tipo: "receita", descricao: "Manutenção mensal - L2Versus", valor: 800, categoria: "Manutenção", data: "2026-02-05", status: "pago", metodo: "PIX", cliente: "L2Versus" },
  { id: "5", tipo: "receita", descricao: "E-commerce Café - Café Aroma (sinal)", valor: 3200, categoria: "Projeto", data: "2026-01-28", status: "pago", metodo: "Boleto", cliente: "Café Aroma" },
  { id: "6", tipo: "receita", descricao: "Dashboard Analytics - Tech Solutions (2ª parcela)", valor: 7500, categoria: "Projeto", data: "2026-03-15", status: "pendente", metodo: "PIX", cliente: "Tech Solutions" },
  { id: "7", tipo: "receita", descricao: "E-commerce Café - Café Aroma (final)", valor: 4800, categoria: "Projeto", data: "2026-04-15", status: "pendente", metodo: "PIX", cliente: "Café Aroma" },
  { id: "8", tipo: "despesa", descricao: "Vercel Pro", valor: 100, categoria: "Infraestrutura", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "9", tipo: "despesa", descricao: "Domínios + DNS", valor: 85, categoria: "Infraestrutura", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "10", tipo: "despesa", descricao: "Figma Pro", valor: 60, categoria: "Ferramentas", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "11", tipo: "despesa", descricao: "ChatGPT Plus", valor: 100, categoria: "Ferramentas", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "12", tipo: "despesa", descricao: "Neon (DB) + AWS", valor: 45, categoria: "Infraestrutura", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "13", tipo: "despesa", descricao: "GitHub Copilot", valor: 50, categoria: "Ferramentas", data: "2026-02-01", status: "pago", metodo: "Cartão" },
  { id: "14", tipo: "despesa", descricao: "Contador MEI", valor: 200, categoria: "Fiscal", data: "2026-02-10", status: "pago", metodo: "PIX" },
  { id: "15", tipo: "despesa", descricao: "DAS MEI", valor: 75, categoria: "Fiscal", data: "2026-02-20", status: "pago", metodo: "Boleto" },
];

export function loadTransacoes(): Transacao[] {
  if (typeof window === "undefined") return defaultTransacoes;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : defaultTransacoes;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTransacoes));
    return defaultTransacoes;
  } catch {
    return defaultTransacoes;
  }
}

export function saveTransacoes(transacoes: Transacao[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transacoes));
}

export function addTransacao(t: Transacao) {
  const all = loadTransacoes();
  all.push(t);
  saveTransacoes(all);
  return all;
}

export function updateTransacao(id: string, updates: Partial<Transacao>) {
  const all = loadTransacoes();
  const idx = all.findIndex((t) => t.id === id);
  if (idx >= 0) all[idx] = { ...all[idx], ...updates };
  saveTransacoes(all);
  return all;
}

export function deleteTransacao(id: string) {
  const all = loadTransacoes().filter((t) => t.id !== id);
  saveTransacoes(all);
  return all;
}

// Gerar faturamento mensal real a partir das transações
export function calcFaturamentoMensal(transacoes: Transacao[], meses: number = 6) {
  const result: { label: string; receita: number; despesa: number }[] = [];
  const now = new Date();
  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mes = d.getMonth();
    const ano = d.getFullYear();
    const receita = transacoes
      .filter((t) => t.tipo === "receita" && t.status === "pago" && new Date(t.data).getMonth() === mes && new Date(t.data).getFullYear() === ano)
      .reduce((s, t) => s + t.valor, 0);
    const despesa = transacoes
      .filter((t) => t.tipo === "despesa" && t.status === "pago" && new Date(t.data).getMonth() === mes && new Date(t.data).getFullYear() === ano)
      .reduce((s, t) => s + t.valor, 0);
    result.push({ label: labels[mes], receita, despesa });
  }
  return result;
}
