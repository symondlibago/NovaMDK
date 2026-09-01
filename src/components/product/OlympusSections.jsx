import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Reveal from "../ui/Reveal";

/* Olympus Peak editorial. Same contract as the Sermorelin, LDN and Luminance
   blocks: gated on the product name in ProductPage, CTAs land on this page's
   own intake rather than a second entry point. */

const INK = "#6b511e";
const BODY = "#7a6d58";
const CREAM = "#f7e9c9";
const CREAM_SOFT = "rgba(247,233,201,0.84)";
const CREAM_FAINT = "rgba(247,233,201,0.6)";
const RAIL = "rgba(247,233,201,0.28)";
const PALE_BTN = "#f0e3cb";
const BRASS_BTN = "#9a7843";
const TILE = "#f2ead9";
const TILE_HI = "#e2d0b2";
const PANEL = "#f1e8d7";

/* The same circular gradient the other brass panels carry. */
const BRASS = "radial-gradient(circle at 50% 50%, #c1a27a, #9a7843)";

const CARD_R = "rounded-[calc(26px*var(--nv-r-scale,1))]";
const TILE_R = "rounded-[calc(18px*var(--nv-r-scale,1))]";
const TITLE = "nv-weight-keep font-display font-extrabold leading-[1.14]";

/* Floors sized for a phone, not for the desktop comp: 3.4vw does not reach the
   old 1.6rem floor until about 750px, so on a phone the floor IS the size. The
   vw term and the ceiling carry the comp's own scale from sm up. */
const TITLE_SIZE = "text-[clamp(1.3rem,3.4vw,2.5rem)]";
const BODY_SIZE = "text-[clamp(0.8rem,1.02vw,0.95rem)]";

/* One shared block rhythm so the three parts cannot drift apart. */
const PART_PAD = "px-4 sm:px-10";
const PART_TOP = "py-7 sm:py-[clamp(2.5rem,6vw,4.5rem)]";
const PART_REST = "pb-7 sm:pb-[clamp(2.5rem,6vw,4.5rem)]";

/* Unlike the Luminance comp, this one sets every heading in one flat colour,
   cream on the brass and dark brass on the light ground. No ramp. */

/* The comp stands the bottle off vertical, cap leaning right. Set through the
   standalone `rotate` property rather than a transform: nv-drift animates
   `transform`, and an animated transform would replace an inline one outright.
   The two compose. */
const BOTTLE_TILT = { rotate: "8deg" };

function Glow() {
  return (
    <span aria-hidden="true" className="relative grid h-3 w-3 shrink-0 place-items-center">
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(253,246,230,0.78) 0%, rgba(253,246,230,0.22) 45%, rgba(253,246,230,0) 100%)",
        }}
      />
      <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: "#fdf6e6" }} />
    </span>
  );
}

/* ---------------------------- 1. the brass formula ---------------------------- */

const ACTIVES = [
  {
    name: "Tadalafil",
    role: "Supports blood flow",
    body: "A PDE5 inhibitor that helps increase genital blood flow and support physical sexual response",
  },
  {
    name: "Bremelanotide (PT-141)",
    role: "Supports desire and arousal signaling",
    body: "Acts on melanocortin pathways in the brain involved in sexual motivation and arousal",
  },
  {
    name: "Oxytocin",
    role: "Supports sexual receptivity",
    /* The comp repeats tadalafil's PDE5 line here, which reads as a copy/paste
       slip in the Canva file: oxytocin is a neuropeptide, not a PDE5 inhibitor.
       Written to match the product record rather than shipping a wrong
       mechanism on a prescription page. */
    body: "A neuropeptide involved in closeness and bonding that may support sexual receptivity",
  },
];

