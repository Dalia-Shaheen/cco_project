import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { siteCopy } from "@/lib/site-copy";
import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type GetStartedProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: GetStartedProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? buildMetadata({ locale, path: "/get-started" })
    : {};
}

export default async function GetStartedPage({ params }: GetStartedProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = siteCopy[locale].getStarted;

  return (
    <main className="px-4 pb-24 pt-16 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-[900px] text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8F70C4]">
          {t.eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-5xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#625575]">
          {t.description}
        </p>
      </div>

      <ol
        id="how-it-works"
        className="mx-auto mt-14 grid max-w-[1000px] gap-5 sm:grid-cols-3"
      >
        {t.steps.map((step, index) => (
          <li key={step.title} className="relative rounded-2xl bg-card p-6 shadow-card">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#6441A4] text-sm font-extrabold text-white">
              {index + 1}
            </span>
            <h2 className="mt-5 text-lg font-bold text-ink">{step.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#625575]">{step.text}</p>
            {index < t.steps.length - 1 && (
              <ArrowRight
                className="absolute -right-4 top-10 hidden size-6 text-[#B9A2DC] sm:block"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-14 max-w-[600px] rounded-2xl bg-[#EEE8F8] p-8 text-center shadow-card">
        <Check className="mx-auto size-8 text-[#6441A4]" aria-hidden="true" />
        <Link
          href={`/${locale}/login`}
          className="mt-5 inline-flex min-h-12 items-center rounded-2xl bg-[#6441A4] px-7 text-sm font-bold text-white shadow-card transition hover:bg-[#563396]"
        >
          {t.cta}
        </Link>
      </div>
    </main>
  );
}
