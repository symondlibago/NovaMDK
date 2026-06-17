import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const EASE = [0.22, 0.61, 0.18, 1];

/* Glass category cards — mapped to real NovaMD categories. */
const CARDS = [
  { title: "Weight Loss", desc: "GLP-1 & metabolic support, dosed for you.", img: "/pills-tablets.png", kind: "pills", link: "/treatments" },
  { title: "Supplements", desc: "Clinical-grade formulas, tailored to your labs.", img: "/pills-float.png", kind: "pills", link: "/supplements" },
  { title: "Skin Health", desc: "Dermatologist-designed routines that work.", img: "/skin-health.png", kind: "person", link: "/treatments" },
  { title: "Sports Medicine", desc: "Recover faster. Train harder. Stay in the game.", img: "/pills-tablets.png", kind: "pills", link: "/treatments" },
  { title: "Men's Health", desc: "Hair, drive, and daily focus at the source.", img: "/pills-float.png", kind: "pills", link: "/treatments" },
];

function GlassCard({ card, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className="snap-start shrink-0"
    >
      <Link
        to={card.link}
        className="group relative flex h-[200px] w-[330px] items-center overflow-hidden rounded-[22px] nv-shadow-lg transition-transform duration-500 hover:-translate-y-2"
      >
        <span className="nv-glass absolute inset-0 rounded-[22px]" />
        {/* gloss sweep on hover */}
        <span className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[22px]">
          <span className="absolute left-0 top-0 h-full w-[55%] -translate-x-[180%] -skew-x-12 bg-linear-to-r from-transparent via-white/55 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[230%]" />
        </span>
        <div className="relative z-[3] max-w-[54%] pl-6">
          <h3 className="font-display text-[1.45rem] font-bold leading-tight text-white drop-shadow-[0_1px_14px_rgba(15,22,34,0.55)]">
            {card.title}
          </h3>
          <p className="mt-2 max-w-[22ch] text-[0.86rem] leading-snug text-white/90 opacity-0 transition-all duration-500 group-hover:opacity-100 drop-shadow-[0_1px_10px_rgba(15,22,34,0.45)]">
            {card.desc}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-on-panel opacity-0 transition-all duration-500 group-hover:opacity-100">
            Explore <ArrowRight size={13} />
          </span>
        </div>
        {card.kind === "pills" ? (
          <img
            src={card.img}
            alt={`${card.title} tablets`}
            loading="lazy"
            className="nv-bob pointer-events-none absolute bottom-1/2 right-4 z-[2] w-[132px] translate-y-1/2 drop-shadow-[0_14px_20px_rgba(15,22,34,0.5)]"
          />
        ) : (
          <img
            src={card.img}
            alt={card.title}
            loading="lazy"
            className="pointer-events-none absolute bottom-0 right-1.5 z-[2] h-[188px] w-auto drop-shadow-[0_14px_20px_rgba(15,22,34,0.5)]"
          />
        )}
      </Link>
    </motion.div>
  );
}

export default function HeroStage() {
  const stageRef = useRef(null);
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  const scrollTrack = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("a");
    const step = card ? card.offsetWidth + 22 : 352;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

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
        <div className="mb-[clamp(34px,5vw,58px)] flex flex-col items-start justify-between gap-7 md:flex-row md:items-start">
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
            <p className="mt-[18px] max-w-[40ch] text-[clamp(1rem,1.3vw,1.1rem)] leading-relaxed text-muted">
              Clinical care, considered like luxury. Tell us your goals — we build a plan around your
              body, reviewed by licensed providers.
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
              <span className="relative z-10">Find My Treatment</span>
              <span className="relative z-10 grid h-[26px] w-[26px] place-items-center rounded-full border-[1.5px] border-current transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={13} strokeWidth={2.6} />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Glass category carousel — arrows flank the cards, centered on them */}
        <div className="flex items-center gap-2 md:gap-3.5">
          <button
            aria-label="Previous"
            onClick={() => scrollTrack(-1)}
            className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-white/60 bg-white/60 text-ink backdrop-blur-md transition-all hover:border-primary hover:bg-primary hover:text-on-primary sm:grid"
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={trackRef}
            className="no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-[22px] overflow-x-auto px-0.5 py-5"
          >
            {CARDS.map((card, i) => (
              <GlassCard key={card.title} card={card} delay={i * 0.07} />
            ))}
            <span className="shrink-0 pr-0.5" />
          </div>

          <button
            aria-label="Next"
            onClick={() => scrollTrack(1)}
            className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-white/60 bg-white/60 text-ink backdrop-blur-md transition-all hover:border-primary hover:bg-primary hover:text-on-primary sm:grid"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Women's wide glass card */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative mt-[clamp(26px,3vw,40px)] flex min-h-[clamp(320px,38vw,440px)] items-start overflow-hidden rounded-[26px]"
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
          <div className="relative z-[3] max-w-[88%] p-[clamp(28px,4vw,46px)] md:max-w-[50%]">
            <h2 className="font-display text-[clamp(1.7rem,3.2vw,2.7rem)] font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_18px_rgba(15,22,34,0.5)]">
              Women's Health, handled with real care.
            </h2>
            <p className="mt-3.5 max-w-[34ch] leading-relaxed text-white/90 drop-shadow-[0_1px_12px_rgba(15,22,34,0.4)]">
              Hormones, fertility, energy, and longevity — assessed together, not in silos, by providers
              who specialize in women's bodies.
            </p>
            <Link
              to="/treatments"
              className="mt-6 inline-flex items-center gap-2.5 rounded-full border-[1.5px] border-white/55 px-5 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-ink"
            >
              Start your assessment <ArrowRight size={14} />
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
