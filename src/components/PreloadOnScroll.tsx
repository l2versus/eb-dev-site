"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

type Props = {
  src?: string;
  poster?: string;
  onComplete?: () => void;
};

const INTRO_SCROLL_DISTANCE = 6400;
const SEEK_EPSILON = 0.015;

export default function PreloadOnScroll({
  src = "/videos/preload-scroll.mp4",
  poster = "/images/gsap-profile-code.png",
  onComplete,
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const completedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showMobileSplash, setShowMobileSplash] = useState(false);

  useEffect(() => {
    const section = rootRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));

    setIsMobileDevice(isMobile);

    // Show a simple splash on mobile (short timeout) while keeping the heavy scrub disabled
    if (isMobile) {
      setShowMobileSplash(true);
      const t = setTimeout(() => setShowMobileSplash(false), 900);
      setIsLoaded(true);
      return () => clearTimeout(t);
    }

    // Fallback: disable scrub/pin when user prefers reduced motion.
    if (isReducedMotion()) {
      setIsLoaded(true);
      return;
    }

    let removeMetadataListener: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const setupScrub = () => {
        if (!video.duration || !Number.isFinite(video.duration)) return;

        const maxTime = Math.max(video.duration - 0.04, 0);
        const playhead = { time: 0 };
        try {
          video.pause();
          video.currentTime = 0;
        } catch (e) {
          // ignore errors when setting currentTime on restrictive browsers
        }
        setIsLoaded(true);

        gsap.to(playhead, {
          time: maxTime,
          ease: "none",
          onUpdate: () => {
            try {
              if (Math.abs(video.currentTime - playhead.time) > SEEK_EPSILON) {
                video.currentTime = playhead.time;
              }
            } catch (e) {
              // ignore seek exceptions on some mobile browsers
            }
          },
          scrollTrigger: {
            id: "intro-video-scrub",
            trigger: section,
            start: "top top",
            end: () => `+=${INTRO_SCROLL_DISTANCE}`,
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: false,
            onUpdate: (self) => {
              if (progressRef.current) {
                gsap.set(progressRef.current, { scaleX: self.progress });
              }

              if (self.progress > 0.985 && !completedRef.current) {
                completedRef.current = true;
                onComplete?.();
              }
            },
            onLeaveBack: () => {
              playhead.time = 0;
              try {
                video.currentTime = 0;
              } catch (e) {
                // ignore
              }
              if (progressRef.current) {
                gsap.set(progressRef.current, { scaleX: 0 });
              }
            },
          },
        });

        ScrollTrigger.refresh();
      };

      if (video.readyState >= 1) {
        setupScrub();
      } else {
        video.addEventListener("loadedmetadata", setupScrub, { once: true });
        removeMetadataListener = () => video.removeEventListener("loadedmetadata", setupScrub);
      }
    }, section);

    // Ensure ScrollTrigger responds to touch/trackpad/keyboard input too
    const touchUpdate = () => {
      try {
        ScrollTrigger.update();
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener("touchmove", touchUpdate, { passive: true });
    window.addEventListener("pointermove", touchUpdate);
    window.addEventListener("keydown", touchUpdate);

    return () => {
      removeMetadataListener?.();
      window.removeEventListener("touchmove", touchUpdate);
      window.removeEventListener("pointermove", touchUpdate);
      window.removeEventListener("keydown", touchUpdate);
      ctx.revert();
    };
  }, [onComplete]);

  const goToSite = () => {
    document.getElementById("hero")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={rootRef}
      id="intro"
      className="relative min-h-[100svh] overflow-hidden bg-black text-white"
    >
      {showMobileSplash && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black md:hidden">
          <div className="mx-auto w-48">
            <Image src="/images/logo-banner.png" alt="logo" width={340} height={98} className="w-full h-auto object-contain" />
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={poster}
        className="absolute inset-0 h-full w-full object-contain"
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(0,0,0,0.04),rgba(0,0,0,0.72)_78%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/72 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center p-5 sm:p-8">
        <div className="grid w-full max-w-[980px] gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ffc090]">
              Role para controlar
            </p>
            <h3 className="mt-2 font-display text-[clamp(2rem,4vw,3.25rem)] leading-none">
              Bem-vindo — role para começar
            </h3>
            <div className="mt-5 h-px w-full max-w-xs overflow-hidden bg-white/18">
              <span
                ref={progressRef}
                className="block h-full origin-left bg-[#ffc090]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goToSite}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/16"
            >
              Pular
            </button>
            <button
              type="button"
              onClick={goToSite}
              className="inline-flex items-center gap-2 rounded-full bg-[#ffc090] px-5 py-2.5 text-sm font-semibold text-[#14110e] transition hover:bg-[#f5f0e6]"
            >
              Entrar
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-6 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/44 md:flex">
        <ArrowDown className="h-4 w-4 text-[#ffc090]" />
        <span>Sobe e desce volta o video</span>
      </div>

      {!isLoaded && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ffc090] border-t-transparent" />
            <div className="text-sm text-white/80">Carregando...</div>
          </div>
        </div>
      )}
    </section>
  );
}
