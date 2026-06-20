import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import Reveal from "../ui/Reveal";

const CITIES = [
  "New York", "Beverly Hills", "Miami", "San Francisco", "Chicago",
  "Dallas", "Houston", "Los Angeles", "Scottsdale", "Las Vegas",
];

export default function SmartKioskShowcase() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-[clamp(4rem,8vw,6.5rem)] md:px-10">
      <div className="grid items-center gap-[clamp(2rem,5vw,4.5rem)] md:grid-cols-2">
        <Reveal>
          <span className="nv-eyebrow">Proprietary technology</span>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-tight">
            NovaMD Smart Kiosk: <span className="text-muted">the next health breakthrough, near you.</span>
          </h2>
          <p className="mt-4 max-w-[46ch] text-[1.06rem] text-muted">
            Find personalized wellness at flagship centers and premium retail spaces across our nationwide
            locations. Discover a kiosk near you.
          </p>
          <Link
            to="/contact"
            className="group mt-7 inline-flex items-center gap-3 rounded-full border border-line bg-surface py-2 pl-6 pr-2 text-[0.96rem] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-primary nv-shadow"
          >
            Clinic or Gym Owner? Learn more
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-on-primary transition-transform group-hover:translate-x-0.5">
              <ArrowRight size={16} />
            </span>
          </Link>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-[calc(26px*var(--nv-r-scale,1))] border border-line bg-surface p-6 nv-shadow md:p-8">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="relative grid h-2.5 w-2.5 place-items-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
                Now available nationwide
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {CITIES.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3.5 py-2 text-[0.88rem] font-medium text-ink transition-colors hover:border-primary/40"
                >
                  <MapPin size={13} className="text-primary" /> {c}
                </span>
              ))}
            </div>
            <p className="mt-5 border-t border-line pt-4 text-[0.9rem] text-muted">
              <b className="font-semibold text-ink">10 flagship locations</b> — and more opening every quarter.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
