// ══════════════════════════════════════════════════════════════════════════════
// 💬 shared-chat.ts — CRUD de Conversas e Mensagens via localStorage
// ══════════════════════════════════════════════════════════════════════════════

const CONV_KEY = "eb-admin-conversas";
const MSG_KEY = "eb-admin-mensagens";

export interface Conversa {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteEmail: string;
  ultimaMensagem: string;
  ultimaHora: string;
  naoLidas: number;
  status: string;
}

export interface Mensagem {
  id: string;
  conversaId: string;
  remetente: "admin" | "cliente";
  remetenteNome: string;
  conteudo: string;
  tipo: string;
  lida: boolean;
  createdAt: string;
}

const genId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ─── horas atrás ──────────────────────────────────────────────────────────────
const h = (hoursAgo: number) =>
  new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

// ─── Dados de demonstração ────────────────────────────────────────────────────
const defaultConversas: Conversa[] = [
  {
    id: "conv-1",
    clienteId: "cli-1",
    clienteNome: "Myka Procópio",
    clienteEmail: "myka@email.com",
    ultimaMensagem: "Amei o layout! Só queria ajustar a cor do botão principal",
    ultimaHora: h(0.5),
    naoLidas: 2,
    status: "ativo",
  },
  {
    id: "conv-2",
    clienteId: "cli-2",
    clienteNome: "João Silva",
    clienteEmail: "joao.silva@email.com",
    ultimaMensagem: "Quando podemos agendar a reunião de briefing?",
    ultimaHora: h(2),
    naoLidas: 1,
    status: "ativo",
  },
  {
    id: "conv-3",
    clienteId: "cli-3",
    clienteNome: "Tech Solutions",
    clienteEmail: "dev@techsolutions.com.br",
    ultimaMensagem: "O deploy do app ficou perfeito, obrigado!",
    ultimaHora: h(5),
    naoLidas: 0,
    status: "ativo",
  },
  {
    id: "conv-4",
    clienteId: "cli-4",
    clienteNome: "Café Aroma",
    clienteEmail: "contato@cafearoma.com.br",
    ultimaMensagem: "Preciso adicionar 3 novos produtos no catálogo",
    ultimaHora: h(8),
    naoLidas: 3,
    status: "ativo",
  },
  {
    id: "conv-5",
    clienteId: "cli-5",
    clienteNome: "Marina Costa",
    clienteEmail: "marina@startup.io",
    ultimaMensagem: "Podemos marcar para segunda?",
    ultimaHora: h(24),
    naoLidas: 0,
    status: "ativo",
  },
];

const defaultMensagens: Record<string, Mensagem[]> = {
  "conv-1": [
    { id: "m1-1", conversaId: "conv-1", remetente: "cliente", remetenteNome: "Myka Procópio", conteudo: "Oi Emmanuel! Tudo bem?", tipo: "texto", lida: true, createdAt: h(3) },
    { id: "m1-2", conversaId: "conv-1", remetente: "admin", remetenteNome: "Emmanuel", conteudo: "Oi Myka! Tudo ótimo, e contigo?", tipo: "texto", lida: true, createdAt: h(2.8) },
    { id: "m1-3", conversaId: "conv-1", remetente: "cliente", remetenteNome: "Myka Procópio", conteudo: "Recebi o link do preview do site, ficou incrível!", tipo: "texto", lida: true, createdAt: h(2.5) },
    { id: "m1-4", conversaId: "conv-1", remetente: "admin", remetenteNome: "Emmanuel", conteudo: "Que bom que gostou! Tem algo que queira ajustar?", tipo: "texto", lida: true, createdAt: h(2) },
    { id: "m1-5", conversaId: "conv-1", remetente: "cliente", remetenteNome: "Myka Procópio", conteudo: "Amei o layout! Só queria ajustar a cor do botão principal", tipo: "texto", lida: false, createdAt: h(0.5) },
    { id: "m1-6", conversaId: "conv-1", remetente: "cliente", remetenteNome: "Myka Procópio", conteudo: "Pode trocar pra um rosa mais escuro? Tipo #d63384", tipo: "texto", lida: false, createdAt: h(0.4) },
  ],
  "conv-2": [
    { id: "m2-1", conversaId: "conv-2", remetente: "cliente", remetenteNome: "João Silva", conteudo: "Olá! Vi seu portfólio e fiquei interessado", tipo: "texto", lida: true, createdAt: h(6) },
    { id: "m2-2", conversaId: "conv-2", remetente: "admin", remetenteNome: "Emmanuel", conteudo: "Oi João! Obrigado pelo interesse. Qual tipo de projeto você precisa?", tipo: "texto", lida: true, createdAt: h(5) },
    { id: "m2-3", conversaId: "conv-2", remetente: "cliente", remetenteNome: "João Silva", conteudo: "Preciso de um redesign completo do meu blog", tipo: "texto", lida: true, createdAt: h(4) },
    { id: "m2-4", conversaId: "conv-2", remetente: "admin", remetenteNome: "Emmanuel", conteudo: "Perfeito! Podemos agendar uma call para entender melhor o escopo.", tipo: "texto", lida: true, createdAt: h(3.5) },
    { id: "m2-5", conversaId: "conv-2", remetente: "cliente", remetenteNome: "João Silva", conteudo: "Quando podemos agendar a reunião de briefing?", tipo: "texto", lida: false, createdAt: h(2) },
  ],
  "conv-3": [
    { id: "m3-1", conversaId: "conv-3", remetente: "admin", remetenteNome: "Emmanuel", conteudo: "O deploy do app foi finalizado! Segue o link: https://app.techsolutions.com.br", tipo: "texto", lida: true, createdAt: h(8) },
    { id: "m3-2", conversaId: "conv-3", remetente: "cliente", remetenteNome: "Tech Solutions", conteudo: "O deploy do app ficou perfeito, obrigado!", tipo: "texto", lida: true, createdAt: h(5) },
  ],
  "conv-4": [
    { id: "m4-1", conversaId: "conv-4", remetente: "cliente", remetenteNome: "Café Aroma", conteudo: "Bom dia! Temos novos cafés especiais para o site", tipo: "texto", lida: true, createdAt: h(12) },
    { id: "m4-2", conversaId: "conv-4", remetente: "admin", remetenteNome: "Emmanuel", conteudo: "Bom dia! Me mande as fotos e descrições que eu adiciono", tipo: "texto", lida: true, createdAt: h(11) },
    { id: "m4-3", conversaId: "conv-4", remetente: "cliente", remetenteNome: "Café Aroma", conteudo: "Preciso adicionar 3 novos produtos no catálogo", tipo: "texto", lida: false, createdAt: h(8) },
  ],
  "conv-5": [
    { id: "m5-1", conversaId: "conv-5", remetente: "cliente", remetenteNome: "Marina Costa", conteudo: "Oi! Gostaria de saber sobre desenvolvimento de MVP", tipo: "texto", lida: true, createdAt: h(48) },
    { id: "m5-2", conversaId: "conv-5", remetente: "admin", remetenteNome: "Emmanuel", conteudo: "Oi Marina! Trabalho bastante com MVPs. Podemos conversar sobre seu projeto?", tipo: "texto", lida: true, createdAt: h(46) },
    { id: "m5-3", conversaId: "conv-5", remetente: "cliente", remetenteNome: "Marina Costa", conteudo: "Podemos marcar para segunda?", tipo: "texto", lida: true, createdAt: h(24) },
  ],
};

