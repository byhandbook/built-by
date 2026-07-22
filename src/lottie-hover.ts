import type { AnimationItem } from "lottie-web";
import lottie from "lottie-web/build/player/lottie_light";

export function wireLottieHover(anim: AnimationItem, trigger: HTMLElement): void {
  let hovering = false;
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
): AnimationItem | null {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  const anim = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: animationUrl,
  });

  const finish = () => {
    anim.goToAndStop(0, true);
    wireLottieHover(anim, trigger);
  };

  if (anim.isLoaded) finish();
  else anim.addEventListener("DOMLoaded", finish);

  return anim;
}
