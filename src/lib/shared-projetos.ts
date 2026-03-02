// ══════════════════════════════════════════════════════════════════════════════
// 📋 shared-projetos.ts — CRUD de Projetos via localStorage
// ══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = "eb-admin-projetos";

export type ProjetoStatus = "briefing" | "design" | "desenvolvimento" | "revisao" | "entregue";
export type ProjetoPrioridade = "baixa" | "media" | "alta" | "urgente";

export interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  clienteNome: string;
  clienteEmail: string;
  status: ProjetoStatus;
  prioridade: ProjetoPrioridade;
  valor: number;
  progresso: number;
  prazo: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const genId = () => `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ─── Dados padrão ─────────────────────────────────────────────────────────────
const d = (dias: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + dias);
  return dt.toISOString();
};

const defaultProjetos: Projeto[] = [
  {
    id: genId(),
    titulo: "Site Institucional — Myka Procópio",
    descricao: "Site institucional moderno com blog e sistema de agendamento",
    clienteNome: "Myka Procópio",
    clienteEmail: "myka@email.com",
    status: "revisao",
    prioridade: "alta",
    valor: 4500,
    progresso: 85,
    prazo: d(5),
    tags: ["Next.js", "Blog", "Agendamento"],
    createdAt: d(-20),
    updatedAt: d(-1),
  },
  {
    id: genId(),
    titulo: "E-commerce — Café Aroma",
    descricao: "Loja online com catálogo de cafés especiais e delivery",
    clienteNome: "Café Aroma",
    clienteEmail: "contato@cafearoma.com.br",
    status: "desenvolvimento",
    prioridade: "media",
    valor: 8500,
    progresso: 55,
    prazo: d(15),
    tags: ["E-commerce", "React", "Mercado Pago"],
    createdAt: d(-15),
    updatedAt: d(-2),
  },
  {
    id: genId(),
    titulo: "Landing Page — Academia Fit",
    descricao: "LP de alta conversão para captação de novos alunos",
    clienteNome: "Academia Fit",
    clienteEmail: "marketing@academiafit.com",
    status: "design",
    prioridade: "media",
    valor: 2500,
    progresso: 30,
    prazo: d(10),
    tags: ["Landing Page", "Figma", "Conversão"],
    createdAt: d(-8),
    updatedAt: d(-3),
  },
  {
    id: genId(),
    titulo: "App Delivery — Tech Solutions",
    descricao: "Plataforma web de delivery com painel administrativo",
    clienteNome: "Tech Solutions Ltda",
    clienteEmail: "dev@techsolutions.com.br",
    status: "desenvolvimento",
    prioridade: "urgente",
    valor: 12000,
    progresso: 40,
    prazo: d(8),
    tags: ["Web App", "Node.js", "PostgreSQL"],
    createdAt: d(-25),
    updatedAt: d(0),
  },
  {
    id: genId(),
    titulo: "Redesign Blog — João Silva",
    descricao: "Modernização do blog pessoal com sistema de SEO e newsletter",
    clienteNome: "João Silva",
    clienteEmail: "joao.silva@email.com",
    status: "briefing",
    prioridade: "baixa",
    valor: 3000,
    progresso: 10,
    prazo: d(25),
    tags: ["Blog", "SEO", "Newsletter"],
    createdAt: d(-3),
    updatedAt: d(-1),
  },
  {
    id: genId(),
    titulo: "Dashboard RH — Clínica Vida",
    descricao: "Painel de gestão de funcionários e escalas",
    clienteNome: "Clínica Vida",
    clienteEmail: "admin@clinicavida.com",
    status: "entregue",
    prioridade: "alta",
    valor: 6800,
    progresso: 100,
    prazo: d(-5),
    tags: ["Dashboard", "React", "Charts"],
    createdAt: d(-45),
    updatedAt: d(-5),
  },
  {
    id: genId(),
    titulo: "Portal Pacientes — Dr. André",
    descricao: "Sistema de agendamento e prontuário online",
    clienteNome: "Dr. André Martins",
    clienteEmail: "andre@clinica.med.br",
    status: "entregue",
    prioridade: "media",
    valor: 5500,
    progresso: 100,
    prazo: d(-12),
    tags: ["Saúde", "Portal", "NextAuth"],
    createdAt: d(-50),
    updatedAt: d(-12),
  },
];

// ─── CRUD Functions ───────────────────────────────────────────────────────────
export function loadProjetos(): Projeto[] {
  if (typeof window === "undefined") return defaultProjetos;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjetos));
      return defaultProjetos;
    }
    return JSON.parse(raw);
  } catch {
    return defaultProjetos;
  }
}

export function saveProjetos(projetos: Projeto[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projetos));
}

export function addProjeto(
  data: Omit<Projeto, "id" | "createdAt" | "updatedAt" | "progresso">
): Projeto {
  const projetos = loadProjetos();
  const novo: Projeto = {
    ...data,
    id: genId(),
    progresso: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveProjetos([novo, ...projetos]);
  return novo;
}

export function updateProjeto(id: string, data: Partial<Projeto>): Projeto | null {
  const projetos = loadProjetos();
  const idx = projetos.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  projetos[idx] = { ...projetos[idx], ...data, updatedAt: new Date().toISOString() };
  saveProjetos(projetos);
  return projetos[idx];
}

export function deleteProjeto(id: string) {
  const projetos = loadProjetos().filter((p) => p.id !== id);
  saveProjetos(projetos);
}

export function getProjetoStats(projetos: Projeto[]) {
  const ativos = projetos.filter((p) => p.status !== "entregue");
  const entregues = projetos.filter((p) => p.status === "entregue");
  const faturamentoTotal = projetos.reduce((s, p) => s + p.valor, 0);
  const faturamentoAtivos = ativos.reduce((s, p) => s + p.valor, 0);
  const ticketMedio = projetos.length > 0 ? faturamentoTotal / projetos.length : 0;
  const mediaProgresso = projetos.length > 0
    ? Math.round(projetos.reduce((s, p) => s + p.progresso, 0) / projetos.length)
    : 0;

  return { ativos, entregues, faturamentoTotal, faturamentoAtivos, ticketMedio, mediaProgresso };
}
