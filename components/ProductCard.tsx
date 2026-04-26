"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Product } from "@/lib/data";
import { useRef, useState } from "react";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [2.5, -2.5]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-2.5, 2.5]), {
    stiffness: 200,
    damping: 20,
  });

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
    setHover(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link
        href={`/product/${product.slug}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
        data-cursor="view"
        data-cursor-label="View"
        className="block"
      >
        <motion.div
          ref={ref}
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="relative aspect-[4/5] overflow-hidden bg-limestone"
        >
          <motion.div
            animate={{ scale: hover ? 1.06 : 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 16vw"
              className="object-cover"
            />
          </motion.div>
          {product.images[1] && (
            <motion.div
              animate={{ opacity: hover ? 1 : 0, scale: hover ? 1.06 : 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={product.images[1]}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover"
              />
            </motion.div>
          )}

          {/* Subtle vignette on hover for depth */}
          <motion.div
            animate={{ opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-t from-ink/15 to-transparent pointer-events-none"
          />

          {product.soldOut && (
            <div className="absolute inset-0 bg-bone/60 flex items-center justify-center">
              <span className="label text-ink border border-ink/60 px-3 py-1.5 bg-bone/80">
                Sold Out
              </span>
            </div>
          )}
        </motion.div>

        <div className="mt-4 relative h-[42px] overflow-hidden">
          {/* Default state: name + price */}
          <motion.div
            animate={{ y: hover ? "-100%" : "0%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <p className="label text-ink">{product.name}</p>
            <p className="text-[13px] mt-1.5 text-charcoal/75 tabular-nums">
              ${product.price}
            </p>
          </motion.div>
          {/* Hover state: colorway + view */}
          <motion.div
            animate={{ y: hover ? "0%" : "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <p className="label text-ink">{product.colorway}</p>
            <p className="text-[13px] mt-1.5 text-charcoal/75 italic">
              View piece →
            </p>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
