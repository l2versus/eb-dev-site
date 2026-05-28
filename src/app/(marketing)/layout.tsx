"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Github,
  Instagram,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { AnimatedFooter } from "@/components/sections/AnimatedFooter";
import { ThemeProvider } from "@/lib/theme-provider";

const navLinks = [
  { label: "Inicio", href: "#hero" },
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Prova", href: "#depoimentos" },
  { label: "Processo", href: "#processo" },
  { label: "Oferta", href: "#pacotes" },
  { label: "Contato", href: "#contato" },
];

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className={`${compact ? "h-11 w-[4.2rem]" : "h-14 w-[5.4rem]"} relative shrink-0 overflow-hidden`}>
        <Image
          src="/images/logo-banner.png"
          alt=""
          width={340}
          height={98}
          priority
          className={`${compact ? "h-11" : "h-14"} absolute left-0 top-1/2 w-auto -translate-y-1/2 object-contain`}
        />
      </span>
      <span className="leading-none">
        <span className={`${compact ? "text-sm" : "text-base"} block font-semibold text-[#f5f0e6]`}>
          Emmanuel Bezerra
        </span>
        <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.22em] text-[#ffc090] sm:text-[9px]">
          Desenvolvedor Full-stack
        </span>
      </span>
    </span>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isClientePortal = pathname.startsWith("/cliente");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isClientePortal) {
    return (
      <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#10100e]">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#0d0d0b] text-[#f5f0e6]">
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-[#ffc090]/14 bg-[#0d0d0b]/82 shadow-[0_18px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
          <Link href="/" className="group flex items-center" aria-label="Emmanuel Bezerra">
            <BrandLogo compact />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5f0e6]/70 transition-colors hover:text-[#ffc090]"
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#ffc090] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="https://github.com/emmanuelbezerradev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f5f0e6]/12 text-[#f5f0e6]/70 transition-colors hover:border-[#ffc090]/55 hover:text-[#ffc090]"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com/emmanuelbezerra_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f5f0e6]/12 text-[#f5f0e6]/70 transition-colors hover:border-[#ffc090]/55 hover:text-[#ffc090]"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <Link
              href="/cliente/login"
              className="ml-2 inline-flex h-10 items-center gap-2 rounded-full border border-[#f5f0e6]/14 px-4 text-sm font-semibold text-[#f5f0e6] transition-colors hover:border-[#ffc090] hover:text-[#ffc090]"
            >
              <Lock className="h-4 w-4" />
              Area Cliente
            </Link>
            <Link
              href="/admin"
              className="inline-flex h-10 items-center rounded-full bg-[#ffc090] px-4 text-sm font-semibold text-[#14110e] transition-colors hover:bg-[#f5f0e6]"
            >
              Admin
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full border border-[#f5f0e6]/14 p-2 text-[#f5f0e6] transition-colors hover:border-[#ffc090] hover:text-[#ffc090] lg:hidden"
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="fixed left-0 right-0 top-[68px] z-[60] max-h-[calc(100svh-68px)] overflow-y-auto border-y border-[#ffc090]/14 bg-[#0d0d0b]/98 shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:hidden"
            >
              <div className="space-y-2 px-5 py-5">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-full px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#f5f0e6]/76 transition-colors hover:bg-[#f5f0e6]/7 hover:text-[#ffc090]"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="grid gap-3 border-t border-[#f5f0e6]/10 pt-4">
                  <Link
                    href="/cliente/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border border-[#f5f0e6]/15 px-4 py-3 text-center text-sm font-semibold text-[#f5f0e6]"
                  >
                    Area Cliente
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-[#ffc090] px-4 py-3 text-center text-sm font-semibold text-[#14110e]"
                  >
                    Admin
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      <AnimatedFooter />
    </div>
  );
}

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
