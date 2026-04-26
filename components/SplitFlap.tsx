"use client";

import { AnimatePresence, motion } from "motion/react";

export default function SplitFlap({
  value,
  className = "",
}: {
  value: number | string;
  className?: string;
}) {
  const str = String(value).padStart(2, "0");
  return (
    <span className={`inline-flex tabular-nums ${className}`}>
      {str.split("").map((char, i) => (
        <Digit key={i} char={char} />
      ))}
    </span>
  );
}

function Digit({ char }: { char: string }) {
  return (
    <span className="relative inline-block overflow-hidden align-baseline" style={{ width: "0.62em", height: "1em", lineHeight: "1em" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: "-100%", rotateX: 90, opacity: 0 }}
          animate={{ y: "0%", rotateX: 0, opacity: 1 }}
          exit={{ y: "100%", rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
