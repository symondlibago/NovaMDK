import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Reveal from "../ui/Reveal";

/**
 * The editorial block on the Glutathione product page (2026-08 design).
 *
 * Glutathione only — the copy names the molecule — so ProductPage renders it
 * behind a name check, the way it already gates the NAD+ sections.
 *
 * Colours are the comp's literal palette rather than --nv-* tokens: this page
 * runs on the same brass ramp the rest of the marketing pages use, and deriving
 * it from the runtime accent would drift the moment anyone touches the Design
 * Studio.
 *
 * Every claim here is the comp's own wording, which stays inside what the
 * catalogue already says: an antioxidant the body makes, provider-guided, no
 * outcome promised.
 */

/* Read off the comp rather than borrowed from the brass ramp the rest of the
   site uses: these headings sit noticeably darker and less golden than the
   category pages', and the body copy is a cooler grey-brown than the tan. */
const INK = "#544529";
const TAN = "#b9a179";
const BODY = "#7a6d58";

/* The ramp runs across the tail words alone — "every day", "naturally" — not
   across the whole heading. It starts at the ink on the word's first letter and
   has reached the tan by its last, which is why the comp's "eve|ry" and
   "natur|ally" change colour mid-word. Spread over the entire block instead, the
   same two stops barely register. */
const TITLE = "nv-weight-keep font-display font-extrabold leading-[1.14]";
/* Both headings are the same size in the comp; mine were a third too small. */
const TITLE_SIZE = "text-[clamp(1.6rem,3.6vw,2.85rem)]";
const BODY_SIZE = "text-[clamp(0.9rem,1.2vw,1.05rem)]";

function Ramp({ children }) {
  return (
    <span
      className="bg-clip-text text-transparent"
      style={{ backgroundImage: `linear-gradient(90deg, ${INK} 0%, ${TAN} 100%)` }}
    >
      {children}
    </span>
  );
}
const CREAM = "#f4e3c1";
const CREAM_SOFT = "rgba(244,227,193,0.88)";

const CARD_R = "rounded-[calc(26px*var(--nv-r-scale,1))]";

/* Left column of the brass card. Support, not treat — the verbs are the comp's
   and they are deliberately soft. */
const WITHIN = [
  "Support your skin from within",
  "Everyday antioxidant support",
  "Support your overall wellness",
];

/* ------------------------- 1. already using it ------------------------- */

function AlreadyUsing() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-[clamp(2.5rem,6vw,4.5rem)] md:px-10">
      {/* Vial in the middle with a column of copy either side, per the comp.
          Below lg it stacks copy → vial → copy, which keeps the vial between
          the two passages rather than stranding it at the top. */}
      {/* The two columns hang differently in the comp: the left one starts level
          with the top of the vial, the right one sits centred against it. The
          vial is the tallest thing in the row, so self-start and the row's own
          centring do exactly that without any offsets. */}
      <div className="grid items-center gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)_minmax(0,1fr)]">
        <Reveal as="div" className="lg:self-start">
          {/* Hard breaks, not a measure in ch: the comp sets these three lines
              exactly, and ch on an extrabold display face is too loose a ruler
              to land a break reliably — it drifted to four lines the moment the
              type came up to size. */}
          <h2 className={`${TITLE} ${TITLE_SIZE}`} style={{ color: INK }}>
            Support something
            <br />
            your body is already
            <br />
            using <Ramp>every day</Ramp>
          </h2>
          <p className={`mt-5 max-w-[46ch] leading-[1.5] ${BODY_SIZE}`} style={{ color: BODY }}>
            Your body naturally makes it, but levels can change with age, stress, lifestyle, and
            environmental exposure
          </p>
        </Reveal>

        {/* The tilted render, per the comp — the upright one stays on the shelf
            card. Both are trimmed to the glass, so neither needs an inset
            correction; this is sized directly and floats. */}
        <Reveal as="div" delay={0.06} className="order-first lg:order-none">
          <span className="nv-float mx-auto block w-[52%] max-w-[13rem] sm:w-[38%] lg:w-full">
            <img
              src="/products/glutathione-tilted.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="block h-auto w-full drop-shadow-[0_22px_34px_rgba(104,82,50,0.22)]"
            />
          </span>
        </Reveal>

        <Reveal as="div" delay={0.12}>
          {/* Same reason as the left column: the comp breaks after "comes". */}
          <h2 className={`${TITLE} ${TITLE_SIZE}`} style={{ color: INK }}>
            Some support comes
            <br />
            <Ramp>naturally</Ramp>
          </h2>
          <p className={`mt-4 max-w-[46ch] leading-[1.5] ${BODY_SIZE}`} style={{ color: BODY }}>
            Glutathione works throughout the body to help protect cells from everyday oxidative
            stress
          </p>
        </Reveal>
      </div>
    </div>
  );
}

/* --------------------------- 2. the brass card --------------------------- */

