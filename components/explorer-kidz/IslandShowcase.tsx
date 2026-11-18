"use client";

import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import { useRef } from "react";

export type ShowcaseIsland = {
  src: string;
  width: number;
  height: number;
  tint: string;
  /** The condition, for the screen-reader list. */
  name: string;
  /** The playful island name shown under the artwork. */
  nickname: string;
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
 * The three islands as one horizontal filmstrip. The section pins and the strip
 * slides sideways one stage width per island, so each island lands in the middle
 * in turn and its neighbour peeks in from the edge. Between every pair of
 * islands a row of stepping stones rides on the boundary: it is faint while an
 * island owns the stage and reaches full strength at the exact moment the stage
 * is half-way between two islands — the path you would hop across.
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
        const stones = gsap.utils.toArray<HTMLElement>("[data-stone]", section);
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

          // Each stone row lives on the boundary after island `index`, so it is
          // centred at pos = index + 0.5. Faint at the edges, full in the gap.
          stones.forEach((stone, index) => {
            const distance = Math.abs(pos - (index + 0.5));
            stone.style.opacity = (
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
        // the scale and the stones would snap instead of gliding.
        timeline.eventCallback("onUpdate", () =>
          render(timeline.progress()),
        );

        render(timeline.progress());

        // The one bit of looping motion in the section: the stones drift up and
        // settle back, each row offset from the other so they never bob in
        // lockstep. Small and slow on purpose — this audience reads fast motion
        // as noise.
        stones.forEach((stone, index) => {
          gsap.to(stone, {
            y: -6,
            duration: 2.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.45,
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
            className={`relative z-10 mt-[max(9svh,7.5rem)] px-4 text-center text-[clamp(18px,2.2vw,26px)] font-extrabold text-[#30214F] sm:mt-[max(9svh,8.5rem)] ${
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
                      // The cap keeps room for the name on short screens; on a
                      // normal window it never bites.
                      className="relative h-auto max-h-[calc(100%-4rem)] w-full max-w-[680px] object-contain drop-shadow-[0_30px_44px_rgba(48,33,79,0.24)]"
                    />

                    {/* The island's name, on its own colour. It sits in the
                        same column as the artwork so the two always travel
                        together; `aria-hidden` because the list below already
                        reads the name together with the condition. */}
                    <p
                      aria-hidden
                      className={`relative mt-3 shrink-0 rounded-full px-4 py-1.5 text-[13px] font-extrabold whitespace-nowrap text-[#30214F] shadow-[0_10px_20px_-12px_rgba(48,33,79,0.45)] ring-1 ring-white/70 sm:mt-4 sm:px-5 sm:text-[15px] ${
                        rtl ? "" : "tracking-tight"
                      }`}
                      style={{ backgroundColor: island.tint }}
                    >
                      {island.nickname}
                    </p>
                  </div>

                  {/* A row of stepping stones on the boundary with the next
                      island — the path you would hop across. It travels with
                      the strip, so it crosses the middle of the stage exactly
                      when neither island owns it, and it drifts gently while it
                      waits there. The wrapper straddles the boundary (half the
                      path in each island's margin) and holds the RTL mirror;
                      GSAP animates the image inside it, because it resets
                      translate/scale on anything it touches. Reduced motion
                      stacks the islands vertically, where a sideways path leads
                      nowhere. */}
                  {index < islands.length - 1 && (
                    <span
                      className={`pointer-events-none absolute end-0 top-1/2 -translate-y-1/2 motion-reduce:hidden ${
                        rtl ? "-translate-x-1/2 -scale-x-100" : "translate-x-1/2"
                      }`}
                    >
                      <Image
                        data-stone
                        src="/explorer-kidz/home/stone.png"
                        alt=""
                        aria-hidden
                        width={2112}
                        height={1168}
                        sizes="(min-width: 1024px) 352px, (min-width: 640px) 208px, 112px"
                        className="block h-auto w-[112px] sm:w-[208px] lg:w-[352px]"
                      />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Screen readers get each island once — nickname and condition together,
          whatever the motion preference. */}
      <ul className="sr-only">
        {islands.map((island) => (
          <li key={island.src}>
            {island.nickname} — {island.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
