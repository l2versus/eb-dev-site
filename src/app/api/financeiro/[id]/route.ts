// ══════════════════════════════════════════════════════════════════════════════
// 💰 API — Transação Individual (GET, PUT, DELETE)
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const tipoMap: Record<string, string> = { receita: "RECEITA", despesa: "DESPESA" };
const statusMap: Record<string, string> = { pago: "PAGO", pendente: "PENDENTE", atrasado: "ATRASADO", cancelado: "CANCELADO" };
const tipoRev: Record<string, string> = { RECEITA: "receita", DESPESA: "despesa" };
const statusRev: Record<string, string> = { PAGO: "pago", PENDENTE: "pendente", ATRASADO: "atrasado", CANCELADO: "cancelado" };

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/financeiro/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const t = await prisma.transacao.findUnique({ where: { id } });

    if (!t) {
      return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      id: t.id,
      tipo: tipoRev[t.tipo],
      descricao: t.descricao,
      valor: Number(t.valor),
      categoria: t.categoria,
      data: t.data.toISOString().split("T")[0],
      status: statusRev[t.status],
      metodo: t.metodo,
      cliente: t.cliente,
    });
  } catch (error) {
    console.error("[API Financeiro GET id]", error);
    return NextResponse.json({ error: "Erro ao buscar transação" }, { status: 500 });
  }
}

// PUT /api/financeiro/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const t = await prisma.transacao.update({
      where: { id },
      data: {
        tipo: (tipoMap[body.tipo] || undefined) as any,
        descricao: body.descricao,
        valor: body.valor !== undefined ? parseFloat(body.valor) : undefined,
        categoria: body.categoria,
        data: body.data ? new Date(body.data) : undefined,
        status: (statusMap[body.status] || undefined) as any,
        metodo: body.metodo,
        cliente: body.cliente,
      },
    });

    return NextResponse.json({
      id: t.id,
      tipo: tipoRev[t.tipo],
      descricao: t.descricao,
      valor: Number(t.valor),
      categoria: t.categoria,
      data: t.data.toISOString().split("T")[0],
      status: statusRev[t.status],
      metodo: t.metodo,
      cliente: t.cliente,
    });
  } catch (error: any) {
    console.error("[API Financeiro PUT]", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erro ao atualizar transação" }, { status: 500 });
  }
}

// DELETE /api/financeiro/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.transacao.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API Financeiro DELETE]", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erro ao remover transação" }, { status: 500 });
  }
}
