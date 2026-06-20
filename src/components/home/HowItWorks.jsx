import React from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Stethoscope, Dna, PackageOpen } from "lucide-react";
import Reveal from "../ui/Reveal";
import Photo from "../ui/Photo";

const EASE = [0.16, 1, 0.3, 1];

const STEPS = [
  { title: "Free Assessment", desc: "Complete a brief, secure intake form detailing your health history and unique goals to see if you qualify.", Icon: ClipboardCheck },
  { title: "Provider Review", desc: "A licensed US specialist evaluates your profile to design a treatment plan explicitly tailored to your biology.", Icon: Stethoscope },
  { title: "Customized Treatment", desc: "Your provider formulates a precise dosage and medication schedule tailored exclusively for your body and goals.", Icon: Dna },
  { title: "Discreet Delivery", desc: "Medication is shipped rapidly and discreetly to your door, with unlimited ongoing access to your care team.", Icon: PackageOpen },
];

/**
 * "How it works" — the steps sit beside a photo and reveal one-by-one as they
 * scroll into view.
 */
export default function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-24 bg-bg py-[clamp(4rem,8vw,6.5rem)]">
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <Reveal className="mx-auto mb-[clamp(2.5rem,5vw,4rem)] max-w-[60ch] text-center">
          <span className="nv-eyebrow">How it works</span>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-extrabold leading-tight">Premium care, delivered effortlessly.</h2>
        </Reveal>

        <div className="overflow-hidden rounded-[calc(28px*var(--nv-r-scale,1))] border border-line bg-surface nv-shadow-lg">
          <div className="grid md:grid-cols-2">
            {/* Steps — reveal step by step on scroll */}
            <div className="flex flex-col justify-center gap-6 p-[clamp(1.6rem,4vw,3rem)] md:gap-7">
              {STEPS.map((step, i) => {
                const Icon = step.Icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -26, filter: "blur(4px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, margin: "0px 0px -22% 0px" }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="group flex items-start gap-4"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-on-primary shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[0.72rem] font-medium text-accent">0{i + 1}</span>
                        <h3 className="font-display text-[1.18rem] font-bold text-ink">{step.title}</h3>
                      </div>
                      <p className="mt-1 max-w-[44ch] text-[0.93rem] leading-relaxed text-muted">{step.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Photo */}
            <div className="relative min-h-[320px] md:min-h-0">
              <div className="absolute inset-0">
                <Photo src="/visit-phone.jpg" alt="A member taking the five-minute online visit" className="h-full w-full" imgClassName="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
