import {
  DEFAULT_MARK_SIZE,
  DEFAULT_TEXT_SIZE,
  isAnimateEnabled,
  normalizeTheme,
  parsePixelSize,
  resolveScriptBase,
  type CreditTheme,
} from "./config";
import { sendRegistryPing } from "./ping";
import type { AnimationItem } from "lottie-web";

const H_PATHS = `
  <path d="M100.209 117.917C101.083 118.504 102.264 118.332 102.931 117.517L138.94 73.8368C139.73 72.8787 138.99 71.4464 137.75 71.5353L123.131 70.7648C122.054 70.7055 121.046 71.2982 120.572 72.2712L99.5474 115.25C99.0485 116.178 99.335 117.334 100.209 117.922V117.917Z" fill="#FFFFFF"/>
  <path d="M109.253 125.238L159.235 98.662C160.331 98.0792 160.193 96.4692 159.017 96.079L146.354 91.876C145.169 91.4809 143.86 91.7229 142.892 92.5131L106.996 121.84C106.181 122.507 106.003 123.683 106.586 124.562C107.169 125.441 108.324 125.732 109.253 125.238Z" fill="#FFFFFF"/>
  <path d="M108.21 131.18C108.408 132.217 109.361 132.928 110.408 132.834L164.064 127.673C165.299 127.559 165.798 126.023 164.864 125.208L154.819 116.432C153.875 115.607 152.576 115.326 151.376 115.681L109.637 128.834C108.625 129.13 108.008 130.147 108.205 131.185L108.21 131.18Z" fill="#FFFFFF"/>
  <path d="M165.396 138.383H102.479C101.091 130.683 97.3819 123.526 91.7762 117.921L117.824 51.4872C118.353 50.5735 117.691 49.4326 116.639 49.4326H62.3797C61.1104 49.4326 59.9399 50.1092 59.3028 51.2057L40.4213 100.294C39.0335 103.953 41.74 107.875 45.6516 107.875H82.0021C85.0247 110.532 83.1825 113.9 80.555 113.9H37.9815C36.5541 113.9 35.3638 114.192 34.6526 115.51C33.9414 116.829 34.0945 118.874 35.4774 120.533C36.0602 121.23 36.6134 121.946 37.1418 122.682C41.8388 129.216 44.4169 137.098 44.4169 145.253V146.779C44.4169 148.157 45.5331 149.273 46.911 149.273H103.071L103.096 149.352V149.273H165.396C166.151 149.273 166.764 148.66 166.764 147.905V139.756C166.764 139 166.151 138.388 165.396 138.388V138.383Z" fill="#FFFFFF"/>
`;

type AnimateModule = typeof import("./lottie-hover");

/* Secondary type (Ftsystem) — system stack only; no font files loaded on client sites. */
const STYLES = `
  :host {
    display: inline-block;
    line-height: 1;
  }

  .credit {
    --hb-mark-size: 24px;
    --hb-text-size: 16px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: inherit;
    font-family: Helvetica, Arial, sans-serif;
    font-size: var(--hb-text-size);
    font-weight: 400;
    letter-spacing: 0.03em;
    line-height: 1.2;
    white-space: nowrap;
    -webkit-font-smoothing: antialiased;
  }

  .credit:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
    border-radius: 2px;
  }

  .mark-wrap {
    position: relative;
    width: var(--hb-mark-size);
    height: var(--hb-mark-size);
    flex-shrink: 0;
  }

  .mark-wrap svg,
  .mark-frame svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .mark-frame {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }

  .mark-lottie {
    position: absolute;
    inset: 5%;
    z-index: 2;
    overflow: visible;
    pointer-events: none;
  }

  .mark-lottie svg {
    overflow: visible !important;
  }

  .credit[data-theme="dark"] {
    color: #ffffff;
  }

  .credit[data-theme="light"] {
    color: #0d0d0d;
  }
`;

function buildUtmUrl(project?: string): string {
  const url = new URL("https://byhandbook.com/");
  url.searchParams.set("utm_source", "builtby");
  url.searchParams.set("utm_medium", "footer");
  if (project) url.searchParams.set("utm_campaign", project);
  return url.toString();
}

function getAnimationUrl(): string {
  if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
    return "/hb-hover-w.json";
  }
  return `${resolveScriptBase()}assets/hb-hover-w.json`;
}

function loadAnimateModule(): Promise<AnimateModule> {
  if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
    return import("./lottie-hover");
  }
  return import(/* @vite-ignore */ `${resolveScriptBase()}credit-animate.js`);
}

function frameSvg(): string {
  return `<svg viewBox="0 0 201 201" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="201" height="201" rx="26.5055" fill="#0D0D0D"/>
    <rect x="9.93965" y="9.94014" width="181.121" height="181.121" rx="23.1923" stroke="#FFFFFF" stroke-width="6.62637"/>
  </svg>`;
}

