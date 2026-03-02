// ══════════════════════════════════════════════════════════════════════════════
// 👥 SharedClientes — Persistência localStorage para Clientes & Leads
// ══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = "eb-admin-clientes";

export type ClienteStatus = "ATIVO" | "LEAD" | "PROSPECT" | "NEGOCIANDO" | "INATIVO" | "PERDIDO";
export type ClienteTipo = "PF" | "PJ";

export interface Cliente {
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
  projetos: number;
  propostas: number;
}

const defaultClientes: Cliente[] = [
  {
    id: "1",
    nome: "Myka Procópio",
    email: "contato@mykaprocopio.com.br",
    telefone: "(85) 99999-8888",
    empresa: "Myka Procópio Estética",
    site: "mykaprocopio.com.br",
    tipo: "PJ",
    status: "ATIVO",
    faturamentoTotal: 8500,
    rating: 5,
    tags: ["Premium", "Recorrente"],
    notas: null,
    origemLead: "Instagram",
    ultimoContato: "2024-02-27",
    createdAt: "2024-01-15",
    projetos: 2,
    propostas: 1,
  },
  {
    id: "2",
    nome: "João Silva",
    email: "joao@advocaciasilva.com.br",
    telefone: "(85) 98877-6655",
    empresa: "Silva & Associados",
    site: null,
    tipo: "PJ",
    status: "ATIVO",
    faturamentoTotal: 2500,
    rating: 5,
    tags: ["Advocacia"],
    notas: null,
    origemLead: "Indicação",
    ultimoContato: "2024-02-24",
    createdAt: "2024-02-10",
    projetos: 1,
    propostas: 0,
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
    faturamentoTotal: 35000,
    rating: 5,
    tags: ["Enterprise", "Tecnologia"],
    notas: null,
    origemLead: "LinkedIn",
    ultimoContato: "2024-02-26",
    createdAt: "2023-11-20",
    projetos: 3,
    propostas: 2,
  },
  {
    id: "4",
    nome: "Café Aroma",
    email: "contato@cafearoma.com.br",
    telefone: "(85) 98765-4321",
    empresa: "Café Aroma LTDA",
    site: null,
    tipo: "PJ",
    status: "ATIVO",
    faturamentoTotal: 8000,
    rating: 4,
    tags: ["E-commerce", "Alimentos"],
    notas: null,
    origemLead: "Google",
    ultimoContato: "2024-02-19",
    createdAt: "2024-01-05",
    projetos: 1,
    propostas: 1,
  },
  {
    id: "5",
    nome: "Marina Costa",
    email: "marina@gmail.com",
    telefone: "(85) 99876-5432",
    empresa: null,
    site: null,
    tipo: "PF",
    status: "LEAD",
    faturamentoTotal: 0,
    rating: 0,
    tags: ["Fitness"],
    notas: "Interessada em landing page para personal",
    origemLead: "WhatsApp",
    ultimoContato: "2024-02-28",
    createdAt: "2024-02-28",
    projetos: 0,
    propostas: 1,
  },
  {
    id: "6",
    nome: "Clínica Vida",
    email: "atendimento@clinicavida.med.br",
    telefone: "(85) 3333-4444",
    empresa: "Clínica Vida",
    site: null,
    tipo: "PJ",
    status: "PROSPECT",
    faturamentoTotal: 0,
    rating: 0,
    tags: ["Saúde"],
    notas: "Aguardando proposta",
    origemLead: "Indicação",
    ultimoContato: "2024-02-25",
    createdAt: "2024-02-20",
    projetos: 0,
    propostas: 0,
  },
  {
    id: "7",
    nome: "Academia Fit",
    email: "contato@academiafit.com",
    telefone: "(85) 98888-7777",
    empresa: "Academia Fit",
    site: null,
    tipo: "PJ",
    status: "PROSPECT",
    faturamentoTotal: 0,
    rating: 0,
    tags: ["Fitness", "Saúde"],
    notas: "Interessado em sistema de agendamento",
    origemLead: "Instagram",
    ultimoContato: "2024-02-22",
    createdAt: "2024-02-22",
    projetos: 0,
    propostas: 0,
  },
];

/* ═══ CRUD ══════════════════════════════════════════════════════════════════ */

export function loadClientes(): Cliente[] {
  if (typeof window === "undefined") return defaultClientes;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : defaultClientes;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultClientes));
    return defaultClientes;
  } catch {
    return defaultClientes;
  }
}

export function saveClientes(clientes: Cliente[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
}

export function addCliente(c: Cliente): Cliente[] {
  const all = loadClientes();
  all.unshift(c);
  saveClientes(all);
  return all;
}

export function updateCliente(id: string, updates: Partial<Cliente>): Cliente[] {
  const all = loadClientes();
  const idx = all.findIndex((c) => c.id === id);
  if (idx >= 0) all[idx] = { ...all[idx], ...updates };
  saveClientes(all);
  return all;
}

export function deleteCliente(id: string): Cliente[] {
  const all = loadClientes().filter((c) => c.id !== id);
  saveClientes(all);
  return all;
}

/* ═══ Helpers ═══════════════════════════════════════════════════════════════ */

export function getClienteStats(clientes: Cliente[]) {
  return {
    total: clientes.length,
    ativos: clientes.filter((c) => c.status === "ATIVO").length,
    leads: clientes.filter((c) => c.status === "LEAD").length,
    prospects: clientes.filter((c) => c.status === "PROSPECT").length,
    negociando: clientes.filter((c) => c.status === "NEGOCIANDO").length,
    faturamentoTotal: clientes.reduce((acc, c) => acc + (c.faturamentoTotal || 0), 0),
  };
}
