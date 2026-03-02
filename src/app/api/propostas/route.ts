// ══════════════════════════════════════════════════════════════════════════════
// 📄 API — Propostas CRUD + Envio
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar propostas ou buscar por ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clienteId = searchParams.get("clienteId");
    const status = searchParams.get("status");

    // Busca específica por ID
    if (id) {
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

      return NextResponse.json(proposta);
    }

    // Lista de propostas com filtros
    const where: any = {};
    if (clienteId) where.clienteId = clienteId;
    if (status) where.status = status;

    const propostas = await prisma.proposta.findMany({
      where,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(propostas);
  } catch (error) {
    console.error("Erro ao buscar propostas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar nova proposta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clienteId,
      titulo,
      descricao,
      valor,
      desconto,
      tipoProjeto,
      prazoEstimado,
      itensInclusos,
      termosContrato,
      observacoes,
      validade,
    } = body;

    if (!clienteId || !titulo || !valor || !tipoProjeto) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const valorNumerico = parseFloat(valor);
    const descontoNumerico = desconto ? parseFloat(desconto) : 0;
    const valorFinal = valorNumerico - descontoNumerico;

    const proposta = await prisma.proposta.create({
      data: {
        clienteId,
        titulo,
        descricao,
        valor: valorNumerico,
        desconto: descontoNumerico,
        valorFinal,
        tipoProjeto,
        prazoEstimado,
        itensInclusos: itensInclusos || [],
        termosContrato,
        observacoes,
        validade: validade ? new Date(validade) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        status: "RASCUNHO",
      },
      include: {
        cliente: true,
      },
    });

    return NextResponse.json(proposta, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar proposta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar status ou dados da proposta
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID obrigatório" },
        { status: 400 }
      );
    }

    // Se está atualizando valores, recalcular valor final
    if (data.valor || data.desconto) {
      const proposta = await prisma.proposta.findUnique({ where: { id } });
      if (proposta) {
        const novoValor = data.valor ? parseFloat(data.valor) : Number(proposta.valor);
        const novoDesconto = data.desconto !== undefined ? parseFloat(data.desconto) : Number(proposta.desconto || 0);
        data.valorFinal = novoValor - novoDesconto;
        if (data.valor) data.valor = novoValor;
        if (data.desconto !== undefined) data.desconto = novoDesconto;
      }
    }

    // Se está enviando a proposta
    if (data.status === "ENVIADA") {
      data.enviadaEm = new Date();
    }

    // Se está respondendo
    if (["APROVADA", "RECUSADA"].includes(data.status)) {
      data.respondidaEm = new Date();
    }

    const proposta = await prisma.proposta.update({
      where: { id },
      data,
      include: {
        cliente: true,
      },
    });

    return NextResponse.json(proposta);
  } catch (error) {
    console.error("Erro ao atualizar proposta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
