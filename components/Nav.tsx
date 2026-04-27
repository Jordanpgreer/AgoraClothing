"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { motion } from "motion/react";
import SoundToggle from "./SoundToggle";
import Laurel from "./Laurel";

export default function Nav() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const c = hydrated ? count() : 0;

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-700",
        scrolled ? "bg-bone/85 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="flex items-center justify-between px-8 md:px-12 h-20">
        <Link
          href="/"
          onMouseEnter={() => setHoverLogo(true)}
          onMouseLeave={() => setHoverLogo(false)}
          data-cursor="view"
          data-cursor-label="Home"
          className="flex items-center gap-3 text-[15px] md:text-[17px] text-ink"
        >
          <Laurel variant="gold" size={26} />
          <span className="wordmark text-ink leading-none">
            {"AGORA".split("").map((l, i) => (
              <motion.span
                key={i}
                animate={{ letterSpacing: hoverLogo ? "0.6em" : "0.42em" }}
                transition={{ duration: 0.8, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: "inline-block" }}
              >
                {l}
              </motion.span>
            ))}
          </span>
        </Link>

        <nav className="flex items-center gap-7 md:gap-12">
          <Link
            href="/shop"
            data-cursor="view"
            className="label text-ink hover:opacity-60 transition-opacity"
          >
            Shop
          </Link>
          <Link
            href="/drops"
            data-cursor="view"
            className="label text-ink hover:opacity-60 transition-opacity"
          >
            Archive
          </Link>
          <Link
            href="/about"
            data-cursor="view"
            className="label text-ink hover:opacity-60 transition-opacity"
          >
            About
          </Link>
          <SoundToggle />
          <button
            onClick={() => setOpen(true)}
            data-cursor="plus"
            data-cursor-label="Open"
            className="label text-ink hover:opacity-60 transition-opacity"
            aria-label="Open cart"
          >
            Cart ({c})
          </button>
        </nav>
      </div>
    </header>
  );
}
