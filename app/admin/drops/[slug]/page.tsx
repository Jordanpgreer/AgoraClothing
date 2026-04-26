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
  const drop = getDrop(slug);
  if (!drop) notFound();

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <Link href="/admin/drops" className="label-sm text-charcoal/65 hover:text-ink">
          ← All Drops
        </Link>
        <h1 className="wordmark text-2xl text-ink font-light mt-3">
          Drop {drop.numeric}: {drop.title}
        </h1>
      </div>

      <EditDropForm drop={drop} />
      <ProductsList drop={drop} />
    </div>
  );
}
