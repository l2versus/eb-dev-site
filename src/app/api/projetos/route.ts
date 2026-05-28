import { NextRequest, NextResponse } from "next/server";
import { StatusProjeto } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

type ProjetoStatusFront = "briefing" | "design" | "desenvolvimento" | "revisao" | "entregue";
type ProjetoPrioridade = "baixa" | "media" | "alta" | "urgente";

const statusToDb: Record<ProjetoStatusFront, StatusProjeto> = {
  briefing: StatusProjeto.BRIEFING,
  design: StatusProjeto.PROPOSTA_ENVIADA,
  desenvolvimento: StatusProjeto.EM_DESENVOLVIMENTO,
  revisao: StatusProjeto.REVISAO,
  entregue: StatusProjeto.ENTREGUE,
};

const statusFromDb: Record<string, ProjetoStatusFront> = {
  BRIEFING: "briefing",
  PROPOSTA_ENVIADA: "design",
  AGUARDANDO_PAGAMENTO: "design",
  EM_DESENVOLVIMENTO: "desenvolvimento",
  AJUSTES: "desenvolvimento",
  REVISAO: "revisao",
  ENTREGUE: "entregue",
  CANCELADO: "entregue",
  PAUSADO: "briefing",
};

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function readNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readTags(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => readString(item)).filter(Boolean);
  const text = readString(value);
  return text ? text.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

function readMeta(notas?: string | null): { prioridade: ProjetoPrioridade; notas?: string } {
  if (!notas) return { prioridade: "media" };

  try {
    const parsed = JSON.parse(notas) as { __adminMeta?: boolean; prioridade?: ProjetoPrioridade; notas?: string };
    if (parsed.__adminMeta) {
      return {
        prioridade: parsed.prioridade || "media",
        notas: parsed.notas || "",
      };
    }
  } catch {
    // Keep legacy plain notes readable.
  }

  return { prioridade: "media", notas };
}

function writeMeta(prioridade: ProjetoPrioridade, notas?: string | null) {
  return JSON.stringify({
    __adminMeta: true,
    prioridade,
    notas: notas || "",
  });
}

function mapProjeto(projeto: any) {
  const meta = readMeta(projeto.notas);

  return {
    id: projeto.id,
    titulo: projeto.nome,
    descricao: projeto.descricao || "",
    clienteNome: projeto.cliente?.nome || "",
    clienteEmail: projeto.cliente?.email || "",
    status: statusFromDb[projeto.status] || "briefing",
    prioridade: meta.prioridade,
    valor: Number(projeto.valor || 0),
    progresso: projeto.progresso || 0,
    prazo: projeto.prazoEntrega ? projeto.prazoEntrega.toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
    tags: projeto.tecnologias || [],
    arquivos: (projeto.arquivos || []).map((arquivo: any) => ({
      id: arquivo.id,
      nome: arquivo.nome,
      url: arquivo.url,
      tipo: arquivo.tipo,
      tamanho: arquivo.tamanho || 0,
      createdAt: arquivo.createdAt?.toISOString?.() || new Date().toISOString(),
    })),
    createdAt: projeto.createdAt?.toISOString?.() || new Date().toISOString(),
    updatedAt: projeto.updatedAt?.toISOString?.() || new Date().toISOString(),
  };
}

async function ensureCliente(body: Record<string, unknown>, currentClienteId?: string) {
  const nome = readString(body.clienteNome, "Cliente sem nome");
  const email = readString(body.clienteEmail).toLowerCase();

  if (currentClienteId && !email) return currentClienteId;

  if (!email) {
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email: `cliente-${Date.now()}@sem-email.local`,
        status: "NEGOCIANDO",
        origemLead: "admin-projetos",
      },
    });
    return cliente.id;
  }

  const cliente = await prisma.cliente.upsert({
    where: { email },
    update: {
      nome,
      status: "NEGOCIANDO",
      origemLead: "admin-projetos",
      ultimoContato: new Date(),
    },
    create: {
      nome,
      email,
      status: "NEGOCIANDO",
      origemLead: "admin-projetos",
      ultimoContato: new Date(),
    },
  });

  return cliente.id;
}

export async function GET() {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const projetos = await prisma.projeto.findMany({
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        arquivos: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(projetos.map(mapProjeto));
  } catch (error) {
    console.error("[API Projetos GET]", error);
    return NextResponse.json({ error: "Erro ao buscar projetos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const clienteId = await ensureCliente(body);
    const status = readString(body.status, "briefing") as ProjetoStatusFront;
    const prioridade = (readString(body.prioridade, "media") as ProjetoPrioridade) || "media";
    const prazo = readString(body.prazo);

    const projeto = await prisma.projeto.create({
      data: {
        clienteId,
        nome: readString(body.titulo, "Novo Projeto"),
        descricao: readString(body.descricao) || null,
        tipo: "WEBAPP",
        valor: readNumber(body.valor, 0),
        progresso: Math.max(0, Math.min(100, Math.round(readNumber(body.progresso, 0)))),
        status: statusToDb[status] || StatusProjeto.BRIEFING,
        prazoEntrega: prazo ? new Date(prazo) : new Date(Date.now() + 30 * 86400000),
        tecnologias: readTags(body.tags),
        notas: writeMeta(prioridade),
      },
      include: { cliente: true, arquivos: true },
    });

    return NextResponse.json(mapProjeto(projeto), { status: 201 });
  } catch (error) {
    console.error("[API Projetos POST]", error);
    return NextResponse.json({ error: "Erro ao criar projeto" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = readString(body.id);
    if (!id) return NextResponse.json({ error: "ID obrigatorio" }, { status: 400 });

    const atual = await prisma.projeto.findUnique({ where: { id } });
    if (!atual) return NextResponse.json({ error: "Projeto nao encontrado" }, { status: 404 });

    const clienteId =
      body.clienteNome !== undefined || body.clienteEmail !== undefined
        ? await ensureCliente(body, atual.clienteId)
        : atual.clienteId;
    const status = body.status !== undefined ? (readString(body.status) as ProjetoStatusFront) : undefined;
    const prioridade =
      body.prioridade !== undefined
        ? (readString(body.prioridade, "media") as ProjetoPrioridade)
        : readMeta(atual.notas).prioridade;

    const projeto = await prisma.projeto.update({
      where: { id },
      data: {
        clienteId,
        nome: body.titulo !== undefined ? readString(body.titulo, atual.nome) : undefined,
        descricao: body.descricao !== undefined ? readString(body.descricao) || null : undefined,
        valor: body.valor !== undefined ? readNumber(body.valor, Number(atual.valor)) : undefined,
        progresso:
          body.progresso !== undefined
            ? Math.max(0, Math.min(100, Math.round(readNumber(body.progresso, atual.progresso))))
            : undefined,
        status: status ? statusToDb[status] || atual.status : undefined,
        prazoEntrega: body.prazo !== undefined ? new Date(readString(body.prazo)) : undefined,
        tecnologias: body.tags !== undefined ? readTags(body.tags) : undefined,
        notas: body.prioridade !== undefined ? writeMeta(prioridade, readMeta(atual.notas).notas) : undefined,
      },
      include: { cliente: true, arquivos: { orderBy: { createdAt: "desc" } } },
    });

    return NextResponse.json(mapProjeto(projeto));
  } catch (error) {
    console.error("[API Projetos PATCH]", error);
    return NextResponse.json({ error: "Erro ao atualizar projeto" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID obrigatorio" }, { status: 400 });

    await prisma.projeto.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[API Projetos DELETE]", error);
    return NextResponse.json({ error: "Erro ao remover projeto" }, { status: 500 });
  }
}
