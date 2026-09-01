import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { motion as Motion } from "framer-motion";
import Reveal from "../ui/Reveal";


const EASE = [0.2, 0.7, 0.3, 1];
const VIEWPORT_MARGIN = "-80px 0px -80px 0px";
const STEP_GAP = 0.7;
const INK = "#6b511e";
const BODY = "#7a6d58";
const CREAM = "#f7e9c9";
const CREAM_SOFT = "rgba(247,233,201,0.84)";
const PANEL = "#ece1cd";
const PALE_BTN = "#f0e3cb";
const DASH = "rgba(154,120,67,0.42)";
const BRASS = "radial-gradient(circle at 50% 50%, #c1a27a, #9a7843)";
const TAN = "#c89c75";
const TAN_INK = "#6c5540";
const TAN_BTN = "#6b5a24";
const HEAD_FILL = "linear-gradient(135deg, #6b511e 0%, #7f6528 34%, #c6ae87 100%)";
const CARD_R = "rounded-[calc(26px*var(--nv-r-scale,1))]";
const TILE_R = "rounded-[calc(18px*var(--nv-r-scale,1))]";
const TITLE = "nv-weight-keep font-display font-extrabold leading-[1.14]";
const TITLE_SIZE = "text-[clamp(1.3rem,3.4vw,2.5rem)]";
const BODY_SIZE = "text-[clamp(0.8rem,1.02vw,0.95rem)]";
const FINE_SIZE = "text-[clamp(0.76rem,0.92vw,0.88rem)]";
const PART_PAD = "px-4 sm:px-10";
const PART_TOP = "py-7 sm:py-[clamp(2.5rem,6vw,4.5rem)]";
const PART_REST = "pb-7 sm:pb-[clamp(2.5rem,6vw,4.5rem)]";
const RAMP = "bg-clip-text text-transparent";
const rampFill = { backgroundImage: HEAD_FILL };

/* ------------------------- 1. the brass formula panel ------------------------- */

const ACTIVES = [
  {
    label: "Hydroquinone",
    body: "Helps reduce the production of excess melanin responsible for visible dark spots",
  },
  {
    label: "Azelaic Acid",
    body: "Helps address uneven pigmentation while also supporting calmer, clearer-looking skin",
  },
  {
    label: "Kojic Acid",
    body: "Targets another step involved in melanin production to help improve the appearance of stubborn pigmentation",
  },
  {
    label: "Hydrocortisone",
    body: "Helps reduce inflammation and redness that may accompany pigmentation concerns",
  },
  {
    label: "Green Tea EGCG",
    body: "Provides antioxidant support against oxidative and environmental stress",
  },
  {
    label: "Resveratrol",
    body: "Adds additional antioxidant support to help protect the skin from oxidative stress",
  },
];

/* Scattered around the cut-out, as the comp has them. Anything past the middle
   is anchored from the right so that opening it grows inwards and never runs
   off the panel. */
const ACTIVE_SLOTS = [
  { left: "26%", top: "0%" },
  { left: "13%", top: "30%" },
  { right: "12%", top: "30%" },
  { right: "8%", top: "53%" },
  { left: "11%", top: "62%" },
  { right: "6%", top: "78%" },
];

/* A tint at low alpha over the brass, not an opaque fill: the panel behind has
   to stay readable through it, which is what gives the comp's chips their
   glass. */
const GLASS = {
  background: "rgba(247,233,201,0.26)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 12px 30px rgba(88,66,32,0.12)",
};

function ActiveDot() {
  return (
    <span aria-hidden="true" className="relative grid h-2.5 w-2.5 shrink-0 place-items-center">
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(253,246,230,0.8) 0%, rgba(253,246,230,0.24) 45%, rgba(253,246,230,0) 100%)",
        }}
      />
      <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: "#fdf6e6" }} />
    </span>
  );
}

/* Below md the chips are a plain stack with the description already open: there
   is no hover on a phone, and a row of six things to tap before you can read
   them is worse than simply showing the copy. */
function ActiveRow({ item }) {
  return (
    <li
      className={`border border-white/25 px-3 py-2 backdrop-blur-xl ${TILE_R}`}
      style={GLASS}
    >
      <span className="flex items-center gap-2">
        <ActiveDot />
        <span className="text-[0.78rem] font-semibold" style={{ color: CREAM }}>
          {item.label}
        </span>
      </span>
      <p className="mt-0.5 text-[0.71rem] leading-[1.4]" style={{ color: CREAM_SOFT }}>
        {item.body}
      </p>
    </li>
  );
}

/* On the stage the chip is a label-width pill that opens on hover or focus. The
   description keeps a fixed inner width and the shell animates from zero, so a
   closed pill is only as wide as its own label. */
