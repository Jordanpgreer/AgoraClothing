import Image from "next/image";
import Link from "next/link";
import { loadContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AllProductsAdmin() {
  const { drops } = await loadContent();
  const all = drops.flatMap((d) =>
    d.products.map((p) => ({ ...p, dropSlug: d.slug, dropTitle: d.title, dropNumeric: d.numeric })),
  );

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="label-sm text-charcoal/65 mb-2">Products</p>
        <h1 className="wordmark text-2xl text-ink font-light">
          Every piece across every drop.
        </h1>
        <p className="text-[13px] text-charcoal/65 mt-3 max-w-xl leading-relaxed">
          Click any product to edit name, price, images, fabric, description,
          sizes, and care details. New products are created from inside their parent drop.
        </p>
      </div>

      {all.length === 0 && (
        <p className="text-charcoal/60 text-sm border border-charcoal/15 p-6 bg-white">
          No products yet.{" "}
          <Link href="/admin/drops" className="underline">
            Create one inside a drop →
          </Link>
        </p>
      )}

      <ul className="space-y-3">
        {all.map((p) => (
          <li key={p.dropSlug + "-" + p.slug}>
            <Link
              href={`/admin/products/${p.slug}`}
              className="flex items-center gap-5 border border-charcoal/15 bg-white p-3 hover:border-ink transition-colors"
            >
              <div className="relative w-14 h-16 bg-limestone overflow-hidden flex-shrink-0">
                {p.images[0] && (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="60px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-ink">{p.name}</p>
                <p className="label-sm text-charcoal/65 mt-1">
                  {p.category} · {p.colorway} · Drop {p.dropNumeric}: {p.dropTitle}
                </p>
              </div>
              <p className="font-mono text-[13px] text-charcoal/80 tabular-nums">
                ${p.price}
              </p>
              {p.soldOut && (
                <span className="label-sm text-charcoal/65 border border-charcoal/30 px-2 py-1">
                  Sold Out
                </span>
              )}
              <span className="text-charcoal/45">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
