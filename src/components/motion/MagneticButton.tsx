"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, isReducedMotion } from "@/lib/gsap";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export function MagneticButton({
  children,
  className = "",
  href,
  target,
  rel,
  type = "button",
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => undefined, element);

    const onMove = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      const rect = element.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left - rect.width / 2;
      const y = mouseEvent.clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * 0.22,
        y: y * 0.22,
        duration: 0.45,
        ease: "power3.out",
      });
    };

    const onLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.75,
        ease: "elastic.out(1,0.36)",
      });
    };

    element.addEventListener("mousemove", onMove);
    element.addEventListener("mouseleave", onLeave);

    return () => {
      element.removeEventListener("mousemove", onMove);
      element.removeEventListener("mouseleave", onLeave);
      ctx.revert();
    };
  }, []);

  if (href) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={className}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
