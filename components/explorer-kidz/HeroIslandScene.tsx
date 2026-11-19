"use client";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import { useRef } from "react";

type HeroIslandSceneProps = {
  rtl: boolean;
  /** `bleed` = the artwork half of the desktop hero, `panel` = the phone card. */
  variant: "bleed" | "panel";
};

/**
 * The island side of the hero: the `islandSide` artwork as the ground. The only
 * motion is a slow parallax as the hero scrolls away, which keeps the split from
 * looking like a pasted screenshot — the islands themselves get their own
 * scroll story further down the page.
 */
export default function HeroIslandScene({
  rtl,
  variant,
}: HeroIslandSceneProps) {
  const root = useRef<HTMLDivElement>(null);

  // The fade always sits on the edge that faces the copy: the artwork's right
  // edge in Arabic, its left edge in English. It is a mask on the frame rather
  // than a gradient laid on top, so the artwork (and its own background) simply
  // dissolves into the page — there is no overlay edge to catch the light as a
  // hairline, and the parallax cannot drag the fade sideways with the image.
  const sideFade = `linear-gradient(${
    rtl ? "to left" : "to right"
  }, transparent 0, #000 18%, #000 100%)`;

  useGSAP(
    () => {
      const scene = root.current;
      if (!scene || prefersReducedMotion()) return;

      const ground = scene.querySelector<HTMLElement>("[data-scene-ground]");
      if (!ground) return;

      const mm = gsap.matchMedia();

      // The phone card is short and sits low in the page; a parallax there would
      // read as a wobble, so it only runs on the full-height desktop half.
      mm.add("(min-width: 1024px)", () => {
        // Overscaled so the shift never exposes an edge.
        gsap.set(ground, { scale: 1.08 });
        gsap.fromTo(
          ground,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [variant] },
  );

  return (
    <div
      ref={root}
      aria-hidden
      style={
        variant === "bleed"
          ? { WebkitMaskImage: sideFade, maskImage: sideFade }
          : undefined
      }
      className={
        variant === "bleed"
          ? "pointer-events-none absolute inset-y-0 start-1/2 end-[calc((100%-100vw)/2)] hidden h-full overflow-hidden bg-[#F3EFFB] lg:block"
          : "relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-[#F3EFFB] shadow-[0_30px_60px_-30px_rgba(48,33,79,0.35)] sm:aspect-[16/10]"
      }
    >
      {/* The scene is never mirrored: the characters are drawn in their own
          composition, and flipping them in Arabic would put the whole group
          back to front. Only the fade is direction-aware. */}
      <Image
        src="/explorer-kidz/landingPage/islandSide.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        data-scene-ground
        className="object-cover object-center will-change-transform"
      />

      {/* Fade the artwork's foot into the page so the half does not end on a
          ruler-straight edge. The side seam is handled by the mask above. */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-linear-to-t from-[#FAF8FF] to-transparent" />
    </div>
  );
}
