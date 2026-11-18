import ScrollReveal from "@/components/animation/ScrollReveal";
import Footer from "@/components/Footer";
import HelpSection from "@/components/explorer-kidz/HelpSection";
import HeroIslandScene from "@/components/explorer-kidz/HeroIslandScene";
import HowItWorks from "@/components/explorer-kidz/HowItWorks";
import IslandShowcase from "@/components/explorer-kidz/IslandShowcase";
import FlairHover from "@/components/ui/FlairHover";
import { explorerContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { Play } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type HomeProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildMetadata({ locale, path: "/" }) : {};
}

/** Hand-drawn four-point star, used sparingly as a hero decoration. */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 24 24" className={className}>
      <path
        d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** The real island artwork, in the same order as `dict.islands`. */
const ISLAND_ART = [
  {
    src: "/explorer-kidz/landingPage/threeIsland/Distraction.png",
    width: 284,
    height: 182,
    tint: "#E5DAF7",
  },
  {
    src: "/explorer-kidz/landingPage/threeIsland/Autism.png",
    width: 232,
    height: 154,
    tint: "#FCE9E7",
  },
  {
    src: "/explorer-kidz/landingPage/threeIsland/DownSyndrome.png",
    width: 218,
    height: 178,
    tint: "#CFC8F5",
  },
] as const;

export default async function HomePage({ params }: HomeProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = explorerContent[locale];
  const rtl = locale === "ar";

  const islands = [
    { name: dict.islands[0], ...ISLAND_ART[0] },
    { name: dict.islands[1], ...ISLAND_ART[1] },
    { name: dict.islands[2], ...ISLAND_ART[2] },
  ];

  return (
    <div className="relative w-full">
      {/* `overflow-x-clip` contains the decorative scene without turning the
          section into a scroll container. */}
      <section className="relative w-full overflow-x-clip">
        {/* Split ground: the artwork owns the `end` half edge to edge, the copy
            stays on the page's near-white. It starts under the navbar so the
            floating bar keeps its white contrast on both halves. */}
        <HeroIslandScene rtl={rtl} variant="bleed" />

        <div className="relative mx-auto grid w-full max-w-[1392px] items-center gap-14 px-4 pt-2 pb-14 sm:px-6 sm:pt-4 sm:pb-16 lg:grid-cols-2 lg:gap-6 lg:pt-6 lg:pb-20">
          {/* ===== Copy — free on the background, no card around it ===== */}
          <div className="relative z-10 w-full max-w-[600px] lg:max-w-[560px]">
            <ScrollReveal>
              <p data-reveal>
                <span className="inline-flex items-center gap-2.5 rounded-full bg-[#EEE8F8] py-2 ps-2.5 pe-4 text-[12px] font-bold text-[#563396] sm:text-[14px]">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#30214F] text-white">
                    <Sparkle className="w-3" />
                  </span>
                  {dict.eyebrow}
                </span>
              </p>

              {/* The mascot peeks out from behind the headline, at the far end of
                  the first line — the short words leave that corner empty. */}
              <div data-reveal className="relative mt-6">
                <h1
                  className={`relative z-10 text-[clamp(36px,10.6vw,54px)] font-extrabold text-[#30214F] sm:text-[clamp(48px,7.2vw,64px)] lg:text-[clamp(44px,5.6vw,86px)] ${
                    // Cairo needs more leading for its ascenders and marks, and
                    // negative tracking would break its cursive joins.
                    rtl ? "leading-[1.24]" : "leading-[1.06] tracking-tight"
                  }`}
                >
                  <span className="block">{dict.titleTop}</span>
                  <span className="block">{dict.titleMid}</span>
                  <span className="relative inline-block text-[#8F70C4]">
                    {dict.titleHighlight}
                    <svg
                      aria-hidden
                      focusable="false"
                      viewBox="0 0 200 12"
                      preserveAspectRatio="none"
                      className="absolute inset-x-0 -bottom-1 h-2 w-full text-[#F4A6A0] sm:-bottom-2 sm:h-3"
                    >
                      <path
                        d="M2 8 Q 50 2, 100 7 T 198 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h1>
              </div>

              <p
                data-reveal
                className="mt-6 max-w-[46ch] text-[15px] leading-[26px] text-[#625575] sm:text-[17px] sm:leading-[29px] lg:text-[18px] lg:leading-[30px]"
              >
                {dict.subtitle}
              </p>

              {/* CTAs: pills, a purple cast shadow under the primary, and a
                  hand-drawn arrow nudging the eye back to them. */}
              <div
                data-reveal
                className="relative mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4"
              >
                <Link
                  href={`/${locale}/get-started`}
                  className="group relative flex h-13 min-h-12 w-full items-center justify-center rounded-full bg-[#6441A4] px-8 text-[16px] font-bold text-white shadow-[0_18px_30px_-12px_rgba(100,65,164,0.65)] outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#6441A4] motion-reduce:hover:bg-[#563396] sm:w-auto sm:text-[18px]"
                >
                  <FlairHover color="#FFFFFF" />
                  <span className="relative transition-colors duration-75 motion-safe:group-hover:text-[#563396] motion-safe:group-hover:delay-100">
                    {dict.getStarted}
                  </span>
                </Link>
                <Link
                  href="#how-it-works"
                  className="group relative flex h-13 min-h-12 w-full items-center justify-center gap-3 rounded-full border border-[#C9BDEB] bg-white py-2 ps-2 pe-7 text-[16px] font-bold text-[#30214F] outline-offset-2 transition-[border-color] duration-200 hover:border-[#6441A4] focus-visible:outline-2 focus-visible:outline-[#6441A4] motion-reduce:transition-none sm:w-auto sm:text-[18px]"
                >
                  <FlairHover color="#EEE8F8" />
                  <span className="relative grid h-9 w-9 flex-none place-items-center rounded-full bg-[#EEE8F8] text-[#6441A4] transition-colors duration-75 motion-safe:group-hover:bg-white motion-safe:group-hover:delay-100">
                    <Play className="h-3.5 w-3.5" fill="currentColor" aria-hidden />
                  </span>
                  <span className="relative">{dict.howItWorks}</span>
                </Link>

                <svg
                  aria-hidden
                  focusable="false"
                  viewBox="0 0 120 60"
                  className={`pointer-events-none hidden w-24 flex-none text-[#F4A6A0] xl:block ${
                    rtl ? "-scale-x-100" : ""
                  }`}
                >
                  <path
                    d="M4 40 C 10 10, 40 10, 34 34 C 30 50, 12 40, 30 28 C 55 14, 85 24, 112 18 M100 8 L114 18 L102 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </ScrollReveal>
          </div>

          {/* ===== Artwork: the same scene, as a card on phones ===== */}
          <div className="w-full lg:hidden">
            <HeroIslandScene rtl={rtl} variant="panel" />
          </div>
        </div>
      </section>

      {/* ===== The islands, one after another, on scroll ===== */}
      <IslandShowcase
        islands={islands}
        heading={`${dict.stat.value} ${dict.stat.label}`}
        rtl={rtl}
      />

      {/* ===== How it works, then Help — the two stacked sections ===== */}
      <HowItWorks locale={locale} text={dict.steps} />
      <HelpSection text={dict.help} />

      <Footer locale={locale} text={dict.footer} />
    </div>
  );
}
