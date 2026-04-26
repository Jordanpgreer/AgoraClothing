"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Drop, Product } from "@/lib/data";
import { useCart } from "@/lib/cart";
import Lightbox from "./Lightbox";

export default function ProductDetail({
  product,
  drop,
}: {
  product: Product;
  drop: Drop;
}) {
  const [size, setSize] = useState(product.sizes[0]);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const add = useCart((s) => s.add);
  const setCartOpen = useCart((s) => s.setOpen);

  function handleAdd() {
    if (product.soldOut || adding) return;
    setAdding(true);
    setTimeout(() => {
      add({
        productSlug: product.slug,
        name: product.name,
        colorway: product.colorway,
        size,
        price: product.price,
        image: product.images[0],
        qty: 1,
      });
      setAdding(false);
      setCartOpen(true);
    }, 700);
  }

  return (
    <section className="px-6 md:px-12 pt-28 pb-24 bg-bone">
      <div className="max-w-7xl mx-auto">
        <nav className="label-sm text-charcoal/55 mb-12">
          <Link href="/drops" className="hover:text-ink">Archive</Link> /{" "}
          <Link href={`/drops/${drop.slug}`} className="hover:text-ink">
            Drop {drop.numeric}: {drop.title}
          </Link>{" "}
          / <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-7">
            <button
              onClick={() => setLightbox(active)}
              className="block w-full"
              data-cursor="view"
              data-cursor-label="Zoom"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-[4/5] bg-limestone overflow-hidden mb-3"
                >
                  <Image
                    src={product.images[active]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </button>
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative aspect-square overflow-hidden bg-limestone transition-opacity ${
                    active === i ? "opacity-100" : "opacity-55 hover:opacity-90"
                  }`}
                  data-cursor="view"
                >
                  <Image src={src} alt="" fill sizes="33vw" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <aside className="md:col-span-5 md:sticky md:top-28 self-start">
            <p className="label text-charcoal/65 mb-5">
              Drop {drop.numeric} — {product.category}
            </p>
            <h1 className="wordmark text-2xl md:text-3xl text-ink font-light leading-tight mb-3">
              {product.name}
            </h1>
            <p className="label-sm text-charcoal/65 mb-8">{product.colorway}</p>
            <p className="text-[15px] text-ink mb-10 tabular-nums font-light">
              ${product.price}
            </p>

            <p className="text-[14px] text-charcoal/80 leading-[1.75] mb-12 max-w-md">
              {product.description}
            </p>

            <div className="mb-8">
              <p className="label-sm text-charcoal/65 mb-4">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <motion.button
                    key={s}
                    onClick={() => setSize(s)}
                    whileTap={{ scale: 0.94 }}
                    className={`min-w-[3rem] px-3 py-3 text-[12px] tracking-[0.18em] uppercase border transition ${
                      size === s
                        ? "border-ink bg-ink text-bone"
                        : "border-charcoal/25 hover:border-ink"
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Ink-fill add-to-bag */}
            <button
              disabled={product.soldOut || adding}
              onClick={handleAdd}
              data-cursor="plus"
              data-cursor-label={product.soldOut ? "Sold Out" : "Add"}
              className="relative w-full overflow-hidden bg-bone border border-ink py-5 label text-ink disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: adding ? 1 : 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 bg-ink origin-left"
              />
              <span className="relative" style={{ mixBlendMode: "difference", color: "#f5f0e6" }}>
                {product.soldOut ? "Sold Out" : adding ? "Adding…" : "Add to Cart"}
              </span>
            </button>

            <dl className="mt-12 space-y-5">
              <Row label="Fabric" value={product.fabric} />
              <Row label="Drop" value={`${drop.numeric} · ${drop.title}`} />
              <Row label="Made in" value={product.madeIn || "Porto, Portugal"} />
              <Row label="Care" value={product.care || "Cool wash. Air dry."} />
            </dl>
          </aside>
        </div>
      </div>

      <Lightbox
        images={product.images}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndex={setLightbox}
      />
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-charcoal/12 pb-3 text-[13px]">
      <dt className="label-sm text-charcoal/60">{label}</dt>
      <dd className="text-charcoal/85 text-right max-w-[60%]">{value}</dd>
    </div>
  );
}
