"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

type Props = {
  onComplete?: () => void;
};

const DESKTOP_INTRO_SCROLL_DISTANCE = 7600;
const MOBILE_INTRO_SCROLL_DISTANCE = 5600;
const PRELOAD_FRAME_COUNT = 121;

function preloadFrameSrc(index: number) {
  return `/videos/preload-frames/frame_${String(index).padStart(4, "0")}.jpg`;
}

export default function PreloadOnScroll({ onComplete }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const completedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const section = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!section || !canvas || !context) return;

    if (isReducedMotion()) {
      setIsLoaded(true);
      return;
    }

    let resizeObserver: ResizeObserver | undefined;
    let cancelled = false;

    const ctx = gsap.context(() => {
      const playhead = { frame: 0 };
      const frameImages: HTMLImageElement[] = new Array(PRELOAD_FRAME_COUNT);
      let lastFrameIndex = 0;
      let loadedFrames = 0;

      const nearestLoadedFrame = (targetIndex: number) => {
        const fallback = frameImages[lastFrameIndex] ?? frameImages[0];

        for (let offset = 0; offset < PRELOAD_FRAME_COUNT; offset += 1) {
          const back = targetIndex - offset;
          const forward = targetIndex + offset;
          const backImage = frameImages[back];
          const forwardImage = frameImages[forward];

          if (backImage?.complete && backImage.naturalWidth) return backImage;
          if (forwardImage?.complete && forwardImage.naturalWidth) return forwardImage;
        }

        return fallback;
      };

      const sizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.floor(rect.width * dpr));
        const height = Math.max(1, Math.floor(rect.height * dpr));

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        return { width, height };
      };

      const drawFrame = (rawFrameIndex: number) => {
        const frameIndex = Math.max(0, Math.min(PRELOAD_FRAME_COUNT - 1, rawFrameIndex));
        const image = nearestLoadedFrame(frameIndex);
        if (!image?.complete || !image.naturalWidth || !image.naturalHeight) return;

        lastFrameIndex = frameIndex;

        const { width, height } = sizeCanvas();

        const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        const x = (width - drawWidth) / 2;
        const y = (height - drawHeight) / 2;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.clearRect(0, 0, width, height);
        context.drawImage(image, x, y, drawWidth, drawHeight);
      };

      for (let index = 1; index <= PRELOAD_FRAME_COUNT; index += 1) {
        const frameIndex = index - 1;
        const image = new window.Image();
        image.decoding = "async";
        image.onload = () => {
          if (cancelled) return;
          loadedFrames += 1;

          if (frameIndex === 0 || loadedFrames === 1) {
            setIsLoaded(true);
            drawFrame(Math.round(playhead.frame));
          }

          if (loadedFrames === PRELOAD_FRAME_COUNT) {
            ScrollTrigger.refresh();
          }
        };
        image.src = preloadFrameSrc(index);
        frameImages[frameIndex] = image;
      }

      const computeEnd = () => {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const distance = isMobile ? MOBILE_INTRO_SCROLL_DISTANCE : DESKTOP_INTRO_SCROLL_DISTANCE;
        return Math.max(distance, window.innerHeight * (isMobile ? 5.4 : 6.8));
      };

      gsap.to(playhead, {
        frame: PRELOAD_FRAME_COUNT - 1,
        ease: "none",
        onUpdate: () => {
          drawFrame(Math.round(playhead.frame));
        },
        scrollTrigger: {
          id: "intro-video-scrub",
          trigger: section,
          start: "top top",
          end: () => `+=${computeEnd()}`,
          pin: true,
          pinSpacing: true,
          scrub: window.matchMedia("(max-width: 767px)").matches ? 0.55 : 0.95,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 300,
          onRefresh: (self) => {
            playhead.frame = self.progress * (PRELOAD_FRAME_COUNT - 1);
            drawFrame(Math.round(playhead.frame));
            if (progressRef.current) gsap.set(progressRef.current, { scaleX: self.progress });
          },
          onUpdate: (self) => {
            if (progressRef.current) gsap.set(progressRef.current, { scaleX: self.progress });

            if (self.progress > 0.985 && !completedRef.current) {
              completedRef.current = true;
              onComplete?.();
            }

            if (self.progress < 0.985) {
              completedRef.current = false;
            }
          },
          onLeaveBack: () => {
            playhead.frame = 0;
            drawFrame(0);
            if (progressRef.current) gsap.set(progressRef.current, { scaleX: 0 });
          },
        },
      });

      resizeObserver = new ResizeObserver(() => {
        drawFrame(lastFrameIndex);
      });
      resizeObserver.observe(canvas);
    }, section);

    const syncScrollTrigger = () => {
      ScrollTrigger.update();
    };

    window.addEventListener("touchmove", syncScrollTrigger, { passive: true });
    window.addEventListener("keydown", syncScrollTrigger);

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      window.removeEventListener("touchmove", syncScrollTrigger);
      window.removeEventListener("keydown", syncScrollTrigger);
      ctx.revert();
    };
  }, [onComplete]);

  const goToSite = () => {
    const introTrigger = ScrollTrigger.getById("intro-video-scrub");

    if (introTrigger) {
      window.scrollTo({
        top: introTrigger.end + 2,
        behavior: "smooth",
      });
      return;
    }

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
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-label="Logo EB controlada pelo scroll"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(0,0,0,0.04),rgba(0,0,0,0.72)_78%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/72 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8">
        <div className="grid w-full max-w-[980px] gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ffc090]">
              Role para controlar
            </p>
            <h3 className="mt-2 font-display text-[clamp(2rem,4vw,3.25rem)] leading-none">
              Bem-vindo - role para comecar
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
