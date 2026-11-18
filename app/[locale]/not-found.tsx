import FlairHover from "@/components/ui/FlairHover";
import { isLocale, type Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { locale as getLocale } from "next/root-params";
import type { Metadata } from "next";

/**
 * Copy lives here rather than in `content.ts` for the same reason the footer's
 * labels do: this is chrome, not page copy, and it must not pull the whole home
 * dictionary into every route that ships the 404 boundary.
 */
const COPY = {
  en: {
    metaTitle: "Page not found · Lobly",
    code: "404",
    title: "This island isn’t on the map",
    body: "The page you’re looking for may have moved, or the link was mistyped. Let’s head back somewhere friendly.",
    home: "Back to home",
    other: "النسخة العربية",
    otherLabel: "Switch to Arabic",
  },
  ar: {
    metaTitle: "الصفحة غير موجودة · Lobly",
    code: "٤٠٤",
    title: "الجزيرة دي مش على الخريطة",
    body: "الصفحة اللي بتدور عليها يمكن اتنقلت أو اللينك مكتوب غلط. خلينا نرجّعك لمكان مألوف.",
    home: "الرجوع للرئيسية",
    other: "English version",
    otherLabel: "Switch to English",
  },
} as const satisfies Record<Locale, unknown>;

/** The 404 gets no `params` prop, so the locale comes from the root segment. */
async function readLocale(): Promise<Locale> {
  const value = await getLocale();
  return isLocale(value) ? value : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await readLocale();
  return { title: COPY[locale].metaTitle };
}

/**
 * Shown for any `notFound()` thrown below `[locale]` — and for URLs that only
 * match the locale segment. It renders inside the root layout (so `lang`, `dir`
 * and the locale font are already correct) but outside `(site)`, so it brings
 * its own wordmark instead of the fixed navbar: a dead end should not offer a
 * menu, just a way home.
 */
export default async function NotFound() {
  const locale = await readLocale();
  const text = COPY[locale];
  const other: Locale = locale === "ar" ? "en" : "ar";

  return (
    <main className="relative isolate grid min-h-svh place-items-center overflow-hidden bg-[#FAF8FF] px-5 py-16 sm:px-8">
      {/* Two soft washes keep the empty page from reading as an error screen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -start-24 h-[340px] w-[340px] rounded-full bg-[#EEE8F8]/80 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -end-20 h-[380px] w-[380px] rounded-full bg-[#F4A6A0]/25 blur-3xl"
      />

      <div className="relative flex w-full max-w-[560px] flex-col items-center text-center">
        <Link
          href={`/${locale}`}
          style={{
            fontFamily:
              "var(--poppins), var(--cairo), ui-sans-serif, system-ui, sans-serif",
          }}
          className="text-[24px] leading-[35px] font-bold text-[#563396] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#6441A4] lg:text-[28px]"
        >
          Lobly
        </Link>

        {/* The 404 artwork: the same character family as the home mascot, drawn
            for this dead end. Transparent PNG, so it floats on the page's own
            background with no card behind it. */}
        <div className="mt-6 h-[220px] w-[190px] sm:h-[260px] sm:w-[220px]">
          <Image
            src="/explorer-kidz/home/404.png"
            alt=""
            aria-hidden
            width={1440}
            height={2560}
            sizes="(min-width: 640px) 220px, 190px"
            loading="eager"
            fetchPriority="high"
            className="lobly-float h-full w-full object-contain"
          />
        </div>

        <p className="mt-2 text-[56px] leading-none font-extrabold text-[#6441A4] sm:text-[68px]">
          {text.code}
        </p>

        <h1 className="mt-4 text-[24px] leading-[1.35] font-bold text-[#30214F] sm:text-[30px]">
          {text.title}
        </h1>
        <p className="mt-3 max-w-[430px] text-[16px] leading-7 text-[#746585] sm:text-[17px]">
          {text.body}
        </p>

        <Link
          href={`/${locale}`}
          className="group relative mt-8 flex h-14 w-full max-w-[280px] items-center justify-center rounded-full bg-[#6441A4] px-8 text-[16px] font-bold text-white shadow-[0_18px_30px_-12px_rgba(100,65,164,0.65)] outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#6441A4] motion-reduce:hover:bg-[#563396] sm:w-auto sm:max-w-none sm:text-[18px]"
        >
          <FlairHover color="#FFFFFF" />
          <span className="relative transition-colors duration-75 motion-safe:group-hover:text-[#563396] motion-safe:group-hover:delay-100">
            {text.home}
          </span>
        </Link>

        <Link
          href={`/${other}`}
          aria-label={text.otherLabel}
          className="mt-5 rounded-full px-3 py-1 text-[15px] font-bold text-[#8F70C4] underline-offset-4 outline-offset-2 transition-colors hover:text-[#6441A4] hover:underline focus-visible:outline-2 focus-visible:outline-[#6441A4]"
        >
          {text.other}
        </Link>
      </div>
    </main>
  );
}
