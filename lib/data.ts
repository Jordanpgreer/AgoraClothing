import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import {
  cloneAdminFinance,
  type AdminFinance,
} from "@/lib/admin-finance";
import {
  cloneAdminTodoSections,
  type AdminTodoSection,
} from "@/lib/admin-todos";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

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
  madeIn?: string;
  care?: string;
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
  adminTodo?: AdminTodoSection[];
  adminFinance?: AdminFinance;
};

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");
const ROW_ID = "main";

function normalizeContent(content: SiteContent): SiteContent {
  return {
    ...content,
    adminTodo: content.adminTodo ?? cloneAdminTodoSections(),
    adminFinance: content.adminFinance ?? cloneAdminFinance(),
  };
}

// React cache() dedupes calls within a single request render.
export const loadContent = cache(async (): Promise<SiteContent> => {
  if (isSupabaseConfigured()) {
    const supa = getSupabase()!;
    const { data, error } = await supa
      .from("site_content")
      .select("data")
      .eq("id", ROW_ID)
      .single();
    if (error) throw new Error(`Supabase load failed: ${error.message}`);
    return normalizeContent(data!.data as SiteContent);
  }

  // Local-disk fallback
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  return normalizeContent(JSON.parse(raw) as SiteContent);
});

export async function saveContent(content: SiteContent) {
  if (isSupabaseConfigured()) {
    const supa = getSupabase()!;
    const { error } = await supa
      .from("site_content")
      .upsert({ id: ROW_ID, data: content, updated_at: new Date().toISOString() });
    if (error) throw new Error(`Supabase save failed: ${error.message}`);
    return;
  }

  fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}

export async function getDrop(slug: string): Promise<Drop | undefined> {
  const c = await loadContent();
  return c.drops.find((d) => d.slug === slug);
}

export async function getProduct(
  slug: string,
): Promise<{ product: Product; drop: Drop } | null> {
  const c = await loadContent();
  for (const d of c.drops) {
    const p = d.products.find((p) => p.slug === slug);
    if (p) return { product: p, drop: d };
  }
  return null;
}

export async function getFeaturedDrop(): Promise<Drop> {
  const c = await loadContent();
  return c.drops.find((d) => d.status === "live") ?? c.drops[0];
}

export async function getUpcomingDrop(): Promise<Drop> {
  const c = await loadContent();
  return c.drops.find((d) => d.status === "upcoming") ?? c.drops[0];
}

export async function getArchivedDrops(): Promise<Drop[]> {
  const c = await loadContent();
  return c.drops.filter((d) => d.status !== "upcoming");
}

export async function getAllProducts(): Promise<Product[]> {
  const c = await loadContent();
  return c.drops.flatMap((d) => d.products);
}
