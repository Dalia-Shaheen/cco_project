"use client";

import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useEffect, useRef } from "react";

type FlairHoverProps = {
  /** Fill of the circle that sweeps out from the pointer. */
  color: string;
  /** Extra styling for the circle itself (blur, gradient, …). */
  className?: string;
};

/**
 * The hover from gsap.com's buttons: a circle parks at the point where the
 * pointer entered, grows to cover the button, trails the pointer, then collapses
 * toward the exit point. It drives its own parent element, so render it as the
 * first child of a `relative` button and keep the label above it (`relative`).
 *
 * The motion is the original: the disc parks on the entry point, grows, trails
 * the pointer and collapses toward the exit point, with the flair translating in
 * percent of the button. Only the disc's diameter is computed (button diagonal ×
 * 2) so a hover near a corner still covers the far one.
 */
export default function FlairHover({ color, className = "" }: FlairHoverProps) {
  const clip = useRef<HTMLSpanElement>(null);
  const mover = useRef<HTMLSpanElement>(null);
  const disc = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = mover.current;
    const frame = clip.current;
    const circle = disc.current;
    // Touch has no hover, and reduced motion keeps the plain CSS fallback.
    if (!node || !frame || !circle || prefersReducedMotion()) return;

    const button = frame.parentElement;
    if (!button) return;

    const setX = gsap.quickSetter(node, "xPercent") as (value: number) => void;
    const setY = gsap.quickSetter(node, "yPercent") as (value: number) => void;

    const toPercent = (offset: number, size: number) =>
      Math.min(100, Math.max(0, (offset / size) * 100));

    const pointOf = (event: PointerEvent) => {
      const { left, top, width, height } = frame.getBoundingClientRect();
      return {
        x: toPercent(event.clientX - left, width),
        y: toPercent(event.clientY - top, height),
      };
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const { width, height } = frame.getBoundingClientRect();
      // A disc wide enough to reach the far corner from any entry point, so a
      // hover near an edge still fills the whole pill.
      const size = Math.ceil(2 * Math.hypot(width, height));
      gsap.set(circle, { width: size, height: size });
      const { x, y } = pointOf(event);
      // Park the collapsed circle under the pointer before it grows.
      setX(x);
      setY(y);
      gsap.to(node, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const { x, y } = pointOf(event);
      // Short on purpose: a long damped follow reads as "stuck" on a 48px pill.
      gsap.to(node, { xPercent: x, yPercent: y, duration: 0.16, ease: "power2" });
    };

    const onLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const { x, y } = pointOf(event);
      gsap.killTweensOf(node);
      gsap.to(node, {
        // Nudge the collapse past the edge it left through, like the original.
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.22,
        ease: "power2.out",
      });
    };

    button.addEventListener("pointerenter", onEnter);
    button.addEventListener("pointermove", onMove);
    button.addEventListener("pointerleave", onLeave);

    return () => {
      button.removeEventListener("pointerenter", onEnter);
      button.removeEventListener("pointermove", onMove);
      button.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(node);
    };
  }, []);

  return (
    <span
      ref={clip}
      aria-hidden
      // One pixel past the button: the clip's own antialiased edge then sits
      // outside the pill, so the button's background cannot bleed through it as
      // a coloured hairline. White-on-white, so the overhang is invisible.
      className="pointer-events-none absolute -inset-px overflow-hidden rounded-[inherit]"
    >
      {/* The clip stays glued to the button; only this layer follows the
          pointer, so the fill can never slide out of the button's corners. */}
      <span
        ref={mover}
        className="absolute inset-0 will-change-transform"
        // Inline so Tailwind's `scale-*` (a separate `scale` property in v4) can
        // never multiply against the transform GSAP animates.
        style={{ transform: "scale(0)", transformOrigin: "0% 0%" }}
      >
        <span
          ref={disc}
          className={`absolute top-0 left-0 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2 rounded-full ${className}`}
          style={{ backgroundColor: color }}
        />
      </span>
    </span>
  );
}
