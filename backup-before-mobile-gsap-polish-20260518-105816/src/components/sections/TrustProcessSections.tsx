"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, FileText, Headphones, Rocket, Target } from "lucide-react";
import { FractureText } from "@/components/FractureText";
import { gsap, isReducedMotion } from "@/lib/gsap";

const processSteps = [
  {
    number: "01",
    title: "Diagnostico",
    eyebrow: "Oferta, publico e friccao",
    text: "Entro no negocio antes de desenhar tela: objetivo comercial, prova, canais, gargalos e decisao de compra.",
    icon: Headphones,
    image: "/images/gsap-portrait-app.png",
  },
  {
    number: "02",
    title: "Direcao",
    eyebrow: "Narrativa visual",
    text: "Defino ritmo, hierarquia, copy principal, referencias e o papel de cada interacao no scroll.",
    icon: Target,
    image: "/images/gsap-portrait-pro.png",
  },
  {
    number: "03",
    title: "Construcao",
    eyebrow: "UI, codigo e motion",
    text: "A interface nasce junto com a animacao. Nao e efeito colado depois: o movimento explica e organiza.",
    icon: FileText,
    image: "/images/gsap-profile-code.png",
  },
  {
    number: "04",
    title: "Entrega",
    eyebrow: "Deploy e evolucao",
    text: "Testo performance, responsividade, conversao e deixo o produto pronto para evoluir sem bagunca.",
    icon: Rocket,
    image: "/images/gsap-work-code.png",
  },
];

const testimonials = [
  {
    quote: "A interface ficou com cara de produto grande, mas sem perder clareza para o cliente final.",
    name: "Cliente de produto digital",
  },
  {
    quote: "O processo foi direto: entendeu o problema, organizou a proposta e entregou uma experiencia melhor do que o esperado.",
    name: "Empreendedor local",
  },
  {
    quote: "O site deixou de parecer template. Agora a apresentacao passa valor antes mesmo da conversa comercial.",
    name: "Marca de servicos",
  },
];

