"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Github, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { FractureText } from "@/components/FractureText";
import { gsap, isReducedMotion } from "@/lib/gsap";

const tools = ["Next.js", "React", "Node", "GSAP", "Lenis", "Prisma"];
const footerPrimaryVideo = "/videos/magnific_anime-com-danca-so-mexend_2997206424.mp4";
const footerMotionStudyVideo = "/videos/showcase-1.mp4";

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

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    let cleanupMove: (() => void) | undefined;

    const ctx = gsap.context(() => {
      gsap.set(".footer-bg", { scale: 1.16, opacity: 0.58 });
      gsap.set(".footer-meta > *", { y: 24, opacity: 0 });
      gsap.set(".footer-panel", { y: 42, opacity: 0 });
      gsap.set(".footer-tool", { x: 24, opacity: 0 });
      gsap.set(".footer-reel-card", { y: 32, opacity: 0, scale: 0.96 });
      gsap.set(".footer-logo-ghost", { opacity: 0, scale: 0.9, rotate: -4 });

      const enter = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
        },
      });

      enter
        .to(".footer-bg", { scale: 1.04, opacity: 1, duration: 1.25 }, 0)
        .to(".footer-logo-ghost", { opacity: 0.08, scale: 1, rotate: 0, duration: 1 }, 0.28)
        .to(".footer-meta > *", { y: 0, opacity: 1, duration: 0.76, stagger: 0.06 }, 0.34)
        .to(".footer-tool", { x: 0, opacity: 1, duration: 0.7, stagger: 0.06 }, 0.48)
        .to(".footer-reel-card", { y: 0, opacity: 1, scale: 1, duration: 0.8 }, 0.54)
        .to(".footer-panel", { y: 0, opacity: 1, duration: 0.82, stagger: 0.07 }, 0.58);

      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.8,
        },
      })
        .to(".footer-bg", { yPercent: -8, scale: 1 }, 0)
        .to(".footer-reel-card", { yPercent: -12 }, 0)
        .to(".footer-title", { yPercent: -8 }, 0)
        .to(".footer-title-left", { xPercent: -1.8 }, 0)
        .to(".footer-title-right", { xPercent: 1.8 }, 0)
        .to(".footer-logo-ghost", { yPercent: -18, rotate: 3 }, 0)
        .to(".footer-tools", { yPercent: -18 }, 0);

      gsap.to(".footer-tool", {
        y: (index) => (index % 2 === 0 ? -7 : 7),
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
      });

      gsap.to(".footer-marquee-track", {
        xPercent: -50,
        duration: 24,
        ease: "none",
        repeat: -1,
      });

      const onMove = (event: MouseEvent) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(".footer-bg", {
          x: x * 14,
          y: y * 12,
          duration: 0.9,
          ease: "power3.out",
        });
        gsap.to(".footer-logo-ghost", {
          x: x * -24,
          y: y * -16,
          duration: 0.9,
          ease: "power3.out",
        });
        gsap.to(".footer-title", {
          x: x * 2,
          y: y * 2,
          duration: 0.9,
          ease: "power3.out",
        });
      };

      window.addEventListener("mousemove", onMove);
      cleanupMove = () => window.removeEventListener("mousemove", onMove);
    }, root);

    return () => {
      cleanupMove?.();
      ctx.revert();
    };
  }, []);

  return (
    <footer
      ref={rootRef}
      id="site-footer"
      className="relative overflow-hidden bg-[#050505] text-[#f5f0e6]"
    >
      <section className="footer-luxe-prefooter relative isolate min-h-screen overflow-hidden border-t border-[#ffc090]/14">
        <div className="footer-bg absolute inset-0 will-change-transform">
          <video
            className="h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/gsap-profile-code.png"
            aria-hidden="true"
          >
            <source src={footerPrimaryVideo} type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.88)_0%,rgba(5,5,5,0.24)_46%,rgba(5,5,5,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.74)_0%,rgba(5,5,5,0.08)_38%,rgba(5,5,5,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(255,192,144,0.2),transparent_34%),radial-gradient(circle_at_20%_76%,rgba(0,77,117,0.22),transparent_34%)]" />

        <div className="footer-logo-ghost pointer-events-none absolute right-[-5vw] top-[13vh] hidden lg:block">
          <Image
            src="/images/logo-banner.png"
            alt=""
            width={820}
            height={240}
            className="h-auto w-[54vw] max-w-[820px] object-contain"
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] flex-col px-5 pb-7 pt-24 sm:px-8 lg:px-12">
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

          <div className="relative flex flex-1 items-end">
            <div className="footer-reel-card absolute left-0 top-[18%] z-10 hidden w-[min(24vw,360px)] overflow-hidden border border-[#ffc090]/18 bg-[#050505]/52 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl lg:block">
              <div className="relative aspect-video overflow-hidden">
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onMouseEnter={(event) => {
                    void event.currentTarget.play();
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.pause();
                    event.currentTarget.currentTime = 0;
                  }}
                >
                  <source src={footerMotionStudyVideo} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.62)_100%)]" />
                <p className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#ffc090]">
                  Motion study
                </p>
              </div>
            </div>

            <div className="footer-tools absolute right-0 top-[25%] hidden w-52 text-right lg:block">
              <p className="mb-7 text-sm text-[#ffc090]/78">Website made using:</p>
              <div className="space-y-3">
                {tools.map((tool) => (
                  <p key={tool} className="footer-tool text-sm font-semibold text-[#ffc090]">
                    {tool}
                  </p>
                ))}
              </div>
            </div>

            <div className="footer-title pointer-events-none relative z-20 w-full pb-12">
              <h2 className="relative z-10 font-display text-[clamp(5rem,14.5vw,17rem)] leading-[0.72] text-[#ffc090] mix-blend-difference">
                <span className="footer-title-left block overflow-hidden">
                  <FractureText text="Emmanuel" className="footer-word footer-fracture block" />
                </span>
                <span className="footer-title-right block overflow-hidden text-right">
                  <FractureText text="Bezerra" className="footer-word footer-fracture block" />
                </span>
              </h2>
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
