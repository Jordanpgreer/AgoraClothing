import { notFound } from "next/navigation";
import Image from "next/image";
import Countdown from "@/components/Countdown";
import ProductCard from "@/components/ProductCard";
import { getDrop, loadContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const drop = getDrop(slug);
  return { title: drop ? `Drop ${drop.numeric}: ${drop.title} — Agora` : "Drop" };
}

export default async function DropDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const drop = getDrop(slug);
  if (!drop) notFound();

  return (
    <article className="bg-bone">
      <section className="relative h-[78vh] min-h-[560px]">
        <Image
          src={drop.cover}
          alt={drop.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bone/10 via-transparent to-bone/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="label text-charcoal/85 mb-8">
            Drop {drop.numeric} — {drop.season}
          </p>
          <h1 className="wordmark text-[14vw] md:text-[7vw] leading-none text-ink font-light">
            {drop.title}
          </h1>
          <div className="w-16 h-px bg-charcoal/60 mt-8" />
        </div>
      </section>

      <section className="px-6 md:px-10 py-24 max-w-3xl mx-auto text-center">
        <p className="text-[18px] md:text-[20px] leading-[1.7] text-ink/85">
          {drop.story}
        </p>
      </section>

      {drop.status === "upcoming" && (
        <section className="px-6 md:px-10 py-12 bg-wheat/80">
          <div className="max-w-4xl mx-auto">
            <p className="label-sm text-charcoal/65 mb-5 text-center">
              Releases in
            </p>
            <Countdown to={drop.releaseDate} />
          </div>
        </section>
      )}

      {drop.products.length > 0 && (
        <section className="px-6 md:px-10 py-24 bg-limestone">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <p className="label text-ink">The Pieces</p>
              <p className="label-sm text-charcoal/60">
                {drop.products.length} garments
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 md:gap-x-5 gap-y-12">
              {drop.products.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
