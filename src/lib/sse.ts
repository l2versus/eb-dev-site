// ══════════════════════════════════════════════════════════════════════════════
// 🔔 SSE — Server-Sent Events broadcast utilities
// ══════════════════════════════════════════════════════════════════════════════

// Store de conexões ativas
export const sseConnections = new Map<string, ReadableStreamDefaultController>();

// Tipos de eventos
export type EventType =
  | "novo_cliente"
  | "novo_pedido"
  | "pagamento_aprovado"
  | "novo_compromisso"
  | "proposta_visualizada"
  | "mensagem_chat"
  | "ping";

export interface SSEEvent {
  type: EventType;
  data: any;
  timestamp: string;
}

// Função para enviar evento para todas as conexões
export function broadcastEvent(event: SSEEvent) {
  const message = `data: ${JSON.stringify(event)}\n\n`;
  sseConnections.forEach((controller) => {
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
