import React from "react";
export function ComplianceBadges({ compounded = true, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-ink">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Rx only
      </span>
      {compounded && (
        <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-1 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted">
          Compounded
        </span>
      )}
    </div>
  );
}

export function CompoundedDisclaimer({ className = "", tone = "muted" }) {
  const color = tone === "panel" ? "text-on-panel/55" : "text-muted";
  return (
    <div className={`space-y-2 text-[0.78rem] leading-relaxed ${color} ${className}`}>
      <p>
        Compounded drug products are not approved or evaluated for safety, effectiveness, or quality by
        the FDA. Prescription required.
      </p>
      <p>
        NovaMDK does not manufacture GLP-1 medications. The medication you receive may differ in
        appearance from the website images. Weight loss is not guaranteed.
      </p>
    </div>
  );
}
