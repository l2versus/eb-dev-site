// ══════════════════════════════════════════════════════════════════════════════
// 🔑 API — Acesso do Cliente (Geração de Código + Login)
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

// Gerar código de acesso único
function gerarCodigoAcesso(): string {
  return randomBytes(4).toString("hex").toUpperCase(); // 8 caracteres
}

// POST - Gerar código de acesso para um cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clienteId, enviarEmail, enviarWhatsApp } = body;

    if (!clienteId) {
      return NextResponse.json(
        { error: "ID do cliente obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se já tem acesso
    let acesso = await prisma.acessoCliente.findUnique({
      where: { clienteId },
    });

    // Se não tem, criar novo
    if (!acesso) {
      const codigoAcesso = gerarCodigoAcesso();
      acesso = await prisma.acessoCliente.create({
        data: {
          clienteId,
          codigoAcesso,
          emailEnviado: false,
          whatsEnviado: false,
          ativo: true,
        },
      });
    }

    // Enviar por email
    if (enviarEmail && cliente.email) {
      try {
        // Aqui seria a integração com serviço de email (SendGrid, Resend, etc)
        // await sendEmail({
        //   to: cliente.email,
        //   subject: "Seu código de acesso",
        //   body: `Olá ${cliente.nome}! Seu código de acesso é: ${acesso.codigoAcesso}`
        // });

        await prisma.acessoCliente.update({
          where: { id: acesso.id },
          data: { emailEnviado: true },
        });
      } catch (error) {
        console.error("Erro ao enviar email:", error);
      }
    }

    // Enviar por WhatsApp
    if (enviarWhatsApp && cliente.telefone) {
      try {
        const telefoneNumerico = cliente.telefone.replace(/\D/g, "");
        const mensagem = `🔑 *Seu Código de Acesso*\n\nOlá ${cliente.nome}!\n\nSeu código de acesso ao portal é:\n\n*${acesso.codigoAcesso}*\n\nAcesse em: https://emmanuelbezerra.dev/cliente\n\nDúvidas? Responda esta mensagem.`;

        // Tentar enviar via Evolution API
        const evolutionUrl = process.env.EVOLUTION_API_URL;
        const evolutionKey = process.env.EVOLUTION_API_KEY;
        const evolutionInstance = process.env.EVOLUTION_INSTANCE || "Emmanuel";

        if (evolutionUrl && evolutionKey) {
          await fetch(`${evolutionUrl}/message/sendText/${evolutionInstance}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: evolutionKey,
            },
            body: JSON.stringify({
              number: `55${telefoneNumerico}`,
              text: mensagem,
            }),
          });

          await prisma.acessoCliente.update({
            where: { id: acesso.id },
            data: { whatsEnviado: true },
          });
        }
      } catch (error) {
        console.error("Erro ao enviar WhatsApp:", error);
      }
    }

    return NextResponse.json({
      success: true,
      acesso: {
        id: acesso.id,
        codigoAcesso: acesso.codigoAcesso,
        emailEnviado: acesso.emailEnviado,
        whatsEnviado: acesso.whatsEnviado,
        ativo: acesso.ativo,
      },
    });
  } catch (error) {
    console.error("[API Acesso Cliente POST]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET - Validar código de acesso (login do cliente)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get("codigo");
    const email = searchParams.get("email");

    if (!codigo) {
      return NextResponse.json(
        { error: "Código obrigatório" },
        { status: 400 }
      );
    }

    // Buscar acesso pelo código
    const acesso = await prisma.acessoCliente.findUnique({
      where: { codigoAcesso: codigo.toUpperCase() },
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

    if (!acesso) {
      return NextResponse.json(
        { error: "Código inválido" },
        { status: 404 }
      );
    }

    if (!acesso.ativo) {
      return NextResponse.json(
        { error: "Código desativado" },
        { status: 403 }
      );
    }

    // Verificar email se fornecido
    if (email && acesso.cliente.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "Email não corresponde" },
        { status: 403 }
      );
    }

    // Atualizar último acesso
    await prisma.acessoCliente.update({
      where: { id: acesso.id },
      data: { ultimoAcesso: new Date() },
    });

    return NextResponse.json({
      success: true,
      cliente: acesso.cliente,
    });
  } catch (error) {
    console.error("[API Acesso Cliente GET]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
