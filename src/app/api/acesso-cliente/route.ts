// ══════════════════════════════════════════════════════════════════════════════
// 🔑 API — Acesso do Cliente (Stub)
// O portal do cliente agora opera via shared-project.ts (localStorage).
// Esta rota permanece como stub para futura integração com banco de dados.
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

function gerarCodigoAcesso(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

// POST - Gerar código de acesso para um cliente (stub)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clienteId } = body;

    if (!clienteId) {
      return NextResponse.json(
        { error: "ID do cliente obrigatório" },
        { status: 400 }
      );
    }

    // Sem banco de dados — gerar código localmente
    const codigoAcesso = gerarCodigoAcesso();

    return NextResponse.json({
      success: true,
      acesso: {
        id: `acc-${Date.now()}`,
        codigoAcesso,
        emailEnviado: false,
        whatsEnviado: false,
        ativo: true,
      },
      _info: "Stub: banco de dados não conectado. Use shared-project.ts no portal.",
    });
  } catch (error) {
    console.error("[API Acesso Cliente POST]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET - Validar código de acesso (stub)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get("codigo");

    if (!codigo) {
      return NextResponse.json(
        { error: "Código obrigatório" },
        { status: 400 }
      );
    }

    // Stub: aceitar "demo" como código válido
    if (codigo.toLowerCase() === "demo") {
      return NextResponse.json({
        success: true,
        cliente: {
          id: "demo-client",
          nome: "Demo",
          email: "demo@emmanuelbezerra.dev",
          telefone: "",
          empresa: "Demo",
        },
      });
    }

    return NextResponse.json(
      { error: "Código inválido. Use o portal do cliente diretamente." },
      { status: 404 }
    );
  } catch (error) {
    console.error("[API Acesso Cliente GET]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
