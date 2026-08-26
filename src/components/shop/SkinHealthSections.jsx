import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Reveal from "../ui/Reveal";

/**
 * The editorial sections below the skin-health product grid (2026-08 design).
 *
 * Skin health only — the copy names skin concerns throughout — so TreatmentShop
 * renders it behind a category check, the same way it gates the weight-loss,
 * anti-aging, men's-health and sports-medicine blocks.
 *
 * Colours are the comp's literal palette rather than --nv-* tokens, as in the
 * sibling blocks: this one runs on a warm gold and a beige panel that no runtime
 * token produces, and deriving any of it from the accent would drift the moment
 * anyone touches the Design Studio.
 *
 * Written mobile-first throughout — every layout starts as a single stacked
 * column and only splits into the comp's two- and four-across arrangements at
 * `sm` and `lg`.
 */

const GROUND = "#f8f6f2";
const PANEL = "#ebe4d8";
const INK = "#4a4238";
const MUTED = "#6b5e4b";
const GOLD = "#a8874e";
const GOLD_LIGHT = "#c3a56d";
const GOLD_DEEP = "#5f4c2c";
const CREAM = "#f1e4c2";
const PILL = "#ede5d6";

const CARD_R = "rounded-[calc(24px*var(--nv-r-scale,1))]";
const TILE_R = "rounded-[calc(18px*var(--nv-r-scale,1))]";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/* --------------------- 1. hero + "routine" panel, one card -------------------- */

/* The comp joins these two: the photograph has the rounded top corners and the
   beige panel the rounded bottom ones, with no seam between them. So they are one
   overflow-hidden card with two children rather than two stacked cards. */

const TRUST = [
  { img: "/site/skin-health/trust-clinician.png", label: "Licensed provider review" },
  { img: "/site/skin-health/trust-phone.png", label: "Prescription skin treatment options" },
  { img: "/site/skin-health/trust-delivery.png", label: "Online care with home delivery" },
];

function HeroCard({ startTo }) {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-[clamp(1.5rem,3vw,2.5rem)] md:px-10">
      <Reveal as="div">
        <div className={`overflow-hidden ${CARD_R}`}>
          {/* Her face sits in the right third of the frame, so the crop is pulled
              that way on a phone — object-center would land the headline on her
              and leave the empty sky off-screen. */}
          <div className="relative flex min-h-[clamp(20rem,64vw,30rem)] items-center justify-center px-5 py-12 sm:px-10">
            <img
              src="/site/skin-health/hero-sky.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-center"
            />

            {/* The comp runs white type straight over the sky. It holds because
                the sky is a mid blue, but only just, so this is the minimum pool
                that keeps it legible without flattening the gradient. */}
            <span
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(58% 46% at 50% 46%, rgba(40,44,52,0.28) 0%, rgba(40,44,52,0.14) 58%, rgba(40,44,52,0) 100%)",
              }}
            />

            <div className="relative z-10 text-center">
              <h2 className="nv-weight-keep mx-auto max-w-[16ch] font-display text-[clamp(1.6rem,5.4vw,3.1rem)] font-extrabold leading-[1.1] text-white drop-shadow-[0_2px_16px_rgba(30,34,42,0.4)]">
                It might be time for something better
              </h2>

              <p className="mx-auto mt-3 max-w-[34ch] text-[clamp(0.8rem,2.6vw,1rem)] leading-relaxed text-white/90 drop-shadow-[0_1px_10px_rgba(30,34,42,0.45)]">
                See what could work better for your skin
              </p>

              <Link
                to={startTo}
                className="mt-6 inline-flex rounded-full px-7 py-3 text-[0.85rem] font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: PILL, color: INK }}
              >
                See Your Options
              </Link>
            </div>
          </div>

          {/* One column on a phone, the comp's two from lg. The photo strip needs
              the full width to itself below that — three landscape frames in half
              a tablet's width are unreadable. */}
          <div
            className="grid gap-8 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12"
            style={{ background: PANEL }}
          >
            <div>
              <h2 className="nv-weight-keep font-display text-[clamp(1.4rem,4.6vw,2.4rem)] font-extrabold leading-[1.14]">
                {/* Two weights and two golds in one sentence, per the comp: the
                    lighter gold carries the setup and the deeper one lands the
                    phrase. Split with a span rather than two blocks so it still
                    wraps as one paragraph at any width. */}
                <span style={{ color: GOLD_LIGHT }}>Sometimes, your routine can only do </span>
                <span style={{ color: GOLD }}>so much</span>
              </h2>

              <p
                className="mt-4 max-w-[42ch] text-[clamp(0.78rem,2.4vw,0.9rem)] leading-relaxed"
                style={{ color: INK }}
              >
                If your usual routine isn&apos;t giving you what you&apos;re looking for, there may be
                another option
              </p>
            </div>

            <TrustReel />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------- the trust reel ------------------------------ */

