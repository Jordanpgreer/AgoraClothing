"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function MobileBottomNav() {
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const c = hydrated ? count() : 0;

  const items = [
    { href: "/shop", label: "Shop" },
    { href: "/drops", label: "Drops" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-bone/90 backdrop-blur-md border-t border-charcoal/15">
      <div className="grid grid-cols-4">
        {items.map((i) => {
          const active = pathname === i.href || pathname.startsWith(i.href + "/");
          return (
            <Link
              key={i.href}
              href={i.href}
              className={clsx(
                "py-4 text-center label-sm transition-opacity",
                active ? "text-ink" : "text-charcoal/55",
              )}
            >
              {i.label}
            </Link>
          );
        })}
        <button
          onClick={() => setOpen(true)}
          className="py-4 text-center label-sm text-ink"
        >
          Bag ({c})
        </button>
      </div>
    </nav>
  );
}
