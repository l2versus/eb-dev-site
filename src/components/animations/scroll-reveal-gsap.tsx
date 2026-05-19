// ══════════════════════════════════════════════════════════════════════════════
// ✨ Componente: ScrollRevealGSAP — Reveal animations com GSAP + ScrollTrigger
// Suporta stagger, timelines, e efeitos avançados
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealAnimation =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "blur"
  | "rotate"
  | "flip"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right";

interface ScrollRevealGSAPProps {
  children: React.ReactNode;
  animation?: RevealAnimation;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  once?: boolean;
  triggerStart?: string;
  triggerEnd?: string;
  scrub?: number | boolean;
  markers?: boolean;
}

const getAnimationVariant = (animation: RevealAnimation) => {
  const variants: Record<RevealAnimation, gsap.TweenVars> = {
    "fade-up": { opacity: 0, y: 60 },
    "fade-down": { opacity: 0, y: -60 },
    "fade-left": { opacity: 0, x: -60 },
    "fade-right": { opacity: 0, x: 60 },
    scale: { opacity: 0, scale: 0.8 },
    blur: { opacity: 0, filter: "blur(10px)" },
    rotate: { opacity: 0, rotation: -15, scale: 0.85 },
    flip: { opacity: 0, rotationY: 90 },
    "slide-up": { opacity: 0, y: 100 },
    "slide-down": { opacity: 0, y: -100 },
    "slide-left": { opacity: 0, x: -100 },
    "slide-right": { opacity: 0, x: 100 },
  };
  return variants[animation];
};

export function ScrollRevealGSAP({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.8,
  stagger = 0,
  className,
  once = true,
  triggerStart = "top 80%",
  triggerEnd = "bottom 20%",
  scrub = false,
  markers = false,
}: ScrollRevealGSAPProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animVariant = getAnimationVariant(animation);

    // Set initial state
    gsap.set(element, animVariant);

    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: triggerStart,
        end: triggerEnd,
        scrub,
        once,
        markers,
      },
    });

    tl.to(
      element,
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        rotationY: 0,
        filter: "blur(0px)",
        duration,
        ease: "power2.out",
      },
      delay
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [animation, delay, duration, triggerStart, triggerEnd, once, scrub, markers]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ─── Stagger Reveal (Múltiplos elementos com delay) ──────────────────────

interface StaggerRevealProps {
  children: React.ReactElement<any>[];
  animation?: RevealAnimation;
  staggerDelay?: number; // delay entre cada elemento
  duration?: number;
  className?: string;
  containerClassName?: string;
  markers?: boolean;
}

export function StaggerReveal({
  children,
  animation = "fade-up",
  staggerDelay = 0.15,
  duration = 0.8,
  className,
  containerClassName,
  markers = false,
}: StaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll("[data-reveal]");
    if (elements.length === 0) return;

    const animVariant = getAnimationVariant(animation);

    gsap.set(elements, animVariant);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        once: true,
        markers,
      },
    });

    tl.to(
      elements,
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        rotationY: 0,
        filter: "blur(0px)",
        duration,
        ease: "power2.out",
      },
      0
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [animation, duration, staggerDelay, markers]);

  return (
    <div ref={containerRef} className={containerClassName}>
      {children.map((child, index) => (
        <div
          key={index}
          data-reveal
          className={className}
          style={{
            "--animation-delay": `${index * staggerDelay}s`,
          } as React.CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// ─── Text Reveal Letter by Letter (Premium Effect) ────────────────────────

interface TextRevealProps {
  text: string;
  duration?: number;
  staggerChar?: number;
  className?: string;
  markers?: boolean;
}

export function TextRevealGSAP({
  text,
  duration = 1.2,
  staggerChar = 0.05,
  className,
  markers = false,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Split text into spans
    const chars = text.split("").map((char) => `<span>${char}</span>`);
    container.innerHTML = chars.join("");

    const charElements = container.querySelectorAll("span");

    gsap.set(charElements, { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        once: true,
        markers,
      },
    });

    tl.to(charElements, {
      opacity: 1,
      y: 0,
      duration: duration / charElements.length,
      stagger: staggerChar,
      ease: "back.out",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [text, duration, staggerChar, markers]);

  return <div ref={ref} className={className} />;
}

// ─── Counters com GSAP (KPIs) ────────────────────────────────────────────

interface CounterGSAPProps {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  markers?: boolean;
}

export function CounterGSAP({
  from = 0,
  to,
  duration = 2.5,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  markers = false,
}: CounterGSAPProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const counter = { value: from };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        once: true,
        markers,
      },
    });

    tl.to(counter, {
      value: to,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = `${prefix}${counter.value.toFixed(decimals)}${suffix}`;
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [from, to, duration, prefix, suffix, decimals, markers]);

  return <div ref={ref} className={className} />;
}
