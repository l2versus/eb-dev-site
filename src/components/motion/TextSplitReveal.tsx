"use client";

import { useEffect, useRef } from "react";
import { FractureText } from "@/components/FractureText";
import { gsap, isReducedMotion } from "@/lib/gsap";

type TextSplitRevealProps = {
  text: string;
  className?: string;
  triggerStart?: string;
  immediate?: boolean;
};

export function TextSplitReveal({
  text,
  className = "",
  triggerStart = "top 84%",
  immediate = false,
}: TextSplitRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = ref.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const chars = root.querySelectorAll(".fracture-char");

      gsap.from(chars, {
        x: (index) => ((index % 5) - 2) * 16,
        y: (index) => (index % 2 === 0 ? 34 : -26),
        rotate: (index) => ((index % 7) - 3) * 5,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.82,
        ease: "expo.out",
        stagger: { each: 0.012, from: "random" },
        scrollTrigger: immediate
          ? undefined
          : {
              trigger: root,
              start: triggerStart,
              toggleActions: "play reverse play reverse",
            },
      });
    }, root);

    return () => ctx.revert();
  }, [immediate, triggerStart]);

  return (
    <span ref={ref} className={className}>
      <FractureText text={text} />
    </span>
  );
}

