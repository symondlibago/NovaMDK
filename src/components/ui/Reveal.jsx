import React from "react";
import { motion } from "framer-motion";

const EASE = [0.2, 0.7, 0.3, 1];

/** Lightweight scroll-reveal wrapper used across marketing sections. */
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 20,
  duration = 0.7,
  once = true,
  className = "",
  ...rest
}) {
  const M = motion[as] || motion.div;
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </M>
  );
}
