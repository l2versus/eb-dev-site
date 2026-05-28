import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function mapMensagem(mensagem: any) {
  return {
    id: mensagem.id,
    conversaId: mensagem.conversaId,
    remetente: mensagem.remetente,
    remetenteNome: mensagem.remetenteNome,
    conteudo: mensagem.conteudo,
    tipo: mensagem.tipo,
    lida: mensagem.lida,
    createdAt: mensagem.createdAt.toISOString(),
  };
}

function mapConversa(conversa: any) {
  const latest = conversa.mensagens?.[0];
  const mensagens = conversa.todasMensagens || conversa.mensagens || [];

  return {
    id: conversa.id,
    clienteId: conversa.clienteId || "",
    clienteNome: conversa.cliente?.nome || conversa.clienteNome,
    clienteEmail: conversa.cliente?.email || conversa.clienteEmail,
    ultimaMensagem: latest?.conteudo || "",
    ultimaHora: latest?.createdAt?.toISOString?.() || conversa.updatedAt.toISOString(),
    naoLidas: mensagens.filter((m: any) => m.remetente === "cliente" && !m.lida).length,
    status: conversa.status || "ativo",
  };
}

export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const { searchParams } = new URL(request.url);
    const conversaId = searchParams.get("conversaId");

    if (conversaId) {
      const mensagens = await prisma.chatMensagem.findMany({
        where: { conversaId },
        orderBy: { createdAt: "asc" },
      });

      return NextResponse.json(mensagens.map(mapMensagem));
    }

    const conversas = await prisma.chatConversa.findMany({
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        mensagens: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const unreadByConversation = await prisma.chatMensagem.findMany({
      where: {
        remetente: "cliente",
        lida: false,
      },
      select: {
        conversaId: true,
      },
    });
    const unreadMap = unreadByConversation.reduce<Record<string, number>>((acc, msg) => {
      acc[msg.conversaId] = (acc[msg.conversaId] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json(
      conversas.map((conversa) => ({
        ...mapConversa(conversa),
        naoLidas: unreadMap[conversa.id] || 0,
      })),
    );
  } catch (error) {
    console.error("[API Chat GET]", error);
    return NextResponse.json({ error: "Erro ao buscar chat" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    let conversaId = readString(body.conversaId);
    const clienteId = readString(body.clienteId);
    const conteudo = readString(body.conteudo);
    const remetente = readString(body.remetente, "admin");
    const remetenteNome = readString(body.remetenteNome, "Emmanuel");
    const tipo = readString(body.tipo, "texto");

    if (!conteudo) {
      return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    }

    if (!conversaId && clienteId) {
      const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
      if (!cliente) return NextResponse.json({ error: "Cliente nao encontrado" }, { status: 404 });

      const conversaExistente = await prisma.chatConversa.findFirst({
        where: { clienteId, status: "ativo" },
      });
      const conversa = conversaExistente || await prisma.chatConversa.create({
        data: {
          id: `cliente-${clienteId}`,
          clienteId,
          clienteNome: cliente.nome,
          clienteEmail: cliente.email,
        },
      });
      conversaId = conversa.id;
    }

    if (!conversaId) {
      return NextResponse.json({ error: "Conversa obrigatoria" }, { status: 400 });
    }

    const mensagem = await prisma.chatMensagem.create({
      data: {
        conversaId,
        remetente,
        remetenteNome,
        conteudo,
        tipo,
        lida: remetente === "admin",
      },
    });

    await prisma.chatConversa.update({
      where: { id: conversaId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(mapMensagem(mensagem), { status: 201 });
  } catch (error) {
    console.error("[API Chat POST]", error);
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const conversaId = readString(body.conversaId);

    if (!conversaId) {
      return NextResponse.json({ error: "conversaId obrigatorio" }, { status: 400 });
    }

    await prisma.chatMensagem.updateMany({
      where: {
        conversaId,
        remetente: "cliente",
      },
      data: { lida: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[API Chat PATCH]", error);
    return NextResponse.json({ error: "Erro ao marcar mensagens" }, { status: 500 });
  }
}
