// ══════════════════════════════════════════════════════════════════════════════
// 📄 API — Proposta por ID (GET, PUT, DELETE)
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Buscar proposta específica (público para checkout)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const proposta = await prisma.proposta.findUnique({
      where: { id },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            empresa: true,
          },
        },
      },
    });

    if (!proposta) {
      return NextResponse.json(
        { error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    // Marcar como visualizada se não foi ainda
    if (proposta.status === "ENVIADA") {
      await prisma.proposta.update({
        where: { id },
        data: { status: "VISUALIZADA" },
      });

      // Emitir evento de visualização
      fetch(`${process.env.NEXTAUTH_URL || ""}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "proposta_visualizada",
          data: {
            propostaId: id,
            titulo: proposta.titulo,
            clienteNome: proposta.cliente.nome,
          },
        }),
      }).catch(() => {});
    }

    // Retornar dados formatados para o checkout
    return NextResponse.json({
      id: proposta.id,
      titulo: proposta.titulo,
      descricao: proposta.descricao,
      valor: Number(proposta.valor),
      valorFinal: Number(proposta.valorFinal),
      desconto: Number(proposta.desconto || 0),
      tipoProjeto: proposta.tipoProjeto,
      prazoEstimado: proposta.prazoEstimado,
      itensInclusos: proposta.itensInclusos,
      validade: proposta.validade,
      status: proposta.status,
      cliente: proposta.cliente,
    });
  } catch (error) {
    console.error("Erro ao buscar proposta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar proposta
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const { id } = await params;
    const body = await request.json();

    const proposta = await prisma.proposta.findUnique({ where: { id } });
    if (!proposta) {
      return NextResponse.json(
        { error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    // Recalcular valor final se necessário
    const updateData = { ...body };
    if (body.valor || body.desconto !== undefined) {
      const novoValor = body.valor ? parseFloat(body.valor) : Number(proposta.valor);
      const novoDesconto = body.desconto !== undefined ? parseFloat(body.desconto) : Number(proposta.desconto || 0);
      updateData.valor = novoValor;
      updateData.desconto = novoDesconto;
      updateData.valorFinal = novoValor - novoDesconto;
    }

    if (updateData.status === "ENVIADA") {
      updateData.enviadaEm = proposta.enviadaEm ?? new Date();
    }

    if (["APROVADA", "RECUSADA"].includes(updateData.status)) {
      updateData.respondidaEm = proposta.respondidaEm ?? new Date();
    }

    const updated = await prisma.proposta.update({
      where: { id },
      data: updateData,
      include: { cliente: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar proposta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir proposta
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const { id } = await params;

    await prisma.proposta.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir proposta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
