import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "../ui/Reveal";
import useRunOnceInView from "../../lib/useRunOnceInView";
const INK = "#5c4a2a";
const CREAM = "#f7efe2";
const CARD_R = "rounded-[calc(24px*var(--nv-r-scale,1))]";
const VEIL = "rgba(104,80,44,0.34)";
const POINTS = [
  { year: "2021", x: 20, y: 49 },
  { year: "2023", x: 52, y: 39 },
  { year: "2026", x: 83, y: 51 },
];

const CURVE = `M ${POINTS[0].x} ${POINTS[0].y} C 31 47, 41 39, ${POINTS[1].x} ${POINTS[1].y} C 63 39, 73 49, ${POINTS[2].x} ${POINTS[2].y}`;


const DRAW_MS = 1400;
const STEP_MS = 260;
const FILL_AT = DRAW_MS * 0.5;
/* The pair below runs the full width of the wide card above, so the two rows
   share one left and right edge as the comp sets them. That makes each card
   roughly half the block wide, hence a landscape aspect: at the old portrait
   0.85 a full-width card would be taller than the viewport. */
const CARD_ASPECT = "sm:aspect-[1.18] lg:aspect-[1.5]";

function PhotoCard({ img, title, children, className = "", delay = 0, glass = false, veil = true }) {
  const shadow = veil
    ? "drop-shadow-[0_2px_14px_rgba(60,44,20,0.55)]"
    : "drop-shadow-[0_2px_10px_rgba(58,42,18,0.9)]";

  return (
    <Reveal as="div" delay={delay} className={`h-full ${className}`}>
      <div
        className={`relative flex h-full min-h-[22rem] flex-col overflow-hidden p-6 sm:min-h-0 sm:p-7 ${CARD_ASPECT} ${CARD_R}`}
        style={{ background: "linear-gradient(120deg, #c9ac86 0%, #bb9c71 55%, #b39468 100%)" }}
      >
        <img
          src={img}
          alt=""
          aria-hidden="true"
          loading="lazy"
          /* The un-veiled art is a cut-out on transparency, so it is contained
             rather than cropped — and anchored right once the card goes
             landscape, which is the side the comp stands her on. */
          className={`absolute inset-0 h-full w-full ${veil ? "object-cover" : "object-contain object-bottom sm:object-bottom-right"}`}
        />
        {veil && <span className="pointer-events-none absolute inset-0" style={{ background: VEIL }} />}
        {glass && (
          <span className="pointer-events-none absolute inset-x-[5%] bottom-[7%] top-[4%] rounded-[calc(20px*var(--nv-r-scale,1))] border border-white/25 bg-white/10 backdrop-blur-[2px] backdrop-saturate-125" />
        )}
        <h3
          className={`nv-weight-keep relative z-10 max-w-[9ch] font-display text-[clamp(1.5rem,4.4vw,2.05rem)] font-extrabold leading-[1.1] ${shadow}`}
          style={{ color: CREAM }}
        >
          {title}
        </h3>
        <div className={`relative z-10 flex min-h-0 flex-1 flex-col ${veil ? "" : shadow}`}>{children}</div>
      </div>
    </Reveal>
  );
}

