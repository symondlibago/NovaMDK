import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "../ui/Reveal";

/**
 * Category tiles used by the Treatments / Supplements pages.
 * Each item: { name, tag, link, blurb?, cta?, art? }.
 * `dark` renders the navy product-card style (Treatments funnels).
 */
function DarkCard({ it, art, onClick }) {
  return (
    <Link
      to={it.link}
      onClick={onClick}
      className="group relative flex h-full min-h-[clamp(196px,24vw,220px)] flex-col justify-between overflow-hidden rounded-[calc(22px*var(--nv-r-scale,1))] bg-panel p-6 text-on-panel transition-all duration-300 hover:-translate-y-1.5 hover:nv-shadow-lg"
    >
      {/* product tile on the right — gentle float */}
      <span className="nv-bob pointer-events-none absolute bottom-0 right-5 top-0 z-[1] my-auto aspect-square h-[clamp(78px,9.5vw,100px)] overflow-hidden rounded-[calc(16px*var(--nv-r-scale,1))]">
        <img
          src={it.art || art}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </span>

      {/* content */}
      <div className="relative z-[2] max-w-[62%]">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">{it.tag}</span>
        <h3 className="mt-1.5 font-display text-[1.3rem] font-bold leading-tight tracking-tight text-white">{it.name}</h3>
        {it.blurb && <p className="mt-2 text-[0.83rem] leading-snug text-on-panel/65">{it.blurb}</p>}
      </div>

      {/* CTA pill */}
      <span className="relative z-[2] mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-1.5 pr-4 text-[0.84rem] font-semibold text-white transition-colors duration-300 group-hover:bg-white group-hover:text-ink">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-ink/10">
          <ArrowRight size={14} strokeWidth={2.4} />
        </span>
        {it.cta || "Start assessment"}
      </span>
    </Link>
  );
}

function LightCard({ it, art, onClick }) {
  return (
    <Link
      to={it.link}
      onClick={onClick}
      className="group relative flex h-full min-h-[clamp(180px,22vw,208px)] flex-col overflow-hidden rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:nv-shadow-lg"
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(75% 62% at 100% 0%, color-mix(in oklab, var(--nv-accent) 16%, transparent), transparent 72%)" }}
      />
      <span className="pointer-events-none absolute right-4 top-5 grid h-[78px] w-[78px] place-items-center">
        <span
          className="absolute inset-0 rounded-full opacity-80 blur-[8px]"
          style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--nv-accent) 38%, transparent), transparent 66%)" }}
        />
        <img src={it.art || art} alt="" aria-hidden="true" className="nv-bob relative w-[72px] object-contain transition-transform duration-500 group-hover:scale-110" />
      </span>

      <div className="relative z-[2] max-w-[62%]">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">{it.tag}</span>
        <h3 className="mt-1.5 font-display text-[1.28rem] font-bold leading-tight tracking-tight text-ink">{it.name}</h3>
        {it.blurb && <p className="mt-2 text-[0.85rem] leading-snug text-muted">{it.blurb}</p>}
      </div>

      <span className="relative z-[2] mt-auto flex items-center gap-2.5 pt-5 text-[0.86rem] font-semibold text-ink">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary">
          <ArrowRight size={14} strokeWidth={2.4} />
        </span>
        {it.cta || "Explore"}
      </span>
    </Link>
  );
}

export default function CategoryGrid({ items, art = "/pills-float.png", dark = false, onItemClick }) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-[clamp(0.8rem,1.6vw,1.1rem)] sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => {
        const onClick = onItemClick ? () => onItemClick(it) : undefined;
        return (
          <Reveal as="div" key={it.name} delay={(i % 3) * 0.06} className="h-full">
            {dark ? <DarkCard it={it} art={art} onClick={onClick} /> : <LightCard it={it} art={art} onClick={onClick} />}
          </Reveal>
        );
      })}
    </div>
  );
}
