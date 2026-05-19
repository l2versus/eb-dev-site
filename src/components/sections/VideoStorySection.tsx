"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

const FRAME_COUNT = 121;
const SCROLL_DISTANCE = 10800;

const STORY_BEATS = [
  {
    eyebrow: "01 / Diagnostico",
    title: "A primeira dobra precisa vender antes do clique.",
    text: "Imagem, ritmo e contraste criam valor em segundos.",
    start: 0.05,
    end: 0.2,
  },
  {
    eyebrow: "02 / Direcao",
    title: "O scroll guia a leitura sem atropelar a mensagem.",
    text: "Cada pausa existe para o visitante entender o que esta vendo.",
    start: 0.22,
    end: 0.38,
  },
  {
    eyebrow: "03 / Prova",
    title: "Motion bom nao distrai. Ele aumenta confianca.",
    text: "A cena mostra qualidade, processo e cuidado visual ao mesmo tempo.",
    start: 0.4,
    end: 0.56,
  },
  {
    eyebrow: "04 / Codigo",
    title: "Por baixo, performance. Por cima, experiencia premium.",
    text: "O site fica bonito, rapido e claro para converter melhor.",
    start: 0.58,
    end: 0.74,
  },
  {
    eyebrow: "05 / Convite",
    title: "Seu projeto pode ter esse nivel de narrativa.",
    text: "Um site com presenca, leitura facil e movimento com funcao.",
    start: 0.76,
    end: 0.93,
  },
];

function frameSrc(index: number) {
  return `/videos/cinematic-push-frames/frame_${String(index).padStart(4, "0")}.jpg`;
}

function splitWords(text: string) {
  return text.split(" ").map((word, index) => (
    <span className="story-word inline-block" key={`${word}-${index}`}>
      {word}
      {index < text.split(" ").length - 1 ? "\u00a0" : ""}
    </span>
  ));
}

export function VideoStorySection() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!section || !canvas || !context) return;

    const images: HTMLImageElement[] = [];
    imagesRef.current = images;
    let loadedFrames = 0;
    let resizeObserver: ResizeObserver | undefined;

    const drawFrame = (frameIndex: number) => {
      const image = images[frameIndex] ?? images[lastFrameRef.current] ?? images[0];
      if (!image?.complete || !image.naturalWidth || !image.naturalHeight) return;

      lastFrameRef.current = frameIndex;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      context.clearRect(0, 0, width, height);
      context.drawImage(image, x, y, drawWidth, drawHeight);
    };

    for (let index = 1; index <= FRAME_COUNT; index += 1) {
      const image = new Image();
      image.decoding = "async";
      image.src = frameSrc(index);
      image.onload = () => {
        loadedFrames += 1;
        if (loadedFrames === 1) {
          setReady(true);
          drawFrame(0);
        }
        if (loadedFrames === FRAME_COUNT) {
          ScrollTrigger.refresh();
        }
      };
      images.push(image);
    }

    const ctx = gsap.context(() => {
      if (isReducedMotion()) {
        gsap.set(".video-story-beat-0", { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(".video-story-beat", { autoAlpha: 0, y: 40, filter: "blur(12px)" });
      gsap.set(".story-word", { yPercent: 90, autoAlpha: 0, filter: "blur(10px)" });

      const playhead = { frame: 0 };
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "video-story-frame-sequence",
          trigger: section,
          start: "top top",
          end: () => `+=${SCROLL_DISTANCE}`,
          pin: true,
          scrub: 1.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        playhead,
        {
          frame: FRAME_COUNT - 1,
          duration: 1,
          ease: "none",
          onUpdate: () => drawFrame(Math.round(playhead.frame)),
        },
        0,
      );

      STORY_BEATS.forEach((beat, index) => {
        const beatEl = section.querySelector(`.video-story-beat-${index}`);
        if (!beatEl) return;

        const words = beatEl.querySelectorAll(".story-word");
        const inDuration = 0.035;
        const outDuration = 0.045;

        timeline
          .fromTo(
            beatEl,
            { autoAlpha: 0, y: 44, filter: "blur(12px)" },
            { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: inDuration, ease: "power2.out" },
            beat.start,
          )
          .fromTo(
            words,
            { yPercent: 90, autoAlpha: 0, filter: "blur(10px)" },
            {
              yPercent: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: inDuration,
              stagger: 0.004,
              ease: "power2.out",
            },
            beat.start + 0.006,
          )
          .to(
            beatEl,
            {
              autoAlpha: 0,
              y: -26,
              filter: "blur(8px)",
              duration: outDuration,
              ease: "power2.in",
            },
            beat.end,
          );
      });
    }, section);

    resizeObserver = new ResizeObserver(() => drawFrame(lastFrameRef.current));
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="videos" className="relative w-full overflow-hidden bg-black">
      <div className="relative h-screen w-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-label="Cena cinematografica controlada pelo scroll"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.35)_42%,rgba(0,0,0,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.1)_42%,rgba(0,0,0,0.72)_100%)]" />
        <div className="absolute inset-0 grain" />

        <div className="absolute inset-0 z-10 flex items-center px-5 sm:px-8 lg:px-12">
          <div className="relative mx-auto w-full max-w-[1500px]">
            <div className="relative min-h-[20rem] w-full max-w-[720px]">
              {STORY_BEATS.map((beat, index) => (
                <div
                  key={beat.eyebrow}
                  className={`video-story-beat video-story-beat-${index} absolute left-0 top-0 w-full`}
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#ffc090]">
                    {beat.eyebrow}
                  </p>
                  <h2 className="mt-5 max-w-4xl font-display text-[clamp(3.2rem,7vw,7rem)] leading-[0.86] text-white">
                    {splitWords(beat.title)}
                  </h2>
                  <p className="mt-7 max-w-xl text-lg leading-8 text-[#f3ded0] sm:text-xl sm:leading-9">
                    {splitWords(beat.text)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#d6d1d0]/70">
            Story
          </span>
          <div className="h-px w-24 bg-[#d6d1d0]/20" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#d6d1d0]/70">
            Scroll
          </span>
        </div>

        {!ready && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ffc090] border-t-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
