import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Reveal from "../ui/Reveal";
import useRunOnceInView from "../../lib/useRunOnceInView";
const INK = "#6b511e";
const SOFT = "#c0a878";
const CREAM = "#f2ece1";

/* Deliberately soft-focus, not a crisp disc: the comp renders it out of focus,
   so it is a warm gradient blurred at the edges with a halo bleeding past it. */
const BEAD = "radial-gradient(circle at 34% 30%, #f2ddab 0%, #d6b273 42%, #a9853f 78%, #8a6a33 100%)";
const BEAD_GLOW = "0 0 9px 3px rgba(180,145,80,0.45)";
const ORBITS = [
  { label: "Confidence", pos: "left-[1%] top-[13%] sm:left-[6%]" },
  { label: "Connection", pos: "right-[1%] top-[15%] sm:right-[10%]" },
  { label: "Satisfaction", pos: "right-[0%] top-[47%] sm:right-[2%]" },
  { label: "Intimacy", pos: "left-[2%] top-[77%] sm:left-[6%]" },
];

/* Two rows of glass chips. `on` is the comp's single highlighted chip. */
const CHIPS = [
  ["Sensitivity", "Affection", "Desire", "Confidence", "Connection", "Function", "Fulfillment", "Harmony"],
  ["Pleasure", "Closeness", "Wellness", "Desire", "Comfort", "Passion", "Authenticity"],
];
const CHIP_ON = "Confidence";

const FOCUS = [
  { label: "Desire & Arousal", img: "/site/sexual-health/focus-desire.avif", fit: "object-center" },
  { label: "Sexual Function", img: "/site/sexual-health/focus-function.avif", fit: "object-center" },
  { label: "Confidence & Intimacy", img: "/site/sexual-health/focus-confidence.avif", fit: "object-center" },
];

const CARD_R = "rounded-[calc(28px*var(--nv-r-scale,1))]";
const TILE_R = "rounded-[calc(20px*var(--nv-r-scale,1))]";

