import React, { useState } from "react";
import { Mail, Phone, Clock, MapPin, Check, ArrowRight } from "lucide-react";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Nav/Footer";
import PageHero from "../components/shop/PageHero";
import Reveal from "../components/ui/Reveal";

const DETAILS = [
  { icon: Mail, label: "Email", value: "care@novamdk.com", href: "mailto:care@novamdk.com" },
  { icon: Phone, label: "Phone", value: "(800) 555-0142", href: "tel:+18005550142" },
  { icon: Clock, label: "Hours", value: "Mon–Fri · 8am–8pm ET" },
  { icon: MapPin, label: "Pharmacy", value: "Licensed in all 50 states" },
];

const field = "w-full rounded-xl border border-line bg-bg px-4 py-3 text-[0.96rem] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-primary";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "General", message: "" });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onSubmit = (e) => {
    e.preventDefault();
    // Front-end demo: no backend wired. Surface a success state.
    setSent(true);
  };

  return (
    <main className="min-h-screen w-full bg-bg text-ink">
      <Navbar />

      <PageHero
        eyebrow="Contact"
        title="We're here to help."
        subtitle="Questions about your protocol, an order, or getting started? Message our care team — a real person replies, usually within one business day."
      />

      <section className="mx-auto max-w-[1100px] px-5 py-[clamp(2.8rem,6vw,4.5rem)] md:px-10">
        <div className="grid gap-[clamp(1.6rem,4vw,3rem)] md:grid-cols-[1.4fr_1fr]">
          {/* Form */}
          <Reveal>
            <div className="rounded-[26px] border border-line bg-surface p-[clamp(1.4rem,3vw,2.2rem)] nv-shadow">
              {sent ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent"><Check size={26} strokeWidth={2.4} /></span>
                  <h2 className="text-[1.6rem] font-extrabold">Message sent.</h2>
                  <p className="max-w-[38ch] text-muted">Thanks, {form.name || "there"} — our care team will get back to you at {form.email || "your email"} shortly.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "General", message: "" }); }} className="mt-2 inline-flex items-center gap-2 rounded-full border border-line bg-bg px-5 py-2.5 text-[0.92rem] font-semibold transition-colors hover:border-primary">
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[0.82rem] font-semibold text-muted">Full name</span>
                      <input required value={form.name} onChange={update("name")} className={field} placeholder="Jane Doe" />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[0.82rem] font-semibold text-muted">Email</span>
                      <input required type="email" value={form.email} onChange={update("email")} className={field} placeholder="jane@email.com" />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[0.82rem] font-semibold text-muted">Topic</span>
                    <select value={form.topic} onChange={update("topic")} className={field}>
                      <option>General</option>
                      <option>My protocol</option>
                      <option>An order</option>
                      <option>Getting started</option>
                      <option>Billing</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[0.82rem] font-semibold text-muted">Message</span>
                    <textarea required rows={5} value={form.message} onChange={update("message")} className={`${field} resize-none`} placeholder="How can we help?" />
                  </label>
                  <button type="submit" className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[0.96rem] font-semibold text-on-primary transition-all hover:-translate-y-0.5 hover:bg-primary-deep nv-shadow">
                    Send message <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Details */}
          <Reveal delay={0.08}>
            <div className="flex flex-col gap-3.5">
              {DETAILS.map((d) => {
                const Inner = (
                  <span className="flex items-start gap-3.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-primary"><d.icon size={19} strokeWidth={1.8} /></span>
                    <span className="flex flex-col">
                      <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">{d.label}</span>
                      <span className="mt-0.5 text-[1.02rem] font-semibold text-ink">{d.value}</span>
                    </span>
                  </span>
                );
                return d.href ? (
                  <a key={d.label} href={d.href} className="rounded-2xl border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-line-strong">{Inner}</a>
                ) : (
                  <div key={d.label} className="rounded-2xl border border-line bg-surface p-4">{Inner}</div>
                );
              })}
              <p className="mt-2 px-1 text-[0.82rem] leading-relaxed text-muted">
                For a medical emergency, call 911. Messages here are not monitored for urgent clinical needs.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
