"use client";

import Image from "next/image";
import { motion } from "motion/react";

const variants = [
  {
    type: "quote" as const,
    body: "We work the way a studio works — slowly, with notes.",
    attr: "— The Studio, Porto",
    bg: "bg-charcoal text-bone",
  },
  {
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1400&q=80",
    caption: "Undyed merino · 7-gauge knit",
  },
  {
    type: "quote" as const,
    body: "Cuts soften, colors deepen. Garments meant to grow into the body.",
    attr: "— The Practice",
    bg: "bg-wheat/80 text-ink",
  },
  {
    type: "image" as const,
    src: "https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=1400&q=80",
    caption: "On location · Atelier, Porto",
  },
];

export default function EditorialInsert({ variant }: { variant: number }) {
  const v = variants[variant % variants.length];

  if (v.type === "image") {
    return (
      <motion.figure
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[4/5] overflow-hidden bg-limestone group"
      >
        <Image
          src={v.src}
          alt={v.caption}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
        <figcaption className="absolute bottom-4 left-4 right-4">
          <p className="label-sm text-bone/80 mb-1">From the Studio</p>
          <p className="font-display italic text-bone text-lg leading-tight">
            {v.caption}
          </p>
        </figcaption>
      </motion.figure>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`relative aspect-[4/5] flex flex-col justify-between p-8 md:p-10 ${v.bg}`}
    >
      <p className="label-sm opacity-60">A Note</p>
      <div>
        <p className="font-display italic text-2xl md:text-[28px] leading-[1.25]">
          "{v.body}"
        </p>
        <p className="label-sm mt-6 opacity-70">{v.attr}</p>
      </div>
    </motion.div>
  );
}
