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

/* ------------------------------- the scale ------------------------------- */

/* Replaced the semicircle dial on 2026-09-01. The dial and the 2x2 grid of band
   boxes beside it were two drawings of one fact: the dial showed where the
   reading sat on the range, the boxes showed the same ranges again as a list,
   and the lit box repeated the band name already printed inside the arc. That
   cost a tall two-column row to say one thing three times. This is the same
   information as a single object — the bands ARE the track, and the reading is a
   position along it — which is both shorter and easier to read at a glance,
   because "which segment am I in" is answered by looking at one place. */

/* Each band as a segment of the track, sized by how much of the 16-40 range it
   actually spans. Proportional, not equal quarters: obesity is 10 BMI points
   wide and underweight is 2.5, and drawing them the same width would misstate
   the scale a patient is reading themselves against. */
const SEGMENTS = BANDS.map((b, i) => {
  const lo = i === 0 ? DIAL_MIN : BANDS[i - 1].max;
  const hi = Math.min(b.max, DIAL_MAX);
  return { ...b, lo, hi, width: ((hi - lo) / (DIAL_MAX - DIAL_MIN)) * 100 };
});

const SCALE_STOPS = [DIAL_MIN, 18.5, 25, 30, DIAL_MAX];
const pctOf = (v) => ((clamp(v, { min: DIAL_MIN, max: DIAL_MAX }) - DIAL_MIN) / (DIAL_MAX - DIAL_MIN)) * 100;

function Scale({ bmi, band }) {
  const left = pctOf(bmi);
  return (
    /* No top margin of its own — it is a grid cell beside the reading, and the
       row's gap sets the space above it when the two stack on a phone. */
    <div>
      {/* The marker rides above the track rather than on it, so it never covers
          the one colour the reader is trying to identify. */}
      <div className="relative h-6" aria-hidden="true">
        <span
          className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center transition-[left] duration-200 ease-out"
          style={{ left: `${left}%` }}
        >
          <span className="font-mono text-[0.66rem] font-semibold tabular-nums" style={{ color: band.color }}>
            {bmi}
          </span>
          <span
            className="mt-1 h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent transition-colors duration-300"
            style={{ borderTopColor: band.color }}
          />
        </span>
      </div>

      <div className="flex gap-1">
        {SEGMENTS.map((s) => (
          <span
            key={s.key}
            className="h-2.5 rounded-full transition-colors duration-300"
            style={{
              width: `${s.width}%`,
              background:
                s.key === band.key ? s.color : `color-mix(in oklab, ${s.color} 20%, var(--nv-surface-2))`,
            }}
          />
        ))}
      </div>

      {/* Boundary numbers sit at the value they mark, not spread evenly, so each
          one lines up with the join it names in the track above. */}
      <div className="relative mt-2 h-4" aria-hidden="true">
        {SCALE_STOPS.map((v) => (
          <span
            key={v}
            className="absolute -translate-x-1/2 font-mono text-[0.64rem] tabular-nums text-muted"
            style={{ left: `${pctOf(v)}%` }}
          >
            {v}
          </span>
        ))}
      </div>

      {/* Legend widths are natural rather than tied to the segments above:
          "Underweight" is a long word over a segment worth a tenth of the track,
          and pinning it there set it in a two-character column. */}
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {SEGMENTS.map((s) => {
          const on = s.key === band.key;
          return (
            <li
              key={s.key}
              className={`flex items-center gap-1.5 text-[0.78rem] transition-colors duration-300 ${on ? "font-bold" : "text-muted"}`}
              style={on ? { color: s.color } : undefined}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full transition-colors duration-300"
                style={{ background: on ? s.color : `color-mix(in oklab, ${s.color} 35%, var(--nv-line))` }}
              />
              {s.label}
              <span className={`font-mono text-[0.68rem] tabular-nums ${on ? "" : "text-muted/70"}`}>{s.range}</span>
            </li>
          );
        })}
      </ul>
    </div>
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

  /* Three bands, in reading order: what you are, where that sits, what it means.
     The result half was rebuilt on 2026-09-01 — see the note above Scale for why
     the dial went. The shell keeps its three stacked sections because they are
     the three steps of using the thing, and the divider between inputs and
     reading is what stops a drag feeling like it edits the answer in place.

     Radii here come from --nv-r-scale like every other card on the site. They
     used to be Tailwind's fixed rounded-xl, so turning the global scale up left
     this tool's insides square inside its own rounded shell. */
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

        <div className="mt-5 grid gap-6 sm:grid-cols-2 sm:gap-x-10">
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

        <p className="mt-5 flex items-start gap-2 text-[0.82rem] leading-relaxed text-muted">
          <Info size={14} className="mt-0.5 shrink-0 text-primary/70" />
          Nothing you enter is sent anywhere or saved, the calculation runs entirely in your browser.
        </p>
      </div>

      {/* ---------------- reading ----------------
          aria-live sits here rather than on the card: the sliders are inside the
          card too, and announcing their own labels back on every drag would bury
          the number the patient is listening for. */}
      <div className="relative border-t border-line p-6 md:px-9 md:py-7" aria-live="polite">
        {/* Reading beside the scale, not above it. Stacked, the two ran the card
            taller than the dial layout it replaced, which would have traded one
            problem for another — side by side they use the same vertical space
            and the number still comes first in reading order. The left column is
            auto-width so the track takes whatever the number does not. */}
        <div className="grid gap-x-10 gap-y-5 md:grid-cols-[minmax(0,auto)_minmax(0,1fr)] md:items-center">
          <div>
            <span className="block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
              Your BMI
            </span>
            <span className="block font-display text-[clamp(2.6rem,6vw,3.5rem)] font-extrabold leading-none tracking-tight text-ink tabular-nums">
              {result.bmi}
            </span>
            <span
              className="mt-1.5 block text-[1.02rem] font-bold leading-tight transition-colors duration-300"
              style={{ color: result.band.color }}
            >
              {result.band.label}
            </span>
          </div>

          <Scale bmi={result.bmi} band={result.band} />
        </div>

        {/* Keyed on the band so the note crossfades when the reading crosses a
            boundary, instead of the text swapping under the cursor mid-drag. */}
        <p
          key={result.band.key}
          className="nv-fade-in mt-6 rounded-[calc(12px*var(--nv-r-scale,1))] px-4 py-3.5 text-[0.86rem] leading-relaxed text-muted"
          style={{ background: `color-mix(in oklab, ${result.band.color} 7%, var(--nv-surface-2))` }}
        >
          {result.band.note}
        </p>
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
