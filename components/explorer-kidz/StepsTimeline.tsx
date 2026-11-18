"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { useRef, type ReactNode } from "react";

type StepsTimelineProps = {
  children: ReactNode;
};

/**
 * Plays the three steps in order: the dotted trail is wiped in from the first
 * card towards the last, then each card rises into place and its number pops
 * on just after it.
 *
 * Every card keeps its own ScrollTrigger so the phone layout (three stacked
 * cards that enter one at a time) still reads as a sequence; on the desktop row
 * the three triggers fire together and the delay alone does the ordering.
 * Nothing repeats — the section is meant to be read once, calmly.
 */
export default function StepsTimeline({ children }: StepsTimelineProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = root.current;
      if (!host) return;

      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", host);
      if (!steps.length) return;

      const wide = host.querySelector<HTMLElement>('[data-trail="wide"]');
      const tall = host.querySelector<HTMLElement>('[data-trail="tall"]');

      // The two trails are two shapes, not two breakpoints of one shape: the
      // wide one is wiped sideways, the tall one downwards. Whichever is
      // hidden by `lg:` gets the same treatment anyway; it costs nothing.
      const wipe = (el: HTMLElement | null, from: string) => {
        if (!el) return;
        gsap.set(el, { clipPath: from });
        gsap.to(el, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.15,
          ease: "power2.inOut",
          scrollTrigger: { trigger: host, start: "top 84%", once: true },
        });
      };

      /**
       * `gap` only makes sense on the desktop row, where all three cards cross
       * the trigger line at the same moment and the delay is the only thing
       * creating an order. Stacked, the scroll itself spaces the cards out, so
       * the small lead is enough.
       */
      const build = (lead: number, gap: number) => {
        // The wide trail is mirrored in Arabic (`-scale-x-100`), so this same
        // local left-to-right wipe already reads as right-to-left there.
        wipe(wide, "inset(0% 100% 0% 0%)");
        wipe(tall, "inset(0% 0% 100% 0%)");

        steps.forEach((step, index) => {
          const badge = step.querySelector<HTMLElement>("[data-step-badge]");
          const at = lead + index * gap;

          gsap.fromTo(
            step,
            { y: 30, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.7,
              ease: "power3.out",
              delay: at,
              scrollTrigger: { trigger: step, start: "top 88%", once: true },
            },
          );

          if (badge) {
            gsap.fromTo(
              badge,
              { scale: 0.5 },
              {
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.4)",
                delay: at + 0.18,
                scrollTrigger: { trigger: step, start: "top 88%", once: true },
              },
            );
          }
        });
      };

      // One media query per layout, so rotating a tablet across 1024px rebuilds
      // the timings instead of keeping the ones it mounted with.
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 1023px)",
        () => build(0.12, 0),
      );
      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
        () => build(0.3, 0.24),
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