export function TrustProcessSections() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from(".proof-title-line", {
        yPercent: 112,
        rotate: 2,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".proof-heading",
          start: "top 82%",
        },
      });

      gsap.from(".proof-fracture .fracture-char", {
        x: (index) => ((index % 5) - 2) * 14,
        y: (index) => (index % 2 === 0 ? 32 : -24),
        rotate: (index) => ((index % 7) - 3) * 5,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.78,
        ease: "expo.out",
        stagger: { each: 0.012, from: "random" },
        scrollTrigger: {
          trigger: ".proof-heading",
          start: "top 82%",
        },
      });

      gsap.from(".proof-card", {
        y: 42,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".proof-grid",
          start: "top 82%",
        },
      });

      gsap.set(".process-image", { opacity: 0, scale: 1.06 });
      gsap.set(".process-image-0", { opacity: 1, scale: 1 });

      gsap.from(".process-heading > *", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".process-heading",
          start: "top 82%",
        },
      });

      gsap.from(".process-fracture .fracture-char", {
        x: (index) => ((index % 4) - 1.5) * 13,
        y: (index) => (index % 2 === 0 ? 30 : -22),
        rotate: (index) => ((index % 6) - 2.5) * 5,
        opacity: 0,
        filter: "blur(7px)",
        duration: 0.76,
        ease: "expo.out",
        stagger: { each: 0.01, from: "edges" },
        scrollTrigger: {
          trigger: ".process-heading",
          start: "top 82%",
        },
      });

      gsap.to(".process-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".process-stage",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      processSteps.forEach((_, index) => {
        const card = `.process-step-${index}`;
        const image = `.process-image-${index}`;

        gsap.fromTo(
          card,
          { y: 42 },
          {
            y: 0,
            duration: 0.8,
            ease: "expo.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              start: "top 72%",
              end: "bottom 42%",
              scrub: true,
            },
          },
        );

        gsap.to(card, {
          borderColor: "rgba(255,192,144,0.55)",
          backgroundColor: "rgba(245,240,230,0.08)",
          scrollTrigger: {
            trigger: card,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });

        gsap.to(".process-image", {
          opacity: 0,
          scale: 1.06,
          duration: 0.35,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        });

        gsap.to(image, {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="bg-[#0d0d0b] text-[#f5f0e6]">
      <section
        id="depoimentos"
        className="relative overflow-hidden border-t border-[#f5f0e6]/10 py-24 sm:py-30 lg:py-36"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,240,230,0.048)_1px,transparent_1px),linear-gradient(180deg,rgba(245,240,230,0.038)_1px,transparent_1px)] bg-[size:92px_92px]" />
        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="proof-heading grid gap-8 lg:grid-cols-[1fr_0.62fr] lg:items-end">
            <h2 className="font-display text-[clamp(4rem,8vw,9rem)] leading-[0.84]">
              <span className="block overflow-hidden">
                <FractureText text="Valor antes" className="proof-title-line proof-fracture block" />
              </span>
              <span className="block overflow-hidden text-[#ffc090]">
                <FractureText text="do clique." className="proof-title-line proof-fracture block" />
              </span>
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[#cfc0af]">
              A direcao visual precisa vender competencia em segundos. O motion
              entra para guiar, dar ritmo e conectar uma secao na outra.
            </p>
          </div>

          <div className="proof-grid mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <article
                key={item.name}
                className="proof-card min-h-[300px] border border-[#f5f0e6]/12 bg-[#151411] p-6"
              >
                <div className="font-display text-6xl leading-none text-[#ffc090]">
                  0{index + 1}
                </div>
                <p className="mt-8 text-xl leading-8 text-[#f5f0e6]">"{item.quote}"</p>
                <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fcaab]">
                  {item.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="processo" className="process-stage relative border-t border-[#f5f0e6]/10">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.92fr_1fr] lg:px-12 lg:py-32">
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
            <div className="process-heading">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9fcaab]">
                Metodo
              </p>
              <h2 className="mt-5 max-w-xl font-display text-[clamp(3.8rem,7vw,8rem)] leading-[0.86]">
                <FractureText text="Um fluxo. Quatro viradas." className="process-fracture" />
              </h2>
            </div>

            <div className="relative mt-10 aspect-[4/5] max-h-[58vh] overflow-hidden border border-[#ffc090]/18 bg-[#151411] shadow-[0_28px_100px_rgba(0,0,0,0.42)]">
              {processSteps.map((step, index) => (
                <Image
                  key={step.image}
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className={`process-image process-image-${index} object-cover`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0b]/82 via-transparent to-transparent" />
              <a
                data-magnetic
                href="#contato"
                className="absolute bottom-5 left-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#ffc090] px-4 text-sm font-semibold text-[#14110e]"
              >
                Comecar briefing
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 hidden h-full w-px bg-[#f5f0e6]/14 sm:block">
              <span className="process-progress absolute inset-x-0 top-0 block h-full origin-top scale-y-0 bg-[#ffc090]" />
            </div>

            <div className="space-y-6 sm:pl-12">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article
                    key={step.number}
                    className={`process-step-${index} min-h-[56vh] border border-[#f5f0e6]/12 bg-[#151411]/72 p-6 sm:p-8`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <span className="font-display text-7xl leading-none text-[#ffc090]">
                        {step.number}
                      </span>
                      <span className="flex h-12 w-12 items-center justify-center border border-[#f5f0e6]/14 text-[#9fcaab]">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.22em] text-[#9fcaab]">
                      {step.eyebrow}
                    </p>
                    <h3 className="mt-4 max-w-2xl font-display text-[clamp(3rem,6vw,6.5rem)] leading-[0.86]">
                      {step.title}
                    </h3>
                    <p className="mt-7 max-w-xl text-lg leading-8 text-[#cfc0af]">
                      {step.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
