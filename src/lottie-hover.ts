import type { AnimationItem } from "lottie-web";
import lottie from "lottie-web";

export function wireLottieHover(
  anim: AnimationItem,
  trigger: HTMLElement,
  startHovered = false,
): void {
  let hovering = startHovered;
  let raf: number | null = null;

  const cancelRaf = () => {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
  };

  anim.addEventListener("enterFrame", () => {
    if (hovering && anim.currentFrame >= anim.totalFrames * 0.35) anim.pause();
  });

  trigger.addEventListener("mouseenter", () => {
    cancelRaf();
    hovering = true;
    if (anim.currentFrame >= anim.totalFrames * 0.35) anim.goToAndStop(0, true);
    anim.setDirection(1);
    anim.play();
  });

  if (startHovered) {
    anim.setDirection(1);
    anim.play();
  }

  trigger.addEventListener("mouseleave", () => {
    hovering = false;
    cancelRaf();
    anim.pause();
    const start = anim.currentFrame;
    const end = anim.totalFrames - 1;
    if (start >= end) return;

    const durMs = ((end - start) / 60) * 1000;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / durMs, 1);
      const eased = 1 - (1 - p) * (1 - p);
      anim.goToAndStop(start + (end - start) * eased, true);
      if (p < 1) raf = requestAnimationFrame(step);
      else raf = null;
    };
    raf = requestAnimationFrame(step);
  });
}

export function mountHoverLottie(
  container: HTMLElement,
  trigger: HTMLElement,
  animationUrl: string,
  startHovered = false,
): AnimationItem | null {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  const anim = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: animationUrl,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
      progressiveLoad: false,
    },
  });

  const finish = () => {
    anim.goToAndStop(0, true);
    wireLottieHover(anim, trigger, startHovered);
  };

  if (anim.isLoaded) finish();
  else anim.addEventListener("DOMLoaded", finish);

  return anim;
}

export function destroyLottie(anim: AnimationItem | null): void {
  if (!anim) return;
  try {
    anim.destroy();
  } catch {
    /* already destroyed */
  }
}
