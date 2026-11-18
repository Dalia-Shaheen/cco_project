import { isLocale } from "@/lib/i18n";
import { ImageResponse } from "next/og";

export const alt = "Lobly — playful learning journeys for kids";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const code = isLocale(locale) && locale === "ar" ? "AR" : "EN";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF8FF",
          color: "#30214F",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 132,
            height: 132,
            borderRadius: 40,
            backgroundColor: "#6441A4",
            color: "#FAF8FF",
            fontSize: 76,
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          L
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          Lobly
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 30,
            color: "#625575",
          }}
        >
          Playful learning journeys for kids
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            paddingLeft: 22,
            paddingRight: 22,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 999,
            backgroundColor: "#EEE8F8",
            color: "#563396",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          {code} · Learn · Play · Grow
        </div>
      </div>
    ),
    size,
  );
}