/* Three frames, the middle one large and the flanking two small, all sitting on
   one centre line, advancing on their own. Only the centred frame's label shows —
   which is why the comp carries a single caption under a row of three.

   Everything is a percentage of the reel's own width, so it needs no measuring
   pass and no ResizeObserver: each frame is positioned by how many slots it sits
   from the active one, and animates its own left and width. Centre is 34% wide
   and the flanks 24%, on a 30% pitch, which leaves the ~1% gap the comp has.

   The list is tripled and the index lives in the middle copy so there is always a
   frame waiting on both sides. Once the index walks off the middle copy it is
   pulled back a copy's length with transitions suppressed for one frame — the
   copies are identical, so the reader sees nothing. */
const REEL = [...TRUST, ...TRUST, ...TRUST];
const REEL_MID = TRUST.length;
const SLOT_MS = 3400;

function slotStyle(offset) {
  const w = offset === 0 ? 34 : 24;
  return { left: `${50 + offset * 30 - w / 2}%`, width: `${w}%` };
}

function TrustReel() {
  const [i, setI] = useState(REEL_MID);
  const [snap, setSnap] = useState(false);

  useEffect(() => {
    // The stylesheet flattens transition durations under reduced motion, which
    // would turn this into a jump cut every few seconds rather than calming it
    // down. Nothing moves at all instead.
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (still?.matches) return undefined;

    const id = setInterval(() => setI((n) => n + 1), SLOT_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (i < REEL_MID + TRUST.length) return undefined;
    // Two frames: the first paints the rebased position with transitions off,
    // the second turns them back on before the next tick.
    setSnap(true);
    setI(i - TRUST.length);
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setSnap(false));
    });
    return () => {
      cancelAnimationFrame(first);
      if (second) cancelAnimationFrame(second);
    };
  }, [i]);

  const active = TRUST[i % TRUST.length];

  return (
    <div>
      <div className="relative overflow-hidden">
        {/* Sizes the reel: same width and ratio as the centre slot, so the box
            follows the largest frame without a hard height anywhere. */}
        <div className="invisible mx-auto aspect-[4/3] w-[34%]" />

        {REEL.map((t, k) => {
          const offset = k - i;
          // Two slots either side of the three on show. Those land at -22% and
          // 98%, so the clip hides them — which is the point: a frame mounts out
          // there and travels in, rather than appearing at the edge of the reel
          // out of nothing.
          if (Math.abs(offset) > 2) return null;

          return (
            <div
              key={k}
              className={`absolute top-1/2 -translate-y-1/2 overflow-hidden ${TILE_R}`}
              style={{
                ...slotStyle(offset),
                transition: snap ? "none" : `left 620ms ${EASE}, width 620ms ${EASE}`,
              }}
            >
              <img
                src={t.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="block aspect-[4/3] w-full object-cover"
              />
            </div>
          );
        })}
      </div>

      {/* Keyed on the label so the fade replays whenever the reel lands on the
          next frame. Not a live region: an auto-advancing one would announce
          itself every few seconds with nothing having been asked of it. */}
      <div key={active.label} className="nv-fade-in mt-5 flex items-start justify-center gap-2.5">
        <CheckDot />
        <span className="text-[clamp(0.76rem,2.3vw,0.86rem)] leading-snug" style={{ color: INK }}>
          {active.label}
        </span>
      </div>
    </div>
  );
}

/* The comp's bullet: a filled brass disc with a white tick, not an outline. Sized
   in rem rather than by the text, so a wrapping label does not stretch it. */
function CheckDot() {
  return (
    <span
      className="mt-0.5 inline-flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center rounded-full"
      style={{ background: GOLD }}
      aria-hidden="true"
    >
      <Check size={12} strokeWidth={3} color="#fff" />
    </span>
  );
}

/* ---------------------------- 2. the gold band ---------------------------- */

