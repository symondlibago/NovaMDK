import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Hand, ClipboardCheck, Stethoscope, PackageOpen,
  ShieldCheck, Clock, Sparkles, Truck, Building2, Monitor, Zap,
} from "lucide-react";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Nav/Footer";
import Reveal from "../components/ui/Reveal";

const STATS = [
  { b: "~1 min", s: "Average visit" },
  { b: "50", s: "States licensed" },
  { b: "0", s: "Appointments needed" },
  { b: "24/7", s: "Always on" },
];

const STEPS = [
  { icon: Hand, title: "Tap to start", desc: "Just tap the touchscreen to begin — no app, no front desk, no paperwork." },
  { icon: ClipboardCheck, title: "Share your goals", desc: "Answer a few guided questions right on the touchscreen. It takes about a minute." },
  { icon: Stethoscope, title: "Provider review", desc: "A licensed U.S. clinician reviews your intake in real time and confirms the right plan." },
  { icon: PackageOpen, title: "Get your plan", desc: "Your protocol ships discreetly to your door — with ongoing care and easy adjustments." },
];

const FEATURES = [
  { icon: Hand, title: "Walk-up access", desc: "No appointment and no app — step up and start in seconds." },
  { icon: Stethoscope, title: "Provider-guided", desc: "Every plan is reviewed by a licensed clinician." },
  { icon: ShieldCheck, title: "Private & secure", desc: "HIPAA-compliant from check-in to checkout." },
  { icon: Clock, title: "Minutes, not appointments", desc: "A full guided visit in about a minute." },
  { icon: Sparkles, title: "Personalized protocols", desc: "Care matched to your goals and biology." },
  { icon: Truck, title: "Seamless delivery", desc: "Treatments shipped free, straight to your door." },
];

// Venue types the kiosk lives in — no specific locations.
const VENUES = ["Flagship centers", "Premium gyms", "Luxury med spas", "Wellness retail", "Member clubs"];

