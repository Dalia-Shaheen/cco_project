import SiteMenuShell from "@/components/explorer-kidz/SiteMenuShell";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  return <SiteMenuShell locale={rawLocale}>{children}</SiteMenuShell>;
}
