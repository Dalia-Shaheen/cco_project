import RegisterExperience from "@/components/explorer-kidz/RegisterExperience";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { siteCopy } from "@/lib/site-copy";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type LoginProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LoginProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildMetadata({ locale, path: "/login", index: false }) : {};
}

export default async function LoginPage({ params }: LoginProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const registerCopy = siteCopy[locale].register;
  const loginUrl = `/${locale}/login`;

  return (
    <main className="w-full">
      <RegisterExperience
        key={locale}
        locale={locale}
        t={registerCopy}
        loginUrl={loginUrl}
        initialMode="login"
      />
    </main>
  );
}
