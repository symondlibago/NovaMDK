import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { track, EVENTS } from "../../lib/analytics";
import { productPath } from "../../lib/slug";
import { programsFor } from "../data/subscriptions";
import { programItem } from "../../lib/programCard";
import Reveal from "../ui/Reveal";
import TreatmentCard from "../shop/TreatmentCard";

const STEPS = [
  {
    title: "Your Care Starts Here",
    text: "Tell us about your health history, current medications, and treatment goals through a guided online assessment",
    img: "/products/detail/journey-assessment.avif",
  },
  {
    title: "Physician Review",
    text: "A licensed physician reviews your information and determines whether treatment is medically appropriate for you",
    img: "/products/detail/journey-review.avif",
  },
  {
    title: "Your Treatment Is Prepared",
    text: "If prescribed, your prescription is sent to a partner pharmacy for preparation and delivery directly to your door",
    img: "/products/detail/journey-prepared.avif",
  },
  {
    title: "Ongoing Care",
    text: "Stay supported with follow-ups, treatment guidance, and refill management as your plan continues",
    img: "/products/detail/journey-ongoing.avif",
  },
];

const SLIDES = STEPS.filter((s) => s.img);
const AUTOPLAY_MS = 2000;
function SideFrame({ index, side }) {
  const toCentre = side === "left" ? "to right" : "to left";
  return (
    <span
      aria-hidden="true"
      className={`relative mt-9 hidden h-50 w-[32%] shrink-0 sm:block ${
        side === "left" ? "-mr-2" : "-ml-2"
      }`}
    >
      {/* Every slide stacked, only one at full opacity. Swapping a single src
          could only fade the incoming photo up from the page background, which
          is the blink that made the change read as a cut rather than a fade. */}
      {SLIDES.map((s, k) => (
        <img
          key={s.img}
          src={s.img}
          alt=""
          loading="lazy"
          className={`absolute inset-0 h-full w-full rounded-[calc(14px*var(--nv-r-scale,1))] object-cover transition-opacity duration-700 ease-out ${
            k === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <span
        className="absolute inset-0 rounded-[calc(14px*var(--nv-r-scale,1))]"
        style={{
          background: `linear-gradient(${toCentre}, transparent 40%, color-mix(in oklab, var(--nv-bg) 90%, transparent) 100%)`,
        }}
      />
    </span>
  );
}

export default function ProductJourney({ product }) {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  // Wraps both ways, so the strip always has a frame either side of the active
  // one and the arrows never dead-end.
  const at = (k) => SLIDES[(k + n) % n];
  const step = at(i);

  /* Autoplay. Held while the pointer is over the strip or focus is inside it,
     so a step can't slide out from under someone reading its caption or
     reaching for an arrow. */
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const autoplaying = !paused && !reduceMotion && n > 1;
  useEffect(() => {
    if (!autoplaying) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [autoplaying, i, n]);

  const programs = programsFor(product.categorySlug).map(programItem);

  return (
    <section className="py-[clamp(2.5rem,5vw,4.5rem)]">
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
      <Reveal as="div" className="grid gap-6 md:grid-cols-2 md:items-start">
        <h2 className="max-w-[16ch] font-display text-[clamp(1.5rem,3.2vw,2.2rem)] font-extrabold leading-[1.15] text-[#725826]">
          From assessment to ongoing care
        </h2>
        <div className="md:pt-1">
          <p className="max-w-[46ch] text-[0.88rem] leading-relaxed text-muted">
            A straightforward path to personalized treatment, with licensed medical oversight at every step
          </p>
          <Link
            to="/start"
            onClick={() => track(EVENTS.QUIZ_STARTED, { source: "product-journey" })}
            className="group mt-3 inline-flex items-center gap-2.5 text-[0.92rem] font-bold text-ink transition-colors hover:text-[#725826]"
          >
            Take a quick assessment
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
      <div
        className="relative mt-[clamp(2rem,4vw,3.25rem)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="flex items-start justify-center px-12 sm:px-16">
          <SideFrame index={(i - 1 + n) % n} side="left" />
          <div className="relative z-10 w-full sm:w-[36%]">
            {/* Step number, straddling the frame's left edge as in the comp. */}
            <span className="absolute -left-7 -top-6 z-10 grid h-14 w-14 place-items-center rounded-full bg-[#8a6a33] font-display text-[1.35rem] font-bold text-[#ffe8b1]">
              {i + 1}
            </span>
            <div className="relative h-49 sm:h-55">
              {SLIDES.map((s, k) => (
                <img
                  key={s.img}
                  src={s.img}
                  alt={k === i ? s.title : ""}
                  aria-hidden={k !== i}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full rounded-[calc(14px*var(--nv-r-scale,1))] border-2 border-[#b47f2f] object-cover transition-opacity duration-700 ease-out ${
                    k === i ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>

          <SideFrame index={(i + 1) % n} side="right" />
        </div>
      </div>

      <div
        className="mx-auto mt-7 max-w-[42ch] text-center"
        aria-live={autoplaying ? "off" : "polite"}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="flex items-center justify-center gap-2.5">
          {SLIDES.map((s, k) => (
            <button
              key={s.img}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Show step ${k + 1}, ${s.title}`}
              aria-current={k === i ? "true" : undefined}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                k === i ? "scale-125 bg-[#8a6a33]" : "bg-[#d9c9a8] hover:bg-[#c0aa80]"
              }`}
            />
          ))}
        </div>
        {/* Same brown as the section heading above it — the black in the text
            spec sheet was placeholder styling, not the colour. */}
        <h3 key={`t${i}`} className="nv-fade-slow mt-6 font-display text-[1.35rem] font-extrabold text-[#725826]">
          {step.title}
        </h3>
        <p key={`d${i}`} className="nv-fade-slow mx-auto mt-2.5 max-w-[34ch] text-[0.86rem] leading-relaxed text-muted">
          {step.text}
        </p>
      </div>
      </div>

      {/* Deliberately outside the 1180 container the rest of the section uses —
          the comp runs this panel considerably wider than the carousel above it,
          with only a thin margin left and right. */}
      {programs.length > 0 && (
        <Reveal as="div" className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] max-w-[1520px] px-4 md:px-6">
          <div
            className="grid items-center gap-6 rounded-[calc(38px*var(--nv-r-scale,1))] px-6 py-10 md:px-12 lg:grid-cols-[1fr_1.35fr_0.85fr] lg:gap-10"
            style={{ background: "linear-gradient(135deg, #9a7843 0%, #b8935c 45%, #a07c46 100%)" }}
          >
            <div>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#ffe8b1]">
                Membership Required
              </span>
              <h3 className="mt-3 max-w-[10ch] font-display text-[clamp(1.5rem,2.8vw,2.1rem)] font-extrabold leading-[1.2] text-[#ffe8b1]">
                {product.categoryName} Treatments
              </h3>
            </div>

            <div className="mx-auto grid w-full max-w-[560px] gap-5 sm:grid-cols-2">
              {programs.slice(0, 2).map((c) => (
                /* No quick-view here: we are already on a product page, so
                   View Details routes to the other product instead of stacking
                   a modal on top of one. */
                <TreatmentCard key={c.key} item={c} compact onViewDetails={(p) => navigate(productPath(p))} />
              ))}
            </div>

            {/* Hairline only from lg, where the three blocks actually sit in a row. */}
            <div className="lg:border-l lg:border-white/30 lg:pl-10">
              <h3 className="max-w-[12ch] font-display text-[clamp(1.4rem,2.6vw,1.95rem)] font-extrabold leading-[1.2] text-[#ffe8b1]">
                Explore Other Treatments
              </h3>
              {/* Outlined, not filled — the comp keeps the solid cream button for
                  the primary CTAs and gives this secondary one a ghost pill. */}
              <Link
                to="/treatments"
                className="group mt-5 inline-flex items-center gap-2 rounded-full border border-[#ffe8b1]/70 px-6 py-2.5 text-[0.85rem] font-semibold text-[#ffe8b1] transition-all hover:-translate-y-0.5 hover:bg-[#ffe8b1]/10"
              >
                See More
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
