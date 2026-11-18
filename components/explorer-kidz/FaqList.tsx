"use client";

import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useRef, useState } from "react";

type FaqItem = { q: string; a: string };

type FaqRowProps = {
  item: FaqItem;
  index: number;
  open: boolean;
  onToggle: () => void;
};

function FaqRow({ item, index, open, onToggle }: FaqRowProps) {
  const panel = useRef<HTMLDivElement>(null);
  // Captured once so React never overwrites the height GSAP is tweening.
  const [initialHeight] = useState(() => (open ? "auto" : 0));

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        el.style.height = open ? "auto" : "0px";
        return;
      }

      gsap.to(el, {
        height: open ? "auto" : 0,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    { dependencies: [open] },
  );

  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_6px_20px_rgba(100,65,164,0.045)]">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`faq-panel-${index}`}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center gap-2 ps-6 pe-2 py-[19px] text-start outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-[#6441A4] lg:py-3"
        >
          <span className="flex-1 text-[16px] leading-6 font-bold text-[#6441A4] lg:text-[17px] lg:leading-[26px]">
            {item.q}
          </span>

          {/* A plus that loses its upright when the answer is open. */}
          <span
            aria-hidden
            className="grid size-12 flex-none place-items-center text-[#6441A4]"
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              className="h-3.5 w-3.5 overflow-visible"
            >
              <path
                d="M0 7H14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M7 0V14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="origin-center transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{ transform: open ? "scaleY(0)" : "scaleY(1)" }}
              />
            </svg>
          </span>
        </button>
      </h3>

      <div
        ref={panel}
        id={`faq-panel-${index}`}
        style={{ height: initialHeight }}
        className="overflow-hidden"
      >
        {/* No negative pull here: the panel clips its own box (its height is
            tweened), so pulling the answer above it shaves the tops of the
            Arabic dots — Cairo's 15px ink starts only ~3px inside its 23px line
            box. The open card is 8px taller instead. */}
        <p className="px-6 pb-4 text-[15px] leading-[22px] text-[#746585] lg:pb-[26px] lg:leading-[23px]">
          {item.a}
        </p>
      </div>
    </div>
  );
}

/**
 * One answer open at a time, like the design's first row. The panel height is
 * tweened by GSAP (CSS cannot animate to `auto`), and reduced-motion users get
 * an instant swap instead.
 */
export default function FaqList({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <FaqRow
          key={item.q}
          item={item}
          index={index}
          open={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
        />
      ))}
    </div>
  );
}
