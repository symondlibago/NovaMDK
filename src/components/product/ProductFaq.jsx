import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

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

export default function ProductFaq({ product, otc }) {
  const items = buildFaqs(product, { otc });
  const [open, setOpen] = useState(0);

  if (!items.length) return null;

  return (
    <div className="mx-auto max-w-[820px]">
      <div className="divide-y divide-line overflow-hidden rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-surface-2/60 md:px-8"
              >
                <span className="text-[0.98rem] font-semibold leading-snug text-ink">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                />
              </button>
              {/* Height animation would need a measured max-height; a grid row
                  collapsing from 1fr to 0fr animates cleanly without measuring. */}
              <div
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-[0.92rem] leading-relaxed text-muted md:px-8">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
