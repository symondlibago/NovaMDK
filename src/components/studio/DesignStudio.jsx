import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette, Type, Italic, Check, X, Sparkles, RotateCcw,
  Smartphone, Tablet, Monitor, Maximize, Eye, Lock, MoveHorizontal,
} from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import { DEFAULTS } from "../../theme/themes";

const EASE = [0.16, 1, 0.3, 1];

const DEVICE_ICON = {
  live: Eye,
  phone: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
  kiosk: Maximize,
};

/* ----------------------------- device preview ----------------------------- */
function DevicePreview() {
  const { device, devices, setDevice, palette, typography, weight, italic, letterSpacing, lineHeight } = useTheme();
  const active = devices.find((d) => d.id === device);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!active?.w) return;
    const recalc = () => {
      const availW = window.innerWidth - 120;
      const availH = window.innerHeight - 150;
      setScale(Math.min(1, availW / active.w, availH / active.h));
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [active]);

  if (!active?.w) return null;

  const path = window.location.pathname;
  // Re-key on theme so the iframe re-renders with the active palette/type.
  const frameKey = `${path}|${palette.id}|${typography.id}|${weight.id}|${italic}|${letterSpacing.id}|${lineHeight.id}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex flex-col items-center bg-[#0c0e10]/92 backdrop-blur-xl"
    >
      <div className="flex w-full items-center justify-between gap-4 px-6 py-4 text-white/90">
        <div className="flex items-center gap-2 text-[12px] font-medium tracking-wide">
          <Sparkles size={15} className="opacity-70" />
          NovaMD · Device preview
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-white/10 p-1">
          {devices.map((d) => {
            const Icon = DEVICE_ICON[d.id] || Monitor;
            return (
              <button
                key={d.id}
                onClick={() => setDevice(d.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] transition-colors ${
                  d.id === device ? "bg-white text-[#15171A]" : "text-white/70 hover:text-white"
                }`}
              >
                <Icon size={14} /> {d.name}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setDevice("live")}
          className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] text-white hover:bg-white/20"
        >
          <X size={14} /> Exit
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <div
          style={{ width: active.w * scale, height: active.h * scale }}
          className="relative"
        >
          <div
            style={{
              width: active.w,
              height: active.h,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="overflow-hidden rounded-[34px] border-[10px] border-[#1b1d20] bg-bg shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)]"
          >
            <iframe
              key={frameKey}
              title={`${active.name} preview`}
              src={`${path}?preview=1`}
              className="h-full w-full border-0"
            />
          </div>
        </div>
      </div>
      <div className="pb-4 text-[11px] text-white/40">
        {active.w} × {active.h}
      </div>
    </motion.div>
  );
}

/* ------------------------------- swatch row ------------------------------- */
function SwatchStrip({ colors }) {
  return (
    <span className="flex h-7 w-16 overflow-hidden rounded-md ring-1 ring-black/10 shrink-0">
      {colors.map((c) => (
        <span key={c} className="flex-1" style={{ background: c }} />
      ))}
    </span>
  );
}

