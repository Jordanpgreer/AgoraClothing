"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { ADMIN_COOKIE, getAdminPassword, isAuthed } from "@/lib/auth";
import { loadContent, saveContent, type SiteContent, type Drop, type Product } from "@/lib/data";
import { getSupabase, STORAGE_BUCKET, isSupabaseConfigured } from "@/lib/supabase";

async function requireAuth() {
  if (!(await isAuthed())) throw new Error("Unauthorized");
}

function refreshAll() {
  revalidatePath("/", "layout");
}

export async function login(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password !== getAdminPassword()) {
    redirect("/admin/login?error=1");
  }
  const c = await cookies();
  c.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  redirect("/admin");
}

export async function logout() {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// ---------- Section updates ----------

export async function updateHero(data: SiteContent["hero"]) {
  await requireAuth();
  const content = loadContent();
  content.hero = data;
  saveContent(content);
  refreshAll();
}

export async function updatePhilosophy(data: SiteContent["philosophy"]) {
  await requireAuth();
  const content = loadContent();
  content.philosophy = data;
  saveContent(content);
  refreshAll();
}

export async function updateNewsletter(data: SiteContent["newsletter"]) {
  await requireAuth();
  const content = loadContent();
  content.newsletter = data;
  saveContent(content);
  refreshAll();
}

export async function updateAbout(data: SiteContent["about"]) {
  await requireAuth();
  const content = loadContent();
  content.about = data;
  saveContent(content);
  refreshAll();
}

export async function updateFooter(data: SiteContent["footer"]) {
  await requireAuth();
  const content = loadContent();
  content.footer = data;
  saveContent(content);
  refreshAll();
}

// ---------- Drops ----------

export async function updateDrop(slug: string, data: Omit<Drop, "products">) {
  await requireAuth();
  const content = loadContent();
  const idx = content.drops.findIndex((d) => d.slug === slug);
  if (idx === -1) throw new Error("Drop not found");
  content.drops[idx] = { ...content.drops[idx], ...data };
  saveContent(content);
  refreshAll();
}

export async function createDrop(data: Omit<Drop, "products">) {
  await requireAuth();
  const content = loadContent();
  if (content.drops.some((d) => d.slug === data.slug))
    throw new Error("A drop with this slug already exists.");
  content.drops.unshift({ ...data, products: [] });
  saveContent(content);
  refreshAll();
}

export async function deleteDrop(slug: string) {
  await requireAuth();
  const content = loadContent();
  content.drops = content.drops.filter((d) => d.slug !== slug);
  saveContent(content);
  refreshAll();
  redirect("/admin");
}

// ---------- Products ----------

export async function updateProduct(
  dropSlug: string,
  productSlug: string,
  data: Product,
) {
  await requireAuth();
  const content = loadContent();
  const drop = content.drops.find((d) => d.slug === dropSlug);
  if (!drop) throw new Error("Drop not found");
  const idx = drop.products.findIndex((p) => p.slug === productSlug);
  if (idx === -1) throw new Error("Product not found");
  drop.products[idx] = data;
  saveContent(content);
  refreshAll();
}

export async function createProduct(dropSlug: string, data: Product) {
  await requireAuth();
  const content = loadContent();
  const drop = content.drops.find((d) => d.slug === dropSlug);
  if (!drop) throw new Error("Drop not found");
  if (drop.products.some((p) => p.slug === data.slug))
    throw new Error("Product slug already in use.");
  drop.products.push(data);
  saveContent(content);
  refreshAll();
}

export async function deleteProduct(dropSlug: string, productSlug: string) {
  await requireAuth();
  const content = loadContent();
  const drop = content.drops.find((d) => d.slug === dropSlug);
  if (!drop) throw new Error("Drop not found");
  drop.products = drop.products.filter((p) => p.slug !== productSlug);
  saveContent(content);
  refreshAll();
}

// ---------- Image upload ----------

export async function uploadImage(formData: FormData) {
  await requireAuth();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("No file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ["jpg", "jpeg", "png", "webp", "avif", "gif"].includes(ext)
    ? ext
    : "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

  // Supabase Storage when configured (production path)
  if (isSupabaseConfigured()) {
    const supa = getSupabase()!;
    const objectPath = `uploads/${filename}`;
    const { error } = await supa.storage
      .from(STORAGE_BUCKET)
      .upload(objectPath, buffer, {
        contentType: file.type || `image/${safeExt}`,
        upsert: false,
      });
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
    const { data } = supa.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
    return { url: data.publicUrl };
  }

  // Local-disk fallback for dev without Supabase
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);
  return { url: `/uploads/${filename}` };
}
