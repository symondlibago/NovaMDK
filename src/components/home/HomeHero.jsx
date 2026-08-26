import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
/* Aliased: the project lint rule does not count `motion.div` as a use of the
   lowercase binding, so the capitalised alias keeps this file clean. */
import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CONSULTS, CONSULT_ORDER } from "../data/consultations";
import { productsData, isHidden } from "../data/products";
import { GOAL_ART } from "../../lib/goalArt";
import { productPath } from "../../lib/slug";
import { track, EVENTS } from "../../lib/analytics";

const EASE = [0.22, 0.61, 0.18, 1];
/* shelf/tirzepatide.png is a Zepbound pen, not the vial the comp shows, so this
   points at the catalogue's own tirzepatide.avif — the same GIP/GLP-1 vial the
   treatments pages use. */
const FEATURED = {
  id: 5,
  name: "Tirzepatide",
  label: "Weight management",
  img: "/products/tirzepatide.avif",
};

const SHELF = [
  { id: 1, name: "GLP-1", label: "Appetite & metabolic support", img: "/products/shelf/semaglutide.png" },
  { id: 26, name: "Low-Dose Naltrexone", label: "Inflammation & wellness support", img: "/products/shelf/ldn.png" },
  { id: 29, name: "Luminance", label: "Dark spot & skin tone support", img: "/products/shelf/luminance.png" },
  { id: 32, name: "Olympus Peak", label: "Support for strength & vitality", img: "/products/shelf/olympus-peak.png" },
  { id: 16, name: "NAD+", label: "Helps support daily energy", img: "/products/shelf/nad-plus.png" },
  { id: 13, name: "SubMagna Drops", label: "Weight management drops", img: "/products/shelf/submagna.png" },
];

const SPOT_COPY = {
  "weight-loss": {
    tag: "Appetite & metabolic support",
    name: "GLP-1",
    blurb: "Weekly dosing, provider-adjusted as you go",
  },
};

const SPOTS = CONSULT_ORDER.map((key) => {
  const c = CONSULTS[key];
  const art = GOAL_ART[c.goalSlug] || {};
  return {
    key,
    goal: c.goalSlug,
    to: `/treatments/${c.goalSlug}`,
    tag: c.tag,
    name: c.name,
    blurb: c.blurb,
    ...SPOT_COPY[c.goalSlug],
    img: art.hero,
    imgClass: art.heroClass,
    bg: art.heroBg,
  };
}).filter((s) => s.img);

const SPOT_MS = 4200;

const VIDEO_SCRIM =
  "linear-gradient(96deg, rgba(22,16,9,0.86) 0%, rgba(22,16,9,0.66) 38%, rgba(22,16,9,0.3) 68%, rgba(22,16,9,0.12) 100%)";
const SPOT_SCRIM =
  "linear-gradient(96deg, rgba(42,29,10,0.8) 0%, rgba(42,29,10,0.62) 34%, rgba(42,29,10,0.4) 60%, rgba(42,29,10,0.22) 82%, rgba(42,29,10,0.12) 100%)";

const TITLE_FILL = "radial-gradient(circle at 0% 0%, #6b511e, #d9c797)";

const CARD_R = "rounded-[calc(20px*var(--nv-r-scale,1))]";
const TILE_R = "rounded-[calc(14px*var(--nv-r-scale,1))]";

/* Shared by both wide cards: eyebrow and copy up top, CTA pinned to the floor. */
function CardCopy({ tag, name, blurb, cta, big = false }) {
  return (
    <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 lg:p-7">
      <div className="max-w-[26ch]">
        <span className="block font-mono text-[0.56rem] uppercase tracking-[0.18em] text-[#f4e3bd] sm:text-[0.6rem]">
          {tag}
        </span>
        <h2
          className={`nv-weight-keep mt-2 font-display font-bold leading-[1.1] text-white ${
            big
              ? "text-[clamp(1.35rem,4.6vw,1.9rem)]"
              : "text-[clamp(1.35rem,4.6vw,2.1rem)]"
          }`}
        >
          {name}
        </h2>
        <p className="mt-2 text-[0.8rem] leading-snug text-white/75 sm:text-[0.85rem]">{blurb}</p>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-[0.78rem] font-semibold text-white transition-all duration-300 group-hover:gap-3 sm:text-[0.84rem]">
        {cta}
        <ArrowRight size={14} strokeWidth={2.4} />
      </span>
    </div>
  );
}

