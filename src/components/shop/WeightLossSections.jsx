import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Reveal from "../ui/Reveal";

/**
 * The editorial sections below the weight-loss product grid (2026-08 design).
 *
 * Weight-loss only — the copy is GLP-1 specific — so TreatmentShop renders this
 * behind a category check rather than for every listing.
 *
 * Colours are the client's literal palette, matching TreatmentCard: the comp
 * specifies this brass ramp exactly, and deriving it from the runtime accent
 * would drift the moment anyone touches the Design Studio.
 *
 * `to` is threaded in rather than hard-coded so both CTAs land on the same
 * intake the product cards' Get Started uses.
 */

const INCLUDES = [
  {
    title: "GLP-1 Treatment",
    body: "Access to GLP-1 medication, when medically appropriate, as part of your weight-management plan",
  },
  {
    title: "Ongoing Support",
    body: "Stay connected with our care team for questions, check-ins, and treatment guidance",
  },
  {
    title: "Lifestyle Guidance",
    body: "Simple nutrition and movement guidance to help support your progress",
  },
];

/* The supplied status cards, in the comp's left-to-right order. Illustrative
   sample data — none of it reads live patient state, hence "Example" in the alt
   text: a screen reader announcing a fabricated 180 lbs as the listener's own
   figure would be worse than saying nothing. */
const CHIPS = [
  { src: "/site/weight-loss/chip-2.png", alt: "Example progress card: 3 weeks in" },
  { src: "/site/weight-loss/chip-4.png", alt: "Example check-in card: Friday, Aug 28" },
  { src: "/site/weight-loss/chip-1.png", alt: "Example dose card: weekly dose completed, week 3 of 4" },
  { src: "/site/weight-loss/chip-5.png", alt: "Example goal card: stay hydrated" },
  { src: "/site/weight-loss/chip-3.png", alt: "Example summary card: 8 lbs down, goal 160 lbs" },
];

/* Every export is a 1:1 canvas with the card centred inside it and roughly two
   thirds of the height transparent, identically across all five. Laying the raw
   <img> out in a row would space the cards off that baked-in margin instead of
   off the artwork, leaving gaps three times the comp's.

   So the wrapper is the card's true size (h-24 at the comp's 2.28 aspect) and the
   image is blown up to 296% inside it — 1 / 0.338, the art's share of the canvas
   height — which lands the card's own bounds exactly on the wrapper's. Re-measure
   both numbers together if the assets are ever re-exported. */
const CHIP_H = "h-24 w-[13.7rem]";

