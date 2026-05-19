// ══════════════════════════════════════════════════════════════════════════════
// HorizontalScrollSection — Pinned horizontal scroll with massive words
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

const WORDS = [
  { word: "PERFORMANCE", subtitle: "0.8s tempo de carga" },
  { word: "CONVERSÃO", subtitle: "+247% mensurados" },
  { word: "ESCALA", subtitle: "Stack pronta pra crescer" },
  { word: "DESIGN", subtitle: "Detalhe que vende" },
  { word: "ENTREGA", subtitle: "21 dias do briefing ao live" },
];

export function HorizontalScrollSection() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = rootRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    // Desktop pin + scrub
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          const trackWidth = track.scrollWidth;
          const viewWidth = window.innerWidth;
          const distance = trackWidth - viewWidth;

          const horizontalAnim = gsap.to(track, {
            x: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance + window.innerHeight * 0.5}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          // Subtitle fade as each word passes center (uses containerAnimation)
          gsap.utils.toArray<HTMLElement>(".hs-word-group").forEach((group) => {
            const subtitle = group.querySelector(".hs-subtitle");
            if (!subtitle) return;
            gsap.fromTo(
              subtitle,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                scrollTrigger: {
                  trigger: group,
                  start: "left 70%",
                  end: "left 30%",
                  containerAnimation: horizontalAnim,
                  scrub: true,
                },
              },
            );
          });
        }, section);

        return () => ctx.revert();
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="manifesto"
      className="relative w-full bg-[#0a0a0f] overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Eyebrow header */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#b38c61]">
          ✦ O que entrego
        </p>
      </div>

      {/* Horizontal track */}
      <div className="relative h-screen w-full flex items-center">
        <div
          ref={trackRef}
          className="flex items-center gap-32 md:gap-48 lg:gap-64 pl-[20vw] pr-[20vw]"
          style={{ willChange: "transform" }}
        >
          {WORDS.map((item, i) => (
            <div
              key={item.word}
              className="hs-word-group flex-shrink-0 flex flex-col items-start"
            >
              <span
                className="font-mono text-xs tracking-[0.3em] text-[#b38c61]/60 mb-4"
              >
                {String(i + 1).padStart(2, "0")} / {String(WORDS.length).padStart(2, "0")}
              </span>

              <h2
                className="text-white leading-[0.85] whitespace-nowrap"
                style={{
                  fontFamily: '"Instrument Serif", serif',
                  fontSize: "clamp(96px, 22vw, 360px)",
                  letterSpacing: "-0.04em",
                  fontStyle: i % 2 === 1 ? "italic" : "normal",
                  color: i % 2 === 1 ? "#dac8b7" : "#fff",
                }}
              >
                {item.word}
              </h2>

              <p
                className="hs-subtitle font-body text-lg md:text-2xl text-[#d6d1d0]/80 mt-6"
                style={{ willChange: "transform, opacity" }}
              >
                <span className="italic-accent">→</span> {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#d6d1d0]/60">
          Scroll
        </span>
        <div className="w-16 h-px bg-[#d6d1d0]/20" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#d6d1d0]/60">
          →
        </span>
      </div>
    </section>
  );
}
