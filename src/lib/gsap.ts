// ══════════════════════════════════════════════════════════════════════════════
// GSAP — Setup centralizado (registra plugins uma única vez)
// ══════════════════════════════════════════════════════════════════════════════

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export function splitChars(text: string): string[] {
  return Array.from(text);
}

export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