function fullLogoSvg(): string {
  return `<svg viewBox="0 0 201 201" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="201" height="201" rx="26.5055" fill="#0D0D0D"/>
    <rect x="9.93965" y="9.94014" width="181.121" height="181.121" rx="23.1923" stroke="#FFFFFF" stroke-width="6.62637"/>
    ${H_PATHS}
  </svg>`;
}

export class HandbookCredit extends HTMLElement {
  static observedAttributes = ["theme", "project", "mark-size", "text-size", "animate"];

  private mounted = false;
  private animateModule: AnimateModule | null = null;
  private lottieAnim: AnimationItem | null = null;
  private animateLoading = false;
  private hoverListener: (() => void) | null = null;

  connectedCallback(): void {
    if (this.mounted) return;
    this.mounted = true;
    this.render();
  }

  disconnectedCallback(): void {
    this.teardownAnimate();
  }

  attributeChangedCallback(): void {
    if (this.mounted) this.render();
  }

  private get theme(): CreditTheme {
    return normalizeTheme(this.getAttribute("theme"));
  }

  private get project(): string | undefined {
    const value = this.getAttribute("project")?.trim();
    return value || undefined;
  }

  private get markSize(): number {
    return parsePixelSize(this.getAttribute("mark-size"), DEFAULT_MARK_SIZE, 16, 40);
  }

  private get textSize(): number {
    return parsePixelSize(this.getAttribute("text-size"), DEFAULT_TEXT_SIZE, 12, 22);
  }

  private get wantsAnimate(): boolean {
    return isAnimateEnabled(this.getAttribute("animate"));
  }

  private teardownAnimate(): void {
    if (this.hoverListener) {
      const link = this.shadowRoot?.querySelector(".credit");
      if (link) link.removeEventListener("mouseenter", this.hoverListener);
      this.hoverListener = null;
    }
    if (this.animateModule) {
      this.animateModule.destroyLottie(this.lottieAnim);
    }
    this.lottieAnim = null;
    this.animateModule = null;
    this.animateLoading = false;
  }

  private render(): void {
    this.teardownAnimate();

    const theme = this.theme;
    const project = this.project;
    const markSize = this.markSize;
    const textSize = this.textSize;
    const animate = this.wantsAnimate;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const useAnimate = animate && !reducedMotion;
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const href = buildUtmUrl(project);

    const markMarkup = useAnimate
      ? `<span class="mark-frame">${frameSvg()}</span><span class="mark-lottie" data-lottie-host></span>`
      : fullLogoSvg();

    shadow.innerHTML = `
      <style>${STYLES}</style>
      <a class="credit" data-theme="${theme}" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Built by Handbook — opens byhandbook.com" style="--hb-mark-size: ${markSize}px; --hb-text-size: ${textSize}px;">
        <span class="mark-wrap">${markMarkup}</span>
        <span class="label">built by handbook</span>
      </a>
    `;

    const link = shadow.querySelector(".credit");
    if (!(link instanceof HTMLAnchorElement)) return;

    sendRegistryPing({
      host: window.location.hostname,
      project,
      theme,
      version: "1",
    });

    if (!useAnimate) return;

    const lottieHost = shadow.querySelector<HTMLElement>("[data-lottie-host]");
    if (!lottieHost) return;

    this.hoverListener = () => {
      if (this.lottieAnim || this.animateLoading) return;
      this.animateLoading = true;
      const startHovered = link.matches(":hover");

      loadAnimateModule()
        .then((mod) => {
          if (!this.isConnected) return;
          this.animateModule = mod;
          this.lottieAnim = mod.mountHoverLottie(lottieHost, link, getAnimationUrl(), startHovered);
        })
        .catch(() => {
          /* animation is optional — static frame remains */
        })
        .finally(() => {
          this.animateLoading = false;
        });
    };

    link.addEventListener("mouseenter", this.hoverListener);
  }
}

export function registerHandbookCredit(): void {
  if (customElements.get("handbook-credit")) return;
  customElements.define("handbook-credit", HandbookCredit);
}

export function upgradeMountPoints(): void {
  document.querySelectorAll<HTMLElement>("[data-handbook-credit]").forEach((node) => {
    if (node.tagName.toLowerCase() === "handbook-credit") return;

    const credit = document.createElement("handbook-credit");
    const theme = node.getAttribute("data-theme") ?? node.dataset.theme;
    const project = node.getAttribute("data-project") ?? node.dataset.project;
    const markSize = node.getAttribute("data-mark-size") ?? node.dataset.markSize;
    const textSize = node.getAttribute("data-text-size") ?? node.dataset.textSize;

    if (theme) credit.setAttribute("theme", theme);
    if (project) credit.setAttribute("project", project);
    if (markSize) credit.setAttribute("mark-size", markSize);
    if (textSize) credit.setAttribute("text-size", textSize);
    if (node.hasAttribute("data-animate")) {
      credit.setAttribute("animate", node.getAttribute("data-animate") ?? "");
    }

    node.replaceWith(credit);
  });
}