function GlassPill({ children, tone = "light", on = false, className = "", ...rest }) {
  const light = tone === "light";
  return (
    <span
      {...rest}
      className={`inline-flex items-center whitespace-nowrap rounded-full backdrop-blur-md ${light ? "gap-3 px-5 py-3 text-[clamp(0.82rem,1.4vw,0.98rem)] font-bold" : "gap-2 border px-4 py-2 text-[0.78rem] font-semibold"} ${className}`}
      style={{
        background: light
          ? "rgba(252,249,243,0.94)"
          : on
            ? "rgba(255,255,255,0.3)"
            : "rgba(255,255,255,0.14)",
        borderColor: light ? "transparent" : "rgba(255,255,255,0.22)",
        boxShadow: light ? "0 8px 22px rgba(122,96,58,0.16)" : "none",
        color: light ? "#5c4a2a" : on ? "#ffffff" : "rgba(255,255,255,0.72)",
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------ 1. hero card ------------------------------ */

function ConfidenceStage({ startTo }) {
  // The arc draws once it is on screen — the draw is the point of it.
  const [arcRef, arcIn] = useRunOnceInView("-80px");

  return (
    <div className="mx-auto max-w-[1320px] px-5 pt-[clamp(2.5rem,6vw,4.5rem)] md:px-10">
      <Reveal>
        <div
          className={`relative overflow-hidden px-5 pt-10 sm:px-10 sm:pt-14 ${CARD_R}`}
          style={{ background: "linear-gradient(180deg, #d9c4a1 0%, #e3d2b4 42%, #ebdfc8 78%, #f0e7d5 100%)" }}
        >
          <h2 className="nv-weight-keep mx-auto max-w-[18ch] text-center font-display text-[clamp(1.7rem,5.4vw,3rem)] font-extrabold leading-[1.12] text-white">
            Confidence <em className="italic">Starts</em> With Feeling Like Yourself
          </h2>
          <p className="mx-auto mt-4 max-w-[44ch] text-center text-[0.85rem] leading-relaxed text-white/85">
            Prescription treatment options selected according to your individual health needs
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={startTo}
              className="inline-flex rounded-full px-7 py-3 text-[0.85rem] font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: CREAM, color: "#665c4f" }}
            >
              Get Started
            </Link>
            <Link
              to="/treatments"
              className="inline-flex rounded-full px-7 py-3 text-[0.85rem] font-medium backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "rgba(139,123,102,0.62)", color: "#fbf7f0" }}
            >
              Explore Treatments
            </Link>
          </div>

          <div ref={arcRef} className={`nv-arc relative mt-8 h-[clamp(19rem,46vw,30rem)] ${arcIn ? "is-in" : ""}`}>
            <svg
              viewBox="0 0 200 108"
              preserveAspectRatio="xMidYMax meet"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <path
                className="nv-arc__line"
                d="M 6 108 A 94 94 0 0 1 194 108"
                pathLength="1"
                fill="none"
                stroke="rgba(255,255,255,0.72)"
                strokeWidth="0.55"
                strokeLinecap="round"
              />
            </svg>
            <img
              src="/site/sexual-health/hero-couple.avif"
              alt=""
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
            />
            {ORBITS.map((o) => (
              <span key={o.label} className={`absolute ${o.pos}`}>
                <GlassPill>
                  <span className="h-3 w-3 shrink-0 rounded-full blur-[1.5px]" style={{ background: BEAD, boxShadow: BEAD_GLOW }} aria-hidden="true" />
                  {o.label}
                </GlassPill>
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* --------------------------- 2. overall wellness -------------------------- */

function OverallWellness() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 pt-[clamp(2rem,5vw,3.5rem)] md:px-10">
      <Reveal>
        <div className={`relative overflow-hidden px-6 py-9 sm:px-10 sm:py-12 lg:pr-[42%] ${CARD_R}`}>
          <img
            src="/site/sexual-health/wellness-couple.avif"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-right"
          />
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(58,44,34,0.8) 0%, rgba(58,44,34,0.58) 38%, rgba(58,44,34,0.26) 68%, rgba(58,44,34,0.08) 100%)",
            }}
          />

          <div className="relative z-10">
            <h2 className="nv-weight-keep max-w-[16ch] font-display text-[clamp(1.6rem,4.6vw,2.6rem)] font-extrabold leading-[1.12] text-white">
              Sexual Health Is Part of{" "}
              <span className="lg:block" style={{ color: "#a89a8b" }}>
                Overall Wellness
              </span>
            </h2>
            <p className="mt-6 text-[0.92rem] font-bold text-white">
              Your sexual health can change over time
            </p>
            <p className="mt-3 max-w-[46ch] text-[0.85rem] leading-relaxed" style={{ color: "#b9ada0" }}>
              Physical health, stress, lifestyle, medications, hormones, and other factors can all
              influence desire, comfort, and sexual function
            </p>
          </div>
          <div className="relative z-10 mt-9 flex flex-col gap-3 lg:-mr-[72%]">
            {CHIPS.map((row, r) => (
              <div key={r} className="overflow-hidden">
                <div className={`flex w-max ${r === 0 ? "nv-chiprow--ltr" : "nv-chiprow--rtl"}`}>
                  {[0, 1].map((copy) => (
                    <div key={copy} className="flex shrink-0 items-center gap-2.5 pr-2.5">
                      {row.map((c, i) => (
                        <GlassPill
                          key={`${c}-${i}`}
                          tone="dark"
                          on={c === CHIP_ON && r === 0}
                          aria-hidden={copy === 1 ? "true" : undefined}
                        >
                          {c}
                          {c === CHIP_ON && r === 0 && <Check size={12} strokeWidth={3} />}
                        </GlassPill>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------- 3. focus -------------------------------- */

function FocusRow() {
  return (
    <div className="mx-auto max-w-[1320px] px-5 pb-[clamp(3rem,6vw,5rem)] pt-[clamp(2.5rem,6vw,4.5rem)] md:px-10">
      <Reveal>
        <h2 className="text-center font-display text-[clamp(1.6rem,4.6vw,2.6rem)] font-extrabold leading-[1.14]">
          <span style={{ color: INK }}>Understanding What You</span>{" "}
          <span className="sm:block" style={{ color: SOFT }}>
            Need Comes First
          </span>
        </h2>
      </Reveal>

      <div className="mt-[clamp(1.75rem,4vw,3rem)] grid gap-4 sm:grid-cols-3">
        {FOCUS.map((f, i) => (
          <Reveal as="div" key={f.label} delay={i * 0.08} className="h-full">
            <div className={`relative aspect-[0.78] overflow-hidden ${TILE_R}`}>
              <img
                src={f.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover ${f.fit}`}
              />
              {/* Short veil at the head of the card only — enough to carry the
                  label without washing the photograph. */}
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
                style={{ background: "linear-gradient(180deg, rgba(30,20,12,0.55), transparent)" }}
              />
              <span className="absolute left-5 top-5 z-10 text-[0.95rem] font-semibold text-white drop-shadow-[0_2px_10px_rgba(30,20,12,0.6)]">
                {f.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function SexualHealthSections({ startTo = "/start" }) {
  return (
    <div style={{ background: "#faf8f4" }}>
      <ConfidenceStage startTo={startTo} />
      <OverallWellness />
      <FocusRow />
    </div>
  );
}
