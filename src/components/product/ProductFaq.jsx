import React, { useState } from "react";

/* Per-product FAQ accordion.

   Short on purpose. This used to run to eight or nine entries built from every
   spec on the product, including the whole safety paragraph, which already has
   its own section further up the page. What is left is the handful of things a
   patient actually asks before starting, in plain language.

   The clinical answers are still read off the reviewed catalogue rather than
   written per product, so they cannot drift from the specs above them. The two
   service answers (packaging, care team) are authored, and state only what the
   site already commits to elsewhere. A product can add its own `faqs` array of
   { q, a } for anything specific to it. */

const spec = (product, label) =>
  product?.specs?.find((s) => s.label === label)?.value || "";

function buildFaqs(product, { otc }) {
  const items = [];

  // First, because it is the thing people want to know before anything else.
  items.push({
    q: "Do I need a prescription?",
    a: otc
      ? "No. You can order this one without a visit, and there is no provider review to wait on."
      : "Yes. A licensed U.S. provider reviews your intake and decides whether this is right for you. You only pay if they prescribe it.",
  });

  const dosing = spec(product, "Dosing Schedule");
  const admin = spec(product, "Administration");
  if (dosing || admin) {
    items.push({ q: "How do I take it?", a: [dosing, admin].filter(Boolean).join(" ") });
  }

  const supply = spec(product, "Days Supply");
  if (supply) {
    items.push({
      q: "How long does one order last?",
      a: `${supply}. Your provider confirms the schedule that fits you, and refills are handled from your patient portal.`,
    });
  }

  items.push({
    q: "How does it arrive?",
    a: "It comes in plain packaging with nothing on the outside that says what is inside, sent to the address you give us.",
  });

  items.push({
    q: "What if I have questions later?",
    a: otc
      ? "Message our care team any time and someone will come back to you."
      : "Message your care team from your patient portal any time, before or after you start.",
  });

  // Product-specific extras win the last word.
  if (Array.isArray(product?.faqs)) items.push(...product.faqs);

  return items;
}

/* The triptych beside the accordion. Middle card is the live one — solid brass
   with the molecule over it — and the outer two are veiled back so the row reads
   as depth rather than three equal tiles. Fixed rather than rotating: the comp
   sets one arrangement, and there is nothing here to page through. */
/* The outer two mirror each other around the live card: each figure is pulled
   toward the centre and the veil sits on the outer edge, so the row closes in on
   the middle rather than reading as three loose tiles. */
const CARDS = [
  {
    key: "lifestyle",
    title: "Sustainable Lifestyle Changes",
    img: "/site/weight-loss/faq-lifestyle.avif",
    place: "items-end",
    anchor: "object-right-bottom",
    veil: "to right",
  },
  { key: "pathway", title: "", img: "", place: "items-start" },
  {
    key: "recover",
    title: "Recover & Soothe",
    img: "/site/weight-loss/faq-recover.avif",
    place: "items-start",
    anchor: "object-left-bottom",
    veil: "to left",
  },
];

function Showcase({ pathwayTitle }) {
  return (
    /* Capped and centred in its column rather than stretched across it: at full
       width the third card ran out to the container edge and the row read as
       pushed away from the accordion instead of sitting beside it. */
    <ul aria-hidden="true" className="mx-auto grid w-full max-w-165 grid-cols-3 gap-3 sm:gap-4">
      {CARDS.map((c) => {
        const live = c.key === "pathway";
        return (
          <li
            key={c.key}
            className={`relative flex aspect-3/4 overflow-hidden rounded-[calc(20px*var(--nv-r-scale,1))] p-4 ${c.place} ${
              live ? "nv-shadow-lg" : ""
            }`}
            style={
              live
                ? { background: "linear-gradient(150deg, #b9955c 0%, #a98757 55%, #9a7843 100%)" }
                : { background: "#ddcbb0" }
            }
          >
            {c.img && (
              <img
                src={c.img}
                alt=""
                loading="lazy"
                /* contain, not cover: these are full-length cut-outs and cover
                   was slicing them off at the chest. Anchored to the bottom so
                   the figure stands on the card floor instead of floating, and
                   to the inner edge so it sits against the live card. */
                className={`absolute inset-0 h-full w-full object-contain ${c.anchor}`}
              />
            )}
            {live && (
              <img
                src="/site/weight-loss/faq-molecule.avif"
                alt=""
                loading="lazy"
                className="pointer-events-none absolute left-1/2 top-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2 opacity-70"
              />
            )}
            {/* Veil on the outer two, and only on the outer edge — a flat wash
                over the whole card dimmed the figure it was meant to frame.
                Mixed from the page ground rather than a literal white so it
                stays the section's own colour. */}
            {!live && (
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(${c.veil}, color-mix(in oklab, #fbfaf7 90%, transparent) 0%, color-mix(in oklab, #fbfaf7 45%, transparent) 45%, transparent 78%)`,
                }}
              />
            )}
            <span
              className={`relative max-w-[17ch] font-display text-[clamp(0.8rem,1.5vw,1.05rem)] font-extrabold leading-tight ${
                live ? "text-[#ffe8b1]" : "text-[#fdf6e6]"
              }`}
            >
              {live ? pathwayTitle : c.title}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function ProductFaq({ product, otc }) {
  const items = buildFaqs(product, { otc });
  const [open, setOpen] = useState(-1);

  if (!items.length) return null;

  /* Named on the catalogue so the card cannot claim a dual pathway on a
     single-pathway drug: tirzepatide sets "Dual-Hormone Pathway", semaglutide
     "GLP-1 Pathway". Anything without a mechanism falls back to the neutral one. */
  const pathwayTitle = product?.mechanism?.cardTitle || "How It Works";

  return (
    /* items-center, not items-start: the accordion column runs taller than the
       card row, and top-aligning left the cards hanging off the top of the
       block with dead space under them. */
    <div className="grid items-center gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div>
        <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight text-[#9a7843]">
          Answer To Your Questions
        </h2>

        <ul className="mt-7 border-t border-line">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="group flex w-full items-start justify-between gap-6 py-4 text-left"
                >
                  <span className="text-[0.98rem] leading-snug text-ink transition-colors group-hover:text-[#9a7843]">
                    {item.q}
                  </span>
                  {/* One glyph, rotated: a plus turns into a cross on open, so
                      nothing swaps mid-transition and the two strokes stay put. */}
                  <span
                    aria-hidden="true"
                    className={`relative mt-1 block h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-muted" />
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-muted" />
                  </span>
                </button>
                {/* Height animation would need a measured max-height; a grid row
                    collapsing from 1fr to 0fr animates cleanly without measuring. */}
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 pr-10 text-[0.9rem] leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Showcase pathwayTitle={pathwayTitle} />
    </div>
  );
}
