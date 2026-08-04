import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Clock, Stethoscope, Flag, FlaskConical } from "lucide-react";

// Scrolling credential band; re-skins with the active theme. Used above the
// navbar (promo slot) and at the foot of the homepage.
const MARQUEE_ITEMS = [
  { text: "USA MDs ONLY", icon: Stethoscope },
  { text: "U.S. LICENSED PHYSICIANS", icon: Flag },
  { text: "FDA-REGULATED PHARMACIES", icon: ShieldCheck },
  { text: "USA MADE & SOURCED", icon: FlaskConical },
  { text: "FAST DELIVERY", icon: Truck },
  { text: "DEDICATED ONLINE CARE", icon: Clock },
];

export default function Marquee({ speed = 42 }) {
  return (
    <div className="relative flex w-full overflow-hidden border-y border-line bg-surface py-2.5 text-ink">
      <motion.div
        className="flex w-max shrink-0 will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: speed, repeat: Infinity }}
        aria-hidden="true"
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center">
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={`${dup}-${i}`} className="flex items-center gap-2.5 px-7">
                <item.icon size={14} className="text-primary" strokeWidth={1.8} />
                <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-muted">
                  {item.text}
                </span>
                <span className="ml-7 text-line-strong">•</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
