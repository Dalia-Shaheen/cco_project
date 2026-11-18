import ScrollReveal from "@/components/animation/ScrollReveal";
import FlairHover from "@/components/ui/FlairHover";
import FaqList from "@/components/explorer-kidz/FaqList";
import { explorerContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

type HelpSectionProps = {
  text: (typeof explorerContent)[Locale]["help"];
};

/** Where the "Email us" button points. Swap once the real inbox is live. */
const SUPPORT_EMAIL = "hello@lobly.app";

/**
 * The help block: a short reassurance card next to the FAQ, then one wide
 * "still have a question" card underneath. The FAQ answers are the only part
 * that needs JavaScript, so the section itself stays a server component.
 */
export default function HelpSection({ text }: HelpSectionProps) {
  return (
    /* The footer below is a lavender card, not a full-bleed band, so this block
       is one too — same max width, same inset and same corner radius — or the
       two lavender areas read as one shape with a bite taken out of it. */
    <section
      id="help"
      aria-labelledby="help-title"
      className="w-full scroll-mt-28 px-4 pt-6 sm:px-6 sm:pt-8"
    >
      <div className="mx-auto w-full max-w-[1392px] rounded-[32px] bg-[#EEE8F8] px-6 pt-8 pb-6 sm:rounded-[40px] lg:pt-14 lg:pb-14">
        <ScrollReveal>
          <h2
            data-reveal
            id="help-title"
            className="text-center text-[28px] leading-[42px] font-bold text-[#6441A4] lg:text-[38px] lg:leading-[57px]"
          >
            {/* The design uses a shorter heading on phones. */}
            <span className="lg:hidden">{text.titleMobile}</span>
            <span className="hidden lg:inline">{text.title}</span>
          </h2>
          <p
            data-reveal
            className="mt-3 text-center text-[16px] leading-6 text-[#746585] lg:mt-[13px] lg:text-[18px] lg:leading-[27px]"
          >
            {text.subtitle}
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-[18px] w-full max-w-[1208px] lg:mt-[71px]">
          <div className="grid gap-9 lg:grid-cols-[392px_1fr] lg:gap-14">
            {/* ===== Reassurance card ===== */}
            <div
              data-reveal
              className="flex flex-col rounded-[28px] bg-white pt-2.5 pb-3 shadow-[0_6px_20px_rgba(100,65,164,0.045)] lg:pt-4 lg:pb-[25px]"
            >
              {/* The mascot is a silent 5s clip on a white background, so it
                  sits in the same fixed 340×282 stage (219×176 on phones) with
                  `contain` — cropping would cut the head and feet off. No
                  `controls`: it plays itself, muted (required for autoplay),
                  inline on iOS, and loops. Reduced-motion visitors get the
                  poster frame instead — a CSS swap, so nothing has to hydrate
                  and the card keeps its height either way. */}
              <video
                src="/explorer-kidz/home/help-mascot.mp4"
                poster="/explorer-kidz/home/help-mascot-poster.webp"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
                width={360}
                height={640}
                className="mx-auto h-[176px] w-[219px] object-contain motion-reduce:hidden lg:mx-[26px] lg:h-[282px] lg:w-[340px]"
              />
              <Image
                src="/explorer-kidz/home/help-mascot-poster.webp"
                alt=""
                aria-hidden
                width={360}
                height={640}
                loading="lazy"
                className="mx-auto hidden h-[176px] w-[219px] object-contain motion-reduce:block lg:mx-[26px] lg:h-[282px] lg:w-[340px]"
              />
              <p className="mt-4 px-3 text-center text-[16px] leading-6 font-bold text-[#6441A4] lg:text-[21px] lg:leading-8">
                {text.guide.title}
              </p>
              {/* The phone layout drops this line to keep the card short. */}
              <p className="mt-2.5 hidden px-6 text-center text-[15px] leading-[23px] text-[#746585] lg:block">
                {text.guide.subtitle}
              </p>
            </div>

            {/* ===== FAQ ===== */}
            <div data-reveal>
              <FaqList items={text.faqs} />
            </div>
          </div>

          {/* ===== Contact ===== */}
          <div
            data-reveal
            className="mt-7 flex flex-col items-center gap-9 rounded-[28px] bg-[#FAF8FF] px-6 py-6 text-center shadow-[0_6px_20px_rgba(100,65,164,0.045)] lg:mt-12 lg:flex-row lg:justify-between lg:px-9 lg:py-9 lg:text-start"
          >
            <div>
              <p className="text-[22px] leading-[33px] font-bold text-[#6441A4] lg:text-[26px] lg:leading-[39px]">
                {text.contact.title}
              </p>
              <p className="mt-[11px] text-[15px] leading-[23px] text-[#746585] lg:mt-[13px] lg:text-[17px] lg:leading-[26px]">
                {text.contact.subtitle}
              </p>
            </div>

            <Link
              href={`mailto:${SUPPORT_EMAIL}`}
              className="relative flex h-14 w-full max-w-[294px] flex-none items-center justify-center rounded-2xl bg-[#EEE8F8] px-6 text-[20px] leading-8 font-bold text-[#30214F] outline-offset-2 transition-colors motion-reduce:hover:bg-white focus-visible:outline-2 focus-visible:outline-[#6441A4] lg:w-auto lg:min-w-[240px]"
            >
              <FlairHover color="#FFFFFF" />
              <span className="relative">{text.contact.cta}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
