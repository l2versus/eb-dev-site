"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code2, Database, Gauge } from "lucide-react";
import { FractureText } from "@/components/FractureText";
import { gsap, isReducedMotion } from "@/lib/gsap";

const projects = [
  {
    number: "01",
    title: "OneFit product interface",
    type: "Aplicativo / Produto",
    image: "/images/gsap-app-showcase.png",
    metric: "App + painel",
    text: "Interface mobile apresentada como produto real, com foco em clareza visual e prova de execucao.",
    challenge: "Apresentar um app fitness como produto pronto para venda, com tela forte e leitura imediata.",
    role: "Direcao visual, UI de produto, mockup realista e front-end animado.",
    icon: Code2,
    tags: ["Produto", "UI", "Next.js"],
  },
  {
    number: "02",
    title: "Infraestrutura visual",
    type: "Dashboard / Operacao",
    image: "/images/gsap-server-metrics.png",
    metric: "Dados em tempo real",
    text: "Camada tecnica transformada em narrativa visual: performance, custo, erro e trafego em uma leitura rapida.",
    challenge: "Tirar infraestrutura do abstrato e transformar dados tecnicos em prova de maturidade.",
    role: "Arquitetura visual, cards de metrica, storytelling e motion por scroll.",
    icon: Database,
    tags: ["APIs", "Sistemas", "Automacao"],
  },
  {
    number: "03",
    title: "Painel de decisao",
    type: "Admin / Business",
    image: "/images/gsap-dashboard-hands.png",
    metric: "Operacao simples",
    text: "Dashboards e fluxos internos pensados para reduzir atrito e fazer a equipe entender o que importa.",
    challenge: "Organizar decisao operacional sem virar painel poluido ou grafico decorativo.",
    role: "UX de dados, hierarquia de informacao, interface admin e componentes reutilizaveis.",
    icon: Gauge,
    tags: ["CRM", "Admin", "Relatorios"],
  },
  {
    number: "04",
    title: "Codigo com direcao",
    type: "Web / Full-stack",
    image: "/images/gsap-work-code.png",
    metric: "Design + codigo",
    text: "Desenvolvimento sob medida com layout, conteudo, performance e animacao trabalhando juntos.",
    challenge: "Unir identidade, copy, tecnologia e movimento em uma experiencia autoral.",
    role: "Brand UI, Next.js, GSAP, responsividade e entrega em deploy.",
    icon: Code2,
    tags: ["Landing", "SEO", "Motion"],
  },
];

