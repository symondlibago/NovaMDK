import React, { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { track, EVENTS } from "../lib/analytics";
import {
  ArrowRight, ArrowLeft, Check, ShieldAlert, ShieldCheck, Truck, Star, Stethoscope, Lock, FlaskConical, Loader2,
} from "lucide-react";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Nav/Footer";
import Reveal from "../components/ui/Reveal";
import { productsData } from "../components/data/products";

const TRUST = [
  { icon: Stethoscope, label: "U.S. licensed providers" },
  { icon: Truck, label: "Free 2-day shipping" },
  { icon: Lock, label: "Discreet packaging" },
  { icon: FlaskConical, label: "Compounded in the USA" },
];

// Fallback questionnaire used when a product has no questionnaireId yet.
const DEFAULT_QUESTIONNAIRE_ID = "";

export default function ProductPage() {
  const { id } = useParams();
  const product = productsData.find((p) => String(p.id) === String(id));

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Record a product view (high-signal: which treatments get attention).
  useEffect(() => {
    if (product) {
      track(EVENTS.PRODUCT_VIEWED, { id: product.id, name: product.name, category: product.categorySlug });
    }
  }, [product?.id]);

  if (!product) return <Navigate to="/treatments" replace />;

  // Peptides live under the supplements catalog but are presented on the RX /
  // peptides side — re-label the breadcrumb, badges, and "related" accordingly.
  const isPeptide = product.categorySlug === "supplements" && !!product.subCategorySlug;
  const categoryLabel = isPeptide ? "Peptides" : product.categoryName;
  const backLink = isPeptide ? "/treatments?goal=peptides" : `/treatments?goal=${product.categorySlug}`;

  const related = isPeptide
    ? productsData.filter((p) => p.subCategorySlug === product.subCategorySlug && p.id !== product.id)
    : productsData
        .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
        .slice(0, 3);
  const relatedHeading = isPeptide ? `More ${product.subCategoryName} strengths` : `More in ${product.categoryName}`;

  // MDIntegrations trigger — the product page is where intake begins. Mint a
  // questionnaire voucher via /api/mdi-auth, then hand off to MDI. (Final
  // destination/handoff is wired once the team confirms it.)
  const startVisit = async () => {
    track(EVENTS.START_VISIT, { id: product.id, name: product.name, category: product.categorySlug });
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/mdi-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionnaire_id: product.questionnaireId || DEFAULT_QUESTIONNAIRE_ID }),
      });
      if (!res.ok) throw new Error("We couldn't start your visit just now — please try again.");
      const voucher = await res.json();
      // If the minted voucher carries an intake/checkout URL, hand the patient off.
      const url = voucher.url || voucher.intake_url || voucher.redirect_url || voucher.link || voucher.checkout_url;
      if (url) { window.location.href = url; return; }
      // No URL on the voucher yet — surface it so the handoff can be finalized.
      console.info("MDI voucher minted:", voucher);
      setErr("Visit started — connecting you to intake shortly.");
    } catch (e) {
      setErr(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-bg text-ink">
      <Navbar />

      {/* breadcrumb */}
      <div className="mx-auto max-w-[1180px] px-5 pt-6 md:px-10">
        <Link to={backLink} className="inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-muted transition-colors hover:text-ink">
          <ArrowLeft size={15} /> Back to {categoryLabel}
        </Link>
      </div>

      {/* ===== Hero ===== */}
      <section className="mx-auto max-w-[1180px] px-5 py-[clamp(1.5rem,4vw,3rem)] md:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center lg:gap-12">
          {/* image */}
          <Reveal>
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[calc(28px*var(--nv-r-scale,1))] border border-line bg-linear-to-br from-surface to-surface-2 p-7 md:min-h-[380px] md:p-10">
              {/* champagne glow */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(58% 52% at 50% 44%, color-mix(in oklab, var(--nv-accent) 26%, transparent), transparent 70%)" }}
              />
              {/* pedestal shadow */}
              <div className="pointer-events-none absolute bottom-[18%] left-1/2 h-6 w-2/5 -translate-x-1/2 rounded-[50%] bg-ink/15 blur-xl" />

              <span className="absolute left-5 top-5 z-10 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-accent">
                {categoryLabel}
              </span>
              {product.dosageForm && (
                <span className="absolute bottom-5 left-5 z-10 rounded-full bg-ink px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-on-primary">
                  {product.dosageForm}
                </span>
              )}

              <img
                src={product.img}
                alt={product.name}
                className="relative max-h-[300px] w-auto object-contain mix-blend-multiply drop-shadow-2xl"
              />
            </div>
          </Reveal>

          {/* info */}
          <Reveal delay={0.08}>
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">{categoryLabel}</span>
                <span className="flex items-center gap-1.5">
                  <span className="flex text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                    ))}
                  </span>
                  <span className="text-[0.82rem] text-muted">4.8 · 2,400+ reviews</span>
                </span>
              </div>

              <h1 className="mt-3 font-display text-[clamp(1.85rem,3.6vw,2.6rem)] font-extrabold leading-tight tracking-tight">{product.name}</h1>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-muted">{product.subtitle}</p>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-[2rem] font-extrabold tracking-tight">{product.price}</span>
                <span className="flex items-center gap-1.5 text-[0.85rem] text-muted"><Truck size={14} /> {product.shipping}</span>
              </div>

              {product.highlights?.length > 0 && (
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {product.highlights.map((h) => (
                    <li key={h.text} className="flex items-center gap-2.5 text-[0.94rem] font-medium">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/20 text-accent"><Check size={12} strokeWidth={3} /></span>
                      {h.text}
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={startVisit}
                disabled={loading}
                className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-[1rem] font-semibold text-on-primary transition-all hover:-translate-y-0.5 hover:bg-primary-deep nv-shadow disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Starting your visit…</>
                ) : (
                  <>Start your visit <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></>
                )}
              </button>
              {err && <p className="mt-2 text-center text-[0.84rem] font-medium text-primary">{err}</p>}
              <p className="mt-3 flex items-center justify-center gap-2 text-[0.82rem] text-muted">
                <ShieldAlert size={14} className="text-primary/70" /> Prescription product — requires an online medical evaluation.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Trust band ===== */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-x-6 gap-y-5 px-5 py-6 md:grid-cols-4 md:px-10">
          {TRUST.map((t) => (
            <div key={t.label} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-primary"><t.icon size={16} /></span>
              <span className="text-[0.88rem] font-medium leading-tight">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== How it works ===== */}
      {product.howItWorks && (
        <section className="bg-surface-2 py-[clamp(2.5rem,5vw,5.5rem)]">
          <div className="mx-auto max-w-[1180px] px-5 md:px-10">
            <Reveal className="mx-auto max-w-[60ch] text-center">
              <span className="nv-eyebrow">How it works</span>
              <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold leading-tight">{product.howItWorks.title}</h2>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-muted">{product.howItWorks.description}</p>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {product.howItWorks.steps.map((s, i) => (
                <Reveal as="div" key={i} delay={(i % 3) * 0.08}>
                  <div className="relative h-full rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface p-7 nv-shadow">
                    <span className="absolute right-6 top-6 font-mono text-[1.1rem] font-bold text-line-strong">0{i + 1}</span>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-on-primary">{s.icon}</span>
                    <h3 className="mt-5 font-display text-[1.15rem] font-bold">{s.title}</h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{s.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Specs ===== */}
      {product.specs?.length > 0 && (
        <section className="mx-auto max-w-[1180px] px-5 py-[clamp(2.5rem,5vw,5.5rem)] md:px-10">
          <div className="grid gap-10 md:grid-cols-[1fr_1.25fr] md:items-start">
            <Reveal>
              <span className="nv-eyebrow">The details</span>
              <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.2rem)] font-extrabold leading-tight">What's inside &amp; how it's dosed.</h2>
              <p className="mt-3 max-w-[40ch] text-[1rem] text-muted">Compounded by a licensed U.S. pharmacy and dispensed only after a provider's review of your intake.</p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[0.85rem] font-medium text-ink">
                <ShieldCheck size={15} className="text-accent" /> Quality-tested every batch
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <dl className="divide-y divide-line overflow-hidden rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface nv-shadow">
                {product.specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-1 gap-1 px-6 py-4 transition-colors hover:bg-surface-2 sm:grid-cols-[170px_1fr] sm:gap-4">
                    <dt className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-muted">{s.label}</dt>
                    <dd className="text-[0.94rem] leading-relaxed text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== Safety ===== */}
      {product.safety && (
        <section className="mx-auto mb-[clamp(3rem,6vw,5rem)] max-w-[1180px] px-5 md:px-10">
          <div className="rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface-2 p-6 md:p-8">
            <h3 className="flex items-center gap-2 font-display text-[1.1rem] font-bold">
              <ShieldAlert size={18} className="text-primary" /> Important safety information
            </h3>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{product.safety}</p>
          </div>
        </section>
      )}

      {/* ===== Closing CTA ===== */}
      <section className="mx-auto mb-[clamp(3rem,6vw,5rem)] max-w-[1180px] px-5 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[calc(28px*var(--nv-r-scale,1))] bg-panel px-6 py-[clamp(2.4rem,5vw,3.6rem)] text-center text-on-panel">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(50% 80% at 50% 0%, color-mix(in oklab, var(--nv-accent) 22%, transparent), transparent 70%)" }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-[22ch] font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold leading-tight">Start your visit for {product.name.split("(")[0].split("/")[0].trim()}.</h2>
              <p className="mx-auto mt-3 max-w-[46ch] text-[1rem] text-on-panel/70">A licensed provider reviews your intake and confirms the right fit. Nothing to pay until you're prescribed.</p>
              <button
                onClick={startVisit}
                disabled={loading}
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-bg px-8 py-4 text-[1rem] font-semibold text-ink transition-all hover:-translate-y-0.5 nv-shadow-lg disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Starting…</>
                ) : (
                  <>Start your visit <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></>
                )}
              </button>
              {err && <p className="mt-3 text-[0.84rem] font-medium text-on-panel/80">{err}</p>}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== Related ===== */}
      {related.length > 0 && (
        <section className="mx-auto mb-[clamp(3.5rem,7vw,6rem)] max-w-[1180px] px-5 md:px-10">
          <h2 className="mb-6 text-[clamp(1.4rem,3vw,2rem)] font-extrabold">{relatedHeading}</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/product/${r.id}`}
                className="group rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:nv-shadow-lg"
              >
                <div className="pointer-events-none flex h-32 items-center justify-center rounded-[calc(16px*var(--nv-r-scale,1))] bg-linear-to-br from-surface to-surface-2">
                  <img src={r.img} alt={r.name} loading="lazy" className="h-[88%] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <h3 className="text-[0.98rem] font-bold leading-snug">{r.name}</h3>
                  <span className="shrink-0 text-[0.9rem] font-bold text-primary">{r.price}</span>
                </div>
                <span className="mt-2 inline-flex items-center gap-1 text-[0.82rem] font-semibold text-muted transition-colors group-hover:text-accent">
                  Shop now <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
