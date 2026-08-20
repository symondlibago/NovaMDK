import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { productsData, visibleProducts } from "../data/products";
import { programsFor, programProductIds } from "../data/subscriptions";
import { programItem, productItem } from "../../lib/programCard";
import { CompoundedDisclaimer } from "../Compliance";
import { QuickViewModal } from "./ProductCard";
import TreatmentCard from "./TreatmentCard";
import WeightLossSections from "./WeightLossSections";
import BackButton from "../ui/BackButton";

/* Column count follows the card count instead of being pinned at 4. A fixed
   lg:grid-cols-4 gave weight-loss — which is two program cards — a quarter of the
   row each and two empty columns, which is what made the cards read as thin. The
   max-width caps how far a short row is allowed to stretch, so two cards land
   near their natural size rather than half a page wide each. Static strings, not
   interpolation: Tailwind scans source text and never sees a built class name. */
const GRID = {
  1: "lg:grid-cols-1 max-w-[420px]",
  2: "sm:grid-cols-2 lg:grid-cols-2 max-w-[760px]",
  3: "sm:grid-cols-2 lg:grid-cols-3 max-w-[1120px]",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

// Product ids pinned to the front of a category's listing (marketing priority).
// Empty since the final-offerings catalog swap — repopulate with new ids as needed.
const PINNED_FIRST = {};

export default function TreatmentShop({ category, showBack = false }) {
  const [quickView, setQuickView] = useState(null);
  const pinned = PINNED_FIRST[category] || [];
  const products = visibleProducts
    .filter((p) => p.categorySlug === category)
    .sort((a, b) => {
      const ai = pinned.indexOf(a.id);
      const bi = pinned.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;      // both unpinned â†’ keep original order
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;                            // both pinned â†’ pinned order
    });
  // The display name has to come from the full catalogue, not the visible list,
  // so the safety net below still has a heading to show.
  const name =
    products[0]?.categoryName ||
    productsData.find((p) => p.categorySlug === category)?.categoryName ||
    "";

  /* One flat grid now. A program contributes a single card at its starting dose,
     and every vial that program covers drops out of the listing so the same
     treatment isn't sold twice on one page. Categories with no programs are
     simply all one-offs. */
  const programs = programsFor(category);
  const inProgram = programProductIds(category);
  const cards = [
    ...programs.map(programItem),
    ...products.filter((p) => !inProgram.has(p.id)).map(productItem),
  ];

  // Safety net only. Categories with nothing shoppable are commented out of the
  // nav, footer, carousel and categoryMeta, and Treatments.jsx redirects their
  // URLs — so this should never render. It exists so a stray link degrades to a
  // sentence rather than a blank page.
  if (!products.length) {
    return (
      <section id="shop" className="scroll-mt-24 bg-surface-2 pb-[clamp(2.5rem,5.5vw,5rem)] pt-2">
        <div className="mx-auto max-w-[1320px] px-4 md:px-6">
          {showBack && (
            <div className="mb-2 text-left">
              <BackButton />
            </div>
          )}
          <div className="mx-auto max-w-[520px] rounded-[calc(28px*var(--nv-r-scale,1))] border border-line bg-surface px-6 py-[clamp(2.5rem,6vw,4rem)] text-center nv-shadow">
            <span className="nv-eyebrow">{name}</span>
            <h2 className="mt-2 text-[clamp(1.6rem,3.4vw,2.2rem)] font-extrabold leading-tight">Not available right now</h2>
            <p className="mx-auto mt-3 max-w-[38ch] text-[1rem] leading-relaxed text-muted">
              Our care team can talk you through the treatments we do offer.
            </p>
            <Link
              to="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[0.95rem] font-semibold text-on-primary transition-all hover:-translate-y-0.5 hover:bg-primary-deep nv-shadow"
            >
              Talk to our care team <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="shop"
      className="scroll-mt-24 pb-[clamp(2.5rem,5.5vw,5rem)] pt-2"
      /* Same shape of gradient the goal grid uses — cream at the top settling
         into the warm tint, on a pixel stop so it doesn't smear over the whole
         section as a percentage would. */
      style={{
        background:
          "linear-gradient(180deg, var(--nv-surface) 0px, color-mix(in oklab, var(--nv-accent) 14%, var(--nv-surface)) 620px)",
      }}
    >
      <div className="mx-auto max-w-[1320px] px-4 md:px-6">
        {/* Back sits inline-left of the centered header from sm up — no stacked
            row above the title, so the header starts at the section's top edge */}
        <div className="relative mb-8 pt-[clamp(1.5rem,4vw,3rem)] text-center sm:mb-10">
          {showBack && (
            <div className="mb-2 text-left sm:absolute sm:left-0 sm:top-[clamp(1.5rem,4vw,3rem)] sm:mb-0">
              <BackButton />
            </div>
          )}
          {/* Gradient fill clipped to the glyphs, using the exact stops the comp
              specifies (radial from the top-left, #d9c797 → #6b511e). The text
              colour has to be transparent for the background to show through. */}
          <h2
            className="bg-clip-text text-[clamp(1.9rem,4.4vw,3.1rem)] font-extrabold leading-[1.1] tracking-tight text-transparent"
            style={{ backgroundImage: "radial-gradient(circle at 0% 0%, #d9c797, #6b511e)" }}
          >
            {name}
          </h2>
          <p className="mx-auto mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-muted sm:text-[1.02rem]">
            Explore prescription options for {name.toLowerCase()} and learn how each treatment works.
          </p>
        </div>

        {/* Up to 4-up per the comp, stepping down to 1-up on phones. */}
        <div
          className={`mx-auto grid grid-cols-1 gap-[clamp(0.9rem,1.6vw,1.35rem)] ${
            GRID[Math.min(cards.length, 4)] || GRID[4]
          }`}
        >
          {cards.map((c, i) => (
            <TreatmentCard
              key={c.key}
              item={c}
              delay={(i % 4) * 0.05}
              floatDelay={-(i % 4) * 0.9}
              onViewDetails={setQuickView}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/treatments"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3 text-[0.95rem] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-primary"
          >
            Explore other goals <ArrowRight size={15} />
          </Link>
        </div>

        {/* required compounded-drug + GLP-1 marketing disclaimers */}
        <CompoundedDisclaimer className="mx-auto mt-10 max-w-[680px] border-t border-line pt-6 text-center" />
      </div>

      {/* Weight-loss only — the copy is GLP-1 specific. `startTo` points at the
          same intake the cards' Get Started uses, so every CTA on the page lands
          in the same place. */}
      {category === "weight-loss" && cards[0] && <WeightLossSections startTo={cards[0].startTo} />}

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
