import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { HIW_STEPS as STEPS } from "./howItWorksSteps";

const EASE = [0.16, 1, 0.3, 1];

function StepCard({ step, even }) {
  const Icon = step.Icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: false, margin: "0px 0px -45% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`group w-full max-w-[420px] rounded-[24px] border border-line bg-linear-to-br from-surface ${even ? "to-accent/12" : "to-primary/12"} p-6 nv-shadow transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:nv-shadow-lg md:p-8`}
    >
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface-2 text-primary transition-all duration-500 group-hover:scale-105 group-hover:bg-primary group-hover:text-on-primary">
        <Icon size={22} strokeWidth={2} />
      </div>
      <h3 className="mb-2.5 font-display text-2xl font-bold text-ink">{step.title}</h3>
      <p className="text-[0.95rem] leading-relaxed text-muted">{step.desc}</p>
    </motion.div>
  );
}

function Node({ n }) {
  const reveal = {
    initial: { opacity: 0, scale: 0.6 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: false, margin: "0px 0px -45% 0px" },
    transition: { duration: 0.4, ease: "easeOut" },
  };
  return (
    <div className="relative grid h-11 w-11 place-items-center rounded-full ring-4 ring-bg md:h-12 md:w-12">
      <span className="absolute inset-0 rounded-full border-2 border-line-strong bg-surface" />
      <motion.span className="absolute inset-0 rounded-full bg-primary" {...reveal} />
      <span className="relative z-10 text-[0.95rem] font-semibold text-muted">{n}</span>
      <motion.span className="absolute inset-0 z-10 grid place-items-center text-[0.95rem] font-semibold text-on-primary" {...reveal} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
        {n}
      </motion.span>
    </div>
  );
}

export default function HowItWorksTimeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const fill = useSpring(scrollYProgress, { stiffness: 70, damping: 20, restDelta: 0.001 });

  return (
    <section id="how" className="relative scroll-mt-24 overflow-hidden bg-bg py-[clamp(4rem,8vw,6.5rem)]">
      {/* themed glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-10%] top-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mb-[clamp(2.5rem,5vw,4rem)] max-w-[60ch] text-center"
        >
          <span className="nv-eyebrow">How it works</span>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-tight">Four steps to care that's yours.</h2>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative mx-auto w-full max-w-[900px] pb-6">
          {/* base line */}
          <div className="absolute bottom-0 left-[28px] top-0 z-0 w-[2px] -translate-x-1/2 rounded-full bg-line md:left-1/2" />
          {/* scroll-progress fill */}
          <div className="absolute bottom-0 left-[28px] top-0 z-10 w-[2px] -translate-x-1/2 overflow-hidden rounded-full md:left-1/2">
            <motion.div className="h-full w-full bg-linear-to-b from-primary to-accent" style={{ scaleY: fill, originY: 0 }} />
          </div>

          <div className="relative z-20 flex flex-col gap-12 md:gap-0">
            {STEPS.map((step, i) => {
              const even = i % 2 === 0;
              return (
                <div key={step.title} className="relative flex w-full flex-col md:h-[230px] md:flex-row">
                  <div className="absolute left-[28px] top-0 z-30 flex -translate-x-1/2 justify-center md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                    <Node n={i + 1} />
                  </div>
                  {/* left card (even steps) on desktop */}
                  <div className={`hidden items-center justify-end pr-16 md:flex md:w-1/2 ${even ? "" : "invisible"}`}>
                    {even && <StepCard step={step} even={even} />}
                  </div>
                  {/* right card (odd steps) + all mobile cards */}
                  <div className={`flex w-full items-center pl-[76px] pt-1 md:pl-16 md:pt-0 ${!even ? "md:w-1/2 md:justify-start" : "md:hidden"}`}>
                    <StepCard step={step} even={even} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
