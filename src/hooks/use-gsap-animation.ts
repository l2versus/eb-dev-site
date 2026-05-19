// ══════════════════════════════════════════════════════════════════════════════
// 🎯 Hook: useGSAPAnimation — Hook customizado para GSAP
// Simplifica criação de animações personalizadas
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimationConfig {
  from?: gsap.TweenVars;
  to: gsap.TweenVars;
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number | gsap.StaggerVars;
  repeat?: number;
  yoyo?: boolean;
  scrollTrigger?: ScrollTrigger.Vars;
  onStart?: () => void;
  onComplete?: () => void;
}

/**
 * Hook para criar animações GSAP personalizadas
 * @example
 * const ref = useGSAPAnimation({
 *   to: { opacity: 1, y: 0 },
 *   duration: 0.8,
 *   scrollTrigger: { trigger: ref.current, start: "top 80%" }
 * });
 */
export function useGSAPAnimation(config: AnimationConfig) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const tl = gsap.timeline({
      scrollTrigger: config.scrollTrigger
        ? {
            trigger: config.scrollTrigger.trigger || element,
            start: config.scrollTrigger.start || "top 80%",
            end: config.scrollTrigger.end,
            scrub: config.scrollTrigger.scrub,
            once: config.scrollTrigger.once,
            markers: config.scrollTrigger.markers,
          }
        : undefined,
      onStart: config.onStart,
      onComplete: config.onComplete,
    });

    if (config.from) {
      tl.fromTo(element, config.from, config.to, config.delay ?? 0);
    } else {
      tl.to(element, config.to, config.delay ?? 0);
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [config]);

  return ref;
}

/**
 * Hook para animar múltiplos elementos
 */
export function useGSAPStagger(
  selector: string,
  config: Omit<AnimationConfig, "stagger"> & { stagger?: number }
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (elements.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: config.scrollTrigger
        ? {
            trigger: container,
            start: config.scrollTrigger.start || "top 80%",
            end: config.scrollTrigger.end,
            scrub: config.scrollTrigger.scrub,
            once: config.scrollTrigger.once,
            markers: config.scrollTrigger.markers,
          }
        : undefined,
      onStart: config.onStart,
      onComplete: config.onComplete,
    });

    if (config.from) {
      tl.fromTo(
        elements,
        config.from,
        {
          ...config.to,
          duration: config.duration ?? 0.8,
          ease: config.ease ?? "power2.out",
          stagger: config.stagger ?? 0.1,
        },
        config.delay ?? 0
      );
    } else {
      tl.to(
        elements,
        {
          ...config.to,
          duration: config.duration ?? 0.8,
          ease: config.ease ?? "power2.out",
          stagger: config.stagger ?? 0.1,
        },
        config.delay ?? 0
      );
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [selector, config]);

  return containerRef;
}

/**
 * Hook para ScrollTrigger baseado
 */
export function useScrollTrigger(
  callback: (self: ScrollTrigger) => void,
  dependencies: any[] = []
) {
  useEffect(() => {
    ScrollTrigger.addEventListener("update" as any, callback);

    return () => {
      ScrollTrigger.removeEventListener("update" as any, callback);
    };
  }, dependencies);
}

/**
 * Hook para gerenciar ScrollTrigger com resize listener
 */
export function useScrollTriggerRefresh(dependencies: any[] = []) {
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, dependencies);
}

/**
 * Hook para parallax suave com velocidade
 */
export function useParallaxVelocity(
  speed: number = 0.5,
  dependencies: any[] = []
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    ScrollTrigger.create({
      onUpdate: (self) => {
        gsap.to(element, {
          y: self.getVelocity() * speed,
          overwrite: "auto",
          duration: 0.5,
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [speed, ...dependencies]);

  return ref;
}

/**
 * Hook para mouse tracking parallax
 */
export function useMouseParallax(sensitivity: number = 10) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / sensitivity;
      const y = (e.clientY - window.innerHeight / 2) / sensitivity;

      gsap.to(element, {
        x,
        y,
        duration: 0.5,
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [sensitivity]);

  return ref;
}
