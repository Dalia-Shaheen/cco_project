import type { Locale } from "./i18n";

/** Home page copy — centralised so the page component stays presentational. */
export const explorerContent = {
  en: {
    eyebrow: "A little curiosity",
    // Three display lines: the first two lead, the third carries the accent
    // colour + the hand-drawn underline.
    titleTop: "Turn",
    titleMid: "learning into",
    titleHighlight: "fun!",
    subtitle:
      "Let every journey begin. Personalised play for children with Autism, Down Syndrome and ADHD.",
    getStarted: "Get Started",
    howItWorks: "How It Works",
    islands: ["ADHD", "Autism", "Down syndrome"],
    stat: {
      value: "3",
      label: "learning islands",
      note: "Designed with specialists",
    },
    mockup: {
      pick: "Pick your island",
      hint: "One small step at a time.",
      cta: "Start now",
    },
    mockupAlt: "Preview of a Lobly island screen with tilted cards",
    footer: "Learn at your own pace. Parents manage settings and purchases.",
    steps: {
      title: "How it works",
      subtitle: "Little steps. Lovely discoveries. All at your child’s pace.",
      items: [
        "Parent creates a profile",
        "Pick an island",
        "Play and learn at your own pace",
      ],
      cta: "Get Started",
    },
    help: {
      title: "A little help, whenever you need it",
      // The design swaps to a shorter title on phones.
      titleMobile: "Here to help",
      subtitle: "Simple answers for a more confident journey.",
      guide: {
        title: "Here for you, every step",
        subtitle: "Calm learning. A little reassurance.",
      },
      faqs: [
        {
          q: "Is Lobly safe for my child?",
          a: "A calm learning experience. We recommend that a grown-up reviews activities and stays nearby to support their child.",
        },
        {
          q: "Who is it designed for?",
          a: "Lobly is made for children with Autism, Down syndrome and ADHD, and for the grown-ups who support them.",
        },
        {
          q: "How do I manage settings and purchases?",
          a: "Everything lives in the Parent Dashboard, behind your account — screen time, sound and purchases included.",
        },
        {
          q: "Can my child use it alone?",
          a: "Yes. Sessions are built to be explored independently, and you can set a time limit so play always ends gently.",
        },
        {
          q: "How do I contact you?",
          a: "Email us and we’ll get back to you within a day.",
        },
      ],
      contact: {
        title: "Still have a question?",
        subtitle: "Contact us. We’re happy to help.",
        cta: "Email us",
      },
    },
  },
  ar: {
    eyebrow: "قليل من الفضول",
    titleTop: "حوّل",
    titleMid: "التعلّم إلى",
    titleHighlight: "متعة",
    subtitle:
      "رحلة آمنة وممتعة للأطفال ذوي التوحد ومتلازمة داون وفرط الحركة وتشتت الانتباه. تعلّم والعب بإيقاع طفلك.",
    getStarted: "ابدأ الرحلة",
    howItWorks: "كيف تعمل",
    islands: ["فرط الحركة", "التوحد", "متلازمة داون"],
    stat: {
      value: "٣",
      label: "جزر تعليمية",
      note: "مصممة مع مختصين",
    },
    mockup: {
      pick: "اختار جزيرتك",
      hint: "خطوة صغيرة كل مرة.",
      cta: "ابدأ الآن",
    },
    mockupAlt: "معاينة شاشة الجزر في Lobly بكروت مايلة",
    footer: "تعلّم بإيقاعك الخاص. يمكن للوالدين إدارة الإعدادات والمشتريات.",
    steps: {
      title: "كيف تعمل",
      subtitle: "خطوات صغيرة. اكتشافات جميلة. كله بإيقاع طفلك.",
      items: [
        "الوالد ينشئ ملفًا",
        "اختر جزيرة",
        "العب وتعلّم بإيقاعك",
      ],
      cta: "ابدأ الرحلة",
    },
    help: {
      title: "مساعدة صغيرة، وقت ما تحتاجها",
      titleMobile: "إحنا هنا للمساعدة",
      subtitle: "إجابات بسيطة لرحلة أكثر ثقة.",
      guide: {
        title: "معاك في كل خطوة",
        subtitle: "تعلّم هادي. وطمأنينة صغيرة.",
      },
      faqs: [
        {
          q: "هل Lobly آمنة لطفلي؟",
          a: "تجربة تعلّم هادية. بننصح إن شخص بالغ يراجع الأنشطة ويفضل قريب لدعم طفله.",
        },
        {
          q: "لمين معمولة؟",
          a: "Lobly معمولة للأطفال ذوي التوحد ومتلازمة داون وفرط الحركة وتشتت الانتباه، وللأهل اللي بيدعموهم.",
        },
        {
          q: "إزاي أدير الإعدادات والمشتريات؟",
          a: "كل حاجة موجودة في لوحة الوالدين، محمية بحسابك — وقت الشاشة والصوت والمشتريات.",
        },
        {
          q: "ينفع طفلي يستخدمها لوحده؟",
          a: "أيوه. الجلسات معمولة عشان الطفل يستكشفها بنفسه، وتقدر تحدد وقت للجلسة عشان اللعب يخلص بهدوء.",
        },
        {
          q: "إزاي أتواصل معاكم؟",
          a: "ابعتلنا إيميل وهنرد عليك في خلال يوم.",
        },
      ],
      contact: {
        title: "لسه عندك سؤال؟",
        subtitle: "كلّمنا. بنسعد بمساعدتك.",
        cta: "كلّمنا على الإيميل",
      },
    },
  },
} as const satisfies Record<Locale, unknown>;

export type ExplorerContent = (typeof explorerContent)["en"];
