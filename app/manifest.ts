import { siteConfig } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Playful learning journeys for kids`,
    short_name: siteConfig.name,
    description: siteConfig.description.en,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: siteConfig.backgroundColor,
    theme_color: siteConfig.themeColor,
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
