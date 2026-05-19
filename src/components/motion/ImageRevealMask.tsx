"use client";

import { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

type ImageRevealMaskProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  start?: string;
};

export function ImageRevealMask({
  children,
  className = "",
  innerClassName = "",
  start = "top 82%",
}: ImageRevealMaskProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = ref.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { clipPath: "inset(18% 18% 18% 18% round 14px)", opacity: 0.72 },
        {
          clipPath: "inset(0% 0% 0% 0% round 14px)",
          opacity: 1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: root,
            start,
            toggleActions: "play reverse play reverse",
          },
        },
      );

      gsap.fromTo(
        ".image-reveal-mask-inner",
        { scale: 1.16 },
        {
          scale: 1,
          duration: 1.25,
          ease: "expo.out",
          scrollTrigger: {
            trigger: root,
            start,
            toggleActions: "play reverse play reverse",
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [start]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div className={`image-reveal-mask-inner relative h-full w-full ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}