function Chip({ chip, decorative }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden ${CHIP_H}`}>
      <img
        src={chip.src}
        alt={decorative ? "" : chip.alt}
        aria-hidden={decorative ? "true" : undefined}
        loading="lazy"
        decoding="async"
        className="absolute left-1/2 top-1/2 h-[296%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
      />
    </span>
  );
}

/* The cards drift right-to-left, passing behind the heading on one side and the
   photo on the other — which is what the comp shows with its half-occluded first
   and last card. There are five and only about four fit, so the drift is also how
   the last one gets seen at all.

   The set is rendered twice and .nv-marquee shifts the track by exactly -50%, so
   the second copy is mid-stride where the first began and the loop never seams.
   Each half owns a trailing gutter rather than the track owning a `gap`, because
   a `gap` would make the halves unequal by half a gap and the seam would jump.

   Vertical placement lives here on the wrapper, never on the track: the keyframes
   set `transform` outright, so a `-translate-y-1/2` on the same element would be
   overwritten on the first frame. */
const CHIP_FADE = "linear-gradient(90deg, transparent 0%, #000 9%, #000 95%, transparent 100%)";

function ChipTrack() {
  return (
    <div
      className="pointer-events-none relative z-2 overflow-hidden pb-8 lg:absolute lg:inset-x-0 lg:top-[55%] lg:-translate-y-1/2 lg:pb-0"
      // Cards dissolve into the banner's edges rather than being guillotined by
      // them, so the loop's entry and exit don't pop.
      style={{ maskImage: CHIP_FADE, WebkitMaskImage: CHIP_FADE }}
    >
      <div className="nv-marquee flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-7 pr-7">
            {CHIPS.map((c) => (
              <Chip key={c.src} chip={c} decorative={copy === 1} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const PILLARS = [
  {
    title: "Support That Works With Your Body",
    body: "GLP-1 treatments work with natural hormone pathways involved in appetite and food intake",
  },
  {
    title: "More Control, More Consistency",
    body: "By helping manage appetite, GLP-1 treatment can support healthier routines and long-term weight-management efforts",
    featured: true,
  },
  {
    title: "Why GLP-1 Care?",
    body: "GLP-1 medications are designed to support appetite regulation, giving you another tool to help reach your weight goals",
  },
];

/* Badge and man are separate layers — the chips pass between them — but they have
   to stay geometrically welded, so both sit in an identically-positioned square
   box and are placed as percentages of it. Both PNGs are 2000² with the art inset
   and off-centre, so sizing one off the banner's height and the other off its
   width would slide them apart at every breakpoint; fixing the box's aspect fixes
   the pair. One constant so the two copies can never drift. It's a static string,
   so Tailwind still sees every class in source. */
const ART_BOX = "pointer-events-none absolute bottom-0 right-0 hidden aspect-square h-[116%] lg:block";

function MembershipBanner({ to }) {
  return (
    <Reveal>
      <div
        className="relative overflow-hidden rounded-[calc(22px*var(--nv-r-scale,1))]"
        /* Midpoint stop pulls the darkening forward so the brass has arrived by
           the time the photo does, as in the comp — a plain two-stop ramp keeps
           the light tan going too far across. */
        style={{
          background: "linear-gradient(90deg, #c1a27a 0%, #a98757 52%, #9a7843 100%)",
        }}
      >
        {/* Layer order back to front is badge (1) · chips (2) · man (3) · copy (4),
            set by z-index rather than DOM order: the chips ride between the two
            pieces of art exactly as the comp does — "Stay Hydrated" reads over the
            starburst, then the man's shoulder cuts the chip off.

            DOM order is the mobile order, where the art drops out and the chips
            are back in normal flow underneath the copy — hence copy first here
            even though it paints last. */}
        <div className="relative z-4 px-6 py-[clamp(1.5rem,3vw,2.75rem)] sm:px-9 lg:px-11">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[#ffe8b1]">
            Ongoing Care
          </span>
          {/* Hard break rather than a max-width in ch: the comp sets these two
              lines exactly, and ch on an extrabold display face is too loose a
              ruler to land the break reliably. */}
          <h2 className="mt-2 font-display text-[clamp(1.6rem,4.4vw,2.9rem)] font-extrabold leading-[1.06] text-[#ffe8b1]">
            Your Membership
            <br />
            Includes
          </h2>
          <Link
            to={to}
            className="mt-5 inline-flex rounded-full border-2 border-[#d3b784] bg-[#fdfaf3] px-7 py-2.5 text-[0.95rem] font-semibold text-[#3a2c12] transition-all duration-300 hover:-translate-y-0.5 nv-shadow"
          >
            Start Your Plan
          </Link>
        </div>

        <div className={`${ART_BOX} z-1`}>
          <img
            src="/site/weight-loss/check-badge.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute -left-[25%] top-[13%] w-[73%]"
          />
        </div>

        <ChipTrack />

        <div className={`${ART_BOX} z-3`}>
          <img
            src="/site/weight-loss/membership-man.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      </div>
    </Reveal>
  );
}

function Includes() {
  return (
    <div className="mt-[clamp(3rem,7vw,6rem)] grid items-center gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-2">
      <Reveal as="div">
        <ul className="flex flex-col gap-9">
          {INCLUDES.map((i) => (
            <li key={i.title} className="flex gap-5">
              <span className="mt-0.5 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e0c795] text-[#5c4514]">
                <Check size={22} strokeWidth={3} />
              </span>
              <span>
                <h3 className="font-display text-[clamp(1.15rem,1.5vw,1.45rem)] font-bold leading-tight text-[#725826]">
                  {i.title}
                </h3>
                <p className="mt-2 max-w-[42ch] text-[clamp(0.92rem,1.05vw,1.02rem)] leading-relaxed text-[#8a7a5c]">
                  {i.body}
                </p>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal as="div" delay={0.08}>
        {/* Same trap as the status cards: this export carries ~12.8% transparent
            margin on each side, so a plain <img> lays out ~34% larger than the
            photo you can actually see and pads the row with dead space. The
            wrapper is the visible photo's size and aspect, and the image is
            scaled to 134.5% (1 / 0.744, the art's share of the canvas width) so
            its own bounds land on the wrapper's. Re-measure the pair together if
            the asset is re-exported. */}
        <span className="relative mx-auto block aspect-804/1020 w-full max-w-112.5 overflow-hidden">
          <img
            src="/site/weight-loss/support-chat.png"
            alt="A patient messaging the NovaMDK care team about her goals"
            loading="lazy"
            decoding="async"
            className="absolute left-1/2 top-1/2 w-[134.5%] max-w-none -translate-x-1/2 -translate-y-1/2"
          />
        </span>
      </Reveal>
    </div>
  );
}

function Pillars() {
  return (
    <div className="mt-[clamp(3rem,7vw,6rem)] border-t border-[#e6dcc6] pt-[clamp(2.5rem,6vw,4.5rem)]">
      {/* items-center is what raises the middle card: it's taller, so the two
          beside it centre against it rather than stretching to match. */}
      <div className="grid items-center gap-4 sm:gap-5 lg:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Reveal as="div" key={p.title} delay={(i % 3) * 0.06}>
            <div
              className={`relative flex flex-col justify-center overflow-hidden rounded-[calc(20px*var(--nv-r-scale,1))] ${
                p.featured ? "min-h-88 px-8 py-12 nv-shadow-lg" : "min-h-72 px-7 py-9"
              }`}
              style={{
                background: p.featured
                  ? "linear-gradient(150deg, #9a7843 0%, #b89358 55%, #a6803f 100%)"
                  : "linear-gradient(150deg, #c3ab88 0%, #b39d7c 100%)",
              }}
            >
              {/* Rising-trend motif behind the featured card, per the comp. */}
              {p.featured && (
                <svg
                  viewBox="0 0 320 240"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
                  preserveAspectRatio="none"
                >
                  <g fill="#fff" opacity="0.35">
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <rect key={n} x={26 + n * 48} y={200 - n * 26} width="30" height={40 + n * 26} />
                    ))}
                  </g>
                  <path d="M30 200L280 44" stroke="#fff" strokeWidth="3" fill="none" />
                  <path d="M252 44h30v30" stroke="#fff" strokeWidth="3" fill="none" />
                </svg>
              )}
              <h3
                className={`relative font-display font-extrabold leading-tight ${
                  p.featured
                    ? "text-[clamp(1.3rem,2.2vw,1.7rem)] text-white"
                    : "text-[clamp(1.05rem,1.7vw,1.25rem)] text-[#f3e2b8]"
                }`}
              >
                {p.title}
              </h3>
              <p
                className={`relative mt-3 max-w-[34ch] font-semibold leading-snug text-white ${
                  p.featured ? "text-[0.92rem]" : "text-[0.8rem] text-white/90"
                }`}
              >
                {p.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function StartCare({ to }) {
  return (
    <section
      className="relative flex min-h-[clamp(32rem,55vw,56rem)] flex-col justify-end overflow-hidden"
      style={{ background: "linear-gradient(180deg, #b08d54 0%, #9a7843 62%, #c9ac7c 100%)" }}
    >
      {/* Supplied label pattern, held back so the copy reads over it. */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/site/weight-loss/start-care-labels.png')" }}
      />
      {/* Sized off the section's height and anchored to its floor rather than laid
          out in flow. The export is a square canvas with 12% transparent above her
          and none below, so in flow that margin pushes the copy down instead of
          the photo growing — which is what kept her small. h-full puts her visible
          height at ~88% of the section, the comp's proportion. */}
      <img
        src="/site/weight-loss/start-care-woman.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2"
      />
      <div className="relative mx-auto max-w-[1320px] px-4 pb-[clamp(2rem,5vw,4.5rem)] text-center md:px-6">
        <h2 className="font-display text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight text-[#f1dba6] drop-shadow-[0_2px_10px_rgba(60,44,18,0.45)]">
          Start Weight Care
        </h2>
        <Link
          to={to}
          className="mt-5 inline-flex rounded-full bg-[#fdfaf3] px-7 py-3 text-[0.9rem] font-semibold text-[#3a2c12] transition-all duration-300 hover:-translate-y-0.5 nv-shadow"
        >
          Begin Your Journey
        </Link>
      </div>
    </section>
  );
}

export default function WeightLossSections({ startTo }) {
  return (
    /* Full-bleed — this renders outside TreatmentShop's centred container, so the
       near-white paints edge to edge and lifts these sections off the warm
       gradient the product grid above sits on. */
    <div style={{ background: "#fbfaf7" }}>
      <div className="mx-auto max-w-[1320px] px-4 py-[clamp(3rem,7vw,6rem)] md:px-6">
        <MembershipBanner to={startTo} />
        <Includes />
        <Pillars />
      </div>
      <StartCare to={startTo} />
    </div>
  );
}
