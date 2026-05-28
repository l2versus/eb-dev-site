import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

const CONFIG_ID = "default";

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function buildResponse(config: any) {
  const metadata = (config.metadata || {}) as {
    perfil?: Record<string, unknown>;
    notificacoes?: Record<string, unknown>;
    preferencias?: Record<string, unknown>;
  };

  return {
    perfil: {
      ...(metadata.perfil || {}),
      nome: readString(metadata.perfil?.nome, config.nomeClinica),
      email: readString(metadata.perfil?.email, config.email || ""),
      telefone: readString(metadata.perfil?.telefone, config.telefone || ""),
      cidade: readString(metadata.perfil?.cidade, config.endereco || ""),
      site: readString(metadata.perfil?.site, ""),
    },
    notificacoes: metadata.notificacoes || {},
    preferencias: {
      ...(metadata.preferencias || {}),
      horaInicio: readString(metadata.preferencias?.horaInicio, config.horarioAbertura),
      horaFim: readString(metadata.preferencias?.horaFim, config.horarioFechamento),
    },
    savedAt: config.updatedAt.toISOString(),
  };
}

export async function GET() {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const config = await prisma.configuracaoSistema.upsert({
      where: { id: CONFIG_ID },
      update: {},
      create: {
        id: CONFIG_ID,
        nomeClinica: "Emmanuel Bezerra",
        email: "admin@emmanuelbezerra.dev",
        telefone: "(85) 99850-0344",
      },
    });

    return NextResponse.json(buildResponse(config));
  } catch (error) {
    console.error("[API Configuracoes GET]", error);
    return NextResponse.json({ error: "Erro ao buscar configuracoes" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = (await request.json()) as {
      perfil?: Record<string, unknown>;
      notificacoes?: Record<string, unknown>;
      preferencias?: Record<string, unknown>;
    };
    const perfil = body.perfil || {};
    const preferencias = body.preferencias || {};

    const config = await prisma.configuracaoSistema.upsert({
      where: { id: CONFIG_ID },
      update: {
        nomeClinica: readString(perfil.nome, "Emmanuel Bezerra"),
        email: readString(perfil.email) || null,
        telefone: readString(perfil.telefone) || null,
        endereco: readString(perfil.cidade) || null,
        horarioAbertura: readString(preferencias.horaInicio, "09:00"),
        horarioFechamento: readString(preferencias.horaFim, "18:00"),
        metadata: body as any,
      },
      create: {
        id: CONFIG_ID,
        nomeClinica: readString(perfil.nome, "Emmanuel Bezerra"),
        email: readString(perfil.email) || null,
        telefone: readString(perfil.telefone) || null,
        endereco: readString(perfil.cidade) || null,
        horarioAbertura: readString(preferencias.horaInicio, "09:00"),
        horarioFechamento: readString(preferencias.horaFim, "18:00"),
        metadata: body as any,
      },
    });

    return NextResponse.json(buildResponse(config));
  } catch (error) {
    console.error("[API Configuracoes PUT]", error);
    return NextResponse.json({ error: "Erro ao salvar configuracoes" }, { status: 500 });
  }
}
