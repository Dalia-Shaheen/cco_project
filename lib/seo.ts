import type { Metadata } from "next";
import { locales, type Locale } from "./i18n";

/** Set NEXT_PUBLIC_SITE_URL in .env before deploying. */
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_URL = configuredUrl.replace(/\/+$/, "");

export const siteConfig = {
  name: "Lobly",
  title: {
    en: "Lobly — Playful learning journeys for kids",
    ar: "لوبلي — رحلات تعلّم ممتعة للأطفال",
  },
  description: {
    en: "Lobly turns every lesson into an island adventure. Parents set the path, kids hop across stepping stones, watch stories, and earn stars as they learn.",
    ar: "لوبلي يحوّل كل درس إلى مغامرة في عالم الجزر. يختار الأهالي المسار، ويعبر الأطفال الأحجار، ويشاهدون القصص، ويجمعون النجوم أثناء التعلّم.",
  },
  ogLocale: { en: "en_US", ar: "ar_EG" } as const,
  themeColor: "#6441A4",
  backgroundColor: "#FAF8FF",
} as const;

/** Always absolute — required by Open Graph, sitemap and robots. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

/** Builds `/en/get-started` from locale + a path relative to the locale. */
export function localizePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

export type PageSeo = {
  locale: Locale;
  /** Path after the locale segment, e.g. "/get-started". */
  path?: string;
  title?: string;
  description?: string;
  index?: boolean;
};

/** Use in each page: `export const generateMetadata = (...) => buildMetadata(...)`. */
export function buildMetadata({
  locale,
  path = "/",
  title,
  description,
  index = true,
}: PageSeo): Metadata {
  const canonicalPath = localizePath(locale, path);
  const canonicalUrl = absoluteUrl(canonicalPath);
  const pageTitle = title ?? siteConfig.title[locale];
  const pageDescription = description ?? siteConfig.description[locale];
  const image = {
    url: absoluteUrl(`/${locale}/opengraph-image`),
    width: 1200,
    height: 630,
    alt: siteConfig.name,
  };

  const languages = Object.fromEntries(
    locales.map((l) => [l, absoluteUrl(localizePath(l, path))]),
  );
  languages["x-default"] = absoluteUrl(localizePath("en", path));

  return {
    metadataBase: new URL(SITE_URL),
    title: pageTitle,
    description: pageDescription,
    applicationName: siteConfig.name,
    category: "education",
    alternates: { canonical: canonicalUrl, languages },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
      locale: siteConfig.ogLocale[locale],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [image.url],
    },
    robots: index
      ? { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
      : { index: false, follow: false },
    formatDetection: { telephone: false },
  };
}

/** JSON-LD graph injected once in the root layout. */
export function buildStructuredData(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#organization`,
        name: siteConfig.name,
        url: SITE_URL,
        description: siteConfig.description[locale],
        inLanguage: locale,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: siteConfig.name,
        description: siteConfig.description[locale],
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
