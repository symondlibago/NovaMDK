import React, { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";

export default function ScrollSteps({ items }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 65%"],
  });

  // Spring so the fill trails the wheel slightly instead of tracking it 1:1,
  // which is what makes it read as motion rather than as a scrubbed value.
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(progress, "change", (v) => {
    // Each step claims an equal slice of the rail. Bias by half a slice so a
    // step lights as the fill arrives at its badge, not after it passes.
    const next = Math.min(items.length - 1, Math.floor(v * items.length + 0.5));
    setReached((prev) => (prev === next ? prev : next));
  });

  // Reduced motion: no rail animation, nothing greyed, everything readable.
  const isLit = (i) => reduced || i <= reached;

  return (
    <ol ref={ref} className="relative mt-7 space-y-8">
      {/* rail track */}
      <span
        aria-hidden="true"
        className="absolute left-4 top-2 w-px -translate-x-1/2 bg-line"
        style={{ bottom: "1.5rem" }}
      />
      {/* rail fill */}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="absolute left-4 top-2 w-px -translate-x-1/2 origin-top bg-primary"
          style={{ height }}
        />
      )}

      {items.map((it, i) => (
        <li key={it.title || it.text} className="relative flex gap-3.5">
          <span
            className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-[0.7rem] font-bold transition-all duration-500 ${
              isLit(i)
                ? "border-primary bg-primary text-on-primary nv-shadow"
                : "border-line bg-surface text-muted"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            className={`min-w-0 transition-all duration-500 ${
              isLit(i) ? "opacity-100" : "opacity-35"
            }`}
          >
            {it.title && <span className="block text-[1rem] font-bold leading-snug text-ink">{it.title}</span>}
            {it.text && (
              <span className={`block leading-relaxed ${it.title ? "mt-1 text-[0.94rem] text-muted" : "text-[0.98rem] font-medium text-ink"}`}>
                {it.text}
              </span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
