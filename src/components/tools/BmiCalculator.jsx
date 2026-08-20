import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import { track, EVENTS } from "../../lib/analytics";

const DIAL_MIN = 16;
const DIAL_MAX = 40;

const BANDS = [
  {
    key: "under", label: "Underweight", range: "< 18.5", max: 18.5, color: "var(--nv-muted)",
    note: "Your BMI is below the healthy range, so prescription weight treatment is not appropriate. A licensed provider can talk through other options with you.",
  },
  {
    key: "healthy", label: "Healthy weight", range: "18.5 - 24.9", max: 25, color: "var(--nv-accent)",
    note: "Your BMI sits within the healthy range, so weight-loss medication generally is not indicated. A licensed provider can still discuss your goals with you.",
  },
  {
    key: "over", label: "Overweight", range: "25 - 29.9", max: 30, color: "var(--nv-primary)",
    note: "GLP-1 treatment is generally considered from a BMI of 27 alongside a weight-related condition such as high blood pressure or type 2 diabetes. Only a licensed provider can determine whether it is appropriate for you.",
  },
  {
    key: "obese", label: "Obesity", range: "30 and above", max: Infinity, color: "var(--nv-primary)",
    note: "GLP-1 treatment is generally considered at a BMI of 30 or above. Only a licensed provider can determine whether it is appropriate for you.",
  },
];

const bandFor = (bmi) => BANDS.find((b) => bmi < b.max);

const RANGE = {
  heightIn: { min: 48, max: 84 },
  weightLb: { min: 80, max: 500 },
};

const IN_TO_CM = 2.54;
const LB_TO_KG = 0.45359237;
const DEFAULT_CM = 175;
const DEFAULT_KG = 84;

const clamp = (n, { min, max }) => Math.min(max, Math.max(min, n));
const feetInches = (totalIn) => `${Math.floor(totalIn / 12)}' ${totalIn % 12}"`;

/* ------------------------------- the dial ------------------------------- */

const DIAL = { cx: 150, cy: 148, r: 108, labelR: 130 };
const ARC_LEN = Math.PI * DIAL.r;

// BMI -> point on the semicircle. 180deg is the left end, 0deg the right.
function pointAt(value, radius) {
  const t = (clamp(value, { min: DIAL_MIN, max: DIAL_MAX }) - DIAL_MIN) / (DIAL_MAX - DIAL_MIN);
  const rad = ((180 - t * 180) * Math.PI) / 180;
  return { x: DIAL.cx + radius * Math.cos(rad), y: DIAL.cy - radius * Math.sin(rad) };
}

