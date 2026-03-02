// ══════════════════════════════════════════════════════════════════════════════
// 🔔 Componente — Centro de Notificações em Tempo Real
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRealtime } from "@/hooks/use-realtime";
import {
  Bell,
  X,
  DollarSign,
  UserPlus,
  FileText,
  Calendar,
  MessageSquare,
  Check,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const iconMap: Record<string, any> = {
  novo_cliente: UserPlus,
  novo_pedido: DollarSign,
  pagamento_aprovado: DollarSign,
  novo_compromisso: Calendar,
  proposta_visualizada: FileText,
  mensagem_chat: MessageSquare,
};

const colorMap: Record<string, string> = {
  novo_cliente: "text-brand-400 bg-brand-500/10",
  novo_pedido: "text-gold-400 bg-gold-500/10",
  pagamento_aprovado: "text-emerald-400 bg-emerald-500/10",
  novo_compromisso: "text-purple-400 bg-purple-500/10",
  proposta_visualizada: "text-blue-400 bg-blue-500/10",
  mensagem_chat: "text-pink-400 bg-pink-500/10",
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Carregar notificações do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("notifications");
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Salvar notificações no localStorage
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Ouvir eventos em tempo real
  useRealtime({
    onEvent: (event) => {
      if (event.type === "ping") return;

      const newNotification: Notification = {
        id: crypto.randomUUID(),
        type: event.type,
        title: getTitleForEvent(event.type, event.data),
        message: getMessageForEvent(event.type, event.data),
        timestamp: event.timestamp,
        read: false,
        link: getLinkForEvent(event.type, event.data),
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 50));

      // Tocar som de notificação (opcional)
      try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {}
    },
  });

  // Helpers para formatar notificações
  function getTitleForEvent(type: string, data: any): string {
    switch (type) {
      case "novo_cliente":
        return "Novo Cliente";
      case "novo_pedido":
        return "Novo Pedido";
      case "pagamento_aprovado":
        return "Pagamento Aprovado!";
      case "novo_compromisso":
        return "Novo Compromisso";
      case "proposta_visualizada":
        return "Proposta Visualizada";
      case "mensagem_chat":
        return "Nova Mensagem";
      default:
        return "Notificação";
    }
  }

  function getMessageForEvent(type: string, data: any): string {
    switch (type) {
      case "novo_cliente":
        return `${data?.nome || "Cliente"} foi cadastrado`;
      case "novo_pedido":
        return `Pedido ${data?.codigo || ""} criado`;
      case "pagamento_aprovado":
        return `Pagamento de ${data?.valor || "R$ 0"} confirmado`;
      case "novo_compromisso":
        return `${data?.titulo || "Reunião"} agendada`;
      case "proposta_visualizada":
        return `${data?.clienteNome || "Cliente"} visualizou a proposta`;
      case "mensagem_chat":
        return data?.preview || "Nova mensagem recebida";
      default:
        return "Você tem uma nova notificação";
    }
  }

  function getLinkForEvent(type: string, data: any): string | undefined {
    switch (type) {
      case "novo_cliente":
        return "/admin/clientes";
      case "novo_pedido":
      case "pagamento_aprovado":
        return "/admin/financeiro";
      case "novo_compromisso":
        return "/admin/agenda";
      case "proposta_visualizada":
        return "/admin/financeiro";
      default:
        return undefined;
    }
  }

  // Marcar como lida
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Limpar notificação
  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Limpar todas
  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Botão de notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-dark-400 hover:text-white transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-brand-500 text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificações */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[70vh] bg-dark-900 rounded-2xl border border-dark-800 shadow-2xl overflow-hidden z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-dark-800">
                <h3 className="font-semibold text-white">Notificações</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-brand-400 hover:text-brand-300"
                    >
                      Marcar todas lidas
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="p-1 text-dark-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Lista de notificações */}
              <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-10 w-10 text-dark-700 mx-auto mb-3" />
                    <p className="text-dark-500 text-sm">
                      Nenhuma notificação ainda
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-dark-800">
                    {notifications.map((notification) => {
                      const Icon = iconMap[notification.type] || Bell;
                      const color = colorMap[notification.type] || "text-dark-400 bg-dark-800";

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 hover:bg-dark-800/50 transition-colors cursor-pointer ${
                            !notification.read ? "bg-brand-500/5" : ""
                          }`}
                          onClick={() => {
                            markAsRead(notification.id);
                            if (notification.link) {
                              window.location.href = notification.link;
                              setIsOpen(false);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-white truncate">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-dark-400 mt-0.5 truncate">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-dark-600 mt-1">
                                {new Date(notification.timestamp).toLocaleString(
                                  "pt-BR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "short",
                                  }
                                )}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                clearNotification(notification.id);
                              }}
                              className="p-1 text-dark-600 hover:text-red-400 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
