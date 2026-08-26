import React from "react";
import { Check } from "lucide-react";
import Reveal from "../ui/Reveal";
import ScrollSteps from "./ScrollSteps";

export default function ProductFeature({
  eyebrow,
  title,
  body,
  items = [],
  numbered = false,
  img,
  alt = "",
  reverse = false,
  tone = "bg", // "bg" | "surface"
}) {
  if (!img && !items.length) return null;

  return (
    <section className={tone === "surface" ? "border-y border-line bg-surface" : ""}>
      <div className="mx-auto max-w-[1180px] px-5 py-[clamp(2.75rem,6vw,5rem)] md:px-10">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          {/* image */}
          <Reveal className={`min-w-0 ${reverse ? "md:order-2" : ""}`}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(28px*var(--nv-r-scale,1))] border border-line nv-shadow">
              <img
                src={img}
                alt={alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
              />
              {/* A whisper of the ink panel along the bottom edge, so the photo
                  sits on the cream page instead of floating above it. */}
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--nv-ink-panel) 22%, transparent) 100%)",
                }}
              />
            </div>
          </Reveal>

          {/* copy */}
          <Reveal delay={0.08} className={`min-w-0 ${reverse ? "md:order-1" : ""}`}>
            <div>
              {eyebrow && <span className="nv-eyebrow">{eyebrow}</span>}
              <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold leading-tight tracking-tight">
                {title}
              </h2>
              {body && <p className="mt-4 max-w-[46ch] text-[1.02rem] leading-relaxed text-muted">{body}</p>}

              {items.length > 0 &&
                (numbered ? (
                  <ScrollSteps items={items} />
                ) : (
                  <ul className="mt-7 space-y-3.5">
                    {items.map((it) => (
                      <li key={it.title || it.text} className="flex gap-3.5">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/20 text-accent">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className="min-w-0">
                          {it.title && (
                            <span className="block text-[1rem] font-bold leading-snug text-ink">{it.title}</span>
                          )}
                          {it.text && (
                            <span
                              className={`block leading-relaxed ${
                                it.title ? "mt-1 text-[0.94rem] text-muted" : "text-[0.98rem] font-medium text-ink"
                              }`}
                            >
                              {it.text}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
