// ══════════════════════════════════════════════════════════════════════════════
// 🛡️ API Auth Helper — Verifica sessão admin em rotas API
// ══════════════════════════════════════════════════════════════════════════════

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Verifica se o usuário é admin autenticado.
 * Retorna a sessão se válida, ou uma NextResponse 401/403 se não.
 */
export async function requireAdmin() {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        authorized: false as const,
        response: NextResponse.json(
          { error: "Não autenticado" },
          { status: 401 }
        ),
      };
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return {
        authorized: false as const,
        response: NextResponse.json(
          { error: "Acesso negado" },
          { status: 403 }
        ),
      };
    }

    return {
      authorized: true as const,
      session,
    };
  } catch {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { error: "Erro de autenticação" },
        { status: 401 }
      ),
    };
  }
}
