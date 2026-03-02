// ══════════════════════════════════════════════════════════════════════════════
// 🔔 Hook — Conexão SSE para eventos em tempo real
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState, useCallback, useRef } from "react";

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

interface UseRealtimeOptions {
  onEvent?: (event: SSEEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoReconnect?: boolean;
}

export function useRealtime(options: UseRealtimeOptions = {}) {
  const {
    onEvent,
    onConnect,
    onDisconnect,
    autoReconnect = true,
  } = options;

  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [lastEvent, setLastEvent] = useState<SSEEvent | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource("/api/events");
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setConnected(true);
      onConnect?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);
        
        if (data.type !== "ping") {
          setEvents((prev) => [data, ...prev].slice(0, 50)); // Manter últimos 50
          setLastEvent(data);
          onEvent?.(data);
        }
      } catch (error) {
        console.error("Erro ao processar evento SSE:", error);
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
      onDisconnect?.();
      eventSource.close();

      // Reconectar após 3 segundos
      if (autoReconnect) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      }
    };
  }, [onEvent, onConnect, onDisconnect, autoReconnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setConnected(false);
  }, []);

  // Conectar ao montar
  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  // Função para emitir evento
  const emit = useCallback(async (type: EventType, data: any) => {
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });
    } catch (error) {
      console.error("Erro ao emitir evento:", error);
    }
  }, []);

  return {
    connected,
    events,
    lastEvent,
    emit,
    connect,
    disconnect,
  };
}

// Hook para escutar tipos específicos de eventos
export function useEventListener(
  type: EventType | EventType[],
  callback: (data: any) => void
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const handleEvent = useCallback((event: SSEEvent) => {
    const types = Array.isArray(type) ? type : [type];
    if (types.includes(event.type)) {
      callbackRef.current(event.data);
    }
  }, [type]);

  useRealtime({ onEvent: handleEvent });
}
