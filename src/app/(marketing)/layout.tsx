// ══════════════════════════════════════════════════════════════════════════════
// 🌐 Layout Marketing — EB Emmanuel Bezerra | Dev Portfolio
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Instagram, Mail, Terminal, MapPin, Phone, Heart, ArrowUp, Code2, ExternalLink, Sun, Moon } from "lucide-react";
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";
import { ThemeProvider, useTheme } from "@/lib/theme-provider";

// Componente interno do Layout
function LayoutContent({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Início", href: "#hero" },
    { label: "Sobre", href: "#sobre" },
    { label: "Projetos", href: "#projetos" },
    { label: "Pacotes", href: "#pacotes" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Orçamento", href: "/orcamento", isRoute: true },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* ═══ HEADER ═══════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-[#00f0ff]/10 shadow-[0_0_30px_rgba(0,240,255,0.05)]"
            : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-6 lg:px-12 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/images/logo-banner.png"
              alt="EB Emmanuel Bezerra"
              className="h-10 w-auto object-contain group-hover:brightness-125 group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all"
            />
          </Link>

          {/* Links Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#00ff41] hover:text-[#00ff41] transition-colors relative group font-bold"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.5)]" />
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#6b6b80] hover:text-[#00f0ff] transition-colors relative group font-medium"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00f0ff] group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
                </a>
              )
            ))}
          </div>

          {/* Social + CTA Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://github.com/emmanuelbezerradev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6b6b80] hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/emmanuelbezerra_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6b6b80] hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#6b6b80] hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all"
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            {/* Access Buttons */}
            <Link
              href="/cliente"
              className="ml-2 px-4 py-2 text-sm font-semibold rounded-lg bg-[#ff00ff]/10 border border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/20 hover:shadow-[0_0_20px_rgba(255,0,255,0.2)] transition-all"
            >
              Área Cliente
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff]/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all"
            >
              Admin
            </Link>
          </div>

          {/* Hamburger Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-[#6b6b80] hover:text-[#00f0ff] transition-colors"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass border-b border-[#00f0ff]/10 overflow-hidden"
            >
              <div className="px-6 py-6 space-y-4">
                {navLinks.map((link) => (
                  link.isRoute ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-base text-[#00ff41] hover:text-[#00ff41] py-2 transition-colors font-semibold"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-base text-[#6b6b80] hover:text-[#00f0ff] py-2 transition-colors"
                    >
                      {link.label}
                    </a>
                  )
                ))}
                
                {/* Access Buttons Mobile */}
                <div className="pt-4 border-t border-[#1e1e2e] space-y-3">
                  <Link
                    href="/cliente"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 text-sm font-semibold rounded-lg bg-[#ff00ff]/10 border border-[#ff00ff]/30 text-[#ff00ff]"
                  >
                    Área Cliente
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 text-sm font-semibold rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]"
                  >
                    Admin
                  </Link>
                </div>
                
                <div className="pt-4 border-t border-[#1e1e2e] flex gap-4">
                  <a href="https://github.com/emmanuelbezerradev" target="_blank" rel="noopener noreferrer" className="text-[#6b6b80] hover:text-white">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="https://instagram.com/emmanuelbezerra_" target="_blank" rel="noopener noreferrer" className="text-[#6b6b80] hover:text-white">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══ CONTEÚDO ═════════════════════════════════════════════════════ */}
      <main className="flex-1">{children}</main>

      {/* ═══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer className="relative border-t border-[#1e1e2e] bg-[#08080d]">
        {/* Marquee ticker */}
        <div className="overflow-hidden border-b border-[#1e1e2e] py-4">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex whitespace-nowrap gap-8"
          >
            {Array.from({ length: 2 }).map((_, rep) => (
              <div key={rep} className="flex items-center gap-8 text-sm font-bold uppercase tracking-[0.3em] text-[#1e1e2e]">
                <span>Full-Stack Developer</span>
                <span className="text-[#00f0ff]/30">◆</span>
                <span>React & Next.js</span>
                <span className="text-[#ff00ff]/30">◆</span>
                <span>Node.js & Python</span>
                <span className="text-[#00ff41]/30">◆</span>
                <span>Aplicações Web de Alta Performance</span>
                <span className="text-[#00f0ff]/30">◆</span>
                <span>Fortaleza - CE</span>
                <span className="text-[#ff00ff]/30">◆</span>
                <span>Emmanuel Bezerra</span>
                <span className="text-[#00ff41]/30">◆</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Main footer content */}
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Column 1 — Brand */}
            <div className="lg:col-span-1">
              <img
                src="/images/logo-banner.png"
                alt="EB Emmanuel Bezerra"
                className="h-10 w-auto object-contain mb-5"
              />
              <p className="text-sm text-[#6b6b80] leading-relaxed mb-6">
                Desenvolvedor Full-Stack especializado em aplicações web modernas,
                escaláveis e de alta performance. Transformo ideias em produtos digitais.
              </p>
              <div className="flex items-center gap-4">
                {[
                  { href: "https://github.com/emmanuelbezerradev", icon: Github, label: "GitHub" },
                  { href: "https://instagram.com/emmanuelbezerra_", icon: Instagram, label: "Instagram" },
                  { href: "mailto:emmanuelbezerra1992@gmail.com", icon: Mail, label: "Email" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1e1e2e] text-[#6b6b80] hover:border-[#00f0ff]/30 hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all duration-300"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 — Serviços */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-[0.15em] mb-5">
                Serviços
              </h3>
              <ul className="space-y-3">
                {[
                  "Landing Pages",
                  "Aplicações Web (SaaS)",
                  "E-commerce & Lojas Virtuais",
                  "Sistemas & Dashboards",
                  "APIs & Integrações",
                  "Consultoria Técnica",
                ].map((item) => (
                  <li key={item}>
                    <a href="#contato" className="text-sm text-[#6b6b80] hover:text-[#00f0ff] transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-[#1e1e2e] group-hover:bg-[#00f0ff] transition-colors" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Navegação */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-[0.15em] mb-5">
                Navegação
              </h3>
              <ul className="space-y-3">
                {[
                  { label: "Início", href: "#hero" },
                  { label: "Sobre mim", href: "#sobre" },
                  { label: "Tech Stack", href: "#stack" },
                  { label: "Projetos", href: "#projetos" },
                  { label: "Contato", href: "#contato" },
                  { label: "Orçamento", href: "/orcamento" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-[#6b6b80] hover:text-[#00f0ff] transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-[#1e1e2e] group-hover:bg-[#00f0ff] transition-colors" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Contato */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-[0.15em] mb-5">
                Contato
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://wa.me/5585998500344"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-[#6b6b80] hover:text-[#00ff41] transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    (85) 99850-0344
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:emmanuelbezerra1992@gmail.com"
                    className="flex items-center gap-3 text-sm text-[#6b6b80] hover:text-[#00f0ff] transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    emmanuelbezerra1992@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/emmanuelbezerra_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-[#6b6b80] hover:text-[#ff00ff] transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    @emmanuelbezerra_
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#6b6b80]">
                  <MapPin className="h-4 w-4" />
                  Fortaleza, Ceará
                </li>
              </ul>

              {/* CTA button */}
              <a
                href="https://wa.me/5585998500344?text=Ol%C3%A1%20Emmanuel!%20Vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20um%20or%C3%A7amento."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#00f0ff]/10 border border-[#00f0ff]/25 text-[#00f0ff] hover:bg-[#00f0ff]/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Solicitar Orçamento
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1e1e2e]">
          <div className="mx-auto max-w-7xl px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6b6b80]">
              © {new Date().getFullYear()} Emmanuel Bezerra — Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#6b6b80]">
              Desenvolvido com
              <Heart className="h-3 w-3 text-[#ff00ff]" />
              por
              <a href="/" className="text-[#00f0ff] hover:underline font-medium flex items-center gap-1">
                <img src="/images/logo-banner.png" alt="EB" className="h-5 w-auto inline" />
              </a>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1e1e2e] text-[#6b6b80] hover:border-[#00f0ff]/30 hover:text-[#00f0ff] transition-all"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* ═══ CHATBOT IA ══════════════════════════════════════════════════ */}
      <ChatbotWidget />
    </div>
  );
}
// Componente principal com ThemeProvider
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
}