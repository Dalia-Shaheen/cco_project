import type { Locale } from "./i18n";

/** Home page copy — centralised so the page component stays presentational. */
export const explorerContent = {
  en: {
    eyebrow: "A LITTLE CURIOSITY. A WORLD OF POSSIBILITY.",
    title: "Explore the world made for your child.",
    subtitle:
      "Let every journey begin. Personalised play for children with Autism, Down Syndrome and ADHD.",
    getStarted: "Get Started",
    howItWorks: "How It Works",
    islands: ["ADHD", "Autism", "Down syndrome"],
    footer: "Learn at your own pace. Parents manage settings and purchases.",
    heroAlt: "A child exploring a playful island world",
  },
  ar: {
    eyebrow: "قليل من الفضول. عالم من الاحتمالات.",
    title: "عالم من التعلّم، مصمم لطفلك.",
    subtitle:
      "رحلة آمنة وممتعة للأطفال ذوي التوحد ومتلازمة داون وفرط الحركة وتشتت الانتباه. تعلّم والعب بإيقاع طفلك.",
    getStarted: "ابدأ الرحلة",
    howItWorks: "كيف تعمل",
    islands: ["فرط الحركة", "التوحد", "متلازمة داون"],
    footer: "تعلّم بإيقاعك الخاص. يمكن للوالدين إدارة الإعدادات والمشتريات.",
    heroAlt: "طفل يستكشف عالم جزر ممتع",
  },
} as const satisfies Record<Locale, unknown>;

export type ExplorerContent = (typeof explorerContent)["en"];