function FormulaPanel({ startTo }) {
  return (
    <div className={`mx-auto max-w-[1180px] ${PART_PAD} ${PART_TOP}`}>
      <Reveal>
        <div
          className={`relative overflow-hidden px-4 pb-6 pt-7 sm:px-9 sm:pb-8 sm:pt-12 md:px-12 md:pb-0 md:pt-14 lg:px-16 ${CARD_R}`}
          style={{ background: BRASS }}
        >
          <div className="relative">
            {/* -------- the claim -------- */}
            <h2
              className={`${TITLE} max-w-[22ch] text-[clamp(1.3rem,3.6vw,2.7rem)] md:max-w-[26ch]`}
              style={{ color: CREAM }}
            >
              Sexual response is more{" "}
              <span className="md:block">than blood flow</span>
            </h2>

            <p
              className={`mt-3 max-w-[46ch] leading-relaxed sm:mt-5 ${BODY_SIZE}`}
              style={{ color: CREAM_SOFT }}
            >
              Some treatments focus on the physical side of sexual performance alone. Olympus Peak
              takes a broader approach by combining three active ingredients that work across
              different parts of sexual response
            </p>

            <Link
              to={startTo}
              className="mt-5 inline-flex rounded-full px-8 py-3 text-[0.88rem] font-semibold transition-all duration-300 hover:-translate-y-0.5 sm:mt-7 sm:px-9 sm:py-3.5 sm:text-[0.92rem]"
              style={{ background: PALE_BTN, color: INK }}
            >
              Get Started
            </Link>

            {/* The bottle: in the flow on a phone, floated out of the panel's
                top corner once there is a column beside the copy to clear. */}
            <img
              src="/site/sexual-health/olympus-bottle.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="nv-drift mx-auto mt-5 block w-16 sm:w-24 md:hidden"
              style={BOTTLE_TILT}
            />
            <img
              src="/site/sexual-health/olympus-bottle.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="nv-drift pointer-events-none absolute right-[4%] top-[6%] hidden w-[15%] max-w-[9.5rem] md:block lg:right-[8%]"
              style={BOTTLE_TILT}
            />

            {/* -------- the three actives --------
                On a phone this is one column: eyebrow, heading, ladder, figure.
                From md the ladder takes the left and the heading sits above the
                cut-out on the right, as the comp has it. */}
            <div className="mt-8 sm:mt-12 md:mt-[clamp(3.5rem,7vw,6rem)] md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] md:gap-10">
              <div className="md:order-2 md:flex md:flex-col">
                <span
                  className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.62rem]"
                  style={{ color: CREAM_SOFT }}
                >
                  The formula
                </span>
                {/* A floor under the gap to the cut-out: mt-auto alone can
                    resolve to zero when the ladder beside it is short. */}
                <h3 className={`${TITLE} ${TITLE_SIZE} mt-2 max-w-[20ch] md:mb-7`} style={{ color: CREAM }}>
                  Three actives
                  <span className="block">Three distinct roles</span>
                </h3>

                {/* In the column's flow rather than absolutely placed, so the
                    browser guarantees she starts below the heading no matter how
                    the ladder beside her resolves. mt-auto drops her onto the
                    card's bottom edge (the card runs md:pb-0) and the translate
                    carries her through the side padding to be cropped by the
                    card, as the comp crops her. */}
                <img
                  src="/site/sexual-health/olympus-couple.avif"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="mt-auto hidden w-[104%] max-w-none translate-x-12 self-end md:block lg:translate-x-16"
                />
              </div>

              {/* The bottom clearance lives on the wrapper, never on the list:
                  the rail is absolutely positioned against the list's padding
                  box, so padding there would run it well past the last dot. */}
              <div className="md:order-1 md:pb-16">
              <ol className="relative mt-6 flex flex-col gap-6 sm:mt-8 sm:gap-8 md:mt-0 md:gap-11">
                <span
                  aria-hidden="true"
                  className="absolute bottom-2 left-[5px] top-2 w-px"
                  style={{ background: RAIL }}
                />
                {ACTIVES.map((a, i) => (
                  <Reveal as="li" key={a.name} delay={0.1 + i * 0.12} y={14} className="relative flex gap-3.5">
                    <span className="relative z-10 mt-1 flex">
                      <Glow />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.88rem] font-bold sm:text-[0.95rem]" style={{ color: CREAM }}>
                        {a.name}
                      </span>
                      <span
                        className="mt-0.5 block text-[0.8rem] italic sm:text-[0.86rem]"
                        style={{ color: CREAM_SOFT }}
                      >
                        {a.role}
                      </span>
                      <span
                        className="mt-1.5 block max-w-[38ch] text-[0.78rem] leading-relaxed sm:mt-2 sm:text-[0.84rem]"
                        style={{ color: CREAM_SOFT }}
                      >
                        {a.body}
                      </span>
                    </span>
                  </Reveal>
                ))}
              </ol>
              </div>
            </div>

            {/* The cut-out is nested in the right column so the browser can
                guarantee it clears the heading, which means on a phone it would
                land between the heading and its own list. Rendering it again
                here (same URL, one request) puts it after the ladder where it
                belongs in a single column. */}
            <img
              src="/site/sexual-health/olympus-couple.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="mx-auto mt-6 block w-[76%] max-w-[16rem] md:hidden"
            />

            <p
              className="mt-6 text-[0.72rem] italic leading-relaxed sm:text-[0.76rem] md:absolute md:bottom-8 md:left-0 md:mt-0"
              style={{ color: CREAM_FAINT }}
            >
              Prescription required. Eligibility determined by a licensed provider
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ----------------------------- 2. more than one side ----------------------------- */

