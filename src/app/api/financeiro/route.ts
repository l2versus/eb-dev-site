// ══════════════════════════════════════════════════════════════════════════════
// 💰 API — CRUD de Transações Financeiras
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

// Mapeamento lowercase (front) → uppercase (Prisma enum)
const tipoMap: Record<string, string> = { receita: "RECEITA", despesa: "DESPESA" };
const statusMap: Record<string, string> = { pago: "PAGO", pendente: "PENDENTE", atrasado: "ATRASADO", cancelado: "CANCELADO" };
const tipoRev: Record<string, string> = { RECEITA: "receita", DESPESA: "despesa" };
const statusRev: Record<string, string> = { PAGO: "pago", PENDENTE: "pendente", ATRASADO: "atrasado", CANCELADO: "cancelado" };

// GET /api/financeiro — Listar transações
export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");

    const where: any = {};
    if (tipo && tipo !== "todos") {
      where.tipo = tipoMap[tipo] || tipo;
    }

    const transacoes = await prisma.transacao.findMany({
      where,
      orderBy: { data: "desc" },
    });

    // Formatar para o front-end (lowercase, valor como number)
    const formatted = transacoes.map((t) => ({
      id: t.id,
      tipo: tipoRev[t.tipo] || t.tipo.toLowerCase(),
      descricao: t.descricao,
      valor: Number(t.valor),
      categoria: t.categoria,
      data: t.data.toISOString().split("T")[0],
      status: statusRev[t.status] || t.status.toLowerCase(),
      metodo: t.metodo,
      cliente: t.cliente,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("[API Financeiro GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar transações" },
      { status: 500 }
    );
  }
}

// POST /api/financeiro — Criar transação
export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = await request.json();

    const transacao = await prisma.transacao.create({
      data: {
        tipo: (tipoMap[body.tipo] || "RECEITA") as any,
        descricao: body.descricao,
        valor: parseFloat(body.valor) || 0,
        categoria: body.categoria || "Outro",
        data: new Date(body.data),
        status: (statusMap[body.status] || "PAGO") as any,
        metodo: body.metodo || null,
        cliente: body.cliente || null,
      },
    });

    return NextResponse.json({
      id: transacao.id,
      tipo: tipoRev[transacao.tipo],
      descricao: transacao.descricao,
      valor: Number(transacao.valor),
      categoria: transacao.categoria,
      data: transacao.data.toISOString().split("T")[0],
      status: statusRev[transacao.status],
      metodo: transacao.metodo,
      cliente: transacao.cliente,
    }, { status: 201 });
  } catch (error) {
    console.error("[API Financeiro POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    );
  }
}
