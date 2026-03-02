// ══════════════════════════════════════════════════════════════════════════════
// 💬 API Chat — Mensagens entre Admin e Clientes
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

// Em memória por enquanto (quando tiver banco, migra pra Prisma)
interface Mensagem {
  id: string;
  conversaId: string;
  remetente: "admin" | "cliente";
  remetenteNome: string;
  conteudo: string;
  tipo: "texto" | "arquivo" | "imagem" | "link";
  lida: boolean;
  createdAt: string;
}

interface Conversa {
  id: string;
  clienteId: string;
  clienteNome: string;
  clienteEmail: string;
  ultimaMensagem: string;
  ultimaHora: string;
  naoLidas: number;
  status: "ativo" | "arquivado";
}

// Storage em memória
const conversas: Map<string, Conversa> = new Map();
const mensagens: Map<string, Mensagem[]> = new Map();

// Seed inicial com dados demo
function seedDataIfEmpty() {
  if (conversas.size > 0) return;

  const demoConversas: Conversa[] = [
    {
      id: "conv-1",
      clienteId: "1",
      clienteNome: "Myka Procópio",
      clienteEmail: "contato@mykaprocopio.com.br",
      ultimaMensagem: "Oi Emmanuel, tudo bem? Gostei do design!",
      ultimaHora: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      naoLidas: 2,
      status: "ativo",
    },
    {
      id: "conv-2",
      clienteId: "3",
      clienteNome: "Tech Solutions",
      clienteEmail: "projetos@techsolutions.io",
      ultimaMensagem: "Quando teremos a versão beta do dashboard?",
      ultimaHora: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      naoLidas: 1,
      status: "ativo",
    },
    {
      id: "conv-3",
      clienteId: "2",
      clienteNome: "João Silva",
      clienteEmail: "joao@advocaciasilva.com.br",
      ultimaMensagem: "Perfeito, aprovado! Pode seguir com o deploy.",
      ultimaHora: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      naoLidas: 0,
      status: "ativo",
    },
    {
      id: "conv-4",
      clienteId: "4",
      clienteNome: "Café Aroma",
      clienteEmail: "contato@cafearoma.com.br",
      ultimaMensagem: "Preciso de ajuda com o e-commerce",
      ultimaHora: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      naoLidas: 0,
      status: "ativo",
    },
  ];

  const demoMensagens: Record<string, Mensagem[]> = {
    "conv-1": [
      {
        id: "msg-1",
        conversaId: "conv-1",
        remetente: "admin",
        remetenteNome: "Emmanuel",
        conteudo: "Oi Myka! Acabei de finalizar o design da home. Vou te enviar o link de preview.",
        tipo: "texto",
        lida: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: "msg-2",
        conversaId: "conv-1",
        remetente: "admin",
        remetenteNome: "Emmanuel",
        conteudo: "https://preview.emmanuelbezerra.dev/myka-procopio",
        tipo: "link",
        lida: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      },
      {
        id: "msg-3",
        conversaId: "conv-1",
        remetente: "cliente",
        remetenteNome: "Myka Procópio",
        conteudo: "Oi Emmanuel, tudo bem? Gostei muito do design! As cores ficaram lindas 💜",
        tipo: "texto",
        lida: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: "msg-4",
        conversaId: "conv-1",
        remetente: "cliente",
        remetenteNome: "Myka Procópio",
        conteudo: "Só queria pedir pra trocar a foto do banner por essa aqui que mandei no WhatsApp",
        tipo: "texto",
        lida: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      },
    ],
    "conv-2": [
      {
        id: "msg-5",
        conversaId: "conv-2",
        remetente: "cliente",
        remetenteNome: "Tech Solutions",
        conteudo: "Quando teremos a versão beta do dashboard?",
        tipo: "texto",
        lida: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
    "conv-3": [
      {
        id: "msg-6",
        conversaId: "conv-3",
        remetente: "admin",
        remetenteNome: "Emmanuel",
        conteudo: "João, a landing page está pronta! Dá uma olhada: https://preview.site/joao-advocacia",
        tipo: "texto",
        lida: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: "msg-7",
        conversaId: "conv-3",
        remetente: "cliente",
        remetenteNome: "João Silva",
        conteudo: "Perfeito, aprovado! Pode seguir com o deploy.",
        tipo: "texto",
        lida: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ],
    "conv-4": [
      {
        id: "msg-8",
        conversaId: "conv-4",
        remetente: "cliente",
        remetenteNome: "Café Aroma",
        conteudo: "Preciso de ajuda com o e-commerce, estou com dúvidas sobre a integração com o PagSeguro",
        tipo: "texto",
        lida: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
    ],
  };

  demoConversas.forEach((c) => conversas.set(c.id, c));
  Object.entries(demoMensagens).forEach(([id, msgs]) => mensagens.set(id, msgs));
}

// GET — Listar conversas ou mensagens de uma conversa
export async function GET(request: NextRequest) {
  seedDataIfEmpty();

  const { searchParams } = new URL(request.url);
  const conversaId = searchParams.get("conversaId");

  if (conversaId) {
    // Retornar mensagens de uma conversa
    const msgs = mensagens.get(conversaId) || [];
    return NextResponse.json(msgs);
  }

  // Retornar lista de conversas
  const lista = Array.from(conversas.values()).sort(
    (a, b) => new Date(b.ultimaHora).getTime() - new Date(a.ultimaHora).getTime()
  );
  return NextResponse.json(lista);
}

// POST — Enviar mensagem
export async function POST(request: NextRequest) {
  seedDataIfEmpty();

  const body = await request.json();
  const { conversaId, conteudo, remetente = "admin", remetenteNome = "Emmanuel", tipo = "texto" } = body;

  if (!conversaId || !conteudo) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const novaMensagem: Mensagem = {
    id: `msg-${Date.now()}`,
    conversaId,
    remetente,
    remetenteNome,
    conteudo,
    tipo,
    lida: remetente === "admin",
    createdAt: new Date().toISOString(),
  };

  // Adicionar mensagem
  const msgs = mensagens.get(conversaId) || [];
  msgs.push(novaMensagem);
  mensagens.set(conversaId, msgs);

  // Atualizar conversa
  const conversa = conversas.get(conversaId);
  if (conversa) {
    conversa.ultimaMensagem = conteudo;
    conversa.ultimaHora = novaMensagem.createdAt;
    if (remetente === "cliente") {
      conversa.naoLidas += 1;
    }
  }

  // Emitir evento SSE
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    await fetch(`${baseUrl}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "mensagem_chat",
        data: {
          conversaId,
          mensagem: novaMensagem,
          clienteNome: conversa?.clienteNome,
        },
      }),
    });
  } catch {}

  return NextResponse.json(novaMensagem, { status: 201 });
}

// PATCH — Marcar mensagens como lidas
export async function PATCH(request: NextRequest) {
  seedDataIfEmpty();

  const body = await request.json();
  const { conversaId } = body;

  if (!conversaId) {
    return NextResponse.json({ error: "conversaId obrigatório" }, { status: 400 });
  }

  const msgs = mensagens.get(conversaId) || [];
  msgs.forEach((m) => {
    if (m.remetente === "cliente") m.lida = true;
  });

  const conversa = conversas.get(conversaId);
  if (conversa) {
    conversa.naoLidas = 0;
  }

  return NextResponse.json({ ok: true });
}
