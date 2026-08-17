import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import { track, EVENTS } from "../../lib/analytics";

/* Interactive BMI + goal-weight calculator, shared by the landing page (inline,
   scrolled to from the hero band) and the standalone /weight-loss-calculator
   page. Inputs are drag sliders so the result recomputes live as you move them,
   which is the whole point of putting it on the landing page.

   Everything below is framed as published trial averages, never as a promise:
   the projection is a range, the eligibility note says "may be an option", and
   the medical-advice disclaimer sits with the result rather than in the footer. */

// Mean total body-weight reduction at trial endpoint, from the registrational
// GLP-1 studies. Used only to bound the projected range shown to the user.
//   STEP 1     — semaglutide 2.4 mg, 68 weeks, ~14.9% mean reduction
//   SURMOUNT-1 — tirzepatide 15 mg, 72 weeks, ~20.9% mean reduction
const TRIAL_LOW = 0.149;
const TRIAL_HIGH = 0.209;

const BMI_BANDS = [
  { max: 18.5, label: "Underweight", tone: "text-muted" },
  { max: 25, label: "Healthy weight", tone: "text-accent" },
  { max: 30, label: "Overweight", tone: "text-primary" },
  { max: Infinity, label: "Obesity", tone: "text-primary" },
];

const bandFor = (bmi) => BMI_BANDS.find((b) => bmi < b.max);

// Slider bounds, held in the unit the slider actually operates on. Height is
// driven in whole inches / whole cm so the thumb lands on a real value.
const RANGE = {
  heightIn: { min: 48, max: 84 },
  heightCm: { min: 122, max: 214 },
  weightLb: { min: 80, max: 500 },
  weightKg: { min: 36, max: 227 },
};

const IN_TO_CM = 2.54;
const LB_TO_KG = 0.45359237;

// Canonical state is metric; the imperial view is derived. Holding one source of
// truth is what keeps the ft/lb and cm/kg views from drifting apart as you
// toggle back and forth mid-drag.
const DEFAULT_CM = 175;
const DEFAULT_KG = 84;

const clamp = (n, { min, max }) => Math.min(max, Math.max(min, n));

const feetInches = (totalIn) => `${Math.floor(totalIn / 12)}' ${totalIn % 12}"`;

