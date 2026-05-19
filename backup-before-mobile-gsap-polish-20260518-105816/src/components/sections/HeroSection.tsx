"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { FractureText } from "@/components/FractureText";
import { gsap, isReducedMotion } from "@/lib/gsap";

const floatingFrames = [
  {
    src: "/images/gsap-app-showcase.png",
    alt: "Aplicativo desenvolvido por Emmanuel",
    className: "left-[34%] bottom-[13%] h-[22vh] w-[27vw] min-w-[280px]",
  },
  {
    src: "/images/gsap-server-metrics.png",
    alt: "Infraestrutura e metricas",
    className: "right-[7%] top-[18%] h-[25vh] w-[18vw] min-w-[210px]",
  },
  {
    src: "/images/gsap-dashboard-hands.png",
    alt: "Dashboard em operacao",
    className: "left-[7%] bottom-[20%] h-[24vh] w-[18vw] min-w-[210px]",
  },
  {
    src: "/images/gsap-work-code.png",
    alt: "Ambiente de desenvolvimento",
    className: "right-[18%] bottom-[8%] h-[19vh] w-[17vw] min-w-[190px]",
  },
];

const stats = [
  ["01", "Estrategia"],
  ["02", "Interface"],
  ["03", "Codigo"],
  ["04", "Conversao"],
];

