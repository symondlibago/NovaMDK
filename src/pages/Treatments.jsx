import React, { Suspense, lazy } from "react";
import { Link, useParams, useSearchParams, Navigate } from "react-router-dom";
import {
  Stethoscope, Truck, Lock, FlaskConical, ShieldCheck, ClipboardCheck, PackageOpen, ArrowRight,
} from "lucide-react";
import Seo from "../components/Seo";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Nav/Footer";
import CategoryGrid from "../components/shop/CategoryGrid";
import TreatmentShop from "../components/shop/TreatmentShop";
import Reveal from "../components/ui/Reveal";
import { CONSULTS, CONSULT_ORDER } from "../components/data/consultations";
import { visibleProducts } from "../components/data/products";
import { CATEGORY_META } from "../lib/categoryMeta";
import { track, EVENTS } from "../lib/analytics";

const FAQ = lazy(() => import("../components/FAQ"));
// Weight-loss only: the tool qualifies you for these treatments specifically.
const BmiCalculator = lazy(() => import("../components/tools/BmiCalculator"));

/* Cut-out art per goal (2026-08 design). Each is a square master anchored to the
   card's right edge — see CutoutCard. The right-nudges are measured, not eyeballed:
   the subject sits at a different left edge inside each square (weight 28%, recover
   0%, longevity 17%, skin 8%, the pill pair 31%), and a square tall enough to fill
   the card is wider than the space left of the copy. Shifting right by the shortfall
   keeps every subject clear of the text block at the 3-up desktop width.

   `motion` picks the card's hover layer and `figureMotion` the figure's own
   restraint-level polish — both are plain CSS classes, see .nv-goal in index.css. */
const CAT_ART = {
  // Every square is now just over the card height, so none of them leave a band
  // of bare tan at the top or bottom. The right offsets are derived, not picked:
  // resizing a right-anchored square drags its subject sideways, so each one is
  // the number that holds that subject where it was.
  // `bg` is the client's exact per-card colour, so these are literal hex rather
  // than palette tokens — they step lighter down the grid and that ramp is the
  // design, not something derivable from --nv-accent. It overrides the .nv-goal
  // fallback because Tailwind's utilities layer sorts after components.
  "weight-loss": {
    // Nudged ~2% further right than centre, per the comp.
    cutout: "/site/goals/weightlossnobg.png",
    cutoutClass: "-top-[2%] h-[104%] right-[-4%]",
    bg: "bg-[#a2845d]",
    motion: "arrow",
  },
  "mens-health": {
    cutout: "/site/goals/sexual-wellness.avif",
    cutoutClass: "-top-[6%] h-[112%] right-[-7%]",
    bg: "bg-[#c1a27a]",
    motion: "glow",
    figureMotion: "float",
  },
  "unisex-sports-medicine": {
    // His figure fills only the left ~59% of the square, so seating the square's
    // left edge at the card's is what puts him in the left corner. Anchored with
    // left-0, not a right-% — the square is sized off the card's *height* while a
    // right-% resolves against its *width*, so one percentage cannot seat him left
    // at both the 3-up card (315×320) and the 1-up phone card (~335×240).
    cutout: "/site/goals/sportsmedperson.png",
    cutoutClass: "-top-[1%] h-[102%] left-0",
    bg: "bg-[#d1b995]",
    motion: "spark",
  },
  "unisex-anti-aging-rx": {
    cutout: "/site/goals/longetivity.png", // note the spelling — not longevity.avif
    cutoutClass: "-top-[4%] h-[108%] right-[-8%]",
    bg: "bg-[#d1c0a0]",
    motion: "orbs",
  },
  "unisex-skin-health": {
    cutout: "/site/goals/glowing.png",
    cutoutClass: "-top-[3%] h-[106%] right-[-4%]",
    bg: "bg-[#ddd1b7]",
    motion: "glow",
    figureMotion: "zoom",
  },
};

// Mirror the homepage funnels — each tile browses that goal's shoppable catalog.
// The sixth cell closes the 2×3 grid and is the catch-all for anyone who doesn't
// see their goal: it replaces the quiz / BMI links that used to sit in the header.
const TREATMENT_CATS = [
  ...CONSULT_ORDER.map((k) => ({
    name: CONSULTS[k].name,
    tag: CONSULTS[k].tag,
    blurb: CONSULTS[k].blurb,
    cta: "Browse treatments",
    goal: CONSULTS[k].goalSlug,
    link: `/treatments/${CONSULTS[k].goalSlug}`,
    ...(CAT_ART[CONSULTS[k].goalSlug] || {}),
  })),
  {
    kind: "goal-cta",
    name: "Not Sure Where To Start?",
    cta: "Take Quick Assessment",
    goal: "quick-assessment",
    link: "/start",
    bg: "bg-linear-to-br from-[#f4eddd] to-[#fceed2]",
  },
];