export default function KioskPage() {
  return (
    <main className="min-h-screen w-full bg-bg text-ink">
      <Navbar />

      {/* ===== Premium hero ===== */}
      <section className="relative isolate overflow-hidden border-b border-line">
        {/* ambient palette glows */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 60% at 85% 18%, color-mix(in oklab, var(--nv-accent) 26%, transparent), transparent 60%), radial-gradient(60% 70% at 8% 90%, color-mix(in oklab, var(--nv-primary) 18%, transparent), transparent 60%)",
          }}
        />
        <div className="mx-auto grid max-w-[1240px] items-center gap-[clamp(1.5rem,4vw,3.5rem)] px-5 py-[clamp(2.4rem,5vw,4.5rem)] md:grid-cols-[1.05fr_0.95fr] md:px-10">
          {/* copy */}
          <Reveal>
            <span className="nv-eyebrow">NovaMDK Smart Kiosk</span>
            <h1 className="mt-3 text-[clamp(2.3rem,5.2vw,3.7rem)] font-extrabold leading-[1.04] tracking-tight">
              Your clinic, in a single square metre.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[clamp(1rem,1.5vw,1.18rem)] leading-relaxed text-muted">
              Step up, tap in, and walk away with a physician-designed protocol. The Smart Kiosk brings
              concierge-grade telehealth into the premium spaces you already love.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/start"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-[1rem] font-semibold text-on-primary transition-all hover:-translate-y-0.5 hover:bg-primary-deep nv-shadow"
              >
                Start your visit <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#partner"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-4 text-[0.96rem] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-primary"
              >
                Host a kiosk
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {["Touchscreen check-in", "Licensed providers", "~1-minute visit", "HIPAA-secure"].map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3.5 py-1.5 text-[0.82rem] font-medium text-muted">
                  {c}
                </span>
              ))}
            </div>
          </Reveal>

          {/* telehealth kiosk photo */}
          <Reveal delay={0.1}>
            <div className="relative mx-auto w-full max-w-[480px]">
              <div className="relative overflow-hidden rounded-[calc(34px*var(--nv-r-scale,1))] nv-shadow-lg">
                <img
                  src="/telehealth-kiosk.avif"
                  alt="A patient using a NovaMDK telehealth kiosk"
                  className="h-[clamp(360px,46vw,520px)] w-full object-cover object-center"
                />
                {/* edge gradient for chip/badge legibility */}
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--nv-ink-panel) 34%, transparent) 0%, transparent 26%, transparent 58%, color-mix(in oklab, var(--nv-ink-panel) 52%, transparent) 100%)" }}
                />

                {/* live badge */}
                <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 backdrop-blur-md">
                  <span className="relative grid h-2 w-2 place-items-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="font-mono text-[0.6rem] font-medium uppercase tracking-[0.16em] text-white/90">Live now</span>
                </div>

                {/* floating spec chips (md+) */}
                <div className="absolute right-4 top-5 z-10 hidden items-center gap-2 rounded-2xl border border-white/15 bg-black/30 px-3.5 py-2.5 backdrop-blur-md md:flex">
                  <Monitor size={16} className="text-accent" />
                  <span className="text-[0.78rem] font-semibold text-white">HD touchscreen</span>
                </div>
                <div className="absolute bottom-16 left-4 z-10 hidden items-center gap-2 rounded-2xl border border-white/15 bg-black/30 px-3.5 py-2.5 backdrop-blur-md md:flex">
                  <Stethoscope size={16} className="text-accent" />
                  <span className="text-[0.78rem] font-semibold text-white">Provider-reviewed</span>
                </div>
                <div className="absolute bottom-5 left-4 z-10 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-black/30 px-3.5 py-2.5 backdrop-blur-md">
                  <Zap size={16} className="text-accent" />
                  <span className="text-[0.78rem] font-semibold text-white">~60-second visit</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Stat band ===== */}
      <section className="bg-panel text-on-panel">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-6 px-5 py-[clamp(2rem,4vw,3rem)] md:grid-cols-4 md:px-10">
          {STATS.map((s) => (
            <div key={s.s} className="text-center">
              <b className="block text-[clamp(1.7rem,4vw,2.6rem)] font-extrabold tracking-tight">{s.b}</b>
              <span className="mt-1.5 block font-mono text-[0.7rem] uppercase tracking-[0.13em] text-on-panel/60">{s.s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== What it is (with monitor detail) ===== */}
      <section className="mx-auto max-w-[1180px] px-5 py-[clamp(2.6rem,5vw,4.5rem)] md:px-10">
        <div className="grid items-center gap-[clamp(1.8rem,5vw,4.5rem)] md:grid-cols-2">
          <Reveal>
            <span className="nv-eyebrow">Proprietary technology</span>
            <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.7rem)] font-extrabold leading-tight">
              A clinic-grade experience, reimagined.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[1.04rem] leading-relaxed text-muted">
              No waiting rooms. No front desk. Just step up, check in, and let a licensed provider guide
              you to care that fits — all from one beautifully simple kiosk in a space you already trust.
            </p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {["A high-resolution guided touchscreen", "Encrypted, HIPAA-compliant data capture", "Real-time review by U.S.-licensed providers"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[1rem] font-medium">
                  <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-accent/15 text-accent"><ShieldCheck size={12} strokeWidth={3} /></span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative overflow-hidden rounded-[calc(26px*var(--nv-r-scale,1))] bg-surface-2 nv-shadow">
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(60% 60% at 50% 30%, color-mix(in oklab, var(--nv-accent) 22%, transparent), transparent 72%)" }}
              />
              <div className="relative flex min-h-[300px] items-center justify-center p-8">
                <img
                  src="/kioskmonitor.avif"
                  alt="Close-up of the NovaMDK Smart Kiosk touchscreen"
                  loading="lazy"
                  className="max-h-[320px] w-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="bg-surface-2 py-[clamp(2.5rem,5vw,5rem)]">
        <div className="mx-auto max-w-[1180px] px-5 md:px-10">
          <Reveal className="mx-auto max-w-[60ch] text-center">
            <span className="nv-eyebrow">How it works</span>
            <h2 className="mt-3 text-[clamp(1.7rem,3.6vw,2.5rem)] font-extrabold leading-tight">From walk-up to plan in minutes.</h2>
            <p className="mt-3 text-[1.02rem] leading-relaxed text-muted">Four simple steps — no appointment, no clipboard, no waiting room.</p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal as="div" key={s.title} delay={(i % 4) * 0.08}>
                <div className="relative h-full rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface p-7 nv-shadow">
                  <span className="absolute right-6 top-6 font-mono text-[1.1rem] font-bold text-line-strong">0{i + 1}</span>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-on-primary"><s.icon size={22} /></span>
                  <h3 className="mt-5 font-display text-[1.15rem] font-bold leading-tight">{s.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="mx-auto max-w-[1180px] px-5 py-[clamp(2.6rem,5vw,5rem)] md:px-10">
        <Reveal className="mx-auto max-w-[60ch] text-center">
          <span className="nv-eyebrow">Why it's different</span>
          <h2 className="mt-3 text-[clamp(1.7rem,3.6vw,2.5rem)] font-extrabold leading-tight">Everything a clinic visit should be.</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal as="div" key={f.title} delay={(i % 3) * 0.08}>
              <div className="flex h-full items-start gap-4 rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface p-6 nv-shadow">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-2 text-primary"><f.icon size={20} /></span>
                <div>
                  <h3 className="font-display text-[1.05rem] font-bold leading-tight">{f.title}</h3>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== Venues ===== */}
      <section className="mx-auto max-w-[1180px] px-5 pb-[clamp(2.6rem,5vw,4rem)] md:px-10">
        <Reveal>
          <div className="rounded-[calc(26px*var(--nv-r-scale,1))] border border-line bg-surface p-7 nv-shadow md:p-9">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="relative grid h-2.5 w-2.5 place-items-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">Now rolling out nationwide</span>
            </div>
            <p className="mb-4 text-[1.05rem] font-bold text-ink">Find a kiosk in premium spaces like:</p>
            <div className="flex flex-wrap gap-2.5">
              {VENUES.map((v) => (
                <span key={v} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-4 py-2 text-[0.9rem] font-medium text-ink transition-colors hover:border-primary/40">
                  <Building2 size={14} className="text-primary" /> {v}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== Partner CTA ===== */}
      <section id="partner" className="mx-auto mb-[clamp(3rem,6vw,5rem)] max-w-[1180px] scroll-mt-24 px-5 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[calc(28px*var(--nv-r-scale,1))] bg-panel px-6 py-[clamp(2.4rem,5vw,3.6rem)] text-center text-on-panel">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(50% 80% at 50% 0%, color-mix(in oklab, var(--nv-accent) 22%, transparent), transparent 70%)" }}
            />
            <div className="relative">
              <span className="nv-eyebrow text-accent">For partners</span>
              <h2 className="mx-auto mt-3 max-w-[24ch] font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold leading-tight">
                Host a NovaMDK Smart Kiosk.
              </h2>
              <p className="mx-auto mt-3 max-w-[48ch] text-[1rem] text-on-panel/70">
                Own a gym, spa, or wellness space? Offer members provider-guided care on site — we handle the technology, the clinicians, and fulfillment.
              </p>
              <Link
                to="/contact"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-bg px-8 py-4 text-[1rem] font-semibold text-ink transition-all hover:-translate-y-0.5 nv-shadow-lg"
              >
                Talk to our team <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
