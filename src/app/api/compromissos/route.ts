// ══════════════════════════════════════════════════════════════════════════════
// 📅 API — CRUD de Compromissos / Agenda
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/compromissos - Listar
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get("data"); // YYYY-MM-DD
    const status = searchParams.get("status");
    const tipo = searchParams.get("tipo");

    const where: any = {};

    if (data) {
      const inicio = new Date(data + "T00:00:00");
      const fim = new Date(data + "T23:59:59");
      where.dataHora = {
        gte: inicio,
        lte: fim,
      };
    }

    if (status && status !== "TODOS") {
      where.status = status;
    }

    if (tipo && tipo !== "TODOS") {
      where.tipo = tipo;
    }

    const compromissos = await prisma.compromisso.findMany({
      where,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
      },
      orderBy: { dataHora: "asc" },
    });

    return NextResponse.json(compromissos);
  } catch (error) {
    console.error("[API Compromissos GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar compromissos" },
      { status: 500 }
    );
  }
}

// POST /api/compromissos - Criar novo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const compromisso = await prisma.compromisso.create({
      data: {
        clienteId: body.clienteId || null,
        titulo: body.titulo,
        descricao: body.descricao || null,
        tipo: body.tipo || "REUNIAO",
        dataHora: new Date(body.dataHora),
        duracao: body.duracao || 30,
        status: body.status || "PENDENTE",
        plataforma: body.plataforma || null,
        linkReuniao: body.linkReuniao || null,
        notas: body.notas || null,
        lembrete: body.lembrete ?? true,
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
      },
    });

    return NextResponse.json(compromisso, { status: 201 });
  } catch (error) {
    console.error("[API Compromissos POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar compromisso" },
      { status: 500 }
    );
  }
}