function BeyondRoutine({ startTo }) {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-[clamp(2.5rem,6vw,4.5rem)] md:px-10">
      <Reveal as="div">
        <div
          className={`relative overflow-hidden ${CARD_R}`}
          /* The comp's own fill, read off the Canva swatch rather than sampled:
             a circular gradient centred on the card, light middle to dark edge. */
          style={{ background: "radial-gradient(circle at 50% 50%, #c1a27a 0%, #9a7843 100%)" }}
        >
          {/* Stacked on a phone: copy first, then the figure standing on the
              band's floor. From lg she moves into the left third and the copy
              takes the right, which is the comp's arrangement. */}
          {/* The comp's card is 1.81:1. Driven off vw rather than an aspect ratio
              because the card stops widening at the 1320 wrapper while the
              viewport does not, so the rem ceiling is what actually holds the
              proportion on a wide screen. */}
          <div className="relative flex flex-col items-center gap-8 px-6 pb-0 pt-10 text-center sm:px-10 lg:min-h-[clamp(26rem,52vw,43rem)] lg:flex-row lg:items-end lg:gap-0 lg:pt-0 lg:text-left">
            <div className="order-2 w-full max-w-[26rem] lg:order-1 lg:max-w-none lg:flex-[0_0_46%]">
              {/* `cover` from lg, not `contain`. Contained, she is fitted inside
                  the box and lands about 80% of the band's height with air above
                  and below; the comp runs her the full height and lets the crop
                  take her hair at the top and her shoulders at the bottom. She is
                  centred in her own export, so the horizontal crop that comes with
                  filling by height falls evenly either side of her face. */}
              <img
                src="/site/skin-health/routine-figure.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                /* The percentage moves the crop window, not the subject, so it
                   reads backwards: a higher number shows more of the export's
                   right-hand side, which slides her left in the frame and buys
                   the fingers of her far hand room before the column's edge. */
                className="block h-auto w-full object-contain object-bottom lg:absolute lg:bottom-0 lg:left-0 lg:h-[90%] lg:w-[48%] lg:object-cover lg:object-[56%_center]"
              />
            </div>

            {/* Top-aligned from lg, not centred: the comp seats the heading about
                a sixth of the way down and lets the copy finish well above the
                floor, which is what leaves the tube its corner. The pad tracks the
                card's own width, since that is what sets the card's height. */}
            <div className="order-1 lg:order-2 lg:flex-1 lg:self-start lg:pl-4 lg:pt-[clamp(2rem,9vw,7.5rem)]">
              {/* The break is explicit because no single max-width produces it:
                  the comp breaks after "beyond", and greedy wrapping at a width
                  that fits "your everyday routine" also fits "An option beyond
                  your" on the line before. The span only goes block from lg, so
                  the phone still wraps to its own column. */}
              <h2
                className="nv-weight-keep mx-auto max-w-[22ch] font-display text-[clamp(1.5rem,5vw,2.9rem)] font-extrabold leading-[1.12] lg:mx-0"
                style={{ color: CREAM }}
              >
                An option beyond <span className="lg:block">your everyday routine</span>
              </h2>

              <p className="mx-auto mt-5 max-w-[44ch] text-[clamp(0.76rem,2.3vw,0.92rem)] leading-relaxed text-white/90 lg:mx-0">
                Your care continues with access to follow-ups, treatment guidance, and refill
                support as needed
              </p>

              <Link
                to={startTo}
                className="mt-6 inline-flex rounded-full px-7 py-3 text-[0.85rem] font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: PILL, color: INK }}
              >
                See Your Options
              </Link>
            </div>

            {/* Decoration only, and the first thing to go: below lg the band has
                no width to spare for it beside the figure and the copy.

                The height is of the element, and the export carries transparent
                margin, so the tube itself renders a good deal shorter than the
                number reads — hence 78% for a tube that measures about 57% of the
                band in the comp. Same reason the inset is nearly nothing. */}
            <img
              src="/products/luminance.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="pointer-events-none absolute -bottom-[3%] -right-[6%] hidden h-[74%] w-auto max-w-none rotate-[14deg] object-contain drop-shadow-[0_20px_36px_rgba(70,54,26,0.34)] lg:block"
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* --------------------------- 3. what are you noticing --------------------------- */

/* The comp scatters these rather than aligning them: each frame has its own
   height and sits at its own offset, which is what stops the row reading as a
   plain grid. `lift` is the offset, applied only from sm — stacked two-up on a
   phone they need to line up or the column gaps go ragged. */
const NOTICING = [
  {
    img: "/site/skin-health/notice-marks.png",
    label: "Those marks that just won't seem to fade",
    ratio: "aspect-[2/3]",
    lift: "",
  },
  {
    img: "/site/skin-health/notice-uneven.png",
    label: "When some areas look darker or different than the rest",
    ratio: "aspect-[2/3]",
    lift: "sm:translate-y-5",
  },
  /* TODO: the comp's third frame is a dry-skin texture close-up that was not in
     the handoff — this is the section-4 photograph standing in for it. Swap the
     src once the real export lands. */
  {
    img: "/site/skin-health/guided-skin.png",
    label: "When your skin feels dry, tired, or just not as fresh",
    ratio: "aspect-[2/3]",
    lift: "sm:translate-y-1",
  },
  {
    img: "/site/skin-health/notice-breakout.png",
    label: "When a breakout is gone, but the mark sticks around",
    ratio: "aspect-[2/3]",
    lift: "sm:translate-y-4",
  },
];

function Noticing() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 pt-[clamp(3rem,7vw,5.5rem)] md:px-10">
      <Reveal as="div">
        <h2 className="nv-weight-keep font-display text-[clamp(1.4rem,4.6vw,2.2rem)] font-extrabold leading-[1.24]">
          <span className="block" style={{ color: GOLD_DEEP }}>
            What are you noticing
          </span>
          <span className="block" style={{ color: GOLD_LIGHT }}>
            in your skin?
          </span>
        </h2>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4 sm:gap-x-5">
          {NOTICING.map((n) => (
            <li key={n.label} className={n.lift}>
              <div className={`overflow-hidden ${TILE_R}`}>
                <img
                  src={n.img}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className={`block w-full object-cover ${n.ratio}`}
                />
              </div>
              <p
                className="mt-3 text-[clamp(0.72rem,2.2vw,0.82rem)] leading-snug"
                style={{ color: MUTED }}
              >
                {n.label}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

/* ------------------------------ 4. guided panel ----------------------------- */

const GUIDED = [
  "Tell us about your skin, health history, current medications, and treatment goals",
  "A licensed physician reviews your information and determines whether prescription treatment is medically appropriate for you.",
];

function Guided() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 pt-[clamp(3rem,7vw,5.5rem)] md:px-10">
      <Reveal as="div">
        <div className="grid gap-9 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <h2
              className="nv-weight-keep max-w-[15ch] font-display text-[clamp(1.5rem,5vw,2.4rem)] font-extrabold leading-[1.16]"
              style={{ color: GOLD }}
            >
              You don&apos;t need to figure everything out on your own
            </h2>

            <ul className="mt-7 grid gap-4">
              {GUIDED.map((g) => (
                <li key={g} className="flex items-start gap-3">
                  <CheckDot />
                  <span
                    className="max-w-[46ch] text-[clamp(0.76rem,2.3vw,0.86rem)] leading-relaxed"
                    style={{ color: INK }}
                  >
                    {g}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Squarer than the source frame, which is a tall portrait: the comp
              crops it to sit level with the copy beside it rather than running
              past the bottom of the column. */}
          <div className={`overflow-hidden ${CARD_R}`}>
            <img
              src="/site/skin-health/guided-skin.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="block aspect-[5/4] w-full object-cover"
            />
          </div>
        </div>

        <p
          className="mt-9 max-w-[52ch] text-[clamp(0.68rem,2vw,0.76rem)] italic leading-relaxed"
          style={{ color: MUTED }}
        >
          Prescription treatment is available only when medically appropriate and prescribed by a
          licensed healthcare provider. Individual results may vary.
        </p>
      </Reveal>
    </div>
  );
}

/* ----------------------------- 5. closing band ---------------------------- */

function ExploreBand({ startTo }) {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-[clamp(3rem,6vw,5rem)] pt-[clamp(3rem,7vw,5.5rem)] md:px-10">
      <Reveal>
        <div
          /* Raised to the same 1.8:1 the other gold band runs at. She is fitted
             by height, so the band's proportion is half of how large she can get
             before her head starts leaving the frame. */
          className={`relative flex min-h-[clamp(22rem,52vw,40rem)] items-end justify-center overflow-hidden px-6 pb-[clamp(2rem,4.5vw,3.5rem)] ${CARD_R}`}
          style={{ background: "radial-gradient(circle at 52% 44%, #c3a670 0%, #a2854b 100%)" }}
        >
          {/* .nv-bandfade dissolves her shoulders into the gradient, as the comp
              does — the export is a hard cutout and reads pasted on without it.

              Over 100% on purpose: she is stood on the band's floor, so the height
              scales her and the overflow comes off the top, where the export is
              empty gold above her hair. Push it much past this and the crop starts
              taking the hair itself. */}
          <img
            src="/site/skin-health/explore-figure.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="nv-bandfade pointer-events-none absolute bottom-0 left-1/2 h-[97%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
          />

          <div className="relative z-10 text-center">
            <h2
              className="nv-weight-keep mx-auto max-w-[12ch] font-display text-[clamp(1.6rem,4.4vw,3.1rem)] font-extrabold leading-[1.12]"
              style={{ color: CREAM }}
            >
              Explore Skin Health
            </h2>

            <Link
              to={startTo}
              className="mt-5 inline-flex rounded-full border px-7 py-2.5 text-[0.9rem] font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{ borderColor: "rgba(241,228,194,0.6)", color: CREAM }}
            >
              Begin Your Journey
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------- main export ------------------------------- */

export default function SkinHealthSections({ startTo = "/start" }) {
  return (
    <div style={{ background: GROUND }}>
      <HeroCard startTo={startTo} />
      <BeyondRoutine startTo={startTo} />
      <Noticing />
      <Guided />
      <ExploreBand startTo={startTo} />
    </div>
  );
}
