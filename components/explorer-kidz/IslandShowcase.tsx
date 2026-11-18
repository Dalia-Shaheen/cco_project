"use client";

import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import { useRef } from "react";

export type ShowcaseIsland = {
  src: string;
  width: number;
  height: number;
  tint: string;
  name: string;
};

type IslandShowcaseProps = {
  islands: readonly ShowcaseIsland[];
  heading: string;
  rtl: boolean;
};

/** Four-point sparkle, the same shape the hero uses. */
function Star({ speed, className }: { speed: number; className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      data-speed={speed}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The hand-drawn arrow from the hero. Here it sits on the boundary between two
 * islands, so it slides into the middle of the stage exactly while you are
 * between them and points at the island arriving next.
 */
function ArrowSquiggle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      data-arrow
      viewBox="0 0 120 60"
      className={className}
    >
      <path
        d="M4 40 C 10 10, 40 10, 34 34 C 30 50, 12 40, 30 28 C 55 14, 85 24, 112 18 M100 8 L114 18 L102 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The three islands as one horizontal filmstrip. The section pins and the strip
 * slides sideways one stage width per island, so each island lands in the middle
 * in turn and its neighbour peeks in from the edge. Between every pair of
 * islands the hero's hand-drawn arrow rides on the boundary: it is faint while
 * an island owns the stage and reaches full strength at the exact moment the
 * stage is half-way between two islands.
 */
export default function IslandShowcase({
  islands,
  heading,
  rtl,
}: IslandShowcaseProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const strip = section.querySelector<HTMLElement>(
          "[data-islands-track]",
        );
        const cells = gsap.utils.toArray<HTMLElement>("[data-island]", section);
        const arrows = gsap.utils.toArray<HTMLElement>("[data-arrow]", section);
        const shapes = gsap.utils.toArray<HTMLElement>("[data-speed]", section);
        if (!strip || cells.length < 2) return;

        const arts = cells.map((el) =>
          el.querySelector<HTMLElement>("[data-art]"),
        );

        const steps = cells.length - 1;

        let stageW = 0;
        let travel = 0;

        // While the section is pinned, ScrollTrigger keeps both it and its
        // pin-spacer fixed at the width they had before a resize, so the frame
        // has to be read from the page container (never pinned) or the
        // measurement comes out one resize behind.
        const stageWidth = () =>
          section.closest("main")?.clientWidth ??
          document.documentElement.clientWidth;

        const measure = () => {
          stageW = stageWidth();
          // One stage width per island, so island i is centred at progress
          // i / (n - 1) — no guessed multipliers.
          travel = steps * stageW;
        };

        measure();

        const render = (progress: number) => {
          // Continuous island index: 0 = first island centred, 1 = second…
          const pos = progress * steps;

          // The centred island is full size; its neighbours shrink back a
          // little as they slide away.
          arts.forEach((art, index) => {
            if (!art) return;
            const distance = Math.abs(pos - index);
            const scale = 0.85 + 0.15 * Math.max(0, 1 - distance);
            art.style.transform = `scale(${scale.toFixed(4)})`;
          });

          // Each arrow lives on the boundary after island `index`, so it is
          // centred at pos = index + 0.5. Faint at the edges, full in the gap.
          arrows.forEach((arrow, index) => {
            const distance = Math.abs(pos - (index + 0.5));
            arrow.style.opacity = (
              0.15 +
              0.85 * Math.max(0, 1 - distance * 2)
            ).toFixed(3);
          });
        };

        // The pin lasts exactly as long as the strip needs to travel at a
        // steady, readable speed, so no screen size gets a rushed story.
        const pinDistance = () =>
          Math.max(travel / 1.15, section.offsetHeight * 1.5);

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${pinDistance()}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Measure before ScrollTrigger works out start/end, so the pin
            // length always comes from the current widths.
            onRefreshInit: measure,
            onRefresh: (self) => render(self.progress),
          },
        });

        // The filmstrip itself: one stage width of travel per island. In RTL
        // the cells are laid out right-to-left, so the strip moves the other
        // way and the next island arrives from the left.
        timeline.fromTo(
          strip,
          { x: 0 },
          { x: () => (rtl ? travel : -travel), duration: 1 },
          0,
        );

        // Decorations drift at their own speeds for the same parallax depth.
        shapes.forEach((shape) => {
          const speed = Number(shape.dataset.speed ?? 0);
          timeline.to(
            shape,
            {
              x: () => stageW * 0.25 * speed * (rtl ? -1 : 1),
              y: () => -80 * speed,
              rotate: 90 * speed,
              duration: 1,
            },
            0,
          );
        });

        // Render from the *smoothed* playhead, not the raw scroll position, or
        // the scale and the arrows would snap instead of gliding.
        timeline.eventCallback("onUpdate", () =>
          render(timeline.progress()),
        );

        render(timeline.progress());

        // The one bit of looping motion in the section: each arrow leans
        // towards the island arriving next and drifts back. It is small and
        // slow on purpose — this audience reads fast motion as noise.
        arrows.forEach((arrow) => {
          gsap.to(arrow, {
            x: 16,
            duration: 1.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });

        // A font swap above the section changes where the pin starts; refresh
        // once the real faces are in so the start/end stay honest.
        if (document.fonts && document.fonts.status !== "loaded") {
          document.fonts.ready.then(() => ScrollTrigger.refresh());
        }
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [rtl] },
  );

  return (
    <section
      ref={root}
      id="islands"
      aria-labelledby="islands-title"
      className="relative w-full overflow-x-clip"
    >
      <div className="relative h-svh overflow-hidden motion-reduce:static motion-reduce:h-auto">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_75%_at_50%_0%,#F3EFFB_0%,#FAF8FF_62%)]"
        />

        {/* Decorative stars, each on its own parallax speed. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 motion-reduce:hidden"
        >
          <Star
            speed={0.5}
            className="absolute start-[7%] top-[16%] w-5 text-[#8F70C4]/40"
          />
          <Star
            speed={-0.6}
            className="absolute end-[9%] top-[30%] w-4 text-[#F4A6A0]/60"
          />
          <Star
            speed={0.35}
            className="absolute start-[13%] bottom-[20%] w-3 text-[#6441A4]/30"
          />
          <Star
            speed={-0.4}
            className="absolute end-[7%] bottom-[26%] w-6 text-[#8F70C4]/30"
          />
        </div>

        <div className="relative flex h-full flex-col motion-reduce:h-auto">
          <h2
            id="islands-title"
            className={`relative z-10 mt-[9svh] px-4 text-center text-[clamp(18px,2.2vw,26px)] font-extrabold text-[#30214F] ${
              // Cairo breaks with negative tracking; Latin tightens nicely.
              rtl ? "" : "tracking-tight"
            }`}
          >
            {heading}
          </h2>

          {/* One stage-wide cell per island, laid side by side in a single row
              that GSAP slides sideways. The row overflows the frame, so the
              neighbours wait just outside the edge. */}
          <div className="relative mt-2 min-h-0 flex-1 overflow-x-clip motion-reduce:mt-0 motion-reduce:flex-none">
            <div
              data-islands-track
              className="absolute inset-0 flex motion-reduce:static motion-reduce:flex-col"
            >
              {islands.map((island, index) => (
                <div
                  key={island.src}
                  data-island
                  className="relative flex h-full w-full shrink-0 items-center justify-center px-4 motion-reduce:h-auto motion-reduce:flex-col motion-reduce:px-0 motion-reduce:py-8"
                >
                  <div className="relative flex h-full w-full flex-col items-center justify-center motion-reduce:h-auto">
                    {/* A tinted puff in the island's own colour, so each one
                        owns the stage instead of floating in the same white
                        room. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute h-[74%] w-[74%] max-w-[540px] rounded-full opacity-70 blur-3xl"
                      style={{ backgroundColor: island.tint }}
                    />

                    <Image
                      data-art
                      src={island.src}
                      alt=""
                      width={island.width}
                      height={island.height}
                      sizes="(min-width: 640px) 680px, 92vw"
                      className="relative h-auto max-h-full w-full max-w-[680px] object-contain drop-shadow-[0_30px_44px_rgba(48,33,79,0.24)]"
                    />
                  </div>

                  {/* The hero's hand-drawn arrow on the boundary with the next
                      island. It travels with the strip, so it crosses the
                      middle of the stage exactly when neither island owns it,
                      and it keeps nudging towards the island arriving next.
                      The wrapper holds the position and the RTL mirror; GSAP
                      animates the svg inside it (it resets translate/scale on
                      anything it touches). Reduced motion stacks the islands
                      vertically, where a sideways arrow points at nothing. */}
                  {index < islands.length - 1 && (
                    <span
                      className={`pointer-events-none absolute end-0 top-1/2 -translate-y-1/2 text-[#F4A6A0] motion-reduce:hidden ${
                        rtl ? "-scale-x-100" : ""
                      }`}
                    >
                      <ArrowSquiggle className="block w-12 sm:w-24 lg:w-32" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Screen readers get the list once, whatever the motion preference. */}
      <ul className="sr-only">
        {islands.map((island) => (
          <li key={island.src}>{island.name}</li>
        ))}
      </ul>
    </section>
  );
}
