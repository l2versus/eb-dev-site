import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

function gerarCodigoAcesso() {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) return authCheck.response;

  try {
    const body = await request.json();
    const clienteId = typeof body.clienteId === "string" ? body.clienteId : "";

    if (!clienteId) {
      return NextResponse.json({ error: "ID do cliente obrigatorio" }, { status: 400 });
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      return NextResponse.json({ error: "Cliente nao encontrado" }, { status: 404 });
    }

    const acesso = await prisma.acessoCliente.upsert({
      where: { clienteId },
      update: {
        codigoAcesso: gerarCodigoAcesso(),
        ativo: true,
      },
      create: {
        clienteId,
        codigoAcesso: gerarCodigoAcesso(),
      },
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

    return NextResponse.json({ success: true, acesso });
  } catch (error) {
    console.error("[API Acesso Cliente POST]", error);
    return NextResponse.json({ error: "Erro ao gerar acesso" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get("codigo")?.trim().toUpperCase();
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!codigo) {
      return NextResponse.json({ error: "Codigo obrigatorio" }, { status: 400 });
    }

    const acesso = await prisma.acessoCliente.findUnique({
      where: { codigoAcesso: codigo },
      include: {
        cliente: {
          include: {
            projetos: {
              orderBy: { updatedAt: "desc" },
            },
            propostas: {
              orderBy: { updatedAt: "desc" },
            },
          },
        },
      },
    });

    if (!acesso || !acesso.ativo) {
      return NextResponse.json({ error: "Codigo invalido" }, { status: 404 });
    }

    if (email && acesso.cliente.email.toLowerCase() !== email) {
      return NextResponse.json({ error: "Email nao corresponde ao codigo" }, { status: 403 });
    }

    await prisma.acessoCliente.update({
      where: { id: acesso.id },
      data: { ultimoAcesso: new Date() },
    });

    return NextResponse.json({
      success: true,
      cliente: acesso.cliente,
      acesso: {
        id: acesso.id,
        codigoAcesso: acesso.codigoAcesso,
        ultimoAcesso: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[API Acesso Cliente GET]", error);
    return NextResponse.json({ error: "Erro ao validar acesso" }, { status: 500 });
  }
}
