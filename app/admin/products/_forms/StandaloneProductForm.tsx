"use client";

import { useRouter } from "next/navigation";
import { AdminSection } from "@/components/admin/Section";
import ProductForm from "@/app/admin/drops/_forms/ProductForm";
import type { Product } from "@/lib/data";

export default function StandaloneProductForm({
  product,
  dropSlug,
}: {
  product: Product;
  dropSlug: string;
}) {
  const router = useRouter();
  return (
    <AdminSection title="Edit Product">
      <ProductForm
        product={product}
        dropSlug={dropSlug}
        onDone={() => router.push("/admin/products")}
        onCancel={() => router.push("/admin/products")}
      />
    </AdminSection>
  );
}
