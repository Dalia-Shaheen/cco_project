"use client";

import {
  coverScreen,
  isLocaleTransitionActive,
  revealScreen,
} from "@/lib/locale-transition";
import { useRollingMenu } from "@/components/mfa/RollingLettersMenu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type MouseEvent } from "react";

/**
 * The site's only navbar: identity + account action + language, plus the
 * trigger for the fullscreen menu. It lives inside the menu's provider, so the
 * trigger can sit here (in the nav) instead of floating on top of it.
 */
export default function Navbar({ locale }: { locale: "en" | "ar" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { open, toggle, registerTrigger } = useRollingMenu();
  const fontClass = locale === "ar" ? "font-cairo" : "font-poppins";

  // Toggle between English and Arabic URLs
  const toggleLocale = locale === "en" ? "ar" : "en";
  const switchUrl = pathname.replace(`/${locale}`, `/${toggleLocale}`);

  // The locale switch remounts this navbar, but the transition state lives in
  // a module — so the new instance reveals the screen once its route commits.
  useEffect(() => {
    if (isLocaleTransitionActive()) revealScreen();
  }, [pathname]);

  const handleLocaleSwitch =
    (targetLocale: "en" | "ar") => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (targetLocale === locale) return;
      coverScreen(
        () => router.push(switchUrl),
        toggleLocale === "ar" ? "rtl" : "ltr",
      );
    };

  return (
    <nav
      dir="ltr"
      className={`absolute top-[12px] left-1/2 z-[110] flex h-[68px] w-[min(1392px,calc(100%-1.5rem))] -translate-x-1/2 flex-row items-center gap-1 rounded-2xl px-2.5 transition-colors sm:top-[16px] sm:h-[80px] sm:w-[min(1392px,calc(100%-2rem))] sm:gap-4 sm:px-6 ${
        open ? "pointer-events-none bg-transparent" : "bg-white"
      }`}
    >
      {/* Brand: Lobly */}
      <Link
        href={`/${locale}`}
        dir="ltr"
        style={{
          fontFamily:
            "var(--poppins), var(--cairo), ui-sans-serif, system-ui, sans-serif",
        }}
        className={`flex-none text-[18px] leading-[26px] font-bold text-[#563396] transition-opacity sm:text-[24px] sm:leading-[35px] lg:text-[28px] ${
          open ? "invisible" : ""
        }`}
      >
        Lobly
      </Link>

      {/* Spacer pushes the actions to the end on every screen */}
      <div className="flex-1" />

      {/* Right-hand group: language + login + the menu trigger itself. When the
          panel is open the first two step aside so only the trigger stays. */}
      <div className="ms-auto flex flex-none items-center gap-1 sm:gap-4">
        {/* Language: one compact toggle on phones, the full EN/عربي switch above `sm`. */}
        <Link
          href={switchUrl}
          onClick={handleLocaleSwitch(toggleLocale)}
          aria-label={
            locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"
          }
          className={`flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-[#EEE8F8] text-[15px] font-bold text-[#563396] outline-offset-2 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-[#6441A4] sm:hidden ${
            open ? "invisible" : ""
          } ${toggleLocale === "ar" ? "font-cairo" : "font-poppins"}`}
        >
          {toggleLocale === "ar" ? "ع" : "EN"}
        </Link>

        {/* Language Switcher (EN / عربي) — h-14 + p-1 so the 48px pills are not clipped */}
        <div
          className={`hidden h-14 w-[168px] flex-none flex-row items-center overflow-hidden rounded-2xl bg-[#EEE8F8] p-1 sm:flex ${
            open ? "invisible" : ""
          }`}
        >
          <Link
            href={locale === "en" ? "#" : switchUrl}
            onClick={handleLocaleSwitch("en")}
            aria-current={locale === "en" ? "true" : undefined}
            className={`flex h-12 w-[84px] flex-row items-center justify-center rounded-2xl px-4 text-center ${fontClass} text-[20px] font-bold outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#6441A4] ${
              locale === "en"
                ? "bg-[#6441A4] text-white"
                : "bg-transparent text-[#30214F] transition-colors hover:bg-white/50"
            }`}
          >
            EN
          </Link>
          <Link
            href={locale === "ar" ? "#" : switchUrl}
            onClick={handleLocaleSwitch("ar")}
            aria-current={locale === "ar" ? "true" : undefined}
            className={`flex h-12 w-[84px] flex-row items-center justify-center rounded-2xl px-4 text-center font-cairo text-[20px] font-bold outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#6441A4] ${
              locale === "ar"
                ? "bg-[#6441A4] text-white"
                : "bg-transparent text-[#30214F] transition-colors hover:bg-white/50"
            }`}
          >
            عربي
          </Link>
        </div>

        {/* Login Button — the primary CTA */}
        <Link
          href={`/${locale}/login`}
          className={`flex h-12 w-[64px] flex-none flex-row items-center justify-center rounded-2xl bg-[#6441A4] px-1 text-center ${fontClass} text-[16px] font-bold text-white outline-offset-2 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[#6441A4] sm:w-[112px] sm:px-4 sm:text-[20px] ${
            open ? "invisible" : ""
          }`}
        >
          {locale === "en" ? "Login" : "دخول"}
        </Link>

        {/* The menu trigger lives here, inside the bar. Secondary by design so
            Login stays the only primary CTA. `pointer-events-auto` keeps it
            clickable while the nav is transparent above the panel. */}
        <button
          ref={registerTrigger}
          type="button"
          aria-expanded={open}
          aria-label={
            open
              ? locale === "en"
                ? "Close"
                : "إغلاق"
              : locale === "en"
                ? "Menu"
                : "القائمة"
          }
          onClick={toggle}
          className={`pointer-events-auto flex h-12 w-[84px] flex-none cursor-pointer select-none items-center justify-center gap-1 rounded-2xl bg-[#EEE8F8] px-1.5 text-[16px] font-bold text-[#563396] outline-offset-2 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-[#6441A4] sm:w-[112px] sm:gap-1.5 sm:px-3 sm:text-[20px] ${fontClass}`}
        >
          <span aria-hidden className="flex h-3 w-3.5 flex-col justify-between sm:h-3.5 sm:w-4">
            <span
              className={`h-[2px] w-full rounded-full bg-[#563396] transition-transform ${
                open ? "translate-y-[5px] rotate-45 sm:translate-y-[6px]" : ""
              }`}
            />
            <span
              className={`h-[2px] w-full rounded-full bg-[#563396] transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-[2px] w-full rounded-full bg-[#563396] transition-transform ${
                open ? "-translate-y-[5px] -rotate-45 sm:-translate-y-[6px]" : ""
              }`}
            />
          </span>
          <span>
            {open
              ? locale === "en"
                ? "Close"
                : "إغلاق"
              : locale === "en"
                ? "Menu"
                : "القائمة"}
          </span>
        </button>
      </div>
    </nav>
  );
}
