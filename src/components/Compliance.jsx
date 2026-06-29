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

const FDA_RESEARCH =
  "This product is an experimental chemical compounded for research use only. Claims about the use of this product and its safety have not been evaluated or approved by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. Use only in consultation with a medical provider. Results are not guaranteed, and you may experience side effects.";
const FDA_NOT_APPROVED =
  "Claims about the use of this product have not been evaluated or approved by the FDA. Use only in consultation with a medical provider. Results are not guaranteed, and you may experience side effects.";
const FDA_COMPOUNDED =
  "Compounded products have not been evaluated or approved by the FDA. Use only in consultation with a medical provider. Results are not guaranteed, and you may experience side effects.";

const FDA_GROUPS = [
  { text: FDA_RESEARCH, match: ["nad", "mots-c", "bpc-157", "tb-500", "tb4", "thymosin beta 4", "selank", "semax", "ipamorelin"] },
  { text: FDA_NOT_APPROVED, match: ["ss-31", "retatrutide"] },
  { text: FDA_COMPOUNDED, match: ["tesamorelin", "tirzepatide"] },
];

export function fdaDisclaimer(product) {
  const name = (product?.name || "").toLowerCase();
  for (const g of FDA_GROUPS) {
    if (g.match.some((m) => name.includes(m))) return g.text;
  }
  return null;
}

export function FdaDisclaimer({ product, className = "" }) {
  const text = fdaDisclaimer(product);
  if (!text) return null;
  return <p className={`text-[0.82rem] italic leading-relaxed text-muted ${className}`}>{text}</p>;
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
