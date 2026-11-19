"use client";

import RollingLettersMenu, {
  type RollingMenuItem,
} from "@/components/mfa/RollingLettersMenu";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import Navbar from "@/components/Navbar";

/**
 * Client shell that owns the kid-friendly fullscreen menu for the public site.
 * The navbar is intentionally minimal (identity + login + language); every page
 * link lives here. The panel covers the page while keeping it inert.
 */
export default function SiteMenuShell({
  locale,
  children,
}: {
  locale: "en" | "ar";
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const items: RollingMenuItem[] =
    locale === "en"
      ? [
          {
            label: "Home",
            href: `/${locale}`,
            color: "#6441A4",
            ink: "#FFFFFF",
            note: "Back to the start",
          },
          {
            label: "Islands",
            href: `/${locale}/#islands`,
            color: "#563396",
            ink: "#FFFFFF",
            note: "Pick your next adventure",
          },
          {
            label: "How It Works",
            href: `/${locale}/get-started`,
            color: "#7C5CBF",
            ink: "#FFFFFF",
            note: "Three small steps, one big journey",
          },
          {
            label: "Register",
            href: `/${locale}/register`,
            color: "#6441A4",
            ink: "#FFFFFF",
            note: "Start your adventure",
          },
          {
            label: "Help",
            href: `/${locale}/#help`,
            color: "#8F70C4",
            ink: "#FFFFFF",
            note: "We're here for you",
          },
        ]
      : [
          {
            label: "الرئيسية",
            href: `/${locale}`,
            color: "#6441A4",
            ink: "#FFFFFF",
            note: "الرجوع للبداية",
          },
          {
            label: "الجزر",
            href: `/${locale}/#islands`,
            color: "#563396",
            ink: "#FFFFFF",
            note: "اختار مغامرتك الجاية",
          },
          {
            label: "كيف تعمل",
            href: `/${locale}/get-started`,
            color: "#7C5CBF",
            ink: "#FFFFFF",
            note: "ثلاث خطوات صغيرة",
          },
          {
            label: "إنشاء حساب",
            href: `/${locale}/register`,
            color: "#6441A4",
            ink: "#FFFFFF",
            note: "ابدأ المغامرة لطفلك",
          },
          {
            label: "المساعدة",
            href: `/${locale}/#help`,
            color: "#8F70C4",
            ink: "#FFFFFF",
            note: "إحنا هنا عشانك",
          },
        ];

  // Keep in-app navigation client-side instead of a full page reload.
  const handleNavigate = (
    item: RollingMenuItem,
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (item.href.startsWith("/")) {
      event.preventDefault();
      router.push(item.href);
    }
  };

  // Only real pages can be "current": the in-page anchors (#islands, #help) are
  // the same page as Home, so marking them would light up two items at once.
  const activeHref = items.find((item) => {
    if (item.href.includes("#")) return false;
    return item.href === `/${locale}`
      ? pathname === item.href
      : pathname.startsWith(item.href);
  })?.href;

  return (
    <RollingLettersMenu
      fixed
      dir={dir}
      items={items}
      activeHref={activeHref}
      background="#FAF8FF"
      ink="#6441A4"
      brand={
        // The wordmark stays "Lobly" in Poppins, pinned top-left, on both
        // locales — it should look identical to the English menu.
        <span
          dir="ltr"
          style={{
            fontFamily:
              "var(--poppins), var(--cairo), ui-sans-serif, system-ui, sans-serif",
          }}
          className="block w-full text-left text-[clamp(18px,2.4cqw,28px)] font-extrabold tracking-tight"
        >
          Lobly
        </span>
      }
      triggerColor="#6441A4"
      triggerInk="#FFFFFF"
      triggerLabels={
        locale === "en"
          ? { open: "Menu", close: "Close" }
          : { open: "القائمة", close: "إغلاق" }
      }
      // The navbar owns the trigger and must stay above the panel, so it renders
      // outside the inert page wrapper.
      header={<Navbar locale={locale} />}
      onNavigate={handleNavigate}
    >
      <main className="relative mx-auto w-full max-w-[1440px] flex-1 pt-28">
        {children}
      </main>
    </RollingLettersMenu>
  );
}
