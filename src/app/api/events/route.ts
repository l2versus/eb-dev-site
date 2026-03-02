// ══════════════════════════════════════════════════════════════════════════════
// 🔔 API — Server-Sent Events para atualizações em tempo real
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest } from "next/server";
import { sseConnections, emitirEvento } from "@/lib/sse";

export async function GET(request: NextRequest) {
  const connectionId = crypto.randomUUID();

  const stream = new ReadableStream({
    start(controller) {
      sseConnections.set(connectionId, controller);

      // Enviar ping inicial
      const initialMessage = `data: ${JSON.stringify({
        type: "ping",
        data: { message: "Conectado ao servidor de eventos" },
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(new TextEncoder().encode(initialMessage));

      // Ping a cada 30 segundos para manter a conexão
      const pingInterval = setInterval(() => {
        try {
          const pingMessage = `data: ${JSON.stringify({
            type: "ping",
            data: { connectionId },
            timestamp: new Date().toISOString(),
          })}\n\n`;
          controller.enqueue(new TextEncoder().encode(pingMessage));
        } catch {
          clearInterval(pingInterval);
        }
      }, 30000);

      // Cleanup quando a conexão for fechada
      request.signal.addEventListener("abort", () => {
        clearInterval(pingInterval);
        sseConnections.delete(connectionId);
        try {
          controller.close();
        } catch {
          // Já fechado
        }
      });
    },
    cancel() {
      sseConnections.delete(connectionId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

// POST - Disparar evento manualmente (para webhooks e ações)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type) {
      return new Response(JSON.stringify({ error: "Tipo de evento obrigatório" }), {
        status: 400,
      });
    }

    emitirEvento(type, data);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao emitir evento" }), {
      status: 500,
    });
  }
}
