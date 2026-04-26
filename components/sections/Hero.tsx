"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { SiteContent } from "@/lib/data";

export default function Hero({ hero }: { hero: SiteContent["hero"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax + fade as you scroll past the hero
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const letters = "AGORA".split("");

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[720px] w-full flex items-center justify-center overflow-hidden"
    >
      {/* Architectural background with very slow Ken Burns + parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: yImage }}
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{ duration: 22, ease: "linear" }}
      >
        <Image
          src={hero.coverImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bone/15 via-transparent to-bone/40" />
      </motion.div>

      {/* Centered wordmark composition */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        style={{ y: yContent, opacity: opacityContent }}
      >
        <h1 className="wordmark text-[12vw] md:text-[7.5vw] leading-none text-ink font-light flex">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 1.1,
                delay: 0.15 + i * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ display: "inline-block", marginRight: "0.42em" }}
            >
              {l}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95 }}
          className="label text-charcoal/85 mt-8 md:mt-10"
        >
          {hero.subtitle}
        </motion.p>

        {/* Hairline that draws outward from center */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px bg-charcoal/60 mt-7 origin-center"
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-7"
        >
          <Link
            href={hero.ctaHref}
            data-cursor="view"
            data-cursor-label="Enter"
            className="label text-ink hover:opacity-60 transition-opacity inline-block"
          >
            {hero.ctaLabel}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.8 }}
        className="absolute bottom-8 left-8 md:left-12 hidden md:block"
      >
        <p className="label-sm text-charcoal/60">{hero.leftMeta}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.8 }}
        className="absolute bottom-8 right-8 md:right-12 hidden md:block"
      >
        <p className="label-sm text-charcoal/60">{hero.rightMeta}</p>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="label-sm text-charcoal/55">Scroll</span>
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-6 bg-charcoal/40"
        />
      </motion.div>
    </section>
  );
}
