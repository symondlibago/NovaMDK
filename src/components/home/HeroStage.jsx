import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CONSULTS, CONSULT_ORDER } from "../data/consultations";
import { track, EVENTS } from "../../lib/analytics";

const EASE = [0.22, 0.61, 0.18, 1];
function GlassCard({ c, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className="h-full"
    >
      <Link
        to={`/treatments?goal=${c.goalSlug}`}
        onClick={() => track(EVENTS.CATEGORY_SELECTED, { category: c.goalSlug, source: "hero" })}
        className="group relative flex h-full flex-row items-center gap-3.5 overflow-hidden rounded-[calc(18px*var(--nv-r-scale,1))] p-3.5 nv-shadow-lg transition-all duration-500 hover:-translate-y-1 sm:min-h-[212px] sm:flex-col sm:items-stretch sm:gap-0 sm:p-4 sm:hover:-translate-y-2"
      >
        <span className="nv-glass absolute inset-0 rounded-[calc(18px*var(--nv-r-scale,1))]" />

        {/* gloss sweep on hover (sm+ cards) */}
        <span className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden rounded-[calc(18px*var(--nv-r-scale,1))] sm:block">
          <span className="absolute left-0 top-0 h-full w-[60%] -translate-x-[180%] -skew-x-12 bg-linear-to-r from-transparent via-accent/70 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[230%]" />
        </span>

        {/* floating pill */}
        <img
          src="/supplementpill.avif"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="nv-bob relative z-[3] h-14 w-14 shrink-0 object-contain drop-shadow-[0_12px_20px_rgba(15,22,34,0.5)] transition-transform duration-500 group-hover:scale-110 sm:mb-3 sm:h-[72px] sm:w-auto sm:self-start"
        />

        {/* tag · name */}
        <div className="relative z-[3] min-w-0 flex-1 sm:flex-none">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/80 drop-shadow-[0_1px_8px_rgba(15,22,34,0.4)] sm:text-[0.66rem]">
            {c.tag}
          </span>
          <h3 className="mt-0.5 font-display text-[1.22rem] font-bold leading-tight text-white drop-shadow-[0_1px_14px_rgba(15,22,34,0.55)] sm:mt-1.5 sm:text-[1.45rem]">
            {c.name}
          </h3>
        </div>

        {/* mobile trailing arrow */}
        <span className="relative z-[3] grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/40 text-white transition-colors group-hover:bg-white/15 sm:hidden">
          <ArrowRight size={15} strokeWidth={2.4} />
        </span>

        {/* sm+ inline CTA */}
        <span className="relative z-[3] mt-auto hidden items-center gap-1.5 pt-2.5 text-[0.78rem] font-semibold text-white transition-all duration-500 group-hover:gap-2.5 drop-shadow-[0_1px_10px_rgba(15,22,34,0.45)] sm:inline-flex">
          Browse <ArrowRight size={13} strokeWidth={2.4} />
        </span>
      </Link>
    </motion.div>
  );
}

