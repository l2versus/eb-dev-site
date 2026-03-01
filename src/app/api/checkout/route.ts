// ══════════════════════════════════════════════════════════════════════════════
// 💳 API — Checkout / Criar Pagamento Mercado Pago
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { criarPagamentoPix, criarPreferencia } from "@/lib/mercadopago";
import { randomUUID } from "crypto";

// Gerar código único de 8 caracteres
function gerarCodigoPedido(): string {
  return `EB${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      propostaId,
      clienteId,
      nome,
      email,
      telefone,
      cpf,
      valor,
      descricao,
      metodoPagamento, // "pix" | "cartao"
      parcelas,
    } = body;

    // Validações
    if (!email || !valor || !descricao) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      return NextResponse.json(
        { error: "Valor inválido" },
        { status: 400 }
      );
    }

    const codigoPedido = gerarCodigoPedido();
    const idempotencyKey = randomUUID();

    // Criar registro do pedido no banco
    const pedido = await prisma.pedido.create({
      data: {
        codigo: codigoPedido,
        clienteId: clienteId || null,
        propostaId: propostaId || null,
        nomeCliente: nome,
        emailCliente: email,
        telefoneCliente: telefone || null,
        cpfCliente: cpf || null,
        descricao,
        valorOriginal: valorNumerico,
        valorFinal: valorNumerico,
        metodoPagamento: metodoPagamento === "pix" ? "PIX" : "CARTAO",
        parcelas: parcelas || 1,
        status: "PENDENTE",
      },
    });

    // PIX - Pagamento instantâneo
    if (metodoPagamento === "pix") {
      if (!cpf || !nome) {
        return NextResponse.json(
          { error: "CPF e nome são obrigatórios para PIX" },
          { status: 400 }
        );
      }

      const pagamentoPix = await criarPagamentoPix({
        valor: valorNumerico,
        descricao: `${codigoPedido} - ${descricao}`,
        emailPagador: email,
        cpfPagador: cpf,
        nomePagador: nome,
        idempotencyKey,
        agendamentoId: pedido.id, // Usa o ID do pedido
      });

      // Atualizar pedido com dados do MP
      await prisma.pedido.update({
        where: { id: pedido.id },
        data: {
          mercadoPagoId: pagamentoPix.id?.toString(),
          pixQrCode: pagamentoPix.qrCode,
          pixQrCodeBase64: pagamentoPix.qrCodeBase64,
          pixExpiresAt: pagamentoPix.expiresAt ? new Date(pagamentoPix.expiresAt) : null,
        },
      });

      return NextResponse.json({
        success: true,
        pedidoId: pedido.id,
        codigo: codigoPedido,
        tipo: "pix",
        qrCode: pagamentoPix.qrCode,
        qrCodeBase64: pagamentoPix.qrCodeBase64,
        expiresAt: pagamentoPix.expiresAt,
        valor: valorNumerico,
      });
    }

    // CARTÃO/BOLETO - Preferência de pagamento
    const preferencia = await criarPreferencia({
      titulo: `Projeto - ${codigoPedido}`,
      descricao,
      valor: valorNumerico,
      agendamentoId: pedido.id,
      emailPagador: email,
    });

    // Atualizar pedido
    await prisma.pedido.update({
      where: { id: pedido.id },
      data: {
        mercadoPagoId: preferencia.id,
        checkoutUrl: preferencia.initPoint,
      },
    });

    return NextResponse.json({
      success: true,
      pedidoId: pedido.id,
      codigo: codigoPedido,
      tipo: "preferencia",
      checkoutUrl: preferencia.initPoint,
      sandboxUrl: preferencia.sandboxInitPoint,
      valor: valorNumerico,
    });
  } catch (error: any) {
    console.error("[API Checkout POST]", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar pagamento" },
      { status: 500 }
    );
  }
}

// GET - Consultar status do pedido
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pedidoId = searchParams.get("id");
    const codigo = searchParams.get("codigo");

    if (!pedidoId && !codigo) {
      return NextResponse.json(
        { error: "ID ou código do pedido necessário" },
        { status: 400 }
      );
    }

    const pedido = await prisma.pedido.findFirst({
      where: pedidoId ? { id: pedidoId } : { codigo: codigo! },
      include: {
        cliente: {
          select: { nome: true, email: true },
        },
        proposta: {
          select: { titulo: true },
        },
      },
    });

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: pedido.id,
      codigo: pedido.codigo,
      status: pedido.status,
      valor: pedido.valorFinal,
      descricao: pedido.descricao,
      metodoPagamento: pedido.metodoPagamento,
      pixQrCode: pedido.pixQrCode,
      pixQrCodeBase64: pedido.pixQrCodeBase64,
      pixExpiresAt: pedido.pixExpiresAt,
      checkoutUrl: pedido.checkoutUrl,
      pagoEm: pedido.pagoEm,
      cliente: pedido.cliente,
      proposta: pedido.proposta,
    });
  } catch (error) {
    console.error("[API Checkout GET]", error);
    return NextResponse.json(
      { error: "Erro ao consultar pedido" },
      { status: 500 }
    );
  }
}
