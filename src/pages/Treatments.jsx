import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Nav/Footer";
import PageHero from "../components/shop/PageHero";
import CategoryGrid from "../components/shop/CategoryGrid";
import Reveal from "../components/ui/Reveal";

const TreatmentsCarousel = lazy(() => import("../components/TreatmentsCarousel"));

const TREATMENT_CATS = [
  { name: "Weight Loss", tag: "Metabolic", link: "/contact" },
  { name: "Sports Medicine", tag: "Performance", link: "/contact" },
  { name: "Anti-Aging Rx", tag: "Longevity", link: "/contact" },
  { name: "Men's Health", tag: "Vitality", link: "/contact" },
  { name: "Women's Health", tag: "Hormone & cycle", link: "/contact" },
  { name: "Skin Health", tag: "Topical & oral", link: "/contact" },
];

export default function TreatmentsPage() {
  return (
    <main className="min-h-screen w-full bg-bg text-ink">
      <Navbar />

      <PageHero
        eyebrow="Treatments"
        title="Find the treatment that fits you."
        subtitle="Prescription protocols formulated by licensed U.S. physicians — dosed, dated, and shipped to your door. Tell us your goal and we build the plan."
        chips={["US-licensed pharmacy", "Five-minute visit", "Free 2-day shipping", "No lock-in"]}
      />

      {/* Explore by goal — floating-tablet category grid */}
      <section className="mx-auto max-w-[1180px] px-5 py-[clamp(2.6rem,5vw,4rem)] md:px-10">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <span className="nv-eyebrow">Explore by goal</span>
          <Link to="/supplements" className="text-[0.92rem] font-semibold text-muted transition-colors hover:text-accent">
            Looking for supplements? →
          </Link>
        </div>
        <CategoryGrid items={TREATMENT_CATS} />
      </section>

      {/* Featured treatments carousel — the tablet renders that stay */}
      <Suspense fallback={<div className="grid h-[200px] place-items-center bg-bg text-muted">Loading…</div>}>
        <TreatmentsCarousel />
      </Suspense>

      {/* Closing CTA */}
      <section className="mx-auto mb-[clamp(3.5rem,7vw,6rem)] mt-4 max-w-[1180px] px-5 md:px-10">
        <Reveal>
          <div className="flex flex-col items-center gap-5 rounded-[26px] border border-line bg-surface px-6 py-[clamp(2.4rem,5vw,3.6rem)] text-center nv-shadow">
            <span className="nv-eyebrow">Begin</span>
            <h2 className="max-w-[20ch] text-[clamp(1.8rem,4vw,2.7rem)] font-extrabold leading-tight">Five minutes to a protocol that's yours.</h2>
            <p className="max-w-[48ch] text-[1.04rem] text-muted">Answer a few questions and let a doctor do the rest. Nothing to pay until you see your formulation.</p>
            <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[0.96rem] font-semibold text-on-primary transition-all hover:-translate-y-0.5 hover:bg-primary-deep nv-shadow">
              Start your free visit <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
