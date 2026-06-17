import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Reveal from "../ui/Reveal";

/**
 * The floating-pill category tiles from the designer's styles.css "catgrid".
 * `art` defaults to the tablet render (the tablets image that stays).
 */
export default function CategoryGrid({ items, art = "/pills-float.png" }) {
  return (
    <div className="grid grid-cols-1 gap-[clamp(0.8rem,1.6vw,1.1rem)] sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <Reveal as="div" key={it.name} delay={(i % 3) * 0.06}>
          <Link
            to={it.link}
            className="group relative flex min-h-[148px] flex-col justify-between overflow-hidden rounded-[18px] border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:nv-shadow-lg"
          >
            <span className="relative z-[2] flex max-w-[62%] flex-col gap-1.5">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent">{it.tag}</span>
              <span className="text-[1.28rem] font-bold leading-tight tracking-tight text-ink">{it.name}</span>
            </span>
            {/* floating tablet art */}
            <span className="absolute right-4 top-1/2 grid h-24 w-24 -translate-y-1/2 place-items-center">
              <span
                className="absolute inset-0 rounded-full blur-[2px]"
                style={{ background: "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--nv-accent) 30%, transparent), transparent 68%)" }}
              />
              <img src={it.art || art} alt="" aria-hidden="true" className="nv-bob relative w-[88px] object-contain" />
            </span>
            <span className="relative z-[2] mt-auto grid h-[30px] w-[30px] place-items-center rounded-full border border-line text-muted transition-all group-hover:translate-x-1 group-hover:bg-primary group-hover:text-on-primary">
              <ChevronRight size={14} strokeWidth={2.4} />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