export default function HeroStage() {
  const stageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <section ref={stageRef} className="relative isolate overflow-hidden">
      {/* Ken-burns background photo + parallax */}
      <motion.div style={{ y: bgY }} className="absolute -inset-[8%] -z-30 will-change-transform">
        <img
          src="/home-hero.avif"
          alt=""
          aria-hidden="true"
          className="nv-kenburns h-full w-full object-cover [object-position:62%_38%] [filter:grayscale(0.45)_saturate(0.85)_contrast(1.02)]"
        />
      </motion.div>
      {/* Palette-tinted gradient veils */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(120% 90% at 20% 10%, color-mix(in oklab, var(--nv-bg) 95%, transparent), color-mix(in oklab, var(--nv-bg) 55%, transparent) 45%, transparent 72%), linear-gradient(180deg, color-mix(in oklab, var(--nv-bg) 50%, transparent), color-mix(in oklab, var(--nv-accent) 22%, transparent) 38%, color-mix(in oklab, var(--nv-primary) 34%, transparent))",
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--nv-primary) 20%, transparent))" }}
      />

      <div className="mx-auto max-w-[1500px] px-5 pb-[clamp(48px,7vw,88px)] pt-[clamp(34px,6vw,72px)] md:px-10">
        {/* Hero row */}
        <div className="mb-[clamp(30px,4vw,50px)] flex flex-col items-start justify-between gap-7 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <h1
              className="nv-weight-keep max-w-[16ch] text-[clamp(2.3rem,5.8vw,4.3rem)] font-medium leading-[1.02] tracking-[-0.01em] text-ink"
              style={{ fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" }}
            >
              Better medicine begins with{" "}
              <span className="nv-em italic font-medium">better attention.</span>
            </h1>
            <p className="mt-[18px] max-w-[42ch] text-[clamp(1rem,1.3vw,1.1rem)] leading-relaxed text-muted">
              Doctor-formulated treatments, composed for you and delivered to your door in days.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
            className="shrink-0"
          >
            <Link
              to="/treatments"
              onClick={() => track(EVENTS.BROWSE_TREATMENTS, { source: "hero" })}
              className="group relative inline-flex items-center gap-3.5 overflow-hidden rounded-[calc(14px*var(--nv-r-scale,1))] border-[1.5px] border-primary/55 px-6 py-4 text-[1.05rem] font-bold tracking-tight text-ink transition-colors duration-300 hover:border-primary hover:text-on-primary"
            >
              <span
                className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0"
                style={{ background: "linear-gradient(135deg, var(--nv-primary), var(--nv-primary-deep))" }}
              />
              <span className="relative z-10">Browse all treatments</span>
              <span className="relative z-10 grid h-[26px] w-[26px] place-items-center rounded-full border-[1.5px] border-current transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={13} strokeWidth={2.6} />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Categories — all visible: a stacked row list on mobile, a 3- then
            5-up grid on larger screens. */}
        <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-3 sm:gap-[clamp(0.7rem,1.2vw,1rem)] lg:grid-cols-5">
          {CONSULT_ORDER.map((key, i) => (
            <GlassCard key={key} c={CONSULTS[key]} delay={(i % 5) * 0.06} />
          ))}
        </div>

        {/* Women's wide card — "not sure where to start?" assessment prompt */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mt-[clamp(12px,2vw,24px)] flex min-h-[clamp(270px,38vw,460px)] items-center overflow-hidden rounded-[calc(26px*var(--nv-r-scale,1))] bg-panel"
        >
          {/* photo fills the card */}
          <img
            src="/assessment.avif"
            alt="A licensed clinician reviewing a patient's plan on a laptop"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
          />
          {/* navy veil — opaque on the left for the copy, fading right to reveal the photo */}
          <span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, color-mix(in oklab, var(--nv-ink-panel) 96%, transparent) 0%, color-mix(in oklab, var(--nv-ink-panel) 76%, transparent) 38%, color-mix(in oklab, var(--nv-ink-panel) 30%, transparent) 66%, transparent 100%)",
            }}
          />
          <div className="relative z-[3] max-w-[90%] p-[clamp(28px,4vw,46px)] md:max-w-[54%]">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-white/80 drop-shadow-[0_1px_10px_rgba(15,22,34,0.4)]">
              Free 2-minute assessment
            </span>
            <h2 className="mt-3 font-display text-[clamp(1.7rem,3.2vw,2.7rem)] font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_18px_rgba(15,22,34,0.5)]">
              Let's find what works for you
            </h2>
            <p className="mt-3.5 max-w-[40ch] leading-relaxed text-white/90 drop-shadow-[0_1px_12px_rgba(15,22,34,0.4)]">
              Answer a few questions and a licensed provider will point you to the care that's right for
              you. It's free, there's no commitment, and you only pay if you're prescribed.
            </p>
            <Link
              to="/start"
              className="mt-6 inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-white/55 px-5 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-ink"
            >
              Start the assessment <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
