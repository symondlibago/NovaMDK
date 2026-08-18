import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import { track, EVENTS } from "../../lib/analytics";

/* Interactive BMI + goal-weight calculator.

   Combines the two references the client sent: the BMI dial and band list from
   hims, and the "weight you could lose" readout from MEDVi, in one panel driven
   by drag sliders so everything recomputes live.

   Framing stays conservative throughout. The projection is a range, the
   eligibility note says "may be", and the band copy defers to a provider. The
   projection only appears once BMI reaches the overweight band, because showing
   someone at a healthy weight how much they "could lose" would be selling a
   medication to a person who does not need one. */

// Mean total body-weight reduction at trial endpoint, from the registrational
// GLP-1 studies. Used only to bound the projected range shown to the user.
//   STEP 1     - semaglutide 2.4 mg, 68 weeks, ~14.9% mean reduction
//   SURMOUNT-1 - tirzepatide 15 mg, 72 weeks, ~20.9% mean reduction
const TRIAL_LOW = 0.149;
const TRIAL_HIGH = 0.209;

// Dial spans 16 to 40: past the readable extremes of the four bands without
// squashing the healthy range into a sliver.
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

/* Feet/pounds only. The cm/kg toggle was dropped at the client's request
   (2026-08-19); the audience is US patients. State is still held in cm/kg
   because that is what the BMI formula needs, and the imperial figures the
   sliders show are derived from it. */
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
        {/* The filled arc runs from a washed tint of the band colour into the
            colour itself, so the sweep has some depth instead of reading as a
            flat band of paint. */}
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
        style={{ transition: "stroke-dasharray 0.35s ease" }}
      />
      {/* White collar under the knob keeps it legible where it overlaps the track. */}
      <circle
        cx={knob.x}
        cy={knob.y}
        r="10"
        fill={color}
        stroke="var(--nv-surface)"
        strokeWidth="5"
        style={{ transition: "cx 0.35s ease, cy 0.35s ease, fill 0.35s ease" }}
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
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.8rem] font-semibold text-ink">{label}</label>
        <span className="font-display text-[1.15rem] font-extrabold tracking-tight text-ink">{display}</span>
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

/* ------------------------------ component ------------------------------- */

export default function BmiCalculator({ className = "" }) {
  const [cm, setCm] = useState(DEFAULT_CM);
  const [kg, setKg] = useState(DEFAULT_KG);

  const result = useMemo(() => {
    const heightM = cm / 100;
    const bmi = kg / (heightM * heightM);
    if (!Number.isFinite(bmi)) return null;

    const displayWeight = kg / LB_TO_KG;
    const round = Math.round;

    return {
      bmi: round(bmi * 10) / 10,
      band: bandFor(bmi),
      unit: "lb",
      lossLow: round(displayWeight * TRIAL_LOW),
      lossHigh: round(displayWeight * TRIAL_HIGH),
      goalLow: round(displayWeight * (1 - TRIAL_HIGH)),
      goalHigh: round(displayWeight * (1 - TRIAL_LOW)),
      // Projection is withheld below the overweight band on purpose.
      showProjection: bmi >= 25,
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
    <div className={`grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] ${className}`}>
      {/* ---------------- inputs ---------------- */}
      <div className="rounded-[calc(24px*var(--nv-r-scale,1))] border border-line bg-surface p-6 md:p-8">
        <h3 className="mb-7 font-display text-[1.15rem] font-bold leading-tight">Your details</h3>

        <div className="space-y-7">
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

        {/* The MEDVi readout: the number that makes the tool worth using. */}
        {result.showProjection && (
          <div className="mt-8 flex items-end justify-between gap-4 border-t border-line pt-6">
            <span className="max-w-[20ch]">
              <span className="block text-[0.86rem] font-semibold leading-snug text-ink">
                Weight loss reported in clinical studies
              </span>
              <span className="mt-1 block text-[0.76rem] leading-snug text-muted">
                At your starting weight, over 68 to 72 weeks
              </span>
            </span>
            <span className="whitespace-nowrap text-right">
              <b className="font-display text-[clamp(1.9rem,5vw,2.6rem)] font-extrabold leading-none tracking-tight text-primary">
                {result.lossLow} to {result.lossHigh}
              </b>
              <span className="ml-1.5 text-[0.9rem] font-semibold text-muted">{result.unit}</span>
            </span>
          </div>
        )}

        <p className="mt-6 flex items-start gap-2 text-[0.78rem] leading-relaxed text-muted">
          <Info size={14} className="mt-0.5 shrink-0 text-primary/70" />
          Drag the sliders to your height and weight. Nothing you enter is sent anywhere or saved,
          the calculation runs entirely in your browser.
        </p>
      </div>

      {/* ---------------- results panel ---------------- */}
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[calc(24px*var(--nv-r-scale,1))] border border-line bg-surface p-6 md:p-8 nv-shadow"
        aria-live="polite"
      >
        {/* Warm wash behind the dial so the panel has some depth without needing
            a dark ground. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[320px]"
          style={{
            background:
              "radial-gradient(70% 100% at 50% 0%, color-mix(in oklab, var(--nv-primary) 12%, transparent), transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[340px]">
          <Dial bmi={result.bmi} color={result.band.color} />
          {/* The reading sits inside the dial's own arc. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-1 text-center">
            <span className="block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
              Your BMI
            </span>
            <span className="block font-display text-[clamp(2.6rem,7vw,3.4rem)] font-extrabold leading-none tracking-tight text-ink">
              {result.bmi}
            </span>
          </div>
        </div>

        {/* Band list, active one expanded. */}
        <ul className="relative mt-7 space-y-1">
          {BANDS.map((b) => {
            const on = b.key === result.band.key;
            return (
              <li key={b.key}>
                <div
                  className={`rounded-[calc(14px*var(--nv-r-scale,1))] px-4 py-3 transition-colors duration-300 ${
                    on ? "border border-line bg-surface-2" : ""
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={`flex items-center gap-2 text-[0.92rem] ${on ? "font-bold text-ink" : "text-muted"}`}>
                      {on && (
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: b.color }}
                        />
                      )}
                      {b.label}
                    </span>
                    <span className={`font-mono text-[0.72rem] ${on ? "font-bold text-ink" : "text-muted/70"}`}>
                      {b.range}
                    </span>
                  </div>
                  {on && <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">{b.note}</p>}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="relative mt-auto pt-7">
          <Link
            to="/start/weight-loss"
            onClick={onSeeOptions}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[0.98rem] font-semibold text-on-primary transition-all hover:-translate-y-0.5 nv-shadow"
          >
            {result.mayQualify ? "See my treatment options" : "Talk to a provider"}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="mt-3 text-center text-[0.78rem] text-muted">
            Takes 2 minutes. You only pay if you are prescribed.
          </p>
        </div>
      </div>
    </div>
  );
}
