"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

const VIDEO_STORY_SCROLL_DISTANCE = 9200;

type Chapter = {
  id: string;
  label: string;
  word: string;
  tone: string;
  pinnedDistance?: number;
};

const chapters: Chapter[] = [
  { id: "hero", label: "Inicio", word: "Start", tone: "#ffc090" },
  {
    id: "videos",
    label: "Video",
    word: "Motion",
    tone: "#8bb7d6",
    pinnedDistance: VIDEO_STORY_SCROLL_DISTANCE,
  },
  { id: "sobre", label: "Sobre", word: "Identity", tone: "#9fcaab" },
  { id: "projetos", label: "Projetos", word: "Work", tone: "#ffc090" },
  { id: "depoimentos", label: "Prova", word: "Trust", tone: "#8bb7d6" },
  { id: "processo", label: "Processo", word: "Flow", tone: "#9fcaab" },
  { id: "pacotes", label: "Oferta", word: "Scale", tone: "#ffc090" },
  { id: "contato", label: "Contato", word: "Brief", tone: "#8bb7d6" },
  { id: "site-footer", label: "Final", word: "Top", tone: "#ffc090" },
];

export function ScrollStorySystem() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.set(".story-progress-fill", { scaleY: 0 });

      gsap.to(".story-progress-fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
        },
      });

      chapters.forEach((chapter, index) => {
        const section = document.getElementById(chapter.id);
        if (!section) return;

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: chapter.pinnedDistance ? "top top" : "top center",
            end: chapter.pinnedDistance
              ? () => `+=${chapter.pinnedDistance}`
              : "bottom center",
            invalidateOnRefresh: true,
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index),
          },
        });
      });
    }, root);

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const word = wordRef.current;
    if (!root || !word || isReducedMotion()) return;

    root.style.setProperty("--story-tone", chapters[activeIndex].tone);

    gsap.fromTo(
      word,
      { yPercent: 110, rotate: 4, opacity: 0, filter: "blur(8px)" },
      {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.65,
        ease: "expo.out",
      },
    );

    gsap.fromTo(
      ".story-chapter-dot",
      { scale: 0.88 },
      { scale: 1, duration: 0.5, ease: "elastic.out(1,0.4)" },
    );
  }, [activeIndex]);

  const isLast = activeIndex === chapters.length - 1;
  const nextChapter = chapters[Math.min(activeIndex + 1, chapters.length - 1)];

  const handleJump = () => {
    if (isLast) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", "#hero");
      return;
    }

    const target = document.getElementById(nextChapter.id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div
      ref={rootRef}
      data-active-chapter={chapters[activeIndex].id}
      className="pointer-events-none fixed inset-0 z-[38] [--story-tone:#ffc090]"
      aria-hidden="true"
    >
      <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 items-center gap-3 xl:flex">
        <div className="h-36 w-px overflow-hidden bg-[#f5f0e6]/10">
          <span className="story-progress-fill block h-full origin-top scale-y-0 bg-[var(--story-tone)]" />
        </div>
        <div className="w-24 rounded-full border border-[#f5f0e6]/10 bg-[#0d0d0b]/58 px-4 py-3 backdrop-blur-xl">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#f5f0e6]/44">
            Cena
          </p>
          <div className="mt-2 h-[1.1em] overflow-hidden font-display text-2xl italic leading-none text-[var(--story-tone)]">
            <span ref={wordRef} className="block">
              {chapters[activeIndex].word}
            </span>
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5f0e6]/54">
            {chapters[activeIndex].label}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleJump}
        className="pointer-events-auto fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full border border-[#f5f0e6]/14 bg-[#0d0d0b]/78 px-3 py-3 text-left text-[#f5f0e6] shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-colors hover:border-[var(--story-tone)] hover:text-[var(--story-tone)] sm:px-4"
        aria-label={isLast ? "Voltar ao inicio" : `Ir para ${nextChapter.label}`}
      >
        <span className="story-chapter-dot flex h-9 w-9 items-center justify-center rounded-full bg-[var(--story-tone)] text-[#14110e]">
          {isLast ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </span>
        <span className="hidden sm:block">
          <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[#f5f0e6]/44">
            {isLast ? "Voltar" : "Proximo"}
          </span>
          <span className="mt-0.5 block text-sm font-semibold">
            {isLast ? "Inicio" : nextChapter.label}
          </span>
        </span>
      </button>
    </div>
  );
}
