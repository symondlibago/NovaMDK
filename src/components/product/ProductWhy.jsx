import React from "react";
import Reveal from "../ui/Reveal";

/* "Why Nova MDK" — the three-up trust row that closes the product page below the
   journey section (2026-08 comp).

   The icons are the supplied line-art exports, trimmed to their drawing bounds
   and converted to AVIF with their transparency intact (the section ground is
   cream, so a flattened white square would show behind each one).

   Claims kept to what the site states elsewhere: a provider reviews every
   intake, plans are set per patient, and the platform is HIPAA-protected. */
const POINTS = [
  { img: "/site/weight-loss/why-care-plan.avif", label: "Personalized Care Plans" },
  { img: "/site/weight-loss/why-provider-review.avif", label: "Licensed Provider Review" },
  { img: "/site/weight-loss/why-hipaa.avif", label: "HIPAA-Protected Experience" },
];

export default function ProductWhy() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-[clamp(2.5rem,5vw,4.5rem)] md:px-10">
      <Reveal>
        <span className="nv-eyebrow">Why Nova MDK</span>
        <h2 className="mt-3 font-display text-[clamp(1.6rem,3.4vw,2.2rem)] font-extrabold leading-tight text-[#725826]">
          Built for Modern Care
        </h2>
      </Reveal>

      <ul className="mt-[clamp(2rem,4vw,3.25rem)] grid gap-10 sm:grid-cols-3">
        {POINTS.map((p, i) => (
          <Reveal as="li" key={p.label} delay={0.06 * i} className="flex flex-col items-center text-center">
            <img
              src={p.img}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-24 w-24 object-contain"
            />
            <span className="mt-5 text-[1rem] leading-snug text-[#6d6152]">{p.label}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
