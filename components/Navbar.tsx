"use client";

import {
  coverScreen,
  isLocaleTransitionActive,
  revealScreen,
} from "@/lib/locale-transition";
import { useRollingMenu } from "@/components/mfa/RollingLettersMenu";
import FlairHover from "@/components/ui/FlairHover";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";

/**
 * The site's only navbar: identity + account action + language, plus the
 * trigger for the fullscreen menu. It lives inside the menu's provider, so the
 * trigger can sit here (in the nav) instead of floating on top of it.
 */
export default function Navbar({ locale }: { locale: "en" | "ar" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { open, panelVisible, toggle, registerTrigger } = useRollingMenu();
  const fontClass = locale === "ar" ? "font-cairo" : "font-poppins";
  // The panel keeps `panelVisible` true until its closing circle has collapsed.
  // Hiding the bar's own content for that whole window keeps a white bar and the
  // wordmark from popping in over the panel on the way out.
  const covered = panelVisible;
  // …and when the circle is finally gone, the content fades back instead of
  // snapping in — the snap is what felt wrong on phones.
  const chromeFade = covered
    ? "pointer-events-none opacity-0"
    : "opacity-100";

  // The bar is fixed, so it floats over content once the page scrolls. A soft
  // shadow is what keeps it readable there; at the very top it stays flat, as
  // designed.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={`fixed top-[12px] left-1/2 z-[110] flex h-[68px] w-[min(1392px,calc(100%-1.5rem))] -translate-x-1/2 flex-row items-center gap-2 rounded-[34px] px-2.5 transition-[background-color,box-shadow] duration-300 max-[359px]:gap-1 max-[359px]:px-2 sm:top-[16px] sm:h-[80px] sm:w-[min(1392px,calc(100%-2rem))] sm:gap-4 sm:rounded-[40px] sm:px-6 ${
        covered
          ? "pointer-events-none bg-transparent"
          : scrolled
            ? "bg-white shadow-[0_10px_30px_-18px_rgba(48,33,79,0.28)]"
            : "bg-white"
      }`}
    >
      {/* Brand: Lobly */}
      <Link
        href={`/${locale}`}
        dir="ltr"
        inert={covered}
        style={{
          fontFamily:
            "var(--poppins), var(--cairo), ui-sans-serif, system-ui, sans-serif",
        }}
        className={`flex-none text-[18px] leading-[26px] font-bold text-[#563396] transition-opacity duration-300 ease-out sm:text-[24px] sm:leading-[35px] lg:text-[28px] ${chromeFade}`}
      >
        Lobly
      </Link>

      {/* Spacer pushes the actions to the end on every screen */}
      <div className="flex-1" />

      {/* Right-hand group: language + login + the menu trigger itself. When the
          panel is open the first two step aside so only the trigger stays. */}
      <div className="ms-auto flex flex-none items-center gap-2 max-[359px]:gap-1 sm:gap-4">
        {/* Language: one compact toggle on phones (the full word, not a letter),
            the full EN/عربي switch above `sm`. */}
        <Link
          href={switchUrl}
          onClick={handleLocaleSwitch(toggleLocale)}
          inert={covered}
          aria-label={
            locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"
          }
          className={`relative flex h-12 min-w-[52px] flex-none items-center justify-center rounded-full bg-[#EEE8F8] px-1.5 text-[15px] font-bold text-[#30214F] outline-offset-2 transition-[opacity,background-color] duration-300 ease-out motion-reduce:hover:bg-white focus-visible:outline-2 focus-visible:outline-[#6441A4] max-[359px]:min-w-[46px] max-[359px]:px-1 sm:hidden ${chromeFade} ${locale === "en" ? "font-cairo" : "font-poppins"}`}
        >
          <FlairHover color="#FFFFFF" />
          <span className="relative">{locale === "en" ? "عربي" : "EN"}</span>
        </Link>

        {/* Language Switcher (EN / عربي) — h-14 + p-1 so the 48px pills are not clipped */}
        <div
          inert={covered}
          className={`hidden h-14 w-[168px] flex-none flex-row items-center overflow-hidden rounded-full bg-[#EEE8F8] p-1 transition-opacity duration-300 ease-out sm:flex ${chromeFade}`}
        >
          <Link
            href={locale === "en" ? "#" : switchUrl}
            onClick={handleLocaleSwitch("en")}
            aria-current={locale === "en" ? "true" : undefined}
            className={`relative flex h-12 w-[84px] flex-row items-center justify-center rounded-full px-4 text-center ${fontClass} text-[20px] font-bold outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#6441A4] ${
              locale === "en"
                ? "bg-[#6441A4] text-white"
                : "bg-transparent text-[#30214F] transition-colors motion-reduce:hover:bg-white/50"
            }`}
          >
            {locale !== "en" && <FlairHover color="#FFFFFF" />}
            <span className="relative">EN</span>
          </Link>
          <Link
            href={locale === "ar" ? "#" : switchUrl}
            onClick={handleLocaleSwitch("ar")}
            aria-current={locale === "ar" ? "true" : undefined}
            className={`relative flex h-12 w-[84px] flex-row items-center justify-center rounded-full px-4 text-center font-cairo text-[20px] font-bold outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#6441A4] ${
              locale === "ar"
                ? "bg-[#6441A4] text-white"
                : "bg-transparent text-[#30214F] transition-colors motion-reduce:hover:bg-white/50"
            }`}
          >
            {locale !== "ar" && <FlairHover color="#FFFFFF" />}
            <span className="relative">عربي</span>
          </Link>
        </div>

        {/* Login Button — the primary CTA. Same width as the menu trigger so
            the two read as one row instead of the menu out-weighing Login. */}
        <Link
          href={`/${locale}/login`}
          inert={covered}
          className={`group relative flex h-12 min-w-[84px] flex-none flex-row items-center justify-center rounded-full bg-[#6441A4] px-3 text-center ${fontClass} text-[16px] font-bold text-white outline-offset-2 transition-opacity duration-300 ease-out motion-reduce:hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[#6441A4] max-[359px]:min-w-[64px] max-[359px]:px-2 sm:min-w-[112px] sm:px-4 sm:text-[20px] ${chromeFade}`}
        >
          <FlairHover color="#FFFFFF" />
          <span className="relative transition-colors duration-75 motion-safe:group-hover:text-[#563396] motion-safe:group-hover:delay-100">
            {locale === "en" ? "Login" : "دخول"}
          </span>
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
          className={`pointer-events-auto relative flex h-12 min-w-[84px] flex-none cursor-pointer select-none items-center justify-center gap-1 rounded-full bg-[#EEE8F8] px-2 text-[16px] font-bold text-[#563396] outline-offset-2 transition-colors motion-reduce:hover:bg-white focus-visible:outline-2 focus-visible:outline-[#6441A4] sm:min-w-[112px] sm:gap-1.5 sm:px-3 sm:text-[20px] ${fontClass} ${

            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <FlairHover color="#FFFFFF" />
          <span aria-hidden className="relative flex h-3 w-3.5 flex-col justify-between sm:h-3.5 sm:w-4">
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
          <span className="relative">
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
