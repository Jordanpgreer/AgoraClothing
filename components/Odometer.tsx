"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

export default function Odometer({ value, prefix = "" }: { value: number; prefix?: string }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => `${prefix}${Math.round(v)}`);

  useEffect(() => {
    const c = animate(mv, value, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    });
    return c.stop;
  }, [value, mv]);

  return <motion.span className="tabular-nums">{rounded}</motion.span>;
}
