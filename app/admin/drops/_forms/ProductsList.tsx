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
    <AdminSection title={`Products (${drop.products.length})`} description="Each piece in this drop.">
      {creating && (
        <div className="mb-6 border border-ink/40 p-4 bg-bone">
          <ProductForm
            dropSlug={drop.slug}
            onDone={() => setCreating(false)}
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      <ul className="space-y-3">
        {drop.products.map((p) => (
          <li key={p.slug}>
            {editing === p.slug ? (
              <div className="border border-ink/40 p-4 bg-bone">
                <ProductForm
                  dropSlug={drop.slug}
                  product={p}
                  onDone={() => setEditing(null)}
                  onCancel={() => setEditing(null)}
                />
              </div>
            ) : (
              <ProductRow product={p} onEdit={() => setEditing(p.slug)} />
            )}
          </li>
        ))}
      </ul>

      {!creating && (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="mt-6 label-sm text-ink border border-ink/40 px-4 py-2 hover:bg-ink hover:text-bone transition"
        >
          + Add Product
        </button>
      )}
    </AdminSection>
  );
}

function ProductRow({ product, onEdit }: { product: Product; onEdit: () => void }) {
  return (
    <button
      onClick={onEdit}
      className="w-full flex items-center gap-4 border border-charcoal/15 bg-white p-3 text-left hover:border-ink transition-colors"
    >
      <div className="relative w-14 h-16 bg-limestone overflow-hidden flex-shrink-0">
        {product.images[0] && (
          <Image src={product.images[0]} alt={product.name} fill sizes="60px" className="object-cover" unoptimized />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm text-ink">{product.name}</p>
        <p className="label-sm text-charcoal/65 mt-1">
          {product.category} · {product.colorway}
        </p>
      </div>
      <p className="font-mono text-[13px] text-charcoal/80 tabular-nums">
        ${product.price}
      </p>
      {product.soldOut && (
        <span className="label-sm text-charcoal/65 border border-charcoal/30 px-2 py-1">
          Sold Out
        </span>
      )}
      <span className="text-charcoal/45">→</span>
    </button>
  );
}
