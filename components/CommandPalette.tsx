"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/lib/cart";

type Item = {
  id: string;
  label: string;
  hint?: string;
  action: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const setCartOpen = useCart((s) => s.setOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const items: Item[] = useMemo(
    () => [
      { id: "home", label: "Home", hint: "Hero, current drop", action: () => router.push("/") },
      { id: "shop", label: "Shop — All Pieces", action: () => router.push("/shop") },
      { id: "drops", label: "Archive — All Drops", action: () => router.push("/drops") },
      { id: "drop-02", label: "Drop 02 — Structure", hint: "Upcoming", action: () => router.push("/drops/drop-02-structure") },
      { id: "drop-01", label: "Drop 01 — Foundation", hint: "Live", action: () => router.push("/drops/drop-01-foundation") },
      { id: "drop-00o", label: "Drop 00 — Origins", hint: "Archive", action: () => router.push("/drops/drop-00-origins") },
      { id: "drop-00i", label: "Drop 00 — Intro", hint: "Archive", action: () => router.push("/drops/drop-00-intro") },
      { id: "about", label: "About — The Studio", action: () => router.push("/about") },
      { id: "cart", label: "Open Cart", action: () => setCartOpen(true) },
      { id: "admin", label: "Admin", hint: "Edit content", action: () => router.push("/admin") },
    ],
    [router, setCartOpen],
  );

  const filtered = q
    ? items.filter((i) =>
        (i.label + " " + (i.hint || "")).toLowerCase().includes(q.toLowerCase()),
      )
    : items;

  function run(item: Item) {
    item.action();
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] bg-ink/30 backdrop-blur-sm flex items-start justify-center pt-[18vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-bone border border-charcoal/15 shadow-2xl"
          >
            <div className="border-b border-charcoal/15 px-5 py-3 flex items-center gap-3">
              <span className="label-sm text-charcoal/55">⌘K</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(filtered.length - 1, a + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(0, a - 1));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (filtered[active]) run(filtered[active]);
                  }
                }}
                placeholder="Go to a drop, page, or action…"
                className="flex-1 bg-transparent outline-none text-sm py-1"
              />
            </div>
            <ul className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <li className="px-5 py-3 label-sm text-charcoal/55">Nothing found.</li>
              )}
              {filtered.map((i, idx) => (
                <li key={i.id}>
                  <button
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => run(i)}
                    className={`w-full text-left px-5 py-3 flex items-center justify-between transition-colors ${
                      idx === active ? "bg-limestone" : ""
                    }`}
                  >
                    <span className="text-sm text-ink">{i.label}</span>
                    {i.hint && <span className="label-sm text-charcoal/55">{i.hint}</span>}
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-charcoal/10 px-5 py-2.5 flex justify-between label-sm text-charcoal/50">
              <span>↑↓ Navigate · ↵ Open</span>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
