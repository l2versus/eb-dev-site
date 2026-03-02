// ══════════════════════════════════════════════════════════════════════════════
// 🔔 API — Server-Sent Events para atualizações em tempo real
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Store de conexões ativas
const connections = new Map<string, ReadableStreamDefaultController>();

// Tipos de eventos
export type EventType =
  | "novo_cliente"
  | "novo_pedido"
  | "pagamento_aprovado"
  | "novo_compromisso"
  | "proposta_visualizada"
  | "mensagem_chat"
  | "ping";

interface SSEEvent {
  type: EventType;
  data: any;
  timestamp: string;
}

// Função para enviar evento para todas as conexões
export function broadcastEvent(event: SSEEvent) {
  const message = `data: ${JSON.stringify(event)}\n\n`;
  connections.forEach((controller) => {
    try {
      controller.enqueue(new TextEncoder().encode(message));
    } catch (error) {
      // Conexão pode ter sido fechada
    }
  });
}

// Função auxiliar para enviar eventos
export function emitirEvento(type: EventType, data: any) {
  broadcastEvent({
    type,
    data,
    timestamp: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  const connectionId = crypto.randomUUID();

  const stream = new ReadableStream({
    start(controller) {
      connections.set(connectionId, controller);

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
        connections.delete(connectionId);
        try {
          controller.close();
        } catch {
          // Já fechado
        }
      });
    },
    cancel() {
      connections.delete(connectionId);
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