/** Labelled range slider with a live value readout. */
function SliderField({ id, label, value, display, min, max, onChange, minLabel, maxLabel }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.8rem] font-semibold text-ink">{label}</label>
        <span className="font-display text-[1.05rem] font-extrabold tracking-tight text-ink">{display}</span>
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
      />
      <div className="mt-1 flex justify-between font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export default function BmiCalculator({ className = "" }) {
  const [metric, setMetric] = useState(false);
  const [cm, setCm] = useState(DEFAULT_CM);
  const [kg, setKg] = useState(DEFAULT_KG);

  const result = useMemo(() => {
    const heightM = cm / 100;
    const bmi = kg / (heightM * heightM);
    if (!Number.isFinite(bmi)) return null;

    // Report the projection in whatever unit the patient is currently viewing.
    const displayWeight = metric ? kg : kg / LB_TO_KG;
    const unit = metric ? "kg" : "lb";
    const round = Math.round;

    return {
      bmi: round(bmi * 10) / 10,
      band: bandFor(bmi),
      unit,
      lossLow: round(displayWeight * TRIAL_LOW),
      lossHigh: round(displayWeight * TRIAL_HIGH),
      goalLow: round(displayWeight * (1 - TRIAL_HIGH)),
      goalHigh: round(displayWeight * (1 - TRIAL_LOW)),
      // Standard prescribing thresholds: BMI >= 30, or >= 27 with a
      // weight-related condition. Phrased as "may be" — the provider decides.
      mayQualify: bmi >= 27,
      needsComorbidity: bmi >= 27 && bmi < 30,
    };
  }, [metric, cm, kg]);

  // One event per click through to the questionnaire, carrying the band only.
  // The raw height and weight a patient dragged to never leaves the browser.
  const onSeeOptions = () => {
    track(EVENTS.CALCULATOR_USED, { band: result?.band?.label, tool: "weight-loss" });
  };

  const heightIn = Math.round(cm / IN_TO_CM);
  const weightLb = Math.round(kg / LB_TO_KG);

  // The slider bounds make a non-finite BMI unreachable, but this widget now
  // renders on the landing page — bailing out beats taking the homepage down if
  // that assumption ever stops holding.
  if (!result) return null;

  return (
    <div className={`grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] ${className}`}>
      {/* ---------------- inputs ---------------- */}
      <div className="rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface p-6 md:p-8">
        <div className="mb-7 flex items-center justify-between gap-4">
          <h3 className="font-display text-[1.15rem] font-bold leading-tight">Your details</h3>
          <div className="flex rounded-full border border-line bg-bg p-1" role="group" aria-label="Units">
            {[
              { id: "imperial", label: "ft / lb", on: !metric },
              { id: "metric", label: "cm / kg", on: metric },
            ].map((u) => (
              <button
                key={u.id}
                type="button"
                aria-pressed={u.on}
                onClick={() => setMetric(u.id === "metric")}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] transition-colors ${
                  u.on ? "bg-primary text-on-primary" : "text-muted hover:text-ink"
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-7">
          {metric ? (
            <>
              <SliderField
                id="bmi-height-cm"
                label="Height"
                value={clamp(Math.round(cm), RANGE.heightCm)}
                display={`${Math.round(cm)} cm`}
                min={RANGE.heightCm.min}
                max={RANGE.heightCm.max}
                minLabel={`${RANGE.heightCm.min} cm`}
                maxLabel={`${RANGE.heightCm.max} cm`}
                onChange={setCm}
              />
              <SliderField
                id="bmi-weight-kg"
                label="Weight"
                value={clamp(Math.round(kg), RANGE.weightKg)}
                display={`${Math.round(kg)} kg`}
                min={RANGE.weightKg.min}
                max={RANGE.weightKg.max}
                minLabel={`${RANGE.weightKg.min} kg`}
                maxLabel={`${RANGE.weightKg.max} kg`}
                onChange={setKg}
              />
            </>
          ) : (
            <>
              <SliderField
                id="bmi-height-in"
                label="Height"
                value={clamp(heightIn, RANGE.heightIn)}
                display={feetInches(clamp(heightIn, RANGE.heightIn))}
                min={RANGE.heightIn.min}
                max={RANGE.heightIn.max}
                minLabel={feetInches(RANGE.heightIn.min)}
                maxLabel={feetInches(RANGE.heightIn.max)}
                onChange={(v) => setCm(v * IN_TO_CM)}
              />
              <SliderField
                id="bmi-weight-lb"
                label="Weight"
                value={clamp(weightLb, RANGE.weightLb)}
                display={`${clamp(weightLb, RANGE.weightLb)} lb`}
                min={RANGE.weightLb.min}
                max={RANGE.weightLb.max}
                minLabel={`${RANGE.weightLb.min} lb`}
                maxLabel={`${RANGE.weightLb.max} lb`}
                onChange={(v) => setKg(v * LB_TO_KG)}
              />
            </>
          )}
        </div>

        <p className="mt-7 flex items-start gap-2 text-[0.78rem] leading-relaxed text-muted">
          <Info size={14} className="mt-0.5 shrink-0 text-primary/70" />
          Drag the sliders to your height and weight. Nothing you enter is sent anywhere or saved,
          the calculation runs entirely in your browser.
        </p>
      </div>

      {/* ---------------- results ---------------- */}
      <div
        className="h-full rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface p-6 md:p-8"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <div>
            <span className="nv-eyebrow">Your BMI</span>
            <p className="mt-2 font-display text-[clamp(2.4rem,6vw,3.4rem)] font-extrabold leading-none tracking-tight">
              {result.bmi}
            </p>
          </div>
          <span className={`font-mono text-[0.72rem] uppercase tracking-[0.12em] ${result.band.tone}`}>
            {result.band.label}
          </span>
        </div>

        <div className="mt-6">
          <span className="nv-eyebrow">Projected range</span>
          <p className="mt-3 text-[1rem] leading-relaxed text-ink">
            In clinical studies, people starting at your weight lost an average of{" "}
            <b className="font-extrabold text-primary">
              {result.lossLow} to {result.lossHigh} {result.unit}
            </b>{" "}
            over roughly 68 to 72 weeks, putting them around{" "}
            <b className="font-extrabold">
              {result.goalLow} to {result.goalHigh} {result.unit}
            </b>.
          </p>
          <p className="mt-3 text-[0.78rem] leading-relaxed text-muted">
            Based on mean total body-weight reduction reported in the STEP 1 (semaglutide 2.4 mg) and
            SURMOUNT-1 (tirzepatide 15 mg) trials. These are study averages, not a prediction for
            you. Individual results vary widely, and trial participants also followed a
            reduced-calorie diet and increased physical activity.
          </p>
        </div>

        <div className="mt-6 rounded-[calc(14px*var(--nv-r-scale,1))] bg-surface-2 p-5">
          <p className="text-[0.9rem] font-semibold leading-snug text-ink">
            {result.mayQualify
              ? "Treatment may be an option for you."
              : "Prescription weight treatment likely isn't the right fit."}
          </p>
          <p className="mt-1.5 text-[0.82rem] leading-relaxed text-muted">
            {result.mayQualify
              ? result.needsComorbidity
                ? "GLP-1 treatment is generally considered at a BMI of 30 or above, or 27 and above alongside a weight-related condition such as high blood pressure or type 2 diabetes. Only a licensed provider can determine whether it's appropriate for you."
                : "GLP-1 treatment is generally considered at a BMI of 30 or above. Only a licensed provider can determine whether it's appropriate for you."
              : "These medications are generally prescribed at a BMI of 27 or above. A provider can still talk through other options with you."}
          </p>
        </div>

        <Link
          to="/start/weight-loss"
          onClick={onSeeOptions}
          className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[0.98rem] font-semibold text-on-primary transition-all hover:-translate-y-0.5 nv-shadow"
        >
          See my treatment options
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <p className="mt-3 text-center text-[0.78rem] text-muted">
          Takes 2 minutes. You only pay if you're prescribed.
        </p>
      </div>
    </div>
  );
}
