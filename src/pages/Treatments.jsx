import React, { Suspense, lazy } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Nav/Footer";
import PageHero from "../components/shop/PageHero";
import CategoryGrid from "../components/shop/CategoryGrid";
import TreatmentShop from "../components/shop/TreatmentShop";
import { CONSULTS, CONSULT_ORDER } from "../components/data/consultations";
import { productsData } from "../components/data/products";

const Testimonials = lazy(() => import("../components/Testimonials"));
const FAQ = lazy(() => import("../components/FAQ"));

// Mirror the homepage funnels — each tile starts that category's consultation.
const TREATMENT_CATS = CONSULT_ORDER.map((k) => ({
  name: CONSULTS[k].name,
  tag: CONSULTS[k].tag,
  link: `/start/${k}`,
}));

// Valid product categories a quiz can land on (everything but pure supplements).
const VALID_GOALS = new Set(
  productsData.filter((p) => p.categorySlug !== "supplements").map((p) => p.categorySlug)
);

export default function TreatmentsPage() {
  const [params] = useSearchParams();
  const goal = params.get("goal");
  const validGoal = goal && VALID_GOALS.has(goal) ? goal : null;

  return (
    <main className="min-h-screen w-full bg-bg text-ink">
      <Navbar />

      {validGoal ? (
        /* Came from a consultation → only that category's products (their own header) */
        <TreatmentShop category={validGoal} />
      ) : (
        /* Manual visit → page hero + explore by goal (each tile starts a consultation) */
        <>
          <PageHero
            eyebrow="Treatments"
            title="Find the treatment that fits you."
            subtitle="Prescription protocols formulated by licensed U.S. physicians, shipped to your door."
            chips={["US-licensed pharmacy", "Five-minute visit", "Free 2-day shipping", "No lock-in"]}
          />
          <section className="mx-auto max-w-[1180px] px-5 py-[clamp(2.6rem,5vw,4rem)] md:px-10">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <span className="nv-eyebrow">Explore by goal</span>
              <Link to="/supplements" className="text-[0.92rem] font-semibold text-muted transition-colors hover:text-accent">
                Looking for supplements? →
              </Link>
            </div>
            <CategoryGrid items={TREATMENT_CATS} />
          </section>
        </>
      )}

      {/* Reviews + FAQ (reused, re-themed) */}
      <Suspense fallback={<div className="grid h-[200px] place-items-center bg-bg text-muted">Loading…</div>}>
        <Testimonials />
        <FAQ />
      </Suspense>

      <Footer />
    </main>
  );
}
