// ══════════════════════════════════════════════════════════════════════════════
// 🎨 Componente: ParallaxTextContrast — Texto com Parallax + Blur/Contrast
// Efeito premium onde texto se move e muda de contraste/blur conforme scroll
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxTextContrastProps {
  text: string;
  className?: string;
  textClassName?: string;
  containerClassName?: string;
  blurStart?: number; // blur inicial (px)
  blurEnd?: number; // blur final (px)
  scale?: number; // escala do parallax
  markers?: boolean;
}

/**
 * Efeito: Texto com parallax que fica nítido conforme scroll
 * Cria sensação de "ir e vir" com mudança de contraste
 */
export function ParallaxTextContrast({
  text,
  className = "text-7xl md:text-8xl font-bold",
  textClassName = "text-orange-400",
  containerClassName = "relative py-32 overflow-hidden",
  blurStart = 15,
  blurEnd = 0,
  scale = 1,
  markers = false,
}: ParallaxTextContrastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;

    if (!container || !textEl) return;

    // Timeline principal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 60%",
        end: "bottom 20%",
        scrub: 0.8, // suave
        markers,
        onUpdate: (self) => {
          // Progress 0-1
          const progress = self.progress;

          // Parallax movement (vai e volta)
          const parallaxAmount = Math.sin(progress * Math.PI) * 100 * scale;

          gsap.set(textEl, {
            x: parallaxAmount,
            filter: `blur(${blurStart - (blurStart - blurEnd) * progress}px) contrast(${
              0.8 + progress * 0.4
            })`,
          });
        },
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [blurStart, blurEnd, scale, markers]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <h1
        ref={textRef}
        className={`${className} ${textClassName} will-change-transform transition-all duration-300`}
      >
        {text}
      </h1>
    </div>
  );
}

// ─── Versão com Múltiplas Linhas ───────────────────────────────────────────

interface ParallaxTextMultilineProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  containerClassName?: string;
  staggerDelay?: number;
  markers?: boolean;
}

/**
 * Múltiplas linhas de texto com parallax em cascata
 */
export function ParallaxTextMultiline({
  lines,
  className = "text-6xl md:text-7xl font-bold",
  lineClassName = "text-white",
  containerClassName = "relative py-40 overflow-hidden",
  staggerDelay = 0.2,
  markers = false,
}: ParallaxTextMultilineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    lineRefs.current.forEach((lineEl, index) => {
      if (!lineEl) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 70%",
          end: "bottom 10%",
          scrub: 0.6,
          markers,
        },
      });

      // Cada linha se move em direção diferente
      const direction = index % 2 === 0 ? 1 : -1;

      tl.to(lineEl, {
        x: direction * 150,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.inOut",
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [lines, markers]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <div className="space-y-6">
        {lines.map((line, index) => (
          <p
            key={index}
            ref={(el) => {
              if (el) lineRefs.current[index] = el;
            }}
            className={`${className} ${lineClassName} filter blur-xl opacity-0`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Contrast Shift Effect ────────────────────────────────────────────────────

interface ContrastShiftProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  contrastStart?: number;
  contrastEnd?: number;
  brightnessStart?: number;
  brightnessEnd?: number;
  markers?: boolean;
}

/**
 * Efeito de mudança de contraste puro (sem blur)
 * Cria sensação visual de "pintar" conforme scroll
 */
export function ContrastShift({
  children,
  className = "",
  containerClassName = "relative py-32",
  contrastStart = 0.5,
  contrastEnd = 1.2,
  brightnessStart = 0.8,
  brightnessEnd = 1.1,
  markers = false,
}: ContrastShiftProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 60%",
        end: "bottom 20%",
        scrub: 0.8,
        markers,
        onUpdate: (self) => {
          const progress = self.progress;
          const contrast = contrastStart + (contrastEnd - contrastStart) * progress;
          const brightness =
            brightnessStart + (brightnessEnd - brightnessStart) * progress;

          gsap.set(content, {
            filter: `contrast(${contrast}) brightness(${brightness})`,
          });
        },
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [contrastStart, contrastEnd, brightnessStart, brightnessEnd, markers]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <div ref={contentRef} className={className}>
        {children}
      </div>
    </div>
  );
}

// ─── Blurred Reveal Effect ────────────────────────────────────────────────────

interface BlurredRevealProps {
  text: string;
  className?: string;
  textClassName?: string;
  containerClassName?: string;
  blurAmount?: number;
  markers?: boolean;
}

/**
 * Texto que começa desfocado e fica nítido conforme entrada na viewport
 */
export function BlurredReveal({
  text,
  className = "text-6xl md:text-7xl font-bold leading-tight",
  textClassName = "text-white",
  containerClassName = "relative py-32 px-6",
  blurAmount = 12,
  markers = false,
}: BlurredRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;

    if (!container || !textEl) return;

    gsap.set(textEl, {
      filter: `blur(${blurAmount}px)`,
      opacity: 0.3,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "center 40%",
        scrub: 0.6,
        markers,
      },
    });

    tl.to(textEl, {
      filter: `blur(0px)`,
      opacity: 1,
      duration: 1,
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [blurAmount, markers]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <h2 ref={textRef} className={`${className} ${textClassName}`}>
        {text}
      </h2>
    </div>
  );
}

// ─── Advanced: Morphing Colors + Parallax ─────────────────────────────────────

interface MorphingColorParallaxProps {
  text: string;
  colors: string[]; // Array de cores hex
  className?: string;
  containerClassName?: string;
  markers?: boolean;
}

/**
 * Texto que muda de cor e se move conforme scroll
 * Efeito de "pintura" com movimento
 */
export function MorphingColorParallax({
  text,
  colors = ["#FFB84D", "#FF7A5C", "#FF3D5A", "#C13A7D"],
  className = "text-7xl md:text-8xl font-bold",
  containerClassName = "relative py-32 overflow-hidden",
  markers = false,
}: MorphingColorParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;

    if (!container || !textEl) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 60%",
        end: "bottom 20%",
        scrub: 1,
        markers,
      },
    });

    // Animar cores em sequência
    colors.forEach((color, index) => {
      const nextColor = colors[(index + 1) % colors.length];
      tl.to(textEl, { color: nextColor, duration: 0.8 }, index * 0.2);
    });

    // Parallax simultâneo
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 60%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    parallaxTl.to(textEl, { x: 200, duration: 1, ease: "sine.inOut" }, 0);

    return () => {
      tl.kill();
      parallaxTl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [colors, markers]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <h1 ref={textRef} className={className}>
        {text}
      </h1>
    </div>
  );
}
