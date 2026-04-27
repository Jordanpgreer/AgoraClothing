"use client";

import Image from "next/image";
import { useState } from "react";
import type { Drop, Product } from "@/lib/data";
import { AdminSection } from "@/components/admin/Section";
import ProductForm from "./ProductForm";

export default function ProductsList({ drop }: { drop: Drop }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <AdminSection
      title={`Products (${drop.products.length})`}
      description="Each piece in this drop."
    >
      {creating && (
        <div className="mb-6 bg-bone p-4 border border-ink/40">
          <ProductForm
            dropSlug={drop.slug}
            onDone={() => setCreating(false)}
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      <ul className="space-y-3">
        {drop.products.map((product) => (
          <li key={product.slug}>
            {editing === product.slug ? (
              <div className="bg-bone p-4 border border-ink/40">
                <ProductForm
                  dropSlug={drop.slug}
                  product={product}
                  onDone={() => setEditing(null)}
                  onCancel={() => setEditing(null)}
                />
              </div>
            ) : (
              <ProductRow product={product} onEdit={() => setEditing(product.slug)} />
            )}
          </li>
        ))}
      </ul>

      {!creating && (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="mt-6 border border-ink/40 px-4 py-2 label-sm text-ink transition hover:bg-ink hover:text-bone"
        >
          + Add Product
        </button>
      )}
    </AdminSection>
  );
}

function ProductRow({
  product,
  onEdit,
}: {
  product: Product;
  onEdit: () => void;
}) {
  return (
    <button
      onClick={onEdit}
      className="flex w-full flex-col gap-4 border border-charcoal/15 bg-white p-3 text-left transition-colors hover:border-ink sm:flex-row sm:items-center"
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
          {product.category} · {product.colorway}
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
    </button>
  );
}