const SIDES = [
  {
    label: "Desire",
    active: "Bremelanotide",
    img: "/site/sexual-health/olympus-tile-desire.avif",
  },
  {
    label: "Physical performance",
    active: "Tadalafil",
    img: "/site/sexual-health/olympus-tile-performance.avif",
    lead: true,
  },
  {
    label: "Arousal & response",
    active: "Oxytocin",
    img: "/site/sexual-health/olympus-tile-arousal.avif",
  },
];

const SUPPORTS = [
  "Sexual arousal and receptivity",
  "Genital blood flow and physical response",
  "Sexual performance and responsiveness",
  "Orgasmic response",
];

function MoreThanOneSide() {
  return (
    <div className={`mx-auto max-w-[1180px] ${PART_PAD} ${PART_REST}`}>
      <Reveal>
        <h2 className={`${TITLE} ${TITLE_SIZE} max-w-[22ch]`} style={{ color: INK }}>
          Because intimacy has
          <span className="block">more than one side</span>
        </h2>
        <p className={`mt-3 max-w-[62ch] leading-relaxed sm:mt-4 ${BODY_SIZE}`} style={{ color: BODY }}>
          Olympus Peak brings all three into one compounded prescription formula
        </p>
      </Reveal>

      {/* The middle tile is the emphasised one in the comp: deeper fill, larger
          thumbnail, larger label. It keeps that weight at every width. */}
      <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.22fr)_minmax(0,1fr)] md:items-center">
        {SIDES.map((s, i) => (
          <Reveal as="div" key={s.label} delay={i * 0.1}>
            <div
              className={`flex items-center gap-3.5 p-3 transition-transform duration-300 hover:-translate-y-0.5 sm:gap-4 ${
                s.lead ? "sm:p-4" : ""
              } ${TILE_R}`}
              style={{ background: s.lead ? TILE_HI : TILE }}
            >
              <span
                className={`relative shrink-0 overflow-hidden rounded-[calc(12px*var(--nv-r-scale,1))] ${
                  s.lead ? "h-14 w-14 sm:h-16 sm:w-16" : "h-12 w-12 sm:h-14 sm:w-14"
                }`}
              >
                <img
                  src={s.img}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </span>
              <span className="min-w-0">
                <span
                  className={`block font-mono font-bold uppercase leading-tight tracking-[0.08em] ${
                    s.lead ? "text-[0.78rem] sm:text-[0.88rem]" : "text-[0.72rem] sm:text-[0.8rem]"
                  }`}
                  style={{ color: s.lead ? "#8a6a2f" : "#a1834c" }}
                >
                  {s.label}
                </span>
                <span
                  className={`mt-1 block ${s.lead ? "text-[0.84rem] font-semibold" : "text-[0.8rem]"}`}
                  style={{ color: BODY }}
                >
                  {s.active}
                </span>
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div
          className={`mt-4 px-4 py-6 sm:mt-6 sm:px-9 sm:py-10 lg:px-14 lg:py-12 ${CARD_R}`}
          style={{ background: PANEL }}
        >
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-center lg:gap-14">
            <div>
              <span className="nv-eyebrow">What it may support</span>
              <h3 className={`${TITLE} ${TITLE_SIZE} mt-2 max-w-[20ch]`} style={{ color: INK }}>
                Designed for a more
                <span className="block">complete sexual response</span>
              </h3>
            </div>

            <ul className="flex flex-col gap-3 sm:gap-4">
              {SUPPORTS.map((s, i) => (
                <Reveal as="li" key={s} delay={0.12 + i * 0.08} y={12} className="flex items-center gap-3">
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full sm:h-6 sm:w-6"
                    style={{ background: BRASS_BTN }}
                  >
                    <Check size={12} strokeWidth={3} style={{ color: CREAM }} />
                  </span>
                  <span className="text-[clamp(0.85rem,1.1vw,1rem)]" style={{ color: BODY }}>
                    {s}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------ 3. desire is different ------------------------------ */

function DesireIsDifferent({ startTo }) {
  return (
    <div className={`mx-auto max-w-[1180px] ${PART_PAD} pb-8 sm:pb-[clamp(3rem,6vw,5rem)]`}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:items-center lg:gap-14">
        <Reveal as="div">
          <h2 className={`${TITLE} ${TITLE_SIZE} max-w-[24ch]`} style={{ color: INK }}>
            Performance can be physical
            <span className="block">Desire can be different</span>
          </h2>

          <p className={`mt-3 max-w-[52ch] leading-relaxed sm:mt-5 ${BODY_SIZE}`} style={{ color: BODY }}>
            Blood flow may be only one part of the experience. Changes in desire, arousal,
            responsiveness, or physical performance can each affect intimacy differently
          </p>

          <Link
            to={startTo}
            className="mt-5 inline-flex max-w-[13rem] rounded-full px-6 py-2.5 text-center text-[0.84rem] font-semibold leading-snug transition-all duration-300 hover:-translate-y-0.5 sm:mt-7 sm:px-7 sm:py-3 sm:text-[0.88rem]"
            style={{ background: BRASS_BTN, color: CREAM }}
          >
            See if Olympus Peak is right for you
          </Link>

          <p className="mt-5 max-w-[54ch] text-[0.68rem] italic leading-relaxed text-muted sm:mt-[clamp(2rem,4vw,3.5rem)] sm:text-[0.72rem]">
            Olympus Peak is a compounded prescription medication and is not FDA-approved.
            Compounded medications are not reviewed by the FDA for safety, effectiveness, or quality
          </p>
        </Reveal>

        <Reveal as="div" delay={0.08}>
          {/* The figure is bottom-anchored inside the brass so she is cropped by
              the card, and the readout overhangs its top-left corner rather than
              sitting inside the padding. */}
          <div
            className={`relative aspect-[4/3] overflow-hidden sm:aspect-[3/2] lg:aspect-[10/11] ${CARD_R}`}
            style={{ background: BRASS }}
          >
            <img
              src="/site/sexual-health/olympus-figure.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute bottom-0 right-0 h-[86%] w-auto max-w-none object-contain object-bottom sm:h-[92%] lg:h-[78%]"
            />
            <img
              src="/site/sexual-health/olympus-stat.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="nv-drift absolute left-[-3%] top-[7%] w-[62%] max-w-[19rem] drop-shadow-xl sm:w-[52%] lg:left-[-6%] lg:w-[76%]"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default function OlympusSections({ startTo = "/start" }) {
  return (
    <section style={{ background: "#faf8f4" }}>
      <FormulaPanel startTo={startTo} />
      <MoreThanOneSide />
      <DesireIsDifferent startTo={startTo} />
    </section>
  );
}
