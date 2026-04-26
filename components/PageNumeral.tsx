"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const map: Record<string, string> = {
  "/": "I",
  "/shop": "II",
  "/drops": "III",
  "/about": "IV",
};

function numeralFor(path: string) {
  if (map[path]) return map[path];
  if (path.startsWith("/drops/")) return "III · i";
  if (path.startsWith("/product/")) return "II · i";
  return "—";
}

export default function PageNumeral() {
  const pathname = usePathname();
  const num = numeralFor(pathname);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="hidden md:block fixed left-4 bottom-4 z-20 pointer-events-none label-sm text-ink/60 mix-blend-multiply"
    >
      {num}
    </motion.div>
  );
}
