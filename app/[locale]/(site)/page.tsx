import ScrollReveal from "@/components/animation/ScrollReveal";
import Footer from "@/components/Footer";
import { explorerContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type HomeProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildMetadata({ locale, path: "/" }) : {};
}

export default async function HomePage({ params }: HomeProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = explorerContent[locale];

  return (
    <div className="relative flex min-h-[calc(100vh-5.25rem)] w-full flex-col items-center gap-8 px-4 pt-8 pb-16 sm:gap-12 sm:px-6 sm:pt-12 sm:pb-24 lg:min-h-[calc(100vh-4.5rem)] lg:flex-row">
      <ScrollReveal>
        {/* Left Content Card */}
        <div className="z-10 flex w-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0px_4px_16px_rgba(56,33,89,0.045)] sm:gap-6 sm:p-8 lg:w-[552px]">
          {/* Eyebrow */}
          <p
            data-reveal
            className="text-[13px] leading-snug font-bold uppercase tracking-wide text-[#563396] sm:text-[16px] lg:text-[18px]"
          >
            {dict.eyebrow}
          </p>

          {/* Title */}
          <h1
            data-reveal
            className="text-[30px] leading-[38px] font-bold text-[#30214F] sm:text-[38px] sm:leading-[48px] lg:text-[44px] lg:leading-[55px]"
          >
            {dict.title}
          </h1>

          {/* Subtitle */}
          <p
            data-reveal
            className="text-[16px] leading-[26px] text-[#625575] sm:text-[18px] sm:leading-[30px] lg:text-[20px] lg:leading-[32px]"
          >
            {dict.subtitle}
          </p>

          {/* Buttons */}
          <div data-reveal className="mt-2 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href={`/${locale}/login`}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#6441A4] px-3 text-[16px] font-bold text-white transition hover:bg-[#563396] sm:h-[56px] sm:w-[280px] sm:text-[20px]"
            >
              {dict.getStarted}
            </Link>
            <Link
              href={`/${locale}/get-started`}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#EEE8F8] px-3 text-[16px] font-bold text-[#30214F] transition hover:bg-[#e2d8f2] sm:h-[56px] sm:w-[280px] sm:text-[20px]"
            >
              {dict.howItWorks}
            </Link>
          </div>

          {/* Islands Thumbnails — 3 equal columns on mobile, row from sm up */}
          <div id="islands" className="mt-2 grid grid-cols-3 gap-2 scroll-mt-32 sm:mt-4 sm:flex sm:gap-3">
            {dict.islands.map((island) => (
              <div
                data-reveal
                key={island}
                className="flex min-w-0 flex-col items-center gap-2 sm:w-[160px]"
              >
                {/* استبدل الـ placeholder بصورة المصغرة لما تضيفها في public/explorer-kidz/ */}
                <div className="flex h-[70px] w-full items-center justify-center rounded-xl border border-[#EEE8F8] bg-[#FAF8FF] sm:h-[90px]">
                  <span className="text-xl sm:text-2xl" aria-hidden="true">
                    🏝️
                  </span>
                </div>
                <p className="text-center text-[11px] font-bold text-[#3D2663] sm:text-[14px]">
                  {island}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div data-reveal className="relative z-0 w-full lg:w-[749px]">
          {/* لما تضيف public/explorer-kidz/hero.png، استبدل الـ div ده بـ:
              <Image src="/explorer-kidz/hero.png" alt={dict.heroAlt} fill className="object-cover" priority /> */}
          <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-[#EEE8F8] to-[#FAF8FF] shadow-lg">
            <span className="px-4 text-center text-sm font-bold text-[#563396] sm:text-base">
              صورة البطل (Hero Image) مكانها هنا
            </span>
          </div>
        </div>

        <Footer text={dict.footer} />
      </ScrollReveal>
    </div>
  );
}
