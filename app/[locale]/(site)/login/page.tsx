import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { siteCopy } from "@/lib/site-copy";
import FlairHover from "@/components/ui/FlairHover";
import { LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type LoginProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LoginProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildMetadata({ locale, path: "/login", index: false }) : {};
}

export default async function LoginPage({ params }: LoginProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = siteCopy[locale].login;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6">
      <section className="w-full max-w-md rounded-2xl bg-card p-8 shadow-card">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#EEE8F8] text-[#6441A4]">
          <LockKeyhole className="size-6" aria-hidden="true" />
        </span>

        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-[#8F70C4]">
          {t.eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink">{t.title}</h1>
        <p className="mt-2 text-sm leading-7 text-[#625575]">{t.description}</p>

        <form className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-[#30214F]"
            >
              {t.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="mt-2 h-12 w-full rounded-2xl border border-[#6441A4]/20 bg-[#FAF8FF] px-4 text-sm text-ink outline-none transition focus:border-[#6441A4] focus:ring-2 focus:ring-[#6441A4]/20"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-[#30214F]"
            >
              {t.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-2 h-12 w-full rounded-2xl border border-[#6441A4]/20 bg-[#FAF8FF] px-4 text-sm text-ink outline-none transition focus:border-[#6441A4] focus:ring-2 focus:ring-[#6441A4]/20"
            />
          </div>
          <button
            type="button"
            className="group relative h-12 w-full cursor-pointer rounded-2xl bg-[#6441A4] text-sm font-bold text-white shadow-card outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#6441A4] motion-reduce:hover:bg-[#563396]"
          >
            <FlairHover color="#FFFFFF" />
            <span className="relative transition-colors duration-75 motion-safe:group-hover:text-[#563396] motion-safe:group-hover:delay-100">
              {t.submit}
            </span>
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#625575]">{t.hint}</p>
        <Link
          href={`/${locale}/get-started`}
          className="mt-2 block text-center text-sm font-bold text-[#6441A4] hover:underline"
        >
          {siteCopy[locale].nav.getStarted}
        </Link>
        <p className="mt-6 rounded-2xl bg-[#FAF8FF] p-3 text-center text-[11px] leading-5 text-[#8F70C4]">
          {t.note}
        </p>
      </section>
    </main>
  );
}
