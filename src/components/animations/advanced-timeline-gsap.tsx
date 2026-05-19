// ══════════════════════════════════════════════════════════════════════════════
// 🎨 Componente: MorphSVGGSAP — SVG morphing com GSAP + MorphSVG plugin
// Para transições suaves entre shapes, icons, e logo animations
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/dist/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

interface MorphSVGProps {
  paths: string[]; // SVG path arrays
  duration?: number;
  repeat?: number;
  delay?: number;
  colors?: string[];
  className?: string;
}

export function MorphSVGGSAP({
  paths,
  duration = 1.5,
  repeat = -1,
  delay = 0,
  colors,
  className,
}: MorphSVGProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl || paths.length < 2) return;

    const tl = gsap.timeline({ repeat, delay });

    for (let i = 0; i < paths.length; i++) {
      const nextIndex = (i + 1) % paths.length;

      if (colors) {
        tl.to(
          pathEl,
          {
            attr: { d: paths[nextIndex] },
            fill: colors[nextIndex % colors.length],
            duration,
            ease: "sine.inOut",
          },
          i > 0 ? `<` : 0
        );
      } else {
        tl.to(
          pathEl,
          {
            attr: { d: paths[nextIndex] },
            duration,
            ease: "sine.inOut",
          },
          i > 0 ? `<` : 0
        );
      }
    }

    return () => {
      tl.kill();
    };
  }, [paths, duration, repeat, delay, colors]);

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <path ref={pathRef} d={paths[0]} fill="currentColor" />
    </svg>
  );
}

// ─── Timeline Avançada com GSAP ────────────────────────────────────────────

interface TimelineAnimationProps {
  children: React.ReactNode;
  onComplete?: () => void;
  className?: string;
}

export function AdvancedTimeline({
  children,
  onComplete,
  className,
}: TimelineAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline({ onComplete });

    // Exemplo: animar múltiplos elementos com timing avançado
    const elements = container.querySelectorAll("[data-timeline]");

    tl.set(elements, { autoAlpha: 0 });

    elements.forEach((el, index) => {
      const delay = el.getAttribute("data-timeline-delay")
        ? parseFloat(el.getAttribute("data-timeline-delay")!)
        : index * 0.15;

      const duration = el.getAttribute("data-timeline-duration")
        ? parseFloat(el.getAttribute("data-timeline-duration")!)
        : 0.8;

      const animation = el.getAttribute("data-timeline-animation") || "fade-up";

      const fromVars: gsap.TweenVars = {
        "fade-up": { opacity: 0, y: 40 },
        "fade-down": { opacity: 0, y: -40 },
        "scale-up": { opacity: 0, scale: 0.8 },
        "rotate-in": { opacity: 0, rotation: -15 },
      };

      tl.fromTo(
        el,
        fromVars[animation as keyof typeof fromVars] || fromVars["fade-up"],
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotation: 0,
          duration,
          ease: "power2.out",
        },
        delay
      );
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// ─── FLIP Animation (Layout Shifts) ────────────────────────────────────────

interface FLIPAnimationProps {
  children: React.ReactNode;
  triggerOnClick?: boolean;
  duration?: number;
  className?: string;
}

export function FLIPAnimation({
  children,
  triggerOnClick = true,
  duration = 0.6,
  className,
}: FLIPAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleAnimation = () => {
      const children = container.querySelectorAll("[data-flip]");

      // Store FIRST position
      const bounds = new Map();
      children.forEach((child: Element) => {
        bounds.set(child, (child as HTMLElement).getBoundingClientRect());
      });

      // Allow DOM to update (LAST will happen next frame)
      requestAnimationFrame(() => {
        // INVERT: calculate difference
        const inverts = new Map();
        children.forEach((child: Element) => {
          const first = bounds.get(child);
          const last = (child as HTMLElement).getBoundingClientRect();

          const invertX = first.left - last.left;
          const invertY = first.top - last.top;

          gsap.set(child, {
            x: invertX,
            y: invertY,
          });

          inverts.set(child, { invertX, invertY });
        });

        // PLAY animation
        children.forEach((child: Element) => {
          gsap.to(child, {
            x: 0,
            y: 0,
            duration,
            ease: "power2.inOut",
          });
        });
      });
    };

    if (triggerOnClick) {
      container.addEventListener("click", handleAnimation);
      return () => container.removeEventListener("click", handleAnimation);
    }
  }, [triggerOnClick, duration]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// ─── Sequence Timeline (Múltiplas animações sincronizadas) ────────────────

interface SequenceTimelineProps {
  sequences: Array<{
    id: string;
    from: gsap.TweenVars;
    to: gsap.TweenVars;
    duration?: number;
    delay?: number;
    ease?: string;
  }>;
  className?: string;
  onStart?: () => void;
  onComplete?: () => void;
}

export function SequenceTimeline({
  sequences,
  className,
  onStart,
  onComplete,
}: SequenceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline({ onStart, onComplete });

    sequences.forEach((seq, index) => {
      const element = container.querySelector(`[data-sequence="${seq.id}"]`);
      if (!element) return;

      const delay = seq.delay ?? 0;
      const duration = seq.duration ?? 0.8;
      const ease = seq.ease ?? "power2.out";

      if (index === 0) {
        tl.fromTo(element, seq.from, { ...seq.to, duration, ease }, delay);
      } else {
        tl.fromTo(element, seq.from, { ...seq.to, duration, ease }, `<${delay}`);
      }
    });

    return () => {
      tl.kill();
    };
  }, [sequences, onStart, onComplete]);

  return (
    <div ref={containerRef} className={className}>
      {sequences.map((seq) => (
        <div key={seq.id} data-sequence={seq.id} />
      ))}
    </div>
  );
}

// ─── Stagger Master Timeline ───────────────────────────────────────────────

interface StaggerMasterProps {
  gridItems: React.ReactNode[];
  gridClassName?: string;
  itemClassName?: string;
  staggerAmount?: number;
  animationDuration?: number;
}

export function StaggerMaster({
  gridItems,
  gridClassName = "grid grid-cols-3 gap-4",
  itemClassName = "",
  staggerAmount = 0.1,
  animationDuration = 0.6,
}: StaggerMasterProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll("[data-stagger-item]");

    gsap.set(items, { opacity: 0, y: 30 });

    const tl = gsap.timeline();

    tl.to(items, {
      opacity: 1,
      y: 0,
      duration: animationDuration,
      stagger: staggerAmount,
      ease: "power2.out",
    });

    return () => {
      tl.kill();
    };
  }, [gridItems, staggerAmount, animationDuration]);

  return (
    <div ref={containerRef} className={gridClassName}>
      {gridItems.map((item, index) => (
        <div key={index} data-stagger-item className={itemClassName}>
          {item}
        </div>
      ))}
    </div>
  );
}
