"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Github, Instagram, Mail, MapPin, Phone } from "lucide-react";

const tools = ["Next.js", "React", "Node", "GSAP", "Lenis", "Prisma"];
const FOOTER_TITLE = "Emmanuel Bezerra";

const services = [
  "Rebranding digital",
  "Landing pages premium",
  "Sites institucionais",
  "Dashboards",
  "Sistemas web",
  "Automacoes",
];

const navLinks = [
  { label: "Inicio", href: "#hero" },
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Processo", href: "#processo" },
  { label: "Oferta", href: "#pacotes" },
  { label: "Contato", href: "#contato" },
];

export function AnimatedFooter() {
  const rootRef = useRef<HTMLElement>(null);
  const typeStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = typeStageRef.current;
    if (!root || !stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      stage.style.setProperty("--blend-x", "22px");
      stage.style.setProperty("--blend-y", "-10px");
      return;
    }

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let currentX = 22;
    let currentY = -10;
    const start = performance.now();

    const onPointerMove = (event: PointerEvent) => {
      const stageRect = stage.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();

      pointerX = clamp(
        (event.clientX - stageRect.left - stageRect.width / 2) / (stageRect.width / 2),
        -1,
        1,
      );
      pointerY = clamp(
        (event.clientY - stageRect.top - stageRect.height / 2) / (stageRect.height / 2),
        -1,
        1,
      );

      root.style.setProperty(
        "--spot-x",
        `${clamp(((event.clientX - rootRect.left) / rootRect.width) * 100, 0, 100).toFixed(2)}%`,
      );
      root.style.setProperty(
        "--spot-y",
        `${clamp(((event.clientY - rootRect.top) / rootRect.height) * 100, 0, 100).toFixed(2)}%`,
      );
    };

    const onPointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
      root.style.setProperty("--spot-x", "68%");
      root.style.setProperty("--spot-y", "42%");
    };

    const tick = (time: number) => {
      const elapsed = time - start;
      const rect = stage.getBoundingClientRect();
      const spread = clamp(rect.width * 0.026, 16, 58);
      const lift = clamp(rect.height * 0.042, 8, 26);

      const targetX =
        spread * 0.72 +
        Math.sin(elapsed * 0.00034) * spread * 0.45 +
        pointerX * spread * 0.62;
      const targetY =
        -lift * 0.42 +
        Math.cos(elapsed * 0.00028) * lift * 0.36 +
        pointerY * lift * 0.54;

      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;

      stage.style.setProperty("--blend-x", `${currentX.toFixed(2)}px`);
      stage.style.setProperty("--blend-y", `${currentY.toFixed(2)}px`);

      frame = window.requestAnimationFrame(tick);
    };

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    frame = window.requestAnimationFrame(tick);

    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <footer
      ref={rootRef}
      id="site-footer"
      className="relative overflow-hidden bg-[#050505] text-[#f5f0e6] [--spot-x:68%] [--spot-y:42%]"
    >
      <section className="footer-luxe-prefooter relative min-h-[100svh] overflow-hidden border-t border-[#d8b9a3]/14">
        <div className="footer-luxe-aura" aria-hidden="true" />
        <div className="footer-luxe-grid" aria-hidden="true" />
        <div className="footer-luxe-grain" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col px-5 pb-7 pt-24 sm:px-8 lg:px-12">
          <div className="footer-meta flex items-start justify-between gap-6">
            <Link href="/" aria-label="Emmanuel Bezerra" className="flex items-center gap-3">
              <span className="relative h-12 w-[4.8rem] shrink-0 overflow-hidden">
                <Image
                  src="/images/logo-banner.png"
                  alt=""
                  width={340}
                  height={98}
                  className="absolute left-0 top-1/2 h-12 w-auto -translate-y-1/2 object-contain"
                />
              </span>
              <span className="leading-none">
                <span className="block text-sm font-semibold text-[#f5f0e6]">Emmanuel Bezerra</span>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-[#ffc090]">
                  Desenvolvedor Full-stack
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-6 lg:flex">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5f0e6]/64 transition-colors hover:text-[#ffc090]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-2 sm:flex">
              {[
                { href: "mailto:emmanuelbezerra1992@gmail.com", icon: Mail, label: "Email" },
                { href: "https://github.com/emmanuelbezerradev", icon: Github, label: "GitHub" },
                { href: "https://instagram.com/emmanuelbezerra_", icon: Instagram, label: "Instagram" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f5f0e6]/14 text-[#f5f0e6]/66 transition-colors hover:border-[#ffc090] hover:text-[#ffc090]"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="relative flex flex-1 flex-col justify-end gap-8 py-12 sm:py-16 lg:py-20">
            <div className="grid gap-5 text-[#d8b9a3]/74 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-md font-mono text-[10px] uppercase tracking-[0.24em]">
                Portfolio / Digital Studio
              </p>
              <p className="max-w-md text-left text-sm font-semibold leading-6 text-[#f5f0e6]/58 sm:text-right">
                Interfaces editoriais, sistemas web e experiencias digitais com
                movimento preciso.
              </p>
            </div>

            <div
              ref={typeStageRef}
              className="wrapper footer-type-stage"
              aria-label={FOOTER_TITLE}
            >
              <h1 className="base-text">{FOOTER_TITLE}</h1>
              <h1 className="blend-text" aria-hidden="true">
                {FOOTER_TITLE}
              </h1>
            </div>

            <div className="footer-luxe-tools grid gap-4 border-y border-[#d8b9a3]/12 py-5 md:grid-cols-[auto_1fr] md:items-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8b9a3]/58">
                Built with
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
                {tools.map((tool) => (
                  <span key={tool} className="footer-tool text-sm font-semibold text-[#d8b9a3]">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-meta grid gap-6 border-t border-[#f5f0e6]/12 pt-5 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <p className="max-w-sm text-sm font-semibold text-[#d8b9a3]">
              Full-stack Developer <span className="text-[#f5f0e6]/56">2026</span>
            </p>
            <a
              data-magnetic
              href="https://wa.me/5585998500344?text=Ola%20Emmanuel!%20Quero%20falar%20sobre%20um%20projeto%20digital."
              target="_blank"
              rel="noopener noreferrer"
              className="footer-panel inline-flex h-12 items-center justify-center rounded-full bg-[#d8b9a3] px-5 text-sm font-semibold text-[#050505] transition-colors hover:bg-[#f5f0e6]"
            >
              Comecar conversa
            </a>
            <p className="text-left text-sm font-semibold text-[#d8b9a3] sm:text-right">
              EB Digital Studio <span className="text-[#f5f0e6]/56">[Now Booking]</span>
            </p>
          </div>
        </div>
      </section>

      <section className="relative border-t border-[#f5f0e6]/10 bg-[#050505]">
        <div className="overflow-hidden border-b border-[#f5f0e6]/10 py-4">
          <div className="footer-marquee-track flex whitespace-nowrap will-change-transform">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="footer-marquee flex items-center gap-8 pr-8 font-mono text-[11px] uppercase tracking-[0.26em] text-[#f5f0e6]/36"
              >
                <span>Rebranding digital</span>
                <span className="text-[#ffc090]">/</span>
                <span>Motion system</span>
                <span className="text-[#ffc090]">/</span>
                <span>Produtos digitais</span>
                <span className="text-[#ffc090]">/</span>
                <span>Emmanuel Bezerra</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr] lg:px-12">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="relative h-14 w-[5.4rem] shrink-0 overflow-hidden">
                <Image
                  src="/images/logo-banner.png"
                  alt=""
                  width={340}
                  height={98}
                  className="absolute left-0 top-1/2 h-14 w-auto -translate-y-1/2 object-contain"
                />
              </span>
              <span className="leading-none">
                <span className="block text-base font-semibold text-[#f5f0e6]">Emmanuel Bezerra</span>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-[#ffc090]">
                  Desenvolvedor Full-stack
                </span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#cfc0af]">
              Desenvolvedor full-stack criando sites, sistemas e experiencias
              digitais com direcao visual, performance e movimento com funcao.
            </p>
          </div>

          <div>
            <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#ffc090]">
              Servicos
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#contato"
                    className="flex items-center gap-2 text-sm text-[#cfc0af] transition-colors hover:text-[#f5f0e6]"
                  >
                    <span className="h-px w-4 bg-[#ffc090]/60" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#ffc090]">
              Navegacao
            </h3>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="flex items-center gap-2 text-sm text-[#cfc0af] transition-colors hover:text-[#f5f0e6]"
                  >
                    <span className="h-px w-4 bg-[#ffc090]/60" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#ffc090]">
              Contato
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/5585998500344"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-[#cfc0af] transition-colors hover:text-[#f5f0e6]"
                >
                  <Phone className="h-4 w-4 text-[#ffc090]" />
                  (85) 99850-0344
                </a>
              </li>
              <li>
                <a
                  href="mailto:emmanuelbezerra1992@gmail.com"
                  className="flex items-center gap-3 text-sm text-[#cfc0af] transition-colors hover:text-[#f5f0e6]"
                >
                  <Mail className="h-4 w-4 text-[#ffc090]" />
                  emmanuelbezerra1992@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#cfc0af]">
                <MapPin className="h-4 w-4 text-[#ffc090]" />
                Fortaleza, CE
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#f5f0e6]/10">
          <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-4 px-5 py-5 text-xs text-[#f5f0e6]/44 sm:flex-row sm:px-8 lg:px-12">
            <p>(c) {new Date().getFullYear()} Emmanuel Bezerra. Todos os direitos reservados.</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f5f0e6]/12 text-[#f5f0e6]/62 transition-colors hover:border-[#ffc090]/55 hover:text-[#ffc090]"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </footer>
  );
}
