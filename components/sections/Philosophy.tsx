"use client";

import { motion } from "motion/react";
import type { SiteContent } from "@/lib/data";

export default function Philosophy({ data }: { data: SiteContent["philosophy"] }) {
  return (
    <section className="bg-bone py-28 md:py-36 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="label text-charcoal/70 mb-10"
        >
          {data.eyebrow}
        </motion.p>

        {/* Heading reveals with a clip-path mask */}
        <motion.h2
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="wordmark text-3xl md:text-5xl text-ink leading-[1.15] mb-20 max-w-4xl font-light"
        >
          {data.heading}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {data.tenets.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.18 }}
              className="relative"
            >
              {/* Hairline that draws across when scrolled into view */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.3 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="origin-left h-px bg-charcoal/25 mb-8"
              />
              <p className="wordmark text-charcoal/70 text-sm mb-8">— {t.n}</p>
              <h3 className="label text-ink mb-5 text-[14px]">{t.title}</h3>
              <p className="text-charcoal/75 text-[14px] leading-[1.7] max-w-xs">
                {t.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
