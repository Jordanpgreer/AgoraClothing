"use client";

import clsx from "clsx";
import Image from "next/image";
import Laurel from "./Laurel";

// Full primary lockup — uses the official primary.png asset directly so
// proportions, kerning, and tagline match the brand kit exactly.
export function LogoPrimary({
  size = "md",
  className = "",
  invert = false,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  invert?: boolean;
}) {
  const widths = { sm: 180, md: 280, lg: 420, xl: 560 };
  const heights = { sm: 130, md: 200, lg: 300, xl: 400 };
  const w = widths[size];
  const h = heights[size];
  return (
    <div
      className={clsx("relative inline-block", className)}
      style={{
        width: w,
        height: h,
        filter: invert ? "invert(1) brightness(1.1)" : undefined,
      }}
    >
      <Image
        src="/logo/primary.png"
        alt="Agora — A Study in Form"
        fill
        sizes={`${w}px`}
        className="object-contain"
        priority
      />
    </div>
  );
}

// Horizontal lockup using the laurel + serif wordmark. Useful in the nav.
export function LogoHorizontal({
  size = "md",
  className = "",
  flank = false,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  flank?: boolean;
}) {
  const sizes = {
    sm: { laurel: 24, mark: "text-base" },
    md: { laurel: 32, mark: "text-xl" },
    lg: { laurel: 44, mark: "text-3xl" },
  };
  const s = sizes[size];
  return (
    <div className={clsx("inline-flex items-center gap-3", className)}>
      <Laurel variant="gold" size={s.laurel} />
      <span className={clsx("wordmark text-ink leading-none", s.mark)}>
        AGORA
      </span>
      {flank && <Laurel variant="gold" size={s.laurel} className="scale-x-[-1]" />}
    </div>
  );
}

// Stamp / circular badge — tagline curving along the bottom arc, brand
// laurel anchored beneath the wordmark.
export function LogoBadge({
  size = 140,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={clsx("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="0.6"
        />
        <defs>
          <path id="badge-arc" d="M 12 50 A 38 38 0 0 0 88 50" fill="none" />
        </defs>
        <text
          fontSize="5.6"
          fill="var(--color-gold)"
          fontFamily="var(--font-sans)"
          letterSpacing="0.32em"
          textAnchor="middle"
        >
          <textPath href="#badge-arc" startOffset="50%">
            A · STUDY · IN · FORM
          </textPath>
        </text>
      </svg>

      <div className="relative flex flex-col items-center">
        <p
          className="wordmark text-ink leading-none"
          style={{ fontSize: size * 0.13 }}
        >
          AGORA
        </p>
        <Laurel variant="gold" size={size * 0.42} className="-mt-1" />
      </div>
    </div>
  );
}

// Small section divider — laurel between hairlines.
export function LaurelDivider({
  variant = "ink",
  size = 26,
  className = "",
}: {
  variant?: "ink" | "gold" | "bone";
  size?: number;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center justify-center gap-5 my-8", className)}>
      <span className="h-px flex-1 max-w-[140px] bg-current opacity-25" />
      <Laurel variant={variant} size={size} />
      <span className="h-px flex-1 max-w-[140px] bg-current opacity-25" />
    </div>
  );
}
