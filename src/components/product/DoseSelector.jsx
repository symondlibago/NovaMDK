import React from "react";
import { Check } from "lucide-react";
import { stageOf } from "../../lib/catalog";

/* Dose-ladder selector. Each rung is a real product with its own page, so the
   selector swaps the displayed rung in place and rewrites the URL with
   history.replaceState rather than routing.

   Going through the router would work, but ScrollToTop fires on every pathname
   change and would throw the patient back to the top of the page mid-comparison.
   replaceState keeps the scroll position, keeps the URL shareable, and the target
   is a genuine route, so a reload or a paste of that URL still resolves. */

const STAGE_BLURB = {
  Starter: "Opening step",
  "Mid-Dose": "Step up",
  Maintenance: "Ongoing",
};

export default function DoseSelector({ ladder, activeId, onSelect }) {
  if (ladder.length < 2) return null;

  return (
    <div className="mt-6 border-t border-line pt-5">
      <span className="font-mono text-[0.66rem] uppercase tracking-[0.13em] text-muted">
        Choose your step
      </span>
      <div
        role="tablist"
        aria-label="Dose step"
        className="mt-3 grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(${ladder.length}, minmax(0, 1fr))` }}
      >
        {ladder.map((p) => {
          const stage = stageOf(p);
          const on = p.id === activeId;
          return (
            <button
              key={p.id}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => onSelect(p)}
              className={`relative flex flex-col items-start gap-1 rounded-[calc(16px*var(--nv-r-scale,1))] border p-3.5 text-left transition-all ${
                on
                  ? "border-primary bg-primary/8 nv-shadow"
                  : "border-line bg-surface hover:border-line-strong hover:-translate-y-0.5"
              }`}
            >
              {on && (
                <span className="absolute right-3 top-3 grid h-4 w-4 place-items-center rounded-full bg-primary text-on-primary">
                  <Check size={10} strokeWidth={3.5} />
                </span>
              )}
              <span className={`text-[0.86rem] font-bold leading-tight ${on ? "text-primary" : "text-ink"}`}>
                {stage}
              </span>
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted">
                {STAGE_BLURB[stage] || ""}
              </span>
              <span className="mt-1 font-display text-[1.05rem] font-extrabold leading-none tracking-tight text-ink">
                {p.price}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
