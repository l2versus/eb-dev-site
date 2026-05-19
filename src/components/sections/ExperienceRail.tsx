"use client";

import { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

const sections = [
  { id: "hero", label: "Inicio" },
  { id: "sobre", label: "Sobre" },
  { id: "projetos", label: "Projetos" },
  { id: "processo", label: "Processo" },
  { id: "pacotes", label: "Oferta" },
  { id: "contato", label: "Contato" },
];

export function ExperienceRail() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      gsap.set(".experience-progress", { scaleY: 0 });
      gsap.to(".experience-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
        },
      });

      sections.forEach((section) => {
        const target = document.getElementById(section.id);
        if (!target) return;

        gsap.timeline({
          scrollTrigger: {
            trigger: target,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActive(section.id),
            onEnterBack: () => setActive(section.id),
          },
        });
      });

      const magneticItems = gsap.utils.toArray<HTMLElement>("[data-magnetic]");
      magneticItems.forEach((item) => {
        const move = (event: MouseEvent) => {
          const rect = item.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          gsap.to(item, {
            x: x * 0.22,
            y: y * 0.22,
            duration: 0.5,
            ease: "power3.out",
          });
        };

        const leave = () => {
          gsap.to(item, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.35)" });
        };

        item.addEventListener("mousemove", move);
        item.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          item.removeEventListener("mousemove", move);
          item.removeEventListener("mouseleave", leave);
        });
      });

    }, root);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  const setActive = (id: string) => {
    const root = rootRef.current;
    if (!root) return;

    root.querySelectorAll("[data-rail-link]").forEach((item) => {
      item.setAttribute("data-active", item.getAttribute("href") === `#${id}` ? "true" : "false");
    });
  };

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 items-end gap-4 2xl:flex"
    >
      <div className="relative h-44 w-px overflow-hidden bg-[#f5f0e6]/16">
        <span className="experience-progress absolute inset-x-0 top-0 block h-full origin-top scale-y-0 bg-[#ffc090]" />
      </div>
      <nav className="pointer-events-auto flex flex-col gap-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            data-rail-link
            data-active={section.id === "hero" ? "true" : "false"}
            className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5f0e6]/42 transition-colors data-[active=true]:text-[#ffc090]"
          >
            <span className="h-px w-4 bg-current transition-all group-data-[active=true]:w-8" />
            {section.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
