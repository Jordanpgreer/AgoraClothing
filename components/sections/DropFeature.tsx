"use client";

import Link from "next/link";
import { motion } from "motion/react";
import ProductCard from "@/components/ProductCard";
import type { Drop } from "@/lib/data";

export default function DropFeature({ drop }: { drop: Drop }) {
  return (
    <section className="bg-limestone px-6 md:px-10 py-16 md:py-20">
      <div className="flex items-end justify-between mb-10">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="label text-ink"
        >
          Drop {drop.numeric}: {drop.title}
        </motion.p>
        <Link
          href={`/drops/${drop.slug}`}
          className="label text-ink hover:opacity-60 transition-opacity flex items-center gap-3"
        >
          View All <span className="text-base leading-none">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 md:gap-x-5 gap-y-12">
        {drop.products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
