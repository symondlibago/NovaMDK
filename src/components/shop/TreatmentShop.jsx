import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { productsData, isCompounded } from "../data/products";
import { ComplianceBadges, CompoundedDisclaimer } from "../Compliance";
import BackButton from "../ui/BackButton";

const EASE = [0.16, 1, 0.3, 1];

function ProductCard({ p, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="group flex flex-col rounded-[calc(26px*var(--nv-r-scale,1))] border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:nv-shadow-lg"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.13em] text-accent">{p.categoryName}</span>
        <span className="text-[13px] font-semibold text-muted">{p.price}</span>
      </div>
      <h3 className="text-[1.05rem] font-bold leading-snug text-ink">{p.name}</h3>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {p.dosageForm && (
          <span className="w-fit rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted">
            {p.dosageForm}
          </span>
        )}
        <ComplianceBadges compounded={isCompounded(p)} />
      </div>

      <div className="my-5 flex h-36 items-center justify-center px-2">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="pointer-events-none h-full w-full object-contain mix-blend-multiply drop-shadow-xl transition-transform duration-700 ease-out group-hover:-translate-y-1.5 group-hover:scale-105"
        />
      </div>

      <p className="mb-5 line-clamp-2 text-[0.85rem] leading-relaxed text-muted">{p.subtitle}</p>

      <Link
        to={`/product/${p.id}`}
        className="group/btn mt-auto flex items-center justify-center gap-1.5 rounded-full bg-primary py-3 text-[13.5px] font-semibold text-on-primary transition-all hover:bg-primary-deep nv-shadow"
      >
        Shop now
        <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-0.5" />
      </Link>
      <button className="mt-2 flex w-full items-center justify-center gap-1.5 py-1 text-[11px] font-medium text-muted transition-colors hover:text-ink">
        <ShieldAlert size={13} className="text-primary/70" /> Important safety info
      </button>
    </motion.div>
  );
}

// Product ids pinned to the front of a category's listing (marketing priority).
// Weight Loss → Ozempic (4) then Mounjaro (5) lead the catalog.
const PINNED_FIRST = { "weight-loss": [4, 5] };

export default function TreatmentShop({ category, showBack = false }) {
  const pinned = PINNED_FIRST[category] || [];
  const products = productsData
    .filter((p) => p.categorySlug === category)
    .sort((a, b) => {
      const ai = pinned.indexOf(a.id);
      const bi = pinned.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;      // both unpinned → keep original order
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;                            // both pinned → pinned order
    });
  if (!products.length) return null;
  const name = products[0].categoryName;

  return (
    <section id="shop" className="scroll-mt-24 bg-surface-2 py-[clamp(2.5rem,5.5vw,5rem)]">
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        {showBack && (
          <div className="mb-8">
            <BackButton />
          </div>
        )}
        <div className="mb-8 text-center">
          <span className="nv-eyebrow">Prescription treatments</span>
          <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-tight">
            {name}
          </h2>
          <p className="mx-auto mt-3 max-w-[44ch] text-[1.02rem] text-muted">
            Pick a treatment to start your visit — a licensed provider confirms the right fit before anything ships.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(0.9rem,1.6vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} delay={(i % 3) * 0.05} />
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
    </section>
  );
}
