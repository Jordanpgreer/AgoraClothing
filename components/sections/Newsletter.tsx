"use client";

import Image from "next/image";
import { motion } from "motion/react";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { SiteContent } from "@/lib/data";
import Laurel from "@/components/Laurel";

export default function Newsletter({ data }: { data: SiteContent["newsletter"] }) {
  return (
    <section className="relative py-32 md:py-44 px-6 md:px-10 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.background}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-bone/85" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex justify-center mb-8"
        >
          <Laurel variant="gold" size={48} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="label text-charcoal/70 mb-10"
        >
          {data.eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="wordmark text-3xl md:text-5xl text-ink leading-[1.15] font-light mb-8"
        >
          {data.heading}
        </motion.h2>
        <p className="text-charcoal/75 max-w-md mx-auto text-[14px] leading-[1.7] mb-12">
          {data.body}
        </p>
        <div className="max-w-lg mx-auto">
          <NewsletterSignup />
        </div>
      </div>
    </section>
  );
}
