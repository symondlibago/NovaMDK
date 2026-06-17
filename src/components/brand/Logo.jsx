import React from "react";

/**
 * NovaMD wordmark. `dark` flips it for placement on dark panels (footer).
 * Colors flow from the live theme tokens so the mark re-skins with the palette.
 */
export default function Logo({ className = "", size = "md", dark = false, markOnly = false }) {
  const sizes = {
    sm: { box: 26, text: "text-[1.15rem]" },
    md: { box: 32, text: "text-[1.4rem]" },
    lg: { box: 40, text: "text-[1.8rem]" },
  };
  const s = sizes[size] || sizes.md;
  const base = dark ? "text-on-panel" : "text-ink";
  const mark = dark ? "var(--nv-accent)" : "var(--nv-primary)";

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`} aria-label="NovaMD">
      <span
        className="relative inline-grid place-items-center rounded-[10px] shrink-0 nv-shadow"
        style={{
          width: s.box,
          height: s.box,
          background: `linear-gradient(155deg, var(--nv-primary) 0%, var(--nv-primary-deep) 100%)`,
        }}
      >
        <svg width={s.box * 0.5} height={s.box * 0.5} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 4v16M4 12h16"
            stroke="var(--nv-on-primary)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {!markOnly && (
        <span className={`font-display font-extrabold leading-none tracking-tight ${s.text} ${base}`}>
          Nova<span className="nv-em" style={{ color: mark }}>MD</span>
        </span>
      )}
    </span>
  );
}
