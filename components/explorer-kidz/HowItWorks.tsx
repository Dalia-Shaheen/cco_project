import ScrollReveal from "@/components/animation/ScrollReveal";
import StepsTimeline from "@/components/explorer-kidz/StepsTimeline";
import FlairHover from "@/components/ui/FlairHover";
import { explorerContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

type HowItWorksProps = {
  locale: Locale;
  text: (typeof explorerContent)[Locale]["steps"];
};

/**
 * One illustration per step, in the same order as `text.items`, with each
 * file's real pixel size so the browser reserves the right box and the
 * optimizer never guesses an aspect ratio.
 */
const STEP_ART = [
  { src: "/explorer-kidz/home/mother_child.png", width: 1180, height: 1270 },
  { src: "/explorer-kidz/home/step-island.png", width: 980, height: 930 },
  { src: "/explorer-kidz/home/step-child.png", width: 1106, height: 1300 },
] as const;

/** The badge alternates purple/pink so the three steps do not read as a list. */
const STEP_BADGE = [
  "bg-[#6441A4] text-white",
  "bg-[#F4A6A0] text-[#493261]",
  "bg-[#6441A4] text-white",
] as const;

/**
 * The three-step explainer that sits under the islands. It is a plain section —
 * no pinning, no scroll hijack — so it reads as a calm list right after the
 * island filmstrip.
 *
 * The dotted trail is a single exported SVG sitting behind the cards: the cards
 * are opaque, so the line only shows above them and in the gaps, which is
 * exactly how the hand-drawn path weaves between the steps in the design.
 */
export default function HowItWorks({ locale, text }: HowItWorksProps) {
  const rtl = locale === "ar";

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="relative w-full scroll-mt-28 overflow-x-clip bg-[#FAF8FF]"
    >
      <div className="mx-auto w-full max-w-[1392px] px-6 pt-12 pb-[54px] lg:pt-[72px] lg:pb-16">
        <ScrollReveal>
          <h2
            data-reveal
            id="how-it-works-title"
            className="text-center text-[32px] leading-[48px] font-bold text-[#6441A4] lg:text-[44px] lg:leading-[66px]"
          >
            {text.title}
          </h2>
          <p
            data-reveal
            className="mx-auto mt-4 max-w-[326px] text-center text-[17px] leading-[26px] text-[#746585] lg:mt-3 lg:max-w-[1040px] lg:text-[19px] lg:leading-[29px]"
          >
            {text.subtitle}
          </p>
        </ScrollReveal>

        <div className="relative mx-auto mt-20 w-full max-w-[1208px] lg:mt-[91px]">
          <StepsTimeline>
            {/* The trail is decorative and purely positional: it starts 83px
                above the first card so its highest curve sits over the empty
                space between the subtitle and the cards. `StepsTimeline` wipes
                it in first, then the cards follow one by one. */}
            <Image
              src="/explorer-kidz/home/trail.svg"
              alt=""
              aria-hidden
              data-trail="wide"
              width={1084}
              height={213}
              unoptimized
              className={`pointer-events-none absolute inset-x-0 -top-[83px] z-0 mx-auto hidden h-auto w-full max-w-[1080px] lg:block ${rtl ? "-scale-x-100" : ""}`}
            />
            {/* Phones get the vertical version of the same hand-drawn path. */}
            <Image
              src="/explorer-kidz/home/trail-mobile.svg"
              alt=""
              aria-hidden
              data-trail="tall"
              width={137}
              height={1009}
              unoptimized
              className="pointer-events-none absolute inset-x-0 -top-3 z-0 mx-auto h-auto w-[37%] max-w-[127px] lg:hidden"
            />

            <ol className="relative z-10 grid gap-12 lg:grid-cols-3 lg:gap-[76px]">
              {text.items.map((item, index) => (
                <li key={item} data-step className="relative">
                  <div className="flex flex-col rounded-[28px] bg-white pt-2.5 pb-9 shadow-[0_10px_24px_rgba(100,65,164,0.07)]">
                    <Image
                      src={STEP_ART[index].src}
                      alt=""
                      aria-hidden
                      width={STEP_ART[index].width}
                      height={STEP_ART[index].height}
                      sizes="(min-width: 1024px) 352px, calc(100vw - 88px)"
                      // The three illustrations are portraits of different
                      // proportions; `contain` keeps the fixed 308×210 stage (so
                      // the cards stay equal height) without cutting heads or feet
                      // the way `cover` did.
                      className="mx-[22px] h-[210px] w-[calc(100%-44px)] object-contain"
                    />
                    <p className="mt-[11px] px-3 text-center text-[16px] leading-[23px] font-bold text-[#6441A4]">
                      {item}
                    </p>
                  </div>

                  {/* Straddles the card's top edge, 24px in from its start. */}
                  <span
                    aria-hidden
                    data-step-badge
                    className={`absolute -top-7 start-6 grid size-14 place-items-center rounded-full text-[28px] leading-[42px] font-bold ${STEP_BADGE[index]}`}
                  >
                    {index + 1}
                  </span>
                </li>
              ))}
            </ol>
          </StepsTimeline>
        </div>

        <ScrollReveal y={20}>
          <div className="mt-[70px] flex justify-center lg:mt-20">
            <Link
              data-reveal
              href={`/${locale}/get-started`}
              className="group relative flex h-14 min-h-12 w-full max-w-[342px] items-center justify-center rounded-2xl bg-[#6441A4] px-6 text-[20px] leading-8 font-bold text-white outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#6441A4] motion-reduce:hover:bg-[#563396] lg:w-auto lg:min-w-[224px]"
            >
              <FlairHover color="#FFFFFF" />
              <span className="relative transition-colors duration-75 motion-safe:group-hover:text-[#563396] motion-safe:group-hover:delay-100">
                {text.cta}
              </span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
