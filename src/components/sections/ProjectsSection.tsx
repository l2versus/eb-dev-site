"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Database, Gauge } from "lucide-react";
import { FractureText } from "@/components/FractureText";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

const projects = [
  {
    number: "01",
    title: "Ricardo Rautenberg",
    type: "Imóveis de Luxo",
    image: "/images/project-ricardo.png",
    metric: "Portfólio",
    text: "Portfólio digital premium para corretor de alto padrão — listagem de imóveis off-market, painel admin e SEO.",
    challenge: "Apresentar imóveis de alto valor com performance e UX discreta.",
    role: "Design, Front-end, Integração",
    icon: Code2,
    tags: ["Next.js", "Prisma", "SEO"],
  },
  {
    number: "02",
    title: "Myka Procópio",
    type: "SaaS Clínica",
    image: "/images/project-estetica.png",
    metric: "Plataforma",
    text: "Sistema completo para gestão de clínica: agendamento, pagamentos, chatbot e dashboard financeiro.",
    challenge: "Unir UX para pacientes e painel administrativo eficiente.",
    role: "Arquitetura, UI, Back-end",
    icon: Database,
    tags: ["Next.js", "Mercado Pago", "Prisma"],
  },
  {
    number: "03",
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
    number: "04",
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
    number: "05",
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
    number: "06",
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
  const pinFrameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinTriggerRef = useRef<ScrollTrigger | null>(null);
  const activeIndexRef = useRef(0);

  const scrollToProject = (direction: -1 | 1) => {
    const trigger = pinTriggerRef.current ?? ScrollTrigger.getById("projects-horizontal");
    if (!trigger) return;

    const nextIndex = Math.max(0, Math.min(projects.length - 1, activeIndexRef.current + direction));
    activeIndexRef.current = nextIndex;

    const progress = nextIndex / Math.max(1, projects.length - 1);
    const targetY = trigger.start + (trigger.end - trigger.start) * progress;
    window.scrollTo({
      top: Math.max(trigger.start, Math.min(trigger.end, targetY)),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = rootRef.current;
    const pinFrame = pinFrameRef.current;
    const track = trackRef.current;
    if (!root || !pinFrame || !track) return;

    const cleanupFns: Array<() => void> = [];

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
          toggleActions: "play reverse play reverse",
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
          toggleActions: "play reverse play reverse",
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
          toggleActions: "play reverse play reverse",
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>(".project-panel");
      const inHorizontalMode = window.innerWidth >= 1024;
      let trackTween: gsap.core.Tween | undefined;
      const rail = root.querySelector<HTMLElement>(".projects-progress-rail");
      const railFill = root.querySelector<HTMLElement>(".projects-rail-fill");
      const railThumb = root.querySelector<HTMLElement>(".projects-rail-thumb");

      const clampProgress = (value: number) => Math.max(0, Math.min(1, value));
      const syncProgressUi = (progress: number) => {
        const clamped = clampProgress(progress);
        activeIndexRef.current = Math.round(clamped * (projects.length - 1));
        if (railFill) gsap.set(railFill, { scaleX: clamped, transformOrigin: "left center" });
        if (railThumb && rail) gsap.set(railThumb, { x: 16 + clamped * Math.max(1, rail.clientWidth - 32) });
      };

      syncProgressUi(0);

      if (inHorizontalMode) {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 120);
        const scrollToProgress = (progress: number, behavior: ScrollBehavior = "auto") => {
          const trigger = pinTriggerRef.current ?? ScrollTrigger.getById("projects-horizontal");
          if (!trigger) return;

          const clamped = clampProgress(progress);
          const targetY = trigger.start + (trigger.end - trigger.start) * clamped;
          window.scrollTo({ top: targetY, behavior });
        };

        trackTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            id: "projects-horizontal",
            trigger: pinFrame,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 1.15}`,
            pin: true,
            scrub: 0.95,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              pinTriggerRef.current = self;
              syncProgressUi(self.progress);
            },
            onUpdate: (self) => {
              pinTriggerRef.current = self;
              syncProgressUi(self.progress);
            },
          },
        });

        const dragSurface = root.querySelector<HTMLElement>(".projects-drag-surface");
        if (dragSurface && trackTween.scrollTrigger) {
          pinTriggerRef.current = trackTween.scrollTrigger;

          let dragging = false;
          let startX = 0;
          let startScrollY = 0;

          const onPointerDown = (event: PointerEvent) => {
            const target = event.target instanceof Element ? event.target : null;
            if (target?.closest("a, button, .projects-progress-rail")) return;
            const trigger = pinTriggerRef.current ?? ScrollTrigger.getById("projects-horizontal");
            if (!trigger) return;

            dragging = true;
            startX = event.clientX;
            startScrollY = window.scrollY;
            document.documentElement.classList.add("cursor-grabbing");
            dragSurface.classList.add("cursor-grabbing");
            event.preventDefault();
          };

          const onPointerMove = (event: PointerEvent) => {
            if (!dragging) return;
            const trigger = pinTriggerRef.current ?? ScrollTrigger.getById("projects-horizontal");
            if (!trigger) return;

            const deltaX = event.clientX - startX;
            const targetY = Math.max(trigger.start, Math.min(trigger.end, startScrollY - deltaX * 1.65));
            event.preventDefault();
            window.scrollTo({ top: targetY, behavior: "auto" });
          };

          const endDrag = () => {
            if (!dragging) return;
            dragging = false;
            document.documentElement.classList.remove("cursor-grabbing");
            dragSurface.classList.remove("cursor-grabbing");
          };

          dragSurface.addEventListener("pointerdown", onPointerDown);
          document.addEventListener("pointermove", onPointerMove, { passive: false });
          document.addEventListener("pointerup", endDrag);
          document.addEventListener("pointercancel", endDrag);
          window.addEventListener("blur", endDrag);

          cleanupFns.push(() => {
            dragSurface.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerup", endDrag);
            document.removeEventListener("pointercancel", endDrag);
            window.removeEventListener("blur", endDrag);
            document.documentElement.classList.remove("cursor-grabbing");
          });
        }

        if (rail) {
          let draggingRail = false;

          const moveRail = (event: PointerEvent, behavior: ScrollBehavior = "auto") => {
            const rect = rail.getBoundingClientRect();
            scrollToProgress((event.clientX - rect.left) / rect.width, behavior);
          };

          const onRailDown = (event: PointerEvent) => {
            draggingRail = true;
            rail.setPointerCapture?.(event.pointerId);
            moveRail(event);
            event.preventDefault();
          };

          const onRailMove = (event: PointerEvent) => {
            if (!draggingRail) return;
            moveRail(event);
            event.preventDefault();
          };

          const onRailUp = (event: PointerEvent) => {
            if (!draggingRail) return;
            draggingRail = false;
            rail.releasePointerCapture?.(event.pointerId);
          };

          const onRailClick = (event: MouseEvent) => {
            const target = event.target instanceof Element ? event.target : null;
            if (target?.closest("button")) return;
            const rect = rail.getBoundingClientRect();
            scrollToProgress((event.clientX - rect.left) / rect.width, "smooth");
          };

          rail.addEventListener("pointerdown", onRailDown);
          rail.addEventListener("pointermove", onRailMove, { passive: false });
          rail.addEventListener("pointerup", onRailUp);
          rail.addEventListener("pointercancel", onRailUp);
          rail.addEventListener("click", onRailClick);

          cleanupFns.push(() => {
            rail.removeEventListener("pointerdown", onRailDown);
            rail.removeEventListener("pointermove", onRailMove);
            rail.removeEventListener("pointerup", onRailUp);
            rail.removeEventListener("pointercancel", onRailUp);
            rail.removeEventListener("click", onRailClick);
          });
        }
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
            scrollTrigger: {
              ...cardTrigger(card, "left 78%", "top 82%"),
              toggleActions: "play reverse play reverse",
            },
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
            scrollTrigger: {
              ...cardTrigger(card, "left 74%", "top 80%"),
              toggleActions: "play reverse play reverse",
            },
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

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
      pinTriggerRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="projetos"
      className="relative overflow-hidden bg-[#0d0d0b] text-[#f5f0e6]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,240,230,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(245,240,230,0.045)_1px,transparent_1px)] bg-[size:92px_92px]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0d0d0b] to-transparent" />

      <div className="relative mx-auto max-w-[1500px] px-5 pb-8 pt-20 sm:px-8 lg:px-12 lg:pb-10 lg:pt-24">
        <div className="projects-heading grid gap-6 border-b border-[#f5f0e6]/12 pb-7 lg:grid-cols-[1fr_0.62fr] lg:items-end">
          <h2 className="font-display text-[clamp(3.25rem,7vw,8rem)] leading-[0.82]">
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
      </div>

      <div
        ref={pinFrameRef}
        className="projects-pin-frame relative mx-auto flex min-h-screen max-w-[1500px] flex-col px-5 pb-20 pt-[72px] sm:px-8 lg:h-screen lg:min-h-0 lg:px-12 lg:pb-24 lg:pt-[86px]"
      >
        <div className="projects-drag-surface flex min-h-0 flex-1 touch-pan-y select-none lg:flex lg:cursor-grab lg:touch-none lg:items-center">
          <div
            ref={trackRef}
            className="flex flex-col gap-6 lg:h-[min(66vh,570px)] lg:min-h-[490px] lg:flex-row lg:gap-6 lg:will-change-transform"
          >
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <article
                  key={project.number}
                  className="project-panel grid min-h-[600px] overflow-hidden border border-[#ffc090]/16 bg-[#151411]/92 shadow-[0_28px_100px_rgba(0,0,0,0.36)] backdrop-blur-xl lg:h-full lg:min-h-0 lg:w-[58vw] lg:max-w-[870px] lg:shrink-0 lg:grid-cols-[0.82fr_0.82fr]"
                >
                  <div className="project-image relative min-h-[320px] overflow-hidden bg-[#12110f] lg:min-h-0">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 62vw"
                      className="pointer-events-none object-cover"
                      draggable={false}
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

                  <div className="project-copy flex min-w-0 flex-col justify-between p-5 sm:p-6 lg:p-5">
                    <div>
                      <div className="flex items-center justify-between gap-5">
                        <span className="font-display text-4xl leading-none text-[#ffc090]">
                          {project.number}
                        </span>
                        <span className="max-w-[52%] text-right font-mono text-[9px] uppercase tracking-[0.18em] text-[#9fcaab]">
                          {project.type}
                        </span>
                      </div>
                      <h3 className="mt-4 max-w-md font-display text-[clamp(2.1rem,3.3vw,3.45rem)] leading-[0.9]">
                        {project.title}
                      </h3>
                      <p className="mt-3 max-w-md text-[13px] leading-5 text-[#cfc0af]">
                        {project.text}
                      </p>
                      <dl className="mt-4 grid gap-2 border-t border-[#f5f0e6]/10 pt-3 text-[13px] leading-5 text-[#d8cfbf]">
                        <div>
                          <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9fcaab]">
                            Desafio
                          </dt>
                          <dd className="mt-1.5">{project.challenge}</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ffc090]">
                            Papel
                          </dt>
                          <dd className="mt-1.5">{project.role}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[#f5f0e6]/14 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[#cfc0af]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        data-magnetic
                        href="#contato"
                        className="mt-3 inline-flex h-10 w-fit items-center gap-2 rounded-full bg-[#ffc090] px-4 text-[13px] font-semibold text-[#14110e] transition-colors hover:bg-[#f5f0e6]"
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

        <div className="projects-controls pointer-events-auto absolute bottom-6 left-1/2 z-[90] hidden w-[min(620px,calc(100vw-3rem))] -translate-x-1/2 items-center gap-3 rounded-full border border-[#f5f0e6]/12 bg-[#0d0d0b]/82 p-2 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:flex">
          <button
            type="button"
            onClick={() => scrollToProject(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f5f0e6]/18 bg-[#0d0d0b]/78 text-[#f5f0e6] backdrop-blur-xl transition hover:border-[#ffc090] hover:text-[#ffc090]"
            aria-label="Projeto anterior"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div
            className="projects-progress-rail relative h-11 flex-1 cursor-ew-resize rounded-full border border-[#f5f0e6]/12 bg-[#f5f0e6]/8 px-4"
            role="slider"
            aria-label="Navegar pelos projetos"
            aria-valuemin={0}
            aria-valuemax={projects.length - 1}
            aria-valuenow={activeIndexRef.current}
            tabIndex={0}
          >
            <span className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 bg-[#f5f0e6]/18" />
            <span className="projects-rail-fill absolute left-4 top-1/2 h-px w-[calc(100%-2rem)] -translate-y-1/2 scale-x-0 bg-[#ffc090]" />
            <span className="projects-rail-thumb absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#14110e] bg-[#ffc090] shadow-[0_0_22px_rgba(255,192,144,0.5)]" />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#f5f0e6]/58">
              arraste ou clique
            </span>
          </div>
          <button
            type="button"
            onClick={() => scrollToProject(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f5f0e6]/18 bg-[#ffc090] text-[#14110e] backdrop-blur-xl transition hover:bg-[#f5f0e6]"
            aria-label="Proximo projeto"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
