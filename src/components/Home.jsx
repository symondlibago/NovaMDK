import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Check, ShieldCheck, Truck, Clock, Ban,
  Stethoscope, Flag, FlaskConical,
} from "lucide-react";

import Navbar from "./Nav/Navbar";
import Footer from "./Nav/Footer";
import HeroStage from "./home/HeroStage";
import HowItWorks from "./home/HowItWorks";
import SmartKioskShowcase from "./home/SmartKioskShowcase";
import Reveal from "./ui/Reveal";
import Photo from "./ui/Photo";
import { scrollToId } from "../lib/smoothScroll";

const Testimonials = lazy(() => import("./Testimonials"));
const FAQ = lazy(() => import("./FAQ"));
const TreatmentsCarousel = lazy(() => import("./TreatmentsCarousel"));

const TRUST = [
  { text: "US-licensed pharmacy", icon: ShieldCheck },
  { text: "Free 2-day shipping", icon: Truck },
  { text: "Five-minute online visit", icon: Clock },
  { text: "No subscription lock-in", icon: Ban },
];

// Scrolling credential band at the foot of the page; re-skins with the theme.
const MARQUEE_ITEMS = [
  { text: "USA MDs ONLY", icon: Stethoscope },
  { text: "50-STATE LICENSED PHYSICIANS", icon: Flag },
  { text: "FDA-REGULATED PHARMACIES", icon: ShieldCheck },
  { text: "USA MADE & SOURCED", icon: FlaskConical },
  { text: "FREE 2-DAY SHIPPING", icon: Truck },
  { text: "FIVE-MINUTE ONLINE VISIT", icon: Clock },
];