export default function NadDirected() {
  // The plot only runs once it is actually on screen — the draw is the point of
  // it, and starting it above the fold would mean it had already finished.
  const [plotRef, plotIn] = useRunOnceInView("-80px");

  return (
    <section className="py-[clamp(2.5rem,5vw,4.5rem)]" style={{ background: "#faf8f4" }}>
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <Reveal className="text-center">
          <h2
            className="mx-auto max-w-[14ch] font-display text-[clamp(1.6rem,5vw,2.6rem)] font-extrabold leading-[1.12]"
            style={{ color: INK }}
          >
            Provider-Directed Treatment
          </h2>
          <Link
            to="/start"
            className="group mt-6 inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[0.95rem] font-medium transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(120deg, #b39468 0%, #a3835a 100%)", color: CREAM }}
          >
            Start Your Journey
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f7efe2]/25 transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={17} strokeWidth={2.2} />
            </span>
          </Link>
        </Reveal>

        {/* ---- wide card: copy left, phone breaking the top edge on the right ---- */}
        <Reveal as="div" className="mt-[clamp(1.75rem,4vw,3rem)]">
          <div
            className={`relative px-6 py-8 sm:px-9 sm:py-10 lg:min-h-[25rem] lg:px-11 lg:py-14 lg:pr-[42%] ${CARD_R}`}
            style={{ background: "linear-gradient(120deg, #c9ac86 0%, #bb9c71 55%, #b39468 100%)" }}
          >
            <h3
              className="nv-weight-keep max-w-[11ch] font-display text-[clamp(1.6rem,5vw,2.35rem)] font-extrabold leading-[1.1]"
              style={{ color: CREAM }}
            >
              Designed for At-Home Care
            </h3>
            <p className="mt-4 max-w-[44ch] text-[0.9rem] leading-relaxed" style={{ color: "rgba(247,239,226,0.86)" }}>
              Once prescribed, treatment can fit into a structured at-home routine with guidance from
              your provider
            </p>
            <Link
              to="/start"
              className="mt-7 inline-flex rounded-full bg-[#f7efe2]/22 px-6 py-3 text-[0.88rem] font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f7efe2]/32"
              style={{ color: CREAM }}
            >
              See If NAD+ Is Right for You
            </Link>

            {/* Under the copy on a phone. */}
            <img
              src="/site/nad/care-athome.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="mx-auto mt-8 block w-[68%] max-w-[17rem] object-contain sm:w-[52%] lg:hidden"
            />
            <span className="pointer-events-none absolute -top-[13%] bottom-0 right-0 hidden w-[36%] overflow-hidden lg:block">
              <img
                src="/site/nad/care-athome.avif"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute bottom-0 right-0 h-full w-auto max-w-none object-contain object-bottom"
              />
            </span>
          </div>
        </Reveal>

        {/* Flush with the wide card above: same container, no cap of its own. */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:gap-6">
          {/* No veil: the scrim was shifting this photograph's colour, and the
              comp's warmth is the shot's own. */}
          <PhotoCard img="/site/nad/care-injectable.avif" title="Injectable Format" veil={false}>
            <p className="relative z-10 mt-4 max-w-[26ch] text-[0.85rem] leading-relaxed" style={{ color: "rgba(247,239,226,0.88)" }}>
              NAD+ is administered by injection according to the instructions provided with your
              prescription
            </p>
          </PhotoCard>
          <PhotoCard img="/site/nad/care-consistency.avif" title="Consistency" delay={0.08} glass>
            <div ref={plotRef} className={`nv-plot relative z-10 mt-auto h-[62%] ${plotIn ? "is-in" : ""}`}>
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                <defs>
                  <linearGradient id="nv-nad-plotfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f7efe2" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#f7efe2" stopOpacity="0" />
                  </linearGradient>
                  <mask id="nv-nad-plotsweep" maskUnits="userSpaceOnUse" x="0" y="-20" width="100" height="140">
                    <rect className="nv-plot__sweep" x="19" y="-20" width="66" height="140" fill="#fff" />
                  </mask>
                </defs>
                <path
                  className="nv-plot__fill"
                  d={`${CURVE} L ${POINTS[2].x} 100 L ${POINTS[0].x} 100 Z`}
                  fill="url(#nv-nad-plotfill)"
                  style={{ animationDelay: `${FILL_AT}ms` }}
                />
                <path
                  className="nv-plot__line"
                  d={CURVE}
                  mask="url(#nv-nad-plotsweep)"
                  fill="none"
                  stroke="#f7efe2"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: "drop-shadow(0 0 6px rgba(247,239,226,0.75))" }}
                />
              </svg>

              {POINTS.map((p, i) => {
                const peak = i === 1;
                // Each year lands after the curve has been drawn past it, so the
                // marker follows the line rather than waiting for it to finish.
                const at = DRAW_MS * 0.45 + i * STEP_MS;
                return (
                  <React.Fragment key={p.year}>
                    <span
                      className="nv-plot__drop absolute w-px bg-linear-to-b from-[#f7efe2]/55 to-transparent"
                      style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        height: `${58 - p.y}%`,
                        animationDelay: `${at}ms`,
                      }}
                      aria-hidden="true"
                    />
                    {/* Centring on the wrapper, scale on the child: a keyframe on
                        this element would overwrite the -translate-x/y. */}
                    <span
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      aria-hidden="true"
                    >
                      <span
                        className={`nv-plot__dot block rounded-full bg-[#f7efe2] ${peak ? "h-3.5 w-3.5" : "h-2 w-2"}`}
                        style={{
                          animationDelay: `${at + 80}ms`,
                          boxShadow: peak
                            ? "0 0 0 5px rgba(247,239,226,0.22), 0 0 18px 4px rgba(247,239,226,0.55)"
                            : "0 0 8px 2px rgba(247,239,226,0.4)",
                        }}
                      />
                    </span>
                    <span
                      className="nv-plot__label absolute -translate-x-1/2 text-[0.72rem] font-medium"
                      style={{
                        left: `${p.x}%`,
                        top: "62%",
                        color: "rgba(247,239,226,0.9)",
                        animationDelay: `${at + 160}ms`,
                      }}
                    >
                      {p.year}
                    </span>
                  </React.Fragment>
                );
              })}

              <p
                className="nv-plot__caption absolute inset-x-0 bottom-0 text-center text-[0.82rem]"
                style={{
                  color: "rgba(247,239,226,0.9)",
                  animationDelay: `${DRAW_MS * 0.45 + POINTS.length * STEP_MS + 220}ms`,
                }}
              >
                Supporting healthier aging over time
              </p>
            </div>
          </PhotoCard>
        </div>

        {/* Required qualifiers, verbatim from the comp. */}
        <div className="mt-8 flex flex-col gap-2 text-[0.78rem] leading-relaxed text-muted">
          <span>Prescription treatment requires medical evaluation and is not guaranteed.</span>
          <span>Treatment and dosing are determined based on individual medical needs. Results vary.</span>
          <span>
            Images and graphics are for illustrative purposes only and do not represent expected or
            guaranteed outcomes
          </span>
        </div>
      </div>
    </section>
  );
}
