import { isLocale } from "@/lib/i18n";
import { locale as getLocale } from "next/root-params";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

/**
 * This route never renders UI, so there is no "instant" state to validate and
 * `notFound()` would otherwise fail the dev-time check.
 */
export const instant = false;

/**
 * Catches every path under a valid locale that no real route claims, so the
 * localized `not-found.tsx` is what visitors see instead of Next's default
 * screen. It renders nothing itself: `notFound()` hands over to the boundary,
 * which also keeps the response marked `noindex`.
 *
 * Real routes always win over a catch-all, so this never shadows a page.
 */
export default async function CatchAll() {
  notFound();
}

export async function generateMetadata(): Promise<Metadata> {
  const value = await getLocale();
  return {
    title:
      isLocale(value) && value === "ar"
        ? "الصفحة غير موجودة · Lobly"
        : "Page not found · Lobly",
    // The locale layout advertises `index, follow` for the home page; a 404 must
    // override it rather than sit next to a conflicting tag.
    robots: { index: false, follow: false },
  };
}