export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    let cleanupMove: (() => void) | undefined;

    const ctx = gsap.context(() => {
      gsap.set(".jm-loader-panel", { yPercent: 0 });
      gsap.set(".jm-bg-media", {
        clipPath: "inset(16% 12% 16% 12% round 18px)",
        scale: 1.12,
        opacity: 0.25,
      });
      gsap.set(".jm-word", { yPercent: 112, rotate: 2 });
      gsap.set(".hero-fracture .fracture-char", {
        x: (index) => ((index % 5) - 2) * 18,
        y: (index) => (index % 2 === 0 ? 44 : -34),
        rotate: (index) => ((index % 7) - 3) * 6,
        opacity: 0,
        filter: "blur(9px)",
      });
      gsap.set(".jm-kicker > *", { y: 18, opacity: 0 });
      gsap.set(".jm-copy > *", { y: 28, opacity: 0 });
      gsap.set(".jm-action", { y: 28, opacity: 0 });
      gsap.set(".jm-frame", {
        y: 90,
        opacity: 0,
        scale: 0.72,
        rotate: -8,
        clipPath: "inset(24% 18% 24% 18% round 12px)",
      });
      gsap.set(".jm-marker", { y: 20, opacity: 0, rotate: -4 });
      gsap.set(".jm-stat", { y: 22, opacity: 0 });
      gsap.set(".jm-scroll-cue", { opacity: 0, y: -8 });

      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });

      intro
        .to(".jm-loader-panel", { yPercent: -101, duration: 0.92, stagger: 0.06 }, 0)
        .to(
          ".jm-bg-media",
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            scale: 1,
            opacity: 1,
            duration: 1.35,
          },
          0.12,
        )
        .to(".jm-word", { yPercent: 0, rotate: 0, duration: 1.18, stagger: 0.075 }, 0.3)
        .to(
          ".hero-fracture .fracture-char",
          {
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.78,
            stagger: { each: 0.012, from: "random" },
          },
          0.34,
        )
        .to(".jm-kicker > *", { y: 0, opacity: 1, duration: 0.72, stagger: 0.06 }, 0.45)
        .to(
          ".jm-frame",
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            clipPath: "inset(0% 0% 0% 0% round 12px)",
            duration: 1,
            stagger: 0.08,
          },
          0.72,
        )
        .to(".jm-marker", { y: 0, opacity: 1, rotate: 0, duration: 0.72, stagger: 0.06 }, 0.9)
        .to(".jm-copy > *", { y: 0, opacity: 1, duration: 0.76, stagger: 0.07 }, 1.02)
        .to(".jm-action", { y: 0, opacity: 1, duration: 0.72, stagger: 0.07 }, 1.14)
        .to(".jm-stat", { y: 0, opacity: 1, duration: 0.7, stagger: 0.055 }, 1.2)
        .to(".jm-scroll-cue", { opacity: 1, y: 0, duration: 0.6 }, 1.32);

      gsap.to(".jm-bg-media img", {
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".jm-frame", {
        yPercent: (index) => (index % 2 === 0 ? -6 : 7),
        rotate: (index) => (index % 2 === 0 ? -2.5 : 2.5),
        duration: 3.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
      });

      gsap.to(".jm-marker", {
        y: (index) => (index % 2 === 0 ? -10 : 9),
        duration: 2.3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.15,
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=1900",
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to(".jm-bg-media", { scale: 0.88, xPercent: -14, yPercent: -3, borderRadius: 18 }, 0)
        .to(".jm-bg-shade", { opacity: 0.78 }, 0)
        .to(".jm-title-top", { xPercent: -16, opacity: 0.28 }, 0)
        .to(".jm-title-bottom", { xPercent: 17, opacity: 0.34 }, 0)
        .to(".jm-copy", { yPercent: -46, opacity: 0 }, 0)
        .to(".jm-stat", { y: 42, opacity: 0 }, 0)
        .to(".jm-frame-0", { xPercent: 118, yPercent: -90, rotate: 12, scale: 1.14 }, 0)
        .to(".jm-frame-1", { xPercent: -92, yPercent: 40, rotate: -14, scale: 1.18 }, 0)
        .to(".jm-frame-2", { xPercent: 126, yPercent: 56, rotate: 10, scale: 1.13 }, 0)
        .to(".jm-frame-3", { xPercent: -72, yPercent: -78, rotate: -11, scale: 1.16 }, 0)
        .to(".jm-marker-copy", { xPercent: 135, yPercent: -110, rotate: -14 }, 0)
        .to(".jm-marker-click", { xPercent: -118, yPercent: 80, rotate: 16 }, 0)
        .to(".jm-marker-scroll", { xPercent: 112, yPercent: 92, rotate: -10 }, 0);

      const onMove = (event: MouseEvent) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(".jm-bg-media", {
          x: x * 12,
          y: y * 10,
          duration: 0.9,
          ease: "power3.out",
        });

        gsap.to(".jm-frame", {
          x: (index) => x * (index % 2 === 0 ? 24 : -22),
          y: (index) => y * (index % 2 === 0 ? 18 : -18),
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
    <section
      ref={rootRef}
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#0d0d0b] text-[#f5f0e6]"
    >
      <div className="pointer-events-none absolute inset-0 z-40 grid grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="jm-loader-panel h-full bg-[#0d0d0b]" />
        ))}
      </div>

      <div className="jm-bg-media absolute inset-0 overflow-hidden will-change-transform">
        <Image
          src="/images/gsap-profile-code.png"
          alt="Emmanuel trabalhando em um ambiente de desenvolvimento"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_48%]"
        />
      </div>

      <div className="jm-bg-shade absolute inset-0 bg-[linear-gradient(90deg,rgba(13,13,11,0.86)_0%,rgba(13,13,11,0.32)_44%,rgba(13,13,11,0.82)_100%)] opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,11,0.64)_0%,rgba(13,13,11,0.08)_40%,rgba(13,13,11,0.84)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,240,230,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(245,240,230,0.045)_1px,transparent_1px)] bg-[size:92px_92px] opacity-70" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-5 pb-6 pt-24 sm:px-8 lg:px-12">
        <div className="jm-kicker flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ffc090]">
          <span>Design + codigo</span>
          <span className="hidden text-[#f5f0e6]/72 md:inline">Full-stack developer</span>
          <span>Fortaleza / BR</span>
        </div>

        <div className="relative flex flex-1 items-center [perspective:1200px]">
          <div className="jm-copy relative z-30 max-w-[44rem] pt-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#c7a36a]">
              Portfolio interativo
            </p>
            <h1 className="mt-5 font-display text-[clamp(4.6rem,10vw,11.5rem)] leading-[0.78] text-[#ffc090]">
              <span className="jm-title-top block overflow-hidden">
                <FractureText text="Emmanuel" className="jm-word hero-fracture block" />
              </span>
              <span className="jm-title-bottom block overflow-hidden text-[#f5f0e6]">
                <FractureText text="Bezerra" className="jm-word hero-fracture block" />
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-7 text-[#f2dcc9]">
              Sites e sistemas com movimento que guia o olhar, conecta secoes e
              transforma tecnologia em uma experiencia memoravel.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                data-magnetic
                href="https://wa.me/5585998500344?text=Ola%20Emmanuel!%20Quero%20um%20site%20profissional%20com%20uma%20experiencia%20interativa."
                target="_blank"
                rel="noopener noreferrer"
                className="jm-action inline-flex h-12 items-center gap-2 rounded-full bg-[#ffc090] px-5 text-sm font-semibold text-[#14110e] transition duration-300 hover:bg-[#f5f0e6]"
              >
                <Sparkles className="h-4 w-4" />
                Quero meu site
              </a>
              <Link
                data-magnetic
                href="#projetos"
                className="jm-action inline-flex h-12 items-center gap-2 rounded-full border border-[#f5f0e6]/26 px-5 text-sm font-semibold text-[#f5f0e6] transition duration-300 hover:border-[#ffc090] hover:text-[#ffc090]"
              >
                Ver projetos
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {floatingFrames.map((frame, index) => (
            <div
              key={frame.src}
              className={`jm-frame jm-frame-${index} absolute z-20 hidden overflow-hidden border border-[#ffc090]/22 bg-[#0d0d0b] shadow-[0_24px_100px_rgba(0,0,0,0.48)] will-change-transform md:block ${frame.className}`}
            >
              <Image src={frame.src} alt={frame.alt} fill sizes="420px" className="object-cover" />
              <div className="absolute inset-0 bg-[#0d0d0b]/8" />
            </div>
          ))}

          <span className="jm-marker jm-marker-copy absolute right-[23%] top-[21%] z-30 hidden font-display text-5xl italic text-[#ffc090] md:block">
            copy
          </span>
          <span className="jm-marker jm-marker-click absolute bottom-[27%] left-[25%] z-30 hidden font-display text-5xl italic text-[#f5f0e6] md:block">
            click
          </span>
          <span className="jm-marker jm-marker-scroll absolute bottom-[17%] right-[14%] z-30 hidden font-display text-5xl italic text-[#9fcaab] md:block">
            scroll
          </span>
        </div>

        <div className="grid gap-5 border-t border-[#f5f0e6]/14 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(([index, label]) => (
              <div key={label} className="jm-stat">
                <strong className="block font-display text-4xl leading-none text-[#ffc090]">
                  {index}
                </strong>
                <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5f0e6]/62">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="jm-scroll-cue hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#f5f0e6]/62 sm:flex">
            <span>Role a historia</span>
            <ArrowDown className="h-4 w-4 text-[#ffc090]" />
          </div>
        </div>
      </div>
    </section>
  );
}