// Valid product categories a quiz can land on (everything but pure supplements).
// Driven by visibility: a category with nothing shoppable is commented out of the
// nav, footer and carousel, so its URL should redirect here rather than render an
// empty shelf.
const VALID_GOALS = new Set(
  visibleProducts.filter((p) => p.categorySlug !== "supplements").map((p) => p.categorySlug)
);

const TRUST = [
  { icon: ShieldCheck, label: "Doctor-guided care", sub: "Always backed by medical experts." },
  { icon: Lock, label: "Discreet & confidential", sub: "Private care, delivered discreetly." },
  { icon: FlaskConical, label: "Provider-reviewed treatment options", sub: "Treatment decisions based on each patient's clinical evaluation." },
  { icon: Truck, label: "Delivered to your door", sub: "Fast, discreet, and convenient." },
];

const STEPS = [
  { icon: ClipboardCheck, title: "Take the 2-minute assessment", desc: "Answer a few private questions about your goals and history — no wrong answers." },
  { icon: Stethoscope, title: "A provider builds your plan", desc: "A licensed U.S. clinician reviews your intake and prescribes what actually fits you." },
  { icon: PackageOpen, title: "Delivered to your door", desc: "Fast, discreet delivery — with ongoing care and easy adjustments anytime." },
];

// Mirrors the homepage band — "Waiting rooms" was dropped at the client's request.
const STATS = [
  { b: "100%", s: "Physician-reviewed" },
  { b: "Fast", s: "Doorstep delivery" },
  { b: "1:1", s: "Provider messaging" },
];

