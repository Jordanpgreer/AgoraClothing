"use client";

import { useTransition } from "react";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/actions";
import type { Product } from "@/lib/data";
import { FormGrid, FieldRow } from "@/components/admin/Section";
import {
  TextInput,
  TextArea,
  MultiImagePicker,
  SaveButton,
} from "@/components/admin/Field";

export default function ProductForm({
  dropSlug,
  product,
  onDone,
  onCancel,
}: {
  dropSlug: string;
  product?: Product;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [pending, start] = useTransition();
  const isEdit = !!product;

  function action(formData: FormData) {
    start(async () => {
      const slug = String(formData.get("slug") || "").trim();
      if (!slug) return alert("Slug required");

      const next: Product = {
        slug,
        name: String(formData.get("name") || ""),
        category: String(formData.get("category") || ""),
        price: Number(formData.get("price") || 0),
        colorway: String(formData.get("colorway") || ""),
        fabric: String(formData.get("fabric") || ""),
        description: String(formData.get("description") || ""),
        images: JSON.parse(String(formData.get("images") || "[]")),
        sizes: String(formData.get("sizes") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        soldOut: formData.get("soldOut") === "on",
        madeIn: String(formData.get("madeIn") || "") || undefined,
        care: String(formData.get("care") || "") || undefined,
      };

      try {
        if (isEdit && product) {
          await updateProduct(dropSlug, product.slug, next);
        } else {
          await createProduct(dropSlug, next);
        }
        onDone();
      } catch (e) {
        alert((e as Error).message);
      }
    });
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`Delete ${product.name}?`)) return;
    await deleteProduct(dropSlug, product.slug);
    onDone();
  }

  return (
    <form action={action} className="space-y-5">
      <p className="wordmark text-sm text-ink mb-2">
        {isEdit ? `Editing ${product?.name}` : "New Product"}
      </p>

      <FieldRow label="Images">
        <MultiImagePicker name="images" defaultValue={product?.images} />
      </FieldRow>

      <FormGrid>
        <FieldRow label="Slug (URL)">
          <TextInput name="slug" defaultValue={product?.slug} placeholder="core-hoodie" />
        </FieldRow>
        <FieldRow label="Name">
          <TextInput name="name" defaultValue={product?.name} placeholder="Core Hoodie" />
        </FieldRow>
        <FieldRow label="Category">
          <TextInput name="category" defaultValue={product?.category} placeholder="Hoodie" />
        </FieldRow>
        <FieldRow label="Colorway">
          <TextInput name="colorway" defaultValue={product?.colorway} placeholder="Limestone" />
        </FieldRow>
        <FieldRow label="Price (USD)">
          <TextInput name="price" defaultValue={product?.price} type="number" placeholder="160" />
        </FieldRow>
        <FieldRow label="Sizes (comma-separated)">
          <TextInput
            name="sizes"
            defaultValue={product?.sizes.join(", ")}
            placeholder="XS, S, M, L, XL"
          />
        </FieldRow>
        <FieldRow label="Fabric" span={2}>
          <TextInput name="fabric" defaultValue={product?.fabric} placeholder="Brushed loopback fleece, 480gsm" />
        </FieldRow>
        <FieldRow label="Description" span={2}>
          <TextArea name="description" defaultValue={product?.description} rows={3} />
        </FieldRow>
        <FieldRow label="Made in (optional override)">
          <TextInput name="madeIn" defaultValue={product?.madeIn} placeholder="Porto, Portugal" />
        </FieldRow>
        <FieldRow label="Care (optional override)">
          <TextInput name="care" defaultValue={product?.care} placeholder="Cool wash. Air dry." />
        </FieldRow>
        <FieldRow label="Sold out" span={2}>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="soldOut" defaultChecked={product?.soldOut} />
            Mark as sold out
          </label>
        </FieldRow>
      </FormGrid>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <SaveButton>{pending ? "Saving…" : isEdit ? "Save Product" : "Create Product"}</SaveButton>
          <button
            type="button"
            onClick={onCancel}
            className="label-sm text-charcoal/65 hover:text-ink"
          >
            Cancel
          </button>
        </div>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="label-sm text-charcoal/65 hover:text-ink"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
