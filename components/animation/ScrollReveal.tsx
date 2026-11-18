"use client";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useRef, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  /** Elements to animate inside this wrapper. */
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
};

/**
 * Reveals marked children as they enter the viewport.
 * Renders with `display: contents` so it never changes the parent's flex/grid layout.
 */
export default function ScrollReveal({
  children,
  selector = "[data-reveal]",
  y = 28,
  duration = 0.65,
  stagger = 0.1,
  start = "top 88%",
}: ScrollRevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const targets = gsap.utils.toArray<HTMLElement>(selector, root.current);
      targets.forEach((target, index) => {
        gsap.from(target, {
          opacity: 0,
          y,
          duration,
          delay: index * stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target,
            start,
            once: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="contents">
      {children}
    </div>
  );
}