/* ------------------------------- sections ------------------------------- */
function TrustBand() {
  return (
    /* A contained card rather than a full-bleed band, so it reads as the closing
       row of the goal grid above it. */
    <section className="mx-auto max-w-[1180px] px-5 pb-[clamp(2.5rem,5vw,4.5rem)] md:px-10">
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 rounded-[calc(18px*var(--nv-r-scale,1))] border border-line bg-surface px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((t) => (
          <div key={t.label} className="flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[calc(9px*var(--nv-r-scale,1))] bg-surface-2 text-primary">
              <t.icon size={15} strokeWidth={1.9} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[0.82rem] font-bold leading-tight text-ink">{t.label}</span>
              <span className="mt-0.5 text-[0.76rem] leading-snug text-muted">{t.sub}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-[clamp(2.5rem,5vw,5.5rem)] md:px-10">
      <Reveal className="mx-auto max-w-[60ch] text-center">
        <span className="nv-eyebrow">How it works</span>
        <h2 className="mt-3 text-[clamp(1.7rem,3.6vw,2.5rem)] font-extrabold leading-tight">Care in three simple steps</h2>
        <p className="mt-3 text-[1.02rem] leading-relaxed text-muted">From first question to front door — no clinics, no waiting rooms, no awkward pharmacy runs.</p>
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal as="div" key={s.title} delay={(i % 3) * 0.08}>
            <div className="relative h-full rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface p-7 nv-shadow">
              <span className="absolute right-6 top-6 font-mono text-[1.15rem] font-bold text-line-strong">0{i + 1}</span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-on-primary"><s.icon size={22} /></span>
              <h3 className="mt-5 font-display text-[1.15rem] font-bold leading-tight">{s.title}</h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-[clamp(2rem,4vw,3rem)] md:px-10">
      <Reveal>
        <div className="relative overflow-hidden rounded-[calc(28px*var(--nv-r-scale,1))] border border-line bg-surface-2 px-6 py-[clamp(2.4rem,5vw,3.4rem)] text-ink md:px-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(60% 90% at 85% 0%, color-mix(in srgb, var(--nv-accent) 18%, transparent), transparent 70%)" }}
          />
          <div className="relative flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div>
              <h2 className="max-w-[20ch] font-display text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold leading-tight">Care patients can actually stick with.</h2>
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-4 sm:gap-x-12">
              {STATS.map((s) => (
                <div key={s.s} className="text-center">
                  <b className="block text-[clamp(1.6rem,3.5vw,2.4rem)] font-extrabold tracking-tight text-primary">{s.b}</b>
                  <span className="mt-1 block font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">{s.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function TreatmentsPage() {
  const { goal: goalParam } = useParams();
  const [params] = useSearchParams();
  const legacyGoal = params.get("goal");

  // Legacy ?goal= URLs redirect to the crawlable /treatments/:goal path.
  if (legacyGoal && VALID_GOALS.has(legacyGoal)) {
    return <Navigate to={`/treatments/${legacyGoal}`} replace />;
  }
  if (goalParam && !VALID_GOALS.has(goalParam)) {
    return <Navigate to="/treatments" replace />;
  }
  const validGoal = goalParam || null;
  const catMeta = validGoal ? CATEGORY_META[validGoal] : null;

  return (
    <main
      className="min-h-screen w-full text-ink"
      /* Cream at the top, settling into the warm tint by the time the goal grid
         starts. The stop is a pixel length, not a percentage — main runs the whole
         page, so a percentage would smear the fade across every section below.
         A gradient holds its last colour past the final stop, so everything from
         900px down stays flat. */
      style={{
        background:
          "linear-gradient(180deg, var(--nv-surface) 0px, color-mix(in oklab, var(--nv-accent) 14%, var(--nv-surface)) 900px)",
      }}
    >
      <Seo
        title={catMeta ? catMeta.title : "Treatments — Physician-Prescribed Telehealth Care"}
        description={catMeta ? catMeta.description : "Explore Nova MDK treatments for weight loss, longevity, skin health, sexual wellness and recovery — prescribed online by licensed physicians and shipped to your door."}
        path={validGoal ? `/treatments/${validGoal}` : "/treatments"}
      />
      <Navbar />

      {validGoal ? (
        /* Came from a consultation → only that category's products (their own header) */
        <>
          <TreatmentShop category={validGoal} showBack />
          {validGoal === "weight-loss" && (
            /* Wider than the 1180 the rest of the page runs at, with a thinner
               gutter: the calculator is a two-column instrument and the extra
               width is what keeps the dial and the scale from squashing. */
            <section className="mx-auto max-w-[1440px] px-4 pb-[clamp(1rem,3vw,2rem)] md:px-6">
              <Reveal className="mb-8 max-w-[52ch]">
                <span className="nv-eyebrow">Free tool</span>
                <h2 className="mt-2 text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold leading-tight">
                  See where you stand
                </h2>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-muted">
                  Use the sliders to estimate your BMI and see which category it falls into.
                </p>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
                  This tool is a screening aid only, and does not predict individual outcomes.
                </p>
                <p className="mt-3 text-[0.9rem] font-semibold text-ink">No sign-up required.</p>
              </Reveal>
              <Suspense fallback={<div className="grid h-[320px] place-items-center text-muted">Loading calculator…</div>}>
                <Reveal><BmiCalculator /></Reveal>
              </Suspense>
              <p className="mt-6 max-w-[90ch] text-[0.8rem] leading-relaxed text-muted">
                For general information only. This is not medical advice, does not create a
                patient-provider relationship, and is not a determination that you will be prescribed
                anything.{" "}
                <Link to="/weight-loss-calculator" className="font-medium text-primary hover:underline">
                  See the full BMI reference
                </Link>
                .
              </p>
            </section>
          )}
        </>
      ) : (
        /* Manual visit → explore by goal (each tile starts a consultation). No
           PageHero here: the comp opens straight on the goal grid, with its own
           left-aligned heading rather than the centered page header the other
           shop pages use. */
        <>
          {/* Narrower than the 1180px the rest of the page runs at: the goal cards
              read better a little taller than wide, and squeezing the track is what
              buys that without touching the 3-up grid. The header narrows with it so
              the copy stays flush with the first card's left edge. */}
          <section className="mx-auto max-w-[1060px] px-5 pb-[clamp(2.6rem,5vw,4rem)] pt-[clamp(3.2rem,7vw,5.5rem)] md:px-10">
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="max-w-[19ch] text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-[1.1] text-primary">
                  Explore treatments for your goals
                </h1>
                <p className="mt-4 max-w-[56ch] text-[1rem] leading-relaxed text-muted">
                  Explore prescription treatment options for a range of health and wellness goals.
                  Learn what each treatment is, how it works, and what to expect before starting
                  your assessment
                </p>
              </div>
              {/* Same destination as the sixth grid cell — /start is the existing
                  consultation quiz, which opens on its category picker when no
                  goal is chosen. */}
              <Link
                to="/start"
                onClick={() => track(EVENTS.QUIZ_STARTED, { source: "treatments-header" })}
                className="group shrink-0 sm:pt-3"
              >
                <span className="block text-[0.98rem] font-bold text-ink">Not sure where to start?</span>
                <span className="mt-1.5 inline-flex items-center gap-2.5 text-[0.94rem] text-muted transition-colors duration-300 group-hover:text-primary">
                  Take a quick assessment
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </div>
            {/* No `featured` here: the sixth cell squares the grid off at 2×3, and a
                double-width first tile would break that back into three ragged rows. */}
            <CategoryGrid
              items={TREATMENT_CATS}
              onItemClick={(it) => track(EVENTS.CATEGORY_SELECTED, { category: it.goal, source: "treatments" })}
            />
          </section>  
        </>
      )}

      <TrustBand />
      {/* Weight-loss carries its own membership/pillars/CTA block from
          WeightLossSections, which already covers this ground — the three-step
          explainer and the stats band just repeat it there. */}
      {validGoal !== "weight-loss" && (
        <>
          <HowItWorks />
          <SocialProof />
        </>
      )}

      {/* FAQ (reused, re-themed). Testimonials live on the homepage only. */}
      <Suspense fallback={<div className="grid h-[200px] place-items-center bg-bg text-muted">Loading…</div>}>
        <FAQ />
      </Suspense>

      <Footer />
    </main>
  );
}
