import "@/styles/globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { isLocale, locales } from "@/lib/i18n";
import { buildMetadata, buildStructuredData } from "@/lib/seo";
import type { Metadata } from "next";
import { Cairo, Poppins } from "next/font/google";
import { notFound } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--cairo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** Required because `cacheComponents: true` needs root dynamic params prerendered. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildMetadata({ locale, path: "/" }) : {};
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${poppins.variable} ${cairo.variable}`}
    >
      {/* Inline style wins over the unlayered body rule in globals.css, so the
          locale font applies immediately without waiting for a CSS rebuild. */}
      <body
        className={locale === "ar" ? "font-cairo" : "font-poppins"}
        style={{
          fontFamily:
            locale === "ar"
              ? "var(--cairo), ui-sans-serif, system-ui, sans-serif"
              : "var(--poppins), var(--cairo), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {children}
        <JsonLd data={buildStructuredData(locale)} />
      </body>
    </html>
  );
}
