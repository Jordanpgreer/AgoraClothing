import clsx from "clsx";

type Variant = "gold" | "ink" | "bone" | "currentColor";

const variantColor: Record<Variant, string> = {
  gold: "var(--color-gold)",
  ink: "var(--color-ink)",
  bone: "var(--color-bone)",
  currentColor: "currentColor",
};

// A symmetrical laurel wreath: two arched branches of pointed leaves,
// open at the top, crossed at the bottom. Hand-tuned to match the
// brand mark.
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
  const color = variantColor[variant];

  // Math angle conventions: 0 = right (+x), 90 = up (+y in math, but in SVG up = -y),
  // increasing CCW. Right branch sweeps from ~80° (near top) clockwise around through
  // 0°, then down to ~-80° (~280°). Left branch is mirrored.
  const cx = 100;
  const cy = 100;
  const radius = 56;
  const leafLength = 24;
  const leafWidth = 5;

  // 11 leaves per branch
  const leafCount = 11;
  const startA = 80; // near top
  const endA = -80; // near bottom
  const angles = Array.from({ length: leafCount }, (_, i) => {
    const t = i / (leafCount - 1);
    return startA + (endA - startA) * t;
  });

  // Each leaf is an almond/teardrop pointing along +Y (up on screen, since we use rotate to
  // align outward). Path drawn around (0,0) with tip at (0,-leafLength).
  const leafPath = `M 0 0 C ${-leafWidth} ${-leafLength * 0.3}, ${-leafWidth} ${-leafLength * 0.7}, 0 ${-leafLength} C ${leafWidth} ${-leafLength * 0.7}, ${leafWidth} ${-leafLength * 0.3}, 0 0 Z`;

  // Stem path between leaves — a thin curved arc tracing the branch
  function branchStemPath(side: "right" | "left") {
    const sign = side === "right" ? 1 : -1;
    // Start near top inner, sweep around to bottom center
    const start = polar(cx, cy, radius - 4, sign * 80);
    const end = { x: cx + sign * 6, y: cy + radius - 6 };
    const ctrl1 = polar(cx, cy, radius - 4, sign * 30);
    const ctrl2 = polar(cx, cy, radius - 4, sign * -30);
    return `M ${start.x} ${start.y} C ${ctrl1.x} ${ctrl1.y}, ${ctrl2.x} ${ctrl2.y}, ${end.x} ${end.y}`;
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      className={clsx("inline-block", className)}
      style={{ color }}
    >
      <g fill={color} stroke={color} strokeWidth={1.2} strokeLinecap="round">
        {/* Right-side branch */}
        <path d={branchStemPath("right")} fill="none" strokeWidth={1.5} />
        {angles.map((a, i) => {
          const p = polar(cx, cy, radius, a);
          const rot = 90 - a; // align leaf to point outward
          return (
            <g key={`r-${i}`} transform={`translate(${p.x}, ${p.y}) rotate(${rot})`}>
              <path d={leafPath} />
            </g>
          );
        })}

        {/* Left-side branch (mirrored) */}
        <path d={branchStemPath("left")} fill="none" strokeWidth={1.5} />
        {angles.map((a, i) => {
          const mirror = 180 - a;
          const p = polar(cx, cy, radius, mirror);
          const rot = 90 - mirror;
          return (
            <g key={`l-${i}`} transform={`translate(${p.x}, ${p.y}) rotate(${rot})`}>
              <path d={leafPath} />
            </g>
          );
        })}

        {/* Crossed tail at the bottom */}
        <path
          d={`M ${cx - 8} ${cy + radius - 4} L ${cx + 8} ${cy + radius + 8}`}
          stroke={color}
          strokeWidth={1.6}
          fill="none"
        />
        <path
          d={`M ${cx + 8} ${cy + radius - 4} L ${cx - 8} ${cy + radius + 8}`}
          stroke={color}
          strokeWidth={1.6}
          fill="none"
        />
      </g>
    </svg>
  );
}

// Math-angle (degrees, 0 = right, 90 = up) → SVG screen coords.
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}
