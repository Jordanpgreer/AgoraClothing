import { notFound } from "next/navigation";
import { getProduct } from "@/lib/data";
import ProductDetail from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = getProduct(slug);
  return { title: result ? `${result.product.name} — Agora` : "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = getProduct(slug);
  if (!result) notFound();
  return <ProductDetail product={result.product} drop={result.drop} />;
}