function Dial({ bmi, color }) {
  const t = (clamp(bmi, { min: DIAL_MIN, max: DIAL_MAX }) - DIAL_MIN) / (DIAL_MAX - DIAL_MIN);
  const knob = pointAt(bmi, DIAL.r);
  const arc = `M ${DIAL.cx - DIAL.r} ${DIAL.cy} A ${DIAL.r} ${DIAL.r} 0 0 1 ${DIAL.cx + DIAL.r} ${DIAL.cy}`;

  return (
    <svg viewBox="0 0 300 172" className="w-full" role="img" aria-label={`BMI ${bmi}`}>
      <defs>
        <linearGradient id="nv-bmi-sweep" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={`color-mix(in oklab, ${color} 45%, var(--nv-surface))`} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>

      <path d={arc} fill="none" stroke="var(--nv-line)" strokeWidth="15" strokeLinecap="round" />
      <path
        d={arc}
        fill="none"
        stroke="url(#nv-bmi-sweep)"
        strokeWidth="15"
        strokeLinecap="round"
        strokeDasharray={`${t * ARC_LEN} ${ARC_LEN}`}
        style={{ transition: "stroke-dasharray 0.2s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      {/* White collar under the knob keeps it legible where it overlaps the track. */}
      <circle
        cx={knob.x}
        cy={knob.y}
        r="10"
        fill={color}
        stroke="var(--nv-surface)"
        strokeWidth="5"
        style={{ transition: "cx 0.2s cubic-bezier(0.22, 1, 0.36, 1), cy 0.2s cubic-bezier(0.22, 1, 0.36, 1), fill 0.3s ease" }}
      />
      {[DIAL_MIN, 18.5, 25, 30, DIAL_MAX].map((v) => {
        const p = pointAt(v, DIAL.labelR);
        return (
          <text
            key={v}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--nv-muted)"
            className="font-mono"
            fontSize="10.5"
          >
            {v}
          </text>
        );
      })}
    </svg>
  );
}

/* ------------------------------- sliders -------------------------------- */

function SliderField({ id, label, value, display, min, max, onChange, minLabel, maxLabel }) {
  const fill = `${((value - min) / (max - min)) * 100}%`;
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.9rem] font-semibold text-ink">{label}</label>
        <span className="font-display text-[1.45rem] font-extrabold tracking-tight text-ink tabular-nums">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="nv-range w-full"
        style={{ "--nv-fill": fill }}
      />
      <div className="mt-1.5 flex justify-between font-mono text-[0.66rem] uppercase tracking-widest text-muted">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

/* ------------------------------ component ------------------------------- */

export default function BmiCalculator({ className = "" }) {
  const [cm, setCm] = useState(DEFAULT_CM);
  const [kg, setKg] = useState(DEFAULT_KG);

  const result = useMemo(() => {
    const heightM = cm / 100;
    const bmi = kg / (heightM * heightM);
    if (!Number.isFinite(bmi)) return null;

    return {
      bmi: Math.round(bmi * 10) / 10,
      band: bandFor(bmi),
      mayQualify: bmi >= 27,
    };
  }, [cm, kg]);

  // One event per click through, carrying the band only. The height and weight a
  // patient dragged to never leaves the browser.
  const onSeeOptions = () => {
    track(EVENTS.CALCULATOR_USED, { band: result?.band?.label, tool: "weight-loss" });
  };

  const heightIn = Math.round(cm / IN_TO_CM);
  const weightLb = Math.round(kg / LB_TO_KG);

  if (!result) return null;

  return (
    <div
      className={`overflow-hidden rounded-[calc(24px*var(--nv-r-scale,1))] border border-line bg-surface nv-shadow ${className}`}
    >
      {/* ---------------- inputs ---------------- */}
      <div className="p-6 md:px-9 md:py-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-display text-[1.2rem] font-bold leading-tight">Your details</h3>
          <p className="text-[0.88rem] leading-relaxed text-muted">
            Drag each slider to where you are today.
          </p>
        </div>

        <div className="mt-6 grid gap-7 sm:grid-cols-2 sm:gap-x-12">
          <SliderField
            id="bmi-height-in" label="Height"
            value={clamp(heightIn, RANGE.heightIn)} display={feetInches(clamp(heightIn, RANGE.heightIn))}
            min={RANGE.heightIn.min} max={RANGE.heightIn.max}
            minLabel={feetInches(RANGE.heightIn.min)} maxLabel={feetInches(RANGE.heightIn.max)}
            onChange={(v) => setCm(v * IN_TO_CM)}
          />
          <SliderField
            id="bmi-weight-lb" label="Current weight"
            value={clamp(weightLb, RANGE.weightLb)} display={`${clamp(weightLb, RANGE.weightLb)} lb`}
            min={RANGE.weightLb.min} max={RANGE.weightLb.max}
            minLabel={`${RANGE.weightLb.min} lb`} maxLabel={`${RANGE.weightLb.max} lb`}
            onChange={(v) => setKg(v * LB_TO_KG)}
          />
        </div>

        <p className="mt-6 flex items-start gap-2 text-[0.82rem] leading-relaxed text-muted">
          <Info size={14} className="mt-0.5 shrink-0 text-primary/70" />
          Nothing you enter is sent anywhere or saved, the calculation runs entirely in your browser.
        </p>
      </div>

      {/* ---------------- reading ----------------
          aria-live sits here rather than on the card: the sliders are inside the
          card too, and announcing their own labels back on every drag would bury
          the number the patient is listening for. */}
      <div className="relative border-t border-line p-6 md:px-9 md:py-8" aria-live="polite">
        {/* Dial left, scale right. Stacking the reading ran the card past a laptop
            viewport and made a patient scroll to see their own number, so the two
            halves of the result sit side by side from md up. */}
        <div className="grid items-center gap-x-12 gap-y-7 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div className="relative mx-auto w-full max-w-80">
            {/* Warm wash rides with the dial rather than the block, so it stays
                behind the arc whichever way the two halves are laid out. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 62%, color-mix(in oklab, var(--nv-primary) 12%, transparent), transparent 70%)",
              }}
            />
            <Dial bmi={result.bmi} color={result.band.color} />
            {/* Reading sits inside the dial's own arc, band name included. A
                separate pill underneath cost a whole row to repeat what the lit
                segment of the scale already says. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 text-center">
              <span className="block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                Your BMI
              </span>
              <span className="block font-display text-[clamp(2.5rem,5.5vw,3.3rem)] font-extrabold leading-none tracking-tight text-ink tabular-nums">
                {result.bmi}
              </span>
              <span
                className="mt-1.5 block text-[0.95rem] font-bold leading-tight transition-colors duration-300"
                style={{ color: result.band.color }}
              >
                {result.band.label}
              </span>
            </div>
          </div>

          <div>
            {/* Two by two, each segment on a single line. Four stacked full-width
                rows read as a list to scroll; this reads as a scale to glance at. */}
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {BANDS.map((b) => {
                const on = b.key === result.band.key;
                return (
                  <li
                    key={b.key}
                    className={`flex items-baseline justify-between gap-2 rounded-xl border px-4 py-2.5 transition-colors duration-300 ${
                      on ? "" : "border-line text-muted"
                    }`}
                    style={
                      on
                        ? {
                            color: b.color,
                            borderColor: `color-mix(in oklab, ${b.color} 38%, transparent)`,
                            background: `color-mix(in oklab, ${b.color} 10%, var(--nv-surface))`,
                          }
                        : undefined
                    }
                  >
                    <span className={`text-[0.9rem] leading-tight ${on ? "font-bold" : ""}`}>
                      {b.label}
                    </span>
                    <span className={`font-mono text-[0.7rem] ${on ? "" : "text-muted/70"}`}>
                      {b.range}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Keyed on the band so the note crossfades when the reading crosses a
                boundary, instead of the text swapping under the cursor mid-drag. */}
            <p
              key={result.band.key}
              className="nv-fade-in mt-3.5 rounded-xl px-5 py-4 text-[0.86rem] leading-relaxed text-muted"
              style={{ background: `color-mix(in oklab, ${result.band.color} 7%, var(--nv-surface-2))` }}
            >
              {result.band.note}
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- CTA rail ---------------- */}
      <div className="flex flex-col gap-3 border-t border-line bg-surface-2 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-9">
        <p className="max-w-[52ch] text-[0.84rem] leading-relaxed text-muted">
          Takes 2 minutes. You pay only if a provider determines that a prescription is appropriate.
        </p>
        <Link
          to="/start/weight-loss"
          onClick={onSeeOptions}
          className="group flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[0.98rem] font-semibold text-on-primary transition-all hover:-translate-y-0.5 nv-shadow"
        >
          {result.mayQualify ? "See my treatment options" : "Talk to a provider"}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
