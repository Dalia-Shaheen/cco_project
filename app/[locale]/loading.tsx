import { isLocale, type Locale } from "@/lib/i18n";
import Image from "next/image";
import { locale as getLocale } from "next/root-params";

const COPY = {
  en: "Preparing your island…",
  ar: "بنجهّز جزيرتك…",
} as const satisfies Record<Locale, string>;

/** `loading.tsx` gets no props; the locale comes from the root segment. */
async function readLocale(): Promise<Locale> {
  const value = await getLocale();
  return isLocale(value) ? value : "en";
}

/**
 * The fallback for every route below `[locale]`. It is deliberately quiet:
 * one island, the wordmark, three dots. No spinner, no progress bar — the
 * audience is sensory-sensitive, so the page should feel like a held breath
 * rather than a machine working.
 */
export default async function Loading() {
  const locale = await readLocale();

  return (
    <main className="grid min-h-svh place-items-center bg-[#FAF8FF] px-6 py-16">
      <div className="flex flex-col items-center">
        {/* A short looped clip instead of a still: the island is already
            breathing, so the page never looks frozen. Silent, no controls, and
            the box is exactly the clip's own 0.568 ratio, so `object-contain`
            has nothing to letterbox. */}
        <div className="h-[264px] w-[150px] sm:h-[310px] sm:w-[176px]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/explorer-kidz/home/loading-poster.webp"
            aria-hidden
            width={360}
            height={634}
            className="lobly-float h-full w-full object-contain motion-reduce:hidden"
          >
            <source src="/explorer-kidz/home/loading.mp4" type="video/mp4" />
          </video>

          {/* One frame of the same clip for anyone who asked the OS for less
              motion. Both fill the same box, so nothing shifts. */}
          <Image
            src="/explorer-kidz/home/loading-poster.webp"
            alt=""
            aria-hidden
            width={360}
            height={634}
            sizes="(min-width: 640px) 176px, 150px"
            loading="eager"
            fetchPriority="high"
            className="hidden h-full w-full object-contain motion-reduce:block"
          />
        </div>

        <p
          style={{
            fontFamily:
              "var(--poppins), var(--cairo), ui-sans-serif, system-ui, sans-serif",
          }}
          className="mt-2 text-[24px] leading-[35px] font-bold text-[#563396] lg:text-[28px]"
        >
          Lobly
        </p>

        <div
          aria-hidden
          className="mt-4 flex items-center gap-2"
        >
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="lobly-dot h-2 w-2 rounded-full bg-[#6441A4]"
              style={{ animationDelay: `${index * 0.16}s` }}
            />
          ))}
        </div>

        {/* The dots are decoration; this is the line screen readers get. */}
        <p role="status" aria-live="polite" className="mt-4 text-[16px] leading-7 text-[#746585]">
          {COPY[locale]}
        </p>
      </div>
    </main>
  );
}
