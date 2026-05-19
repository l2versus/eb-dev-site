import { useEffect } from "react";

type Options = {
  onPlay?: () => void;
  onBlocked?: () => void;
  once?: boolean;
};

export function usePlayOnScroll(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: Options = {},
) {
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    let attempted = false;

    const tryPlay = async () => {
      if (options.once && attempted) return;

      // ensure muted/playsInline to maximize autoplay chances
      vid.muted = true;
      vid.playsInline = true;

      try {
        await vid.play();
        options.onPlay?.();
        attempted = true;
      } catch (err) {
        // autoplay may be blocked; notify caller so UI can present a play button
        options.onBlocked?.();
        // do not mark attempted=true so later user gestures can retry
      }
    };

    const handler = () => tryPlay();

    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("touchstart", handler, { passive: true });
    window.addEventListener("wheel", handler, { passive: true });
    window.addEventListener("pointerdown", handler, { passive: true });

    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("touchstart", handler);
      window.removeEventListener("wheel", handler);
      window.removeEventListener("pointerdown", handler);
    };
  }, [videoRef, options]);
}

export default usePlayOnScroll;
