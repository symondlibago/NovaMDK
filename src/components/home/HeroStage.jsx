import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CONSULTS, CONSULT_ORDER } from "../data/consultations";

const EASE = [0.22, 0.61, 0.18, 1];

/* Glass category card — flow-HTML content (tag · name · blurb), floating pill,
   shine sweep; opens that category's consultation. */
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
        to={`/start/${c.slug}`}
        className="group relative flex h-full min-h-[212px] flex-col overflow-hidden rounded-[20px] p-4 nv-shadow-lg transition-transform duration-500 hover:-translate-y-2"
      >
        <span className="nv-glass absolute inset-0 rounded-[20px]" />

        {/* gloss sweep on hover */}
        <span className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[20px]">
          <span className="absolute left-0 top-0 h-full w-[60%] -translate-x-[180%] -skew-x-12 bg-linear-to-r from-transparent via-white/55 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[230%]" />
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
          Start <ArrowRight size={13} strokeWidth={2.4} />
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
            <h1 className="max-w-[19ch] font-display text-[clamp(2.05rem,5.2vw,3.95rem)] font-bold leading-[1.08] tracking-tight text-ink">
              Personalized supplements{" "}
              <span
                className="font-bold"
                style={{
                  background: "linear-gradient(125deg, var(--nv-primary) 20%, var(--nv-accent))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                &amp;
              </span>{" "}
              treatment <span className="nv-em font-bold italic">for you.</span>
            </h1>
            <p className="mt-[18px] max-w-[42ch] text-[clamp(1rem,1.3vw,1.1rem)] leading-relaxed text-muted">
              Pick what you want to work on. Answer a few quick questions and a licensed provider
              builds a plan around your body — shipped to your door.
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
              className="group relative inline-flex items-center gap-3.5 overflow-hidden rounded-[14px] border-[1.5px] border-primary/55 px-6 py-4 text-[1.05rem] font-bold tracking-tight text-ink transition-colors duration-300 hover:border-primary hover:text-on-primary"
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

        {/* All five categories — one row, each opens its consultation */}
        <div className="grid grid-cols-2 gap-[clamp(0.7rem,1.2vw,1rem)] sm:grid-cols-3 lg:grid-cols-5">
          {CONSULT_ORDER.map((key, i) => (
            <GlassCard key={key} c={CONSULTS[key]} delay={(i % 5) * 0.06} />
          ))}
        </div>

        {/* Women's wide card — now the "not sure where to start?" assessment prompt */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mt-[clamp(16px,2vw,24px)] flex min-h-[clamp(300px,34vw,400px)] items-start overflow-hidden rounded-[26px]"
        >
          <span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--nv-primary) 62%, transparent), color-mix(in oklab, var(--nv-primary) 30%, transparent) 50%, color-mix(in oklab, var(--nv-accent) 22%, transparent))",
              backdropFilter: "blur(14px) saturate(115%)",
              WebkitBackdropFilter: "blur(14px) saturate(115%)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          />
          <div className="relative z-[3] max-w-[88%] p-[clamp(28px,4vw,46px)] md:max-w-[52%]">
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
          <img
            src="/women-group.png"
            alt="Four women together after a workout"
            loading="lazy"
            className="absolute bottom-0 right-0 z-[2] hidden h-[96%] w-auto drop-shadow-[0_20px_40px_rgba(15,22,34,0.55)] sm:block"
          />
        </motion.div>
      </div>
    </section>
  );
}
