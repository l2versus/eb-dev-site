"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Code2, Layers3, Workflow } from "lucide-react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import {
  CountUpStat,
  ImageRevealMask,
  LogoMarquee,
  MagneticButton,
  TextSplitReveal,
  TiltCard,
} from "@/components/motion";

const stack = ["React", "Next.js", "Tailwind", "GSAP", "ScrollTrigger", "Lenis", "Node", "Prisma"];

const services = [
  {
    icon: Layers3,
    title: "Direcao visual",
    text: "Identidade aplicada em layout, hierarquia, ritmo e composicao para o site parecer autoral.",
  },
  {
    icon: Workflow,
    title: "Motion system",
    text: "Transicoes, reveals, parallax e scroll scenes pensados como linguagem do produto.",
  },
  {
    icon: Code2,
    title: "Full-stack delivery",
    text: "Frontend, backend, painel, integracoes e deploy com a mesma atencao visual da interface.",
  },
];

export function AboutServicesSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from(".about-kicker", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.from(".about-copy > *", {
        y: 32,
        opacity: 0,
        duration: 0.85,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".about-copy",
          start: "top 82%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.from(".service-card", {
        y: 46,
        opacity: 0,
        duration: 0.85,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 82%",
          toggleActions: "play reverse play reverse",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="sobre"
      className="relative overflow-hidden border-t border-[#f5f0e6]/10 bg-[#0d0d0b] text-[#f5f0e6]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,240,230,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(245,240,230,0.035)_1px,transparent_1px)] bg-[size:92px_92px]" />

      <div className="relative mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <LogoMarquee
          items={stack}
          className="border-y border-[#f5f0e6]/10 py-4 text-[#f5f0e6]/42"
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.82fr_1fr] lg:items-start">
          <div>
            <p className="about-kicker font-mono text-[11px] uppercase tracking-[0.24em] text-[#ffc090]">
              Sobre o studio
            </p>
            <h2 className="mt-6 max-w-3xl font-display text-[clamp(3.8rem,7vw,8.2rem)] leading-[0.86]">
              <TextSplitReveal text="Interface com assinatura." />
            </h2>
          </div>

          <div className="about-copy grid gap-8">
            <p className="max-w-2xl text-xl leading-9 text-[#d7c7b7]">
              O site precisa parecer caro antes do cliente entender o stack.
              Por isso eu trato marca, copy, imagem, animacao e codigo como
              uma coisa so: uma experiencia que vende confianca.
            </p>

            <div className="grid gap-5 sm:grid-cols-3">
              <CountUpStat value={15} suffix="+" label="Projetos" />
              <CountUpStat value={90} suffix="+" label="Performance alvo" />
              <CountUpStat value={4} label="Etapas claras" />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-7 lg:grid-cols-[0.92fr_1fr] lg:items-stretch">
          <ImageRevealMask className="relative min-h-[360px] border border-[#ffc090]/16 bg-[#151411] shadow-[0_28px_100px_rgba(0,0,0,0.34)] sm:min-h-[520px]">
            <Image
              src="/images/gsap-portrait-app.png"
              alt="Emmanuel apresentando um aplicativo"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover object-[54%_45%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0b]/74 via-transparent to-transparent" />
          </ImageRevealMask>

          <div className="services-grid grid gap-5">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <TiltCard
                  key={service.title}
                  className="service-card border border-[#f5f0e6]/12 bg-[#f5f0e6]/[0.045] p-6 backdrop-blur-md"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex h-12 w-12 items-center justify-center border border-[#ffc090]/22 text-[#ffc090]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-display text-5xl leading-none text-[#ffc090]">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-10 text-2xl font-semibold text-[#f5f0e6]">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[#cfc0af]">
                    {service.text}
                  </p>
                </TiltCard>
              );
            })}

            <MagneticButton
              href="#contato"
              className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-[#ffc090] px-5 text-sm font-semibold text-[#14110e] transition-colors hover:bg-[#f5f0e6]"
            >
              Transformar minha marca
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

