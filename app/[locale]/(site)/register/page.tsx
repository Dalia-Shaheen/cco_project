import RegisterExperience from "@/components/explorer-kidz/RegisterExperience";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { siteCopy } from "@/lib/site-copy";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type RegisterProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: RegisterProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale)
    ? buildMetadata({ locale, path: "/register", index: false })
    : {};
}

export default async function RegisterPage({ params }: RegisterProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = siteCopy[locale].register;
  const loginUrl = `/${locale}/login`;

  return (
    <main className="w-full">
      <RegisterExperience key={locale} locale={locale} t={t} loginUrl={loginUrl} />
    </main>
  );
}