function Marquee({ speed = 42 }) {
  return (
    <div className="relative flex w-full overflow-hidden border-y border-white/5 bg-panel py-2.5 text-on-panel">
      <motion.div
        className="flex w-max shrink-0 will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: speed, repeat: Infinity }}
        aria-hidden="true"
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center">
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={`${dup}-${i}`} className="flex items-center gap-2.5 px-7">
                <item.icon size={14} className="text-accent" strokeWidth={1.8} />
                <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-on-panel/80">
                  {item.text}
                </span>
                <span className="ml-7 text-accent/60">•</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const STATS = [
  { b: "100%", s: "Physician-reviewed" },
  { b: "2-day", s: "Average delivery" },
  { b: "50", s: "States served" },
  { b: "$0", s: "To start your visit" },
];

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-bg text-ink">
      <Navbar />
      <HeroStage />

      {/* ===== Trust strip ===== */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-4 md:px-10">
          {TRUST.map((t) => (
            <span key={t.text} className="flex items-center gap-2 text-[0.88rem] font-medium text-muted">
              <t.icon size={16} className="text-primary" /> {t.text}
            </span>
          ))}
        </div>
      </section>

      {/* ===== Bento intro tiles ===== */}
      <section className="mx-auto w-full max-w-[1240px] px-5 pt-[clamp(3rem,6vw,5rem)] md:px-10">
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
          <Reveal className="h-full">
            <Link to="/treatments" className="group relative flex h-full min-h-[clamp(300px,33vw,420px)] flex-col justify-between overflow-hidden rounded-[calc(26px*var(--nv-r-scale,1))] p-7 text-white nv-shadow transition-all duration-300 hover:-translate-y-1.5 hover:nv-shadow-lg">
              <div className="absolute inset-0 z-0">
                <Photo src="/visit-phone.jpg" alt="Taking the five-minute online visit on a phone" loading="eager" className="h-full w-full" imgClassName="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <span className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(105deg, color-mix(in oklab, var(--nv-ink-panel) 88%, transparent) 0%, color-mix(in oklab, var(--nv-ink-panel) 52%, transparent) 50%, color-mix(in oklab, var(--nv-ink-panel) 14%, transparent) 100%)" }} />
              <div className="relative z-10">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/75">Start here · most chosen</span>
                <h3 className="mt-2 max-w-[20ch] font-display text-[clamp(1.55rem,2.7vw,2.25rem)] font-extrabold leading-tight">Build your protocol in five minutes.</h3>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[1rem] font-semibold">Take the free visit</span>
                <span className="grid h-[38px] w-[38px] place-items-center rounded-full border border-white/50 transition-all group-hover:bg-white group-hover:text-ink"><ArrowRight size={15} /></span>
              </div>
            </Link>
          </Reveal>
          <Reveal delay={0.08} className="h-full">
            <a href="#how" onClick={(e) => { e.preventDefault(); scrollToId("how"); }} className="group relative flex h-full min-h-[clamp(300px,33vw,420px)] flex-col justify-between overflow-hidden rounded-[calc(26px*var(--nv-r-scale,1))] p-7 text-white nv-shadow transition-all duration-300 hover:-translate-y-1.5 hover:nv-shadow-lg">
              <div className="absolute inset-0 z-0">
                <Photo src="/courier-delivery.jpg" alt="A courier handing a package to a smiling customer" loading="eager" className="h-full w-full" imgClassName="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <span className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(105deg, color-mix(in oklab, var(--nv-ink-panel) 88%, transparent) 0%, color-mix(in oklab, var(--nv-ink-panel) 52%, transparent) 50%, color-mix(in oklab, var(--nv-ink-panel) 14%, transparent) 100%)" }} />
              <div className="relative z-10">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/75">See how it works</span>
                <h3 className="mt-2 max-w-[20ch] font-display text-[clamp(1.55rem,2.7vw,2.25rem)] font-extrabold leading-tight">From visit to doorstep in two days.</h3>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[1rem] font-semibold">Watch the three steps</span>
                <span className="grid h-[38px] w-[38px] place-items-center rounded-full border border-white/50 transition-all group-hover:bg-white group-hover:text-ink"><ArrowRight size={15} /></span>
              </div>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ===== Why people stay (band) ===== */}
      <section id="why" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-[clamp(4rem,8vw,6.5rem)] md:px-10">
        <div className="grid items-center gap-[clamp(2rem,5vw,4.5rem)] md:grid-cols-2">
          <Reveal>
            <div className="relative">
              <Photo src="/why-portrait.jpg" alt="A person standing calmly, looking ahead" className="aspect-[5/4] rounded-[calc(26px*var(--nv-r-scale,1))] nv-shadow-lg" imgClassName="object-cover" />
              <div className="absolute -bottom-5 -left-3 max-w-[230px] rounded-2xl border border-line bg-surface p-5 nv-shadow-lg">
                <div className="text-[1.9rem] font-extrabold leading-none tracking-tight text-ink">8 weeks</div>
                <div className="mt-1.5 text-[0.82rem] leading-snug text-muted">median time members say they felt a difference*</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <span className="nv-eyebrow">Why people stay</span>
            <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-tight">Care that actually fits your life.</h2>
            <p className="mt-4 max-w-[46ch] text-[1.06rem] text-muted">No waiting rooms, no four bottles to juggle, no guesswork on timing. Just a protocol made for you and the room to keep living.</p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {["Adjusted as your body and goals change", "One message to pause, change, or cancel", "A real physician on the other side of it"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[1rem] font-medium">
                  <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-accent/15 text-accent"><Check size={12} strokeWidth={3} /></span>
                  {t}
                </li>
              ))}
            </ul>
            <a href="#how" onClick={(e) => { e.preventDefault(); scrollToId("how"); }} className="mt-7 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3 text-[0.96rem] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-primary">
              See how it works
            </a>
          </Reveal>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <HowItWorks />

      {/* ===== Treatments & Solutions showcase (moved from Treatments page) ===== */}
      <Suspense fallback={<div className="grid h-[200px] place-items-center bg-bg text-muted">Loading…</div>}>
        <TreatmentsCarousel />
      </Suspense>

      {/* ===== Smart Kiosk showcase ===== */}
      <SmartKioskShowcase />

      {/* ===== Stats band ===== */}
      <section className="bg-panel text-on-panel">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-6 px-5 py-[clamp(2.4rem,4vw,3.2rem)] md:grid-cols-4 md:px-10">
          {STATS.map((s) => (
            <div key={s.s} className="text-center">
              <b className="block text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tight">{s.b}</b>
              <span className="mt-1.5 block font-mono text-[0.72rem] uppercase tracking-[0.13em] text-on-panel/60">{s.s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Testimonials + FAQ (reused, re-themed) ===== */}
      <Suspense fallback={<div className="grid h-[200px] place-items-center bg-bg text-muted">Loading…</div>}>
        <div id="reviews" className="scroll-mt-24"><Testimonials /></div>
        <div id="faq" className="scroll-mt-24"><FAQ /></div>
      </Suspense>

      {/* ===== Closing CTA ===== */}
      <section className="mx-auto mb-16 max-w-[1240px] px-5 md:px-10">
        <Reveal>
          <div className="relative grid min-h-[clamp(360px,42vw,460px)] items-center overflow-hidden rounded-[calc(28px*var(--nv-r-scale,1))]">
            <div className="absolute inset-0 z-0">
              <Photo src="/outdoor-group.jpg" alt="A group of people standing together outdoors" className="h-full w-full" imgClassName="object-cover" />
            </div>
            <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(100deg, color-mix(in oklab, var(--nv-ink-panel) 86%, transparent) 0%, color-mix(in oklab, var(--nv-ink-panel) 55%, transparent) 52%, color-mix(in oklab, var(--nv-ink-panel) 18%, transparent) 100%)" }} />
            <div className="relative z-10 max-w-[34rem] p-[clamp(1.8rem,5vw,3rem)] text-white">
              <span className="nv-eyebrow text-accent">Begin</span>
              <h2 className="mt-3 text-[clamp(1.9rem,4.5vw,3rem)] font-extrabold leading-[1.06] text-white">Five minutes to a protocol that's yours.</h2>
              <p className="mb-7 mt-3 max-w-[42ch] text-[1.06rem] text-white/85">Answer a few questions and let a doctor do the rest. Nothing to pay until you see your formulation.</p>
              <Link to="/treatments" className="group inline-flex items-center gap-2 rounded-full bg-bg px-7 py-3.5 text-[0.96rem] font-semibold text-ink transition-all hover:-translate-y-0.5 nv-shadow-lg">
                Start your free visit <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== Marquee (foot of page) ===== */}
      <Marquee />

      <Footer />
    </main>
  );
}
