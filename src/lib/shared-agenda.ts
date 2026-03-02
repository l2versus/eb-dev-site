// ══════════════════════════════════════════════════════════════════════════════
// 📅 SharedAgenda — Persistência localStorage para Compromissos
// ══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = "eb-admin-agenda";

export interface Compromisso {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: "CALL" | "BRIEFING" | "PROPOSTA" | "ENTREGA" | "REVIEW" | "FOLLOWUP" | "REUNIAO";
  dataHora: string;
  duracao: number;
  status: "PENDENTE" | "CONFIRMADO" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO" | "REAGENDADO";
  plataforma?: string;
  linkReuniao?: string;
  notas?: string;
  clienteNome?: string;
}

const hoje = () => new Date().toISOString().split("T")[0];

const defaultCompromissos: Compromisso[] = [
  { id: "1", titulo: "Validação do design da home", tipo: "REVIEW", dataHora: `${hoje()}T09:00:00`, duracao: 30, status: "CONCLUIDO", plataforma: "Google Meet", notas: "Validação do design da home", clienteNome: "Myka Procópio" },
  { id: "2", titulo: "Alinhamento de funcionalidades", tipo: "CALL", dataHora: `${hoje()}T10:00:00`, duracao: 45, status: "EM_ANDAMENTO", plataforma: "Zoom", notas: "Alinhamento de funcionalidades", clienteNome: "Tech Solutions" },
  { id: "3", titulo: "Entrega final + ajustes", tipo: "ENTREGA", dataHora: `${hoje()}T11:30:00`, duracao: 15, status: "CONFIRMADO", clienteNome: "João Silva" },
  { id: "4", titulo: "Apresentar proposta comercial", tipo: "PROPOSTA", dataHora: `${hoje()}T14:00:00`, duracao: 30, status: "PENDENTE", plataforma: "Google Meet", notas: "Apresentar proposta comercial", clienteNome: "Clínica Vida" },
  { id: "5", titulo: "Levantar requisitos do e-commerce", tipo: "BRIEFING", dataHora: `${hoje()}T15:00:00`, duracao: 45, status: "CONFIRMADO", plataforma: "WhatsApp", notas: "Levantar requisitos do e-commerce", clienteNome: "Café Aroma" },
  { id: "6", titulo: "Retornar sobre proposta enviada", tipo: "FOLLOWUP", dataHora: `${hoje()}T16:00:00`, duracao: 15, status: "PENDENTE", plataforma: "WhatsApp", clienteNome: "Marina Costa" },
];

export function loadCompromissos(): Compromisso[] {
  if (typeof window === "undefined") return defaultCompromissos;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : defaultCompromissos;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCompromissos));
    return defaultCompromissos;
  } catch {
    return defaultCompromissos;
  }
}

export function saveCompromissos(compromissos: Compromisso[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(compromissos));
}

export function addCompromisso(c: Compromisso) {
  const all = loadCompromissos();
  all.push(c);
  saveCompromissos(all);
  return all;
}

export function updateCompromisso(id: string, updates: Partial<Compromisso>) {
  const all = loadCompromissos();
  const idx = all.findIndex((c) => c.id === id);
  if (idx >= 0) all[idx] = { ...all[idx], ...updates };
  saveCompromissos(all);
  return all;
}

export function deleteCompromisso(id: string) {
  const all = loadCompromissos().filter((c) => c.id !== id);
  saveCompromissos(all);
  return all;
}
