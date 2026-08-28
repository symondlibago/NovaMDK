import React from "react";
import { Link } from "react-router-dom";
/* Aliased: the project lint rule does not count `motion.span` as a use of the
   lowercase binding, so the capitalised alias keeps this file clean. */
import { motion as Motion } from "framer-motion";
import Reveal from "../ui/Reveal";

/* Matched to Reveal's own easing and trigger margin so the rail segments and the
   markers they join are sequenced by one clock rather than two. */
const EASE = [0.2, 0.7, 0.3, 1];
const VIEWPORT_MARGIN = "-80px 0px -80px 0px";

/* Each segment starts at the centre of a column and runs one column wide, so
   the pair spans marker 1 to marker 3. The delays interleave with the markers'
   0 / 0.75 / 1.5. */
const RAILS = [
  { left: "left-[16.667%]", delay: 0.4 },
  { left: "left-1/2", delay: 1.15 },
];

const INK = "#544529";
const BROWN = "#9a8154";
/* The two ends of the "simple" ramp, read off the comp. */
const TAN_DEEP = "#9c8452";
const TAN_PALE = "#d0bd99";
const BODY = "#7a6d58";
const CREAM = "#f4e3c1";
const CREAM_SOFT = "rgba(244,227,193,0.86)";

/* The three small cards and the wide photo card. The wide one is painted the
   photograph's own backdrop so the shot can fade into it with no seam. */
const CARD_TAN = "#f2e9dd";
const MIND_TAN = "#dcc0a8";
const LINE = "#c6ab7d";

const CARD_R = "rounded-[calc(26px*var(--nv-r-scale,1))]";
const TILE_R = "rounded-[calc(18px*var(--nv-r-scale,1))]";
const TITLE = "nv-weight-keep font-display font-extrabold";
const BODY_SIZE = "text-[clamp(0.86rem,1.15vw,0.98rem)]";

const MOMENTS = [
  { t: "Support arousal", d: "Designed to support blood flow and physical response where it matters" },
  { t: "Feel more", d: "Designed to support blood flow and physical response where it matters" },
  { t: "Use it when you need it", d: "Applied before intimacy as directed by your healthcare provider" },
];

/* Set as two lines each, as in the comp, rather than left to wrap. */
const TURNS = [
  ["Topical", "application"],
  ["Designed for use", "before intimacy"],
  ["Provider", "prescribed"],
];

const STEPS = [
  { n: 1, t: "Apply", d: "Use the amount prescribed by your provider on the external intimate area" },
  { n: 2, t: "Give it a little time", d: "Use the amount prescribed by your provider on the external intimate area" },
  {
    n: 3,
    t: "Let the moment happen",
    d: "No complicated routine. Just follow your provider's instructions and continue with your evening",
  },
];

/* ---------------------------- 1. more feeling ---------------------------- */

