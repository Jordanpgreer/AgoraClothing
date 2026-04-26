"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useEffect, useState } from "react";
import Odometer from "./Odometer";

export default function CartDrawer() {
  const { open, setOpen, items, remove, subtotal } = useCart();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="drawer"
            className="fixed right-0 top-0 bottom-0 w-full md:w-[460px] bg-bone z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 240, mass: 0.9 }}
          >
            <header className="flex justify-between items-center px-6 py-5 border-b border-charcoal/10">
              <p className="label">Your bag</p>
              <button
                onClick={() => setOpen(false)}
                className="label text-charcoal/70 hover:text-ink"
                data-cursor="default"
              >
                Close ✕
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {hydrated && items.length === 0 && <EmptyState onClose={() => setOpen(false)} />}
              <AnimatePresence initial={false}>
                {hydrated &&
                  items.map((item) => (
                    <motion.div
                      key={item.productSlug + item.size}
                      layout
                      initial={{ opacity: 0, height: 0, scale: 0.96 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.96 }}
                      transition={{ type: "spring", damping: 30, stiffness: 250 }}
                      className="flex gap-4 py-5 border-b border-charcoal/10 overflow-hidden"
                    >
                      <div className="relative w-20 h-24 bg-limestone flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                          <p className="text-sm">{item.name}</p>
                          <p className="font-mono text-sm tabular-nums">${item.price * item.qty}</p>
                        </div>
                        <p className="label-sm text-charcoal/55 mt-1">
                          {item.colorway} · Size {item.size} · Qty {item.qty}
                        </p>
                        <button
                          onClick={() => remove(item.productSlug, item.size)}
                          className="label-sm text-charcoal/55 hover:text-ink mt-3"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {hydrated && items.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-t border-charcoal/10 p-6 space-y-4"
              >
                <div className="flex justify-between items-baseline">
                  <p className="label">Subtotal</p>
                  <p className="wordmark text-2xl text-ink font-light">
                    <Odometer value={subtotal()} prefix="$" />
                  </p>
                </div>
                <p className="text-xs text-charcoal/55 leading-relaxed">
                  Shipping and taxes calculated at checkout. Each garment is
                  packaged by hand in recycled paper.
                </p>
                <button
                  className="w-full bg-ink text-bone py-4 label hover:bg-charcoal transition-colors"
                  data-cursor="plus"
                  data-cursor-label="Checkout"
                >
                  Proceed to Checkout →
                </button>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center gap-5 py-20">
      <motion.div
        animate={{
          scaleY: [1, 1.04, 1],
          opacity: [0.55, 0.85, 0.55],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-3"
      >
        <div className="w-2 h-24 bg-clay/60 rounded-sm" />
        <div className="w-12 h-1 bg-clay/60 rounded-sm" />
      </motion.div>
      <p className="wordmark text-xl text-ink font-light">A quiet bag.</p>
      <p className="text-sm text-charcoal/60 max-w-xs">
        Begin with a single piece — each is made in limited number.
      </p>
      <Link
        href="/drops"
        onClick={onClose}
        className="label border-b border-ink pb-1 mt-2"
        data-cursor="view"
      >
        Enter the drop →
      </Link>
    </div>
  );
}
