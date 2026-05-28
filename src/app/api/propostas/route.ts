// API - Propostas CRUD + Envio

import { NextRequest, NextResponse } from "next/server";
import { StatusProposta } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

// GET - Listar propostas ou buscar por ID
export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

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
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = await request.json();
    const {
      clienteId,
      titulo,
      subtitulo,
      chamadaPrincipal,
      descricao,
      valor,
      desconto,
      moeda,
      parcelamento,
      custoMensalRecorrente,
      tipoProjeto,
      prazoEstimado,
      itensInclusos,
      escopoDetalhado,
      cronograma,
      custosOperacionais,
      comparativo,
      upgradesFuturos,
      termosContrato,
      observacoes,
      validade,
      status,
      geradaPorIA,
      briefingIA,
    } = body;

    if (!clienteId || !titulo || valor == null || !tipoProjeto) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const valorNumerico = parseFloat(String(valor));
    const descontoNumerico = desconto ? parseFloat(String(desconto)) : 0;
    const valorFinal = valorNumerico - descontoNumerico;
    const statusProposta =
      typeof status === "string" && status in StatusProposta
        ? (status as StatusProposta)
        : StatusProposta.RASCUNHO;

    const proposta = await prisma.proposta.create({
      data: {
        clienteId,
        titulo,
        subtitulo,
        chamadaPrincipal,
        descricao,
        valor: valorNumerico,
        desconto: descontoNumerico,
        valorFinal,
        moeda: moeda || "BRL",
        parcelamento,
        custoMensalRecorrente: custoMensalRecorrente != null ? parseFloat(String(custoMensalRecorrente)) : null,
        tipoProjeto,
        prazoEstimado,
        itensInclusos: itensInclusos || [],
        escopoDetalhado: escopoDetalhado ?? undefined,
        cronograma: cronograma ?? undefined,
        custosOperacionais: custosOperacionais ?? undefined,
        comparativo: comparativo ?? undefined,
        upgradesFuturos: upgradesFuturos ?? undefined,
        termosContrato,
        observacoes,
        validade: validade ? new Date(validade) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
        status: statusProposta,
        geradaPorIA: !!geradaPorIA,
        briefingIA,
        enviadaEm: statusProposta === StatusProposta.ENVIADA ? new Date() : undefined,
        respondidaEm:
          statusProposta === StatusProposta.APROVADA || statusProposta === StatusProposta.RECUSADA
            ? new Date()
            : undefined,
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
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

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
