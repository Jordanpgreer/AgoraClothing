import Link from "next/link";
import { notFound } from "next/navigation";
import { getDrop } from "@/lib/data";
import EditDropForm from "../_forms/EditDropForm";
import ProductsList from "../_forms/ProductsList";

export const dynamic = "force-dynamic";

export default async function EditDrop({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const drop = await getDrop(slug);
  if (!drop) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-10">
        <Link href="/admin/drops" className="label-sm text-charcoal/65 hover:text-ink">
          ← All Drops
        </Link>
        <h1 className="mt-3 wordmark text-2xl font-light text-ink">
          Drop {drop.numeric}: {drop.title}
        </h1>
      </div>

      <EditDropForm drop={drop} />
      <ProductsList drop={drop} />
    </div>
  );
}
