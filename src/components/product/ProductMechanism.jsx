import React, { useEffect, useRef, useState } from "react";
import Reveal from "../ui/Reveal";

const barWidth = (i, n) => `${34 + (i * 22) / Math.max(1, n - 1)}%`;
const BAR_FILL = 0.75;
const LABEL_LEAD = 0.55;
function useRunOnceInView(margin = "-60px") {
  const ref = useRef(null);
  const [ran, setRan] = useState(false);
  useEffect(() => {
    if (ran) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setRan(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRan(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ran, margin]);
  return [ref, ran];
}

export default function ProductMechanism({ product }) {
  const m = product.mechanism;
  const [listRef, running] = useRunOnceInView();
  if (!m) return null;

  return (
    <section
      className="overflow-hidden"
      style={{ background: "radial-gradient(circle at 50% 50%, #c1a27a, #9a7843)" }}
    >
      <div className="mx-auto max-w-[1180px] px-5 py-[clamp(2.75rem,6vw,5rem)] md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto_0.8fr] lg:items-center lg:gap-x-4">
          <Reveal as="div">
            <h2 className="max-w-[13ch] font-display text-[clamp(1.6rem,3.2vw,2.3rem)] font-extrabold leading-[1.1] text-[#ffe8b1]">
              {m.title}
            </h2>
            {m.description && (
              <p className="mt-4 max-w-[36ch] text-[0.82rem] leading-relaxed text-[#ffe8b1]">{m.description}</p>
            )}
          </Reveal>
          <Reveal as="div" delay={0.06} className="relative z-10 hidden lg:block lg:-mr-7 lg:justify-self-end">
            {/* Explicit width, not w-full: the grid track is `auto` and the only
                child here is absolutely positioned, so there is no intrinsic width
                anywhere in the chain for a percentage to resolve against and the
                box collapses to zero.

                The render is a square canvas with the vial occupying about the
                middle 41% of its width, so a plain <img> lays out ~2.4x wider than
                the visible bottle — that transparent margin was the gap between
                the vial and the panel. This box is the bottle's true size and the
                image is blown up to 244% (1 / 0.41) inside it, landing the
                bottle's own bounds on the box. Re-measure the pair together if the
                render is re-exported. */}
            <span className="nv-float pointer-events-none relative block aspect-138/297 w-44">
              <img
                src={product.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute left-1/2 top-1/2 w-[244%] max-w-none -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
              />
            </span>
          </Reveal>

          <Reveal as="div" delay={0.12}>
            <ul className="divide-y divide-white/15 rounded-[calc(20px*var(--nv-r-scale,1))] bg-white/10 px-7 py-1 backdrop-blur-[2px]">
              {m.pathways.map((p) => (
                <li key={p.name} className="py-5">
                  <h3 className="font-display text-[1.15rem] font-semibold leading-tight text-[#ffe8b1]">{p.name}</h3>
                  <p className="mt-1.5 max-w-[44ch] text-[0.8rem] leading-relaxed text-[#ffe8b1]">{p.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {m.timeline?.length > 0 && (
          <div className="mt-[clamp(2.5rem,5vw,4rem)]">
            <Reveal as="div">
              <h2 className="max-w-[15ch] font-display text-[clamp(1.6rem,3.2vw,2.3rem)] font-extrabold leading-[1.1] text-[#ffe8b1]">
                {m.timelineTitle}
              </h2>
            </Reveal>
            <ul ref={listRef} className={`nv-seq mt-8 flex flex-col gap-4 ${running ? "is-in" : ""}`}>
              {m.timeline.map((t, i) => (
                <li key={t.label} className="flex items-center gap-5">
                  <span
                    aria-hidden="true"
                    className="nv-seq__bar hidden h-12 shrink-0 rounded-[14px] sm:block"
                    style={{
                      width: barWidth(i, m.timeline.length),
                      animationDelay: `${i * BAR_FILL}s`,
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 38%, rgba(255,255,255,0.13) 72%, rgba(255,255,255,0.3) 100%)",
                    }}
                  />
                  <span
                    className="nv-seq__label min-w-0"
                    style={{ animationDelay: `${i * BAR_FILL + BAR_FILL * LABEL_LEAD}s` }}
                  >
                    <span className="block font-mono text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#ffe8b1]">
                      {t.label}
                    </span>
                    <span className="mt-1 block text-[1rem] font-medium leading-snug text-[#ffe8b1]">{t.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
