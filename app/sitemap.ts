import { locales } from "@/lib/i18n";
import { absoluteUrl, localizePath } from "@/lib/seo";
import type { MetadataRoute } from "next";

/** Public pages only — dashboards and the child journey stay private. */
const PUBLIC_PATHS = ["/", "/get-started", "/login"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    PUBLIC_PATHS.map((path) => ({
      url: absoluteUrl(localizePath(locale, path)),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : path === "/get-started" ? 0.8 : 0.3,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, absoluteUrl(localizePath(l, path))]),
        ),
      },
    })),
  );
}
