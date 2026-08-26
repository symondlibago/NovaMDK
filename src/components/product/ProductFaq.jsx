import React, { useState } from "react";
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

  const pathwayTitle = product?.mechanism?.cardTitle || "How It Works";

  return (
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
