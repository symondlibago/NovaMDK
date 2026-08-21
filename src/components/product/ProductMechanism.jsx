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

/* ---------------------------------------------------------------------------
   Callout layout (semaglutide comp): centred heading, the vial in the middle of
   the diagram, and labelled wires running in to it from either side.

   Positions live here rather than in the catalogue because they are composition,
   not content — the copy is reviewed, where a line happens to land is not. They
   are percentages of the diagram box, which is why the SVG is a 0–100 grid with
   preserveAspectRatio="none": the wires then track the labels at any width, and
   non-scaling-stroke keeps the hairline a hairline through the squash.
   --------------------------------------------------------------------------- */
/* Read off the comp and normalised to the box: its content spans 145–735px of a
   904px canvas, mapped here to 4%–96%. The diagonal is deliberately short and
   steep (about 27 degrees over ~7% of the width) — run long and shallow it stops
   reading as a bend at all and the wire just looks like it trails off. */
const WIRES = [
  { label: "left-[4%] top-[12%] text-left", points: "4,20 26,20 33,32" },
  { label: "left-[14%] top-[66%] text-left", points: "14,74 37,74 44,62" },
  { label: "right-[4%] top-[32%] text-right", points: "96,40 70,40 61,46" },
];

const LABEL = "text-[0.78rem] font-bold uppercase leading-tight tracking-[0.12em] text-[#ffe8b1]";

/* The render is a 2000x2000 canvas with the bottle occupying the middle 36% of
   its width and 82.8% of its height, so a plain <img> lays out far larger than
   the visible glass. The box below is the bottle's true aspect and the image is
   blown up to 1 / 0.828 inside it, landing the bottle's own bounds on the box.
   Re-measure if the render is re-exported. */
function Vial({ src, className = "" }) {
  return (
    /* Two spans on purpose: nv-float animates `transform`, so it cannot share an
       element with the centring -translate-x-1/2 the caller passes in — the
       keyframes would overwrite it and the vial would sit off-centre. Outer box
       positions, inner box floats. */
    <span className={`pointer-events-none block aspect-721/1656 ${className}`}>
      <span className="nv-float relative block h-full w-full">
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute left-1/2 top-1/2 h-[121%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
        />
      </span>
    </span>
  );
}

function CalloutDiagram({ m, product }) {
  const [ref, running] = useRunOnceInView();
  const wires = m.callouts.slice(0, WIRES.length);

  return (
    <>
      <Reveal as="div" className="mx-auto max-w-[46ch] text-center">
        <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.5rem)] font-extrabold leading-[1.1] text-[#ffe8b1]">
          {m.title}
        </h2>
        {m.description && (
          <p className="mx-auto mt-4 max-w-[52ch] text-[0.82rem] leading-relaxed text-[#ffe8b1]/90">
            {m.description}
          </p>
        )}
      </Reveal>

      {/* Desktop diagram. Below md the wires would have nowhere to run, so the
          same three labels stack under the vial instead. */}
      <div
        ref={ref}
        /* Wide and shallow, as the comp sets it: the vial is small against the
           span of the labels, so a taller box would strand it in empty brass. */
        className={`nv-diagram relative mx-auto mt-[clamp(1.5rem,3vw,2.5rem)] hidden aspect-82/25 w-full max-w-205 md:block ${
          running ? "is-in" : ""
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {wires.map((c, i) => (
            <polyline
              key={c.name}
              className="nv-wire"
              points={WIRES[i].points}
              pathLength="1"
              fill="none"
              stroke="rgba(255,232,177,0.55)"
              /* No non-scaling-stroke: it puts the dash pattern in screen space,
                 so the dasharray of 1 that draws the line became 1px on, 1px off
                 and every wire rendered dotted. In user units the box is 100 tall
                 against 250px, so 0.4 lands a 1px hairline. */
              strokeWidth="0.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animationDelay: `${i * 0.3 + 0.15}s` }}
            />
          ))}
        </svg>

        {wires.map((c, i) => (
          <span
            key={c.name}
            className={`nv-wire__label absolute max-w-[30%] ${LABEL} ${WIRES[i].label}`}
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            {c.name}
          </span>
        ))}

        {/* Drawn after the wires so it covers where they land. */}
        <Vial
          src={product.img}
          /* Nearly the full height of the box, as the comp sets it: against a
             label spread this wide a smaller bottle strands itself in brass. */
          className="absolute left-1/2 top-1/2 h-[96%] -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="mt-8 md:hidden">
        <Vial src={product.img} className="mx-auto h-56" />
        <ul className="mt-6 flex flex-col items-center gap-2.5">
          {m.callouts.map((c) => (
            <li key={c.name} className={`rounded-full border border-white/25 px-4 py-1.5 ${LABEL}`}>
              {c.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* The rule draws across in RAIL_S seconds; each stop sits at its own fraction of
   the width, so its delay is that same fraction of the run and the dot lights as
   the line arrives. */
const RAIL_S = 1.6;

function TimelineRail({ m }) {
  const [ref, running] = useRunOnceInView();
  const n = m.timeline.length;

  return (
    <div className="mt-[clamp(2.5rem,5vw,4rem)]">
      <Reveal as="div">
        <h2 className="max-w-[15ch] font-display text-[clamp(1.6rem,3.2vw,2.3rem)] font-extrabold leading-[1.1] text-[#ffe8b1]">
          {m.timelineTitle}
        </h2>
      </Reveal>

      <div ref={ref} className={`nv-rail relative mt-9 ${running ? "is-in" : ""}`}>
        {/* Only from lg, where the stops actually sit in one row for it to join. */}
        <span
          aria-hidden="true"
          className="nv-rail__line absolute left-0 top-1.5 hidden h-px w-full bg-white/25 lg:block"
        />
        <ol className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {m.timeline.map((t, i) => (
            <li key={t.label} className="relative lg:pt-9">
              <span
                aria-hidden="true"
                className="nv-rail__dot absolute left-0 top-0 hidden h-3 w-3 rounded-full bg-[#ffe8b1] lg:block"
                style={{
                  animationDelay: `${(i / n) * RAIL_S}s`,
                  // First stop carries a halo, as in the comp: it is where the
                  // sequence starts, not a state that changes.
                  boxShadow: i === 0 ? "0 0 20px 7px rgba(255,232,177,0.4)" : undefined,
                }}
              />
              <span
                className="nv-rail__item block"
                style={{ animationDelay: `${(i / n) * RAIL_S + 0.12}s` }}
              >
                <span className={`block ${LABEL}`}>{t.label}</span>
                <span className="mt-2 block max-w-[28ch] text-[0.9rem] leading-snug text-[#ffe8b1]/85">
                  {t.text}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function ProductMechanism({ product }) {
  const m = product.mechanism;
  const [listRef, running] = useRunOnceInView();
  if (!m) return null;

  const callouts = m.layout === "callouts";

  return (
    <section
      className="overflow-hidden"
      style={{ background: "radial-gradient(circle at 50% 50%, #c1a27a, #9a7843)" }}
    >
      <div className="mx-auto max-w-[1180px] px-5 py-[clamp(2.75rem,6vw,5rem)] md:px-10">
        {callouts && <CalloutDiagram m={m} product={product} />}
        {!callouts && (
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
        )}

        {m.timeline?.length > 0 && callouts && <TimelineRail m={m} />}

        {m.timeline?.length > 0 && !callouts && (
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
