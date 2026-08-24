import React from "react";
import Reveal from "../ui/Reveal";

/**
 * "NAD+ May Support" — the four-card bento below the NAD+ product hero.
 *
 * Mobile-first: one column of stacked cards on a phone, and the comp's bento
 * only assembles from lg up, where there is room for a 3-column grid with the
 * tall card spanning both rows.
 *
 * Colours are the comp's literal brass ramp rather than --nv-* tokens, the same
 * call the other 2026-08 sections make: the sand card and its two-tone copy are
 * specified exactly and would drift the moment anyone touched the Design Studio.
 */

const SAND = "#ece2d2";
const INK = "#5c4a2a";
const SOFT = "#b7a184";

/* Each line is split rather than written as one string: the comp sets the first
   clause in the dark brass and lets the rest fall away to the soft tan, which is
   what gives the block its rhythm. `lead` is the dark half, `tail` the light. */
const CARDS = {
  energy: {
    lead: "Supports your body's",
    tail: " natural energy processes",
    img: "/site/nad/may-support-energy.avif",
  },
  wellness: {
    lead: "Supports overall wellness",
    tail: " and feeling energized",
    img: "/site/nad/may-support-wellness.avif",
  },
  cellular: {
    lead: "Plays an important role in",
    tail: " normal cellular function",
    img: "/products/nad-plus.avif",
  },
  longterm: {
    lead: "Supports the natural processes",
    tail: " involved in long-term wellness",
    img: "/site/nad/may-support-longterm.avif",
  },
};

const CARD_R = "rounded-[calc(20px*var(--nv-r-scale,1))]";
const FRAME_R = "rounded-[calc(16px*var(--nv-r-scale,1))]";

function Copy({ lead, tail, className = "" }) {
  return (
    <p
      className={`font-display text-[clamp(1rem,2.4vw,1.15rem)] font-semibold leading-[1.45] ${className}`}
      style={{ color: INK }}
    >
      {lead}
      <span style={{ color: SOFT }}>{tail}</span>
    </p>
  );
}

export default function NadSupport() {
  return (
    <section className="py-[clamp(2.5rem,5vw,4.5rem)]" style={{ background: "#faf8f4" }}>
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <Reveal>
          <h2 className="text-center font-display text-[clamp(1.6rem,5vw,2.6rem)] font-extrabold leading-tight">
            <span style={{ color: SOFT }}>NAD+</span>{" "}
            <span style={{ color: INK }}>May Support</span>
          </h2>
        </Reveal>

        {/* One column on a phone; the bento only makes sense once there are three
            columns to hang it on, so the tall card's row-span waits for lg. */}
        <div className="mt-[clamp(1.75rem,4vw,3rem)] grid gap-4 lg:grid-cols-3 lg:gap-6">
          {/* ---- tall: framed photo above the copy, two rows from lg ---- */}
          <Reveal as="div" className="h-full lg:row-span-2">
            <div className={`flex h-full flex-col gap-5 p-5 sm:p-6 ${CARD_R}`} style={{ background: SAND }}>
              <span className={`relative block aspect-[0.87] w-full overflow-hidden ${FRAME_R}`}>
                <img
                  src={CARDS.energy.img}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </span>
              <Copy lead={CARDS.energy.lead} tail={CARDS.energy.tail} className="mt-auto max-w-[22ch]" />
            </div>
          </Reveal>

          {/* ---- wellness: arm cut-out standing on the card, no photo frame ---- */}
          <Reveal as="div" delay={0.06} className="h-full">
            <div
              className={`relative flex h-full min-h-[11rem] items-start overflow-hidden p-5 sm:p-6 ${CARD_R}`}
              style={{ background: SAND }}
            >
              <Copy lead={CARDS.wellness.lead} tail={CARDS.wellness.tail} className="relative z-10 max-w-[15ch]" />
              <img
                src={CARDS.wellness.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="pointer-events-none absolute bottom-0 right-0 h-[112%] w-auto max-w-none object-contain object-bottom"
              />
            </div>
          </Reveal>

          {/* ---- cellular: the vial floats on the sand, same as the comp ---- */}
          <Reveal as="div" delay={0.12} className="h-full">
            <div
              className={`relative flex h-full min-h-[11rem] items-start overflow-hidden p-5 sm:p-6 ${CARD_R}`}
              style={{ background: SAND }}
            >
              <Copy lead={CARDS.cellular.lead} tail={CARDS.cellular.tail} className="relative z-10 max-w-[15ch]" />
              {/* Tilted, as in the comp — the one product shot in the section, so
                  the lean is what stops it reading like a catalogue cut-out. */}
              <img
                src={CARDS.cellular.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="pointer-events-none absolute bottom-[8%] right-[4%] h-[84%] w-auto max-w-none rotate-[12deg] object-contain object-bottom"
              />
            </div>
          </Reveal>

          {/* ---- long-term: wide card, framed photo to the right ---- */}
          <Reveal as="div" delay={0.18} className="h-full lg:col-span-2">
            <div
              className={`flex h-full flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:gap-7 ${CARD_R}`}
              style={{ background: SAND }}
            >
              <Copy
                lead={CARDS.longterm.lead}
                tail={CARDS.longterm.tail}
                className="max-w-[24ch] lg:flex-1"
              />
              <span
                className={`relative block aspect-[1.56] w-full overflow-hidden lg:w-[48%] ${FRAME_R}`}
              >
                <img
                  src={CARDS.longterm.img}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
