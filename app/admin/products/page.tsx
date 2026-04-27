import Image from "next/image";
import Link from "next/link";
import { loadContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AllProductsAdmin() {
  const { drops } = await loadContent();
  const all = drops.flatMap((drop) =>
    drop.products.map((product) => ({
      ...product,
      dropSlug: drop.slug,
      dropTitle: drop.title,
      dropNumeric: drop.numeric,
    })),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-10">
        <p className="mb-2 label-sm text-charcoal/65">Products</p>
        <h1 className="wordmark text-2xl font-light text-ink">
          Every piece across every drop.
        </h1>
        <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-charcoal/65">
          Click any product to edit name, price, images, fabric, description,
          sizes, and care details. New products are created from inside their
          parent drop.
        </p>
      </div>

      {all.length === 0 && (
        <p className="border border-charcoal/15 bg-white p-6 text-sm text-charcoal/60">
          No products yet.{" "}
          <Link href="/admin/drops" className="underline">
            Create one inside a drop →
          </Link>
        </p>
      )}

      <ul className="space-y-3">
        {all.map((product) => (
          <li key={`${product.dropSlug}-${product.slug}`}>
            <Link
              href={`/admin/products/${product.slug}`}
              className="flex flex-col gap-4 border border-charcoal/15 bg-white p-4 transition-colors hover:border-ink sm:flex-row sm:items-center sm:gap-5"
            >
              <div className="relative h-44 w-full overflow-hidden bg-limestone sm:h-16 sm:w-14 sm:flex-shrink-0">
                {product.images[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 56px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm text-ink">{product.name}</p>
                <p className="mt-1 label-sm text-charcoal/65">
                  {product.category} · {product.colorway} · Drop {product.dropNumeric}:{" "}
                  {product.dropTitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                <p className="font-mono text-[13px] tabular-nums text-charcoal/80">
                  ${product.price}
                </p>
                {product.soldOut && (
                  <span className="label-sm border border-charcoal/30 px-2 py-1 text-charcoal/65">
                    Sold Out
                  </span>
                )}
                <span className="text-charcoal/45">→</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
