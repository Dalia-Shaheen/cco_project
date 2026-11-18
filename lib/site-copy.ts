import type { Locale } from "./i18n";

export const siteCopy = {
  en: {
    nav: {
      home: "Home",
      howItWorks: "How it works",
      getStarted: "Get started",
      login: "Parent login",
    },
    home: {
      eyebrow: "LEARN THROUGH PLAY",
      title: ["Every lesson", "is an island adventure."],
      description:
        "Lobly turns learning into a journey. Parents choose the path, little explorers hop across stepping stones, watch stories and collect stars along the way.",
      primary: "Get started",
      secondary: "Parent login",
      footnote: "Made for curious kids and the parents who guide them.",
      features: [
        { title: "A guided path", text: "Stepping stones lead your child from one discovery to the next." },
        { title: "Stories & videos", text: "Short, joyful activities that unlock step by step." },
        { title: "Stars to celebrate", text: "Every finished story earns a star and a little more confidence." },
      ],
    },
    getStarted: {
      eyebrow: "HOW IT WORKS",
      title: "Three small steps to a big adventure",
      description: "Set things up once, then let your child explore at their own pace.",
      steps: [
        { title: "Create your parent account", text: "Sign in with your email and a password you choose." },
        { title: "Add your little explorer", text: "Pick their name and the path that fits them best." },
        { title: "Follow the stepping stones", text: "Send them across the map into their learning island." },
      ],
      cta: "Go to parent login",
    },
    login: {
      eyebrow: "PARENT AREA",
      title: "Welcome back",
      description: "Sign in to see your children and their progress.",
      email: "Email address",
      password: "Password",
      submit: "Sign in",
      hint: "New here? Create a parent account to get started.",
      note: "The form is a placeholder — connect it to NextAuth credentials when you wire the auth route.",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      howItWorks: "كيف يعمل",
      getStarted: "ابدأ الآن",
      login: "دخول الأهالي",
    },
    home: {
      eyebrow: "تعلّم من خلال اللعب",
      title: ["كل درس", "هو مغامرة في جزيرة."],
      description:
        "لوبلي بيحوّل التعلّم إلى رحلة. الأهالي يختارون المسار، والمستكشفون الصغار يعبرون الأحجار ويشاهدون القصص ويجمعون النجوم في الطريق.",
      primary: "ابدأ الآن",
      secondary: "دخول الأهالي",
      footnote: "صُنع للأطفال الفضوليين وللأهالي اللي بيوجهوهم.",
      features: [
        { title: "مسار واضح", text: "أحجار الخطوات توصل طفلك من اكتشاف للتالي." },
        { title: "قصص وفيديوهات", text: "أنشطة قصيرة وممتعة بتتنشّ خطوة بخطوة." },
        { title: "نجوم للاحتفال", text: "كل قصة تنتهي بنجمة وثقة أكبر." },
      ],
    },
    getStarted: {
      eyebrow: "كيف يعمل",
      title: "ثلاث خطوات صغيرة لمغامرة كبيرة",
      description: "جهّز كل حاجة مرة واحدة، وبعدين خلّي طفلك يستكشف بالسرعة اللي تناسبه.",
      steps: [
        { title: "اعمل حساب ولي أمر", text: "سجّل الدخول بالإيميل وكلمة سر تختارها." },
        { title: "أضف مستكشفك الصغير", text: "اكتب اسمه واختار المسار الأنسب له." },
        { title: "اتبع أحجار الخطوات", text: "ابعبره في الخريطة لجزيرة التعلّم بتاعته." },
      ],
      cta: "اذهب لدخول الأهالي",
    },
    login: {
      eyebrow: "منطقة الأهالي",
      title: "أهلًا بعودتك",
      description: "سجّل الدخول عشان تشوف أولادك وتقدّمهم.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      submit: "تسجيل الدخول",
      hint: "جديد هنا؟ اعمل حساب ولي أمر للبداية.",
      note: "النموذج placeholder — اربطه بـ NextAuth credentials لما تجهّز مسار الـ auth.",
    },
  },
} as const satisfies Record<Locale, unknown>;

export type SiteCopy = (typeof siteCopy)["en"];
