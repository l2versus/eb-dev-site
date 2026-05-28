// ══════════════════════════════════════════════════════════════════════════════
// 📋 API — CRUD de Clientes / Leads
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

// GET /api/clientes - Listar todos
export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "TODOS") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { empresa: { contains: search, mode: "insensitive" } },
      ];
    }

    const clientes = await prisma.cliente.findMany({
      where,
      include: {
        _count: {
          select: { projetos: true, propostas: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Formatar resposta
    const formatted = clientes.map((c) => ({
      id: c.id,
      nome: c.nome,
      email: c.email,
      telefone: c.telefone,
      empresa: c.empresa,
      site: c.site,
      tipo: c.tipo,
      status: c.status,
      totalProjetos: c._count.projetos,
      totalPropostas: c._count.propostas,
      faturamentoTotal: c.faturamentoTotal.toString(),
      rating: c.rating,
      tags: c.tags,
      notas: c.notas,
      origemLead: c.origemLead,
      ultimoContato: c.ultimoContato,
      createdAt: c.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("[API Clientes GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 }
    );
  }
}

// POST /api/clientes - Criar novo
export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = await request.json();

    const cliente = await prisma.cliente.create({
      data: {
        nome: body.nome,
        email: body.email,
        telefone: body.telefone || null,
        empresa: body.empresa || null,
        site: body.site || null,
        tipo: body.tipo || "PF",
        status: body.status || "LEAD",
        tags: body.tags || [],
        notas: body.notas || null,
        origemLead: body.origemLead || null,
        ultimoContato: new Date(),
      },
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error: any) {
    console.error("[API Clientes POST]", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar cliente" },
      { status: 500 }
    );
  }
}
