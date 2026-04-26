import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop · Agora" };

export default function Shop() {
  const all = getAllProducts();
  return (
    <section className="px-6 md:px-10 pt-32 pb-32 bg-limestone">
      <div className="max-w-7xl mx-auto">
        <p className="label text-charcoal/65 mb-6">Shop</p>
        <h1 className="wordmark text-3xl md:text-5xl mb-16 text-ink font-light max-w-3xl">
          Every piece, currently available.
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-14">
          {all.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