function MoreFeeling({ startTo }) {
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-8 md:px-10 lg:py-[clamp(2.5rem,6vw,4.5rem)]">
      <div className="grid items-center gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:gap-y-9">
        <Reveal as="div">
          {/* Hard break rather than a ch measure: the comp sets these two lines
              exactly, and ch on an extrabold display face is too loose a ruler
              to land a break reliably. */}
          <h2
            className={`${TITLE} text-[clamp(1.75rem,4.4vw,2.9rem)] leading-[1.12]`}
            style={{ color: BROWN }}
          >
            More feeling
            <br />
            More you
          </h2>
          <p className={`mt-4 max-w-[52ch] leading-[1.55] lg:mt-6 ${BODY_SIZE}`} style={{ color: BODY }}>
            Scream Cream Rx is a provider-prescribed topical treatment designed to support physical
            arousal, sensitivity, and sexual response when you want a little more help getting there
          </p>
          <Link
            to={startTo}
            className="mt-6 inline-flex rounded-full px-8 py-3.5 text-[0.95rem] font-semibold transition-all duration-300 hover:-translate-y-0.5 nv-shadow lg:mt-8"
            style={{ background: "linear-gradient(120deg, #b8975e 0%, #a3854c 100%)", color: "#fdf6e6" }}
          >
            Start Your Assessment
          </Link>
          {/* Required qualifier, verbatim from the comp and set in its italic. */}
          <p className="mt-6 text-[0.76rem] italic leading-relaxed text-muted lg:mt-[clamp(2rem,4vw,3.5rem)]">
            Prescription required. Eligibility determined by a licensed provider
          </p>
        </Reveal>

        <Reveal as="div" delay={0.08}>
          {/* Square on a phone. The comp's 0.82 crop is 427px at full width,
              more than half an 844px screen for one decorative photo. Square is
              as short as this master goes before the window starts cutting the
              eyebrows and chin — the face nearly fills the frame in the source,
              so a landscape crop has nothing spare to lose. */}
          <div className={`relative aspect-square w-full overflow-hidden lg:aspect-[0.82] ${CARD_R}`}>
            <img
              src="/site/sexual-health/scream-feeling.avif"
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

/* ------------------------- 2. moments that matter ------------------------- */

function MomentsThatMatter() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-8 md:px-10 lg:pb-[clamp(2.5rem,6vw,4.5rem)]">
      <Reveal>
        <h2
          /* 22ch, not 16: the ruler is the heading's own size, and at the top of
             the clamp "moments that matter" is wider than 16 of its characters,
             so the hard break was landing and then wrapping again underneath. */
          className={`${TITLE} mx-auto max-w-[22ch] text-center text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.14]`}
          style={{ color: BROWN }}
        >
          Made for the
          <br />
          moments that matter
        </h2>
      </Reveal>

      <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-5 lg:mt-[clamp(2rem,4vw,3rem)]">
        {MOMENTS.map((m, i) => (
          <Reveal as="div" key={m.t} delay={0.06 * i}>
            <div className={`h-full p-5 sm:px-7 sm:py-7 ${TILE_R}`} style={{ background: CARD_TAN }}>
              <h3 className="font-display text-[1.02rem] font-bold leading-tight" style={{ color: BROWN }}>
                {m.t}
              </h3>
              <p className="mt-2 text-[0.8rem] leading-[1.5] sm:mt-3 sm:leading-[1.55]" style={{ color: BODY }}>
                {m.d}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        {/* Copy left, photograph bleeding in from the right. The band is painted
            the shot's own backdrop and the shot is faded along its left edge, so
            the two meet with no seam and the copy sits on open ground. */}
        <div
          className={`relative mt-3 flex min-h-0 flex-col justify-center overflow-hidden px-6 py-7 sm:mt-[clamp(1.5rem,3vw,2.25rem)] sm:min-h-[clamp(17rem,36vw,26rem)] sm:px-11 sm:py-11 ${CARD_R}`}
          style={{ background: MIND_TAN }}
        >
          <img
            src="/site/sexual-health/scream-mind.avif"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="nv-feelfade pointer-events-none absolute inset-y-0 right-0 h-full w-[70%] object-cover object-center sm:w-[58%]"
          />

          {/* A plain width cap, not a ch measure: ch here would resolve against
              the wrapper's inherited 16px while the heading inside sets at more
              than twice that, which is what folded "Sometimes your mind" onto
              two lines. The cap still stops the copy short of the point where
              the photograph's fade has finished. */}
          <div className="relative z-10 max-w-xs sm:max-w-xl">
            <h3
              className={`${TITLE} text-[clamp(1.4rem,3.4vw,2.2rem)] leading-[1.12]`}
              style={{ color: INK }}
            >
              Sometimes your mind
              <br />
              is there
            </h3>
            <p className="mt-4 text-[0.9rem] font-semibold sm:mt-6" style={{ color: INK }}>
              Your body needs a minute
            </p>
            <p className="mt-2 max-w-[44ch] text-[0.82rem] leading-[1.5] sm:mt-3 sm:leading-[1.55]" style={{ color: "#6d5c3e" }}>
              Changes in arousal can happen for all kinds of reasons, from age and hormones to
              stress, medications, and everyday life
            </p>
          </div>
        </div>
      </Reveal>

      <p className="mt-5 text-[0.76rem] italic leading-relaxed text-muted">
        Individual response may vary. Prescription treatment requires evaluation and approval by a
        licensed healthcare provider
      </p>
    </div>
  );
}

/* --------------------------- 3. the brass card --------------------------- */

function MeetScreamCream() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-8 md:px-10 lg:pb-[clamp(2.5rem,6vw,4.5rem)]">
      <Reveal>
        <div
          className={`px-6 py-8 sm:px-10 sm:py-11 lg:px-14 lg:py-14 ${CARD_R}`}
          /* The comp's own fill, read off its colour picker: a circular gradient
             centred at 50% 50%. Same one the Glutathione card uses. */
          style={{ background: "radial-gradient(circle at 50% 50%, #c1a27a, #9a7843)" }}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] lg:gap-14">
            <div>
              <span
                className="block font-mono text-[0.6rem] uppercase tracking-[0.18em]"
                style={{ color: CREAM_SOFT }}
              >
                Meet Scream Cream
              </span>
              <h2
                className={`${TITLE} mt-4 text-[clamp(1.45rem,3.4vw,2.2rem)] leading-[1.14]`}
                style={{ color: CREAM }}
              >
                A little support, right
                <br />
                where you want it
              </h2>
            </div>

            <div className="flex flex-col justify-center gap-5 lg:pt-1">
              <p className="max-w-[46ch] text-[0.86rem] leading-[1.6]" style={{ color: CREAM_SOFT }}>
                Instead of a daily pill or injection, Scream Cream is applied topically before
                intimacy
              </p>
              <p className="max-w-[46ch] text-[0.86rem] leading-[1.6]" style={{ color: CREAM_SOFT }}>
                The prescription blend combines ingredients selected to support blood flow, physical
                sensitivity, and sexual response
              </p>
            </div>
          </div>

          <div className="nv-taketurns mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6 lg:mt-[clamp(2.5rem,6vw,4.5rem)]">
            {TURNS.map(([a, b]) => (
              /* w-fit so the box hugs the longer of the two lines. The ramp is
                 painted across the element, so on a full-width grid cell its
                 bright midpoint would land past the middle of the words. */
              <p
                key={a}
                className={`${TITLE} w-fit bg-clip-text text-transparent text-[clamp(1.15rem,2.4vw,1.55rem)] leading-[1.2]`}
              >
                {a}
                <br />
                {b}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* --------------------------- 4. keep the routine --------------------------- */

function KeepTheRoutine() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 pb-10 md:px-10 lg:pb-[clamp(3rem,6vw,5rem)]">
      <Reveal>
        <h2 className={`${TITLE} text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.14]`} style={{ color: INK }}>
          Keep the routine
          <br />
          {/* Not flat tan: the comp ramps this word left to right, dark gold on
              the "s" to a pale tan by the "e". The span sits on its own line, so
              its box is exactly the word and the ramp lands across the letters
              rather than across the column. */}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(90deg, ${TAN_DEEP} 0%, ${TAN_PALE} 100%)` }}
          >
            simple
          </span>
        </h2>
      </Reveal>

      {/* The rail is two segments, not one bar, so it can run from marker to
          marker in time with them: 1 lands, the line travels to 2, 2 lands, the
          line travels to 3, 3 lands. Each starts at the centre of one column and
          is exactly one column wide, and scaleX from a left origin draws it.
          Only from sm, where the row is horizontal — below that the steps stack
          and there is nothing to connect. */}
      <div className="relative mt-7 grid gap-5 sm:grid-cols-3 sm:gap-6 lg:mt-[clamp(2.5rem,5vw,4rem)]">
        {RAILS.map((r) => (
          <Motion.span
            key={r.left}
            aria-hidden="true"
            className={`pointer-events-none absolute ${r.left} top-5 hidden h-px w-1/3 origin-left sm:block`}
            style={{ background: LINE }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: VIEWPORT_MARGIN }}
            transition={{ duration: 0.5, ease: EASE, delay: r.delay }}
          />
        ))}
        {STEPS.map((s, i) => (
          /* 0.75s apart, not 0.14: all three cross the viewport edge together,
             so the stagger is the only thing sequencing them, and it has to
             leave room for the rail to travel between each pair. */
          /* A phone reads this as a list, so the marker sits beside its step
             rather than stacked above it: three centred columns cost about 145px
             each, the same content in a row costs about 85. From sm the row is
             horizontal and the centred column is back. */
          <Reveal
            as="div"
            key={s.n}
            delay={0.75 * i}
            className="relative flex items-start gap-4 text-left sm:block sm:text-center"
          >
            <span
              className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border font-display text-[0.9rem] font-semibold sm:mx-auto sm:h-10 sm:w-10"
              style={{ borderColor: LINE, color: BROWN, background: "#faf8f4" }}
            >
              {s.n}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-[0.95rem] font-bold sm:mt-4" style={{ color: INK }}>
                {s.t}
              </h3>
              <p
                className="mt-1.5 text-[0.8rem] leading-[1.5] sm:mx-auto sm:mt-2.5 sm:max-w-[30ch] sm:leading-[1.55]"
                style={{ color: BODY }}
              >
                {s.d}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function ScreamCreamSections({ startTo = "/start" }) {
  return (
    <section style={{ background: "#faf8f4" }}>
      <MoreFeeling startTo={startTo} />
      <MomentsThatMatter />
      <MeetScreamCream />
      <KeepTheRoutine />
    </section>
  );
}
