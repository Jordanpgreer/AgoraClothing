"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import SplitFlap from "./SplitFlap";

export default function Countdown({ to, className }: { to: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const target = new Date(to).getTime();
  const safe = Math.max(0, target - (now ?? target));

  const d = Math.floor(safe / (1000 * 60 * 60 * 24));
  const h = Math.floor((safe / (1000 * 60 * 60)) % 24);
  const m = Math.floor((safe / (1000 * 60)) % 60);
  const s = Math.floor((safe / 1000) % 60);

  const cells: [string, number][] = [
    ["Days", d],
    ["Hrs", h],
    ["Mins", m],
    ["Secs", s],
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-4 gap-3 md:gap-8 max-w-2xl mx-auto">
        {cells.map(([label, val], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="text-4xl md:text-6xl font-light text-ink leading-none">
              <SplitFlap value={val} />
            </div>
            <div className="label-sm mt-3 text-charcoal/60">{label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
