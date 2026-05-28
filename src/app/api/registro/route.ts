import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

function gerarCodigoAcesso() {
  return randomBytes(4).toString("hex").toUpperCase();
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const nome = readString(body.nome || body.name);
    const email = readString(body.email).toLowerCase();
    const telefone = readString(body.telefone || body.phone);
    const empresa = readString(body.empresa || body.company);
    const projeto = readString(body.projeto || body.description);

    if (!nome || !email || !telefone) {
      return NextResponse.json(
        { error: "Nome, email e WhatsApp sao obrigatorios." },
        { status: 400 },
      );
    }

    const cliente = await prisma.cliente.upsert({
      where: { email },
      update: {
        nome,
        telefone,
        empresa: empresa || null,
        tipo: empresa ? "PJ" : "PF",
        status: "LEAD",
        origemLead: "cadastro-site",
        notas: projeto || null,
        ultimoContato: new Date(),
      },
      create: {
        nome,
        email,
        telefone,
        empresa: empresa || null,
        tipo: empresa ? "PJ" : "PF",
        status: "LEAD",
        origemLead: "cadastro-site",
        notas: projeto || null,
        ultimoContato: new Date(),
      },
    });

    const acesso = await prisma.acessoCliente.upsert({
      where: { clienteId: cliente.id },
      update: {
        ativo: true,
      },
      create: {
        clienteId: cliente.id,
        codigoAcesso: gerarCodigoAcesso(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone,
          empresa: cliente.empresa,
        },
        acesso: {
          codigoAcesso: acesso.codigoAcesso,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[API Registro POST]", error);
    return NextResponse.json(
      { error: "Erro ao concluir cadastro." },
      { status: 500 },
    );
  }
}
