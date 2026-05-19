"use client";

import { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

type LogoMarqueeProps = {
  items: string[];
  className?: string;
};

export function LogoMarquee({ items, className = "" }: LogoMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = ref.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.to(".logo-marquee-track", {
        xPercent: -50,
        duration: 24,
        ease: "none",
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div className="logo-marquee-track flex w-max whitespace-nowrap will-change-transform">
        {Array.from({ length: 2 }).map((_, loopIndex) => (
          <div
            key={loopIndex}
            className="flex items-center gap-7 pr-7 font-mono text-[11px] uppercase tracking-[0.24em]"
          >
            {items.map((item) => (
              <span key={`${loopIndex}-${item}`} className="flex items-center gap-7">
                <span>{item}</span>
                <span className="text-[#ffc090]">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
