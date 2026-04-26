import { loadContent } from "@/lib/data";
import ShopExperience from "./_components/ShopExperience";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop · Agora" };

export default async function Shop() {
  const content = await loadContent();
  const products = content.drops.flatMap((d) =>
    d.products.map((p) => ({
      ...p,
      dropSlug: d.slug,
      dropTitle: d.title,
      dropNumeric: d.numeric,
      dropStatus: d.status,
    })),
  );
  return (
    <ShopExperience
      products={products}
      drops={content.drops.map((d) => ({
        slug: d.slug,
        numeric: d.numeric,
        title: d.title,
        status: d.status,
      }))}
    />
  );
}