function NotSurfaceLevel() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-[clamp(2.5rem,6vw,4.5rem)] md:px-10">
      <Reveal>
        <div
          className={`px-7 py-9 sm:px-10 sm:py-11 lg:px-14 lg:py-14 ${CARD_R}`}
          /* The comp's own fill, read off its colour picker: a circular gradient
             centred at 50% 50%, not the diagonal linear ramp I had guessed. */
          style={{ background: "radial-gradient(circle at 50% 50%, #c1a27a, #9a7843)" }}
        >
          {/* One rule between the columns, drawn with a border on the second so
              it cannot outlive the layout: below lg the columns stack and the
              border simply does not apply. */}
          <div className="grid gap-9 lg:grid-cols-2 lg:gap-0">
            <div className="lg:pr-12">
              <h3
                className="nv-weight-keep max-w-[13ch] font-display text-[clamp(1.4rem,3.2vw,2.05rem)] font-extrabold leading-[1.12]"
                style={{ color: CREAM }}
              >
                Good skin isn&apos;t only surface level
              </h3>
              <ul className="mt-7 flex flex-col gap-4">
                {WITHIN.map((w) => (
                  <li key={w} className="flex items-center gap-3.5">
                    <span
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
                      style={{ background: "rgba(244,227,193,0.24)", color: CREAM }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span className="text-[0.92rem]" style={{ color: CREAM }}>
                      {w}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:border-l lg:border-[#f4e3c1]/30 lg:pl-12">
              <h3
                className="nv-weight-keep max-w-[13ch] font-display text-[clamp(1.4rem,3.2vw,2.05rem)] font-extrabold leading-[1.12]"
                style={{ color: CREAM }}
              >
                Why injectable glutathione?
              </h3>
              <p className="mt-6 text-[0.92rem] font-semibold leading-relaxed" style={{ color: CREAM }}>
                Injectable glutathione doesn&apos;t rely on digestion
              </p>
              <p className="mt-3 max-w-[44ch] text-[0.88rem] leading-relaxed" style={{ color: CREAM_SOFT }}>
                Your provider reviews your health history and goals, then determines whether
                treatment makes sense for you and what your plan should look like
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------- 3. good skin starts ------------------------- */

function GoodSupport({ startTo }) {
  return (
    /* Opens the block now, so it carries the top space the old first section
       used to. */
    <div className="mx-auto max-w-[1180px] px-5 py-[clamp(2.5rem,6vw,4.5rem)] md:px-10">
      <div className="grid items-center gap-x-12 gap-y-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)]">
        <Reveal as="div">
          <h2
            className="nv-weight-keep max-w-[15ch] font-display text-[clamp(1.7rem,4.2vw,2.8rem)] font-extrabold leading-[1.12]"
            style={{ color: INK }}
          >
            Good skin starts with good support
          </h2>
          <p className="mt-5 max-w-[48ch] text-[0.9rem] leading-relaxed" style={{ color: BODY }}>
            Glutathione is an antioxidant your body already makes. Provider-guided treatment may
            help support your skin&apos;s natural defenses, healthy-looking tone, and overall
            cellular health
          </p>
          <Link
            to={startTo}
            className="mt-8 inline-flex rounded-full px-8 py-3.5 text-[0.95rem] font-semibold transition-all duration-300 hover:-translate-y-0.5 nv-shadow"
            style={{
              background: "linear-gradient(120deg, #b8975e 0%, #a3854c 100%)",
              color: "#fdf6e6",
            }}
          >
            See if it&apos;s right for you
          </Link>
          {/* Required qualifier, verbatim from the comp and set in its italic. */}
          <p className="mt-[clamp(2rem,4vw,3.5rem)] text-[0.76rem] italic leading-relaxed text-muted">
            Prescription required. Eligibility determined by a licensed provider
          </p>
        </Reveal>

        <Reveal as="div" delay={0.08}>
          <div className={`relative aspect-[0.8] w-full overflow-hidden ${CARD_R}`}>
            <img
              src="/site/skin-health/glutathione-portrait.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ----------------------------- 4. closing band ---------------------------- */

function HowYouWantToFeel() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-[clamp(3rem,6vw,5rem)] md:px-10">
      <Reveal>
        {/* The photograph's own backdrop is this tan, so the band is painted the
            same colour and the shot is faded out along its left edge — the two
            meet with no seam and the copy sits on open ground. */}
        <div
          className={`relative flex min-h-[clamp(16rem,34vw,25rem)] flex-col justify-between overflow-hidden px-7 py-8 sm:px-11 sm:py-10 ${CARD_R}`}
          style={{ background: "#c4a279" }}
        >
          <img
            src="/site/skin-health/glutathione-feel.avif"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="nv-feelfade pointer-events-none absolute inset-y-0 right-0 h-full w-[72%] object-cover object-right sm:w-[62%]"
          />

          <h2
            className="nv-weight-keep relative z-10 max-w-[11ch] font-display text-[clamp(1.6rem,4.4vw,2.9rem)] font-extrabold leading-[1.1]"
            style={{ color: CREAM }}
          >
            Support how you want to feel
          </h2>

          <p
            className="relative z-10 mt-10 max-w-[46ch] text-[0.74rem] leading-relaxed"
            style={{ color: "rgba(253,246,230,0.82)" }}
          >
            Individual results may vary. Treatment is subject to evaluation and approval by a
            licensed healthcare provider. Compounded medications are not FDA-approved.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

export default function GlutathioneSections({ startTo = "/start" }) {
  return (
    /* The comp's order: the pitch and its closing band come first, then the
       explanation of what glutathione is and the card that answers why it is
       injected. I had the two halves the wrong way round. */
    <section style={{ background: "#faf8f4" }}>
      <GoodSupport startTo={startTo} />
      <HowYouWantToFeel />
      <AlreadyUsing />
      <NotSurfaceLevel />
    </section>
  );
}
