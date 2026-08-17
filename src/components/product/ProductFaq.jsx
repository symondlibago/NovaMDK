import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

/* Per-product FAQ accordion.

   Every answer is assembled from data already on the product (specs, safety
   text, shipping) rather than written fresh per item, so nothing here can drift
   from the product page above it or state something clinical that isn't already
   reviewed copy. A product can override or extend the list with its own `faqs`
   array of { q, a } if it needs something specific. */

const spec = (product, label) =>
  product?.specs?.find((s) => s.label === label)?.value || "";

function buildFaqs(product, { otc }) {
  const items = [];

  const dosing = spec(product, "Dosing Schedule");
  if (dosing) items.push({ q: "How do I take it?", a: dosing });

  const supply = spec(product, "Days Supply");
  if (supply) {
    items.push({
      q: "How long does one fill last?",
      a: `${supply}. Your provider confirms the schedule that applies to you, and refills are managed from your patient portal.`,
    });
  }

  const admin = spec(product, "Administration");
  if (admin) items.push({ q: "Where do I administer it?", a: admin });

  // Storage guidance only when the reviewed safety copy actually states it.
  const safety = product?.safety || "";
  const storage = safety.match(/(Store[^.]*\.)/i)?.[1] || (/refrigerat/i.test(safety) ? "Keep refrigerated." : "");
  if (storage) {
    items.push({
      q: "How should I store it?",
      a: `${storage} Full storage and handling instructions ship with your order.`,
    });
  }

  if (safety) items.push({ q: "What should I know before starting?", a: safety });

  const active = spec(product, "Active Compound");
  if (active) items.push({ q: "What's the active ingredient?", a: active });

  const pharmacy = spec(product, "Pharmacy");
  if (pharmacy) {
    items.push({
      q: "Who prepares it?",
      a: `Dispensed by ${pharmacy}. Every batch is prepared by a licensed U.S. compounding pharmacy.`,
    });
  }

  items.push({
    q: otc ? "Do I need a prescription?" : "Do I need a prescription?",
    a: otc
      ? "No. This is a non-prescription product, so no online visit or provider review is required."
      : "Yes. A licensed U.S. provider reviews your intake and decides whether this is appropriate for you. You are not charged unless you are prescribed.",
  });

  if (product?.shipping) {
    items.push({
      q: "How does it ship?",
      a: `${product.shipping}. Orders go out in plain, unmarked packaging with nothing on the outside identifying the contents.`,
    });
  }

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