// ─── Load / Save ──────────────────────────────────────────────────────────────
export function loadConversas(): Conversa[] {
  if (typeof window === "undefined") return defaultConversas;
  try {
    const raw = localStorage.getItem(CONV_KEY);
    if (!raw) {
      localStorage.setItem(CONV_KEY, JSON.stringify(defaultConversas));
      return defaultConversas;
    }
    return JSON.parse(raw);
  } catch {
    return defaultConversas;
  }
}

function saveConversas(conv: Conversa[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONV_KEY, JSON.stringify(conv));
}

function loadAllMensagens(): Record<string, Mensagem[]> {
  if (typeof window === "undefined") return defaultMensagens;
  try {
    const raw = localStorage.getItem(MSG_KEY);
    if (!raw) {
      localStorage.setItem(MSG_KEY, JSON.stringify(defaultMensagens));
      return defaultMensagens;
    }
    return JSON.parse(raw);
  } catch {
    return defaultMensagens;
  }
}

function saveAllMensagens(msgs: Record<string, Mensagem[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MSG_KEY, JSON.stringify(msgs));
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────
export function loadMensagens(conversaId: string): Mensagem[] {
  const all = loadAllMensagens();
  return all[conversaId] || [];
}

export function enviarMensagem(
  conversaId: string,
  conteudo: string,
  remetente: "admin" | "cliente" = "admin",
  remetenteNome = "Emmanuel"
): Mensagem {
  const all = loadAllMensagens();
  const msg: Mensagem = {
    id: genId(),
    conversaId,
    remetente,
    remetenteNome,
    conteudo,
    tipo: "texto",
    lida: remetente === "admin",
    createdAt: new Date().toISOString(),
  };

  if (!all[conversaId]) all[conversaId] = [];
  all[conversaId].push(msg);
  saveAllMensagens(all);

  // Atualizar conversa
  const conversas = loadConversas();
  const idx = conversas.findIndex((c) => c.id === conversaId);
  if (idx >= 0) {
    conversas[idx].ultimaMensagem = conteudo;
    conversas[idx].ultimaHora = msg.createdAt;
    if (remetente === "cliente") {
      conversas[idx].naoLidas += 1;
    }
    saveConversas(conversas);
  }

  return msg;
}

export function marcarComoLida(conversaId: string) {
  // Marcar mensagens
  const all = loadAllMensagens();
  if (all[conversaId]) {
    all[conversaId] = all[conversaId].map((m) => ({ ...m, lida: true }));
    saveAllMensagens(all);
  }

  // Zerar não lidas
  const conversas = loadConversas();
  const idx = conversas.findIndex((c) => c.id === conversaId);
  if (idx >= 0) {
    conversas[idx].naoLidas = 0;
    saveConversas(conversas);
  }
}

export function getChatStats(conversas: Conversa[]) {
  const totalNaoLidas = conversas.reduce((acc, c) => acc + c.naoLidas, 0);
  return { totalNaoLidas, totalConversas: conversas.length };
}
