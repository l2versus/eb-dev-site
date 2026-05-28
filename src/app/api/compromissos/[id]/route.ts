// ══════════════════════════════════════════════════════════════════════════════
// 📅 API — Compromisso Individual (GET, PUT, DELETE)
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/compromissos/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const { id } = await params;

    const compromisso = await prisma.compromisso.findUnique({
      where: { id },
      include: {
        cliente: true,
      },
    });

    if (!compromisso) {
      return NextResponse.json(
        { error: "Compromisso não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(compromisso);
  } catch (error) {
    console.error("[API Compromisso GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar compromisso" },
      { status: 500 }
    );
  }
}

// PUT /api/compromissos/[id] - Atualizar
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const compromisso = await prisma.compromisso.update({
      where: { id },
      data: {
        clienteId: body.clienteId,
        titulo: body.titulo,
        descricao: body.descricao,
        tipo: body.tipo,
        dataHora: body.dataHora ? new Date(body.dataHora) : undefined,
        duracao: body.duracao,
        status: body.status,
        plataforma: body.plataforma,
        linkReuniao: body.linkReuniao,
        notas: body.notas,
        lembrete: body.lembrete,
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            telefone: true,
          },
        },
      },
    });

    return NextResponse.json(compromisso);
  } catch (error: any) {
    console.error("[API Compromisso PUT]", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Compromisso não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar compromisso" },
      { status: 500 }
    );
  }
}

// DELETE /api/compromissos/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const { id } = await params;

    await prisma.compromisso.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API Compromisso DELETE]", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Compromisso não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao remover compromisso" },
      { status: 500 }
    );
  }
}
