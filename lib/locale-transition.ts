"use client";

import { gsap, prefersReducedMotion } from "./gsap";

const OVERLAY_ID = "lobly-locale-transition";

type TransitionDirection = "ltr" | "rtl";

let active = false;
let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
let exitXPercent = -100;

export function isLocaleTransitionActive(): boolean {
  return active;
}

function buildOverlay(): HTMLDivElement {
  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:#6441A4;pointer-events:auto;overflow:hidden;";

  const mark = document.createElement("div");
  mark.setAttribute("data-lobly-mark", "true");
  mark.textContent = "Lobly";
  mark.style.cssText =
    "color:#FAF8FF;font-size:clamp(2.5rem,8vw,5rem);font-weight:800;letter-spacing:-0.04em;line-height:1;opacity:0;";

  overlay.appendChild(mark);
  document.body.appendChild(overlay);
  return overlay;
}

/** Covers the viewport, then hands control back so the navigation can happen. */
export function coverScreen(
  onCovered: () => void,
  direction: TransitionDirection = "ltr",
): void {
  if (typeof document === "undefined") {
    onCovered();
    return;
  }

  if (prefersReducedMotion()) {
    onCovered();
    return;
  }

  if (active) return;
  active = true;

  // Arabic (RTL) sweeps in from the right, English (LTR) from the left.
  // The reveal continues in the same direction instead of bouncing back.
  const enterXPercent = direction === "rtl" ? 100 : -100;
  exitXPercent = -enterXPercent;

  document.getElementById(OVERLAY_ID)?.remove();
  const overlay = buildOverlay();
  const mark = overlay.querySelector<HTMLElement>("[data-lobly-mark]");

  gsap
    .timeline({ onComplete: onCovered })
    .fromTo(
      overlay,
      { xPercent: enterXPercent },
      { xPercent: 0, duration: 0.55, ease: "power3.inOut" },
    )
    .fromTo(
      mark,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.28, ease: "power2.out" },
      "-=0.25",
    );

  // Safety net: never leave the screen covered if navigation fails.
  fallbackTimer = setTimeout(() => {
    if (active) revealScreen();
  }, 3000);
}

/** Reveals the new page after the route has changed. */
export function revealScreen(): void {
  if (!active) return;
  active = false;

  if (fallbackTimer) {
    clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }

  const overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) return;

  const mark = overlay.querySelector<HTMLElement>("[data-lobly-mark]");
  gsap
    .timeline({ onComplete: () => overlay.remove() })
    .to(mark, { opacity: 0, scale: 0.92, duration: 0.18, ease: "power2.in" })
    .to(overlay, { xPercent: exitXPercent, duration: 0.55, ease: "power3.inOut" }, "-=0.05");
}
