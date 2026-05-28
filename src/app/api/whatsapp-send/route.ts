import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { getEvolutionConfig, getEvolutionState, sendEvolutionText } from "@/lib/evolution";

const templates = [
  {
    id: "entrada",
    nome: "Entrada / Boas-vindas",
    mensagem:
      "Ola {nome}, aqui e o Emmanuel. Vi seu contato pelo site e ja consigo te orientar sobre o melhor caminho para captar mais clientes com uma presenca digital profissional. Me fala rapidinho: qual nicho da sua agencia/negocio hoje?",
  },
  {
    id: "qualificado",
    nome: "Qualificacao",
    mensagem:
      "Boa, {nome}. Para eu fechar um diagnostico certeiro, me manda: objetivo principal, publico-alvo, oferta e prazo ideal. Com isso eu te respondo com o caminho e uma estimativa.",
  },
  {
    id: "proposta",
    nome: "Proposta aberta",
    mensagem:
      "{nome}, montei o direcionamento do projeto. A ideia e transformar sua primeira dobra e seu funil em uma maquina de gerar conversa qualificada. Quer que eu te envie o orcamento por aqui?",
  },
  {
    id: "reativacao",
    nome: "Reativacao",
    mensagem:
      "Ola {nome}, passando para retomar nosso papo. Se ainda fizer sentido melhorar site, oferta ou funil da agencia, eu consigo te mostrar um plano objetivo ainda hoje.",
  },
  {
    id: "fechamento",
    nome: "Fechamento",
    mensagem:
      "{nome}, consigo reservar a janela de producao para seu projeto. Posso te mandar o proximo passo e as condicoes para iniciar?",
  },
];

function applyTemplate(message: string, data: Record<string, string>) {
  return message.replace(/\{(\w+)\}/g, (_, key) => data[key] || "");
}

async function createChatLog(clienteId: string | undefined, message: string) {
  if (!clienteId || !message) return;

  const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
  if (!cliente) return;

  const conversa =
    (await prisma.chatConversa.findFirst({ where: { clienteId, status: "ativo" } })) ||
    (await prisma.chatConversa.create({
      data: {
        id: `cliente-${clienteId}`,
        clienteId,
        clienteNome: cliente.nome,
        clienteEmail: cliente.email,
      },
    }));

  await prisma.chatMensagem.create({
    data: {
      conversaId: conversa.id,
      remetente: "admin",
      remetenteNome: "Emmanuel",
      conteudo: message,
      tipo: "whatsapp",
      lida: true,
    },
  });

  await prisma.chatConversa.update({
    where: { id: conversa.id },
    data: { updatedAt: new Date() },
  });

  await prisma.cliente.update({
    where: { id: clienteId },
    data: { ultimoContato: new Date() },
  });
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = (await request.json()) as {
      telefone?: string;
      mensagem?: string;
      templateId?: string;
      clienteId?: string;
      nome?: string;
      empresa?: string;
    };

    const template = templates.find((item) => item.id === body.templateId);
    const mensagem = applyTemplate(body.mensagem || template?.mensagem || "", {
      nome: body.nome || "tudo bem",
      empresa: body.empresa || "sua empresa",
    }).trim();

    if (!body.telefone || !mensagem) {
      return NextResponse.json({ error: "Telefone e mensagem sao obrigatorios" }, { status: 400 });
    }

    const result = await sendEvolutionText(body.telefone, mensagem);
    await createChatLog(body.clienteId, mensagem);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API WhatsApp Send]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao enviar mensagem" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  const config = await getEvolutionConfig();
  const state = await getEvolutionState(config);

  return NextResponse.json({
    templates,
    integration: {
      configured: config.configured,
      source: config.source,
      instance: config.instance,
      apiUrlConfigured: Boolean(config.apiUrl),
      apiKeyConfigured: Boolean(config.apiKey),
      state,
    },
  });
}
