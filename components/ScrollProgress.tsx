"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.3 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-px bg-ink/70 origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}
