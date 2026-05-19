// ══════════════════════════════════════════════════════════════════════════════
// CaseStudyPinSection — Pin section com counter animado e card 3D flip
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { TrendingUp, Clock, Zap } from "lucide-react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

type Metric = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  prefix?: string;
  value: number;
  suffix?: string;
  decimals?: number;
};

const METRICS: Metric[] = [
  { icon: Zap, label: "Tempo de carga", value: 0.8, suffix: "s", decimals: 1 },
  { icon: TrendingUp, label: "Conversão", value: 247, suffix: "%" },
  { icon: Clock, label: "Entrega", value: 21, suffix: " dias" },
];

export function CaseStudyPinSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = rootRef.current;
    if (!section) return;

    // Mobile fallback (no pin)
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const cardInner = section.querySelector(".cs-card-inner");
        const orb = section.querySelector(".cs-orb");
        const eyebrow = section.querySelector(".cs-eyebrow");
        const title = section.querySelectorAll(".cs-title .char");
        const metrics = section.querySelectorAll(".cs-metric");

        // Eyebrow + title entry
        gsap.from(eyebrow, {
          opacity: 0,
          y: 20,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: section, start: "top 60%" },
        });
        gsap.from(title, {
          yPercent: 110,
          rotateX: -50,
          opacity: 0,
          stagger: 0.025,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: section, start: "top 60%" },
        });

        // Main pin timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=2200",
            pin: true,
            scrub: 1,
          },
        });

        tl.to(orb, { scale: 2.4, opacity: 0.6 }, 0)
          .fromTo(
            cardInner,
            { rotateY: 0 },
            { rotateY: 180, duration: 1, ease: "power2.inOut" },
            0.2,
          )
          .from(
            metrics,
            {
              opacity: 0,
              y: 60,
              stagger: 0.2,
              ease: "expo.out",
              duration: 0.8,
            },
            0.4,
          );

        // Animate counters during pin
        METRICS.forEach((metric, i) => {
          const el = section.querySelector(`.cs-metric-${i} .cs-value`);
          if (!el) return;

          gsap.fromTo(
            el,
            { innerText: 0 },
            {
              innerText: metric.value,
              snap: metric.decimals ? { innerText: 0.1 } : { innerText: 1 },
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: `top+=${(0.4 + i * 0.1) * 2200} top`,
                end: `top+=${(0.6 + i * 0.1) * 2200} top`,
                scrub: 1,
              },
            },
          );
        });
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="case-study"
      className="relative w-full overflow-hidden bg-[#0a0a0f] py-24 md:py-40"
      style={{ minHeight: "100vh" }}
    >
      {/* Ambient orb */}
      <div
        className="cs-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[160px] opacity-25 pointer-events-none"
        style={{ background: "#b38c61", willChange: "transform, opacity" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="mb-16 md:mb-24 max-w-3xl">
          <p className="cs-eyebrow font-mono text-[11px] uppercase tracking-[0.3em] text-[#b38c61] mb-6">
            ✦ Caso · Clínica Estética Premium
          </p>
          <h2 className="cs-title display-xl text-white overflow-hidden">
            <span className="block">
              {"De ".split("").map((c, i) => (
                <span key={`a-${i}`} className="char inline-block">
                  {c === " " ? " " : c}
                </span>
              ))}
              <span className="italic-accent">
                {"convencional".split("").map((c, i) => (
                  <span key={`b-${i}`} className="char inline-block italic">
                    {c}
                  </span>
                ))}
              </span>
            </span>
            <span className="block">
              {"a ".split("").map((c, i) => (
                <span key={`c-${i}`} className="char inline-block">
                  {c === " " ? " " : c}
                </span>
              ))}
              <span className="italic-accent">
                {"extraordinário".split("").map((c, i) => (
                  <span key={`d-${i}`} className="char inline-block italic">
                    {c}
                  </span>
                ))}
              </span>
              .
            </span>
          </h2>
        </div>

        {/* Card + Metrics layout */}
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] items-center">
          {/* Card flip */}
          <div
            className="relative aspect-[4/5] w-full max-w-md mx-auto"
            style={{ perspective: 1600 }}
          >
            <div
              className="cs-card-inner relative w-full h-full"
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-md overflow-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <Image
                  src="/images/project-estetica.png"
                  alt="Antes"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)",
                  }}
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d6d1d0]/70 mb-2">
                    Antes
                  </p>
                  <p className="font-display text-3xl text-white">
                    Site lento, sem leads.
                  </p>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-md overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <Image
                  src="/images/projects/case-study-bg.png"
                  alt="Depois"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)",
                  }}
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#b38c61] mb-2">
                    Depois
                  </p>
                  <p className="font-display text-3xl text-white">
                    <span className="italic-accent">+247%</span> em conversão.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-8">
            <p className="font-body text-base md:text-lg leading-relaxed text-[#d6d1d0] max-w-md">
              Rebuild completo em <span className="italic-accent">3 semanas</span>.
              Stack: Next.js 15, Prisma, Stripe. Resultado mensurado em 90 dias após o lançamento.
            </p>

            <div className="space-y-6 pt-4 border-t border-[#d6d1d0]/15">
              {METRICS.map((m, i) => (
                <div
                  key={m.label}
                  className={`cs-metric cs-metric-${i} flex items-baseline gap-6 py-4 border-b border-[#d6d1d0]/10`}
                >
                  <m.icon className="h-4 w-4 text-[#b38c61] shrink-0" />
                  <div className="flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d6d1d0]/60 mb-2">
                      {m.label}
                    </p>
                    <p className="font-display text-5xl md:text-6xl text-white leading-none">
                      {m.prefix}
                      <span className="cs-value">0</span>
                      <span className="italic-accent">{m.suffix}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
