"use client";

import { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

type CountUpStatProps = {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
};

export function CountUpStat({ value, suffix = "", label, className = "" }: CountUpStatProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const root = rootRef.current;
    const number = numberRef.current;
    if (!root || !number) return;

    const ctx = gsap.context(() => {
      const state = { value: 0 };

      gsap.to(state, {
        value,
        duration: 1.35,
        ease: "expo.out",
        onUpdate: () => {
          number.textContent = `${Math.round(state.value)}${suffix}`;
        },
        scrollTrigger: {
          trigger: root,
          start: "top 86%",
        },
      });
    }, root);

    return () => ctx.revert();
  }, [suffix, value]);

  return (
    <div ref={rootRef} className={className}>
      <span ref={numberRef} className="block font-display text-6xl leading-none text-[#ffc090]">
        0{suffix}
      </span>
      <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#f5f0e6]/56">
        {label}
      </span>
    </div>
  );
}
