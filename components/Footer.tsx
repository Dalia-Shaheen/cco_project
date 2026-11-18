import Link from "next/link";

/**
 * The site footer. It closes the page on the same lavender the islands sit on,
 * as one rounded card. The menu's "Help" link points at the help section above,
 * not here — this is just the end of the page.
 */
export default function Footer({
  locale,
  text,
}: {
  locale: "en" | "ar";
  text: string;
}) {
  const rtl = locale === "ar";

  // Labels live here rather than in `content.ts` because they are navigation,
  // not page copy — same reason `SiteMenuShell` keeps its menu items local.
  const labels =
    locale === "en"
      ? {
          explore: "Explore",
          start: "Start",
          home: "Home",
          islands: "Islands",
          how: "How it works",
          getStarted: "Get started",
          login: "Log in",
          rights: "All rights reserved.",
          top: "Back to top",
        }
      : {
          explore: "استكشف",
          start: "ابدأ",
          home: "الرئيسية",
          islands: "الجزر",
          how: "كيف تعمل",
          getStarted: "ابدأ الآن",
          login: "تسجيل الدخول",
          rights: "جميع الحقوق محفوظة.",
          top: "للأعلى",
        };

  const groups = [
    {
      title: labels.explore,
      links: [
        { label: labels.home, href: `/${locale}` },
        { label: labels.islands, href: `/${locale}/#islands` },
        { label: labels.how, href: `/${locale}/get-started` },
      ],
    },
    {
      title: labels.start,
      links: [
        { label: labels.getStarted, href: `/${locale}/get-started` },
        { label: labels.login, href: `/${locale}/login` },
      ],
    },
  ];

  return (
    /* The help section above is its own lavender card with the same radius, so
       this gap is all that separates the two cards — keep it, or their corners
       merge into one block. */
    <footer
      id="footer"
      className="relative w-full scroll-mt-32 px-4 pt-6 pb-6 sm:px-6 sm:pt-8 sm:pb-8"
    >
      <div className="relative mx-auto w-full max-w-[1392px] overflow-hidden rounded-[32px] bg-[#EEE8F8] px-6 py-10 sm:rounded-[40px] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        {/* A single soft puff so the card has depth without a gradient band. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -end-24 -top-28 h-72 w-72 rounded-full bg-[#8F70C4]/20 blur-3xl"
        />

        <div className="relative grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          {/* ===== Brand ===== */}
          <div className="max-w-[42ch]">
            <p
              dir="ltr"
              style={{
                fontFamily:
                  "var(--poppins), var(--cairo), ui-sans-serif, system-ui, sans-serif",
              }}
              className={`text-left text-[clamp(28px,4vw,40px)] font-extrabold leading-none text-[#6441A4] ${
                rtl ? "" : "tracking-tight"
              }`}
            >
              Lobly
            </p>

            <p className="mt-4 text-[14px] leading-[24px] text-[#625575] sm:text-[15px] sm:leading-[26px]">
              {text}
            </p>
          </div>

          {/* ===== Links ===== */}
          <nav
            aria-label={labels.explore}
            className="grid grid-cols-2 gap-8 sm:gap-10"
          >
            {groups.map((group) => (
              <div key={group.title}>
                <h2
                  className={`text-[12px] font-bold text-[#563396] sm:text-[13px] ${
                    // Cairo breaks with letter-spacing; Latin labels need it to
                    // read as small caps rather than body text.
                    rtl ? "" : "uppercase tracking-[0.14em]"
                  }`}
                >
                  {group.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-1">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-9 items-center rounded-full text-[14px] font-semibold text-[#4A3D63] outline-offset-4 transition-colors duration-200 hover:text-[#6441A4] focus-visible:outline-2 focus-visible:outline-[#6441A4] motion-reduce:transition-none sm:text-[15px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* ===== Bottom bar ===== */}
        <div className="relative mt-10 flex flex-col gap-4 border-t border-[#6441A4]/15 pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[#7A6C93] sm:text-[13px]">
            © 2026 Lobly. {labels.rights}
          </p>

          <a
            href="#top"
            className="inline-flex min-h-9 w-fit items-center gap-2 rounded-full text-[13px] font-bold text-[#6441A4] outline-offset-4 transition-colors duration-200 hover:text-[#563396] focus-visible:outline-2 focus-visible:outline-[#6441A4] motion-reduce:transition-none sm:text-[14px]"
          >
            {labels.top}
            <span aria-hidden className="text-[15px] leading-none">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
