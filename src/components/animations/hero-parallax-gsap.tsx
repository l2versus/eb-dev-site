// ══════════════════════════════════════════════════════════════════════════════
// 🎬 Componente: HeroParallaxGSAP — Hero com parallax, text reveal, effects
// Premium version com ScrollTrigger, timelines, e efeitos avançados
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface HeroParallaxGSAPProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  height?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
  parallaxIntensity?: number;
  titleAnimation?: "slide" | "scale" | "fade-blur" | "rotate";
}

export function HeroParallaxGSAP({
  title,
  subtitle,
  backgroundImage,
  height = "100vh",
  overlayOpacity = 0.6,
  children,
  className,
  parallaxIntensity = 0.5,
  titleAnimation = "slide",
}: HeroParallaxGSAPProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const content = contentRef.current;
    const titleEl = titleRef.current;
    const subtitleEl = subtitleRef.current;

    if (!hero || !titleEl) return;

    // Master timeline
    const masterTl = gsap.timeline();

    // Background parallax
    if (backgroundImage) {
      const bgLayer = hero.querySelector("[data-bg-layer]") as HTMLElement;
      if (bgLayer) {
        ScrollTrigger.create({
          trigger: hero,
          onUpdate: (self) => {
            gsap.to(bgLayer, {
              y: self.getVelocity() * parallaxIntensity,
              overwrite: "auto",
            });
          },
        });
      }
    }

    // Title animation
    const titleInitial: Record<NonNullable<HeroParallaxGSAPProps["titleAnimation"]>, gsap.TweenVars> = {
      slide: { opacity: 0, x: -100 },
      scale: { opacity: 0, scale: 0.8 },
      "fade-blur": { opacity: 0, filter: "blur(20px)" },
      rotate: { opacity: 0, rotation: -10, y: 50 },
    };

    gsap.set(titleEl, titleInitial[titleAnimation]);

    masterTl.to(
      titleEl,
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
      },
      0.3
    );

    // Subtitle animation
    if (subtitleEl) {
      gsap.set(subtitleEl, { opacity: 0, y: 30 });
      masterTl.to(
        subtitleEl,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        },
        0.5
      );
    }

    // Content reveal
    if (children && content) {
      const childElements = content.querySelectorAll("[data-hero-child]");
      if (childElements.length > 0) {
        gsap.set(childElements, { opacity: 0, y: 40 });
        masterTl.to(
          childElements,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          },
          0.7
        );
      }
    }

    // Scroll animation (parallax on scroll out)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        markers: false,
      },
    });

    scrollTl
      .to(titleEl, { y: -100, opacity: 0.5 }, 0)
      .to(subtitleEl, { y: -50, opacity: 0 }, 0)
      .to(content, { y: -80 }, 0);

    return () => {
      masterTl.kill();
      scrollTl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [title, subtitle, children, titleAnimation, parallaxIntensity]);

  return (
    <div
      ref={heroRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Background Layer */}
      {backgroundImage && (
        <>
          <div data-bg-layer className="absolute inset-0 will-change-transform">
            <Image
              src={backgroundImage}
              alt="Hero background"
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </div>

          {/* Overlay gradient */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `linear-gradient(to bottom, rgba(13,13,15,${overlayOpacity}) 0%, rgba(13,13,15,0.4) 50%, rgba(13,13,15,${overlayOpacity + 0.2}) 100%)`,
            }}
          />
        </>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-20 h-full flex flex-col items-center justify-center"
      >
        <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold text-white mb-6">
          {title}
        </h1>
        {subtitle && (
          <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-200 max-w-2xl">
            {subtitle}
          </p>
        )}

        {children && (
          <div className="mt-12 flex gap-4">
            {Array.isArray(children)
              ? children.map((child, i) => (
                  <div key={i} data-hero-child>
                    {child}
                  </div>
                ))
              : children}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white opacity-70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Minimal Hero Parallax ─────────────────────────────────────────────────

interface MinimalHeroParallaxProps {
  title: string;
  description?: string;
  cta?: {
    text: string;
    href: string;
  };
  className?: string;
}

export function MinimalHeroParallax({
  title,
  description,
  cta,
  className,
}: MinimalHeroParallaxProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const titleEl = titleRef.current;
    const descEl = descRef.current;

    if (!titleEl) return;

    // Entrance animation
    gsap.fromTo(
      titleEl,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" }
    );

    if (descEl) {
      gsap.fromTo(
        descEl,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power2.out" }
      );
    }

    // Scroll parallax
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: titleEl,
        start: "top 80%",
        end: "center 50%",
        scrub: 1,
      },
    });

    scrollTl.to(titleEl, { y: -100, opacity: 0.3 });
  }, []);

  return (
    <div className={`relative py-32 ${className}`}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1
          ref={titleRef}
          className="text-6xl md:text-7xl font-bold text-white mb-8"
        >
          {title}
        </h1>
        {description && (
          <p ref={descRef} className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {cta && (
          <a
            href={cta.href}
            className="inline-block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
          >
            {cta.text}
          </a>
        )}
      </div>
    </div>
  );
}
