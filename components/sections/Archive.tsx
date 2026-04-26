"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Drop } from "@/lib/data";
import { useState } from "react";

export default function Archive({ drops }: { drops: Drop[] }) {
  const cards = drops.slice(0, 3);

  return (
    <section className="bg-limestone px-6 md:px-10 pt-12 pb-20">
      <div className="flex items-end justify-between mb-6">
        <p className="label text-ink">Archive</p>
        <Link
          href="/drops"
          data-cursor="view"
          className="label text-ink hover:opacity-60 transition-opacity flex items-center gap-3"
        >
          View All <span className="text-base leading-none">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((d, i) => (
          <ArchiveCard key={d.slug} drop={d} index={i} />
        ))}
      </div>
    </section>
  );
}

function ArchiveCard({ drop, index }: { drop: Drop; index: number }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: index * 0.08 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
    >
      <Link
        href={`/drops/${drop.slug}`}
        className="group block"
        data-cursor="view"
        data-cursor-label="View Drop"
      >
        <div className="relative aspect-[16/7] overflow-hidden bg-clay/20">
          <motion.div
            className="absolute inset-0"
            animate={{
              filter: hover ? "saturate(1) brightness(1)" : "saturate(0.4) brightness(0.95)",
              scale: hover ? 1.04 : 1,
            }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={drop.cover}
              alt={drop.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            animate={{ backgroundColor: hover ? "rgba(245,240,230,0.25)" : "rgba(245,240,230,0.55)" }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="label-sm text-ink/80 mb-3">Drop {drop.numeric}</p>
            <motion.p
              animate={{
                fontFamily: hover
                  ? "var(--font-display)"
                  : "var(--font-sans)",
                fontStyle: hover ? "italic" : "normal",
                letterSpacing: hover ? "0.04em" : "0.42em",
                fontSize: hover ? "1.6rem" : "1.05rem",
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-ink uppercase font-light"
            >
              {drop.title}
            </motion.p>
            <div className="w-8 h-px bg-ink/40 my-4" />
            <p className="label-sm text-ink/70">View</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