function ActiveChip({ item, slot }) {
  return (
    <li className="group absolute" style={slot}>
      <div
        tabIndex={0}
        className={`cursor-default border border-white/25 px-5 py-3 backdrop-blur-xl transition-shadow duration-500 focus:outline-none ${TILE_R}`}
        style={GLASS}
      >
        <span className="flex items-center gap-2.5">
          <ActiveDot />
          <span className="whitespace-nowrap text-[0.9rem] font-semibold" style={{ color: CREAM }}>
            {item.label}
          </span>
        </span>
        {/* Closed, the shell is zero-wide so the pill is only as wide as its own
            label; the copy keeps a fixed inner width so it does not reflow on
            the way open. The open width steps up at lg because a 16.5rem panel
            does not fit beside the figure at the md breakpoint itself. */}
        <div className="grid w-0 grid-rows-[0fr] overflow-hidden transition-all duration-500 ease-out group-hover:w-[13rem] group-hover:grid-rows-[1fr] group-focus-within:w-[13rem] group-focus-within:grid-rows-[1fr] lg:group-hover:w-[16.5rem] lg:group-focus-within:w-[16.5rem]">
          <div className="overflow-hidden">
            <p
              className="w-[13rem] pt-2 text-[0.78rem] leading-relaxed lg:w-[16.5rem]"
              style={{ color: CREAM_SOFT }}
            >
              {item.body}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

function FormulaPanel({ startTo }) {
  const [staged, setStaged] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setStaged(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className={`mx-auto max-w-[1180px] ${PART_PAD} ${PART_TOP}`}>
      <Reveal>
        <div
          className={`relative overflow-hidden px-4 pb-6 pt-7 sm:px-9 sm:pb-8 sm:pt-12 md:px-12 md:pb-0 md:pt-14 lg:px-16 ${CARD_R}`}
          style={{ background: BRASS }}
        >
          {/* The comp lifts the ground behind the cut-out; without it the
              figure sits on flat brass and reads as a sticker. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background:
                "radial-gradient(60% 100% at 50% 100%, rgba(240,225,196,0.34) 0%, rgba(240,225,196,0) 70%)",
            }}
          />

          <div className="relative">
            {/* The comp breaks after the comma. Below md the line is too long
                to hold, so the break only applies once there is room for it. */}
            <h2 className={`${TITLE} max-w-[26ch] text-[clamp(1.3rem,3.6vw,2.7rem)]`} style={{ color: CREAM }}>
              Multi-active brightening,{" "}
              <span className="md:block">in one prescription cream</span>
            </h2>

            <p className={`mt-3 max-w-[46ch] leading-relaxed sm:mt-5 ${BODY_SIZE}`} style={{ color: CREAM_SOFT }}>
              Luminance combines pigment-targeting, calming, and antioxidant ingredients to help
              improve the appearance of dark spots, uneven tone, and hyperpigmentation
            </p>

            <Link
              to={startTo}
              className="mt-5 inline-flex rounded-full px-8 py-3 text-[0.88rem] font-semibold transition-all duration-300 hover:-translate-y-0.5 sm:mt-7 sm:px-9 sm:py-3.5 sm:text-[0.92rem]"
              style={{ background: PALE_BTN, color: INK }}
            >
              Get Started
            </Link>

            {/* The swirl is decoration: on the phone it sits in the flow as a
                divider, on the stage it floats out of the panel's top corner. */}
            <img
              src="/site/skin-health/luminance-swipe.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="nv-drift mx-auto mt-3 block w-20 sm:mt-6 sm:w-40 md:hidden"
            />
            <img
              src="/site/skin-health/luminance-swipe.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="nv-drift pointer-events-none absolute right-0 top-[4%] hidden w-[30%] max-w-[17rem] md:block lg:right-[2%]"
            />

            <h3
              className={`${TITLE} ${TITLE_SIZE} mt-7 max-w-[21ch] sm:mt-14 md:mt-[clamp(4rem,8vw,7rem)]`}
              style={{ color: CREAM }}
            >
              Six actives
              <span className="block">One focused approach</span>
            </h3>

            <p className={`mt-3 max-w-[52ch] leading-relaxed sm:mt-5 ${BODY_SIZE}`} style={{ color: CREAM_SOFT }}>
              Luminance combines six ingredients that work across different factors involved in
              uneven pigmentation, from excess melanin production to inflammation and oxidative
              stress
            </p>

            {/* The stage. Below md the figure and the chips are simply stacked;
                from md the chips are pinned around her, which is the only place
                the scatter has room to read. */}
            <div className="relative mt-6 sm:mt-10 md:mt-12 md:h-[clamp(23rem,32vw,29rem)]">
              <img
                src="/site/skin-health/luminance-actives.avif"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="mx-auto block w-[44%] max-w-[9.5rem] sm:w-[62%] sm:max-w-[15rem] md:absolute md:bottom-0 md:left-1/2 md:h-full md:w-auto md:max-w-none md:-translate-x-1/2 md:object-contain md:object-bottom"
              />

              <ul className="mt-4 flex flex-col gap-1.5 sm:mt-6 sm:gap-2.5 md:mt-0 md:block md:gap-0">
                {ACTIVES.map((a, i) =>
                  staged ? (
                    <ActiveChip key={a.label} item={a} slot={ACTIVE_SLOTS[i]} />
                  ) : (
                    <ActiveRow key={a.label} item={a} />
                  ),
                )}
              </ul>
            </div>

            {/* From md the figure runs into the card's bottom edge, as the comp
                cuts her, so the footnote lifts off the flow and sits over the
                brass beside her instead of pushing her up off it. */}
            <p
              className="mt-6 text-[0.72rem] italic leading-relaxed sm:text-[0.76rem] md:absolute md:bottom-8 md:left-0 md:mt-0"
              style={{ color: "rgba(247,233,201,0.62)" }}
            >
              Prescription required. Eligibility determined by a licensed provider
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ---------------------------- 2. how the formula works ---------------------------- */

const AREAS = [
  {
    label: "Excess pigment",
    body: "Hydroquinone, kojic acid, and azelaic acid work on pathways involved in melanin production to help reduce visible discoloration",
  },
  {
    label: "Inflammation",
    body: "Hydrocortisone helps calm inflammation and redness that can contribute to an uneven-looking complexion",
  },
  {
    label: "Oxidative stress",
    body: "EGCG and resveratrol provide antioxidant support against environmental and oxidative stress",
  },
];

function ThreeAreas() {
  return (
    <div className={`mx-auto max-w-[1180px] ${PART_PAD} ${PART_REST}`}>
      <Reveal>
        <span className="nv-eyebrow">How the formula works</span>
        <h2 className={`${TITLE} ${TITLE_SIZE} ${RAMP} mt-3 max-w-[22ch]`} style={rampFill}>
          Three areas
          <span className="block">One targeted approach</span>
        </h2>
      </Reveal>

      <div className="mt-5 grid gap-5 sm:mt-12 sm:gap-8 md:grid-cols-3 md:gap-x-10 lg:mt-[6.5rem]">
        {AREAS.map((a, i) => (
          <Reveal as="div" key={a.label} delay={STEP_GAP * i}>
            <div className="flex items-center gap-3">
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[0.66rem] font-bold sm:h-7 sm:w-7 sm:text-[0.72rem]"
                style={{ background: "#9a7843", color: CREAM }}
              >
                {i + 1}
              </span>
              <span
                className="whitespace-nowrap font-mono text-[0.7rem] font-bold uppercase tracking-[0.1em] sm:text-[0.8rem]"
                style={{ color: INK }}
              >
                {a.label}
              </span>
              {i < AREAS.length - 1 && (
                <Motion.span
                  aria-hidden="true"
                  className="hidden h-px flex-1 md:-mr-10 md:block"
                  style={{
                    backgroundImage: `repeating-linear-gradient(90deg, ${DASH} 0 4px, transparent 4px 9px)`,
                  }}
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                  viewport={{ once: true, margin: VIEWPORT_MARGIN }}
                  transition={{ duration: 0.42, ease: EASE, delay: STEP_GAP * i + 0.36 }}
                />
              )}
            </div>

            <p className={`mt-2.5 max-w-[38ch] leading-relaxed sm:mt-6 lg:mt-8 ${BODY_SIZE}`} style={{ color: BODY }}>
              {a.body}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- 3. the complexion ------------------------------- */

function Complexion() {
  return (
    <div className={`mx-auto max-w-[1180px] ${PART_PAD} ${PART_REST}`}>
      <Reveal>
        <div
          className={`overflow-hidden px-4 py-6 sm:px-9 sm:py-10 lg:px-14 lg:py-12 ${CARD_R}`}
          style={{ background: PANEL }}
        >
          <div className="grid items-center gap-5 sm:gap-7 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
            <div>
              <h2 className={`${TITLE} ${TITLE_SIZE} ${RAMP} max-w-[30ch]`} style={rampFill}>
                A clearer,
                <span className="block">more even-looking complexion</span>
              </h2>

              <p className={`mt-3 max-w-[64ch] leading-relaxed sm:mt-6 ${BODY_SIZE}`} style={{ color: BODY }}>
                Luminance is intended to gradually improve areas of excess pigmentation so dark
                spots appear less noticeable and skin tone looks more balanced. The goal is not to
                change your natural skin tone. It is to target areas where pigment has become uneven
              </p>
            </div>

            <div className={`relative aspect-[21/9] w-full overflow-hidden lg:aspect-[9/10] ${TILE_R}`}>
              <img
                src="/site/skin-health/luminance-complexion.avif"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* -------------------------------- 4. the routine -------------------------------- */

const ROUTINE = [
  "Helps address excess pigmentation",
  "Provides antioxidant support",
  "Targets dark spots and uneven skin tone",
];

function Routine() {
  return (
    <div className={`mx-auto max-w-[1180px] ${PART_PAD} ${PART_REST}`}>
      <div className="grid items-center gap-4 sm:gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:gap-14">
        <Reveal as="div">
          {/* The comp stands the tube off vertical: the cap leans left and the
              base kicks right, about 9 degrees counter-clockwise. */}
          <img
            src="/products/luminance.avif"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="mx-auto block w-[36%] max-w-[8.5rem] drop-shadow-2xl sm:w-[42%] sm:max-w-[15rem] lg:w-[72%] lg:max-w-none"
            style={{ transform: "rotate(-9deg)" }}
          />
        </Reveal>

        <Reveal as="div" delay={0.08}>
          <h2 className={`${TITLE} ${TITLE_SIZE} ${RAMP} max-w-[23ch]`} style={rampFill}>
            What Luminance
            <span className="block">brings to your routine</span>
          </h2>

          <ul className="mt-4 flex flex-col gap-3 sm:mt-8 sm:gap-4">
            {ROUTINE.map((r, i) => (
              <Reveal as="li" key={r} delay={0.14 + i * 0.09} y={12} className="flex items-center gap-3">
                <span
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full sm:h-6 sm:w-6"
                  style={{ background: "#9a7843" }}
                >
                  <Check size={12} strokeWidth={3} style={{ color: CREAM }} />
                </span>
                <span className="text-[clamp(0.85rem,1.1vw,1rem)]" style={{ color: BODY }}>
                  {r}
                </span>
              </Reveal>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}

/* ----------------------------- 5. prescription care ----------------------------- */

function Oversight({ startTo }) {
  return (
    <div className={`mx-auto max-w-[1180px] ${PART_PAD} pb-8 sm:pb-[clamp(3rem,6vw,5rem)]`}>
      <Reveal>
        <div className={`relative overflow-hidden ${CARD_R}`} style={{ background: TAN }}>
          <img
            src="/site/skin-health/luminance-oversight.avif"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-right lg:block"
          />
          <div className="relative px-4 pb-6 pt-6 sm:px-9 sm:pb-9 sm:pt-9 lg:w-[58%] lg:px-14 lg:py-[clamp(2rem,3vw,2.5rem)]">
            <span
              className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.6rem]"
              style={{ color: CREAM_SOFT }}
            >
              Prescription care
            </span>

            <h2
              className={`${TITLE} mt-2 max-w-[26ch] text-[clamp(1.15rem,2.5vw,1.9rem)] sm:mt-2.5`}
              style={{ color: CREAM }}
            >
              A stronger formula deserves{" "}
              <span className="lg:block">the right oversight</span>
            </h2>

            <p className={`mt-3 max-w-[54ch] leading-relaxed sm:mt-4 ${FINE_SIZE}`} style={{ color: TAN_INK }}>
              Luminance is a compounded prescription treatment. A licensed provider determines
              whether it is appropriate for your skin and guides your treatment plan
            </p>

            <p className={`mt-2.5 max-w-[54ch] leading-relaxed sm:mt-3.5 ${FINE_SIZE}`} style={{ color: TAN_INK }}>
              Because the formula contains active prescription ingredients, irritation, dryness,
              peeling, redness, burning, or stinging may occur. Your provider can advise you based
              on your skin and medical history
            </p>

            <Link
              to={startTo}
              className="mt-5 inline-flex max-w-[13rem] rounded-full px-6 py-2.5 text-center text-[0.84rem] font-semibold leading-snug transition-all duration-300 hover:-translate-y-0.5 sm:mt-6 sm:px-7 sm:py-3 sm:text-[0.88rem]"
              style={{ background: TAN_BTN, color: CREAM }}
            >
              See if Luminance is right for you
            </Link>

            <p
              className="mt-5 max-w-[54ch] text-[0.68rem] italic leading-relaxed sm:mt-[clamp(1.5rem,2.6vw,2.25rem)] sm:text-[0.72rem]"
              style={{ color: "rgba(247,233,201,0.72)" }}
            >
              Compounded medications are not FDA-approved and have not been reviewed by the FDA for
              safety, effectiveness, or quality
            </p>
          </div>

          <div className="relative aspect-[21/9] w-full lg:hidden">
            <img
              src="/site/skin-health/luminance-oversight.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-right"
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export default function LuminanceSections({ startTo = "/start" }) {
  return (
    <section style={{ background: "#faf8f4" }}>
      <FormulaPanel startTo={startTo} />
      <ThreeAreas />
      <Complexion />
      <Routine />
      <Oversight startTo={startTo} />
    </section>
  );
}
