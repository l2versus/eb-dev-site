import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEvolutionText } from "@/lib/evolution";

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function phoneFromJid(value: string) {
  return value.replace(/@.+$/, "").replace(/\D/g, "");
}

function extractPayload(body: any) {
  const data = body?.data || body;
  const key = data?.key || data?.message?.key || {};
  const message = data?.message || data?.messages?.[0]?.message || body?.message || {};
  const text = firstString(
    message?.conversation,
    message?.extendedTextMessage?.text,
    message?.text,
    data?.message?.conversation,
    body?.text
  );
  const remoteJid = firstString(
    key?.remoteJid,
    data?.remoteJid,
    data?.sender,
    body?.remoteJid,
    body?.sender
  );

  return {
    text,
    fromMe: Boolean(key?.fromMe || data?.fromMe || body?.fromMe),
    phone: phoneFromJid(remoteJid),
    pushName: firstString(data?.pushName, data?.senderName, body?.pushName, body?.senderName),
    event: firstString(body?.event, body?.type),
  };
}

function botReply(text: string, name: string) {
  const normalized = text.toLowerCase();
  if (normalized.includes("orcamento") || normalized.includes("orçamento") || normalized.includes("preco") || normalized.includes("preço")) {
    return `Ola ${name}, boa. Para montar o orcamento certo, me responde com: nicho, objetivo do site/funil, prazo e referencia visual. Eu te devolvo um diagnostico direto.`;
  }

  if (normalized.includes("site") || normalized.includes("landing") || normalized.includes("agencia") || normalized.includes("agência")) {
    return `Perfeito, ${name}. Meu foco aqui e criar site/funil para agencia e negocio que precisa vender mais no primeiro contato. Me manda o link atual ou uma referencia do que voce quer construir.`;
  }

  return "";
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.EVOLUTION_WEBHOOK_SECRET;
  const receivedSecret =
    request.headers.get("x-webhook-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    new URL(request.url).searchParams.get("secret");

  if (expectedSecret && receivedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Webhook nao autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = extractPayload(body);

    if (!payload.phone || !payload.text || payload.fromMe) {
      return NextResponse.json({ ok: true, ignored: true, event: payload.event });
    }

    const lastDigits = payload.phone.slice(-8);
    const existing = await prisma.cliente.findFirst({
      where: {
        OR: [
          { email: `${payload.phone}@whatsapp.local` },
          { telefone: { contains: lastDigits } },
        ],
      },
    });

    const cliente =
      existing ||
      (await prisma.cliente.create({
        data: {
          nome: payload.pushName || `Lead WhatsApp ${payload.phone.slice(-4)}`,
          email: `${payload.phone}@whatsapp.local`,
          telefone: payload.phone,
          tipo: "PF",
          status: "LEAD",
          origemLead: "whatsapp",
          tags: ["whatsapp", "bot"],
          notas: `Mensagem inicial: ${payload.text}`,
          ultimoContato: new Date(),
        },
      }));

    if (cliente.status === "LEAD") {
      await prisma.cliente.update({
        where: { id: cliente.id },
        data: { ultimoContato: new Date() },
      });
    }

    const conversa =
      (await prisma.chatConversa.findFirst({ where: { clienteId: cliente.id, status: "ativo" } })) ||
      (await prisma.chatConversa.create({
        data: {
          id: `cliente-${cliente.id}`,
          clienteId: cliente.id,
          clienteNome: cliente.nome,
          clienteEmail: cliente.email,
        },
      }));

    await prisma.chatMensagem.create({
      data: {
        conversaId: conversa.id,
        remetente: "cliente",
        remetenteNome: cliente.nome,
        conteudo: payload.text,
        tipo: "whatsapp",
        lida: false,
      },
    });

    await prisma.chatConversa.update({
      where: { id: conversa.id },
      data: { updatedAt: new Date() },
    });

    const reply = botReply(payload.text, cliente.nome.split(" ")[0] || "tudo bem");
    if (reply) {
      const result = await sendEvolutionText(payload.phone, reply);
      if (result.method === "api") {
        await prisma.chatMensagem.create({
          data: {
            conversaId: conversa.id,
            remetente: "admin",
            remetenteNome: "Bot Emmanuel",
            conteudo: reply,
            tipo: "bot",
            lida: true,
          },
        });
      }
    }

    return NextResponse.json({ ok: true, clienteId: cliente.id, conversaId: conversa.id, bot: Boolean(reply) });
  } catch (error) {
    console.error("[Evolution Webhook]", error);
    return NextResponse.json({ error: "Erro no webhook Evolution" }, { status: 500 });
  }
}
