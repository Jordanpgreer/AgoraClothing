import "server-only";
import fs from "node:fs";
import path from "node:path";

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  colorway: string;
  fabric: string;
  description: string;
  images: string[];
  sizes: string[];
  soldOut?: boolean;
};

export type Drop = {
  slug: string;
  number: string;
  numeric: string;
  title: string;
  subtitle: string;
  season: string;
  releaseDate: string;
  status: "upcoming" | "live" | "archived";
  palette: string[];
  cover: string;
  story: string;
  products: Product[];
};

export type SiteContent = {
  hero: {
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    leftMeta: string;
    rightMeta: string;
    coverImage: string;
  };
  philosophy: {
    eyebrow: string;
    heading: string;
    tenets: { n: string; title: string; body: string }[];
  };
  newsletter: {
    eyebrow: string;
    heading: string;
    body: string;
    background: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    intro: string;
    image: string;
    practiceLabel: string;
    practiceBody: string;
    spaceLabel: string;
    spaceBody: string;
  };
  footer: { tagline: string };
  drops: Drop[];
};

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");

export function loadContent(): SiteContent {
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export function saveContent(content: SiteContent) {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}

export function getDrop(slug: string): Drop | undefined {
  return loadContent().drops.find((d) => d.slug === slug);
}

export function getProduct(slug: string): { product: Product; drop: Drop } | null {
  const c = loadContent();
  for (const d of c.drops) {
    const p = d.products.find((p) => p.slug === slug);
    if (p) return { product: p, drop: d };
  }
  return null;
}

export function getFeaturedDrop(): Drop {
  const c = loadContent();
  return c.drops.find((d) => d.status === "live") ?? c.drops[0];
}

export function getUpcomingDrop(): Drop {
  const c = loadContent();
  return c.drops.find((d) => d.status === "upcoming") ?? c.drops[0];
}

export function getArchivedDrops(): Drop[] {
  return loadContent().drops.filter((d) => d.status !== "upcoming");
}

export function getAllProducts(): Product[] {
  return loadContent().drops.flatMap((d) => d.products);
}
