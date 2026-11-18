/**
 * Lobly's little island mascot — a friendly purple mound that peeks out from
 * behind the hero card. Drawn inline (no asset request) so it stays crisp at
 * every size and can be swapped for the real character later.
 */
export default function HeroMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 120 120"
      className={className}
    >
      <defs>
        <linearGradient
          id="lobly-mascot-body"
          x1="20"
          y1="52"
          x2="100"
          y2="108"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8F70C4" />
          <stop offset="1" stopColor="#6441A4" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="60" cy="108" rx="38" ry="5.5" fill="#6441A4" opacity="0.12" />

      {/* island body */}
      <path
        d="M14 92c0-20 20-36 46-36s46 16 46 36c0 8-14 12-46 12S14 100 14 92Z"
        fill="url(#lobly-mascot-body)"
      />
      {/* soft sand patch on the belly */}
      <path
        d="M27 92c0-6 15-10 33-10s33 4 33 10-15 9-33 9-33-3-33-9Z"
        fill="#FAF8FF"
        opacity="0.2"
      />

      {/* eyes */}
      <ellipse cx="47" cy="78" rx="7.5" ry="8.5" fill="#FFFFFF" />
      <ellipse cx="73" cy="78" rx="7.5" ry="8.5" fill="#FFFFFF" />
      <circle cx="47.5" cy="79.5" r="3.8" fill="#30214F" />
      <circle cx="73.5" cy="79.5" r="3.8" fill="#30214F" />
      <circle cx="46" cy="77.6" r="1.2" fill="#FFFFFF" />
      <circle cx="72" cy="77.6" r="1.2" fill="#FFFFFF" />

      {/* cheeks */}
      <circle cx="34" cy="88" r="4.6" fill="#F4A6A0" opacity="0.6" />
      <circle cx="86" cy="88" r="4.6" fill="#F4A6A0" opacity="0.6" />

      {/* smile */}
      <path
        d="M52 89c3.2 5 12.8 5 16 0"
        fill="none"
        stroke="#30214F"
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* sprout */}
      <path
        d="M60 57c0-7-3-11-8-13M60 57c0-7 3-11 8-13"
        fill="none"
        stroke="#6441A4"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="60" cy="53" r="3.2" fill="#F4A6A0" />

      {/* sparkle */}
      <path
        d="M96 30c.7 5 2.6 6.9 7.6 7.6-5 .7-6.9 2.6-7.6 7.6-.7-5-2.6-6.9-7.6-7.6 5-.7 6.9-2.6 7.6-7.6Z"
        fill="#F4A6A0"
      />
    </svg>
  );
}
