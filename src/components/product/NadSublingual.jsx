import React from "react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";
import useRunOnceInView from "../../lib/useRunOnceInView";

const CREAM = "#f4e3c1";
const CREAM_SOFT = "rgba(244,227,193,0.82)";
const GROUND = "radial-gradient(circle at 50% 50%, #c1a27a, #9a7843)";

const STEPS = [
  { n: "1", title: "Place", body: "The tablet is placed beneath the tongue" },
  { n: "2", title: "Dissolve", body: "It gradually dissolves and releases the medication" },
  { n: "3", title: "Absorb", body: "The medication comes into contact with the tissue beneath the tongue" },
  { n: "4", title: "Continue Your Day", body: "No needles, syringes, or injection preparation" },
];

/* Was 0.1 + i * 0.12, which relayed all four through in under half a second and
   read as one block arriving rather than a sequence. */
const STEP_LEAD = 0.15;
const STEP_GAP = 0.55;

const DOTTED_RULE = {
  backgroundImage: "radial-gradient(circle, rgba(244,227,193,0.85) 1.6px, transparent 1.7px)",
  backgroundSize: "4px 8px",
  backgroundRepeat: "repeat-y",
  backgroundPosition: "center top",
};

export default function NadSublingual({ startTo = "/start" }) {
  const [capRef, capIn] = useRunOnceInView("-80px");
  const [stepsRef, stepsIn] = useRunOnceInView("-80px");

  return (
    <section className="py-[clamp(2rem,4vw,3.5rem)]" style={{ background: "#faf8f4" }}>
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <div
          className="overflow-hidden rounded-[calc(28px*var(--nv-r-scale,1))] px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-16"
          style={{ background: GROUND }}
        >
          {/* ------------------------- capsule ------------------------- */}
          <Reveal as="div">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-10">
              <h2
                className="nv-weight-keep max-w-[12ch] font-display text-[clamp(1.6rem,5vw,2.4rem)] font-extrabold leading-[1.12]"
                style={{ color: CREAM }}
              >
                NAD+ Sublingual Tablet
              </h2>
              <p className="max-w-[42ch] text-[0.86rem] font-semibold leading-relaxed lg:pt-2" style={{ color: CREAM_SOFT }}>
                A needle-free NAD+ format designed to dissolve under the tongue
              </p>
            </div>
          </Reveal>

          <div ref={capRef} className={`nv-cap mt-[clamp(2rem,5vw,3.5rem)] ${capIn ? "is-in" : ""}`}>
            <span className="block font-mono text-[0.68rem] uppercase tracking-[0.18em]" style={{ color: CREAM }}>
              Daily Energy
            </span>

            <div className="relative mt-3">
              <div className="h-[clamp(2.6rem,6vw,3.4rem)] w-full overflow-hidden rounded-full border border-[#f4e3c1]/55 bg-[#f4e3c1]/35">
                <span className="nv-cap__fill block h-full rounded-full bg-[#6f5622]" />
              </div>
              <span className="nv-cap__pill pointer-events-none absolute top-1/2 block -translate-x-1/2 -translate-y-1/2">
                <span className="nv-float block">
                  <img
                    src="/products/nad-sublingual.avif"
                    alt=""
                    aria-hidden="true"
                    className="block h-[clamp(5rem,12vw,7.5rem)] w-auto max-w-none rotate-[14deg] object-contain drop-shadow-[0_10px_18px_rgba(70,50,20,0.4)]"
                  />
                </span>
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-[0.82rem] font-semibold" style={{ color: CREAM }}>
              <span>Low</span>
              <span>Steady</span>
              <span>High</span>
            </div>
          </div>

          {/* --------------------- everyday energy --------------------- */}
          <div className="mt-[clamp(2.5rem,6vw,4.5rem)] text-center">
            <Reveal>
              <h2
                className="nv-weight-keep font-display text-[clamp(1.5rem,4.6vw,2.35rem)] font-extrabold leading-tight"
                style={{ color: CREAM }}
              >
                Support Your Everyday Energy
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <Link
                to={startTo}
                /* Darker than the ground, not a cream wash over it — the comp's
                   pill reads as a recess in the panel. */
                className="mt-5 inline-flex rounded-full px-7 py-3.5 text-[0.82rem] font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{ color: CREAM, background: "rgba(92,72,38,0.38)" }}
              >
                See If NAD+ Is Right for You
              </Link>
            </Reveal>
          </div>

          {/* ------------------ without the injection ------------------ */}
          <div className="mt-[clamp(2.5rem,6vw,4.5rem)] grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14">
            <Reveal as="div">
              <h2
                className="nv-weight-keep max-w-[12ch] font-display text-[clamp(1.5rem,4.4vw,2.3rem)] font-extrabold leading-[1.12]"
                style={{ color: CREAM }}
              >
                NAD+ Without the Injection
              </h2>
              {/* The old art was a pair of tablets buried in a much larger
                  canvas, so it was blown up to 249% and pulled back by measured
                  offsets to crop down to them. The re-export is trimmed to the
                  tablets already, so the crop is gone and the frame just holds
                  the image at its own square ratio. Nothing to re-measure if it
                  is exported again. */}
              <div className="nv-float relative mt-6 w-full max-w-[13rem] sm:mt-8 sm:max-w-[21rem]">
                <img
                  src="/products/detail/nad-tablet-pair.avif"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </div>
            </Reveal>
            <ol ref={stepsRef} className={`nv-steps flex flex-col ${stepsIn ? "is-in" : ""}`}>
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className="nv-steps__item relative flex gap-5 pb-9 last:pb-0"
                  style={{ animationDelay: `${STEP_LEAD + i * STEP_GAP}s` }}
                >
                  {i < STEPS.length - 1 && (
                    <span
                      /* Wipes down from this circle to the next, running ahead of
                         the step it leads to. */
                      className="nv-steps__trail absolute bottom-0 left-5 top-12 w-1 -translate-x-1/2"
                      style={{ ...DOTTED_RULE, animationDelay: `${STEP_LEAD + i * STEP_GAP + 0.42}s` }}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border text-[0.9rem] font-bold"
                    style={{ borderColor: CREAM, color: CREAM }}
                  >
                    {s.n}
                  </span>
                  <span className="block pt-1.5">
                    <h3 className="font-display text-[1.02rem] font-bold leading-tight" style={{ color: CREAM }}>
                      {s.title}
                    </h3>
                    <p className="mt-1.5 max-w-[42ch] text-[0.86rem] leading-relaxed" style={{ color: CREAM_SOFT }}>
                      {s.body}
                    </p>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Required qualifiers, verbatim from the comp. The second one names the
            energy meter specifically, so it has to sit under that panel. */}
        <div className="mt-6 flex flex-col gap-3 text-[0.78rem] leading-relaxed text-muted">
          <p>Prescription treatment requires medical evaluation. Individual responses may vary.</p>
          <p>
            The energy meter and other graphics shown are for illustrative purposes only and do not
            represent expected or guaranteed results. If prescribed, compounded medications are not
            FDA-approved drug products.
          </p>
        </div>

        {/* ------------------------ how it is taken ------------------------ */}
        <div className="mt-[clamp(2.5rem,6vw,4rem)] grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal as="div">
            <div className="relative aspect-[0.89] w-full max-w-[34rem] overflow-hidden rounded-[calc(20px*var(--nv-r-scale,1))]">
              <img
                src="/site/nad/sublingual-taken.avif"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal as="div" delay={0.08}>
            {/* Two flat colours, no ramp: the comp sets the first clause in the
                soft tan and lands the qualifier in the deeper brass. */}
            <p className="nv-weight-keep max-w-[24ch] font-display text-[clamp(1.35rem,3.6vw,2.15rem)] font-extrabold leading-[1.22]">
              <span style={{ color: "#c3a67a" }}>A convenient treatment format</span>{" "}
              <span style={{ color: "#7a5f36" }}>made for everyday use</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
