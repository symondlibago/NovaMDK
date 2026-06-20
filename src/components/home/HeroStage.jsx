import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CONSULTS, CONSULT_ORDER } from "../data/consultations";

const EASE = [0.22, 0.61, 0.18, 1];

/* Glass category card — flow-HTML content (tag · name · blurb), floating pill,
   shine sweep; browses that category's treatments (shoppable catalog). */
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
        className="group relative flex h-full min-h-[212px] flex-col overflow-hidden rounded-[calc(20px*var(--nv-r-scale,1))] p-4 nv-shadow-lg transition-transform duration-500 hover:-translate-y-2"
      >
        <span className="nv-glass absolute inset-0 rounded-[calc(20px*var(--nv-r-scale,1))]" />

        {/* gloss sweep on hover */}
        <span className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[calc(20px*var(--nv-r-scale,1))]">
          <span className="absolute left-0 top-0 h-full w-[60%] -translate-x-[180%] -skew-x-12 bg-linear-to-r from-transparent via-accent/70 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[230%]" />
        </span>

        {/* floating pill — left, like the flow's orb (one shared render across cards) */}
        <img
          src="/supplementpill.avif"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="nv-bob relative z-[3] mb-2.5 h-[46px] w-auto self-start object-contain drop-shadow-[0_12px_20px_rgba(15,22,34,0.5)] transition-transform duration-500 group-hover:scale-110"
        />

        {/* flow content: tag · name · blurb */}
        <div className="relative z-[3]">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-white/75 drop-shadow-[0_1px_8px_rgba(15,22,34,0.4)]">
            {c.tag}
          </span>
          <h3 className="mt-1 font-display text-[1.08rem] font-bold leading-tight text-white drop-shadow-[0_1px_14px_rgba(15,22,34,0.55)]">
            {c.name}
          </h3>
          <p className="mt-1.5 text-[0.78rem] leading-snug text-white/85 drop-shadow-[0_1px_10px_rgba(15,22,34,0.4)]">
            {c.blurb}
          </p>
        </div>

        <span className="relative z-[3] mt-auto inline-flex items-center gap-1.5 pt-2.5 text-[0.78rem] font-semibold text-white transition-all duration-500 group-hover:gap-2.5 drop-shadow-[0_1px_10px_rgba(15,22,34,0.45)]">
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
          src="/home-hero.jpg"
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
              className="max-w-[16ch] text-[clamp(2.3rem,5.8vw,4.3rem)] font-medium leading-[1.02] tracking-[-0.01em] text-ink"
              style={{ fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" }}
            >
              Care, made{" "}
              <span className="nv-em italic font-medium">for one.</span>
            </h1>
            <p className="mt-[18px] max-w-[42ch] text-[clamp(1rem,1.3vw,1.1rem)] leading-relaxed text-muted">
              Elite, doctor-led treatments tailored to your unique needs and delivered with absolute discretion.
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

        {/* All five categories — one row, each browses that goal's treatments */}
        <div className="grid grid-cols-2 gap-[clamp(0.7rem,1.2vw,1rem)] sm:grid-cols-3 lg:grid-cols-5">
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
          className="relative mt-[clamp(16px,2vw,24px)] flex min-h-[clamp(320px,38vw,460px)] items-center overflow-hidden rounded-[calc(26px*var(--nv-r-scale,1))] bg-panel"
        >
          {/* photo fills the card */}
          <img
            src="/women-group.png"
            alt="Four women together after a workout"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
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
              Not sure where to start?
            </h2>
            <p className="mt-3.5 max-w-[40ch] leading-relaxed text-white/90 drop-shadow-[0_1px_12px_rgba(15,22,34,0.4)]">
              Take the free assessment and we'll point you to the right care — reviewed by a licensed
              provider, with no commitment and nothing to pay until you're prescribed.
            </p>
            <Link
              to="/start/weight-loss"
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
