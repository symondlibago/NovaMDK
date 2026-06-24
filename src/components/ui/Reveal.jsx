import React from "react";
import { motion } from "framer-motion";

const EASE = [0.2, 0.7, 0.3, 1];

/**
 * Lightweight scroll-reveal wrapper used across marketing sections.
 * Replays by default — the animation re-fires every time the section
 * re-enters the viewport (scrolling down, back up, or down again). Pass
 * `once` to pin a reveal so it only plays the first time.
 */
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 24,
  duration = 0.7,
  once = false,
  className = "",
  ...rest
}) {
  const M = motion[as] || motion.div;
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px 0px -80px 0px" }}
      transition={{ duration, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </M>
  );
}
