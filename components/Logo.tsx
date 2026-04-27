import clsx from "clsx";
import Laurel from "./Laurel";

type Variant = "primary" | "wreath-flank" | "wordmark-only" | "gold-on-dark";

// Full brand lockup: laurel above wordmark above tagline.
export function LogoPrimary({
  size = "md",
  showTagline = true,
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
}) {
  const sizes = {
    sm: { laurel: 38, mark: "text-xl md:text-2xl", tag: "text-[9px]" },
    md: { laurel: 56, mark: "text-3xl md:text-4xl", tag: "text-[10px]" },
    lg: { laurel: 80, mark: "text-5xl md:text-6xl", tag: "text-[11px]" },
    xl: { laurel: 120, mark: "text-[7vw] md:text-[5.5vw]", tag: "text-xs" },
  };
  const s = sizes[size];
  return (
    <div className={clsx("flex flex-col items-center text-center", className)}>
      <Laurel variant="gold" size={s.laurel} />
      <p
        className={clsx(
          "wordmark text-ink font-normal mt-2 leading-none",
          s.mark,
        )}
      >
        AGORA
      </p>
      {showTagline && (
        <p className={clsx("tagline mt-3", s.tag)}>A Study in Form</p>
      )}
    </div>
  );
}

// Horizontal lockup: small laurel + wordmark side by side.
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
      <span className={clsx("wordmark text-ink font-normal leading-none", s.mark)}>
        AGORA
      </span>
      {flank && <Laurel variant="gold" size={s.laurel} className="scale-x-[-1]" />}
    </div>
  );
}

// Stamp / circular badge — for empty states and seals.
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
      {/* Outer ring */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="0.6"
        />
        <text
          fontSize="6"
          fill="var(--color-gold)"
          fontFamily="var(--font-sans)"
          letterSpacing="0.3em"
          textAnchor="middle"
        >
          {/* Curved tagline along bottom of circle */}
          <textPath
            href="#badge-arc"
            startOffset="50%"
          >
            A · STUDY · IN · FORM
          </textPath>
        </text>
        <defs>
          <path
            id="badge-arc"
            d="M 10 50 A 40 40 0 0 0 90 50"
            fill="none"
          />
        </defs>
      </svg>

      {/* Center: wordmark + small laurel below */}
      <div className="relative flex flex-col items-center">
        <p
          className="wordmark text-ink font-normal leading-none"
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
