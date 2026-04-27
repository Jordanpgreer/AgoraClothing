"use client";

import clsx from "clsx";
import Image from "next/image";

type Variant = "gold" | "ink" | "bone" | "currentColor";

// Recolor strategies for each variant — we use CSS filter on the gold PNG.
// gold = identity (no filter); ink/bone = brightness(0) + invert as needed.
const variantFilter: Record<Variant, string> = {
  gold: "none",
  ink: "brightness(0)",
  bone: "brightness(0) invert(1) brightness(0.96) sepia(0.18)",
  currentColor: "none",
};

// Renders the official Agora laurel asset from /public/logo/laurel.png.
// Variants other than 'gold' apply CSS filters to recolor the same source.
export default function Laurel({
  variant = "gold",
  size = 80,
  className = "",
  ariaLabel,
}: {
  variant?: Variant;
  size?: number;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <span
      className={clsx("inline-block relative", className)}
      style={{
        width: size,
        height: size,
        filter: variantFilter[variant],
      }}
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
    >
      <Image
        src="/logo/laurel.png"
        alt={ariaLabel || ""}
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority={size > 60}
      />
    </span>
  );
}
