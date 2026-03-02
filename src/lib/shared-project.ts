// ══════════════════════════════════════════════════════════════════════════════
// 🔗 SharedProject — Estado compartilhado entre Admin e Portal do Cliente
// Usa localStorage como "banco" para funcionar sem DB rodando
// ══════════════════════════════════════════════════════════════════════════════

export interface ProjetoFase {
  id: number;
  name: string;
  status: "completed" | "in_progress" | "pending";
  date: string;
  description: string;
}

export interface ProjetoArquivo {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  uploadedBy: "admin" | "cliente";
  url?: string; // data URL for small files or external URL
}

export interface ProjetoMensagem {
  id: string;
  from: "Emmanuel" | "Cliente";
  date: string;
  message: string;
}

export interface ProjetoCliente {
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
  files: ProjetoArquivo[];
  messages: ProjetoMensagem[];
  nextSteps: string[];
  accessCode: string;
}

const STORAGE_KEY = "eb-client-projects";

// Projeto demo padrão
const defaultProject: ProjetoCliente = {
  id: "PRJ-2024-001",
  name: "Landing Page — Myka Procópio",
  clienteNome: "Myka Procópio",
  clienteEmail: "myka@email.com",
  status: "in_progress",
  package: "Pro",
  startDate: "2024-01-15",
  expectedDelivery: "2024-02-05",
  progress: 65,
  investment: "R$ 5.500",
  paid: "R$ 2.750",
  remaining: "R$ 2.750",
  phases: [
    { id: 1, name: "Briefing & Discovery", status: "completed", date: "15/01", description: "Levantamento de requisitos e definição de escopo" },
    { id: 2, name: "Wireframes & UX", status: "completed", date: "18/01", description: "Estrutura visual e fluxo de navegação" },
    { id: 3, name: "Design Visual", status: "completed", date: "22/01", description: "Layout final com identidade visual" },
    { id: 4, name: "Desenvolvimento", status: "in_progress", date: "25/01", description: "Codificação e implementação de funcionalidades" },
    { id: 5, name: "Testes & QA", status: "pending", date: "01/02", description: "Validação de qualidade e correção de bugs" },
    { id: 6, name: "Entrega Final", status: "pending", date: "05/02", description: "Deploy e documentação de acesso" },
  ],
  files: [
    { id: "f1", name: "Briefing_Aprovado.pdf", type: "pdf", date: "15/01", size: "245 KB", uploadedBy: "admin" },
    { id: "f2", name: "Wireframe_v1.fig", type: "design", date: "18/01", size: "1.2 MB", uploadedBy: "admin" },
    { id: "f3", name: "Design_Final.fig", type: "design", date: "22/01", size: "3.5 MB", uploadedBy: "admin" },
  ],
  messages: [
    { id: "m1", from: "Emmanuel", date: "25/01 14:30", message: "Design aprovado! Iniciando desenvolvimento." },
    { id: "m2", from: "Cliente", date: "24/01 10:15", message: "Adorei o design, pode prosseguir!" },
    { id: "m3", from: "Emmanuel", date: "22/01 16:00", message: "Design visual concluído. Por favor, revise e aprove." },
  ],
  nextSteps: [
    "Aguardar conclusão do desenvolvimento (previsão: 30/01)",
    "Revisar versão de homologação",
    "Aprovar para deploy em produção",
  ],
  accessCode: "demo",
};

export function loadProjects(): ProjetoCliente[] {
  if (typeof window === "undefined") return [defaultProject];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : [defaultProject];
    }
    // Inicializar com projeto demo
    localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultProject]));
    return [defaultProject];
  } catch {
    return [defaultProject];
  }
}

export function saveProjects(projects: ProjetoCliente[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProjectByCode(code: string): ProjetoCliente | undefined {
  const projects = loadProjects();
  return projects.find(
    (p) => p.accessCode.toLowerCase() === code.toLowerCase() || p.id.toLowerCase() === code.toLowerCase()
  );
}

export function updateProject(updated: ProjetoCliente) {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === updated.id);
  if (idx >= 0) {
    projects[idx] = updated;
  } else {
    projects.push(updated);
  }
  saveProjects(projects);
}

export function addMessage(projectId: string, msg: ProjetoMensagem) {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === projectId);
  if (project) {
    project.messages.unshift(msg);
    saveProjects(projects);
  }
}

export function addFile(projectId: string, file: ProjetoArquivo) {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === projectId);
  if (project) {
    project.files.push(file);
    saveProjects(projects);
  }
}

export function genId() {
  return Math.random().toString(36).slice(2, 9);
}