function VideoCard() {
  return (
    <Link
      to="/treatments"
      onClick={() => track(EVENTS.BROWSE_TREATMENTS, { source: "hero-video" })}
      className={`group relative block aspect-[1.5/1] overflow-hidden sm:aspect-[1.7/1] lg:aspect-[2.25/1] ${CARD_R} nv-shadow-lg transition-transform duration-500 hover:-translate-y-1`}
    >
      <video
        src="/video/right-vid.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1200ms] group-hover:scale-105"
      />
      <span className="pointer-events-none absolute inset-0" style={{ background: VIDEO_SCRIM }} />
      <CardCopy
        tag="New here"
        name="Explore your treatments"
        blurb="Answer a few questions and a licensed provider matches you to a plan"
        cta="Find your match"
      />
    </Link>
  );
}

function SpotlightCard() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || SPOTS.length < 2) return undefined;
    const t = setTimeout(() => setActive((v) => (v + 1) % SPOTS.length), SPOT_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  const s = SPOTS[active];
  if (!s) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Link
        to={s.to}
        onClick={() => track(EVENTS.CATEGORY_SELECTED, { category: s.goal, source: "hero-spotlight" })}
        aria-live="polite"
        className={`group relative block aspect-[1.5/1] overflow-hidden sm:aspect-[1.7/1] lg:aspect-[2.25/1] ${CARD_R} nv-shadow-lg transition-transform duration-500 hover:-translate-y-1`}
        style={{ background: s.bg }}
      >
        {SPOTS.map((it, i) => (
          <span
            key={it.key}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            style={{ background: it.bg }}
          >
            <img
              src={it.img}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              /* No bottom-0 here: men's health has to hang below the floor, and
                 a base value would race its override in the emitted CSS. Every
                 heroClass carries its own vertical anchor. */
              className={`absolute w-auto max-w-none object-contain object-bottom transition-transform duration-[1200ms] group-hover:scale-105 ${it.imgClass}`}
            />
          </span>
        ))}

        <span className="pointer-events-none absolute inset-0" style={{ background: SPOT_SCRIM }} />

        {/* Keyed on the active goal so the copy dissolves with the artwork
            instead of snapping over a half-faded figure. */}
        <span key={s.key} className="nv-fade-slow block h-full">
          <CardCopy tag={s.tag} name={s.name} blurb={s.blurb} cta="Check your eligibility" big />
        </span>
      </Link>

      {SPOTS.length > 1 && (
        <div className="absolute bottom-4 right-5 z-10 flex items-center gap-1.5 sm:bottom-5 sm:right-6">
          {SPOTS.map((it, i) => (
            <button
              key={it.key}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${it.name}`}
              aria-current={i === active ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-5 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Tile({ item, delay }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className="h-full min-w-0"
    >
      <Link
        to={productPath(item.product)}
        onClick={() => track(EVENTS.PRODUCT_VIEWED, { id: item.product.id, name: item.product.name, source: "hero-shelf" })}
        /* min-h, because the comp's tiles are ~2.7:1 and content alone left them
           nearer 3.6:1 — too shallow for the bottle to read at its comp size. */
        className={`group flex h-full min-h-[5.5rem] items-center gap-2 overflow-hidden border border-line bg-surface px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45 sm:min-h-[6.5rem] sm:px-4 ${TILE_R} nv-shadow`}
      >
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[0.85rem] font-bold leading-tight text-primary sm:text-[0.95rem]">
            {item.name}
          </span>
          <span className="mt-1 block font-mono text-[0.53rem] uppercase leading-[1.4] tracking-[0.1em] text-muted sm:text-[0.57rem]">
            {item.label}
          </span>
        </span>
        <span className="relative w-24 shrink-0 self-stretch sm:w-28">
          <img
            src={item.img}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute -top-[12%] left-1/2 h-[215%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
          />
        </span>
      </Link>
    </Motion.div>
  );
}

/* The tall tile. Same surface as the six, but the copy stacks above a centred
   vial instead of sitting beside a small one — it is two rows tall from lg up
   and full-width below that, so a horizontal split would leave it hollow. */
function FeaturedTile({ product, delay }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className="col-span-2 h-full min-w-0 lg:col-span-1 lg:row-span-2"
    >
      <Link
        to={productPath(product)}
        onClick={() => track(EVENTS.PRODUCT_VIEWED, { id: product.id, name: product.name, source: "hero-featured" })}
        className={`group flex h-full items-center gap-2 overflow-hidden border border-line bg-surface px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45 lg:flex-col lg:items-stretch lg:px-5 lg:py-5 ${TILE_R} nv-shadow`}
      >
        <span className="min-w-0 flex-1 lg:flex-none">
          <span className="block font-display text-[0.95rem] font-bold leading-tight text-primary sm:text-[1.05rem]">
            {FEATURED.name}
          </span>
          <span className="mt-1 block font-mono text-[0.53rem] uppercase leading-[1.4] tracking-[0.1em] text-muted sm:text-[0.57rem]">
            {FEATURED.label}
          </span>
        </span>
        {/* The one tile that shows the whole vial, as in the comp — it is two
            rows tall from lg, so there is height for the full bottle uncropped.
            This master is the catalogue's, not a shelf file, so it carries its
            own padding and is sized to the column rather than to 88%-of-canvas. */}
        <span className="relative w-24 shrink-0 self-stretch sm:w-28 lg:mt-3 lg:w-full lg:flex-1">
          <img
            src={FEATURED.img}
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 h-[132%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom transition-transform duration-500 group-hover:scale-105 lg:h-full"
          />
        </span>
      </Link>
    </Motion.div>
  );
}

export default function HomeHero() {
  const featured = productsData.find((p) => p.id === FEATURED.id);
  const shelf = SHELF.map((s) => ({ ...s, product: productsData.find((p) => p.id === s.id) })).filter(
    (s) => s.product && !isHidden(s.product)
  );

  return (
    <section className="relative isolate overflow-hidden bg-bg">
      <div className="mx-auto max-w-[1180px] px-5 pb-[clamp(2rem,4vw,3.25rem)] pt-[clamp(1.75rem,3.6vw,2.75rem)] md:px-10">
        {/* ---------------------------- headline ---------------------------- */}
        <Motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] lg:items-end lg:gap-10"
        >
          <div>
            <span className="block font-mono text-[0.6rem] uppercase tracking-[0.22em] text-primary sm:text-[0.68rem]">
              Physician-guided care
            </span>
            <h1
              className="nv-weight-keep mt-3 max-w-[15ch] text-[clamp(1.85rem,7.4vw,3.05rem)] font-extrabold leading-[1.1] tracking-[-0.015em] lg:max-w-[16ch]"
              style={{ color: "#6b511e" }}
            >
              Modern{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: TITLE_FILL }}>
                Healthcare
              </span>
              , <span className="lg:block">Built Around You</span>
            </h1>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-[34ch] text-[0.92rem] leading-relaxed text-muted sm:text-[0.98rem]">
              Care plans tailored to you by licensed medical providers
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href="#how"
                className="inline-flex items-center rounded-full px-5 py-2.5 text-[0.85rem] font-semibold text-on-primary transition-all duration-300 hover:-translate-y-0.5 sm:text-[0.9rem]"
                /* Between --nv-accent and --nv-primary, which is where the comp's
                   button sits — and a mix rather than a literal so it still
                   follows a palette swap from the Design Studio. */
                style={{ background: "color-mix(in oklab, var(--nv-accent) 58%, var(--nv-primary))" }}
              >
                See How It Works
              </a>
              <Link
                to="/start"
                onClick={() => track(EVENTS.QUIZ_STARTED, { source: "hero" })}
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-5 py-2.5 text-[0.85rem] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-primary sm:text-[0.9rem]"
              >
                Get Started
                <ArrowRight size={15} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Motion.div>

        {/* --------------------------- wide cards --------------------------- */}
        <Motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="mt-[clamp(1.5rem,3vw,2.5rem)] grid gap-3.5 sm:grid-cols-2 lg:gap-5"
        >
          <VideoCard />
          <SpotlightCard />
        </Motion.div>

        {/* ----------------------------- shelf ------------------------------ */}
        <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:gap-3 lg:mt-5 lg:grid-cols-[0.86fr_1fr_1fr_1fr] lg:gap-3.5">
          {featured && !isHidden(featured) && <FeaturedTile product={featured} delay={0.22} />}
          {shelf.map((s, i) => (
            <Tile key={s.id} item={s} delay={0.26 + i * 0.04} />
          ))}
        </div>
      </div>
    </section>
  );
}