export function ProjectsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const ctx = gsap.context(() => {
      gsap.from(".projects-title-line", {
        yPercent: 112,
        rotate: 2,
        duration: 1.05,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".projects-heading",
          start: "top 82%",
        },
      });

      gsap.from(".project-fracture .fracture-char", {
        x: (index) => ((index % 4) - 1.5) * 16,
        y: (index) => (index % 2 === 0 ? 34 : -28),
        rotate: (index) => ((index % 6) - 2.5) * 7,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.8,
        ease: "expo.out",
        stagger: { each: 0.012, from: "edges" },
        scrollTrigger: {
          trigger: ".projects-heading",
          start: "top 82%",
        },
      });

      gsap.from(".projects-intro > *", {
        y: 26,
        opacity: 0,
        duration: 0.78,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: ".projects-intro",
          start: "top 84%",
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>(".project-panel");
      const inHorizontalMode = window.innerWidth >= 1024;
      let trackTween: gsap.core.Tween | undefined;

      if (inHorizontalMode) {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

        trackTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight}`,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      const cardTrigger = (
        card: HTMLElement,
        desktopStart: string,
        mobileStart: string,
        desktopEnd?: string,
        mobileEnd?: string,
      ) => ({
        trigger: card,
        start: inHorizontalMode && trackTween ? desktopStart : mobileStart,
        ...(desktopEnd ? { end: inHorizontalMode && trackTween ? desktopEnd : mobileEnd } : {}),
        ...(inHorizontalMode && trackTween ? { containerAnimation: trackTween } : {}),
      });

      cards.forEach((card) => {
        const image = card.querySelector(".project-image");
        const copy = card.querySelectorAll(".project-copy > *");
        const overlay = card.querySelector(".project-overlay");

        gsap.fromTo(
          image,
          { scale: 1.18, clipPath: "inset(12% 14% 12% 14% round 14px)" },
          {
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 14px)",
            duration: 1.1,
            ease: "expo.out",
            immediateRender: false,
            scrollTrigger: cardTrigger(card, "left 78%", "top 82%"),
          },
        );

        gsap.fromTo(
          copy,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.06,
            immediateRender: false,
            scrollTrigger: cardTrigger(card, "left 74%", "top 80%"),
          },
        );

        gsap.to(overlay, {
          opacity: 0.18,
          duration: 1.2,
          ease: "none",
          scrollTrigger: {
            ...cardTrigger(card, "left 70%", "top 76%", "right 30%", "bottom 34%"),
            scrub: true,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="projetos"
      className="relative overflow-hidden bg-[#0d0d0b] text-[#f5f0e6]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,240,230,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(245,240,230,0.045)_1px,transparent_1px)] bg-[size:92px_92px]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0d0d0b] to-transparent" />

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="projects-heading grid gap-8 border-b border-[#f5f0e6]/12 pb-10 lg:grid-cols-[1fr_0.62fr] lg:items-end">
          <h2 className="font-display text-[clamp(4rem,9vw,10rem)] leading-[0.82]">
            <span className="block overflow-hidden">
              <FractureText text="Projetos" className="projects-title-line project-fracture block" />
            </span>
            <span className="block overflow-hidden text-[#ffc090]">
              <FractureText text="em movimento." className="projects-title-line project-fracture block" />
            </span>
          </h2>
          <div className="projects-intro max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9fcaab]">
              Scroll para navegar
            </p>
            <p className="mt-4 text-lg leading-8 text-[#cfc0af]">
              Cada projeto entra como uma cena: imagem, argumento e tecnologia
              se movem juntos, sem parecer catalogo parado.
            </p>
          </div>
        </div>

        <div className="mt-10 flex-1 lg:flex lg:items-center">
          <div
            ref={trackRef}
            className="flex flex-col gap-6 lg:h-[68vh] lg:flex-row lg:gap-7 lg:will-change-transform"
          >
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <article
                  key={project.number}
                  className="project-panel grid min-h-[640px] overflow-hidden border border-[#ffc090]/16 bg-[#151411]/92 shadow-[0_28px_100px_rgba(0,0,0,0.36)] backdrop-blur-xl lg:h-full lg:min-h-0 lg:w-[72vw] lg:max-w-[1040px] lg:shrink-0 lg:grid-cols-[1fr_0.82fr]"
                >
                  <div className="project-image relative min-h-[360px] overflow-hidden bg-[#12110f] lg:min-h-0">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 62vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="project-overlay absolute inset-0 bg-[#12110f]/42" />
                    <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full bg-[#12110f]/72 px-4 py-2 text-[#f5f0e6] backdrop-blur-md">
                      <Icon className="h-4 w-4 text-[#ffc090]" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                        {project.metric}
                      </span>
                    </div>
                  </div>

                  <div className="project-copy flex flex-col justify-between p-7 sm:p-9">
                    <div>
                      <div className="flex items-center justify-between gap-5">
                        <span className="font-display text-6xl leading-none text-[#ffc090]">
                          {project.number}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fcaab]">
                          {project.type}
                        </span>
                      </div>
                      <h3 className="mt-9 max-w-md font-display text-5xl leading-[0.92] sm:text-6xl">
                        {project.title}
                      </h3>
                      <p className="mt-6 max-w-md text-base leading-7 text-[#cfc0af]">
                        {project.text}
                      </p>
                      <dl className="mt-8 grid gap-4 border-t border-[#f5f0e6]/10 pt-6 text-sm leading-6 text-[#d8cfbf]">
                        <div>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fcaab]">
                            Desafio
                          </dt>
                          <dd className="mt-2">{project.challenge}</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ffc090]">
                            Papel
                          </dt>
                          <dd className="mt-2">{project.role}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <div className="mt-8 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[#f5f0e6]/14 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#cfc0af]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        data-magnetic
                        href="#contato"
                        className="mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-[#ffc090] px-5 text-sm font-semibold text-[#14110e] transition-colors hover:bg-[#f5f0e6]"
                      >
                        Quero algo nesse nivel
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
