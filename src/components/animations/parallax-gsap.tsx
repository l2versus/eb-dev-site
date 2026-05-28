// ParallaxGSAP - GSAP ScrollTrigger parallax helpers
// Timeline based effects
// Alta performance, timeline-based, suporta morphing e efeitos avançados

"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ParallaxGSAPProps {
  children: React.ReactNode;
  speed?: number; // -2 a 2 (mais agressivo que Framer)
  direction?: "vertical" | "horizontal";
  triggerElement?: string;
  scrub?: number | boolean; // 0-1 ou true para smooth scroll-linked
  markers?: boolean; // debug
  className?: string;
}

export function ParallaxGSAP({
  children,
  speed = 0.5,
  direction = "vertical",
  triggerElement,
  scrub = 0.6,
  markers = false,
  className,
}: ParallaxGSAPProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = triggerElement
      ? document.querySelector(triggerElement)
      : container;

    if (!trigger) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "top center",
        end: "bottom center",
        scrub,
        markers,
      },
    });

    const moveValue = direction === "vertical" ? speed * 100 : 0;
    const moveX = direction === "horizontal" ? speed * 100 : 0;

    tl.to(container, {
      y: moveValue,
      x: moveX,
      ease: "none",
    });

    return () => {
      tl.kill();
      // @ts-ignore
      tl.scrollTrigger?.kill?.();
    };
  }, [speed, direction, triggerElement, scrub, markers]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// Parallax with opacity and Y movement

interface ParallaxFadeGSAPProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
  markers?: boolean;
}

export function ParallaxFadeGSAP({
  children,
  intensity = 0.3,
  className,
  markers = false,
}: ParallaxFadeGSAPProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 0.6,
        markers,
      },
    });

    tl.to(container, {
      opacity: 1,
      y: -50 * intensity,
      ease: "power1.out",
    });

    return () => {
      tl.kill();
      // @ts-ignore
      tl.scrollTrigger?.kill?.();
    };
  }, [intensity, markers]);

  return (
    <div ref={containerRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

// 3D rotation parallax

interface ParallaxRotateGSAPProps {
  children: React.ReactNode;
  rotationIntensity?: number;
  className?: string;
  markers?: boolean;
}

export function ParallaxRotateGSAP({
  children,
  rotationIntensity = 15,
  className,
  markers = false,
}: ParallaxRotateGSAPProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "bottom center",
        scrub: 0.8,
        markers,
      },
    });

    tl.to(container, {
      rotationX: rotationIntensity,
      rotationY: rotationIntensity * 0.5,
      transformOrigin: "center center",
      ease: "power1.inOut",
    });

    return () => {
      tl.kill();
      // @ts-ignore
      tl.scrollTrigger?.kill?.();
    };
  }, [rotationIntensity, markers]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// Multi-layer parallax

interface MultiLayerParallaxProps {
  layers: {
    id: string;
    speed: number;
    element: React.ReactNode;
  }[];
  className?: string;
  markers?: boolean;
}

export function MultiLayerParallax({
  layers,
  className,
  markers = false,
}: MultiLayerParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const tls: gsap.core.Timeline[] = [];

      layers.forEach((layer) => {
        const element = container.querySelector(`[data-layer="${layer.id}"]`);
        if (!element) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top center",
            end: "bottom center",
            scrub: 0.6,
            markers,
          },
        });

        tl.to(element, {
          y: layer.speed * 100,
          ease: "none",
        });

        tls.push(tl);
      });

      return () => {
        tls.forEach((t) => {
          t.kill();
          // @ts-ignore
          t.scrollTrigger?.kill?.();
        });
      };
    }, [layers, markers]);

  return (
    <div ref={containerRef} className={className}>
      {layers.map((layer) => (
        <div key={layer.id} data-layer={layer.id}>
          {layer.element}
        </div>
      ))}
    </div>
  );
}
