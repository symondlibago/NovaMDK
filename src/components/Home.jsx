import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Navbar from "./Nav/Navbar";
import Footer from "./Nav/Footer";
import HeroVideo from "./home/HeroVideo";
import ImproveGoals from "./home/ImproveGoals";
import StartingPoint from "./home/StartingPoint";
import Reveal from "./ui/Reveal";
import Photo from "./ui/Photo";

/* useKioskVariant and the HeroStage card grid it drove went with the
   2026-09-11 hero redesign. The new hero is one full-bleed clip and reads the
   same on a phone, a desktop and the 1080x1920 kiosk, so there is no longer a
   per-kiosk layout to pick. HeroStage.jsx is still on disk if a variant is
   ever wanted back. */
const FAQ = lazy(() => import("./FAQ"));
const HOW_STEPS = [
  {
    n: "01", eyebrow: "Step one", title: "Explore your options",
    desc: "Browse treatment options for your health goals.",
    img: "/site/visit-phone.avif", alt: "Choosing a treatment on a tablet",
    cta: "Browse treatments", to: "/treatments",
  },
  {
    n: "02", eyebrow: "Step two", title: "Complete your assessment",
    desc: "Answer a few questions and a licensed provider reviews your information to determine the right next step.",
    img: "/site/doctor-consult.avif", alt: "A licensed doctor on a telehealth consultation",
    cta: "Start your assessment", to: "/start",
  },
  {
    n: "03", eyebrow: "Step three", title: "Delivered discreetly",
    desc: "Your prescribed treatment ships in discreet packaging, right to your door.",
    img: "/site/courier-delivery.avif", alt: "A courier delivering a discreet package",
    cta: "See treatments", to: "/treatments",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-bg text-ink">
      <Navbar />
      <HeroVideo />
      <ImproveGoals />
      <StartingPoint />

      {/* ===== How it works (3 cards) ===== */}
      <section id="how" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-5 pt-[clamp(1.75rem,4.5vw,4.5rem)] md:px-10">
        <Reveal className="mx-auto mb-[clamp(1.5rem,3vw,2.5rem)] max-w-[60ch] text-center">
          <span className="nv-eyebrow">How it works</span>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-tight">Care In Three Simple Steps</h2>
        </Reveal>
        <div className="grid grid-cols-1 items-stretch gap-3.5 md:grid-cols-3">
          {HOW_STEPS.map((s, i) => (
            <Reveal key={s.n} delay={(i % 3) * 0.08} className="h-full">
              <Link
                to={s.to}
                className="group relative flex h-full min-h-[clamp(300px,40vw,440px)] flex-col justify-between overflow-hidden rounded-[calc(26px*var(--nv-r-scale,1))] p-6 text-white md:p-7 nv-shadow transition-all duration-300 hover:-translate-y-1.5 hover:nv-shadow-lg"
              >
                <div className="absolute inset-0 z-0">
                  <Photo src={s.img} alt={s.alt} loading={i === 0 ? "eager" : "lazy"} className="h-full w-full" imgClassName="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <span className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--nv-ink-panel) 28%, transparent) 0%, color-mix(in oklab, var(--nv-ink-panel) 50%, transparent) 55%, color-mix(in oklab, var(--nv-ink-panel) 90%, transparent) 100%)" }} />
                <div className="relative z-10 flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white/45 font-mono text-[0.72rem] font-bold">{s.n}</span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/75">{s.eyebrow}</span>
                </div>
                <div className="relative z-10">
                  <h3 className="max-w-[16ch] font-display text-[clamp(1.4rem,2.4vw,1.95rem)] font-extrabold leading-tight">{s.title}</h3>
                  <p className="mt-2 max-w-[30ch] text-[0.92rem] leading-relaxed text-white/85">{s.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[0.95rem] font-semibold">
                    {s.cta}
                    <span className="grid h-[34px] w-[34px] place-items-center rounded-full border border-white/50 transition-all group-hover:bg-white group-hover:text-ink"><ArrowRight size={14} /></span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <Suspense fallback={<div className="grid h-[200px] place-items-center bg-bg text-muted">Loading…</div>}>
        <div id="faq" className="scroll-mt-24"><FAQ /></div>
      </Suspense>

      <Footer />
    </main>
  );
}
