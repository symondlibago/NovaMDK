import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import Seo from "../components/Seo";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Nav/Footer";
import PageHero from "../components/shop/PageHero";
import Reveal from "../components/ui/Reveal";
import { track, EVENTS } from "../lib/analytics";

const TRIAL_LOW = 0.149;
const TRIAL_HIGH = 0.209;

const BMI_BANDS = [
  { max: 18.5, label: "Underweight", tone: "text-muted" },
  { max: 25, label: "Healthy weight", tone: "text-accent" },
  { max: 30, label: "Overweight", tone: "text-primary" },
  { max: Infinity, label: "Obesity", tone: "text-primary" },
];

const bandFor = (bmi) => BMI_BANDS.find((b) => bmi < b.max);

const round = (n) => Math.round(n);

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const inputClass =
  "w-full rounded-[calc(12px*var(--nv-r-scale,1))] border border-line bg-bg px-4 py-3 text-[1rem] font-medium text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-primary";
const labelClass = "mb-1.5 block text-[0.8rem] font-semibold text-ink";

export default function WeightLossCalculatorPage() {
  const [metric, setMetric] = useState(false);
  const [ft, setFt] = useState("");
  const [inch, setInch] = useState("");
  const [cm, setCm] = useState("");
  const [lb, setLb] = useState("");
  const [kg, setKg] = useState("");

  const result = useMemo(() => {
    // Normalise to metric, then compute once.
    let heightM = null;
    let weightKg = null;

    if (metric) {
      const c = num(cm);
      const k = num(kg);
      if (c) heightM = c / 100;
      if (k) weightKg = k;
    } else {
      const f = num(ft);
      // Inches are optional — 6 ft flat is a valid entry, 6 ft "0 in" is not a
      // number `num()` accepts, so an empty inches box must not block the result.
      const i = Number(inch) || 0;
      if (f) heightM = (f * 12 + i) * 0.0254;
      const p = num(lb);
      if (p) weightKg = p * 0.45359237;
    }

    if (!heightM || !weightKg) return null;

    const bmi = weightKg / (heightM * heightM);
    if (!Number.isFinite(bmi) || bmi < 10 || bmi > 90) return null;

    // Report the projection in whatever unit the patient typed in.
    const displayWeight = metric ? weightKg : weightKg / 0.45359237;
    const unit = metric ? "kg" : "lb";

    return {
      bmi: Math.round(bmi * 10) / 10,
      band: bandFor(bmi),
      unit,
      lossLow: round(displayWeight * TRIAL_LOW),
      lossHigh: round(displayWeight * TRIAL_HIGH),
      goalLow: round(displayWeight * (1 - TRIAL_HIGH)),
      goalHigh: round(displayWeight * (1 - TRIAL_LOW)),
      mayQualify: bmi >= 27,
      needsComorbidity: bmi >= 27 && bmi < 30,
    };
  }, [metric, ft, inch, cm, lb, kg]);

  const onSeeOptions = () => {
    track(EVENTS.CALCULATOR_USED, { band: result?.band?.label, tool: "weight-loss" });
  };

  return (
    <main className="min-h-screen w-full bg-bg text-ink">
      <Seo
        title="Weight Loss Calculator: BMI & GLP-1 Goal Projection"
        description="Free weight loss calculator: check your BMI, see the weight range clinical GLP-1 studies associate with your starting weight, and find out whether treatment may be an option for you."
        path="/weight-loss-calculator"
      />
      <Navbar />

      <PageHero
        showBack
        eyebrow="Free tool"
        title="Weight loss calculator"
        subtitle="Check your BMI and see the range clinical GLP-1 studies report for someone starting at your weight."
        chips={["No sign-up", "Takes 20 seconds", "Nothing stored"]}
      />

      <section className="mx-auto max-w-[1180px] px-5 py-[clamp(2.4rem,5vw,4rem)] md:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          {/* ---------------- inputs ---------------- */}
          <Reveal>
            <div className="rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="font-display text-[1.15rem] font-bold leading-tight">Your details</h2>
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

              {metric ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="cm">Height (cm)</label>
                    <input id="cm" className={inputClass} type="number" inputMode="decimal" min="80" max="250"
                      placeholder="175" value={cm} onChange={(e) => setCm(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="kg">Weight (kg)</label>
                    <input id="kg" className={inputClass} type="number" inputMode="decimal" min="30" max="350"
                      placeholder="90" value={kg} onChange={(e) => setKg(e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass} htmlFor="ft">Height (ft)</label>
                      <input id="ft" className={inputClass} type="number" inputMode="numeric" min="3" max="8"
                        placeholder="5" value={ft} onChange={(e) => setFt(e.target.value)} />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="in">(in)</label>
                      <input id="in" className={inputClass} type="number" inputMode="numeric" min="0" max="11"
                        placeholder="9" value={inch} onChange={(e) => setInch(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="lb">Weight (lb)</label>
                    <input id="lb" className={inputClass} type="number" inputMode="decimal" min="60" max="800"
                      placeholder="200" value={lb} onChange={(e) => setLb(e.target.value)} />
                  </div>
                </div>
              )}

              <p className="mt-5 flex items-start gap-2 text-[0.78rem] leading-relaxed text-muted">
                <Info size={14} className="mt-0.5 shrink-0 text-primary/70" />
                Nothing you type here is sent anywhere or saved. The calculation runs entirely in
                your browser.
              </p>
            </div>
          </Reveal>

          {/* ---------------- results ---------------- */}
          <Reveal delay={0.08}>
            <div className="h-full rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface p-6 md:p-8">
              {!result ? (
                <div className="grid h-full min-h-55 place-items-center text-center">
                  <p className="max-w-[30ch] text-[0.95rem] leading-relaxed text-muted">
                    Enter your height and weight to see your BMI and projected range.
                  </p>
                </div>
              ) : (
                <>
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
                      Based on mean total body-weight reduction reported in the STEP 1 (semaglutide
                      2.4 mg) and SURMOUNT-1 (tirzepatide 15 mg) trials. These are study averages,
                      not a prediction for you. Individual results vary widely, and trial
                      participants also followed a reduced-calorie diet and increased physical
                      activity.
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
                </>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-[clamp(2rem,4vw,3rem)] overflow-hidden rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface px-6 py-7 md:px-10">
            <h2 className="font-display text-[1.15rem] font-bold leading-tight">How BMI is categorised</h2>
            <p className="mt-2 max-w-[62ch] text-[0.9rem] leading-relaxed text-muted">
              BMI is a screening measure, not a diagnosis. It doesn't distinguish muscle from fat, so
              it can misread very muscular or older adults. Providers use it alongside your history,
              not on its own.
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
              {[
                ["Under 18.5", "Underweight"],
                ["18.5 to 24.9", "Healthy weight"],
                ["25.0 to 29.9", "Overweight"],
                ["30.0 and above", "Obesity"],
              ].map(([range, label]) => (
                <div key={label}>
                  <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">{range}</dt>
                  <dd className="mt-1 text-[0.92rem] font-semibold text-ink">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <p className="mt-8 text-[0.8rem] leading-relaxed text-muted">
          This calculator is provided for general information only. It is not medical advice, does
          not create a patient-provider relationship, and is not a determination that you will be
          prescribed anything. Talk to a licensed provider about your own circumstances.
        </p>
      </section>

      <Footer />
    </main>
  );
}
