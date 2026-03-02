// ══════════════════════════════════════════════════════════════════════════════
// 🛡️ Layout Admin — Sidebar administrativa com controle de acesso
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  DollarSign,
  CalendarDays,
  Settings,
  Users,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield,
  MessageCircle,
  FolderKanban,
  FileText,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/notifications/notification-center";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Financeiro", href: "/admin/financeiro", icon: DollarSign },
  { label: "Agenda", href: "/admin/agenda", icon: CalendarDays },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Chat", href: "/admin/chat", icon: MessageCircle },
  { label: "Projetos", href: "/admin/projetos", icon: FolderKanban },
  { label: "Propostas", href: "/admin/propostas", icon: FileText },
  { label: "Logs", href: "/admin/logs", icon: Activity },
  { label: "Relatórios", href: "/admin/relatorios", icon: BarChart3 },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-dark-950">
      {/* ═══ SIDEBAR DESKTOP ═══════════════════════════════════════════ */}
      <aside
        className={`hidden lg:flex flex-col border-r border-dark-800 bg-dark-900 transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-dark-800">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-white">Admin</span>
                <span className="block text-[9px] text-brand-400 uppercase tracking-wider -mt-0.5">
                  Painel de Controle
                </span>
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-brand-500/10 text-brand-400 font-medium"
                    : "text-dark-400 hover:text-white hover:bg-dark-800/50"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-dark-800">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* ═══ MOBILE DRAWER ═════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-dark-900 border-r border-dark-800 z-50 lg:hidden"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-dark-800">
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">Admin Panel</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-dark-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="px-3 py-4 space-y-1">
                {adminNav.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        isActive
                          ? "bg-brand-500/10 text-brand-400 font-medium"
                          : "text-dark-400 hover:text-white hover:bg-dark-800/50"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              
              {/* Botão Sair Mobile */}
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-dark-800">
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/login" }); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-500 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══ CONTEÚDO PRINCIPAL ═════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-4 lg:px-8 border-b border-dark-800 bg-dark-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-dark-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-medium text-white">
              Painel Administrativo
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Notificações em tempo real */}
            <NotificationCenter />
            <div className="flex items-center gap-2">
              <img
                src="/images/foto-perfil.png"
                alt="Emmanuel"
                className="h-8 w-8 rounded-full object-cover border border-dark-700"
              />
              <span className="hidden sm:block text-sm text-white font-medium">
                Emmanuel
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
