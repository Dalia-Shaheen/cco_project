/**
 * The site's only footer line. It flows at the bottom on mobile and pins to the
 * bottom-left from `sm` up (the home page is the positioning context).
 * `data-reveal` lets the shared ScrollReveal wrapper fade it in.
 */
export default function Footer({ text }: { text: string }) {
  return (
    <p
      data-reveal
      id="help"
      className="mt-auto w-full pt-4 text-center text-[13px] text-[#625575] scroll-mt-32 sm:absolute sm:bottom-6 sm:left-6 sm:w-auto sm:pt-0 sm:text-left sm:text-[18px] lg:left-12"
    >
      {text}
    </p>
  );
}
