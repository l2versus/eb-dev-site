// ══════════════════════════════════════════════════════════════════════════════
// 📊 API Cliente Dados — Buscar projetos, propostas e pedidos do cliente
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clienteId = searchParams.get("clienteId");

  if (!clienteId) {
    return NextResponse.json({ error: "Cliente ID é obrigatório" }, { status: 400 });
  }

  try {
    // Buscar cliente com todos os dados relacionados
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        empresa: true,
        projetos: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            tipo: true,
            status: true,
            progresso: true,
            prazoEntrega: true,
            urlPreview: true,
            urlProducao: true,
          },
          orderBy: { updatedAt: "desc" },
        },
        propostas: {
          select: {
            id: true,
            titulo: true,
            valor: true,
            valorFinal: true,
            status: true,
            validade: true,
            tipoProjeto: true,
          },
          orderBy: { createdAt: "desc" },
        },
        pedidos: {
          select: {
            id: true,
            codigo: true,
            descricao: true,
            valorFinal: true,
            status: true,
            metodoPagamento: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cliente) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        empresa: cliente.empresa,
      },
      projetos: cliente.projetos || [],
      propostas: cliente.propostas || [],
      pedidos: cliente.pedidos || [],
    });
  } catch (error) {
    console.error("Erro ao buscar dados do cliente:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do cliente" },
      { status: 500 }
    );
  }
}