/* ------------------------------- main panel ------------------------------- */
export default function DesignStudio() {
  const t = useTheme();
  if (t.isPreview || !t.studioUnlocked) return null;

  const {
    palettes, typographies, weights, devices, letterSpacings, lineHeights,
    palette, typography, weight, italic, device, letterSpacing, lineHeight,
    setPalette, setTypography, setWeight, setItalic, setDevice, setLetterSpacing, setLineHeight,
    studioOpen, setStudioOpen,
  } = t;

  const reset = () => {
    setPalette(DEFAULTS.palette);
    setTypography(DEFAULTS.typography);
    setWeight(DEFAULTS.weight);
    setItalic(DEFAULTS.italic);
    setLetterSpacing(DEFAULTS.letterSpacing);
    setLineHeight(DEFAULTS.lineHeight);
    setDevice(DEFAULTS.device);
  };

  return (
    <>
      <AnimatePresence>{device !== "live" && <DevicePreview />}</AnimatePresence>

      {/* Launcher */}
      <motion.button
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        onClick={() => setStudioOpen(true)}
        aria-label="Open Design Studio"
        className="fixed bottom-6 right-6 z-[140] grid h-14 w-14 place-items-center rounded-full text-white nv-shadow-lg"
        style={{ background: "linear-gradient(155deg, var(--nv-primary), var(--nv-primary-deep))" }}
      >
        <Palette size={22} />
      </motion.button>

      <AnimatePresence>
        {studioOpen && (
          <motion.aside
            key="studio"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            data-lenis-prevent
            className="fixed right-0 top-0 z-[160] flex h-full w-[92%] max-w-[380px] flex-col border-l border-line bg-surface text-ink nv-scroll-lg overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface/95 px-6 py-5 backdrop-blur">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: "var(--nv-primary)" }}>
                  <Sparkles size={17} />
                </span>
                <div>
                  <h3 className="font-display text-[1.05rem] font-extrabold leading-none">Design Studio</h3>
                  <p className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-muted">
                    <Lock size={10} /> This device only
                  </p>
                </div>
              </div>
              <button onClick={() => setStudioOpen(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-8 px-6 py-7">
              {/* Palette */}
              <Section icon={<Palette size={14} />} title="Color palette">
                <div className="flex flex-col gap-2.5">
                  {palettes.map((p) => {
                    const on = p.id === palette.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPalette(p.id)}
                        className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all ${
                          on ? "border-primary bg-surface-2 ring-2 ring-primary/15" : "border-line hover:border-line-strong"
                        }`}
                      >
                        <SwatchStrip colors={p.swatch} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-semibold">{p.name}</span>
                          <span className="block truncate text-[11px] text-muted">{p.tagline}</span>
                        </span>
                        {on && <Check size={16} className="text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Typography */}
              <Section icon={<Type size={14} />} title="Typography">
                <div className="grid grid-cols-2 gap-2.5">
                  {typographies.map((ty) => {
                    const on = ty.id === typography.id;
                    return (
                      <button
                        key={ty.id}
                        onClick={() => setTypography(ty.id)}
                        className={`rounded-2xl border px-3 py-3 text-left transition-all ${
                          on ? "border-primary bg-surface-2 ring-2 ring-primary/15" : "border-line hover:border-line-strong"
                        }`}
                      >
                        <span className="block text-[26px] leading-none" style={{ fontFamily: ty.vars["--nv-font-display"] }}>
                          {ty.sample}
                        </span>
                        <span className="mt-2 block text-[12px] font-semibold">{ty.name}</span>
                        <span className="block text-[10px] text-muted">{ty.note}</span>
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Weight + italic */}
              <Section icon={<span className="font-bold">W</span>} title="Weight & emphasis">
                <div className="flex gap-2">
                  {weights.map((w) => {
                    const on = w.id === weight.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => setWeight(w.id)}
                        style={{ fontWeight: Number(w.vars["--nv-weight-heading"]) }}
                        className={`flex-1 rounded-xl border py-2.5 text-[13px] transition-all ${
                          on ? "border-primary bg-primary text-on-primary" : "border-line text-ink hover:border-line-strong"
                        }`}
                      >
                        {w.name}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setItalic(!italic)}
                  className={`mt-2.5 flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-[13px] transition-all ${
                    italic ? "border-primary bg-surface-2" : "border-line hover:border-line-strong"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Italic size={14} /> Italic headings accent
                  </span>
                  <span className={`grid h-5 w-9 items-center rounded-full px-0.5 transition-colors ${italic ? "bg-primary" : "bg-line-strong"}`}>
                    <span className={`h-4 w-4 rounded-full bg-white transition-transform ${italic ? "translate-x-4" : ""}`} />
                  </span>
                </button>
              </Section>

              {/* Spacing */}
              <Section icon={<MoveHorizontal size={14} />} title="Spacing">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Letter spacing</p>
                <div className="flex gap-2">
                  {letterSpacings.map((ls) => {
                    const on = ls.id === letterSpacing.id;
                    return (
                      <button
                        key={ls.id}
                        onClick={() => setLetterSpacing(ls.id)}
                        style={{ letterSpacing: ls.vars["--nv-letter-spacing"] }}
                        className={`flex-1 rounded-xl border py-2.5 text-[13px] transition-all ${
                          on ? "border-primary bg-primary text-on-primary" : "border-line text-ink hover:border-line-strong"
                        }`}
                      >
                        {ls.name}
                      </button>
                    );
                  })}
                </div>
                <p className="mb-2 mt-3.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Line spacing</p>
                <div className="flex gap-2">
                  {lineHeights.map((lh) => {
                    const on = lh.id === lineHeight.id;
                    return (
                      <button
                        key={lh.id}
                        onClick={() => setLineHeight(lh.id)}
                        className={`flex-1 rounded-xl border py-2.5 text-[13px] transition-all ${
                          on ? "border-primary bg-primary text-on-primary" : "border-line text-ink hover:border-line-strong"
                        }`}
                      >
                        {lh.name}
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Device */}
              <Section icon={<Monitor size={14} />} title="Preview device">
                <div className="grid grid-cols-3 gap-2">
                  {devices.map((d) => {
                    const Icon = DEVICE_ICON[d.id] || Monitor;
                    const on = d.id === device;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setDevice(d.id)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[11px] transition-all ${
                          on ? "border-primary bg-primary text-on-primary" : "border-line text-ink hover:border-line-strong"
                        }`}
                      >
                        <Icon size={18} /> {d.name}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted">
                  Opens the live site in a scaled phone · tablet · desktop · kiosk frame.
                </p>
              </Section>

              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-[12.5px] font-medium text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <RotateCcw size={14} /> Reset to defaults
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function Section({ icon, title, children }) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        <span className="grid h-5 w-5 place-items-center text-primary">{icon}</span>
        {title}
      </p>
      {children}
    </div>
  );
}
