// ══════════════════════════════════════════════════════════════════════════════
// 📋 API — Cliente Individual (GET, PUT, DELETE)
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/clientes/[id] - Buscar por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        projetos: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        propostas: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        compromissos: {
          orderBy: { dataHora: "desc" },
          take: 5,
        },
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("[API Cliente GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar cliente" },
      { status: 500 }
    );
  }
}

// PUT /api/clientes/[id] - Atualizar
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nome: body.nome,
        email: body.email,
        telefone: body.telefone,
        empresa: body.empresa,
        site: body.site,
        tipo: body.tipo,
        status: body.status,
        tags: body.tags,
        notas: body.notas,
        rating: body.rating,
        ultimoContato: new Date(),
      },
    });

    return NextResponse.json(cliente);
  } catch (error: any) {
    console.error("[API Cliente PUT]", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}

// DELETE /api/clientes/[id] - Remover
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.cliente.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API Cliente DELETE]", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao remover cliente" },
      { status: 500 }
    );
  }
}
