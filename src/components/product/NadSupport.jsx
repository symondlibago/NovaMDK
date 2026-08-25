import React from "react";
import { Check, Home } from "lucide-react";
import Reveal from "../ui/Reveal";


const GOLD = "#c2922f";
const CREAM = "#f2e6d2";
const CREAM_SOFT = "rgba(242,230,210,0.82)";

const CARD_R = "rounded-[calc(20px*var(--nv-r-scale,1))]";

/* The two assurances on the injection card. Facts the catalogue already states —
   a provider directs the dose, and it is administered at home. */
const ASSURANCES = [
  { label: "Provider-guided", Icon: Check },
  { label: "At-home use", Icon: Home },
];

/* Short gold rule above the label, as in the comp — it is what separates the
   eyebrow from the photograph behind it. */
function Eyebrow({ children }) {
  return (
    <span className="block">
      <span className="mb-2 block h-px w-7" style={{ background: GOLD }} aria-hidden="true" />
      <span className="block font-mono text-[0.56rem] uppercase tracking-[0.18em] sm:text-[0.6rem]" style={{ color: GOLD }}>
        {children}
      </span>
    </span>
  );
}

function Title({ children, className = "" }) {
  return (
    <h3
      className={`nv-weight-keep font-display text-[clamp(1.05rem,2.4vw,1.3rem)] font-extrabold leading-[1.2] drop-shadow-[0_2px_10px_rgba(30,18,6,0.75)] ${className}`}
      style={{ color: CREAM }}
    >
      {children}
    </h3>
  );
}

function Body({ children, className = "" }) {
  return (
    <p className={`text-[0.82rem] leading-relaxed drop-shadow-[0_1px_8px_rgba(30,18,6,0.7)] ${className}`} style={{ color: CREAM_SOFT }}>
      {children}
    </p>
  );
}

function PhotoCard({ img, objectClass = "object-center", children, className = "", delay = 0 }) {
  return (
    <Reveal as="div" delay={delay} className={`h-full ${className}`}>
      <div className={`relative flex h-full flex-col overflow-hidden p-5 sm:p-6 ${CARD_R}`}>
        <img
          src={img}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover ${objectClass}`}
        />
        <div className="relative z-10 flex h-full flex-col">{children}</div>
      </div>
    </Reveal>
  );
}

export default function NadSupport() {
  return (
    <section className="py-[clamp(2.5rem,5vw,4.5rem)]" style={{ background: "#faf8f4" }}>
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <Reveal>
          {/* The droplet sits beside the heading, not above it — one flex row so
              the pair stays centred together at any width. */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <h2 className="font-display text-[clamp(1.6rem,5vw,2.6rem)] font-extrabold leading-tight">
              <span style={{ color: "#b7a184" }}>NAD+</span>{" "}
              <span style={{ color: "#5c4a2a" }}>May Support</span>
            </h2>
            <img
              src="/site/anti-aging/ways-droplet.avif"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="nv-float h-[clamp(2.2rem,5vw,3.4rem)] w-auto object-contain"
            />
          </div>
        </Reveal>

        {/* One column on a phone; the bento only makes sense once there are three
            columns to hang it on, so the portrait's row-span waits for lg. The
            column ratio is the comp's own 336:285:288. */}
        <div className="mt-[clamp(1.75rem,4vw,3rem)] grid gap-3.5 lg:grid-cols-[1.17fr_1fr_1fr]">
          {/* ---- portrait: two rows from lg, copy at the top ---- */}
          <PhotoCard
            img="/site/nad/support-portrait.avif"
            objectClass="object-[60%_center]"
            className="lg:row-span-2"
          >
            <div className="min-h-[15rem] sm:min-h-[19rem] lg:min-h-[26rem]">
              <Title>Naturally Part of You</Title>
              <span className="mt-2 block h-px w-7" style={{ background: GOLD }} aria-hidden="true" />
              <Body className="mt-3 max-w-[24ch]">NAD+ is found in every cell in your body</Body>
            </div>
          </PhotoCard>

          {/* ---- cellular energy ---- */}
          <PhotoCard img="/site/nad/support-cells.avif" delay={0.06}>
            <div className="min-h-[11rem] sm:min-h-[13rem]">
              <Eyebrow>Cellular energy</Eyebrow>
              <Title className="mt-2 max-w-[14ch]">Energy starts inside the cell</Title>
              <Body className="mt-3 max-w-[26ch]">
                NAD+ is involved in processes your cells use to produce energy
              </Body>
            </div>
          </PhotoCard>

          {/* ---- the injection itself: the one card whose art is a product ---- */}
          <PhotoCard img="/site/nad/support-ground.avif" delay={0.12}>
            <div className="relative flex min-h-[11rem] flex-col sm:min-h-[13rem]">
              <Title>NAD+ Injection</Title>
              {/* The rule belongs to the title here, so the label below it is a
                  bare one rather than another <Eyebrow> with a second rule. */}
              <span className="mb-2 mt-2 block h-px w-7" style={{ background: GOLD }} aria-hidden="true" />
              <span
                className="block font-mono text-[0.56rem] uppercase tracking-[0.18em] sm:text-[0.6rem]"
                style={{ color: GOLD }}
              >
                Prescription treatment
              </span>

              <img
                src="/products/nad-plus.avif"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="pointer-events-none absolute -right-[12%] -top-[2%] h-[118%] w-auto max-w-none rotate-[10deg] object-contain drop-shadow-[0_16px_26px_rgba(30,18,6,0.55)]"
              />

              <ul className="mt-auto flex flex-col gap-2 pt-6">
                {ASSURANCES.map((a) => (
                  <li key={a.label} className="flex items-center gap-2.5">
                    <span
                      className="grid h-4 w-4 shrink-0 place-items-center rounded-full border"
                      style={{ borderColor: GOLD, color: GOLD }}
                    >
                      <a.Icon size={9} strokeWidth={3.2} />
                    </span>
                    <span className="text-[0.76rem]" style={{ color: CREAM_SOFT }}>
                      {a.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </PhotoCard>

          {/* ---- beyond energy: wide, under the two above ---- */}
          <PhotoCard
            img="/site/nad/support-hands.avif"
            objectClass="object-right"
            delay={0.18}
            className="lg:col-span-2"
          >
            <div className="min-h-[9rem] sm:min-h-[10.5rem]">
              <Eyebrow>Beyond energy</Eyebrow>
              <Title className="mt-2 max-w-[18ch]">Part of everyday cellular function</Title>
              <Body className="mt-3 max-w-[38ch]">
                plays a role in cellular signaling and processes associated with healthy aging
              </Body>
            </div>
          </PhotoCard>
        </div>
      </div>
    </section>
  );
}
