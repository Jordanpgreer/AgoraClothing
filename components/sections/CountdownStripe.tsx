"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SplitFlap from "@/components/SplitFlap";
import type { Drop } from "@/lib/data";

export default function CountdownStripe({ drop }: { drop: Drop }) {
  const [now, setNow] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const target = new Date(drop.releaseDate).getTime();
  const safe = Math.max(0, target - (now ?? target));
  const d = Math.floor(safe / (1000 * 60 * 60 * 24));
  const h = Math.floor((safe / (1000 * 60 * 60)) % 24);
  const m = Math.floor((safe / (1000 * 60)) % 60);
  const s = Math.floor((safe / 1000) % 60);

  const urgent = safe > 0 && safe < 1000 * 60 * 60 * 24;

  const cells: [string, number][] = [
    ["Days", d],
    ["Hrs", h],
    ["Mins", m],
    ["Secs", s],
  ];

  return (
    <motion.section
      animate={urgent ? { backgroundColor: ["rgba(216,205,181,0.8)", "rgba(216,205,181,1)", "rgba(216,205,181,0.8)"] } : {}}
      transition={urgent ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}}
      className="bg-wheat/80 px-6 md:px-10 py-10 md:py-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
        <div className="md:border-r border-charcoal/15 md:pr-12">
          <p className="label-sm text-charcoal/60 mb-3">Next Drop</p>
          <p className="label text-ink text-[13px]">
            Drop {drop.numeric}: {drop.title}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 md:gap-6 md:border-r border-charcoal/15 md:pr-12">
          {cells.map(([label, val], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.7 }}
              className="text-center"
            >
              <div className="text-3xl md:text-[44px] leading-none text-ink font-light">
                <SplitFlap value={val} />
              </div>
              <div className="label-sm text-charcoal/60 mt-2">{label}</div>
            </motion.div>
          ))}
        </div>

        <div>
          <p className="label-sm text-charcoal/60 mb-3">Get Notified</p>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.p
                key="ok"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="label text-ink py-2"
              >
                Thank you. — A.
              </motion.p>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubmitted(true);
                }}
                className="flex items-center border-b border-charcoal/40"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="flex-1 bg-transparent py-2 label text-ink placeholder:text-charcoal/45 outline-none uppercase tracking-[0.34em] text-[11px]"
                  data-cursor="default"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="px-2 text-ink hover:opacity-60 transition-opacity"
                  data-cursor="plus"
                  data-cursor-label="Send"
                >
                  →
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
