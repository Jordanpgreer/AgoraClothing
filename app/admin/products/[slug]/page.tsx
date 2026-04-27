import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/data";
import StandaloneProductForm from "../_forms/StandaloneProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductStandalone({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProduct(slug);
  if (!result) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8">
        <Link href="/admin/products" className="label-sm text-charcoal/65 hover:text-ink">
          ← All Products
        </Link>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h1 className="wordmark text-2xl font-light text-ink">
            {result.product.name}
          </h1>
          <Link
            href={`/admin/drops/${result.drop.slug}`}
            className="label-sm text-charcoal/65 hover:text-ink"
          >
            In Drop {result.drop.numeric}: {result.drop.title} →
          </Link>
        </div>
      </div>

      <StandaloneProductForm
        product={result.product}
        dropSlug={result.drop.slug}
      />
    </div>
  );
}
